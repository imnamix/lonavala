"use client";

import { useState } from "react";
import { Bell, Search, Filter } from "lucide-react";
import { NOTICES_AND_CIRCULARS } from "@/data/mockData";
import { NoticeCard } from "@/components/shared/NoticeCard";
import { SearchBar } from "@/components/shared/SearchBar";

export default function NoticesPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<string>("All");

  const tabs = ["All", "Notices", "Circulars", "Orders", "News", "Events"];

  const filteredNotices = NOTICES_AND_CIRCULARS.filter((notice) => {
    const matchesSearch =
      notice.title.toLowerCase().includes(search.toLowerCase()) ||
      notice.description.toLowerCase().includes(search.toLowerCase()) ||
      notice.refNo.toLowerCase().includes(search.toLowerCase()) ||
      notice.department.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      activeTab === "All" || notice.category === activeTab;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="py-10">
      {/* Header */}
      <div className="bg-primary-light/60 border-y border-border py-12 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-white px-3 py-1 rounded-full border border-border">
              Official Gazettes
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary mt-3">
              Notices, Circulars & Announcements
            </h1>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              Official public notices, municipal orders, circulars, press statements, and council meeting notifications.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Search & Tabs */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-border shadow-xs">
            <div className="w-full sm:max-w-md">
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Search notices by keyword, title, ref no..."
              />
            </div>
            <div className="text-xs font-semibold text-gray-500 shrink-0">
              Showing <strong className="text-primary">{filteredNotices.length}</strong> Records
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === tab
                    ? "bg-primary text-white shadow-xs"
                    : "bg-white border border-border text-gray-700 hover:bg-primary-light hover:text-primary"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Notices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotices.map((notice) => (
            <NoticeCard key={notice.id} notice={notice} />
          ))}
        </div>
      </div>
    </div>
  );
}
