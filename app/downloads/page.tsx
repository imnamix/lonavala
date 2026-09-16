"use client";

import { useState } from "react";
import { Download, FileText, Search, Filter, Calendar, Building, CheckCircle2 } from "lucide-react";
import { DOWNLOADS_LIST } from "@/data/mockData";
import { SearchBar } from "@/components/shared/SearchBar";

export default function DownloadsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = [
    "All",
    "Forms",
    "Reports",
    "Circulars",
    "Orders",
    "Tender",
    "Recruitment",
  ];

  const filteredDocs = DOWNLOADS_LIST.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(search.toLowerCase()) ||
      doc.department.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || doc.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="py-10">
      {/* Header */}
      <div className="bg-primary-light/60 border-y border-border py-12 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-white px-3 py-1 rounded-full border border-border">
              Public Document Repository
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary mt-3">
              Forms, Reports & Downloads
            </h1>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              Download official municipal application forms, environmental status reports, citizen charter booklets, and tender notices.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Search & Filter Bar */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-border shadow-xs">
            <div className="w-full sm:max-w-md">
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Search documents by title or department..."
              />
            </div>
            <div className="text-xs font-semibold text-gray-500 shrink-0">
              Showing <strong className="text-primary">{filteredDocs.length}</strong> of{" "}
              {DOWNLOADS_LIST.length} Documents
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-primary text-white shadow-xs"
                    : "bg-white border border-border text-gray-700 hover:bg-primary-light hover:text-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Documents Grid / Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl border border-border p-5 shadow-xs hover:border-primary hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold text-primary bg-primary-light px-2.5 py-0.5 rounded-full">
                    {doc.category}
                  </span>
                  <span className="text-[10px] font-bold text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                    {doc.fileType} • {doc.fileSize}
                  </span>
                </div>

                <h3 className="font-bold text-sm sm:text-base text-text-primary leading-snug">
                  {doc.title}
                </h3>

                <div className="text-xs text-gray-500 flex items-center gap-4 pt-1">
                  <span className="flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-gray-400" />
                    {doc.department}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    {doc.date}
                  </span>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] text-gray-400">
                  {doc.downloadCount} Downloads
                </span>

                <a
                  href="#"
                  download
                  className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
