"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Save,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Upload,
  Trash2,
  Plus,
  Loader2,
  Building,
  MapPin,
  IndianRupee,
  Calendar,
  HardHat,
  Sparkles,
  Images,
  Eye,
  X,
} from "lucide-react";
import { Project, ProjectGalleryItem } from "@/types";
import {
  getProjectById,
  createProject,
  updateProject,
} from "@/lib/services/project.service";
import { uploadToCloudinary } from "@/lib/services/cloudinary.service";

const PROJECT_CATEGORIES = [
  "Sanitation & Environment",
  "Tourism Infrastructure",
  "Urban Aesthetics",
  "Healthcare",
  "Public Transport",
  "Water Supply & Drainage",
  "Roads & Bridges",
  "Smart City & e-Governance",
  "Heritage Preservation & Parks",
];

const COMMON_DEPARTMENTS = [
  "Public Works Department (PWD)",
  "Water Supply & Drainage",
  "Health & Sanitation",
  "Public Transport Cell",
  "Town Planning & Building Permissions",
  "Disaster Management Cell",
  "Garden & Tree Authority",
  "IT & Smart Governance",
];

interface ProjectFormProps {
  projectId?: string;
  isNew?: boolean;
}

export function ProjectForm({ projectId, isNew = false }: ProjectFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Omit<Project, "id">>({
    title: "",
    category: "Sanitation & Environment",
    status: "Ongoing",
    progress: 0,
    budget: "",
    timeline: "",
    department: "Public Works Department (PWD)",
    location: "",
    contractor: "",
    description: "",
    image: "",
    highlights: [""],
    gallery: [],
  });

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [galleryPreviewUrl, setGalleryPreviewUrl] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [savedToast, setSavedToast] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load existing project if editing
  useEffect(() => {
    async function loadProject() {
      if (!isNew && projectId) {
        setLoading(true);
        try {
          const existing = await getProjectById(projectId);
          if (existing) {
            setFormData({
              title: existing.title || "",
              category: existing.category || "Sanitation & Environment",
              status: existing.status || "Ongoing",
              progress: existing.progress || 0,
              budget: existing.budget || "",
              timeline: existing.timeline || "",
              department: existing.department || "Public Works Department (PWD)",
              location: existing.location || "",
              contractor: existing.contractor || "",
              description: existing.description || "",
              image: existing.image || "",
              highlights:
                existing.highlights && existing.highlights.length > 0
                  ? existing.highlights
                  : [""],
              gallery: Array.isArray(existing.gallery) ? existing.gallery : [],
            });
          }
        } catch (err) {
          console.error("Failed to load project:", err);
        } finally {
          setLoading(false);
        }
      }
    }
    loadProject();
  }, [projectId, isNew]);

  // Handle Cloudinary Feature Image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      setUploadSuccess(null);
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.image;
        return copy;
      });

      const asset = await uploadToCloudinary(file, "lonavala/projects");
      const targetUrl = asset.secure_url || asset.url;

      setFormData((prev) => ({
        ...prev,
        image: targetUrl,
      }));

      setUploadSuccess(`Main project image uploaded successfully: ${file.name}`);
      setTimeout(() => setUploadSuccess(null), 5000);
    } catch (err: any) {
      console.error("Project image upload error:", err);
      setErrors((prev) => ({
        ...prev,
        image: err.message || "Failed to upload project photo to Cloudinary.",
      }));
    } finally {
      setUploadingImage(false);
      if (e.target) e.target.value = "";
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: "" }));
    setUploadSuccess(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Highlights handlers
  const handleAddHighlight = () => {
    setFormData((prev) => ({
      ...prev,
      highlights: [...prev.highlights, ""],
    }));
  };

  const handleHighlightChange = (index: number, text: string) => {
    setFormData((prev) => {
      const updated = [...prev.highlights];
      updated[index] = text;
      return { ...prev, highlights: updated };
    });
  };

  const handleRemoveHighlight = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index),
    }));
  };

  // Gallery Upload Handlers (Supports single or multiple files)
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploadingGallery(true);
      setUploadSuccess(null);

      const newItems: ProjectGalleryItem[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          const uploaded = await uploadToCloudinary(file, "lonavala/projects/gallery");
          const targetUrl = uploaded.secure_url || uploaded.url;
          const cleanTitle = file.name
            .replace(/\.[^/.]+$/, "")
            .replace(/[-_]/g, " ")
            .trim();

          newItems.push({
            id: `gal-${Date.now()}-${i + 1}`,
            url: targetUrl,
            title: cleanTitle || `Project Photo ${i + 1}`,
          });
        } catch (uploadErr) {
          console.error(`Failed to upload ${file.name}:`, uploadErr);
        }
      }

      if (newItems.length > 0) {
        setFormData((prev) => ({
          ...prev,
          gallery: [...(prev.gallery || []), ...newItems],
        }));
        setUploadSuccess(`Added ${newItems.length} photo(s) to project gallery.`);
        setTimeout(() => setUploadSuccess(null), 5000);
      }
    } catch (err: any) {
      console.error("Gallery upload error:", err);
      alert(`Failed to upload gallery photos: ${err.message || "Network error"}`);
    } finally {
      setUploadingGallery(false);
      if (e.target) e.target.value = "";
    }
  };

  const handleGalleryTitleChange = (index: number, title: string) => {
    setFormData((prev) => {
      const updated = [...(prev.gallery || [])];
      if (updated[index]) {
        updated[index] = { ...updated[index], title };
      }
      return { ...prev, gallery: updated };
    });
  };

  const handleRemoveGalleryItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      gallery: (prev.gallery || []).filter((_, i) => i !== index),
    }));
  };

  // Form Validation
  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Project Title is required.";
    if (!formData.department.trim()) newErrors.department = "Department is required.";
    if (!formData.location.trim()) newErrors.location = "Project Location is required.";
    if (!formData.budget.trim()) newErrors.budget = "Estimated Budget is required.";
    if (!formData.timeline.trim()) newErrors.timeline = "Timeline is required.";
    if (!formData.contractor.trim()) newErrors.contractor = "Contractor / Executing Agency is required.";
    if (!formData.description.trim()) newErrors.description = "Project description is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save / Submit Project
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      setSaving(true);
      const cleanPayload: Omit<Project, "id"> = {
        ...formData,
        highlights: formData.highlights.filter((h) => h.trim() !== ""),
        gallery: (formData.gallery || []).filter((g) => g.url && g.url.trim() !== ""),
      };

      if (isNew) {
        await createProject(cleanPayload);
      } else if (projectId) {
        await updateProject(projectId, cleanPayload);
      }

      setSavedToast(true);
      setTimeout(() => {
        router.push("/admin/projects");
      }, 1000);
    } catch (err: any) {
      console.error("Failed to save project:", err);
      setErrors({ form: err.message || "Failed to save project record." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center bg-white rounded-3xl border border-border shadow-xs space-y-4 max-w-4xl mx-auto">
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
        <p className="text-sm font-bold text-gray-700">Loading Project Details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Toast Notification */}
      {savedToast && (
        <div className="fixed top-6 right-6 z-50 bg-primary text-white text-xs font-bold px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-in fade-in duration-300">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span>Project successfully saved! Redirecting to table...</span>
        </div>
      )}

      {/* Gallery Image Preview Lightbox Modal */}
      {galleryPreviewUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative max-w-3xl max-h-[85vh] bg-slate-900 rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
            <button
              onClick={() => setGalleryPreviewUrl(null)}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={galleryPreviewUrl}
              alt="Gallery Preview"
              className="max-h-[80vh] w-auto object-contain mx-auto"
            />
          </div>
        </div>
      )}

      {/* Top Header & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-border shadow-xs">
        <div className="flex items-start gap-3.5 min-w-0">
          <Link
            href="/admin/projects"
            className="p-2.5 rounded-xl bg-gray-50 border border-border hover:border-primary text-gray-600 hover:text-primary transition-colors shrink-0 mt-0.5"
            title="Return to Projects table"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="min-w-0 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-text-primary leading-tight break-words">
                {isNew ? "Add New Project" : formData.title ? `Edit Project: ${formData.title}` : "Edit Project"}
              </h1>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-primary-light text-primary uppercase border border-primary/20 whitespace-nowrap">
                  {formData.category}
                </span>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase border whitespace-nowrap ${formData.status === "Completed"
                    ? "bg-blue-50 text-blue-800 border-blue-200"
                    : formData.status === "Ongoing"
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : "bg-amber-50 text-amber-800 border-amber-200"
                    }`}
                >
                  Status: {formData.status}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Enter capital infrastructure project details, physical completion milestones, and contractor details.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
          <Link
            href="/admin/projects"
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold transition-colors"
          >
            Cancel
          </Link>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving || uploadingImage}
            className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Project...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isNew ? "Publish Project" : "Save Changes"}</span>
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

        {/* SECTION 1: Project Identity, Status & Category */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-border shadow-xs space-y-5">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-3.5">
            <div className="w-8 h-8 rounded-xl bg-primary-light text-primary flex items-center justify-center font-bold text-xs">
              1
            </div>
            <div>
              <h3 className="font-bold text-sm text-text-primary">Project Identity & Classification</h3>
              <p className="text-xs text-gray-500">
                Official project title, status, category, department, and site location.
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            {/* Project Title */}
            <div className="space-y-1.5">
              <label className="font-bold text-gray-700 uppercase tracking-wider flex items-center justify-between">
                <span>Project Title *</span>
                {errors.title && <span className="text-red-500 text-[10px] font-normal">{errors.title}</span>}
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Lonavala Smart Sewerage Network & 15 MLD STP"
                className={`w-full px-3.5 py-2.5 bg-primary-surface border rounded-xl font-bold text-gray-800 focus:bg-white focus:outline-hidden transition-colors ${errors.title ? "border-red-400 focus:border-red-500" : "border-border focus:border-primary"
                  }`}
              />
            </div>

            {/* Category, Status, Department, Location Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* Category */}
              <div className="space-y-1.5">
                <label className="font-bold text-gray-700 uppercase tracking-wider">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 bg-primary-surface border border-border rounded-xl font-semibold text-gray-800 focus:bg-white focus:border-primary focus:outline-hidden text-xs"
                >
                  {PROJECT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Project Status */}
              <div className="space-y-1.5">
                <label className="font-bold text-gray-700 uppercase tracking-wider flex items-center justify-between">
                  <span>Project Status *</span>
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => {
                    const nextStatus = e.target.value as "Ongoing" | "Completed" | "Upcoming";
                    let newProgress = formData.progress;
                    if (nextStatus === "Completed" && formData.progress < 100) newProgress = 100;
                    if (nextStatus === "Upcoming" && formData.progress === 100) newProgress = 0;
                    setFormData({
                      ...formData,
                      status: nextStatus,
                      progress: newProgress,
                    });
                  }}
                  className="w-full px-3 py-2 bg-primary-surface border border-border rounded-xl font-bold text-gray-800 focus:bg-white focus:border-primary focus:outline-hidden text-xs"
                >
                  <option value="Upcoming">Upcoming (Planning Stage)</option>
                  <option value="Ongoing">Ongoing (In Execution)</option>
                  <option value="Completed">Completed (Operational)</option>
                </select>
              </div>

              {/* Department */}
              <div className="space-y-1.5">
                <label className="font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-primary" />
                  <span>Department *</span>
                </label>
                <input
                  type="text"
                  list="project-depts"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="e.g. Public Works Department"
                  className={`w-full px-3 py-2 bg-primary-surface border rounded-xl font-semibold text-gray-800 focus:bg-white focus:outline-hidden transition-colors text-xs ${errors.department ? "border-red-400 focus:border-red-500" : "border-border focus:border-primary"
                    }`}
                />
                <datalist id="project-depts">
                  {COMMON_DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept} />
                  ))}
                </datalist>
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <label className="font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  <span>Location / Ward *</span>
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Tungarli Catchment Area"
                  className={`w-full px-3 py-2 bg-primary-surface border rounded-xl font-semibold text-gray-800 focus:bg-white focus:outline-hidden transition-colors text-xs ${errors.location ? "border-red-400 focus:border-red-500" : "border-border focus:border-primary"
                    }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Budget, Timeline, Contractor & Physical Progress */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-border shadow-xs space-y-5">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-3.5">
            <div className="w-8 h-8 rounded-xl bg-primary-light text-primary flex items-center justify-center font-bold text-xs">
              2
            </div>
            <div>
              <h3 className="font-bold text-sm text-text-primary">Execution, Financials & Progress</h3>
              <p className="text-xs text-gray-500">
                Budget allocation, completion timeline, awarded contractor, and physical progress.
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Estimated Budget */}
              <div className="space-y-1.5">
                <label className="font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
                  <IndianRupee className="w-3.5 h-3.5 text-primary" />
                  <span>Sanctioned Budget *</span>
                </label>
                <input
                  type="text"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  placeholder="e.g. ₹42.50 Crores"
                  className={`w-full px-3.5 py-2.5 bg-primary-surface border rounded-xl font-bold text-gray-800 focus:bg-white focus:outline-hidden transition-colors ${errors.budget ? "border-red-400 focus:border-red-500" : "border-border focus:border-primary"
                    }`}
                />
              </div>

              {/* Timeline */}
              <div className="space-y-1.5">
                <label className="font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  <span>Timeline / Duration *</span>
                </label>
                <input
                  type="text"
                  value={formData.timeline}
                  onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                  placeholder="e.g. Jan 2024 - Dec 2026"
                  className={`w-full px-3.5 py-2.5 bg-primary-surface border rounded-xl font-semibold text-gray-800 focus:bg-white focus:outline-hidden transition-colors ${errors.timeline ? "border-red-400 focus:border-red-500" : "border-border focus:border-primary"
                    }`}
                />
              </div>

              {/* Contractor */}
              <div className="space-y-1.5">
                <label className="font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
                  <HardHat className="w-3.5 h-3.5 text-primary" />
                  <span>Contractor / Agency *</span>
                </label>
                <input
                  type="text"
                  value={formData.contractor}
                  onChange={(e) => setFormData({ ...formData, contractor: e.target.value })}
                  placeholder="e.g. M/s Shivalaya Infra Tech JV"
                  className={`w-full px-3.5 py-2.5 bg-primary-surface border rounded-xl font-semibold text-gray-800 focus:bg-white focus:outline-hidden transition-colors ${errors.contractor ? "border-red-400 focus:border-red-500" : "border-border focus:border-primary"
                    }`}
                />
              </div>
            </div>

            {/* Status & Physical Progress Slider Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-primary-surface border border-border space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Status indicator */}
                <div className="flex items-center gap-3">
                  <label className="font-bold text-gray-700 uppercase tracking-wider">
                    Current Status:
                  </label>
                  <span
                    className={`px-3 py-1 rounded-xl text-xs font-bold border ${formData.status === "Completed"
                      ? "bg-blue-50 text-blue-800 border-blue-200"
                      : formData.status === "Ongoing"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : "bg-amber-50 text-amber-800 border-amber-200"
                      }`}
                  >
                    {formData.status}
                  </span>
                </div>

                {/* Numeric Progress display */}
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-600">Physical Progress:</span>
                  <span className="px-3 py-1 bg-white border border-border rounded-xl font-mono font-extrabold text-sm text-primary">
                    {formData.progress}%
                  </span>
                </div>
              </div>

              {/* Custom Fulfilled Progress Bar with Range Slider Overlay */}
              <div className="space-y-2">
                <div className="relative w-full h-4 sm:h-5 bg-[#FAF7F2] rounded-full border border-[#D8CDBC] p-[3px] flex items-center shadow-xs">
                  {/* Filled Progress Bar in dark color like the image */}
                  <div
                    className="h-full bg-[#9E8255] rounded-full transition-all duration-150 ease-out"
                    style={{ width: `${formData.progress}%` }}
                  />

                  {/* Circle Knob Indicator */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 sm:w-6 sm:h-6 bg-white border-2 border-[#8E7348] rounded-full shadow-md flex items-center justify-center pointer-events-none transition-all duration-75 z-10"
                    style={{ left: `${formData.progress}%` }}
                  >
                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-[#8E7348] rounded-full" />
                  </div>

                  {/* Interactive Slider Overlay */}
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={formData.progress}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      setFormData({
                        ...formData,
                        progress: val,
                        status: val >= 100 ? "Completed" : val > 0 ? "Ongoing" : "Upcoming",
                      });
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                    title={`Physical Progress: ${formData.progress}%`}
                  />
                </div>

                {/* Milestone quick-select markers */}
                <div className="flex justify-between text-[10px] font-bold text-gray-400 px-1 select-none">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, progress: 0, status: "Upcoming" })}
                    className={`hover:text-primary transition-colors cursor-pointer ${formData.progress === 0 ? "text-primary font-black" : ""}`}
                  >
                    0% (Upcoming)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, progress: 25, status: "Ongoing" })}
                    className={`hover:text-primary transition-colors cursor-pointer ${formData.progress >= 25 && formData.progress < 50 ? "text-primary font-black" : ""}`}
                  >
                    25%
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, progress: 50, status: "Ongoing" })}
                    className={`hover:text-primary transition-colors cursor-pointer ${formData.progress >= 50 && formData.progress < 75 ? "text-primary font-black" : ""}`}
                  >
                    50% (Midway)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, progress: 75, status: "Ongoing" })}
                    className={`hover:text-primary transition-colors cursor-pointer ${formData.progress >= 75 && formData.progress < 100 ? "text-primary font-black" : ""}`}
                  >
                    75%
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, progress: 100, status: "Completed" })}
                    className={`hover:text-primary transition-colors cursor-pointer ${formData.progress === 100 ? "text-primary font-black" : ""}`}
                  >
                    100% (Completed)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: Project Description & Highlights */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-border shadow-xs space-y-5">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-3.5">
            <div className="w-8 h-8 rounded-xl bg-primary-light text-primary flex items-center justify-center font-bold text-xs">
              3
            </div>
            <div>
              <h3 className="font-bold text-sm text-text-primary">Scope Description & Key Highlights</h3>
              <p className="text-xs text-gray-500">
                Detailed scope of works, ecological benefits, and milestone deliverables.
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            {/* Description */}
            <div className="space-y-1.5">
              <label className="font-bold text-gray-700 uppercase tracking-wider flex items-center justify-between">
                <span>Detailed Description *</span>
                {errors.description && (
                  <span className="text-red-500 text-[10px] font-normal">{errors.description}</span>
                )}
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe project objectives, scope of civil works, infrastructure facilities, and community impact..."
                className={`w-full px-3.5 py-2.5 bg-primary-surface border rounded-xl leading-relaxed font-medium text-gray-800 focus:bg-white focus:outline-hidden transition-colors ${errors.description ? "border-red-400 focus:border-red-500" : "border-border focus:border-primary"
                  }`}
              />
            </div>

            {/* Highlights List */}
            <div className="space-y-3">
              <label className="font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span>Key Project Highlights & Milestones</span>
              </label>

              <div className="space-y-2.5">
                {formData.highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-primary-light text-primary text-[10px] font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={highlight}
                      onChange={(e) => handleHighlightChange(idx, e.target.value)}
                      placeholder="e.g. Advanced MBBR sewage technology to preserve lake water purity"
                      className="w-full px-3.5 py-2 bg-primary-surface border border-border rounded-xl font-medium text-gray-800 text-xs focus:bg-white focus:border-primary focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveHighlight(idx)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer shrink-0"
                      title="Remove highlight"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {/* Full-width Add Highlight Button */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleAddHighlight}
                    className="w-full py-3 rounded-2xl border-2 border-dashed border-primary text-primary hover:bg-primary-light font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Project Highlight</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: Project Cover Photo */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-border shadow-xs space-y-4">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-3.5">
            <div className="w-8 h-8 rounded-xl bg-primary-light text-primary flex items-center justify-center font-bold text-xs">
              4
            </div>
            <div>
              <h3 className="font-bold text-sm text-text-primary">Cover Photo / Blueprint</h3>
              <p className="text-xs text-gray-500">
                Primary cover photo displayed on project cards and banner.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-primary-surface border border-border space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/jpg"
              onChange={handleImageUpload}
              className="hidden"
            />

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                type="button"
                disabled={uploadingImage}
                onClick={() => fileInputRef.current?.click()}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white border-2 border-dashed border-primary text-primary hover:bg-primary-light font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 disabled:opacity-60 shadow-2xs"
              >
                {uploadingImage ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span>Uploading to Cloudinary...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 text-primary" />
                    <span>{formData.image ? "Change Cover Photo" : "Upload Cover Photo"}</span>
                  </>
                )}
              </button>

              <div className="flex-1 w-full space-y-1">
                <p className="text-xs font-bold text-gray-700">Supported Formats: JPG, PNG, WEBP</p>
                <p className="text-[11px] text-gray-500">
                  Uploaded image is hosted on Cloudinary CDN (<code className="font-mono text-primary text-[10px]">lonavala/projects</code>).
                </p>
              </div>
            </div>

            {/* Image Preview & URL Field */}
            {formData.image && (
              <div className="p-4 rounded-2xl bg-white border border-border flex flex-col sm:flex-row items-center gap-4 shadow-2xs">
                {/* Image Thumbnail */}
                <div className="w-24 h-20 rounded-xl overflow-hidden bg-gray-100 border border-border shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={formData.image}
                    alt={formData.title || "Project Preview"}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 w-full space-y-1.5 min-w-0">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    Cloudinary CDN Image URL
                  </label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-[11px] font-mono text-gray-700 focus:border-primary focus:outline-hidden"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="p-2.5 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                  title="Remove image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 5: Destination Gallery Media Style Project Photo Gallery */}
        <div className="p-4 sm:p-5 rounded-2xl bg-primary-surface border border-border space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 pb-3 gap-2">
            <div>
              <span className="font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5 text-xs">
                <Images className="w-4 h-4 text-primary" />
                <span>Project Gallery Media ({formData.gallery?.length || 0})</span>
              </span>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Progress photos, site milestones, and infrastructure blueprints showing physical execution.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-400 font-semibold hidden sm:inline">
                Supports JPG, PNG, WebP
              </span>
              <input
                ref={galleryFileInputRef}
                type="file"
                multiple
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleGalleryUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Gallery Grid Cards */}
          {(!formData.gallery || formData.gallery.length === 0) ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-gray-300 text-gray-400 space-y-2">
              <div className="flex items-center justify-center gap-2 text-gray-300">
                <Images className="w-8 h-8" />
              </div>
              <p className="font-semibold text-gray-700 text-xs">No gallery photos uploaded yet</p>
              <p className="text-[11px] text-gray-400">
                Click &quot;Add Gallery Photos&quot; below to upload project progress photos
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {formData.gallery.map((img, idx) => (
                <div
                  key={img.id || idx}
                  className="p-1.5 rounded-2xl bg-white border border-gray-200 shadow-2xs relative group overflow-hidden flex flex-col justify-between"
                >
                  <div className="h-32 sm:h-36 rounded-xl overflow-hidden bg-gray-900 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url}
                      alt={img.title || `Project Gallery Photo ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Top Right Quick Actions: Preview & Delete */}
                    <div className="absolute top-2 right-2 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setGalleryPreviewUrl(img.url)}
                        className="p-1.5 rounded-lg bg-black/60 text-white hover:bg-black transition-colors shadow-xs cursor-pointer backdrop-blur-xs"
                        title="Preview photo"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryItem(idx)}
                        className="p-1.5 rounded-lg bg-red-600/90 text-white hover:bg-red-700 transition-colors shadow-xs cursor-pointer"
                        title="Delete this photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Photo Title Input */}
                  <div className="pt-2 px-0.5">
                    <input
                      type="text"
                      value={img.title}
                      onChange={(e) => handleGalleryTitleChange(idx, e.target.value)}
                      placeholder="Photo title / caption..."
                      className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 placeholder:text-gray-400 focus:bg-white focus:border-primary focus:outline-hidden transition-colors"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Gallery Photos Button BELOW */}
          <div className="pt-1">
            <button
              type="button"
              disabled={uploadingGallery}
              onClick={() => galleryFileInputRef.current?.click()}
              className="w-full py-2.5 rounded-xl bg-white hover:bg-emerald-50 text-primary border-2 border-dashed border-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              {uploadingGallery ? (
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
              ) : (
                <Plus className="w-3.5 h-3.5" />
              )}
              <span>{uploadingGallery ? "Uploading photos to Cloudinary..." : "Add Gallery Photos"}</span>
            </button>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-2">
          <Link
            href="/admin/projects"
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold"
          >
            Cancel & Return
          </Link>

          <button
            type="submit"
            disabled={saving || uploadingImage || uploadingGallery}
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
                <span>{isNew ? "Publish Project" : "Save Changes"}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
