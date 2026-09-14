import Link from "next/link";
import { Calendar, Building, Download, ArrowRight } from "lucide-react";
import { NoticeItem } from "@/types";
import { formatDate } from "@/lib/utils";

export function NoticeCard({ notice }: { notice: NoticeItem }) {
  const categoryColors: Record<string, string> = {
    Notices: "bg-blue-50 text-blue-700 border-blue-200",
    Circulars: "bg-emerald-50 text-emerald-800 border-emerald-200",
    Orders: "bg-amber-50 text-amber-800 border-amber-200",
    News: "bg-purple-50 text-purple-700 border-purple-200",
    Events: "bg-rose-50 text-rose-700 border-rose-200",
  };

  const badgeColor = categoryColors[notice.category] || "bg-slate-100 text-slate-700 border-slate-200";

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-xl transition-all duration-200 hover:border-emerald-600/60 hover:-translate-y-1 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${badgeColor}`}>
            {notice.category}
          </span>
          {notice.isNew && (
            <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200 animate-pulse">
              NEW
            </span>
          )}
          <div className="text-[11px] text-slate-500 flex items-center gap-1 ml-auto">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            <span>{formatDate(notice.date)}</span>
          </div>
        </div>

        <h4 className="text-sm sm:text-base font-bold text-slate-900 hover:text-emerald-700 transition-colors leading-snug mb-1.5 line-clamp-2">
          <Link href={`/notices/${notice.id}`}>{notice.title}</Link>
        </h4>

        {/* Short info */}
        <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
          {notice.description}
        </p>
      </div>

      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px]">
        <div className="flex items-center gap-1.5 text-slate-500">
          <Building className="w-3.5 h-3.5 text-slate-400" />
          <span className="truncate max-w-[160px]">{notice.department}</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/notices/${notice.id}`}
            className="font-bold text-emerald-700 hover:underline flex items-center gap-1"
          >
            <span>Details</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
          <a
            href="#"
            download
            className="flex items-center gap-1 px-2 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 rounded text-slate-600 font-semibold transition-colors"
            title="Download PDF"
          >
            <Download className="w-3 h-3" />
            <span>{notice.downloadSize || "PDF"}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
