"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  FileText,
  Search,
  RefreshCw,
} from "lucide-react";
import {
  NoticeRecord,
  NoticeWorkflowStatus,
  getAllNotices,
  updateNotice,
  deleteNotice,
} from "@/lib/services/notice.service";
import { formatDate } from "@/lib/utils";

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<NoticeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const data = await getAllNotices();
      setNotices(data);
    } catch (err) {
      console.error("Failed to fetch notices:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const cycleStatus = async (id: string, currentStatus: NoticeWorkflowStatus) => {
    const nextStatus: Record<NoticeWorkflowStatus, NoticeWorkflowStatus> = {
      Draft: "Review",
      Review: "Published",
      Published: "Draft",
    };
    const newStatus = nextStatus[currentStatus];
    try {
      await updateNotice(id, { status: newStatus });
      setNotices((prev) =>
        prev.map((n) => (n.id === id ? { ...n, status: newStatus } : n))
      );
      setFeedbackMessage(`Notice status updated to "${newStatus}"`);
      setTimeout(() => setFeedbackMessage(null), 3000);
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete notice "${title}"?`)) {
      try {
        await deleteNotice(id);
        setNotices((prev) => prev.filter((n) => n.id !== id));
        setFeedbackMessage("Notice deleted successfully.");
        setTimeout(() => setFeedbackMessage(null), 3000);
      } catch (err) {
        console.error("Failed to delete notice:", err);
      }
    }
  };

  const statusBadge: Record<NoticeWorkflowStatus, string> = {
    Draft: "bg-gray-100 text-gray-700 border-gray-300",
    Review: "bg-amber-100 text-amber-800 border-amber-300",
    Published: "bg-emerald-100 text-emerald-800 border-emerald-300",
  };

  // Filtered notices
  const filteredNotices = notices.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.subject && n.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
      n.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.refNo.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === "All" || n.category === categoryFilter;
    const matchesStatus = statusFilter === "All" || n.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {feedbackMessage && (
        <div className="fixed top-6 right-6 z-50 bg-primary text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Header & New Notice Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-border shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-text-primary">CMS Notices</h1>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-primary-light text-primary">
              {notices.length} Records
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage official municipal notifications, orders, circulars, and gazettes with rich-text editor and key-value directives.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchNotices}
            className="p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-border"
            title="Reload notices"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <Link
            href="/admin/notices/new"
            className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Notice</span>
          </Link>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-border shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, subject, reference number, or issuing department..."
            className="w-full pl-10 pr-4 py-2 bg-primary-surface border border-border rounded-xl text-xs font-semibold text-gray-800 focus:bg-white focus:border-primary focus:outline-hidden"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-primary-surface border border-border rounded-xl font-semibold text-gray-700 text-xs focus:bg-white focus:border-primary focus:outline-hidden"
          >
            <option value="All">All Categories</option>
            <option value="Notices">Notices</option>
            <option value="Circulars">Circulars</option>
            <option value="Orders">Orders</option>
            <option value="Gazettes">Gazettes</option>
            <option value="News">News</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-primary-surface border border-border rounded-xl font-semibold text-gray-700 text-xs focus:bg-white focus:border-primary focus:outline-hidden"
          >
            <option value="All">All Statuses</option>
            <option value="Draft">Draft</option>
            <option value="Review">Under Review</option>
            <option value="Published">Published</option>
          </select>
        </div>
      </div>

      {/* Notice Table */}
      <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-gray-500 text-xs space-y-2">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-primary" />
            <p>Loading notices and gazettes...</p>
          </div>
        ) : filteredNotices.length === 0 ? (
          <div className="p-12 text-center text-gray-500 space-y-3">
            <FileText className="w-8 h-8 text-gray-400 mx-auto" />
            <p className="font-bold text-sm text-gray-700">No notices found</p>
            <p className="text-xs text-gray-400">
              Try adjusting your search criteria or create a new notice.
            </p>
            <Link
              href="/admin/notices/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white font-bold text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Notice</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-primary-surface border-b border-border text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                  <th className="py-4 px-6">Title & Subject</th>
                  <th className="py-4 px-6">Category & Ref</th>
                  <th className="py-4 px-6">Issuing Dept</th>
                  <th className="py-4 px-6">Published Date</th>
                  <th className="py-4 px-6">Directives</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                {filteredNotices.map((n) => (
                  <tr key={n.id} className="hover:bg-primary-light/20 transition-colors">
                    <td className="py-4 px-6 max-w-xs">
                      <p className="font-extrabold text-text-primary line-clamp-1">{n.title}</p>
                      {n.subject && (
                        <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5 font-medium">
                          {n.subject}
                        </p>
                      )}
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary-light text-primary">
                        {n.category}
                      </span>
                      <p className="text-[10px] font-mono text-gray-500 mt-1">{n.refNo || "No Ref"}</p>
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="font-semibold text-gray-700">{n.department}</span>
                      <p className="text-[10px] text-gray-400 truncate max-w-[140px]">
                        {n.issuedByName}
                      </p>
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap text-gray-600 font-medium">
                      {formatDate(n.date)}
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-lg bg-gray-100 text-gray-700 font-bold text-[10px] border border-gray-200">
                        {n.directives?.length || 0} Directives
                      </span>
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      <button
                        onClick={() => cycleStatus(n.id, n.status)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-transform hover:scale-105 cursor-pointer ${
                          statusBadge[n.status]
                        }`}
                        title="Click to cycle status: Draft → Review → Published"
                      >
                        {n.status}
                      </button>
                    </td>

                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/notices/${n.id}`}
                          className="p-2 text-gray-600 hover:text-primary hover:bg-primary-light rounded-xl transition-colors cursor-pointer"
                          title="Edit Notice"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => handleDelete(n.id, n.title)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                          title="Delete Notice"
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
