"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  RefreshCw,
  Eye,
  Pin,
  ExternalLink,
  Download,
  Link2,
  FileCode2,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  BarChart3,
  Tag,
  AlertCircle,
} from "lucide-react";
import {
  ImportantUpdateRecord,
  UpdateActionType,
  getAllImportantUpdates,
  toggleImportantUpdateActive,
  toggleImportantUpdatePin,
  deleteImportantUpdate,
} from "@/lib/services/important-update.service";
import { formatDate } from "@/lib/utils";

export default function AdminUpdatesPage() {
  const [updates, setUpdates] = useState<ImportantUpdateRecord[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const fetchUpdates = async () => {
    try {
      setLoading(true);
      const res = await getAllImportantUpdates({
        search: searchQuery || undefined,
        actionType:
          actionFilter !== "ALL" ? (actionFilter as UpdateActionType) : undefined,
        isActive:
          statusFilter === "ACTIVE"
            ? true
            : statusFilter === "INACTIVE"
            ? false
            : undefined,
        limit: 50,
      });
      setUpdates(res.items || []);
      setTotalCount(res.pagination?.total || 0);
    } catch (err: any) {
      console.error("Failed to fetch updates:", err);
      setFeedback({
        type: "error",
        message: err.message || "Failed to fetch important updates.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdates();
  }, [actionFilter, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUpdates();
  };

  const handleToggleActive = async (id: number) => {
    try {
      const updated = await toggleImportantUpdateActive(id);
      setUpdates((prev) =>
        prev.map((item) => (item.id === id ? { ...item, isActive: updated.isActive } : item))
      );
      setFeedback({
        type: "success",
        message: `Update #${id} is now ${updated.isActive ? "active" : "inactive"}.`,
      });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err.message || "Failed to toggle status.",
      });
    }
  };

  const handleTogglePin = async (id: number) => {
    try {
      const updated = await toggleImportantUpdatePin(id);
      setUpdates((prev) =>
        prev.map((item) => (item.id === id ? { ...item, isPinned: updated.isPinned } : item))
      );
      setFeedback({
        type: "success",
        message: `Update #${id} is now ${updated.isPinned ? "pinned to top" : "unpinned"}.`,
      });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err.message || "Failed to toggle pinned status.",
      });
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (confirm(`Are you sure you want to delete update: "${title}"?`)) {
      try {
        await deleteImportantUpdate(id);
        setUpdates((prev) => prev.filter((item) => item.id !== id));
        setFeedback({
          type: "success",
          message: "Update deleted successfully.",
        });
        setTimeout(() => setFeedback(null), 3000);
      } catch (err: any) {
        setFeedback({
          type: "error",
          message: err.message || "Failed to delete update.",
        });
      }
    }
  };

  // Metrics calculations
  const totalActive = updates.filter((u) => u.isActive).length;
  const totalPinned = updates.filter((u) => u.isPinned).length;
  const totalViews = updates.reduce((sum, u) => sum + (u.viewsCount || 0), 0);
  const totalCustomPages = updates.filter((u) => u.actionType === "CUSTOM_PAGE").length;

  const renderActionBadge = (update: ImportantUpdateRecord) => {
    switch (update.actionType) {
      case "CUSTOM_PAGE":
        return (
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
            <FileCode2 className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="font-semibold">Dedicated Page</span>
          </div>
        );
      case "DOWNLOAD_FILE":
        return (
          <div className="flex items-center gap-1.5 text-xs text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
            <Download className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="font-semibold">File Download</span>
          </div>
        );
      case "EXTERNAL_LINK":
        return (
          <div className="flex items-center gap-1.5 text-xs text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-100">
            <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="font-semibold">External URL</span>
          </div>
        );
      case "INTERNAL_ROUTE":
        return (
          <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-100">
            <Link2 className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="font-semibold">Portal Page</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">
              Important Updates & Tags
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              {totalCount} Total
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage tags and click actions (download file, external link, internal route, or custom page).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchUpdates}
            className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition"
            title="Refresh List"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <Link
            href="/admin/updates/new"
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-sm hover:shadow transition"
          >
            <Plus className="w-4 h-4" />
            <span>New Update</span>
          </Link>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Active on Portal
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {totalActive}
          </div>
          <span className="text-[11px] text-emerald-700 font-medium">
            Live on homepage
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Pinned to Top
            </span>
            <Pin className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {totalPinned}
          </div>
          <span className="text-[11px] text-amber-700 font-medium">
            Priority marquee
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Custom Pages
            </span>
            <FileCode2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {totalCustomPages}
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Rich article views
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Citizen Views
            </span>
            <BarChart3 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {totalViews}
          </div>
          <span className="text-[11px] text-blue-700 font-medium">
            Total engagements
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Action Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {[
              { id: "ALL", label: "All Updates" },
              { id: "CUSTOM_PAGE", label: "Custom Pages" },
              { id: "DOWNLOAD_FILE", label: "File Downloads" },
              { id: "EXTERNAL_LINK", label: "External Links" },
              { id: "INTERNAL_ROUTE", label: "Internal Pages" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActionFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  actionFilter === tab.id
                    ? "bg-emerald-700 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center gap-2 w-full md:w-72"
          >
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search updates..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <button
              type="submit"
              className="px-3 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded-xl hover:bg-slate-800"
            >
              Filter
            </button>
          </form>
        </div>
      </div>

      {/* Updates Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
            <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
            <span className="text-xs font-medium">Loading updates...</span>
          </div>
        ) : updates.length === 0 ? (
          <div className="py-16 text-center text-slate-500 space-y-3">
            <Sparkles className="w-10 h-10 text-slate-300 mx-auto" />
            <div className="text-sm font-semibold text-slate-700">
              No important updates found
            </div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Create a new update or adjust your filters to see announcement tags here.
            </p>
            <Link
              href="/admin/updates/new"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-700 rounded-xl hover:bg-emerald-800"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create First Update</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4">Tag & Headline</th>
                  <th className="py-3.5 px-4">On-Click Action</th>
                  <th className="py-3.5 px-4 text-center">Pin</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-center">Views</th>
                  <th className="py-3.5 px-4">Created Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {updates.map((update) => (
                  <tr
                    key={update.id}
                    className="hover:bg-slate-50/75 transition-colors group"
                  >
                    {/* Tag & Headline */}
                    <td className="py-3.5 px-4 max-w-md">
                      <div className="flex items-start gap-2.5">
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide flex-shrink-0 mt-0.5 shadow-xs"
                          style={{
                            backgroundColor: update.tagBgColor || "#10B981",
                            color: update.tagTextColor || "#FFFFFF",
                          }}
                        >
                          {update.tag || "NEW"}
                        </span>
                        <div>
                          <Link
                            href={`/admin/updates/${update.id}`}
                            className="font-bold text-slate-900 hover:text-emerald-700 transition line-clamp-2"
                          >
                            {update.title}
                          </Link>
                          {update.summary && (
                            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                              {update.summary}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Action Type & Target */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        {renderActionBadge(update)}
                        <div className="text-[11px] text-slate-400 truncate max-w-[200px]">
                          {update.actionType === "CUSTOM_PAGE" &&
                            `/updates/${update.slug || update.id}`}
                          {update.actionType === "DOWNLOAD_FILE" &&
                            (update.fileName || "Download link")}
                          {update.actionType === "EXTERNAL_LINK" &&
                            update.externalUrl}
                          {update.actionType === "INTERNAL_ROUTE" &&
                            update.internalRoute}
                        </div>
                      </div>
                    </td>

                    {/* Pinned Button */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleTogglePin(update.id)}
                        className={`p-1.5 rounded-lg border transition ${
                          update.isPinned
                            ? "bg-amber-50 text-amber-600 border-amber-200"
                            : "text-slate-300 border-transparent hover:text-slate-500 hover:bg-slate-100"
                        }`}
                        title={update.isPinned ? "Pinned (Click to unpin)" : "Pin to top"}
                      >
                        <Pin className="w-4 h-4" />
                      </button>
                    </td>

                    {/* Status Toggle Switch */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(update.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition ${
                          update.isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            update.isActive ? "bg-emerald-600" : "bg-slate-400"
                          }`}
                        />
                        <span>{update.isActive ? "Active" : "Inactive"}</span>
                      </button>
                    </td>

                    {/* Views Count */}
                    <td className="py-3.5 px-4 text-center font-mono font-medium text-slate-600">
                      {update.viewsCount || 0}
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                      {formatDate(update.createdDate)}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {update.actionType === "CUSTOM_PAGE" ? (
                          <Link
                            href={`/updates/${update.slug || update.id}`}
                            target="_blank"
                            className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition"
                            title="Preview Citizen View"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        ) : update.actionType === "DOWNLOAD_FILE" && update.fileUrl ? (
                          <a
                            href={update.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 text-slate-400 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition"
                            title="Download File"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        ) : update.actionType === "EXTERNAL_LINK" && update.externalUrl ? (
                          <a
                            href={update.externalUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 text-slate-400 hover:text-purple-700 hover:bg-slate-100 rounded-lg transition"
                            title="Visit Link"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        ) : null}

                        <Link
                          href={`/admin/updates/${update.id}`}
                          className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(update.id, update.title)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
