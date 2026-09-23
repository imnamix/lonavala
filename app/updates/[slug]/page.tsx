"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Eye,
  Share2,
  FileText,
  Download,
  ExternalLink,
  Sparkles,
  Loader2,
  AlertCircle,
  Building,
  Check,
} from "lucide-react";
import {
  ImportantUpdateRecord,
  getImportantUpdateByIdOrSlug,
} from "@/lib/services/important-update.service";
import { formatDate } from "@/lib/utils";

export default function ImportantUpdateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [update, setUpdate] = useState<ImportantUpdateRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (slug) {
      loadDetail();
    }
  }, [slug]);

  const loadDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getImportantUpdateByIdOrSlug(slug, true);
      setUpdate(data);
    } catch (err: any) {
      console.error("Failed to load update:", err);
      setError(err.message || "Important update could not be found.");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        <span className="text-sm font-medium text-slate-500">
          Loading announcement details...
        </span>
      </div>
    );
  }

  if (error || !update) {
    return (
      <div className="max-w-3xl mx-auto py-20 px-4 text-center space-y-4">
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">
          Announcement Not Found
        </h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          {error || "The requested update could not be located or has expired."}
        </p>
        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 text-white rounded-xl font-semibold text-sm hover:bg-emerald-800 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50/50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-700 bg-white border border-slate-200 px-3.5 py-2 rounded-xl hover:bg-slate-50 transition shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Portal</span>
          </Link>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 px-3.5 py-2 rounded-xl hover:bg-slate-50 transition shadow-xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Share Update</span>
              </>
            )}
          </button>
        </div>

        {/* Article Container */}
        <article className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Featured Image */}
          {update.featuredImage && (
            <div className="w-full h-72 sm:h-96 relative bg-slate-100">
              <img
                src={update.featuredImage}
                alt={update.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6 sm:p-10 space-y-6">
            {/* Header Details */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-xs"
                  style={{
                    backgroundColor: update.tagBgColor || "#10B981",
                    color: update.tagTextColor || "#FFFFFF",
                  }}
                >
                  {update.tag || "NOTICE"}
                </span>

                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(update.createdDate)}
                  </span>
                  <span className="flex items-center gap-1.5 font-mono">
                    <Eye className="w-3.5 h-3.5" />
                    {update.viewsCount || 1} Views
                  </span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                {update.title}
              </h1>

              {update.summary && (
                <p className="text-base text-slate-600 leading-relaxed font-medium bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {update.summary}
                </p>
              )}
            </div>

            {/* Rich HTML Content */}
            {update.description && (
              <div className="rich-text-content notice-rich-content pt-4 border-t border-slate-100 text-slate-800 leading-relaxed">
                <div
                  dangerouslySetInnerHTML={{ __html: update.description }}
                  className="space-y-4"
                />
              </div>
            )}

            {/* Attachments Section */}
            {update.attachments && update.attachments.length > 0 && (
              <div className="pt-6 border-t border-slate-100 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>Downloadable Documents & Annexures</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {update.attachments.map((att, idx) => (
                    <a
                      key={idx}
                      href={att.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-300 transition flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="p-2.5 rounded-xl bg-white text-emerald-700 border border-slate-200 group-hover:border-emerald-200 flex-shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="truncate">
                          <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-900 truncate">
                            {att.name}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {att.size || "Document"} • {(att.type || "pdf").toUpperCase()}
                          </div>
                        </div>
                      </div>

                      <div className="p-2 rounded-lg text-slate-400 group-hover:text-emerald-700 transition">
                        <Download className="w-4 h-4" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Photo Gallery */}
            {update.images && update.images.length > 0 && (
              <div className="pt-6 border-t border-slate-100 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  Photo Gallery
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {update.images.map((imgUrl, idx) => (
                    <a
                      key={idx}
                      href={imgUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-2xl overflow-hidden border border-slate-200 h-44 group bg-slate-100 block"
                    >
                      <img
                        src={imgUrl}
                        alt={`Photo ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
