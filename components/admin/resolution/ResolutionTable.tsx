"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Plus,
  Trash2,
  Edit2,
  Search,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Download,
  Calendar,
  Layers,
  Clock,
} from "lucide-react";
import { CouncilResolution } from "@/types";
import {
  getResolutions,
  deleteResolution,
  toggleResolutionActive,
} from "@/lib/services/resolution.service";

export function ResolutionTable() {
  const [resolutions, setResolutions] = useState<CouncilResolution[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [meetingFilter, setMeetingFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchResolutions = async () => {
    try {
      setLoading(true);
      const data = await getResolutions();
      setResolutions(data);
    } catch (err) {
      console.error("Failed to load council resolutions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResolutions();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleToggleActive = async (id: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await toggleResolutionActive(id);
      setResolutions((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, isActive: r.isActive === false ? true : false } : r
        )
      );
      showToast("Visibility status updated successfully.");
    } catch (err) {
      console.error("Failed to toggle active status:", err);
      showToast("Error updating visibility status.");
    }
  };

  const handleDelete = async (id: string | number, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete resolution '${title}'?`)) {
      try {
        await deleteResolution(id);
        setResolutions((prev) => prev.filter((r) => r.id !== id));
        showToast(`Resolution removed successfully.`);
      } catch (err) {
        console.error("Failed to delete resolution:", err);
        showToast("Failed to delete resolution.");
      }
    }
  };

  // Filter resolutions
  const filteredResolutions = resolutions.filter((r) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      searchQuery === "" ||
      r.title.toLowerCase().includes(q) ||
      (r.meetingType && r.meetingType.toLowerCase().includes(q)) ||
      (r.resolutionDate && r.resolutionDate.toLowerCase().includes(q));

    const matchesMeeting =
      meetingFilter === "ALL" || r.meetingType === meetingFilter;

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE" && r.isActive !== false) ||
      (statusFilter === "INACTIVE" && r.isActive === false);

    return matchesSearch && matchesMeeting && matchesStatus;
  });

  const meetingTypes = Array.from(
    new Set(resolutions.map((r) => r.meetingType).filter(Boolean))
  );

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-surface-dark text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-white/10 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-border shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              Governance & Council
            </span>
            <span className="text-xs text-text-muted">•</span>
            <span className="text-xs font-semibold text-text-muted">
              {resolutions.length} Council Resolutions
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-text-primary mt-0.5">
            Council Resolutions
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Manage municipal council resolutions, types, dates, durations, and attached documents.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchResolutions}
            disabled={loading}
            className="p-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors shadow-2xs"
            title="Refresh List"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-primary" : ""}`} />
          </button>
          <Link
            href="/admin/resolutions/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-md shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Resolution</span>
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-border shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search resolutions by title, type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs focus:outline-none focus:border-primary focus:bg-white transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {meetingTypes.length > 0 && (
            <select
              value={meetingFilter}
              onChange={(e) => setMeetingFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-semibold text-text-primary focus:outline-none focus:border-primary"
            >
              <option value="ALL">All Types</option>
              {meetingTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          )}

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-semibold text-text-primary focus:outline-none focus:border-primary"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active Only</option>
            <option value="INACTIVE">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Resolutions Table */}
      <div className="bg-white rounded-2xl border border-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-text-muted font-bold border-b border-gray-100 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-3.5">Title</th>
                <th className="px-5 py-3.5">Type</th>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5">Duration (Years)</th>
                <th className="px-5 py-3.5">Document</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-text-muted">
                    <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto mb-2" />
                    <span>Loading resolutions...</span>
                  </td>
                </tr>
              ) : filteredResolutions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-text-muted">
                    <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <div className="font-bold text-slate-800">No council resolutions found</div>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {searchQuery
                        ? "Try resetting search filters"
                        : "Click 'Add Resolution' to create the first resolution."}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredResolutions.map((resolution) => (
                  <tr
                    key={resolution.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* Title */}
                    <td className="px-5 py-4 min-w-[220px]">
                      <div className="font-bold text-sm text-slate-900 group-hover:text-primary transition-colors">
                        {resolution.title}
                      </div>
                    </td>

                    {/* Type */}
                    <td className="px-5 py-4 min-w-[150px]">
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-semibold text-[11px] border border-emerald-100">
                        {resolution.meetingType || "Resolution"}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4 min-w-[120px]">
                      {resolution.resolutionDate ? (
                        <div className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{resolution.resolutionDate}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                    </td>

                    {/* Duration (Years) */}
                    <td className="px-5 py-4 min-w-[150px]">
                      {resolution.durationFrom || resolution.durationTo ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px] font-bold">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {resolution.durationFrom || "—"} - {resolution.durationTo || "—"}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                    </td>

                    {/* File / Download */}
                    <td className="px-5 py-4 min-w-[120px]">
                      {resolution.fileUrl ? (
                        <a
                          href={resolution.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] border border-emerald-200 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>File</span>
                        </a>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">No File</span>
                      )}
                    </td>

                    {/* Status Toggle */}
                    <td className="px-5 py-4">
                      <button
                        onClick={(e) => handleToggleActive(resolution.id, e)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                          resolution.isActive !== false
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
                            : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200"
                        }`}
                        title="Click to toggle visibility"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            resolution.isActive !== false ? "bg-emerald-500" : "bg-gray-400"
                          }`}
                        />
                        <span>{resolution.isActive !== false ? "Active" : "Inactive"}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/resolutions/${resolution.id}`}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-primary hover:bg-primary/5 transition-colors"
                          title="Edit Resolution"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={(e) => handleDelete(resolution.id, resolution.title, e)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete Resolution"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
