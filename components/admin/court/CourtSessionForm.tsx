"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle2,
  UploadCloud,
  FileText,
  ExternalLink,
  Eye,
  Loader2,
  Trash2,
  Copy,
  Check,
} from "lucide-react";
import { CourtSession } from "@/types";
import { createCourtSession, updateCourtSession } from "@/lib/services/court-session.service";
import { uploadToCloudinary } from "@/lib/services/cloudinary.service";
import { getInlineFileUrl } from "@/lib/utils";

interface CourtSessionFormProps {
  initialData?: CourtSession;
  isEdit?: boolean;
}

export function CourtSessionForm({ initialData, isEdit = false }: CourtSessionFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Notice document state
  const [noticePdfUrl, setNoticePdfUrl] = useState<string>(initialData?.noticePdfUrl || "");
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [docUploadError, setDocUploadError] = useState<string | null>(null);
  const [copiedDoc, setCopiedDoc] = useState(false);

  const getFormattedDate = (d?: string) => {
    if (!d) return new Date().toISOString().split("T")[0];
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
    try {
      const parsed = new Date(d);
      if (!isNaN(parsed.getTime())) {
        return parsed.toISOString().split("T")[0];
      }
    } catch {}
    return new Date().toISOString().split("T")[0];
  };

  const handleDocumentUpload = async (file: File) => {
    try {
      setUploadingDoc(true);
      setDocUploadError(null);
      const res = await uploadToCloudinary(file, "court/sessions");
      setNoticePdfUrl(res.secure_url);
    } catch (err: any) {
      console.error("Failed to upload document:", err);
      setDocUploadError(err.message || "Failed to upload document");
    } finally {
      setUploadingDoc(false);
    }
  };

  const copyDocUrl = () => {
    if (noticePdfUrl) {
      navigator.clipboard.writeText(noticePdfUrl);
      setCopiedDoc(true);
      setTimeout(() => setCopiedDoc(false), 2000);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const rawDate = (formData.get("hearingDate") as string) || "";
      let formattedDisplayDate = rawDate;
      if (rawDate) {
        try {
          formattedDisplayDate = new Date(rawDate).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });
        } catch {}
      }

      const sessionPayload = {
        sessionTitle: (formData.get("sessionTitle") as string)?.trim() || "",
        marathiSessionTitle: "",
        hearingDate: formattedDisplayDate,
        time: (formData.get("time") as string)?.trim() || "11:00 AM",
        courtForum: (formData.get("courtForum") as string)?.trim() || "",
        presidingBench: (formData.get("presidingBench") as string)?.trim() || "",
        status: ((formData.get("status") as string) || "Scheduled"),
        sessionAgenda: (formData.get("sessionAgenda") as string)?.trim() || "",
        marathiSessionAgenda: "",
        casesListed: [],
        noticePdfUrl: noticePdfUrl.trim(),
      };

      if (!sessionPayload.sessionTitle) {
        alert("Session Title is required.");
        setSubmitting(false);
        return;
      }

      if (isEdit && initialData) {
        await updateCourtSession(initialData.id, sessionPayload);
      } else {
        await createCourtSession(sessionPayload);
      }

      setToastMessage(isEdit ? "Session updated successfully!" : "New session scheduled successfully!");
      setTimeout(() => {
        router.push("/admin/court/sessions");
      }, 800);
    } catch (err) {
      console.error(err);
      alert("Failed to save session.");
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/court/sessions"
            className="p-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors border border-slate-200"
            title="Back to Sessions List"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900">
              {isEdit ? "Edit Court Session" : "Schedule Court Session"}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter hearing title, date, time, status, and agenda. (Setting status as Scheduled sets it as the active upcoming session).
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        {/* Session Title */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
            Session Title *
          </label>
          <input
            type="text"
            name="sessionTitle"
            required
            defaultValue={initialData?.sessionTitle || ""}
            placeholder="e.g., Bombay High Court Division Bench Hearing on MRTP Hill Slope Actions"
            className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
          />
        </div>

        {/* Court Forum & Presiding Bench */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Court Forum / Venue
            </label>
            <input
              type="text"
              name="courtForum"
              defaultValue={initialData?.courtForum || ""}
              placeholder="e.g., Bombay High Court (Principal Bench, Mumbai)"
              className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Presiding Bench / Judge
            </label>
            <input
              type="text"
              name="presidingBench"
              defaultValue={initialData?.presidingBench || ""}
              placeholder="e.g., Hon'ble Division Bench (Court Room 14)"
              className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
            />
          </div>
        </div>

        {/* Date, Time & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-700" />
              <span>Hearing Date (Calendar) *</span>
            </label>
            <input
              type="date"
              name="hearingDate"
              required
              defaultValue={getFormattedDate(initialData?.hearingDate)}
              className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-700" />
              <span>Session Time</span>
            </label>
            <input
              type="text"
              name="time"
              defaultValue={initialData?.time || "11:00 AM"}
              placeholder="e.g., 11:00 AM"
              className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Status *
            </label>
            <select
              name="status"
              defaultValue={initialData?.status || "Scheduled"}
              className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 bg-white"
            >
              <option value="Scheduled">Scheduled (Active Upcoming)</option>
              <option value="In Progress">In Progress</option>
              <option value="Concluded">Concluded (Previous Session)</option>
              <option value="Adjourned">Adjourned (Previous Session)</option>
            </select>
          </div>
        </div>

        {/* Agenda */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
            Session Agenda *
          </label>
          <textarea
            name="sessionAgenda"
            rows={4}
            required
            defaultValue={initialData?.sessionAgenda || ""}
            placeholder="Enter hearing agenda, matters listed for consideration, and purpose of the session..."
            className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 font-sans leading-relaxed"
          ></textarea>
        </div>

        {/* Notice Document (Cloudinary Upload) */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase">
                Hearing Notice / Schedule Document (Cloudinary Upload)
              </label>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Upload official hearing notice or schedule PDF document to Cloudinary.
              </p>
            </div>
            {uploadingDoc && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Uploading...
              </span>
            )}
          </div>

          {/* File Upload Input */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <label className="flex-1 cursor-pointer">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                disabled={uploadingDoc}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleDocumentUpload(file);
                }}
              />
              <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-slate-300 hover:border-emerald-600 bg-white text-xs font-bold text-slate-700 hover:text-emerald-800 transition-colors">
                <UploadCloud className="w-4 h-4 text-emerald-700" />
                <span>Choose Document to Upload (PDF)</span>
              </div>
            </label>

            {noticePdfUrl && (
              <div className="flex items-center gap-2">
                <a
                  href={getInlineFileUrl(noticePdfUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-colors shrink-0 shadow-2xs"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Document</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  type="button"
                  onClick={copyDocUrl}
                  title="Copy Document URL"
                  className="p-3 rounded-xl bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors"
                >
                  {copiedDoc ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={() => setNoticePdfUrl("")}
                  title="Remove Document"
                  className="p-3 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Direct URL field */}
          <div>
            <input
              type="text"
              name="noticePdfUrl"
              value={noticePdfUrl}
              onChange={(e) => setNoticePdfUrl(e.target.value)}
              placeholder="Or paste direct document URL (Cloudinary / PDF link)"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 bg-white"
            />
          </div>

          {docUploadError && (
            <p className="text-xs text-red-600 font-medium">{docUploadError}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Link
            href="/admin/court/sessions"
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors shadow-xs disabled:opacity-60 flex items-center gap-1.5"
          >
            {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{submitting ? "Saving..." : isEdit ? "Update Session" : "Schedule Session"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
