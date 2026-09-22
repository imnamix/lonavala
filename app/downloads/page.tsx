"use client";

import { useState, useEffect } from "react";
import {
  Download,
  FileText,
  Search,
  Calendar,
  Clock,
  Loader2,
  FileDown,
  Layers,
  Sparkles,
} from "lucide-react";
import { getResolutions } from "@/lib/services/resolution.service";
import { CouncilResolution } from "@/types";
import { SearchBar } from "@/components/shared/SearchBar";

export default function DownloadsPage() {
  const [resolutions, setResolutions] = useState<CouncilResolution[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("All");

  useEffect(() => {
    async function loadResolutions() {
      try {
        setLoading(true);
        const data = await getResolutions({ isActive: true });
        setResolutions(data || []);
      } catch (err) {
        console.error("Failed to load council resolutions for downloads:", err);
      } finally {
        setLoading(false);
      }
    }
    loadResolutions();
  }, []);

  // Helper to extract year from date strings
  const extractYears = (res: CouncilResolution): string[] => {
    const years: string[] = [];
    if (res.resolutionDate) {
      const match = res.resolutionDate.match(/\b(19\d\d|20\d\d)\b/);
      if (match) years.push(match[1]);
    }
    if (res.durationFrom) {
      const match = res.durationFrom.match(/\b(19\d\d|20\d\d)\b/);
      if (match) years.push(match[1]);
    }
    if (res.durationTo) {
      const match = res.durationTo.match(/\b(19\d\d|20\d\d)\b/);
      if (match) years.push(match[1]);
    }
    if (res.createdDate) {
      const yr = new Date(res.createdDate).getFullYear().toString();
      years.push(yr);
    }
    return Array.from(new Set(years));
  };

  // Derive unique years sorted in descending order
  const allYears = Array.from(
    new Set(
      resolutions.flatMap((r) => extractYears(r)).filter((y) => y && !isNaN(Number(y)))
    )
  ).sort((a, b) => Number(b) - Number(a));

  const yearTabs = ["All", ...allYears];

  // Filter resolutions
  const filteredResolutions = resolutions.filter((res) => {
    const q = search.toLowerCase();
    const matchesSearch =
      search === "" ||
      res.title.toLowerCase().includes(q) ||
      (res.marathiTitle && res.marathiTitle.toLowerCase().includes(q)) ||
      (res.meetingType && res.meetingType.toLowerCase().includes(q));

    const resYears = extractYears(res);
    const matchesYear =
      selectedYear === "All" || resYears.includes(selectedYear);

    return matchesSearch && matchesYear;
  });

  return (
    <div className="py-10">
      {/* Header Banner */}
      <div className="bg-primary-light/60 border-y border-border py-12 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-white px-3 py-1 rounded-full border border-border">
              Public Repository
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary mt-3">
              Council Resolutions & Documents
            </h1>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              Official records of Lonavala Municipal Council General Body meeting minutes, statutory resolutions, and municipal gazettes.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Search & Year Tabs Bar */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-border shadow-xs">
            <div className="w-full sm:max-w-md">
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Search resolutions by title or type..."
              />
            </div>
            <div className="text-xs font-semibold text-gray-500 shrink-0">
              Showing <strong className="text-primary">{filteredResolutions.length}</strong> of{" "}
              {resolutions.length} Resolutions
            </div>
          </div>

          {/* Year Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {yearTabs.map((yr) => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedYear === yr
                    ? "bg-primary text-white shadow-xs scale-100"
                    : "bg-white border border-border text-gray-700 hover:bg-primary-light hover:text-primary"
                }`}
              >
                <Calendar className="w-3.5 h-3.5 opacity-70" />
                <span>{yr === "All" ? "All Years" : yr}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Council Resolutions Grid */}
        {loading ? (
          <div className="py-20 text-center bg-white rounded-2xl border border-border shadow-xs space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
            <p className="text-sm font-semibold text-text-muted">
              Loading official council resolutions...
            </p>
          </div>
        ) : filteredResolutions.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-dashed border-gray-200 p-8 space-y-2">
            <FileText className="w-10 h-10 text-gray-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">
              No resolutions found
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              {search || selectedYear !== "All"
                ? "Try adjusting your search query or selecting another year."
                : "No council resolutions are currently published."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredResolutions.map((res) => {
              const formattedDate = res.resolutionDate
                ? new Date(res.resolutionDate).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : null;

              return (
                <div
                  key={res.id}
                  className="bg-white rounded-2xl border border-border p-5 shadow-xs hover:border-emerald-600/40 hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-lg">
                        {res.meetingType || "Council Resolution"}
                      </span>
                      {res.fileSize && (
                        <span className="text-[10px] font-bold text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                          PDF • {res.fileSize}
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="font-bold text-base text-text-primary group-hover:text-emerald-800 transition-colors leading-snug">
                        {res.title}
                      </h3>
                      {res.marathiTitle && (
                        <p className="text-xs text-slate-500 font-marathi mt-0.5">
                          {res.marathiTitle}
                        </p>
                      )}
                    </div>

                    <div className="text-xs text-gray-500 flex flex-wrap items-center gap-2 pt-1">
                      {formattedDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                          {formattedDate}
                        </span>
                      )}
                      {(res.durationFrom || res.durationTo) && (
                        <span className="flex items-center gap-1 font-semibold text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80">
                          <Clock className="w-3 h-3 text-emerald-600" />
                          Duration: {res.durationFrom || "—"} - {res.durationTo || "—"}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                      <FileDown className="w-4 h-4" />
                      <span>Official Document</span>
                    </div>

                    {res.fileUrl ? (
                      <a
                        href={res.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download PDF</span>
                      </a>
                    ) : (
                      <span className="text-xs font-medium text-gray-400 italic">
                        Document Pending
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
