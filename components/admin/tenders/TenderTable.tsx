"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileSpreadsheet,
  Plus,
  Search,
  RefreshCw,
  Edit2,
  Trash2,
  Eye,
  Copy,
  Check,
  CheckCircle2,
  ExternalLink,
  Download,
  Calendar,
  IndianRupee,
  Building,
  Tag,
  Clock,
  Filter,
  CopyPlus,
  X,
  FileText,
  AlertCircle,
  SlidersHorizontal,
  ChevronDown,
  Layers,
  Award,
  Phone,
  Mail,
} from "lucide-react";
import { TenderItem, TenderStatus } from "@/types";
import {
  getAllTenders,
  deleteTender,
  toggleTenderStatus,
  duplicateTender,
  TENDER_DEPARTMENTS,
  TENDER_CATEGORIES,
} from "@/lib/services/tender.service";

export function TenderTable() {
  const router = useRouter();
  const [tenders, setTenders] = useState<TenderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState<"deadline" | "publishedDate" | "cost" | "tenderId">("publishedDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  // Selected tender for preview modal drawer
  const [selectedTender, setSelectedTender] = useState<TenderItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchTenders = async () => {
    try {
      setLoading(true);
      const data = await getAllTenders();
      setTenders(data);
    } catch (err) {
      console.error("Failed to load tenders:", err);
      showToast("Failed to load tender data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenders();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleCopy = (text: string, id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast(`Copied "${text}" to clipboard.`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string, tenderId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (confirm(`Are you sure you want to delete tender "${tenderId}"? This action cannot be undone.`)) {
      try {
        setActionLoadingId(id);
        await deleteTender(id);
        setTenders((prev) => prev.filter((t) => t.id !== id));
        if (selectedTender?.id === id) {
          setSelectedTender(null);
        }
        showToast(`Tender ${tenderId} removed successfully.`);
      } catch (err) {
        console.error("Failed to delete tender:", err);
        showToast("Error deleting tender.");
      } finally {
        setActionLoadingId(null);
      }
    }
  };

  const handleStatusChange = async (id: string, newStatus: TenderStatus, e?: React.SyntheticEvent) => {
    if (e) e.stopPropagation();
    try {
      setActionLoadingId(id);
      const updated = await toggleTenderStatus(id, newStatus);
      setTenders((prev) => prev.map((t) => (t.id === id ? updated : t)));
      if (selectedTender?.id === id) {
        setSelectedTender(updated);
      }
      showToast(`Status updated to "${newStatus}"`);
    } catch (err) {
      console.error("Failed to update status:", err);
      showToast("Error updating status.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDuplicate = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      setActionLoadingId(id);
      const copy = await duplicateTender(id);
      setTenders((prev) => [copy, ...prev]);
      showToast(`Duplicated as new draft tender "${copy.tenderId}"`);
    } catch (err) {
      console.error("Failed to duplicate tender:", err);
      showToast("Error duplicating tender.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleExportCSV = () => {
    if (filteredTenders.length === 0) {
      showToast("No tenders to export.");
      return;
    }

    const headers = [
      "Tender ID",
      "Title",
      "Department",
      "Category",
      "Estimated Cost",
      "EMD",
      "Tender Fee",
      "Published Date",
      "Deadline",
      "Status",
      "Awarded To",
      "Awarded Amount",
    ];

    const rows = filteredTenders.map((t) => [
      `"${t.tenderId}"`,
      `"${t.title.replace(/"/g, '""')}"`,
      `"${t.department}"`,
      `"${t.category || ""}"`,
      `"${t.estimatedCost}"`,
      `"${t.earnestMoneyDeposit || ""}"`,
      `"${t.tenderFee || ""}"`,
      `"${t.publishedDate}"`,
      `"${t.deadline}"`,
      `"${t.status}"`,
      `"${t.awardedTo || ""}"`,
      `"${t.awardedAmount || ""}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `LMC_Tenders_Export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Tenders export downloaded.");
  };

  // Metrics calculations
  const stats = useMemo(() => {
    const total = tenders.length;
    const live = tenders.filter((t) => t.status === "Live").length;
    const evaluation = tenders.filter((t) => t.status === "Under Evaluation").length;
    const awarded = tenders.filter((t) => t.status === "Awarded").length;
    const closed = tenders.filter((t) => t.status === "Closed" || t.status === "Cancelled").length;

    // Approximate total value
    const totalValueNumeric = tenders.reduce((acc, t) => {
      const match = t.estimatedCost.replace(/[^0-9]/g, "");
      return acc + (Number(match) || 0);
    }, 0);

    const formattedTotalValue =
      totalValueNumeric > 10000000
        ? `₹${(totalValueNumeric / 10000000).toFixed(2)} Cr`
        : `₹${(totalValueNumeric / 100000).toFixed(2)} Lakh`;

    return { total, live, evaluation, awarded, closed, formattedTotalValue };
  }, [tenders]);

  // Filtered and sorted tenders
  const filteredTenders = useMemo(() => {
    return tenders
      .filter((t) => {
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          q === "" ||
          t.tenderId.toLowerCase().includes(q) ||
          t.title.toLowerCase().includes(q) ||
          (t.marathiTitle && t.marathiTitle.toLowerCase().includes(q)) ||
          t.department.toLowerCase().includes(q) ||
          (t.category && t.category.toLowerCase().includes(q)) ||
          (t.awardedTo && t.awardedTo.toLowerCase().includes(q));

        const matchesDept = departmentFilter === "All" || t.department === departmentFilter;
        const matchesCategory = categoryFilter === "All" || t.category === categoryFilter;
        const matchesStatus = statusFilter === "All" || t.status === statusFilter;

        return matchesSearch && matchesDept && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        let comp = 0;
        if (sortBy === "deadline") {
          comp = new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        } else if (sortBy === "publishedDate") {
          comp = new Date(a.publishedDate).getTime() - new Date(b.publishedDate).getTime();
        } else if (sortBy === "tenderId") {
          comp = a.tenderId.localeCompare(b.tenderId);
        } else if (sortBy === "cost") {
          const costA = parseFloat(a.estimatedCost.replace(/[^0-9.]/g, "")) || 0;
          const costB = parseFloat(b.estimatedCost.replace(/[^0-9.]/g, "")) || 0;
          comp = costA - costB;
        }
        return sortOrder === "desc" ? -comp : comp;
      });
  }, [tenders, searchQuery, departmentFilter, categoryFilter, statusFilter, sortBy, sortOrder]);

  const getStatusBadge = (status: TenderStatus) => {
    switch (status) {
      case "Live":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-500/20";
      case "Under Evaluation":
        return "bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-500/20";
      case "Awarded":
        return "bg-blue-50 text-blue-700 border-blue-200 ring-1 ring-blue-500/20";
      case "Closed":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "Cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const getDeadlineStatus = (deadlineStr: string, status: TenderStatus) => {
    if (status !== "Live") return null;
    const now = new Date().getTime();
    const deadlineDate = new Date(deadlineStr.replace(" ", "T")).getTime();
    if (isNaN(deadlineDate)) return null;

    const diffDays = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) {
      return <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-sm">Expired</span>;
    }
    if (diffDays <= 3) {
      return (
        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-sm animate-pulse">
          {diffDays === 0 ? "Closing Today" : `${diffDays}d left`}
        </span>
      );
    }
    return <span className="text-[10px] font-medium text-emerald-700">{diffDays} days left</span>;
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-gray-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-white/10 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-border shadow-xs">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-light flex items-center justify-center text-primary">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-text-primary tracking-tight">
                  Tenders & e-Procurement
                </h1>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary-light text-primary">
                  {tenders.length} Total
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Manage municipal e-tender notices, bidding timelines, contract values, and vendor awards.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={fetchTenders}
            disabled={loading}
            className="px-3.5 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-xs flex items-center gap-1.5 transition-colors border border-border cursor-pointer disabled:opacity-50"
            title="Reload tenders"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-primary" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-xs flex items-center gap-1.5 transition-colors border border-border cursor-pointer"
            title="Export filtered records to CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <Link
            href="/admin/tenders/new"
            className="px-4 py-2.5 bg-primary hover:bg-primary-hover text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Tender</span>
          </Link>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-border shadow-xs">
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">All Tenders</div>
          <div className="text-2xl font-black text-text-primary mt-1">{stats.total}</div>
          <div className="text-[11px] text-gray-500 mt-0.5">Across all departments</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-border shadow-xs">
          <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Live / Active
          </div>
          <div className="text-2xl font-black text-emerald-700 mt-1">{stats.live}</div>
          <div className="text-[11px] text-gray-500 mt-0.5">Open for contractor bids</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-border shadow-xs">
          <div className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">In Evaluation</div>
          <div className="text-2xl font-black text-amber-700 mt-1">{stats.evaluation}</div>
          <div className="text-[11px] text-gray-500 mt-0.5">Technical scrutiny stage</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-border shadow-xs">
          <div className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Awarded</div>
          <div className="text-2xl font-black text-blue-700 mt-1">{stats.awarded}</div>
          <div className="text-[11px] text-gray-500 mt-0.5">Contractors finalized</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-border shadow-xs col-span-2 sm:col-span-1">
          <div className="text-[11px] font-bold text-primary uppercase tracking-wider">Est. Portfolio</div>
          <div className="text-2xl font-black text-primary mt-1">{stats.formattedTotalValue}</div>
          <div className="text-[11px] text-gray-500 mt-0.5">Cumulative tender value</div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-border shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by tender ID, title, Marathi description, department, or vendor..."
              className="w-full pl-10 pr-4 py-2.5 bg-primary-surface border border-border rounded-xl text-xs font-semibold text-gray-800 placeholder-gray-400 focus:bg-white focus:border-primary focus:outline-hidden transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 bg-primary-surface border border-border rounded-xl font-semibold text-gray-700 text-xs focus:bg-white focus:border-primary focus:outline-hidden"
            >
              <option value="All">All Statuses</option>
              <option value="Live">Live (Open)</option>
              <option value="Under Evaluation">Under Evaluation</option>
              <option value="Awarded">Awarded</option>
              <option value="Closed">Closed</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            {/* Department Filter */}
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3 py-2.5 bg-primary-surface border border-border rounded-xl font-semibold text-gray-700 text-xs focus:bg-white focus:border-primary focus:outline-hidden max-w-[170px] truncate"
            >
              <option value="All">All Departments</option>
              {TENDER_DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2.5 bg-primary-surface border border-border rounded-xl font-semibold text-gray-700 text-xs focus:bg-white focus:border-primary focus:outline-hidden max-w-[150px] truncate"
            >
              <option value="All">All Categories</option>
              {TENDER_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Sort Filter */}
            <div className="flex items-center bg-primary-surface border border-border rounded-xl overflow-hidden">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2.5 bg-transparent font-semibold text-gray-700 text-xs focus:outline-hidden"
              >
                <option value="publishedDate">Sort: Published Date</option>
                <option value="deadline">Sort: Bid Deadline</option>
                <option value="cost">Sort: Estimated Cost</option>
                <option value="tenderId">Sort: Tender ID</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="px-2.5 py-2.5 text-gray-500 hover:text-primary hover:bg-gray-100 border-l border-border transition-colors text-xs font-bold"
                title={`Sort ${sortOrder === "asc" ? "Descending" : "Ascending"}`}
              >
                {sortOrder === "asc" ? "↑" : "↓"}
              </button>
            </div>
          </div>
        </div>

        {/* Active Filter Tags */}
        {(searchQuery || departmentFilter !== "All" || categoryFilter !== "All" || statusFilter !== "All") && (
          <div className="flex items-center gap-2 pt-2 border-t border-border flex-wrap text-xs">
            <span className="text-gray-400 font-medium">Active filters:</span>
            {searchQuery && (
              <span className="px-2 py-0.5 rounded-md bg-primary-light text-primary font-semibold flex items-center gap-1">
                Query: &quot;{searchQuery}&quot;
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchQuery("")} />
              </span>
            )}
            {departmentFilter !== "All" && (
              <span className="px-2 py-0.5 rounded-md bg-primary-light text-primary font-semibold flex items-center gap-1">
                Dept: {departmentFilter}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setDepartmentFilter("All")} />
              </span>
            )}
            {categoryFilter !== "All" && (
              <span className="px-2 py-0.5 rounded-md bg-primary-light text-primary font-semibold flex items-center gap-1">
                Category: {categoryFilter}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setCategoryFilter("All")} />
              </span>
            )}
            {statusFilter !== "All" && (
              <span className="px-2 py-0.5 rounded-md bg-primary-light text-primary font-semibold flex items-center gap-1">
                Status: {statusFilter}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setStatusFilter("All")} />
              </span>
            )}
            <button
              onClick={() => {
                setSearchQuery("");
                setDepartmentFilter("All");
                setCategoryFilter("All");
                setStatusFilter("All");
              }}
              className="text-xs font-bold text-red-600 hover:underline ml-auto"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-16 text-center text-gray-500 space-y-3">
            <RefreshCw className="w-7 h-7 animate-spin mx-auto text-primary" />
            <p className="text-xs font-semibold">Fetching active tenders and contracts...</p>
          </div>
        ) : filteredTenders.length === 0 ? (
          <div className="p-16 text-center text-gray-500 space-y-3">
            <FileSpreadsheet className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="font-bold text-sm text-gray-700">No tenders match your search</p>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              Try modifying your search criteria, reset active filters, or publish a new municipal e-tender notice.
            </p>
            <Link
              href="/admin/tenders/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white font-bold text-xs shadow-xs hover:bg-primary-hover transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Tender</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-primary-surface border-b border-border text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                  <th className="py-4 px-5">Tender ID & Ref</th>
                  <th className="py-4 px-5">Title & Issuing Department</th>
                  <th className="py-4 px-5">Est. Cost & Fees</th>
                  <th className="py-4 px-5">Timeline & Deadline</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-center">Docs</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                {filteredTenders.map((tender) => (
                  <tr
                    key={tender.id}
                    onClick={() => setSelectedTender(tender)}
                    className="hover:bg-primary-light/20 transition-colors cursor-pointer group"
                  >
                    {/* Tender ID & Copy */}
                    <td className="py-4 px-5 whitespace-nowrap align-top">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-primary text-xs tracking-tight">
                          {tender.tenderId}
                        </span>
                        <button
                          onClick={(e) => handleCopy(tender.tenderId, tender.id, e)}
                          className="p-1 rounded-md text-gray-400 hover:text-primary hover:bg-white transition-colors"
                          title="Copy Tender ID"
                        >
                          {copiedId === tender.id ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                      {tender.category && (
                        <div className="mt-1">
                          <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                            {tender.category}
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Title & Department */}
                    <td className="py-4 px-5 max-w-sm align-top">
                      <div className="font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                        {tender.title}
                      </div>
                      {tender.marathiTitle && (
                        <div className="text-[11px] text-gray-500 line-clamp-1 mt-0.5 font-medium">
                          {tender.marathiTitle}
                        </div>
                      )}
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-gray-600">
                          <Building className="w-3 h-3 text-gray-400" />
                          {tender.department}
                        </span>
                        {tender.awardedTo && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded-sm">
                            <Award className="w-3 h-3" />
                            {tender.awardedTo}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Cost & Fees */}
                    <td className="py-4 px-5 whitespace-nowrap align-top">
                      <div className="font-extrabold text-gray-900 text-xs">
                        {tender.estimatedCost}
                      </div>
                      <div className="text-[10px] text-gray-500 space-y-0.5 mt-0.5">
                        {tender.earnestMoneyDeposit && (
                          <div>EMD: <span className="font-semibold text-gray-700">{tender.earnestMoneyDeposit}</span></div>
                        )}
                        {tender.tenderFee && (
                          <div>Fee: <span className="font-semibold text-gray-700">{tender.tenderFee}</span></div>
                        )}
                      </div>
                    </td>

                    {/* Timeline & Deadline */}
                    <td className="py-4 px-5 whitespace-nowrap align-top">
                      <div className="flex items-center gap-1.5 font-medium text-gray-700">
                        <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span>{tender.deadline}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-1.5">
                        {getDeadlineStatus(tender.deadline, tender.status)}
                        <span className="text-[10px] text-gray-400">
                          Pub: {tender.publishedDate}
                        </span>
                      </div>
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-4 px-5 whitespace-nowrap align-top">
                      <div className="relative inline-block">
                        <select
                          value={tender.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => handleStatusChange(tender.id, e.target.value as TenderStatus, e)}
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-hidden transition-all ${getStatusBadge(
                            tender.status
                          )}`}
                        >
                          <option value="Live">Live</option>
                          <option value="Under Evaluation">Under Evaluation</option>
                          <option value="Awarded">Awarded</option>
                          <option value="Closed">Closed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>

                    {/* Documents */}
                    <td className="py-4 px-5 text-center whitespace-nowrap align-top">
                      {tender.downloadUrl && tender.downloadUrl !== "#" ? (
                        <a
                          href={tender.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-primary hover:text-white text-gray-700 font-semibold text-[11px] transition-colors"
                          title="Open tender notice file"
                        >
                          <FileText className="w-3 h-3" />
                          <span>{tender.fileSize || "Doc"}</span>
                        </a>
                      ) : (
                        <span className="text-[10px] text-gray-400 italic">No doc</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right whitespace-nowrap align-top">
                      <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedTender(tender)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-primary hover:bg-primary-light transition-colors"
                          title="Quick preview specifications"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={(e) => handleDuplicate(tender.id, e)}
                          disabled={actionLoadingId === tender.id}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Duplicate as new draft tender"
                        >
                          <CopyPlus className="w-4 h-4" />
                        </button>

                        <Link
                          href={`/admin/tenders/${tender.id}`}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-primary hover:bg-primary-light transition-colors inline-flex"
                          title="Edit Tender Details"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={(e) => handleDelete(tender.id, tender.tenderId, e)}
                          disabled={actionLoadingId === tender.id}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete Tender"
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

        {/* Footer Summary */}
        {!loading && filteredTenders.length > 0 && (
          <div className="p-4 bg-primary-surface border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
            <div>
              Showing <span className="font-bold text-gray-900">{filteredTenders.length}</span> of{" "}
              <span className="font-bold text-gray-900">{tenders.length}</span> recorded tenders
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-gray-500">
                Lonavala Municipal Council E-Procurement Gateway
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Quick View / Drawer Modal */}
      {selectedTender && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-3xl border border-border shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-border flex items-start justify-between bg-primary-surface">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-primary text-xs px-2.5 py-0.5 bg-white rounded-md border border-border">
                    {selectedTender.tenderId}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(
                      selectedTender.status
                    )}`}
                  >
                    {selectedTender.status}
                  </span>
                </div>
                <h3 className="font-black text-base text-text-primary leading-tight">
                  {selectedTender.title}
                </h3>
                {selectedTender.marathiTitle && (
                  <p className="text-xs text-gray-600 font-medium">{selectedTender.marathiTitle}</p>
                )}
              </div>
              <button
                onClick={() => setSelectedTender(null)}
                className="p-1.5 rounded-xl bg-white text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              {/* Financial & Department Overview */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="text-[10px] font-bold text-gray-400 uppercase">Est. Value</div>
                  <div className="text-sm font-extrabold text-gray-900 mt-0.5">
                    {selectedTender.estimatedCost}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="text-[10px] font-bold text-gray-400 uppercase">EMD Deposit</div>
                  <div className="text-sm font-extrabold text-gray-900 mt-0.5">
                    {selectedTender.earnestMoneyDeposit || "Nil"}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="text-[10px] font-bold text-gray-400 uppercase">Tender Fee</div>
                  <div className="text-sm font-extrabold text-gray-900 mt-0.5">
                    {selectedTender.tenderFee || "Nil"}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="text-[10px] font-bold text-gray-400 uppercase">Category</div>
                  <div className="text-xs font-bold text-primary mt-0.5 truncate">
                    {selectedTender.category || "General Works"}
                  </div>
                </div>
              </div>

              {/* Department & Timelines */}
              <div className="p-4 rounded-2xl bg-primary-light/40 border border-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-semibold">Issuing Department:</span>
                  <span className="font-bold text-text-primary">{selectedTender.department}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-semibold">Notice Published Date:</span>
                  <span className="font-medium text-gray-800">{selectedTender.publishedDate}</span>
                </div>
                {selectedTender.openingDate && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 font-semibold">Technical Bid Opening:</span>
                    <span className="font-medium text-gray-800">{selectedTender.openingDate}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-semibold">Bid Submission Deadline:</span>
                  <span className="font-bold text-red-600">{selectedTender.deadline}</span>
                </div>
                {selectedTender.completionPeriod && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 font-semibold">Completion Period:</span>
                    <span className="font-medium text-gray-800">{selectedTender.completionPeriod}</span>
                  </div>
                )}
              </div>

              {/* Detailed Description */}
              {selectedTender.description && (
                <div>
                  <h4 className="font-bold text-gray-900 mb-1.5 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-primary" />
                    Scope of Work & Technical Specifications
                  </h4>
                  <p className="text-gray-600 leading-relaxed bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                    {selectedTender.description}
                  </p>
                </div>
              )}

              {/* Eligibility Criteria */}
              {selectedTender.eligibilityCriteria && selectedTender.eligibilityCriteria.length > 0 && (
                <div>
                  <h4 className="font-bold text-gray-900 mb-1.5">Key Eligibility Criteria:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                    {selectedTender.eligibilityCriteria.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Awarded Info if any */}
              {selectedTender.awardedTo && (
                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-blue-900">
                    <Award className="w-4 h-4 text-blue-700" />
                    Award & Contract Allocation Details
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div>
                      <span className="text-gray-500">Contractor / Firm:</span>
                      <p className="font-bold text-gray-900">{selectedTender.awardedTo}</p>
                    </div>
                    {selectedTender.awardedAmount && (
                      <div>
                        <span className="text-gray-500">Contract Value:</span>
                        <p className="font-bold text-gray-900">{selectedTender.awardedAmount}</p>
                      </div>
                    )}
                    {selectedTender.awardDate && (
                      <div>
                        <span className="text-gray-500">Date of Award:</span>
                        <p className="font-medium text-gray-900">{selectedTender.awardDate}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Contact Officer */}
              {(selectedTender.contactPerson || selectedTender.contactPhone || selectedTender.contactEmail) && (
                <div className="flex items-center gap-4 text-[11px] text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-200 flex-wrap">
                  {selectedTender.contactPerson && (
                    <span className="font-semibold text-gray-800">
                      Officer: {selectedTender.contactPerson}
                    </span>
                  )}
                  {selectedTender.contactPhone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-gray-400" />
                      {selectedTender.contactPhone}
                    </span>
                  )}
                  {selectedTender.contactEmail && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3 text-gray-400" />
                      {selectedTender.contactEmail}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="p-4 border-t border-border bg-gray-50 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {selectedTender.downloadUrl && selectedTender.downloadUrl !== "#" && (
                  <a
                    href={selectedTender.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-white border border-border text-gray-700 hover:bg-gray-100 font-bold text-xs inline-flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Doc ({selectedTender.fileSize || "PDF"})</span>
                  </a>
                )}
                <a
                  href={selectedTender.externalPortalUrl || "https://mahatenders.gov.in"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-white border border-border text-gray-700 hover:bg-gray-100 font-bold text-xs inline-flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>MahaTenders Portal</span>
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/tenders/${selectedTender.id}`}
                  className="px-4 py-2 bg-primary hover:bg-primary-hover text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Tender</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
