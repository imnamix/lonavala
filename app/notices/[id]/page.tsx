"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  Calendar,
  Building,
  Download,
  ArrowLeft,
  ShieldCheck,
  FileText,
  ExternalLink,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { formatDate, getInlineFileUrl, getDocumentViewerUrl } from "@/lib/utils";
import { getNoticeById, NoticeRecord } from "@/lib/services/notice.service";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function NoticeDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [notice, setNotice] = useState<NoticeRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    async function loadNotice() {
      try {
        setLoading(true);
        const data = await getNoticeById(id);
        setNotice(data);
      } catch (err) {
        console.error(`Failed to load notice #${id}:`, err);
      } finally {
        setLoading(false);
      }
    }
    loadNotice();
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 max-w-4xl mx-auto px-4 text-center space-y-4">
        <div className="p-16 bg-white rounded-3xl border border-border shadow-xs flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm font-bold text-gray-700">Loading Notice Details...</p>
        </div>
      </div>
    );
  }

  if (!notice) {
    return (
      <div className="py-20 max-w-2xl mx-auto px-4 text-center">
        <div className="p-10 bg-white rounded-3xl border border-border shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-gray-900">Notice Not Found</h2>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            The requested notice could not be found. It may have been archived, unpublished, or removed.
          </p>
          <div className="pt-2">
            <Link
              href="/notices"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-hover transition-colors shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Notices & Circulars</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const hasAttachment = Boolean(notice.fileUrl || notice.fileName);
  const inlineUrl = getInlineFileUrl(notice.fileUrl);
  const viewerUrl = getDocumentViewerUrl(notice.fileUrl);

  return (
    <div className="py-10">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <Link
          href="/notices"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Notices & Circulars</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="bg-primary-light/60 border-y border-border py-10 mb-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-xs font-bold px-3 py-0.5 rounded-full bg-primary text-white">
              {notice.category}
            </span>
            {notice.refNo && (
              <span className="text-xs font-mono font-semibold text-gray-600 bg-white px-2.5 py-0.5 rounded-md border border-border">
                Ref: {notice.refNo}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary leading-snug">
            {notice.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 mt-4">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-primary" />
              <span>Published: {formatDate(notice.date)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Building className="w-4 h-4 text-primary" />
              <span>Issuing Dept: {notice.department}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Main Document Body */}
        <div className="bg-white rounded-2xl border border-border p-6 sm:p-10 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2 text-xs font-bold text-primary">
              <ShieldCheck className="w-4 h-4" />
              <span>Official Municipal Gazette Notice</span>
            </div>
            {/* {inlineUrl && (
              <div className="flex items-center gap-2">
                <a
                  href={inlineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Document in New Tab</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                </a>
              </div>
            )} */}
          </div>

          <div className="space-y-6">
            {notice.subject && (
              <div className="p-4 rounded-xl bg-gray-50 border-l-4 border-primary text-gray-900 font-semibold text-sm sm:text-base leading-snug">
                <span className="text-xs uppercase font-bold text-gray-500 block mb-0.5">Subject</span>
                <span>{notice.subject}</span>
              </div>
            )}

            {/* Description HTML */}
            {notice.description && (
              <div
                className="notice-rich-content"
                dangerouslySetInnerHTML={{ __html: notice.description }}
              />
            )}

            {/* Important Directives */}
            {notice.directives && notice.directives.length > 0 && (
              <div className="p-4 rounded-xl bg-primary-surface border border-border space-y-2 mt-6">
                <h4 className="font-bold text-xs text-text-primary uppercase">Important Directives:</h4>
                <div className="space-y-2 text-xs text-gray-700">
                  {notice.directives.map((d, i) => (
                    <div key={d.id || i} className="flex items-start gap-2">
                      <span className="font-bold text-gray-900 shrink-0">{d.key}:</span>
                      <span>{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Attached File Preview Card */}
            {hasAttachment && (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50/70 via-teal-50/50 to-primary-surface border border-emerald-200/80 space-y-3 mt-6">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-primary" />
                    <span>Official Document & Attachments</span>
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Verified Gazette PDF
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white border border-emerald-100 shadow-2xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100 shadow-2xs">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate">
                        {notice.fileName || `${notice.title}.pdf`}
                      </p>
                      <p className="text-[11px] text-gray-500 font-medium">
                        {notice.fileSize || "Document Attachment"} • Click to view in browser
                      </p>
                    </div>
                  </div>

                  {inlineUrl ? (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setShowPreview((prev) => !prev)}
                        className="px-3.5 py-2 rounded-xl bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-50 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        title={showPreview ? "Hide Preview" : "Preview Document Here"}
                      >
                        {showPreview ? (
                          <>
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>Hide Preview</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-3.5 h-3.5" />
                            <span>Preview</span>
                          </>
                        )}
                      </button>
                      <a
                        href={inlineUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Open in New Tab</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <a
                        href={inlineUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs transition-colors cursor-pointer"
                        title="Download Document"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400 italic">No direct file URL linked</span>
                  )}
                </div>

                {/* Interactive Embedded Document Viewer */}
                {showPreview && viewerUrl && (
                  <div className="pt-3 animate-in fade-in duration-200">
                    <div className="rounded-xl overflow-hidden border border-emerald-300/80 bg-white shadow-xs">
                      <div className="p-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between text-xs text-gray-600 px-4">
                        <span className="font-bold truncate">{notice.fileName || "Document Preview"}</span>
                        <a
                          href={inlineUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline font-bold flex items-center gap-1"
                        >
                          <span>Full Screen</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <iframe
                        src={viewerUrl}
                        className="w-full h-[650px] border-0"
                        title="Attached Document Viewer"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="pt-6 border-t border-gray-100 flex justify-between items-end text-xs text-gray-600">
              <div>
                <p>Issued by order and in the name of:</p>
                <p className="font-bold text-gray-900 mt-0.5">{notice.issuedByName || "Chief Officer / Commissioner"}</p>
                <p className="text-primary font-semibold">{notice.issuedByDesignation || "Lonavala Municipal Council"}</p>
              </div>
              <div className="text-right text-[11px] text-gray-400">
                Seal of Council: Authenticated
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
