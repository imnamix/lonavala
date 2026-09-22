"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Upload,
  FileText,
  CheckCircle2,
  Trash2,
  Calendar,
  Building,
  Gavel,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { AdalatUpdate } from "@/types";
import { createProceeding, updateProceeding } from "@/lib/services/court.service";
import { uploadToCloudinary } from "@/lib/services/cloudinary.service";
import { getInlineFileUrl } from "@/lib/utils";

interface CourtProceedingFormProps {
  initialData?: AdalatUpdate;
  isEdit?: boolean;
}

export function CourtProceedingForm({ initialData, isEdit = false }: CourtProceedingFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Cloudinary document file state
  const [uploadedDocument, setUploadedDocument] = useState<{
    name: string;
    size: string;
    url: string;
  } | null>(
    initialData?.pdfUrl
      ? {
        name: initialData.pdfUrl.split("/").pop() || "certified-court-order.pdf",
        size: initialData.fileSize || "Certified Document",
        url: initialData.pdfUrl,
      }
      : null
  );

  // Helper to format ISO date string for HTML date input
  const getFormattedDate = (d?: string) => {
    if (!d) return new Date().toISOString().split("T")[0];
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
    try {
      const parsed = new Date(d);
      if (!isNaN(parsed.getTime())) {
        return parsed.toISOString().split("T")[0];
      }
    } catch { }
    return new Date().toISOString().split("T")[0];
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      alert("File size exceeds 25MB limit. Please upload a smaller document.");
      return;
    }

    try {
      setUploadingFile(true);
      const res = await uploadToCloudinary(file, "lonavala/court_proceedings");
      if (res && res.secure_url) {
        const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
        const sizeFormatted =
          Number(sizeMb) < 1 ? `${Math.round(file.size / 1024)} KB` : `${sizeMb} MB`;

        setUploadedDocument({
          name: file.name,
          size: sizeFormatted,
          url: res.secure_url,
        });
      }
    } catch (err) {
      console.error("Failed to upload document to Cloudinary:", err);
      alert("Failed to upload document to Cloudinary. Please try again.");
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const rawDate = (formData.get("date") as string) || "";
      let formattedDisplayDate = rawDate;
      if (rawDate) {
        try {
          formattedDisplayDate = new Date(rawDate).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });
        } catch { }
      }

      const proceedingPayload: Omit<AdalatUpdate, "id"> = {
        subject: (formData.get("subject") as string)?.trim() || "",
        marathiSubject: initialData?.marathiSubject || "",
        date: formattedDisplayDate,
        status: ((formData.get("status") as string) || "Upcoming") as any,
        description: (formData.get("description") as string)?.trim() || "",
        marathiDescription: initialData?.marathiDescription || "",
        minutes: (formData.get("minutes") as string)?.trim() || "",
        marathiMinutes: initialData?.marathiMinutes || "",
        venue: (formData.get("venue") as string)?.trim() || "",
        benchOfficers: (formData.get("benchOfficers") as string)?.trim() || "",
        pdfUrl: uploadedDocument?.url || "",
        fileSize: uploadedDocument?.size || "",
      };

      if (!proceedingPayload.subject) {
        alert("Subject / Matter Title is required.");
        setSubmitting(false);
        return;
      }

      if (isEdit && initialData) {
        await updateProceeding(initialData.id, proceedingPayload);
      } else {
        await createProceeding(proceedingPayload);
      }

      setToastMessage(isEdit ? "Court proceeding updated successfully!" : "New proceeding recorded successfully!");
      setTimeout(() => {
        router.push("/admin/court/proceedings");
      }, 1000);
    } catch (err) {
      console.error(err);
      alert("Failed to save proceeding.");
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-primary text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-border shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/court/proceedings"
            className="p-2.5 rounded-2xl bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors border border-border"
            title="Back to Proceedings List"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-text-primary">
              {isEdit ? "Edit Court Proceeding & Order" : "Add Court Proceeding / Order"}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Record High Court / Tribunal hearing matters, minutes, and upload certified orders via Cloudinary.
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-border shadow-xs space-y-6">
        {/* Subject / Title */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
            Subject / Matter Title *
          </label>
          <input
            type="text"
            name="subject"
            required
            defaultValue={initialData?.subject || ""}
            placeholder="e.g., Bombay High Court - WP / 4812 / 2024: MRTP Demolition Compliance"
            className="w-full px-4 py-2.5 text-xs rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        {/* Date & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              <span>Hearing / Order Date (Calendar) *</span>
            </label>
            <input
              type="date"
              name="date"
              required
              defaultValue={getFormattedDate(initialData?.date)}
              className="w-full px-4 py-2.5 text-xs rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
              Proceeding Status *
            </label>
            <select
              name="status"
              defaultValue={initialData?.status || "Upcoming"}
              className="w-full px-4 py-2.5 text-xs rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
            >
              <option value="Upcoming">Upcoming</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Minutes Published">Minutes Published</option>
              <option value="Order Passed">Order Passed</option>
            </select>
          </div>
        </div>

        {/* Bench Officers & Venue */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 flex items-center gap-1.5">
              <Gavel className="w-3.5 h-3.5 text-primary" />
              <span>Presiding Bench / Officers</span>
            </label>
            <input
              type="text"
              name="benchOfficers"
              defaultValue={initialData?.benchOfficers || ""}
              placeholder="e.g., Hon'ble High Court of Bombay (Principal Bench, Mumbai)"
              className="w-full px-4 py-2.5 text-xs rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-primary" />
              <span>Hearing Venue / Court Complex</span>
            </label>
            <input
              type="text"
              name="venue"
              defaultValue={initialData?.venue || ""}
              placeholder="e.g., Court Room 14, High Court Annexe, Fort, Mumbai"
              className="w-full px-4 py-2.5 text-xs rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>

        {/* Description / Case Background */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
            Description / Case Background
          </label>
          <textarea
            name="description"
            rows={3}
            defaultValue={initialData?.description || ""}
            placeholder="Enter facts of the matter, petition overview, or statutory legal provisions under consideration..."
            className="w-full px-4 py-2.5 text-xs rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-sans leading-relaxed"
          ></textarea>
        </div>

        {/* Minutes & Bench Directions */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
            Minutes & Bench Directions
          </label>
          <textarea
            name="minutes"
            rows={3}
            defaultValue={initialData?.minutes || ""}
            placeholder="Enter bench directions, counsel submissions, joint inspection orders, or settlement terms..."
            className="w-full px-4 py-2.5 text-xs rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-sans leading-relaxed"
          ></textarea>
        </div>

        {/* Cloudinary File Upload Section */}
        <div className="p-5 rounded-2xl bg-gray-50/75 border border-gray-100 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-gray-700 uppercase">
                Certified Order Document (Cloudinary Upload)
              </h3>
              <p className="text-[11px] text-gray-500">
                Upload official certified court order, judgment, or minutes document (PDF, DOC, DOCX up to 25MB)
              </p>
            </div>
            {uploadingFile && (
              <span className="text-[11px] font-bold text-primary flex items-center gap-1.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Uploading to Cloudinary...
              </span>
            )}
          </div>

          {uploadedDocument ? (
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-border shadow-2xs">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-primary-light text-primary flex items-center justify-center font-bold shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-text-primary truncate">{uploadedDocument.name}</div>
                  <div className="text-[11px] text-gray-400 font-medium flex items-center gap-2">
                    <span>{uploadedDocument.size}</span>
                    {uploadedDocument.url.startsWith("http") && (
                      <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
                        Cloudinary Hosted
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {uploadedDocument.url && (
                  <a
                    href={getInlineFileUrl(uploadedDocument.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs transition-colors cursor-pointer"
                    title="Open document in new tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View Document</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setUploadedDocument(null)}
                  className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                  title="Remove Document"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <label className={`border-2 border-dashed border-border rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 hover:bg-white/50 transition-all ${uploadingFile ? "opacity-50 pointer-events-none" : ""}`}>
              {uploadingFile ? (
                <Loader2 className="w-7 h-7 text-primary animate-spin" />
              ) : (
                <Upload className="w-6 h-6 text-gray-400" />
              )}
              <div className="text-center">
                <span className="text-xs font-bold text-primary">
                  {uploadingFile ? "Uploading document to Cloudinary..." : "Click to upload certified order PDF"}
                </span>
                <span className="text-xs text-gray-500"> or drag and drop</span>
              </div>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                disabled={uploadingFile}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <Link
            href="/admin/court/proceedings"
            className="px-5 py-2.5 text-xs font-bold text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting || uploadingFile}
            className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving Record...</span>
              </>
            ) : (
              <span>{isEdit ? "Update Proceeding" : "Record Proceeding"}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
