import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar,
  Building,
  Download,
  ArrowLeft,
  FileText,
  Share2,
  Printer,
  ShieldCheck,
  Bell,
} from "lucide-react";
import { NOTICES_AND_CIRCULARS } from "@/data/mockData";
import { formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return NOTICES_AND_CIRCULARS.map((notice) => ({
    id: notice.id,
  }));
}

export default async function NoticeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const notice = NOTICES_AND_CIRCULARS.find((n) => n.id === resolvedParams.id);

  if (!notice) {
    notFound();
  }

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
            <span className="text-xs font-mono font-semibold text-gray-600 bg-white px-2.5 py-0.5 rounded-md border border-border">
              Ref: {notice.refNo}
            </span>
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
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2 text-xs font-bold text-primary">
              <ShieldCheck className="w-4 h-4" />
              <span>Official Municipal Gazette Notice</span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="#"
                download
                className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF ({notice.downloadSize || "1.2 MB"})</span>
              </a>
            </div>
          </div>

          <div className="prose max-w-none text-xs sm:text-sm text-gray-700 leading-relaxed space-y-4">
            <p className="font-semibold text-gray-900 text-sm sm:text-base">
              Subject: {notice.title}
            </p>
            <p>{notice.description}</p>
            <p>
              It is hereby notified to all residents, commercial establishments, visitors, and stakeholders of Lonavala Municipal Council that the aforementioned resolution/notification stands active in accordance with Maharashtra Municipal Councils Act and local governance directives.
            </p>
            <div className="p-4 rounded-xl bg-primary-surface border border-border space-y-2">
              <h4 className="font-bold text-xs text-text-primary uppercase">Important Directives:</h4>
              <ul className="list-disc list-inside space-y-1 text-xs text-gray-600">
                <li>All concerned departments and field inspectors shall ensure strict compliance.</li>
                <li>Citizens may submit representations or queries to the respective department head.</li>
                <li>Digital receipts and verification can be obtained through the official citizen portal.</li>
              </ul>
            </div>
            <div className="pt-6 border-t border-gray-100 flex justify-between items-end text-xs text-gray-600">
              <div>
                <p>Issued by order and in the name of:</p>
                <p className="font-bold text-gray-900 mt-0.5">Chief Officer / Commissioner</p>
                <p className="text-primary font-semibold">Lonavala Municipal Council</p>
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
