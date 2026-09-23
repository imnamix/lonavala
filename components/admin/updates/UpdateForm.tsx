"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Save,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Upload,
  FileText,
  Trash2,
  Plus,
  Calendar,
  Loader2,
  ExternalLink,
  Download,
  Link2,
  FileCode2,
  Eye,
  Sparkles,
  Pin,
  Tag,
  Clock,
  Image as ImageIcon,
  Check,
  Code2,
  Type,
  PhoneCall,
  AlertTriangle,
  ListOrdered,
  RotateCcw,
} from "lucide-react";
import "react-quill-new/dist/quill.snow.css";
import {
  ImportantUpdateRecord,
  UpdateActionType,
  UpdateAttachment,
  CreateImportantUpdatePayload,
  getImportantUpdateByIdOrSlug,
  createImportantUpdate,
  updateImportantUpdate,
} from "@/lib/services/important-update.service";
import { uploadToCloudinary } from "@/lib/services/cloudinary.service";

// Dynamic import for ReactQuill
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="h-56 bg-slate-50 rounded-2xl border border-slate-200 animate-pulse flex flex-col items-center justify-center gap-2 text-xs text-slate-400">
      <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
      <span className="font-medium">Initializing Rich Text Editor...</span>
    </div>
  ),
});

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
    [{ color: [] }, { background: [] }],
    ["blockquote", "code-block", "link"],
    [{ align: [] }],
    ["clean"],
  ],
};

const TAG_PRESETS = [
  { label: "URGENT", bg: "#EF4444", text: "#FFFFFF" },
  { label: "NEW", bg: "#10B981", text: "#FFFFFF" },
  { label: "ALERT", bg: "#F97316", text: "#FFFFFF" },
  { label: "TENDER", bg: "#F59E0B", text: "#FFFFFF" },
  { label: "EVENT", bg: "#8B5CF6", text: "#FFFFFF" },
  { label: "NOTICE", bg: "#3B82F6", text: "#FFFFFF" },
  { label: "CIRCULAR", bg: "#06B6D4", text: "#FFFFFF" },
  { label: "PRESS RELEASE", bg: "#64748B", text: "#FFFFFF" },
];

const COMMON_INTERNAL_ROUTES = [
  { label: "Public Notices (/notices)", value: "/notices" },
  { label: "E-Tenders (/tenders)", value: "/tenders" },
  { label: "Ongoing Projects (/projects)", value: "/projects" },
  { label: "Court Proceedings & Adalat (/court)", value: "/court" },
  { label: "Tourism & Attractions (/tourism)", value: "/tourism" },
  { label: "Council & Representatives (/council)", value: "/council" },
  { label: "Register Grievance (/grievance/register)", value: "/grievance/register" },
  { label: "Emergency Contacts (/contacts)", value: "/contacts" },
];

interface UpdateFormProps {
  updateId?: string;
  isNew?: boolean;
}

export function UpdateForm({ updateId, isNew = false }: UpdateFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const featuredImageInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const attachmentInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadingFeaturedImage, setUploadingFeaturedImage] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [uploadingAttachment, setUploadingAttachment] = useState(false);

  // Editor mode tab: 'visual' | 'html' | 'preview'
  const [editorMode, setEditorMode] = useState<"visual" | "html" | "preview">("visual");

  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [formData, setFormData] = useState<CreateImportantUpdatePayload>({
    title: "",
    tag: "NEW",
    tagBgColor: "#10B981",
    tagTextColor: "#FFFFFF",
    actionType: "CUSTOM_PAGE",
    fileUrl: "",
    fileName: "",
    fileSize: "",
    fileType: "",
    externalUrl: "",
    openInNewTab: true,
    internalRoute: "/notices",
    slug: "",
    summary: "",
    description: "",
    featuredImage: "",
    attachments: [],
    images: [],
    isActive: true,
    isPinned: false,
    priority: 0,
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    if (!isNew && updateId) {
      loadUpdate();
    }
  }, [updateId, isNew]);

  const loadUpdate = async () => {
    try {
      setLoading(true);
      const data = await getImportantUpdateByIdOrSlug(updateId!);
      setFormData({
        title: data.title || "",
        tag: data.tag || "NEW",
        tagBgColor: data.tagBgColor || "#10B981",
        tagTextColor: data.tagTextColor || "#FFFFFF",
        actionType: data.actionType || "CUSTOM_PAGE",
        fileUrl: data.fileUrl || "",
        fileName: data.fileName || "",
        fileSize: data.fileSize || "",
        fileType: data.fileType || "",
        externalUrl: data.externalUrl || "",
        openInNewTab: data.openInNewTab ?? true,
        internalRoute: data.internalRoute || "",
        slug: data.slug || "",
        summary: data.summary || "",
        description: data.description || "",
        featuredImage: data.featuredImage || "",
        attachments: data.attachments || [],
        images: data.images || [],
        isActive: data.isActive ?? true,
        isPinned: data.isPinned ?? false,
        priority: data.priority || 0,
        startDate: data.startDate ? data.startDate.split("T")[0] : "",
        endDate: data.endDate ? data.endDate.split("T")[0] : "",
      });
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err.message || "Failed to load update details.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApplyPresetTag = (preset: (typeof TAG_PRESETS)[0]) => {
    setFormData((prev) => ({
      ...prev,
      tag: preset.label,
      tagBgColor: preset.bg,
      tagTextColor: preset.text,
    }));
  };

  // Upload main file for DOWNLOAD_FILE action
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingFile(true);
      const asset = await uploadToCloudinary(file, "lonavala/updates/files");
      const ext = file.name.split(".").pop() || "pdf";
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1) + " MB";

      setFormData((prev) => ({
        ...prev,
        fileUrl: asset.secure_url,
        fileName: file.name,
        fileSize: sizeMB,
        fileType: ext.toLowerCase(),
      }));

      setFeedback({
        type: "success",
        message: `File "${file.name}" uploaded successfully!`,
      });
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err.message || "Failed to upload file.",
      });
    } finally {
      setUploadingFile(false);
    }
  };

  // Upload featured image
  const handleFeaturedImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingFeaturedImage(true);
      const asset = await uploadToCloudinary(file, "lonavala/updates/featured");
      setFormData((prev) => ({
        ...prev,
        featuredImage: asset.secure_url,
      }));
      setFeedback({
        type: "success",
        message: "Banner image uploaded successfully!",
      });
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err.message || "Failed to upload banner image.",
      });
    } finally {
      setUploadingFeaturedImage(false);
    }
  };

  // Upload attachment file
  const handleAttachmentUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingAttachment(true);
      const asset = await uploadToCloudinary(file, "lonavala/updates/docs");
      const ext = file.name.split(".").pop() || "pdf";
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1) + " MB";

      const newAttachment: UpdateAttachment = {
        name: file.name,
        url: asset.secure_url,
        type: ext.toLowerCase(),
        size: sizeMB,
      };

      setFormData((prev) => ({
        ...prev,
        attachments: [...(prev.attachments || []), newAttachment],
      }));

      setFeedback({
        type: "success",
        message: `Attachment "${file.name}" added successfully!`,
      });
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err.message || "Failed to upload attachment.",
      });
    } finally {
      setUploadingAttachment(false);
    }
  };

  // Upload gallery image
  const handleGalleryImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingGallery(true);
      const asset = await uploadToCloudinary(file, "lonavala/updates/gallery");
      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), asset.secure_url],
      }));
      setFeedback({
        type: "success",
        message: "Gallery image added!",
      });
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err.message || "Failed to upload gallery image.",
      });
    } finally {
      setUploadingGallery(false);
    }
  };

  const removeAttachment = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      attachments: (prev.attachments || []).filter((_, i) => i !== index),
    }));
  };

  const removeGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index),
    }));
  };

  // Quick template inserters
  const insertTemplateSnippet = (type: "advisory" | "helpline" | "highlights" | "schedule") => {
    let snippet = "";
    if (type === "advisory") {
      snippet = `
        <div style="background:#FEF2F2;border-left:4px solid #EF4444;padding:16px;border-radius:8px;margin:16px 0;">
          <h4 style="color:#991B1B;margin:0 0 8px 0;font-weight:700;">⚠️ Important Citizen Advisory</h4>
          <p style="color:#7F1D1D;margin:0;">Please take note of the mandatory safety instructions issued by the Municipal Council.</p>
        </div>
      `;
    } else if (type === "helpline") {
      snippet = `
        <div style="background:#F0FDF4;border:1px solid #BBF7D0;padding:16px;border-radius:12px;margin:16px 0;">
          <h4 style="color:#166534;margin:0 0 8px 0;font-weight:700;">📞 24x7 Control Room & Helplines</h4>
          <p style="margin:4px 0;color:#14532D;"><strong>Disaster Control Room:</strong> 02114-272222 / 273333</p>
          <p style="margin:4px 0;color:#14532D;"><strong>Fire & Emergency:</strong> 101 / 02114-272101</p>
          <p style="margin:4px 0;color:#14532D;"><strong>Toll-Free Grievance Helpline:</strong> 1800-233-0101</p>
        </div>
      `;
    } else if (type === "highlights") {
      snippet = `
        <div style="background:#F8FAFC;border:1px solid #E2E8F0;padding:16px;border-radius:12px;margin:16px 0;">
          <h4 style="color:#0F172A;margin:0 0 8px 0;font-weight:700;">📌 Key Highlights</h4>
          <ul style="margin:0;padding-left:20px;color:#334155;">
            <li>First critical instruction or point</li>
            <li>Second critical requirement or eligibility criterion</li>
            <li>Third important deadline or procedure step</li>
          </ul>
        </div>
      `;
    } else if (type === "schedule") {
      snippet = `
        <div style="background:#EFF6FF;border:1px solid #BFDBFE;padding:16px;border-radius:12px;margin:16px 0;">
          <h4 style="color:#1E40AF;margin:0 0 8px 0;font-weight:700;">🗓️ Schedule & Venue</h4>
          <p style="margin:4px 0;color:#1E3A8A;"><strong>Date:</strong> DD/MM/YYYY to DD/MM/YYYY</p>
          <p style="margin:4px 0;color:#1E3A8A;"><strong>Timing:</strong> 10:00 AM – 5:00 PM</p>
          <p style="margin:4px 0;color:#1E3A8A;"><strong>Venue:</strong> Lonavala Municipal Council Town Hall</p>
        </div>
      `;
    }

    setFormData((prev) => ({
      ...prev,
      description: (prev.description || "") + snippet,
    }));
  };

  // Metrics for text length
  const contentStats = useMemo(() => {
    const rawText = (formData.description || "").replace(/<[^>]*>/g, " ").trim();
    const words = rawText ? rawText.split(/\s+/).length : 0;
    const chars = rawText.length;
    const readTimeMin = Math.max(1, Math.ceil(words / 200));
    return { words, chars, readTimeMin };
  }, [formData.description]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setFeedback({ type: "error", message: "Title is required." });
      return;
    }

    if (formData.actionType === "DOWNLOAD_FILE" && !formData.fileUrl) {
      setFeedback({
        type: "error",
        message: "Please upload or specify a file URL for download action.",
      });
      return;
    }

    if (formData.actionType === "EXTERNAL_LINK" && !formData.externalUrl) {
      setFeedback({
        type: "error",
        message: "Please specify an external URL.",
      });
      return;
    }

    if (formData.actionType === "INTERNAL_ROUTE" && !formData.internalRoute) {
      setFeedback({
        type: "error",
        message: "Please specify an internal route.",
      });
      return;
    }

    try {
      setSaving(true);
      setFeedback(null);

      if (isNew) {
        await createImportantUpdate(formData);
        setFeedback({
          type: "success",
          message: "Important update created successfully! Redirecting...",
        });
      } else {
        await updateImportantUpdate(updateId!, formData);
        setFeedback({
          type: "success",
          message: "Important update updated successfully! Redirecting...",
        });
      }

      setTimeout(() => {
        router.push("/admin/updates");
      }, 1200);
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err.message || "Failed to save important update.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        <span className="text-sm font-medium text-slate-500">
          Loading update details...
        </span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/updates"
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {isNew ? "Create Important Update" : "Edit Important Update"}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure announcement tags, banner alerts, and on-click actions for citizens.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/updates"
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-sm hover:shadow transition disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isNew ? "Publish Update" : "Save Changes"}</span>
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): Core Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Title & Tag Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Tag className="w-4 h-4 text-emerald-600" />
              <span>Headline & Tag Badge</span>
            </h2>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Update Title / Announcement Text <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="e.g., Heavy Rainfall Alert & Monsoon Helpline Numbers 2026"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition text-slate-800"
              />
            </div>

            {/* Tag Badge Selector */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Tag Badge Presets
              </label>
              <div className="flex flex-wrap gap-2">
                {TAG_PRESETS.map((preset) => {
                  const isSelected =
                    formData.tag === preset.label &&
                    formData.tagBgColor === preset.bg;
                  return (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => handleApplyPresetTag(preset)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 border ${
                        isSelected
                          ? "ring-2 ring-emerald-500 ring-offset-1 border-transparent scale-105"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                      style={{
                        backgroundColor: preset.bg,
                        color: preset.text,
                      }}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                      <span>{preset.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Custom Tag Label & Color Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    Custom Tag Text
                  </label>
                  <input
                    type="text"
                    value={formData.tag || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        tag: e.target.value.toUpperCase(),
                      }))
                    }
                    placeholder="e.g., REBATE"
                    className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    Badge Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.tagBgColor || "#10B981"}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          tagBgColor: e.target.value,
                        }))
                      }
                      className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200 p-0.5"
                    />
                    <input
                      type="text"
                      value={formData.tagBgColor || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          tagBgColor: e.target.value,
                        }))
                      }
                      placeholder="#10B981"
                      className="w-full px-2.5 py-1.5 text-xs font-mono rounded-lg border border-slate-200"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    Live Badge Preview
                  </label>
                  <div className="h-9 flex items-center">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm"
                      style={{
                        backgroundColor: formData.tagBgColor || "#10B981",
                        color: formData.tagTextColor || "#FFFFFF",
                      }}
                    >
                      {formData.tag || "TAG"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Action Selector (On-Click Behavior) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
            <div>
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>On-Click Action (Admin Decision)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Choose what happens when a citizen clicks this update tag on the homepage.
              </p>
            </div>

            {/* Visual Action Type Selector Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  id: "CUSTOM_PAGE" as UpdateActionType,
                  title: "Open Dedicated Page",
                  desc: "Opens full rich detail article with HTML, photos & PDF attachments",
                  icon: FileCode2,
                  color: "emerald",
                },
                {
                  id: "DOWNLOAD_FILE" as UpdateActionType,
                  title: "Direct File Download",
                  desc: "Instantly downloads or opens a PDF/document file in viewer",
                  icon: Download,
                  color: "blue",
                },
                {
                  id: "EXTERNAL_LINK" as UpdateActionType,
                  title: "External Portal Link",
                  desc: "Redirects citizen to external government or departmental website",
                  icon: ExternalLink,
                  color: "purple",
                },
                {
                  id: "INTERNAL_ROUTE" as UpdateActionType,
                  title: "Internal Portal Page",
                  desc: "Navigates to an existing page like Notices, Tenders, or Projects",
                  icon: Link2,
                  color: "amber",
                },
              ].map((item) => {
                const isSelected = formData.actionType === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, actionType: item.id }))
                    }
                    className={`p-4 rounded-xl text-left border transition relative flex items-start gap-3 ${
                      isSelected
                        ? "border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20"
                        : "border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        isSelected
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">
                        {item.title}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                        {item.desc}
                      </div>
                    </div>
                    {isSelected && (
                      <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-emerald-600 ring-4 ring-emerald-100" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Action-Specific Dynamic Subforms */}

            {/* ACTION 1: DOWNLOAD_FILE */}
            {formData.actionType === "DOWNLOAD_FILE" && (
              <div className="p-5 rounded-xl bg-blue-50/50 border border-blue-200 space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-blue-900">
                  <Download className="w-4 h-4 text-blue-700" />
                  <span>Downloadable File Configuration</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Upload PDF / Document File <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.zip"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingFile}
                        className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold bg-white border border-slate-300 rounded-xl hover:bg-slate-50 text-slate-800 transition disabled:opacity-50"
                      >
                        {uploadingFile ? (
                          <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                        ) : (
                          <Upload className="w-4 h-4 text-blue-600" />
                        )}
                        <span>
                          {uploadingFile ? "Uploading File..." : "Choose File to Upload"}
                        </span>
                      </button>
                      <span className="text-xs text-slate-500">
                        PDF, Word, or Excel up to 25MB
                      </span>
                    </div>
                  </div>

                  {formData.fileUrl && (
                    <div className="p-3 bg-white rounded-xl border border-blue-200 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <div className="truncate">
                          <div className="text-xs font-bold text-slate-800 truncate">
                            {formData.fileName || "Uploaded File"}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {formData.fileSize || "File ready"} •{" "}
                            {(formData.fileType || "pdf").toUpperCase()}
                          </div>
                        </div>
                      </div>
                      <a
                        href={formData.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="View File"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Direct File URL (or paste URL)
                    </label>
                    <input
                      type="url"
                      value={formData.fileUrl || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          fileUrl: e.target.value,
                        }))
                      }
                      placeholder="https://cdn.lonavalamc.gov.in/docs/notice.pdf"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ACTION 2: EXTERNAL_LINK */}
            {formData.actionType === "EXTERNAL_LINK" && (
              <div className="p-5 rounded-xl bg-purple-50/50 border border-purple-200 space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-purple-900">
                  <ExternalLink className="w-4 h-4 text-purple-700" />
                  <span>External Redirection Target</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    External Target URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.externalUrl || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        externalUrl: e.target.value,
                      }))
                    }
                    placeholder="https://aaplesarkar.mahaonline.gov.in"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="openInNewTab"
                    checked={formData.openInNewTab ?? true}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        openInNewTab: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-slate-300"
                  />
                  <label
                    htmlFor="openInNewTab"
                    className="text-xs font-medium text-slate-700 cursor-pointer"
                  >
                    Open external website in a new browser tab (Recommended)
                  </label>
                </div>
              </div>
            )}

            {/* ACTION 3: INTERNAL_ROUTE */}
            {formData.actionType === "INTERNAL_ROUTE" && (
              <div className="p-5 rounded-xl bg-amber-50/50 border border-amber-200 space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-amber-900">
                  <Link2 className="w-4 h-4 text-amber-700" />
                  <span>Portal Navigation Route</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Select Common Municipal Page
                  </label>
                  <select
                    value={formData.internalRoute || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        internalRoute: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="">-- Choose or enter custom route below --</option>
                    {COMMON_INTERNAL_ROUTES.map((route) => (
                      <option key={route.value} value={route.value}>
                        {route.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Route Path <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.internalRoute || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        internalRoute: e.target.value,
                      }))
                    }
                    placeholder="/notices or /projects/1"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
            )}

            {/* ACTION 4: CUSTOM_PAGE (Detailed Page Builder) */}
            {formData.actionType === "CUSTOM_PAGE" && (
              <div className="space-y-6 pt-2">
                {/* URL Slug */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    URL Slug (Page Route)
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-mono">
                      /updates/
                    </span>
                    <input
                      type="text"
                      value={formData.slug || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          slug: e.target.value,
                        }))
                      }
                      placeholder="auto-generated-from-title"
                      className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Leave blank to automatically generate from title.
                  </span>
                </div>

                {/* Summary / Excerpt */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                    Brief Summary / Excerpt
                  </label>
                  <textarea
                    rows={2}
                    value={formData.summary || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        summary: e.target.value,
                      }))
                    }
                    placeholder="Short 1-2 sentence overview shown in previews and search..."
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                  />
                </div>

                {/* Banner / Hero Image */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                    Featured Banner Image
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        ref={featuredImageInputRef}
                        onChange={handleFeaturedImageUpload}
                        className="hidden"
                        accept="image/*"
                      />
                      <button
                        type="button"
                        onClick={() => featuredImageInputRef.current?.click()}
                        disabled={uploadingFeaturedImage}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-xl hover:bg-slate-50 text-slate-800 transition disabled:opacity-50"
                      >
                        {uploadingFeaturedImage ? (
                          <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                        ) : (
                          <ImageIcon className="w-4 h-4 text-emerald-600" />
                        )}
                        <span>
                          {uploadingFeaturedImage
                            ? "Uploading Banner..."
                            : "Upload Banner Image"}
                        </span>
                      </button>
                    </div>

                    {formData.featuredImage && (
                      <div className="relative rounded-xl overflow-hidden border border-slate-200 h-40 max-w-md bg-slate-100 group">
                        <img
                          src={formData.featuredImage}
                          alt="Banner Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              featuredImage: "",
                            }))
                          }
                          className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg opacity-90 hover:opacity-100 shadow transition"
                          title="Remove Image"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* UPGRADED: Detailed Article Content (HTML / Rich Text) UI */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  {/* Header with Mode Toggles */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
                        <FileCode2 className="w-4 h-4" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                          Detailed Article Content (HTML / Rich Text)
                        </label>
                        <p className="text-[11px] text-slate-500">
                          Format text, add headers, quotes, lists, or custom HTML snippets.
                        </p>
                      </div>
                    </div>

                    {/* Editor Mode Tabs */}
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={() => setEditorMode("visual")}
                        className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition ${
                          editorMode === "visual"
                            ? "bg-white text-emerald-800 shadow-xs"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        <Type className="w-3.5 h-3.5" />
                        <span>Visual Editor</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditorMode("html")}
                        className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition ${
                          editorMode === "html"
                            ? "bg-white text-emerald-800 shadow-xs"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        <Code2 className="w-3.5 h-3.5" />
                        <span>HTML Source</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditorMode("preview")}
                        className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition ${
                          editorMode === "preview"
                            ? "bg-white text-emerald-800 shadow-xs"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Live Preview</span>
                      </button>
                    </div>
                  </div>

                  {/* Quick Preset Snippet Inserters */}
                  <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1">
                      Quick Insert:
                    </span>
                    <button
                      type="button"
                      onClick={() => insertTemplateSnippet("highlights")}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg shadow-2xs transition"
                    >
                      <ListOrdered className="w-3 h-3 text-slate-500" />
                      <span>Key Highlights</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => insertTemplateSnippet("advisory")}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold bg-white hover:bg-red-50 text-red-700 border border-red-200 rounded-lg shadow-2xs transition"
                    >
                      <AlertTriangle className="w-3 h-3 text-red-600" />
                      <span>Advisory Alert</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => insertTemplateSnippet("helpline")}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg shadow-2xs transition"
                    >
                      <PhoneCall className="w-3 h-3 text-emerald-600" />
                      <span>Helpline Box</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => insertTemplateSnippet("schedule")}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 rounded-lg shadow-2xs transition"
                    >
                      <Calendar className="w-3 h-3 text-blue-600" />
                      <span>Schedule & Venue</span>
                    </button>
                  </div>

                  {/* Editor Body based on active mode */}
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs focus-within:border-emerald-500 transition-colors">
                    {/* Visual Quill Mode */}
                    {editorMode === "visual" && (
                      <div className="quill-editor bg-white">
                        <ReactQuill
                          theme="snow"
                          value={formData.description || ""}
                          onChange={(content) =>
                            setFormData((prev) => ({
                              ...prev,
                              description: content,
                            }))
                          }
                          modules={quillModules}
                          placeholder="Write full advisory guidelines, procedures, instructions, or article content here..."
                          className="min-h-[260px]"
                        />
                      </div>
                    )}

                    {/* HTML Code Mode */}
                    {editorMode === "html" && (
                      <div className="p-3 bg-slate-900 text-slate-100">
                        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[11px] text-slate-400">
                          <span className="font-mono">HTML Source Code Editor</span>
                          <span>Changes update the visual editor automatically</span>
                        </div>
                        <textarea
                          rows={12}
                          value={formData.description || ""}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          placeholder="<p>Write or paste raw HTML markup...</p>"
                          className="w-full bg-slate-950 font-mono text-xs text-emerald-400 p-3 rounded-xl border border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed resize-y"
                        />
                      </div>
                    )}

                    {/* Live Preview Mode */}
                    {editorMode === "preview" && (
                      <div className="p-6 bg-slate-50 min-h-[260px]">
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                              <Eye className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Live Citizen Portal Preview</span>
                            </span>
                            <span className="text-[11px] text-slate-400">
                              Rendered with portal styling
                            </span>
                          </div>

                          {formData.description ? (
                            <div className="rich-text-content notice-rich-content text-slate-800">
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: formData.description,
                                }}
                              />
                            </div>
                          ) : (
                            <div className="py-8 text-center text-xs text-slate-400">
                              No content written yet. Switch back to "Visual Editor" to start typing.
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Footer Stats Bar */}
                    <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                      <div className="flex items-center gap-4">
                        <span>
                          <strong className="text-slate-700 font-semibold">{contentStats.words}</strong> words
                        </span>
                        <span>
                          <strong className="text-slate-700 font-semibold">{contentStats.chars}</strong> characters
                        </span>
                        <span>
                          ~<strong className="text-slate-700 font-semibold">{contentStats.readTimeMin}</strong> min read
                        </span>
                      </div>

                      {formData.description && (
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm("Are you sure you want to clear the article content?")) {
                              setFormData((prev) => ({ ...prev, description: "" }));
                            }
                          }}
                          className="text-slate-400 hover:text-red-600 transition flex items-center gap-1 text-[11px]"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Clear Content</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Downloadable Documents / Attachments List */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                        Page Attachments (PDFs & Documents)
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Citizens can download these documents directly from this update page.
                      </p>
                    </div>
                    <div>
                      <input
                        type="file"
                        ref={attachmentInputRef}
                        onChange={handleAttachmentUpload}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.zip"
                      />
                      <button
                        type="button"
                        onClick={() => attachmentInputRef.current?.click()}
                        disabled={uploadingAttachment}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition"
                      >
                        {uploadingAttachment ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Plus className="w-3.5 h-3.5" />
                        )}
                        <span>Add Document</span>
                      </button>
                    </div>
                  </div>

                  {formData.attachments && formData.attachments.length > 0 ? (
                    <div className="space-y-2">
                      {formData.attachments.map((att, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            <FileText className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                            <div className="truncate">
                              <div className="text-xs font-bold text-slate-800 truncate">
                                {att.name}
                              </div>
                              <div className="text-[11px] text-slate-400">
                                {att.size || "File"} • {(att.type || "pdf").toUpperCase()}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <a
                              href={att.url}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 text-slate-500 hover:text-emerald-700 rounded-lg hover:bg-slate-200 transition"
                              title="Preview"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                            <button
                              type="button"
                              onClick={() => removeAttachment(idx)}
                              className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                      No documents attached yet. Click "Add Document" to upload PDFs or files.
                    </div>
                  )}
                </div>

                {/* Additional Images Gallery */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                        Additional Photo Gallery
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Add supplementary photos to display on the update page.
                      </p>
                    </div>
                    <div>
                      <input
                        type="file"
                        ref={galleryInputRef}
                        onChange={handleGalleryImageUpload}
                        className="hidden"
                        accept="image/*"
                      />
                      <button
                        type="button"
                        onClick={() => galleryInputRef.current?.click()}
                        disabled={uploadingGallery}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition"
                      >
                        {uploadingGallery ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Plus className="w-3.5 h-3.5" />
                        )}
                        <span>Add Photo</span>
                      </button>
                    </div>
                  </div>

                  {formData.images && formData.images.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {formData.images.map((imgUrl, idx) => (
                        <div
                          key={idx}
                          className="relative group rounded-xl overflow-hidden border border-slate-200 h-24 bg-slate-100"
                        >
                          <img
                            src={imgUrl}
                            alt={`Gallery ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(idx)}
                            className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-md opacity-80 hover:opacity-100 shadow transition"
                            title="Remove"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                      No additional photos added.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 Col): Visibility, Scheduling & Actions */}
        <div className="space-y-6">
          {/* Publication Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-3">
              Status & Priority
            </h3>

            {/* Active Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-slate-800">
                  Active Status
                </label>
                <p className="text-[11px] text-slate-500">
                  Visible to public on homepage
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, isActive: !prev.isActive }))
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.isActive ? "bg-emerald-600" : "bg-slate-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.isActive ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Pinned Toggle */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div>
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Pin className="w-3.5 h-3.5 text-amber-600" />
                  <span>Pin to Top</span>
                </label>
                <p className="text-[11px] text-slate-500">
                  Sticky at the front of the updates list
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, isPinned: !prev.isPinned }))
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.isPinned ? "bg-amber-600" : "bg-slate-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.isPinned ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Priority input */}
            <div className="pt-3 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Display Order Priority
              </label>
              <input
                type="number"
                value={formData.priority || 0}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    priority: parseInt(e.target.value, 10) || 0,
                  }))
                }
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200"
                placeholder="0"
              />
              <span className="text-[11px] text-slate-400">
                Higher numbers appear first (e.g. 100 before 10).
              </span>
            </div>
          </div>

          {/* Scheduling Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Schedule & Expiry (Optional)</span>
            </h3>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Expiry Date
              </label>
              <input
                type="date"
                value={formData.endDate || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, endDate: e.target.value }))
                }
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white"
              />
              <span className="text-[11px] text-slate-400">
                Automatically hides update after this date.
              </span>
            </div>
          </div>

          {/* Quick Info Box */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-900 space-y-2">
            <div className="font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>How Citizen Clicks Work</span>
            </div>
            <p className="text-emerald-800 leading-relaxed">
              When citizens click the tag on the portal:
            </p>
            <ul className="list-disc list-inside space-y-1 text-emerald-800">
              <li><strong>Download:</strong> PDF opens or saves.</li>
              <li><strong>External:</strong> Redirects to Govt portal.</li>
              <li><strong>Internal:</strong> Goes to page (Notices, Tenders).</li>
              <li><strong>Custom Page:</strong> Opens full article page with documents.</li>
            </ul>
          </div>
        </div>
      </div>
    </form>
  );
}
