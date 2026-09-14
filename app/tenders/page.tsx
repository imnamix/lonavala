"use client";

import { useState } from "react";
import { FileText, Download, Search, Filter, ChevronLeft, ChevronRight, IndianRupee } from "lucide-react";
import { TENDERS_LIST } from "@/data/mockData";
import { SearchBar } from "@/components/shared/SearchBar";

export default function TendersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const filtered = TENDERS_LIST.filter((t) => {
    const matchesSearch =
      t.tenderId.toLowerCase().includes(search.toLowerCase()) ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.department.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "All" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const statusBadgeColor: Record<string, string> = {
    Live: "bg-emerald-100 text-emerald-800 border-emerald-300",
    "Under Evaluation": "bg-amber-100 text-amber-800 border-amber-300",
    Awarded: "bg-blue-100 text-blue-800 border-blue-300",
    Closed: "bg-gray-100 text-gray-800 border-gray-300",
  };

  return (
    <div className="py-10">
      {/* Header */}
      <div className="bg-[#E8F5E9]/60 border-y border-[#D9E8DD] py-12 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2E8B57] bg-white px-3 py-1 rounded-full border border-[#D9E8DD]">
              e-Procurement Portal
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] mt-3">
              Active Tenders & Contracts
            </h1>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              Official e-tenders invited by Lonavala Municipal Council for civil infrastructure, road works, water equipment, electrical supply, and sanitation services.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#D9E8DD] shadow-xs">
          <div className="w-full sm:max-w-md">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search by tender ID, title, or department..."
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3.5 py-2.5 text-xs bg-white border border-[#D9E8DD] rounded-xl text-gray-700 font-semibold focus:outline-hidden"
            >
              <option value="All">All Statuses</option>
              <option value="Live">Live Tenders</option>
              <option value="Under Evaluation">Under Evaluation</option>
              <option value="Awarded">Awarded</option>
              <option value="Closed">Closed</option>
            </select>

            <a
              href="https://mahatenders.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-[#2E8B57] hover:bg-[#246E45] text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0"
            >
              MahaTenders Portal ↗
            </a>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl border border-[#D9E8DD] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FCF9] border-b border-[#D9E8DD] text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                  <th className="py-4 px-6">Tender ID</th>
                  <th className="py-4 px-6">Title & Specifications</th>
                  <th className="py-4 px-6">Department</th>
                  <th className="py-4 px-6">Est. Cost</th>
                  <th className="py-4 px-6">Deadline</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-center">Download</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                {paginated.map((tender) => (
                  <tr key={tender.id} className="hover:bg-[#E8F5E9]/30 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-[#2E8B57] whitespace-nowrap">
                      {tender.tenderId}
                    </td>
                    <td className="py-4 px-6 max-w-sm">
                      <div className="font-bold text-[#1F2937] leading-snug line-clamp-2">
                        {tender.title}
                      </div>
                      <div className="text-[10px] text-gray-400 mt-0.5">
                        Published: {tender.publishedDate}
                      </div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-gray-600">
                      {tender.department}
                    </td>
                    <td className="py-4 px-6 font-bold text-gray-900 whitespace-nowrap">
                      {tender.estimatedCost}
                    </td>
                    <td className="py-4 px-6 font-medium text-gray-600 whitespace-nowrap">
                      {tender.deadline}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          statusBadgeColor[tender.status] || "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {tender.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center whitespace-nowrap">
                      <a
                        href="#"
                        download
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-[#2E8B57] hover:text-white text-gray-700 font-semibold transition-colors"
                        title="Download Tender Document"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{tender.fileSize}</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="p-4 bg-[#F8FCF9] border-t border-[#D9E8DD] flex items-center justify-between text-xs text-gray-600">
            <div>
              Showing Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> (
              {filtered.length} total entries)
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-[#D9E8DD] bg-white disabled:opacity-40 hover:bg-gray-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-bold text-[#2E8B57]">{currentPage}</span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-[#D9E8DD] bg-white disabled:opacity-40 hover:bg-gray-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
