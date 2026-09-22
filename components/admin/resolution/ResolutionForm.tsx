"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Save,
  ArrowLeft,
  CheckCircle2,
  FileText,
  AlertCircle,
  Loader2,
  Upload,
  Calendar,
  Layers,
  ShieldCheck,
  Download,
  Trash2,
  FileCheck,
} from "lucide-react";
import { CouncilResolution } from "@/types";
import {
  getResolutionById,
  createResolution,
  updateResolution,
  CreateResolutionPayload,
} from "@/lib/services/resolution.service";
import { uploadToCloudinary } from "@/lib/services/cloudinary.service";

const MEETING_TYPES = [
  "General Body Meeting",
  "Special Meeting",
  "Standing Committee Meeting",
  "Budget Session",
  "Gazette Notification",
  "Standing Order",
  "Executive Resolution",
];

interface ResolutionFormProps {
  resolutionId?: string | number;
  isNew?: boolean;
}

export function ResolutionForm({ resolutionId, isNew = false }: ResolutionFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<CouncilResolution>({
    id: isNew ? 0 : resolutionId || 0,
    title: "",
    meetingType: "General Body Meeting",
    resolutionDate: new Date().toISOString().split("T")[0],
    durationFrom: "",
    durationTo: "",
    fileUrl: "",
    fileName: "",
    fileSize: "",
    isActive: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [savedToast, setSavedToast] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadData() {
      if (!isNew && resolutionId) {
        try {
          setLoading(true);
          const existing = await getResolutionById(resolutionId);
          if (existing) {
            setFormData({
              ...existing,
              meetingType: existing.meetingType || "General Body Meeting",
              resolutionDate: existing.resolutionDate || "",
              durationFrom: existing.durationFrom || "",
              durationTo: existing.durationTo || "",
            });
          }
        } catch (err) {
          console.error("Failed to load resolution:", err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }
    loadData();
  }, [resolutionId, isNew]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingFile(true);
      const res = await uploadToCloudinary(file);
      if (res && res.secure_url) {
        const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
        const sizeFormatted =
          Number(sizeMb) < 1 ? `${Math.round(file.size / 1024)} KB` : `${sizeMb} MB`;

        setFormData((prev) => ({
          ...prev,
          fileUrl: res.secure_url,
          fileName: file.name,
          fileSize: sizeFormatted,
        }));
      }
    } catch (err) {
      console.error("Failed to upload document:", err);
      alert("Error uploading document. Please try again.");
    } finally {
      setUploadingFile(false);
    }
  };

  const validate = () => {
    const err: Record<string, string> = {};
    if (!formData.title.trim()) {
      err.title = "Resolution title is required";
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const payload: CreateResolutionPayload = {
        title: formData.title.trim(),
        meetingType: formData.meetingType || "General Body Meeting",
        resolutionDate: formData.resolutionDate || "",
        durationFrom: formData.durationFrom || "",
        durationTo: formData.durationTo || "",
        fileUrl: formData.fileUrl || "",
        fileName: formData.fileName || "",
        fileSize: formData.fileSize || "",
        isActive: formData.isActive !== false,
      };

      if (isNew) {
        const res = await createResolution(payload);
        if (res.data) {
          setSavedToast(true);
          setTimeout(() => {
            router.push("/admin/resolutions");
          }, 1000);
        }
      } else if (resolutionId) {
        const res = await updateResolution(resolutionId, payload);
        if (res.data) {
          setSavedToast(true);
          setTimeout(() => {
            router.push("/admin/resolutions");
          }, 1000);
        }
      }
    } catch (err) {
      console.error("Failed to save resolution:", err);
      alert("Error saving resolution. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm font-medium text-text-muted">Loading resolution details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Toast Notification */}
      {savedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-surface-dark text-white text-xs font-semibold px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-2.5 border border-white/10 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>Resolution successfully {isNew ? "created" : "updated"}!</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-border shadow-xs">
        <div className="flex items-center gap-4 min-w-0">
          <Link
            href="/admin/resolutions"
            className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="font-bold text-primary uppercase tracking-wider">
                Council Resolutions
              </span>
              <span className="text-text-muted">•</span>
              <span className="text-text-muted">
                {isNew ? "New Entry" : "Edit Resolution"}
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold text-text-primary mt-1 line-clamp-1 break-words">
              {isNew ? "Add Council Resolution" : formData.title || "Edit Resolution"}
            </h1>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-md shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saving ? "Saving..." : isNew ? "Create Resolution" : "Save Changes"}</span>
          </button>
        </div>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl border border-border p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <FileText className="w-4 h-4 text-primary" />
            <h2 className="text-base font-bold text-text-primary">
              Resolution Details
            </h2>
          </div>

          <div className="space-y-5">
            {/* 1. Title */}
            <div>
              <label className="block text-xs font-bold text-text-primary mb-1.5">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  if (errors.title) setErrors({ ...errors, title: "" });
                }}
                placeholder="Enter resolution title"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                  errors.title
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-200 focus:border-primary focus:ring-primary/20"
                }`}
              />
              {errors.title && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.title}
                </p>
              )}
            </div>

            {/* 2. Type & 3. Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Type */}
              <div>
                <label className="block text-xs font-bold text-text-primary mb-1.5">
                  Type
                </label>
                <div className="relative">
                  <input
                    type="text"
                    list="meeting-types-list"
                    value={formData.meetingType}
                    onChange={(e) =>
                      setFormData({ ...formData, meetingType: e.target.value })
                    }
                    placeholder="e.g. General Body Meeting, Special Meeting"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white"
                  />
                  <datalist id="meeting-types-list">
                    {MEETING_TYPES.map((type) => (
                      <option key={type} value={type} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-bold text-text-primary mb-1.5">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.resolutionDate || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, resolutionDate: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white"
                />
              </div>
            </div>

            {/* 4. Duration: From Year and To Year */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-text-primary">
                Duration (Years)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <span className="block text-[11px] font-semibold text-text-muted mb-1">
                    From Year
                  </span>
                  <input
                    type="number"
                    min="1990"
                    max="2099"
                    step="1"
                    placeholder="e.g. 2024"
                    value={formData.durationFrom || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, durationFrom: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white"
                  />
                </div>
                <div>
                  <span className="block text-[11px] font-semibold text-text-muted mb-1">
                    To Year
                  </span>
                  <input
                    type="number"
                    min="1990"
                    max="2099"
                    step="1"
                    placeholder="e.g. 2029"
                    value={formData.durationTo || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, durationTo: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* 5. File Upload */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <label className="block text-xs font-bold text-text-primary">
                File / Document
              </label>
              <div className="p-4 rounded-2xl border-2 border-dashed border-gray-200 bg-slate-50/70 text-center flex flex-col items-center justify-center space-y-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".pdf,.docx,.doc"
                  className="hidden"
                />
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  {uploadingFile ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Upload className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingFile}
                    className="text-xs font-bold text-emerald-700 hover:underline"
                  >
                    {uploadingFile ? "Uploading File..." : "Click to upload document (PDF/DOC)"}
                  </button>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    PDF, DOCX up to 25 MB
                  </p>
                </div>
              </div>

              {formData.fileUrl && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs gap-3">
                  <div className="flex items-center gap-2 truncate min-w-0">
                    <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold text-emerald-900 truncate">
                      {formData.fileName || "Uploaded Document"}
                    </span>
                    {formData.fileSize && (
                      <span className="text-emerald-700 text-[11px] shrink-0">
                        ({formData.fileSize})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={formData.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-xs transition-colors flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      View
                    </a>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          fileUrl: "",
                          fileName: "",
                          fileSize: "",
                        }))
                      }
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-100/70 border border-red-200 bg-red-50/50 transition-colors"
                      title="Delete file"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Visibility Toggle */}
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
              <div>
                <label className="block text-xs font-bold text-text-primary">
                  Public Portal Visibility
                </label>
                <p className="text-[11px] text-text-muted">
                  {formData.isActive !== false
                    ? "Visible on council page"
                    : "Hidden from portal"}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive !== false}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-end gap-3">
          <Link
            href="/admin/resolutions"
            className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-md shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saving ? "Saving..." : isNew ? "Create Resolution" : "Save Changes"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
