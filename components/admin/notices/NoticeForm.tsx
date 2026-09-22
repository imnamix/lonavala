"use client";

import { useState, useEffect, useRef } from "react";
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
  Building,
  Loader2,
  ExternalLink,
  UserCheck,
  ListPlus,
} from "lucide-react";
import "react-quill-new/dist/quill.snow.css";
import {
  NoticeRecord,
  NoticeCategory,
  NoticeWorkflowStatus,
  getNoticeById,
  createNotice,
  updateNotice,
} from "@/lib/services/notice.service";
import { uploadToCloudinary } from "@/lib/services/cloudinary.service";
import { getInlineFileUrl } from "@/lib/utils";

// Dynamic import for ReactQuill to disable SSR
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="h-44 bg-gray-50 rounded-2xl border border-border animate-pulse flex flex-col items-center justify-center gap-2 text-xs text-gray-400">
      <Loader2 className="w-5 h-5 animate-spin text-primary" />
      <span>Loading Rich Text Editor...</span>
    </div>
  ),
});

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ color: [] }, { background: [] }],
    ["blockquote", "link"],
    [{ align: [] }],
    ["clean"],
  ],
};

const DEPARTMENTS = [
  "Chief Officer Secretariat",
  "Revenue & Property Tax",
  "Disaster Management Cell",
  "Health & Sanitation",
  "Public Works (PWD)",
  "Town Planning & Building Permissions",
  "Water Supply & Sewerage",
  "Garden & Tree Authority",
  "Fire & Emergency Services",
  "Council Secretariat & General Admin",
  "Legal Cell & Court Affairs",
  "IT & e-Governance",
];

const CATEGORIES: NoticeCategory[] = [
  "Notices",
  "Circulars",
  "Orders",
  "Gazettes",
  "News",
];

const COMMON_ISSUED_BY = [
  "Chief Officer / Commissioner",
  "Hon. President, LMC",
  "Executive Engineer (Civil), PWD",
  "Chief Revenue Superintendent",
  "Disaster Management Officer",
  "Health & Sanitation Officer",
  "Legal Advisor / Council Secretary",
];

interface NoticeFormProps {
  noticeId?: string;
  isNew?: boolean;
}

export function NoticeForm({ noticeId, isNew = false }: NoticeFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Omit<NoticeRecord, "id">>({
    title: "",
    subject: "",
    category: "Notices",
    department: "Chief Officer Secretariat",
    date: new Date().toISOString().split("T")[0],
    refNo: `LMC/NOT/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`,
    description: "",
    directives: [
      {
        id: "d-1",
        key: "Scope of Application",
        value: "All citizens, commercial establishments, and departments within LMC jurisdiction.",
      },
      {
        id: "d-2",
        key: "Enforcement Date",
        value: "Effective immediately upon publication of this gazette notification.",
      },
    ],
    issuedByName: "Chief Officer / Commissioner",
    issuedByDesignation: "Lonavala Municipal Council",
    fileUrl: "",
    fileName: "",
    fileSize: "",
    status: "Published",
    isNew: true,
  });

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [savedToast, setSavedToast] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load existing notice if editing
  useEffect(() => {
    async function loadNotice() {
      if (!isNew && noticeId) {
        setLoading(true);
        try {
          const existing = await getNoticeById(noticeId);
          if (existing) {
            setFormData({
              title: existing.title || "",
              subject: existing.subject || "",
              category: existing.category || "Notices",
              department: existing.department || "Chief Officer Secretariat",
              date: existing.date || new Date().toISOString().split("T")[0],
              refNo: existing.refNo || "",
              description: existing.description || "",
              directives:
                existing.directives && existing.directives.length > 0
                  ? existing.directives
                  : [
                      {
                        id: `d-${Date.now()}-1`,
                        key: "Compliance Directives",
                        value: "Ensure strict adherence to the municipal directives outlined above.",
                      },
                    ],
              issuedByName: existing.issuedByName || "Chief Officer / Commissioner",
              issuedByDesignation: existing.issuedByDesignation || "Lonavala Municipal Council",
              fileUrl: existing.fileUrl || "",
              fileName: existing.fileName || "",
              fileSize: existing.fileSize || "",
              status: existing.status || "Published",
              isNew: existing.isNew ?? true,
            });
          }
        } catch (err) {
          console.error("Failed to load notice:", err);
        } finally {
          setLoading(false);
        }
      }
    }
    loadNotice();
  }, [noticeId, isNew]);

  // Handle Cloudinary file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingFile(true);
      setUploadSuccess(null);
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.file;
        return copy;
      });

      // Upload to Cloudinary under folder 'lonavala/notices'
      const asset = await uploadToCloudinary(file, "lonavala/notices");
      const targetUrl = asset.secure_url || asset.url;

      // Calculate readable file size
      const formattedSize =
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.round(file.size / 1024)} KB`;

      setFormData((prev) => ({
        ...prev,
        fileUrl: targetUrl,
        fileName: asset.original_filename ? `${asset.original_filename}.${asset.format}` : file.name,
        fileSize: formattedSize,
      }));

      setUploadSuccess(`Document uploaded successfully: ${file.name} (${formattedSize})`);
      setTimeout(() => setUploadSuccess(null), 5000);
    } catch (err: any) {
      console.error("Notice file upload error:", err);
      // Fallback in case Cloudinary server is in offline mock mode
      const formattedSize =
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.round(file.size / 1024)} KB`;

      setFormData((prev) => ({
        ...prev,
        fileName: file.name,
        fileSize: formattedSize,
      }));
      setUploadSuccess(`Attached local file: ${file.name} (${formattedSize})`);
      setTimeout(() => setUploadSuccess(null), 5000);
    } finally {
      setUploadingFile(false);
      if (e.target) e.target.value = "";
    }
  };

  const handleRemoveFile = () => {
    setFormData((prev) => ({
      ...prev,
      fileUrl: "",
      fileName: "",
      fileSize: "",
    }));
    setUploadSuccess(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Directives Key-Value handlers
  const handleAddDirective = () => {
    setFormData((prev) => ({
      ...prev,
      directives: [
        ...prev.directives,
        {
          id: `d-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
          key: "",
          value: "",
        },
      ],
    }));
  };

  const handleDirectiveChange = (index: number, field: "key" | "value", text: string) => {
    setFormData((prev) => {
      const updated = [...prev.directives];
      updated[index] = {
        ...updated[index],
        [field]: text,
      };
      return { ...prev, directives: updated };
    });
  };

  const handleRemoveDirective = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      directives: prev.directives.filter((_, i) => i !== index),
    }));
  };

  // Form Validation
  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Notice Title is required.";
    if (!formData.subject.trim()) newErrors.subject = "Subject line is required.";
    if (!formData.department.trim()) newErrors.department = "Issuing Department is required.";
    if (!formData.date.trim()) newErrors.date = "Published Date is required.";
    if (!formData.issuedByName.trim()) newErrors.issuedByName = "Issued By Order Name is required.";
    if (!formData.description.trim() || formData.description === "<p><br></p>") {
      newErrors.description = "Notice description content is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save / Submit Notice
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      setSaving(true);
      if (isNew) {
        await createNotice(formData);
      } else if (noticeId) {
        await updateNotice(noticeId, formData);
      }

      setSavedToast(true);
      setTimeout(() => {
        router.push("/admin/notices");
      }, 1000);
    } catch (err: any) {
      console.error("Failed to save notice:", err);
      setErrors({ form: err.message || "Failed to save notice record." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center bg-white rounded-3xl border border-border shadow-xs space-y-4 max-w-4xl mx-auto">
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
        <p className="text-sm font-bold text-gray-700">Loading Notice Data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Toast Notification */}
      {savedToast && (
        <div className="fixed top-6 right-6 z-50 bg-primary text-white text-xs font-bold px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-in fade-in duration-300">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span>Notice successfully saved and published! Redirecting to list...</span>
        </div>
      )}

      {/* Top Header & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-border shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/notices"
            className="p-2.5 rounded-xl bg-gray-50 border border-border hover:border-primary text-gray-600 hover:text-primary transition-colors"
            title="Return to Notices list"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-text-primary">
                {isNew ? "Create New Notice" : `Edit Notice: ${formData.refNo || formData.title}`}
              </h1>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-primary-light text-primary uppercase">
                {formData.category}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Fill in the form fields below to publish a municipal notice, circular, or gazette order.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <Link
            href="/admin/notices"
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold transition-colors"
          >
            Cancel
          </Link>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving || uploadingFile}
            className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Notice...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isNew ? "Publish Notice" : "Save Changes"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Error Validation Alert */}
        {Object.keys(errors).length > 0 && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs space-y-1.5 animate-in fade-in">
            <div className="flex items-center gap-2 font-bold">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>Please complete the required fields highlighted below:</span>
            </div>
            <ul className="list-disc list-inside pl-1 text-[11px] space-y-0.5 text-red-600 font-medium">
              {Object.values(errors).map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Upload Notification */}
        {uploadSuccess && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
            <span>{uploadSuccess}</span>
          </div>
        )}

        {/* SECTION 1: Notice Title, Category & Subject */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-border shadow-xs space-y-5">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-3.5">
            <div className="w-8 h-8 rounded-xl bg-primary-light text-primary flex items-center justify-center font-bold text-xs">
              1
            </div>
            <div>
              <h3 className="font-bold text-sm text-text-primary">Notice Information</h3>
              <p className="text-xs text-gray-500">
                Official title, category, reference number, and legal subject matter.
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            {/* Notice Title */}
            <div className="space-y-1.5">
              <label className="font-bold text-gray-700 uppercase tracking-wider flex items-center justify-between">
                <span>Title *</span>
                {errors.title && <span className="text-red-500 text-[10px] font-normal">{errors.title}</span>}
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Notice regarding Property Tax Early Bird Rebate 5% till 30th June 2025"
                className={`w-full px-3.5 py-2.5 bg-primary-surface border rounded-xl font-bold text-gray-800 focus:bg-white focus:outline-hidden transition-colors ${
                  errors.title ? "border-red-400 focus:border-red-500" : "border-border focus:border-primary"
                }`}
              />
            </div>

            {/* Subject Line */}
            <div className="space-y-1.5">
              <label className="font-bold text-gray-700 uppercase tracking-wider flex items-center justify-between">
                <span>Subject *</span>
                {errors.subject && <span className="text-red-500 text-[10px] font-normal">{errors.subject}</span>}
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="e.g. Early Bird 5% Rebate on Full Municipal Property Tax Assessment for FY 2025-26"
                className={`w-full px-3.5 py-2.5 bg-primary-surface border rounded-xl font-semibold text-gray-800 focus:bg-white focus:outline-hidden transition-colors ${
                  errors.subject ? "border-red-400 focus:border-red-500" : "border-border focus:border-primary"
                }`}
              />
            </div>

            {/* Category, Ref No, Status Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
              {/* Category */}
              <div className="space-y-1.5">
                <label className="font-bold text-gray-700 uppercase tracking-wider">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as NoticeCategory })}
                  className="w-full px-3 py-2 bg-primary-surface border border-border rounded-xl font-semibold text-gray-800 focus:bg-white focus:border-primary focus:outline-hidden"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ref No */}
              <div className="space-y-1.5">
                <label className="font-bold text-gray-700 uppercase tracking-wider">
                  Gazette / Ref No.
                </label>
                <input
                  type="text"
                  value={formData.refNo}
                  onChange={(e) => setFormData({ ...formData, refNo: e.target.value })}
                  placeholder="e.g. LMC/TAX/2025/1102"
                  className="w-full px-3 py-2 bg-primary-surface border border-border rounded-xl font-mono font-semibold text-gray-800 focus:bg-white focus:border-primary focus:outline-hidden"
                />
              </div>

              {/* Workflow Status */}
              <div className="space-y-1.5">
                <label className="font-bold text-gray-700 uppercase tracking-wider">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as NoticeWorkflowStatus })}
                  className="w-full px-3 py-2 bg-primary-surface border border-border rounded-xl font-semibold text-gray-800 focus:bg-white focus:border-primary focus:outline-hidden"
                >
                  <option value="Draft">Draft (Internal)</option>
                  <option value="Review">Under Review</option>
                  <option value="Published">Published (Public)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Issuing Dept, Published Date & Issued By Order Name */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-border shadow-xs space-y-5">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-3.5">
            <div className="w-8 h-8 rounded-xl bg-primary-light text-primary flex items-center justify-center font-bold text-xs">
              2
            </div>
            <div>
              <h3 className="font-bold text-sm text-text-primary">Department, Date & Issued By</h3>
              <p className="text-xs text-gray-500">
                Issuing department, official publication date, and order issuing authority.
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Issuing Department */}
              <div className="space-y-1.5">
                <label className="font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-primary" />
                  <span>Issuing Dept: *</span>
                </label>
                <input
                  type="text"
                  list="departments-list"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="Select or enter issuing department..."
                  className={`w-full px-3.5 py-2.5 bg-primary-surface border rounded-xl font-semibold text-gray-800 focus:bg-white focus:outline-hidden transition-colors ${
                    errors.department ? "border-red-400 focus:border-red-500" : "border-border focus:border-primary"
                  }`}
                />
                <datalist id="departments-list">
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept} />
                  ))}
                </datalist>
              </div>

              {/* Published Date */}
              <div className="space-y-1.5">
                <label className="font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  <span>Published Date: *</span>
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className={`w-full px-3.5 py-2.5 bg-primary-surface border rounded-xl font-semibold text-gray-800 focus:bg-white focus:outline-hidden transition-colors ${
                    errors.date ? "border-red-400 focus:border-red-500" : "border-border focus:border-primary"
                  }`}
                />
              </div>

              {/* Issued by order name of it */}
              <div className="space-y-1.5">
                <label className="font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-primary" />
                  <span>Issued By Order Name: *</span>
                </label>
                <input
                  type="text"
                  list="signatories-list"
                  value={formData.issuedByName}
                  onChange={(e) => setFormData({ ...formData, issuedByName: e.target.value })}
                  placeholder="e.g. Chief Officer / Commissioner"
                  className={`w-full px-3.5 py-2.5 bg-primary-surface border rounded-xl font-bold text-gray-800 focus:bg-white focus:outline-hidden transition-colors ${
                    errors.issuedByName ? "border-red-400 focus:border-red-500" : "border-border focus:border-primary"
                  }`}
                />
                <datalist id="signatories-list">
                  {COMMON_ISSUED_BY.map((sig) => (
                    <option key={sig} value={sig} />
                  ))}
                </datalist>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: Rich Text Description using React Quill */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-border shadow-xs space-y-4">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-3.5">
            <div className="w-8 h-8 rounded-xl bg-primary-light text-primary flex items-center justify-center font-bold text-xs">
              3
            </div>
            <div>
              <h3 className="font-bold text-sm text-text-primary">Description (React Quill) *</h3>
              <p className="text-xs text-gray-500">
                Notice content, clauses, terms, and announcements with rich text formatting.
              </p>
            </div>
          </div>

          {errors.description && (
            <p className="text-red-500 text-xs font-semibold">{errors.description}</p>
          )}

          <div className="bg-white rounded-2xl border border-border overflow-hidden focus-within:border-primary transition-colors">
            <ReactQuill
              theme="snow"
              value={formData.description}
              onChange={(val: string) => setFormData({ ...formData, description: val })}
              modules={quillModules}
              placeholder="Write official notification content, clauses, eligibility terms..."
              className="quill-editor"
            />
          </div>
        </div>

        {/* SECTION 4: Important Directives (Key - Value Pairs) with Add Directive Below */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-border shadow-xs space-y-4">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-3.5">
            <div className="w-8 h-8 rounded-xl bg-primary-light text-primary flex items-center justify-center font-bold text-xs">
              4
            </div>
            <div>
              <h3 className="font-bold text-sm text-text-primary">
                Important Directives (Key - Value Pairs)
              </h3>
              <p className="text-xs text-gray-500">
                Structured key-value directives, enforcement terms, deadlines, and penalty clauses.
              </p>
            </div>
          </div>

          {/* Directives List */}
          <div className="space-y-3">
            {formData.directives.length === 0 ? (
              <div className="p-6 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-300 space-y-2">
                <ListPlus className="w-6 h-6 text-gray-400 mx-auto" />
                <p className="text-xs text-gray-500 font-semibold">
                  No directives added yet.
                </p>
              </div>
            ) : (
              formData.directives.map((directive, idx) => (
                <div
                  key={directive.id || idx}
                  className="p-3.5 rounded-2xl bg-primary-surface border border-border flex flex-col sm:flex-row items-start sm:items-center gap-3 transition-all hover:border-primary/50"
                >
                  <div className="w-6 h-6 rounded-lg bg-white border border-border text-primary font-bold text-[11px] flex items-center justify-center shrink-0">
                    {idx + 1}
                  </div>

                  {/* Key Input */}
                  <div className="w-full sm:w-1/3">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                      Key
                    </label>
                    <input
                      type="text"
                      value={directive.key}
                      onChange={(e) => handleDirectiveChange(idx, "key", e.target.value)}
                      placeholder="e.g. Enforcement Date / Penalty"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl font-bold text-gray-800 text-xs focus:border-primary focus:outline-hidden"
                    />
                  </div>

                  {/* Value Input */}
                  <div className="w-full sm:flex-1">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                      Value
                    </label>
                    <input
                      type="text"
                      value={directive.value}
                      onChange={(e) => handleDirectiveChange(idx, "value", e.target.value)}
                      placeholder="e.g. Effective immediately with ₹5,000 fine for non-compliance."
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-800 text-xs font-medium focus:border-primary focus:outline-hidden"
                    />
                  </div>

                  {/* Delete Action */}
                  <button
                    type="button"
                    onClick={() => handleRemoveDirective(idx)}
                    className="self-end sm:self-center p-2 text-gray-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors cursor-pointer shrink-0 mt-2 sm:mt-0"
                    title="Remove directive item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}

            {/* Add Directive Button BELOW the Directives Fields */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleAddDirective}
                className="w-full py-3 rounded-2xl border-2 border-dashed border-primary text-primary hover:bg-primary-light font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add Directive</span>
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 5: Official File / Document Upload */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-border shadow-xs space-y-4">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-3.5">
            <div className="w-8 h-8 rounded-xl bg-primary-light text-primary flex items-center justify-center font-bold text-xs">
              5
            </div>
            <div>
              <h3 className="font-bold text-sm text-text-primary">File Upload</h3>
              <p className="text-xs text-gray-500">
                Upload signed PDF circular, gazette document, or notification attachment.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-primary-surface border border-border space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
              onChange={handleFileUpload}
              className="hidden"
            />

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                type="button"
                disabled={uploadingFile}
                onClick={() => fileInputRef.current?.click()}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white border-2 border-dashed border-primary text-primary hover:bg-primary-light font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 disabled:opacity-60 shadow-2xs"
              >
                {uploadingFile ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span>Uploading File to Cloudinary...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 text-primary" />
                    <span>{formData.fileName ? "Replace Document" : "Upload File"}</span>
                  </>
                )}
              </button>

              <div className="flex-1 w-full space-y-1">
                <p className="text-xs font-bold text-gray-700">Supported Formats: PDF, DOCX, DOC, JPG, PNG</p>
                <p className="text-[11px] text-gray-500">
                  Files are uploaded to Cloudinary CDN and attached to this notice.
                </p>
              </div>
            </div>

            {/* Attached File Card */}
            {formData.fileName && (
              <div className="p-4 rounded-2xl bg-white border border-border flex items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">{formData.fileName}</p>
                    <p className="text-[11px] text-gray-500">{formData.fileSize || "Attachment"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {formData.fileUrl && (
                    <a
                      href={getInlineFileUrl(formData.fileUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                      title="Open attached file in new tab"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Remove file"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-2">
          <Link
            href="/admin/notices"
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold"
          >
            Cancel & Return
          </Link>

          <button
            type="submit"
            disabled={saving || uploadingFile}
            className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isNew ? "Publish Notice" : "Save Changes"}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
