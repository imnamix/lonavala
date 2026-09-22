"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, ArrowRight } from "lucide-react";
import { NoticeCard } from "@/components/shared/NoticeCard";
import { useLanguage } from "@/context/LanguageContext";
import { getAllNotices, NoticeRecord } from "@/lib/services/notice.service";
import { NoticeItem } from "@/types";

export function NoticeBoard() {
  const [activeTab, setActiveTab] = useState<string>("All");
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { dict } = useLanguage();

  useEffect(() => {
    async function loadNotices() {
      try {
        setLoading(true);
        const records = await getAllNotices();
        if (records && records.length > 0) {
          const published = records.filter(
            (r) => r.status === "Published" || !r.status
          );
          const mapped: NoticeItem[] = published.map((r: NoticeRecord) => ({
            id: r.id,
            title: r.title,
            category: (r.category === "Gazettes"
              ? "Notices"
              : r.category) as NoticeItem["category"],
            date: r.date,
            department: r.department,
            refNo: r.refNo,
            isNew: r.isNew,
            downloadSize: r.fileSize || "1.2 MB",
            description: r.description.replace(/<[^>]*>?/gm, "").substring(0, 160) + "...",
          }));
          setNotices(mapped);
        } else {
          setNotices([]);
        }
      } catch (err) {
        console.warn("Could not load notices for homepage board:", err);
      } finally {
        setLoading(false);
      }
    }
    loadNotices();
  }, []);

  const tabs: { key: string; label: string }[] = [
    { key: "All", label: dict.notices.tabs.all },
    { key: "Notices", label: dict.notices.tabs.notices },
    { key: "Circulars", label: dict.notices.tabs.circulars },
    { key: "Orders", label: dict.notices.tabs.orders },
    { key: "News", label: dict.notices.tabs.news },
  ];

  const filteredNotices =
    activeTab === "All"
      ? notices
      : notices.filter((n) => n.category === activeTab);

  return (
    <section className="py-16 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
              <Bell className="w-3.5 h-3.5 text-emerald-600" />
              <span>{dict.notices.badge}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              {dict.notices.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {dict.notices.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/notices"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white text-xs font-bold transition-all shadow-xs"
            >
              <span>{dict.notices.viewAll}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${activeTab === tab.key
                ? "bg-emerald-800 text-white shadow-xs"
                : "bg-slate-50 border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notice Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between animate-pulse"
              >
                <div>
                  {/* Category badge & date */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="h-5 w-20 bg-slate-200 rounded-full" />
                    <div className="h-4 w-24 bg-slate-100 rounded" />
                  </div>
                  {/* Title */}
                  <div className="h-5 bg-slate-200 rounded-md w-11/12 mb-2" />
                  <div className="h-5 bg-slate-200 rounded-md w-3/4 mb-3" />
                  {/* Description */}
                  <div className="h-3.5 bg-slate-100 rounded w-full mb-1.5" />
                  <div className="h-3.5 bg-slate-100 rounded w-4/5 mb-4" />
                </div>
                {/* Bottom meta bar */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="h-4 w-28 bg-slate-100 rounded" />
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-12 bg-slate-100 rounded" />
                    <div className="h-6 w-16 bg-slate-100 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredNotices.length === 0 ? (
          <div className="p-10 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs font-medium">
            No notices currently published in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotices.slice(0, 6).map((notice) => (
              <NoticeCard key={notice.id} notice={notice} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
