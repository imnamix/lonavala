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
  Calendar,
  Eye,
  FileCode2,
  FileText,
  AlertCircle,
  Tag,
  Clock,
  ArrowUpRight,
  FolderDown,
  Layers,
} from "lucide-react";
import {
  ImportantUpdateRecord,
  getActiveImportantUpdates,
} from "@/lib/services/important-update.service";
import { formatDate } from "@/lib/utils";

export function ImportantUpdatesSection() {
  const [updates, setUpdates] = useState<ImportantUpdateRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("ALL");

  useEffect(() => {
    async function fetchUpdates() {
      try {
        setLoading(true);
        const data = await getActiveImportantUpdates(12);
        setUpdates(data);
      } catch (err) {
        console.error("Failed to load active updates for homepage:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUpdates();
  }, []);

  if (loading) {
    return (
      <section className="py-12 bg-slate-50/50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-6 w-48 bg-slate-200 rounded-full animate-pulse mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-44 bg-white rounded-2xl border border-slate-200 animate-pulse p-6"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (updates.length === 0) {
    return null;
  }

  // Tags filter list
  const uniqueTags = ["ALL", ...Array.from(new Set(updates.map((u) => u.tag || "NEW")))];

  const filteredUpdates =
    activeFilter === "ALL"
      ? updates
      : updates.filter((u) => u.tag === activeFilter);

  const getActionDetails = (update: ImportantUpdateRecord) => {
    switch (update.actionType) {
      case "DOWNLOAD_FILE":
        return {
          href: update.fileUrl || "#",
          label: update.fileSize ? `Download (${update.fileSize})` : "Download Document",
          icon: Download,
          isExternal: true,
          badgeText: "PDF / Download",
          badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
        };
      case "EXTERNAL_LINK":
        return {
          href: update.externalUrl || "#",
          label: "Visit External Portal",
          icon: ExternalLink,
          isExternal: true,
          badgeText: "External Link",
          badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
        };
      case "INTERNAL_ROUTE":
        return {
          href: update.internalRoute || "/notices",
          label: "View Portal Page",
          icon: ArrowRight,
          isExternal: false,
          badgeText: "Civic Page",
          badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
        };
      case "CUSTOM_PAGE":
      default:
        return {
          href: `/updates/${update.slug || update.id}`,
          label: "Read Full Details",
          icon: ArrowUpRight,
          isExternal: false,
          badgeText: "Detailed Bulletin",
          badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
        };
    }
  };

  return (
    <section className="py-14 bg-gradient-to-b from-slate-50/80 via-white to-slate-50/50 border-b border-slate-200/80 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-teal-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 text-emerald-900 text-xs font-bold border border-emerald-300 shadow-2xs">
              <Megaphone className="w-3.5 h-3.5 text-emerald-700 animate-pulse" />
              <span>Important Updates & Civic Alerts</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2.5 tracking-tight">
              Latest Announcements & Key Information
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Official circulars, citizen helplines, schemes, and direct public downloads released by Lonavala Municipal Council.
            </p>
          </div>

          {/* Quick Tag Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {uniqueTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveFilter(tag)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-2xs ${
                  activeFilter === tag
                    ? "bg-emerald-800 text-white shadow-xs scale-105"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {tag === "ALL" ? "All Updates" : tag}
              </button>
            ))}
          </div>
        </div>

        {/* Updates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUpdates.map((update) => {
            const action = getActionDetails(update);
            const ActionIcon = action.icon;

            return (
              <div
                key={update.id}
                className="group relative bg-white rounded-3xl border border-slate-200 hover:border-emerald-500/60 p-6 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Tag Badge & Action Pill */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span
                        className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-2xs"
                        style={{
                          backgroundColor: update.tagBgColor || "#10B981",
                          color: update.tagTextColor || "#FFFFFF",
                        }}
                      >
                        {update.tag || "NOTICE"}
                      </span>

                      {update.isPinned && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          <Pin className="w-3 h-3 text-amber-600 fill-amber-500" />
                          <span>Pinned</span>
                        </span>
                      )}
                    </div>

                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${action.badgeColor}`}
                    >
                      {action.badgeText}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-800 transition line-clamp-2 leading-snug">
                    {update.title}
                  </h3>

                  {/* Summary / Excerpt */}
                  {update.summary && (
                    <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
                      {update.summary}
                    </p>
                  )}
                </div>

                {/* Footer Bar: Date + Action Link */}
                <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(update.createdDate)}</span>
                  </div>

                  <Link
                    href={action.href}
                    target={action.isExternal ? "_blank" : undefined}
                    rel={action.isExternal ? "noopener noreferrer" : undefined}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs text-emerald-800 bg-emerald-50 hover:bg-emerald-700 hover:text-white border border-emerald-200 hover:border-emerald-700 transition-all duration-200 group-hover:shadow-xs"
                  >
                    <span>{action.label}</span>
                    <ActionIcon className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
