"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  Download,
  CheckCircle2,
  X,
  Calendar,
  Loader2,
} from "lucide-react";
import { AdalatUpdate } from "@/types";
import {
  getAllProceedings,
  deleteProceeding,
} from "@/lib/services/court.service";
import { getInlineFileUrl } from "@/lib/utils";

export function CourtProceedingsTable() {
  const [proceedings, setProceedings] = useState<AdalatUpdate[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedProceeding, setSelectedProceeding] = useState<AdalatUpdate | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProceedings = async () => {
    setLoading(true);
    try {
      const data = await getAllProceedings();
      setProceedings(data);
    } catch (err) {
      console.error("Failed to load court proceedings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProceedings();
  }, []);

  const showToast = (text: string) => {
    setToastMessage(text);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDelete = async (id: string, subject: string) => {
    if (confirm(`Are you sure you want to delete proceeding "${subject}"?`)) {
      await deleteProceeding(id);
      await fetchProceedings();
      if (selectedProceeding?.id === id) setSelectedProceeding(null);
      showToast("Proceeding removed successfully.");
    }
  };

  const filteredProceedings = proceedings.filter((p) => {
    const matchesSearch =
      p.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.minutes && p.minutes.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-100 text-emerald-800";
      case "Upcoming":
        return "bg-amber-100 text-amber-800";
      case "Order Passed":
        return "bg-purple-100 text-purple-800";
      case "Minutes Published":
        return "bg-blue-100 text-blue-800";
      case "In Progress":
        return "bg-cyan-100 text-cyan-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-primary text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Standard Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-border shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-text-primary">Court Proceedings & Orders</h1>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-primary-light text-primary">
              {proceedings.length} Records
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage High Court writs, National Green Tribunal hearings, Lok Adalat compromise records, and certified orders.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/court/proceedings/new"
            className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Proceeding</span>
          </Link>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-border shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by case subject, description, or minutes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-gray-50/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-gray-500 font-bold px-1">Status:</span>
          {[
            { id: "ALL", label: "All" },
            { id: "Upcoming", label: "Upcoming" },
            { id: "In Progress", label: "In Progress" },
            { id: "Completed", label: "Completed" },
            { id: "Minutes Published", label: "Minutes" },
            { id: "Order Passed", label: "Orders" },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${statusFilter === st.id
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl border border-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/75 border-b border-border text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Subject & Case Matter</th>
                <th className="py-3.5 px-4">Hearing / Order Date</th>
                <th className="py-3.5 px-4">Summary & Minutes</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Document</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin text-primary" />
                    <p className="font-bold text-gray-600 text-sm">Loading court proceedings...</p>
                  </td>
                </tr>
              ) : filteredProceedings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    <FileText className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                    <p className="font-bold text-gray-600 text-sm">No court proceedings found</p>
                    <p className="text-xs mt-1">Try adjusting your search query or status filter.</p>
                  </td>
                </tr>
              ) : (
                filteredProceedings.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50/80 transition-colors group"
                  >
                    {/* Subject */}
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="font-bold text-text-primary group-hover:text-primary transition-colors text-sm line-clamp-2">
                        {item.subject}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-gray-700">
                      <div className="flex items-center gap-1.5 font-bold">
                        <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>{item.date}</span>
                      </div>
                    </td>

                    {/* Summary & Minutes */}
                    <td className="py-3.5 px-4 max-w-md text-gray-600">
                      <div className="line-clamp-2 leading-relaxed">
                        {item.minutes || item.description}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${getStatusBadge(
                          item.status
                        )}`}
                      >
                        {item.status || "Upcoming"}
                      </span>
                    </td>

                    {/* Document */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {item.pdfUrl ? (
                        <a
                          href={item.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary-light text-primary hover:bg-primary-hover hover:text-white font-bold transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </a>
                      ) : (
                        <span className="text-gray-400 italic">No File</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => setSelectedProceeding(item)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-primary hover:bg-primary-light transition-colors"
                          title="View Full Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <Link
                          href={`/admin/court/proceedings/${item.id}/edit`}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                          title="Edit Proceeding"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id, item.subject)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                          title="Delete Proceeding"
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

      {/* View Details Modal */}
      {selectedProceeding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-border p-6 space-y-6">
            <div className="flex items-start justify-between border-b border-gray-100 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getStatusBadge(
                      selectedProceeding.status
                    )}`}
                  >
                    {selectedProceeding.status || "Upcoming"}
                  </span>
                  <span className="text-xs text-gray-500 font-bold flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    {selectedProceeding.date}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-text-primary">{selectedProceeding.subject}</h3>
              </div>
              <button
                onClick={() => setSelectedProceeding(null)}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
              <h4 className="text-xs font-bold text-gray-700 uppercase">Case Matter & Description</h4>
              <p className="text-xs text-gray-800 leading-relaxed">{selectedProceeding.description}</p>
            </div>

            {selectedProceeding.minutes && (
              <div className="p-4 rounded-2xl bg-primary-light/30 border border-primary/20 space-y-2">
                <h4 className="text-xs font-bold text-primary uppercase">Recorded Minutes & Bench Directions</h4>
                <p className="text-xs text-gray-900 font-medium leading-relaxed">{selectedProceeding.minutes}</p>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              {selectedProceeding.pdfUrl ? (
                <a
                  href={getInlineFileUrl(selectedProceeding.pdfUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-primary text-white hover:bg-primary-hover transition-colors shadow-xs cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Order Document</span>
                </a>
              ) : (
                <span className="text-xs text-gray-400">No document attached</span>
              )}

              <div className="flex gap-2">
                <Link
                  href={`/admin/court/proceedings/${selectedProceeding.id}/edit`}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-gray-800 hover:bg-gray-900 text-white transition-colors"
                >
                  Edit
                </Link>
                <button
                  onClick={() => setSelectedProceeding(null)}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
