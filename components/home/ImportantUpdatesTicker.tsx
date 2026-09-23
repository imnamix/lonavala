"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Megaphone,
  Sparkles,
  Download,
  ExternalLink,
  ArrowRight,
  Pin,
  ChevronRight,
  FileCode2,
  FileText,
} from "lucide-react";
import {
  ImportantUpdateRecord,
  getActiveImportantUpdates,
} from "@/lib/services/important-update.service";

export function ImportantUpdatesTicker() {
  const [updates, setUpdates] = useState<ImportantUpdateRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActiveUpdates();
  }, []);

  const loadActiveUpdates = async () => {
    try {
      const data = await getActiveImportantUpdates(10);
      setUpdates(data);
    } catch (err) {
      console.error("Failed to load active important updates:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || updates.length === 0) {
    return null;
  }

  const renderUpdateLink = (update: ImportantUpdateRecord) => {
    const isExternal = update.actionType === "EXTERNAL_LINK";
    const isDownload = update.actionType === "DOWNLOAD_FILE";
    const isCustomPage = update.actionType === "CUSTOM_PAGE";
    const isInternalRoute = update.actionType === "INTERNAL_ROUTE";

    let targetHref = "#";
    let targetProps: { target?: string; rel?: string; download?: boolean } = {};

    if (isDownload) {
      targetHref = update.fileUrl || "#";
      targetProps = { target: "_blank", rel: "noopener noreferrer" };
    } else if (isExternal) {
      targetHref = update.externalUrl || "#";
      if (update.openInNewTab) {
        targetProps = { target: "_blank", rel: "noopener noreferrer" };
      }
    } else if (isInternalRoute) {
      targetHref = update.internalRoute || "/notices";
    } else if (isCustomPage) {
      targetHref = `/updates/${update.slug || update.id}`;
    }

    return (
      <Link
        key={update.id}
        href={targetHref}
        {...targetProps}
        className="group flex-shrink-0 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 hover:bg-white text-slate-800 border border-slate-200/80 hover:border-emerald-400/80 shadow-xs hover:shadow-md transition-all duration-200 text-xs font-medium"
      >
        {/* Tag Badge */}
        <span
          className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-xs flex-shrink-0"
          style={{
            backgroundColor: update.tagBgColor || "#10B981",
            color: update.tagTextColor || "#FFFFFF",
          }}
        >
          {update.tag || "NEW"}
        </span>

        {/* Pinned Indicator */}
        {update.isPinned && (
          <Pin className="w-3 h-3 text-amber-500 flex-shrink-0 fill-amber-500" />
        )}

        {/* Title */}
        <span className="truncate max-w-[280px] sm:max-w-md font-semibold text-slate-900 group-hover:text-emerald-700 transition">
          {update.title}
        </span>

        {/* Action Icon Indicator */}
        <span className="text-slate-400 group-hover:text-emerald-600 transition flex-shrink-0">
          {isDownload ? (
            <Download className="w-3 h-3 text-blue-600" />
          ) : isExternal ? (
            <ExternalLink className="w-3 h-3 text-purple-600" />
          ) : isCustomPage ? (
            <FileText className="w-3 h-3 text-emerald-600" />
          ) : (
            <ChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          )}
        </span>
      </Link>
    );
  };

  return (
    <section className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 py-2.5 px-4 sm:px-6 lg:px-8 border-b border-emerald-800/40 relative z-20 shadow-inner">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        {/* Left Label */}
        <div className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
          <Megaphone className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="hidden sm:inline">Important Updates</span>
          <span className="sm:hidden">Updates</span>
        </div>

        {/* Horizontal Scroll / Marquee Container */}
        <div className="flex-1 overflow-x-auto no-scrollbar py-0.5">
          <div className="flex items-center gap-2.5 whitespace-nowrap">
            {updates.map((update) => renderUpdateLink(update))}
          </div>
        </div>
      </div>
    </section>
  );
}
