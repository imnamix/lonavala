"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, ArrowRight, Download } from "lucide-react";
import { NOTICES_AND_CIRCULARS } from "@/data/mockData";
import { NoticeCard } from "@/components/shared/NoticeCard";
import { useLanguage } from "@/context/LanguageContext";

export function NoticeBoard() {
  const [activeTab, setActiveTab] = useState<string>("All");
  const { dict } = useLanguage();

  const tabs: { key: string; label: string }[] = [
    { key: "All", label: dict.notices.tabs.all },
    { key: "Notices", label: dict.notices.tabs.notices },
    { key: "Circulars", label: dict.notices.tabs.circulars },
    { key: "Orders", label: dict.notices.tabs.orders },
    { key: "News", label: dict.notices.tabs.news },
    { key: "Events", label: dict.notices.tabs.events },
  ];

  const filteredNotices =
    activeTab === "All"
      ? NOTICES_AND_CIRCULARS
      : NOTICES_AND_CIRCULARS.filter((n) => n.category === activeTab);

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
              href="/downloads"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{dict.notices.repository}</span>
            </Link>
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
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? "bg-emerald-800 text-white shadow-xs"
                  : "bg-slate-50 border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notice Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotices.slice(0, 6).map((notice) => (
            <NoticeCard key={notice.id} notice={notice} />
          ))}
        </div>
      </div>
    </section>
  );
}
