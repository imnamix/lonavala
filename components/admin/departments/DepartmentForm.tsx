"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Save,
  ArrowLeft,
  CheckCircle2,
  Building2,
  User,
  Phone,
  Mail,
  Plus,
  Trash2,
  AlertCircle,
  Sparkles,
  HeartPulse,
  Droplets,
  HardHat,
  Receipt,
  ShieldAlert,
  Flame,
  Cpu,
  Layers,
  UserCheck,
  Upload,
  Camera,
  Loader2,
  X,
  FileText,
  ExternalLink,
  BarChart3,
} from "lucide-react";
import { Department } from "@/types";
import {
  getDepartmentById,
  createDepartment,
  updateDepartment,
} from "@/lib/services/department.service";
import { uploadToCloudinary } from "@/lib/services/cloudinary.service";
import { getInlineFileUrl } from "@/lib/utils";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="h-40 bg-gray-50 rounded-2xl border border-border animate-pulse flex flex-col items-center justify-center gap-2 text-xs text-gray-400">
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

const AVAILABLE_ICONS = [
  { label: "Building / Admin", key: "Building2", icon: Building2 },
  { label: "Health & Medical", key: "HeartPulse", icon: HeartPulse },
  { label: "Water & Drainage", key: "Droplets", icon: Droplets },
  { label: "Public Works (PWD)", key: "HardHat", icon: HardHat },
  { label: "Tax & Finance", key: "Receipt", icon: Receipt },
  { label: "Disaster & Safety", key: "ShieldAlert", icon: ShieldAlert },
  { label: "Fire & Emergency", key: "Flame", icon: Flame },
  { label: "IT & E-Governance", key: "Cpu", icon: Cpu },
  { label: "General & Planning", key: "Layers", icon: Layers },
];

interface DepartmentFormProps {
  deptId?: string;
  isNew?: boolean;
}

export function DepartmentForm({ deptId, isNew = false }: DepartmentFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const docFileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Department>({
    id: isNew ? `dept-${Date.now()}` : "",
    name: "",
    marathiName: "",
    slug: "",
    icon: "Building2",
    headOfficer: "",
    headOfficerImage: "",
    designation: "",
    email: "",
    phone: "",
    location: "LMC Administrative Complex, Lonavala - 410401",
    overview: "",
    responsibilities: [""],
    services: [{ title: "", link: "" }],
    documents: [],
    stats: [],
    additionalInfo: [],
    clerkName: "",
    clerkPhone: "",
    clerkMobile: "",
    clerkEmail: "",
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [uploadingRowIndex, setUploadingRowIndex] = useState<number | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [docUploadSuccess, setDocUploadSuccess] = useState<string | null>(null);
  const [savedToast, setSavedToast] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadData() {
      if (!isNew && deptId) {
        setLoading(true);
        try {
          const existing = await getDepartmentById(deptId);
          if (existing) {
            setFormData({
              ...existing,
              responsibilities:
                existing.responsibilities?.length > 0 ? existing.responsibilities : [""],
              services:
                existing.services?.length > 0
                  ? existing.services.map((s: any) =>
                    typeof s === "string"
                      ? { title: s, link: "" }
                      : { title: s?.title || "", link: s?.link || "" }
                  )
                  : [{ title: "", link: "" }],
              documents: Array.isArray(existing.documents)
                ? existing.documents
                  .filter(
                    (d: any) =>
                      d &&
                      ((typeof d.fileUrl === "string" && d.fileUrl.trim().length > 0) ||
                        (typeof d.url === "string" && d.url.trim().length > 0) ||
                        (typeof d.title === "string" && d.title.trim().length > 0))
                  )
                  .map((d: any) => ({
                    title: d.title || "",
                    fileUrl: d.fileUrl || d.url || "",
                    url: d.fileUrl || d.url || "",
                    fileName: d.fileName || "",
                    size: d.size || "",
                    type: d.type || "PDF",
                  }))
                : [],
              stats: Array.isArray(existing.stats) ? existing.stats : [],
              additionalInfo: Array.isArray(existing.additionalInfo) ? existing.additionalInfo : [],
              headOfficerImage: existing.headOfficerImage || "",
              clerkName: existing.clerkName || "",
              clerkPhone: existing.clerkPhone || existing.clerkMobile || "",
              clerkMobile: existing.clerkPhone || existing.clerkMobile || "",
              clerkEmail: existing.clerkEmail || "",
            });
          }
        } catch (err) {
          console.error("Failed to load department:", err);
        } finally {
          setLoading(false);
        }
      }
    }
    loadData();
  }, [deptId, isNew]);

  const handleNameChange = (nameVal: string) => {
    setFormData((prev) => {
      const newSlug = isNew || !prev.slug
        ? nameVal
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "")
        : prev.slug;
      return { ...prev, name: nameVal, slug: newSlug };
    });
  };

  // Profile Image Cloudinary Upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        headOfficerImage: "Please select a valid image file (JPG, PNG, WebP).",
      }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        headOfficerImage: "Image size exceeds 5MB limit.",
      }));
      return;
    }

    try {
      setUploadingPhoto(true);
      setUploadSuccess(null);
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.headOfficerImage;
        return copy;
      });

      const asset = await uploadToCloudinary(file, "lonavala/departments");
      const targetUrl = asset.secure_url || asset.url;

      setFormData((prev) => ({
        ...prev,
        headOfficerImage: targetUrl,
      }));

      setUploadSuccess("Profile photo successfully uploaded!");
      setTimeout(() => setUploadSuccess(null), 4000);
    } catch (err: any) {
      console.error("Photo upload error:", err);
      setErrors((prev) => ({
        ...prev,
        headOfficerImage: err.message || "Failed to upload photo to Cloudinary.",
      }));
    } finally {
      setUploadingPhoto(false);
      if (e.target) e.target.value = "";
    }
  };

  const handleRemovePhoto = () => {
    setFormData((prev) => ({ ...prev, headOfficerImage: "" }));
    setUploadSuccess(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Multiple Document Upload Handler (Add More Files)
  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploadingDoc(true);
      setDocUploadSuccess(null);

      const newDocs: { title: string; fileUrl: string; url?: string }[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const cleanTitle = file.name
          .replace(/\.[^/.]+$/, "")
          .replace(/[-_]/g, " ")
          .trim();

        try {
          const uploaded = await uploadToCloudinary(file, "lonavala/departments/documents");
          const targetUrl = uploaded.secure_url || uploaded.url;

          newDocs.push({
            title: cleanTitle || `Document ${(formData.documents?.length || 0) + i + 1}`,
            fileUrl: targetUrl,
            url: targetUrl,
          });
        } catch (uploadErr: any) {
          console.error(`Failed to upload ${file.name}:`, uploadErr);
          alert(`Failed to upload ${file.name}: ${uploadErr.message || "Network error"}`);
        }
      }

      if (newDocs.length > 0) {
        setFormData((prev) => ({
          ...prev,
          documents: [...(prev.documents || []), ...newDocs],
        }));
        setDocUploadSuccess(`Uploaded ${newDocs.length} document(s)!`);
        setTimeout(() => setDocUploadSuccess(null), 4000);
      }
    } catch (err: any) {
      console.error("Document upload error:", err);
      alert(`Error uploading documents: ${err.message || "Network error"}`);
    } finally {
      setUploadingDoc(false);
      if (e.target) e.target.value = "";
    }
  };

  // Replace / Upload single document row file
  const handleRowFileUpload = async (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingRowIndex(index);
      const cleanTitle = file.name
        .replace(/\.[^/.]+$/, "")
        .replace(/[-_]/g, " ")
        .trim();

      const uploaded = await uploadToCloudinary(file, "lonavala/departments/documents");
      const targetUrl = uploaded.secure_url || uploaded.url;

      setFormData((prev) => {
        const copy = [...(prev.documents || [])];
        if (copy[index]) {
          copy[index] = {
            ...copy[index],
            title: cleanTitle || copy[index].title || `Document ${index + 1}`,
            fileUrl: targetUrl,
            url: targetUrl,
          };
        }
        return { ...prev, documents: copy };
      });
    } catch (err: any) {
      console.error("Row file upload error:", err);
      alert(`Failed to upload file: ${err.message || "Network error"}`);
    } finally {
      setUploadingRowIndex(null);
      if (e.target) e.target.value = "";
    }
  };

  const handleUpdateDocument = (
    index: number,
    field: "title" | "fileUrl",
    value: string
  ) => {
    setFormData((prev) => {
      const copy = [...(prev.documents || [])];
      if (copy[index]) {
        copy[index] = {
          ...copy[index],
          [field]: value,
          url: field === "fileUrl" ? value : copy[index].url,
        };
      }
      return { ...prev, documents: copy };
    });
  };

  const handleRemoveDocument = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      documents: (prev.documents || []).filter((_, i) => i !== index),
    }));
  };

  // Department Stats handlers
  const handleAddStat = () => {
    setFormData((prev) => ({
      ...prev,
      stats: [...(prev.stats || []), { label: "", value: "" }],
    }));
  };

  const handleUpdateStat = (index: number, field: "label" | "value", value: string) => {
    setFormData((prev) => {
      const copy = [...(prev.stats || [])];
      if (copy[index]) {
        copy[index] = { ...copy[index], [field]: value };
      }
      return { ...prev, stats: copy };
    });
  };

  const handleRemoveStat = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      stats: (prev.stats || []).filter((_, i) => i !== index),
    }));
  };

  // Responsibilities handlers
  const handleAddResponsibility = () => {
    setFormData((prev) => ({
      ...prev,
      responsibilities: [...prev.responsibilities, ""],
    }));
  };

  const handleUpdateResponsibility = (index: number, val: string) => {
    setFormData((prev) => {
      const copy = [...prev.responsibilities];
      copy[index] = val;
      return { ...prev, responsibilities: copy };
    });
  };

  const handleRemoveResponsibility = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      responsibilities: prev.responsibilities.filter((_, i) => i !== index),
    }));
  };

  // Services handlers
  const handleAddService = () => {
    setFormData((prev) => ({
      ...prev,
      services: [...(prev.services || []), { title: "", link: "" }],
    }));
  };

  const handleUpdateService = (
    index: number,
    field: "title" | "link",
    val: string
  ) => {
    setFormData((prev) => {
      const copy = [...(prev.services || [])];
      const cur =
        typeof copy[index] === "string"
          ? { title: copy[index] as string, link: "" }
          : { ...copy[index] };
      copy[index] = { ...cur, [field]: val };
      return { ...prev, services: copy };
    });
  };

  const handleRemoveService = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      services: (prev.services || []).filter((_, i) => i !== index),
    }));
  };

  // Additional Info handlers
  const handleAddAdditionalInfo = () => {
    setFormData((prev) => ({
      ...prev,
      additionalInfo: [...(prev.additionalInfo || []), { title: "", description: "" }],
    }));
  };

  const handleUpdateAdditionalInfo = (
    index: number,
    field: "title" | "description",
    value: string
  ) => {
    setFormData((prev) => {
      const copy = [...(prev.additionalInfo || [])];
      if (copy[index]) {
        copy[index] = { ...copy[index], [field]: value };
      }
      return { ...prev, additionalInfo: copy };
    });
  };

  const handleRemoveAdditionalInfo = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      additionalInfo: (prev.additionalInfo || []).filter((_, i) => i !== index),
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Department name is required.";
    if (!formData.marathiName.trim()) newErrors.marathiName = "Marathi name is required.";
    if (!formData.slug.trim()) newErrors.slug = "URL slug identifier is required.";
    if (!formData.headOfficer.trim()) newErrors.headOfficer = "Head officer name is required.";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const payload = {
      ...formData,
      headOfficerImage: formData.headOfficerImage || "",
      clerkPhone: formData.clerkPhone || formData.clerkMobile || "",
      clerkMobile: formData.clerkPhone || formData.clerkMobile || "",
      responsibilities: formData.responsibilities.filter((r) => r.trim().length > 0),
      services: (formData.services || [])
        .map((s: any) =>
          typeof s === "string"
            ? { title: s.trim(), link: "" }
            : { title: s?.title?.trim() || "", link: s?.link?.trim() || "" }
        )
        .filter((s) => s.title.length > 0),
      documents: (formData.documents || [])
        .filter((d) => (d.title && d.title.trim().length > 0) || (d.fileUrl && d.fileUrl.trim().length > 0) || (d.url && d.url.trim().length > 0))
        .map((d) => ({
          title: d.title?.trim() || "Document",
          fileUrl: d.fileUrl || d.url || "",
          url: d.fileUrl || d.url || "",
        })),
      stats: (formData.stats || []).filter((s) => s.label.trim().length > 0 && s.value.trim().length > 0),
      additionalInfo: (formData.additionalInfo || [])
        .filter((a) => (a.title && a.title.trim().length > 0) || (a.description && a.description.trim().length > 0))
        .map((a) => ({
          title: a.title.trim(),
          description: a.description || "",
        })),
    };

    setLoading(true);
    try {
      if (isNew || !deptId) {
        await createDepartment(payload);
      } else {
        const targetId = formData.id || deptId;
        await updateDepartment(targetId, payload);
      }
      setSavedToast(true);
      setTimeout(() => {
        router.push("/admin/departments");
      }, 1200);
    } catch (err) {
      console.error("Error saving department:", err);
      alert("Error saving department. Please check details and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Toast */}
      {savedToast && (
        <div className="fixed top-6 right-6 z-50 bg-primary text-white text-xs font-bold px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span>Department successfully saved! Redirecting...</span>
        </div>
      )}

      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/departments"
            className="p-2 rounded-xl bg-white border border-gray-200 hover:border-primary text-gray-600 hover:text-primary transition-colors"
            title="Back to Departments list"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-text-primary">
              {isNew ? "Add New Department" : `Edit Department: ${formData.name || "Loading..."}`}
            </h1>
            <p className="text-xs text-gray-500">
              {isNew
                ? "Configure a new municipal department, designated head officer with photo, clerk, and public documents."
                : "Update official leadership, profile image, clerk coordinates, by-laws, and public services."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Link
            href="/admin/departments"
            className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold transition-colors"
          >
            Cancel
          </Link>

          <button
            type="button"
            disabled={loading}
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? "Saving..." : "Save Department"}</span>
          </button>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Validation alert banner */}
        {Object.keys(errors).length > 0 && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs space-y-1">
            <div className="flex items-center gap-2 font-bold">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span>Please correct the required fields highlighted below:</span>
            </div>
            <ul className="list-disc list-inside pl-1 text-[11px] space-y-0.5 text-red-600">
              {Object.values(errors).map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Section 1: Department Basic Information */}
        <div className="bg-white p-6 rounded-3xl border border-border shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Building2 className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-sm text-text-primary">Department Identity</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name (English) */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
                <span>Department Name (English) *</span>
                {errors.name && <span className="text-red-500 font-normal text-[10px]">{errors.name}</span>}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Health & Sanitation"
                className={`w-full px-3.5 py-2.5 bg-primary-surface border rounded-xl text-xs font-semibold text-gray-800 focus:bg-white focus:outline-hidden transition-all ${errors.name ? "border-red-400 focus:border-red-500" : "border-border focus:border-primary"
                  }`}
              />
            </div>

            {/* Name (Marathi) */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
                <span>Department Name (Marathi देवनागरी) *</span>
                {errors.marathiName && <span className="text-red-500 font-normal text-[10px]">{errors.marathiName}</span>}
              </label>
              <input
                type="text"
                value={formData.marathiName}
                onChange={(e) => setFormData({ ...formData, marathiName: e.target.value })}
                placeholder="e.g. आरोग्य व स्वच्छता विभाग"
                className={`w-full px-3.5 py-2.5 bg-primary-surface border rounded-xl text-xs font-semibold text-gray-800 focus:bg-white focus:outline-hidden transition-all ${errors.marathiName ? "border-red-400 focus:border-red-500" : "border-border focus:border-primary"
                  }`}
              />
            </div>

            {/* Slug */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
                <span>URL Slug Identifier *</span>
                {errors.slug && <span className="text-red-500 font-normal text-[10px]">{errors.slug}</span>}
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="e.g. health-sanitation"
                className={`w-full px-3.5 py-2.5 bg-primary-surface border rounded-xl text-xs font-semibold text-gray-800 focus:bg-white focus:outline-hidden transition-all ${errors.slug ? "border-red-400 focus:border-red-500" : "border-border focus:border-primary"
                  }`}
              />
            </div>

            {/* Icon Selection */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Department Icon Symbol</label>
              <select
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-primary-surface border border-border rounded-xl text-xs font-semibold text-gray-800 focus:bg-white focus:border-primary focus:outline-hidden"
              >
                {AVAILABLE_ICONS.map((i) => (
                  <option key={i.key} value={i.key}>
                    {i.label} ({i.key})
                  </option>
                ))}
              </select>
            </div>

            {/* Overview Description */}
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-bold text-gray-700">Departmental Scope & Overview</label>
              <textarea
                rows={3}
                value={formData.overview}
                onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                placeholder="Describe the department's mandate, public cleanliness, or infrastructure role..."
                className="w-full px-3.5 py-2.5 bg-primary-surface border border-border rounded-xl text-xs font-semibold text-gray-800 focus:bg-white focus:border-primary focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Head of Department (HOD) Leadership Coordinates & Photo */}
        <div className="bg-white p-6 rounded-3xl border border-border shadow-xs space-y-5">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <User className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-sm text-text-primary">Department Head (HOD) Coordinates</h3>
          </div>

          {/* Profile Image Upload & Preview Box */}
          <div className="p-4 rounded-2xl bg-primary-surface border border-border flex flex-col sm:flex-row items-center gap-5">
            {/* Avatar Preview */}
            <div className="relative w-20 h-20 rounded-2xl bg-white border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden shrink-0 shadow-xs group">
              {formData.headOfficerImage ? (
                <>
                  <Image
                    src={formData.headOfficerImage}
                    alt={formData.headOfficer || "HOD Photo"}
                    fill
                    sizes="80px"
                    className="object-cover"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity cursor-pointer"
                    title="Remove photo"
                  >
                    <Trash2 className="w-5 h-5 text-red-400" />
                  </button>
                </>
              ) : uploadingPhoto ? (
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              ) : (
                <User className="w-8 h-8 text-gray-300" />
              )}
            </div>

            {/* Upload Controls & URL input */}
            <div className="space-y-2 flex-1 w-full text-left">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-primary" />
                  <span>Head Officer Profile Photo</span>
                </label>
                {uploadSuccess && (
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {uploadSuccess}
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                {/* Direct Cloudinary File Upload Button */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="hod-photo-upload"
                  disabled={uploadingPhoto}
                />
                <label
                  htmlFor="hod-photo-upload"
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0 ${uploadingPhoto
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-primary text-white hover:bg-primary-hover shadow-xs"
                    }`}
                >
                  {uploadingPhoto ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Photo</span>
                    </>
                  )}
                </label>

                {/* Direct Image URL input */}
                <input
                  type="text"
                  value={formData.headOfficerImage || ""}
                  onChange={(e) => setFormData({ ...formData, headOfficerImage: e.target.value })}
                  placeholder="Or paste Cloudinary / image URL (https://...)"
                  className="flex-1 px-3 py-2 bg-white border border-border rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:border-primary focus:outline-hidden"
                />

                {formData.headOfficerImage && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors shrink-0"
                    title="Clear image URL"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-[10px] text-gray-400">
                Supports JPG, PNG, WebP (Max 5MB). Photo is automatically hosted on Cloudinary and displayed across public directories.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Head Officer Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
                <span>Head of Department (HOD) Name *</span>
                {errors.headOfficer && <span className="text-red-500 font-normal text-[10px]">{errors.headOfficer}</span>}
              </label>
              <input
                type="text"
                value={formData.headOfficer}
                onChange={(e) => setFormData({ ...formData, headOfficer: e.target.value })}
                placeholder="e.g. Dr. Sandeep Deshmukh"
                className={`w-full px-3.5 py-2.5 bg-primary-surface border rounded-xl text-xs font-semibold text-gray-800 focus:bg-white focus:outline-hidden transition-all ${errors.headOfficer ? "border-red-400 focus:border-red-500" : "border-border focus:border-primary"
                  }`}
              />
            </div>

            {/* Designation */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Designation / Title</label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                placeholder="e.g. Chief Medical & Sanitation Officer"
                className="w-full px-3.5 py-2.5 bg-primary-surface border border-border rounded-xl text-xs font-semibold text-gray-800 focus:bg-white focus:border-primary focus:outline-hidden"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
                <span>Direct Phone Number *</span>
                {errors.phone && <span className="text-red-500 font-normal text-[10px]">{errors.phone}</span>}
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g. +91 2114 273111"
                className={`w-full px-3.5 py-2.5 bg-primary-surface border rounded-xl text-xs font-semibold text-gray-800 focus:bg-white focus:outline-hidden transition-all ${errors.phone ? "border-red-400 focus:border-red-500" : "border-border focus:border-primary"
                  }`}
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Official Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. health@lonavalamc.gov.in"
                className="w-full px-3.5 py-2.5 bg-primary-surface border border-border rounded-xl text-xs font-semibold text-gray-800 focus:bg-white focus:border-primary focus:outline-hidden"
              />
            </div>

            {/* Office Location */}
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-bold text-gray-700">Office Location in LMC Complex</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Ground Floor, LMC Administrative Complex, Lonavala - 410401"
                className="w-full px-3.5 py-2.5 bg-primary-surface border border-border rounded-xl text-xs font-semibold text-gray-800 focus:bg-white focus:border-primary focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Additional Information Section (Rich Text / React Quill) */}
        <div className="bg-white p-6 rounded-3xl border border-border shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Sparkles className="w-4 h-4 text-primary" />
            <div>
              <h3 className="font-bold text-sm text-text-primary">Additional Information</h3>
              <p className="text-[11px] text-gray-500">
                Custom department directives, official advisories, or detailed citizen procedures.
              </p>
            </div>
          </div>

          {/* List of Additional Info Blocks */}
          {formData.additionalInfo && formData.additionalInfo.length > 0 && (
            <div className="space-y-4">
              {formData.additionalInfo.map((info, idx) => (
                <div
                  key={idx}
                  className="p-4 sm:p-5 rounded-2xl bg-primary-surface border border-border space-y-3 relative group transition-all hover:border-primary/40"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-primary bg-primary-light px-2.5 py-0.5 rounded-md border border-primary/20">
                      Section #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAdditionalInfo(idx)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50 cursor-pointer"
                      title="Remove section"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Title Field */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-600 uppercase block">Title *</label>
                    <input
                      type="text"
                      value={info.title}
                      onChange={(e) => handleUpdateAdditionalInfo(idx, "title", e.target.value)}
                      placeholder="e.g. Special Directives & Citizen Advisory"
                      className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl text-xs font-semibold text-gray-800 focus:border-primary focus:outline-hidden"
                    />
                  </div>

                  {/* Description Field (React Quill) */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-600 uppercase block">Description (Rich Text)</label>
                    <div className="bg-white rounded-xl overflow-hidden border border-border focus-within:border-primary">
                      <ReactQuill
                        theme="snow"
                        value={info.description}
                        onChange={(content) => handleUpdateAdditionalInfo(idx, "description", content)}
                        modules={quillModules}
                        placeholder="Write detailed information, guidelines, or notices here..."
                        className="bg-white text-xs text-gray-800 [&_.ql-editor]:min-h-[140px] [&_.ql-toolbar]:border-none [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-border [&_.ql-container]:border-none [&_.ql-editor]:text-xs [&_.ql-editor]:text-gray-800"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Full-width Add Additional Info Button */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleAddAdditionalInfo}
              className="w-full py-3 px-4 rounded-2xl border-2 border-dashed border-gray-300 hover:border-primary hover:bg-primary-light/20 text-gray-700 hover:text-primary font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
            >
              <Plus className="w-4 h-4 text-primary" />
              <span>Add Additional Info</span>
            </button>
          </div>
        </div>

        {/* Section 3: Designated Department Clerk / Desk Assistant Details */}
        <div className="bg-white p-6 rounded-3xl border border-emerald-200/80 shadow-xs space-y-4 bg-gradient-to-br from-white to-emerald-50/20">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-sm text-text-primary">Department Clerk / Desk Officer</h3>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 border border-emerald-300 px-2.5 py-0.5 rounded-full">
              Citizen Desk Point of Contact
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Clerk Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-600" />
                <span>Clerk Name</span>
              </label>
              <input
                type="text"
                value={formData.clerkName || ""}
                onChange={(e) => setFormData({ ...formData, clerkName: e.target.value })}
                placeholder="e.g. Shri. Rahul Shinde"
                className="w-full px-3.5 py-2.5 bg-primary-surface border border-border rounded-xl text-xs font-semibold text-gray-800 focus:bg-white focus:border-primary focus:outline-hidden transition-all"
              />
            </div>

            {/* Clerk Mobile / Phone */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>Clerk Mobile / Phone</span>
              </label>
              <input
                type="text"
                value={formData.clerkPhone || formData.clerkMobile || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    clerkPhone: e.target.value,
                    clerkMobile: e.target.value,
                  })
                }
                placeholder="e.g. +91 98220 54321"
                className="w-full px-3.5 py-2.5 bg-primary-surface border border-border rounded-xl text-xs font-semibold text-gray-800 focus:bg-white focus:border-primary focus:outline-hidden transition-all"
              />
            </div>

            {/* Clerk Email */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-600" />
                <span>Clerk Email</span>
              </label>
              <input
                type="email"
                value={formData.clerkEmail || ""}
                onChange={(e) => setFormData({ ...formData, clerkEmail: e.target.value })}
                placeholder="e.g. clerk.health@lonavalamc.gov.in"
                className="w-full px-3.5 py-2.5 bg-primary-surface border border-border rounded-xl text-xs font-semibold text-gray-800 focus:bg-white focus:border-primary focus:outline-hidden transition-all"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Department Documents & By-laws */}
        <div className="bg-white p-6 rounded-3xl border border-border shadow-xs space-y-5">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <FileText className="w-4 h-4 text-primary" />
            <div>
              <h3 className="font-bold text-sm text-text-primary">Department Documents & By-laws</h3>
              <p className="text-[11px] text-gray-500">
                Official guidelines, municipal by-laws, notification PDFs, and downloadable citizen forms.
              </p>
            </div>
          </div>

          {docUploadSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{docUploadSuccess}</span>
            </div>
          )}

          {/* If No Documents Yet -> Show "Upload Files" button */}
          {(!formData.documents || formData.documents.length === 0) ? (
            <div className="p-8 rounded-2xl border-2 border-dashed border-gray-200 text-center space-y-3 bg-gray-50/50">
              <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center mx-auto text-gray-400 shadow-xs">
                <FileText className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-700">No documents or by-laws attached yet</p>
                <p className="text-[11px] text-gray-400 max-w-sm mx-auto">
                  Upload PDF, Word, or Excel by-laws and citizen guidelines for public download.
                </p>
              </div>
              <div className="pt-1">
                <input
                  type="file"
                  ref={docFileInputRef}
                  multiple
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,image/*"
                  onChange={handleDocumentUpload}
                  className="hidden"
                  id="initial-docs-upload"
                  disabled={uploadingDoc}
                />
                <label
                  htmlFor="initial-docs-upload"
                  className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-white hover:bg-primary-hover font-bold text-xs cursor-pointer shadow-xs transition-all ${uploadingDoc ? "opacity-75 cursor-not-allowed" : ""
                    }`}
                >
                  {uploadingDoc ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Files</span>
                    </>
                  )}
                </label>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* List of Document Items (Single Line Count & Fields Layout) */}
              {formData.documents.map((doc, idx) => {
                const docUrl = doc.fileUrl || doc.url || "";
                return (
                  <div
                    key={idx}
                    className="p-3.5 sm:p-4 rounded-2xl bg-primary-surface border border-border transition-all hover:border-primary/40 flex flex-col sm:flex-row sm:items-center gap-3"
                  >
                    {/* Count Badge on the Same Line */}
                    <div className="flex items-center gap-2 shrink-0 pt-0.5 sm:pt-4">
                      <span className="w-7 h-7 rounded-xl bg-primary-light text-primary flex items-center justify-center text-xs font-bold shrink-0 border border-primary/20 shadow-2xs">
                        #{idx + 1}
                      </span>
                    </div>

                    {/* Document Title Input */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <label className="text-[10px] font-bold text-gray-600 uppercase block">Title *</label>
                      <input
                        type="text"
                        value={doc.title}
                        onChange={(e) => handleUpdateDocument(idx, "title", e.target.value)}
                        placeholder="e.g. Solid Waste Management By-laws 2024"
                        className="w-full px-3 py-2 bg-white border border-border rounded-xl text-xs font-semibold text-gray-800 focus:border-primary focus:outline-hidden"
                      />
                    </div>

                    {/* If File is Uploaded -> Show "Uploaded File" (Clickable in new tab) + "Replace" button */}
                    {docUrl ? (
                      <div className="flex-1 min-w-0 space-y-1">
                        <label className="text-[10px] font-bold text-gray-600 uppercase block">Uploaded File</label>
                        <div className="flex items-center gap-2">
                          <a
                            href={getInlineFileUrl(docUrl) || docUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 min-w-0 flex items-center justify-between px-3 py-2 bg-white hover:bg-emerald-50/70 border border-border hover:border-emerald-300 text-gray-800 rounded-xl text-xs font-semibold transition-all group shadow-2xs"
                            title="Click to open file in new tab"
                          >
                            <div className="flex items-center gap-2 truncate pr-1">
                              <FileText className="w-4 h-4 text-primary shrink-0" />
                              <span className="truncate font-medium">{doc.title || "View File"}</span>
                            </div>
                            <ExternalLink className="w-3.5 h-3.5 text-primary group-hover:translate-x-0.5 transition-transform shrink-0" />
                          </a>

                          {/* Replace File Button showing Uploading state inside */}
                          <div className="flex flex-col items-center shrink-0">
                            <input
                              type="file"
                              id={`row-file-${idx}`}
                              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,image/*"
                              onChange={(e) => handleRowFileUpload(idx, e)}
                              className="hidden"
                              disabled={uploadingRowIndex === idx}
                            />
                            <label
                              htmlFor={`row-file-${idx}`}
                              className={`px-3 py-2 bg-white border border-gray-200 hover:border-primary text-gray-600 hover:text-primary rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs ${uploadingRowIndex === idx ? "opacity-75 cursor-not-allowed text-primary border-primary bg-primary-surface" : ""
                                }`}
                              title="Replace file"
                            >
                              {uploadingRowIndex === idx ? (
                                <>
                                  <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                                  <span className="text-primary font-bold">Uploading...</span>
                                </>
                              ) : (
                                <>
                                  <Upload className="w-3.5 h-3.5" />
                                  <span>Replace</span>
                                </>
                              )}
                            </label>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* If File is NOT uploaded -> Show Upload File button with inline loading */
                      <div className="w-full sm:w-44 space-y-1 shrink-0">
                        <label className="text-[10px] font-bold text-gray-600 uppercase block">Attach File</label>
                        <div className="flex flex-col items-stretch">
                          <input
                            type="file"
                            id={`row-file-${idx}`}
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,image/*"
                            onChange={(e) => handleRowFileUpload(idx, e)}
                            className="hidden"
                            disabled={uploadingRowIndex === idx}
                          />
                          <label
                            htmlFor={`row-file-${idx}`}
                            className={`px-3 py-2 bg-primary text-white hover:bg-primary-hover rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-xs ${uploadingRowIndex === idx ? "opacity-75 cursor-not-allowed" : ""
                              }`}
                          >
                            {uploadingRowIndex === idx ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Uploading...</span>
                              </>
                            ) : (
                              <>
                                <Upload className="w-3.5 h-3.5" />
                                <span>Upload File</span>
                              </>
                            )}
                          </label>
                        </div>
                      </div>
                    )}

                    {/* Remove Document Button */}
                    <div className="self-end sm:self-center shrink-0 pt-1 sm:pt-4">
                      <button
                        type="button"
                        onClick={() => handleRemoveDocument(idx)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                        title="Remove document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Add More Files Option Below Document Items */}
              <div className="pt-2">
                <input
                  type="file"
                  ref={docFileInputRef}
                  multiple
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,image/*"
                  onChange={handleDocumentUpload}
                  className="hidden"
                  id="add-more-docs-upload"
                  disabled={uploadingDoc}
                />
                <label
                  htmlFor="add-more-docs-upload"
                  className={`w-full py-3 px-4 rounded-2xl border-2 border-dashed border-gray-300 hover:border-primary hover:bg-primary-light/20 text-gray-700 hover:text-primary font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs ${uploadingDoc ? "bg-gray-100 text-primary cursor-not-allowed border-primary/30" : ""
                    }`}
                >
                  {uploadingDoc ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 text-primary" />
                      <span>Add More Files</span>
                    </>
                  )}
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Section 5: Key Department Statistics */}
        <div className="bg-white p-6 rounded-3xl border border-border shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <BarChart3 className="w-4 h-4 text-primary" />
            <div>
              <h3 className="font-bold text-sm text-text-primary">Department Performance Metrics</h3>
              <p className="text-[11px] text-gray-500">Key achievements and live operational stats shown on the public page.</p>
            </div>
          </div>

          {(!formData.stats || formData.stats.length === 0) ? (
            <p className="text-xs text-gray-400 italic">No metrics added yet. Click &ldquo;Add Metric&rdquo; below to showcase department highlights.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {formData.stats.map((st, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-primary-surface border border-border space-y-2 relative group">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-primary bg-primary-light px-2 py-0.5 rounded-md border border-primary/20">
                      Metric #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveStat(idx)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50"
                      title="Remove metric"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-600 uppercase block">Label</label>
                    <input
                      type="text"
                      value={st.label}
                      onChange={(e) => handleUpdateStat(idx, "label", e.target.value)}
                      placeholder="e.g. Daily Solid Waste Cleared"
                      className="w-full px-2.5 py-1.5 bg-white border border-border rounded-lg text-xs font-semibold text-gray-800 focus:border-primary focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-600 uppercase block">Value / Metric</label>
                    <input
                      type="text"
                      value={st.value}
                      onChange={(e) => handleUpdateStat(idx, "value", e.target.value)}
                      placeholder="e.g. 32 MT or 99.2%"
                      className="w-full px-2.5 py-1.5 bg-white border border-border rounded-lg text-xs font-bold text-primary focus:border-primary focus:outline-hidden"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Full-width Add Metric Button Below */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleAddStat}
              className="w-full py-3 px-4 rounded-2xl border-2 border-dashed border-gray-300 hover:border-primary hover:bg-primary-light/20 text-gray-700 hover:text-primary font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
            >
              <Plus className="w-4 h-4 text-primary" />
              <span>Add Metric</span>
            </button>
          </div>
        </div>

        {/* Section 6: Key Responsibilities */}
        <div className="bg-white p-6 rounded-3xl border border-border shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Building2 className="w-4 h-4 text-primary" />
            <div>
              <h3 className="font-bold text-sm text-text-primary">Key Responsibilities & Functions</h3>
              <p className="text-[11px] text-gray-500">Core duties, operational scope, and municipal commitments.</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {formData.responsibilities.map((resp, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-primary-light text-primary flex items-center justify-center text-xs font-bold shrink-0 border border-primary/20 shadow-2xs">
                  #{idx + 1}
                </span>
                <input
                  type="text"
                  value={resp}
                  onChange={(e) => handleUpdateResponsibility(idx, e.target.value)}
                  placeholder="e.g. Daily door-to-door solid waste collection and segregation..."
                  className="flex-1 px-3.5 py-2.5 bg-primary-surface border border-border rounded-xl text-xs font-semibold text-gray-800 focus:bg-white focus:border-primary focus:outline-hidden"
                />
                {formData.responsibilities.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveResponsibility(idx)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer shrink-0"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Full-width Add Responsibility Button Below */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleAddResponsibility}
              className="w-full py-3 px-4 rounded-2xl border-2 border-dashed border-gray-300 hover:border-primary hover:bg-primary-light/20 text-gray-700 hover:text-primary font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
            >
              <Plus className="w-4 h-4 text-primary" />
              <span>Add Responsibility</span>
            </button>
          </div>
        </div>

        {/* Section 7: Citizen Services Provided (Title & Link fields) */}
        <div className="bg-white p-6 rounded-3xl border border-border shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Sparkles className="w-4 h-4 text-primary" />
            <div>
              <h3 className="font-bold text-sm text-text-primary">Citizen Services Provided</h3>
              <p className="text-[11px] text-gray-500">Public application portals, service links, and civic complaint mechanisms.</p>
            </div>
          </div>

          <div className="space-y-3">
            {formData.services.map((srv, idx) => {
              const item = typeof srv === "string" ? { title: srv, link: "" } : srv;
              return (
                <div
                  key={idx}
                  className="p-3.5 sm:p-4 rounded-2xl bg-primary-surface border border-border transition-all hover:border-primary/40 flex flex-col sm:flex-row sm:items-center gap-3"
                >
                  {/* Count Badge on the Same Line */}
                  <div className="flex items-center gap-2 shrink-0 pt-0.5 sm:pt-4">
                    <span className="w-7 h-7 rounded-xl bg-primary-light text-primary flex items-center justify-center text-xs font-bold shrink-0 border border-primary/20 shadow-2xs">
                      #{idx + 1}
                    </span>
                  </div>

                  {/* Service Title Input */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <label className="text-[10px] font-bold text-gray-600 uppercase block">Service Title *</label>
                    <input
                      type="text"
                      value={item.title || ""}
                      onChange={(e) => handleUpdateService(idx, "title", e.target.value)}
                      placeholder="e.g. Garbage collection escalation request"
                      className="w-full px-3 py-2 bg-white border border-border rounded-xl text-xs font-semibold text-gray-800 focus:border-primary focus:outline-hidden"
                    />
                  </div>

                  {/* Service Link Input */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <label className="text-[10px] font-bold text-gray-600 uppercase block">Link / URL</label>
                    <input
                      type="text"
                      value={item.link || ""}
                      onChange={(e) => handleUpdateService(idx, "link", e.target.value)}
                      placeholder="e.g. /services/garbage or https://..."
                      className="w-full px-3 py-2 bg-white border border-border rounded-xl text-xs font-semibold text-gray-800 focus:border-primary focus:outline-hidden"
                    />
                  </div>

                  {/* Remove Service Button */}
                  <div className="self-end sm:self-center shrink-0 pt-1 sm:pt-4">
                    <button
                      type="button"
                      onClick={() => handleRemoveService(idx)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                      title="Remove service"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Full-width Add Citizen Service Button Below */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleAddService}
              className="w-full py-3 px-4 rounded-2xl border-2 border-dashed border-gray-300 hover:border-primary hover:bg-primary-light/20 text-gray-700 hover:text-primary font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
            >
              <Plus className="w-4 h-4 text-primary" />
              <span>Add Citizen Service</span>
            </button>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-2">
          <Link
            href="/admin/departments"
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold"
          >
            Cancel & Return
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? "Saving..." : "Save Department"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
