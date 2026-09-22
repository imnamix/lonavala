"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Briefcase,
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
  Building,
  GraduationCap,
  Clock,
  Filter,
  CopyPlus,
  X,
  FileText,
  AlertCircle,
  SlidersHorizontal,
  Award,
  Phone,
  Mail,
  Users,
  UserCheck,
} from "lucide-react";
import { RecruitmentVacancy, RecruitmentStatus } from "@/types";
import {
  getAllRecruitments,
  deleteRecruitment,
  toggleRecruitmentStatus,
  duplicateRecruitment,
  RECRUITMENT_DEPARTMENTS,
  RECRUITMENT_GRADES,
} from "@/lib/services/recruitment.service";

export function RecruitmentTable() {
  const router = useRouter();
  const [recruitments, setRecruitments] = useState<RecruitmentVacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [gradeFilter, setGradeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState<"lastDate" | "publishedDate" | "vacancies" | "advertisementNo">("lastDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Selected item for preview modal drawer
  const [selectedRecruitment, setSelectedRecruitment] = useState<RecruitmentVacancy | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchRecruitments = async () => {
    try {
      setLoading(true);
      const data = await getAllRecruitments();
      setRecruitments(data);
    } catch (err) {
      console.error("Failed to load recruitments:", err);
      showToast("Failed to load recruitment data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecruitments();
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

  const handleDelete = async (id: string, advtNo: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (confirm(`Are you sure you want to delete recruitment advertisement "${advtNo}"? This action cannot be undone.`)) {
      try {
        setActionLoadingId(id);
        await deleteRecruitment(id);
        setRecruitments((prev) => prev.filter((r) => r.id !== id));
        if (selectedRecruitment?.id === id) {
          setSelectedRecruitment(null);
        }
        showToast(`Advertisement ${advtNo} removed successfully.`);
      } catch (err) {
        console.error("Failed to delete recruitment:", err);
        showToast("Error deleting recruitment record.");
      } finally {
        setActionLoadingId(null);
      }
    }
  };

  const handleStatusChange = async (
    id: string,
    newStatus: RecruitmentStatus,
    e?: React.SyntheticEvent
  ) => {
    if (e) e.stopPropagation();
    try {
      setActionLoadingId(id);
      const updated = await toggleRecruitmentStatus(id, newStatus);
      setRecruitments((prev) => prev.map((r) => (r.id === id ? updated : r)));
      if (selectedRecruitment?.id === id) {
        setSelectedRecruitment(updated);
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
      const copy = await duplicateRecruitment(id);
      setRecruitments((prev) => [copy, ...prev]);
      showToast(`Duplicated as new draft "${copy.advertisementNo}"`);
    } catch (err) {
      console.error("Failed to duplicate recruitment:", err);
      showToast("Error duplicating advertisement.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleExportCSV = () => {
    if (filteredRecruitments.length === 0) {
      showToast("No records to export.");
      return;
    }

    const headers = [
      "Advertisement No",
      "Post Name",
      "Department",
      "Grade",
      "Vacancies",
      "Pay Scale",
      "Qualification",
      "Last Date",
      "Status",
    ];

    const rows = filteredRecruitments.map((r) => [
      `"${r.advertisementNo}"`,
      `"${r.postName.replace(/"/g, '""')}"`,
      `"${r.department}"`,
      `"${r.grade || ""}"`,
      r.vacancies,
      `"${r.payScale}"`,
      `"${r.qualification.replace(/"/g, '""')}"`,
      `"${r.lastDate}"`,
      `"${r.status}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `LMC_Recruitment_Export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Recruitment CSV exported successfully.");
  };

  // Metrics calculations
  const stats = useMemo(() => {
    const totalAdvertisements = recruitments.length;
    const active = recruitments.filter((r) => r.status === "Active").length;
    const inScrutiny = recruitments.filter((r) => r.status === "Scrutiny" || r.status === "Exam / Interview").length;
    const resultsDeclared = recruitments.filter((r) => r.status === "Result Declared").length;
    const totalVacancies = recruitments.reduce((acc, r) => acc + (Number(r.vacancies) || 0), 0);
    const openVacancies = recruitments
      .filter((r) => r.status === "Active")
      .reduce((acc, r) => acc + (Number(r.vacancies) || 0), 0);

    return { totalAdvertisements, active, inScrutiny, resultsDeclared, totalVacancies, openVacancies };
  }, [recruitments]);

  // Filtered and sorted recruitments
  const filteredRecruitments = useMemo(() => {
    return recruitments
      .filter((r) => {
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          q === "" ||
          r.advertisementNo.toLowerCase().includes(q) ||
          r.postName.toLowerCase().includes(q) ||
          (r.marathiPostName && r.marathiPostName.toLowerCase().includes(q)) ||
          r.department.toLowerCase().includes(q) ||
          r.qualification.toLowerCase().includes(q) ||
          r.payScale.toLowerCase().includes(q);

        const matchesDept = departmentFilter === "All" || r.department === departmentFilter;
        const matchesGrade = gradeFilter === "All" || r.grade === gradeFilter;
        const matchesStatus = statusFilter === "All" || r.status === statusFilter;

        return matchesSearch && matchesDept && matchesGrade && matchesStatus;
      })
      .sort((a, b) => {
        let comp = 0;
        if (sortBy === "lastDate") {
          comp = new Date(a.lastDate).getTime() - new Date(b.lastDate).getTime();
        } else if (sortBy === "publishedDate") {
          const dateA = a.publishedDate ? new Date(a.publishedDate).getTime() : 0;
          const dateB = b.publishedDate ? new Date(b.publishedDate).getTime() : 0;
          comp = dateA - dateB;
        } else if (sortBy === "vacancies") {
          comp = a.vacancies - b.vacancies;
        } else if (sortBy === "advertisementNo") {
          comp = a.advertisementNo.localeCompare(b.advertisementNo);
        }
        return sortOrder === "desc" ? -comp : comp;
      });
  }, [recruitments, searchQuery, departmentFilter, gradeFilter, statusFilter, sortBy, sortOrder]);

  const getStatusBadge = (status: RecruitmentStatus) => {
    switch (status) {
      case "Active":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-500/20";
      case "Scrutiny":
        return "bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-500/20";
      case "Exam / Interview":
        return "bg-purple-50 text-purple-700 border-purple-200 ring-1 ring-purple-500/20";
      case "Result Declared":
        return "bg-blue-50 text-blue-700 border-blue-200 ring-1 ring-blue-500/20";
      case "Archived":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "Cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const getLastDateStatus = (lastDateStr: string, status: RecruitmentStatus) => {
    if (status !== "Active") return null;
    const now = new Date().getTime();
    const targetDate = new Date(lastDateStr).getTime();
    if (isNaN(targetDate)) return null;

    const diffDays = Math.ceil((targetDate - now) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) {
      return <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-sm">Closed</span>;
    }
    if (diffDays <= 5) {
      return (
        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-sm animate-pulse">
          {diffDays === 0 ? "Last Day Today" : `${diffDays}d left`}
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
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-text-primary tracking-tight">
                  Recruitment & Careers
                </h1>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary-light text-primary">
                  {recruitments.length} Notices
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Manage employment gazettes, vacancies, qualification criteria, pay scales, and selection merit results.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={fetchRecruitments}
            disabled={loading}
            className="px-3.5 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-xs flex items-center gap-1.5 transition-colors border border-border cursor-pointer disabled:opacity-50"
            title="Reload vacancies"
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
            href="/admin/recruitment/new"
            className="px-4 py-2.5 bg-primary hover:bg-primary-hover text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Vacancy Notice</span>
          </Link>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-border shadow-xs">
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Notices</div>
          <div className="text-2xl font-black text-text-primary mt-1">{stats.totalAdvertisements}</div>
          <div className="text-[11px] text-gray-500 mt-0.5">All recruitment postings</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-border shadow-xs">
          <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Active Vacancies
          </div>
          <div className="text-2xl font-black text-emerald-700 mt-1">{stats.active}</div>
          <div className="text-[11px] text-gray-500 mt-0.5">{stats.openVacancies} Open Seats</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-border shadow-xs">
          <div className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">In Scrutiny / Exam</div>
          <div className="text-2xl font-black text-amber-700 mt-1">{stats.inScrutiny}</div>
          <div className="text-[11px] text-gray-500 mt-0.5">Evaluation stage</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-border shadow-xs">
          <div className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Results Out</div>
          <div className="text-2xl font-black text-blue-700 mt-1">{stats.resultsDeclared}</div>
          <div className="text-[11px] text-gray-500 mt-0.5">Merit lists published</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-border shadow-xs col-span-2 sm:col-span-1">
          <div className="text-[11px] font-bold text-primary uppercase tracking-wider">Total Sanctioned Posts</div>
          <div className="text-2xl font-black text-primary mt-1">{stats.totalVacancies} Posts</div>
          <div className="text-[11px] text-gray-500 mt-0.5">Across all notices</div>
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
              placeholder="Search by Advt No, Post Name, Marathi designation, department, qualification, or pay..."
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
              <option value="Active">Active (Accepting Applications)</option>
              <option value="Scrutiny">Scrutiny Stage</option>
              <option value="Exam / Interview">Exam / Interview</option>
              <option value="Result Declared">Result Declared</option>
              <option value="Archived">Archived</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            {/* Department Filter */}
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3 py-2.5 bg-primary-surface border border-border rounded-xl font-semibold text-gray-700 text-xs focus:bg-white focus:border-primary focus:outline-hidden max-w-[170px] truncate"
            >
              <option value="All">All Departments</option>
              {RECRUITMENT_DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            {/* Grade Filter */}
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="px-3 py-2.5 bg-primary-surface border border-border rounded-xl font-semibold text-gray-700 text-xs focus:bg-white focus:border-primary focus:outline-hidden max-w-[130px]"
            >
              <option value="All">All Grades</option>
              {RECRUITMENT_GRADES.map((g) => (
                <option key={g} value={g}>
                  {g}
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
                <option value="lastDate">Sort: Application Deadline</option>
                <option value="publishedDate">Sort: Published Date</option>
                <option value="vacancies">Sort: Vacancy Count</option>
                <option value="advertisementNo">Sort: Advt Number</option>
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
        {(searchQuery || departmentFilter !== "All" || gradeFilter !== "All" || statusFilter !== "All") && (
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
            {gradeFilter !== "All" && (
              <span className="px-2 py-0.5 rounded-md bg-primary-light text-primary font-semibold flex items-center gap-1">
                Grade: {gradeFilter}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setGradeFilter("All")} />
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
                setGradeFilter("All");
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
            <p className="text-xs font-semibold">Fetching recruitment notices and vacancies...</p>
          </div>
        ) : filteredRecruitments.length === 0 ? (
          <div className="p-16 text-center text-gray-500 space-y-3">
            <Briefcase className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="font-bold text-sm text-gray-700">No recruitment notices match your search</p>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              Try modifying your search criteria or publish a new municipal staff recruitment advertisement.
            </p>
            <Link
              href="/admin/recruitment/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white font-bold text-xs shadow-xs hover:bg-primary-hover transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Vacancy Notice</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-primary-surface border-b border-border text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                  <th className="py-4 px-5">Advt No & Grade</th>
                  <th className="py-4 px-5">Post Name & Department</th>
                  <th className="py-4 px-5">Vacancies & Scale</th>
                  <th className="py-4 px-5">Qualifications</th>
                  <th className="py-4 px-5">Deadline</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-center">Docs</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                {filteredRecruitments.map((rec) => (
                  <tr
                    key={rec.id}
                    onClick={() => setSelectedRecruitment(rec)}
                    className="hover:bg-primary-light/20 transition-colors cursor-pointer group"
                  >
                    {/* Advt No & Copy */}
                    <td className="py-4 px-5 whitespace-nowrap align-top">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-primary text-xs tracking-tight">
                          {rec.advertisementNo}
                        </span>
                        <button
                          onClick={(e) => handleCopy(rec.advertisementNo, rec.id, e)}
                          className="p-1 rounded-md text-gray-400 hover:text-primary hover:bg-white transition-colors"
                          title="Copy Advertisement No"
                        >
                          {copiedId === rec.id ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                      {rec.grade && (
                        <div className="mt-1">
                          <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                            {rec.grade}
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Post Name & Department */}
                    <td className="py-4 px-5 max-w-xs align-top">
                      <div className="font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                        {rec.postName}
                      </div>
                      {rec.marathiPostName && (
                        <div className="text-[11px] text-gray-500 line-clamp-1 mt-0.5 font-medium">
                          {rec.marathiPostName}
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 mt-1 text-[10px] font-semibold text-gray-600">
                        <Building className="w-3 h-3 text-gray-400 shrink-0" />
                        <span>{rec.department}</span>
                      </div>
                    </td>

                    {/* Vacancies & Pay Scale */}
                    <td className="py-4 px-5 whitespace-nowrap align-top">
                      <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-primary-light text-primary border border-primary/20">
                        <Users className="w-3 h-3" />
                        <span>{rec.vacancies} {rec.vacancies === 1 ? "Post" : "Posts"}</span>
                      </div>
                      <div className="text-[11px] font-semibold text-gray-900 mt-1">
                        {rec.payScale}
                      </div>
                      {rec.categoryBreakdown && (
                        <div className="text-[10px] text-gray-400 mt-0.5 truncate max-w-[140px]">
                          {rec.categoryBreakdown}
                        </div>
                      )}
                    </td>

                    {/* Qualifications */}
                    <td className="py-4 px-5 max-w-xs align-top">
                      <div className="text-gray-700 line-clamp-2 leading-relaxed font-medium">
                        {rec.qualification}
                      </div>
                      {rec.experience && (
                        <div className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
                          <GraduationCap className="w-3 h-3 text-gray-400" />
                          <span className="line-clamp-1">Exp: {rec.experience}</span>
                        </div>
                      )}
                    </td>

                    {/* Timelines & Last Date */}
                    <td className="py-4 px-5 whitespace-nowrap align-top">
                      <div className="flex items-center gap-1.5 font-bold text-gray-800">
                        <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span>{rec.lastDate}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-1.5">
                        {getLastDateStatus(rec.lastDate, rec.status)}
                        {rec.publishedDate && (
                          <span className="text-[10px] text-gray-400">
                            Pub: {rec.publishedDate}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-4 px-5 whitespace-nowrap align-top">
                      <div className="relative inline-block">
                        <select
                          value={rec.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => handleStatusChange(rec.id, e.target.value as RecruitmentStatus, e)}
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-hidden transition-all ${getStatusBadge(
                            rec.status
                          )}`}
                        >
                          <option value="Active">Active</option>
                          <option value="Scrutiny">Scrutiny</option>
                          <option value="Exam / Interview">Exam / Interview</option>
                          <option value="Result Declared">Result Declared</option>
                          <option value="Archived">Archived</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>

                    {/* Documents */}
                    <td className="py-4 px-5 text-center whitespace-nowrap align-top">
                      {rec.downloadUrl && rec.downloadUrl !== "#" ? (
                        <a
                          href={rec.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-primary hover:text-white text-gray-700 font-semibold text-[11px] transition-colors"
                          title="Open official recruitment gazette"
                        >
                          <FileText className="w-3 h-3" />
                          <span>{rec.fileSize || "Advt"}</span>
                        </a>
                      ) : (
                        <span className="text-[10px] text-gray-400 italic">No doc</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right whitespace-nowrap align-top">
                      <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedRecruitment(rec)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-primary hover:bg-primary-light transition-colors"
                          title="Quick preview details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={(e) => handleDuplicate(rec.id, e)}
                          disabled={actionLoadingId === rec.id}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Duplicate as new vacancy"
                        >
                          <CopyPlus className="w-4 h-4" />
                        </button>

                        <Link
                          href={`/admin/recruitment/${rec.id}`}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-primary hover:bg-primary-light transition-colors inline-flex"
                          title="Edit Vacancy Details"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={(e) => handleDelete(rec.id, rec.advertisementNo, e)}
                          disabled={actionLoadingId === rec.id}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
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

        {/* Footer Summary */}
        {!loading && filteredRecruitments.length > 0 && (
          <div className="p-4 bg-primary-surface border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
            <div>
              Showing <span className="font-bold text-gray-900">{filteredRecruitments.length}</span> of{" "}
              <span className="font-bold text-gray-900">{recruitments.length}</span> recruitment advertisements
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-gray-500">
                Lonavala Municipal Council Establishment & Careers Cell
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Quick View / Drawer Modal */}
      {selectedRecruitment && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-3xl border border-border shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-border flex items-start justify-between bg-primary-surface">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-primary text-xs px-2.5 py-0.5 bg-white rounded-md border border-border">
                    {selectedRecruitment.advertisementNo}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(
                      selectedRecruitment.status
                    )}`}
                  >
                    {selectedRecruitment.status}
                  </span>
                  {selectedRecruitment.grade && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">
                      {selectedRecruitment.grade}
                    </span>
                  )}
                </div>
                <h3 className="font-black text-base text-text-primary leading-tight">
                  {selectedRecruitment.postName}
                </h3>
                {selectedRecruitment.marathiPostName && (
                  <p className="text-xs text-gray-600 font-medium">{selectedRecruitment.marathiPostName}</p>
                )}
              </div>
              <button
                onClick={() => setSelectedRecruitment(null)}
                className="p-1.5 rounded-xl bg-white text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              {/* Quick Summary Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="text-[10px] font-bold text-gray-400 uppercase">Total Vacancies</div>
                  <div className="text-base font-extrabold text-primary mt-0.5">
                    {selectedRecruitment.vacancies} Posts
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="text-[10px] font-bold text-gray-400 uppercase">Pay Scale</div>
                  <div className="text-xs font-bold text-gray-900 mt-0.5 truncate">
                    {selectedRecruitment.payScale}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="text-[10px] font-bold text-gray-400 uppercase">Application Fee</div>
                  <div className="text-xs font-bold text-gray-900 mt-0.5 truncate">
                    {selectedRecruitment.applicationFee || "As per Rules"}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="text-[10px] font-bold text-gray-400 uppercase">Age Limit</div>
                  <div className="text-xs font-bold text-gray-900 mt-0.5 truncate">
                    {selectedRecruitment.ageLimit || "18 - 38 Yrs"}
                  </div>
                </div>
              </div>

              {/* Department & Timelines */}
              <div className="p-4 rounded-2xl bg-primary-light/40 border border-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-semibold">Issuing Department:</span>
                  <span className="font-bold text-text-primary">{selectedRecruitment.department}</span>
                </div>
                {selectedRecruitment.categoryBreakdown && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 font-semibold">Reservation Breakdown:</span>
                    <span className="font-medium text-gray-800">{selectedRecruitment.categoryBreakdown}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-semibold">Advt Published Date:</span>
                  <span className="font-medium text-gray-800">{selectedRecruitment.publishedDate || "N/A"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-semibold">Application Deadline:</span>
                  <span className="font-bold text-red-600">{selectedRecruitment.lastDate}</span>
                </div>
                {selectedRecruitment.examDate && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 font-semibold">Scheduled Exam / Interview:</span>
                    <span className="font-medium text-gray-800">{selectedRecruitment.examDate}</span>
                  </div>
                )}
              </div>

              {/* Qualifications & Experience */}
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-1 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-primary" />
                    Essential Educational Qualifications
                  </h4>
                  <p className="text-gray-700 leading-relaxed">{selectedRecruitment.qualification}</p>
                </div>

                {selectedRecruitment.experience && (
                  <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
                    <h4 className="font-bold text-gray-900 mb-1">Experience & Practical Skills:</h4>
                    <p className="text-gray-700 leading-relaxed">{selectedRecruitment.experience}</p>
                  </div>
                )}
              </div>

              {/* Selection Process */}
              {selectedRecruitment.selectionProcess && (
                <div>
                  <h4 className="font-bold text-gray-900 mb-1.5">Selection Procedure & Evaluation Scheme:</h4>
                  <p className="text-gray-600 leading-relaxed bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                    {selectedRecruitment.selectionProcess}
                  </p>
                </div>
              )}

              {/* Results Declared info if any */}
              {selectedRecruitment.status === "Result Declared" && selectedRecruitment.resultsFileName && (
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-blue-900">
                    <Award className="w-4 h-4 text-blue-700" />
                    Final Selection Merit List & Results
                  </div>
                  <div className="text-xs text-blue-800">
                    Selected Candidates: <strong>{selectedRecruitment.selectedCandidatesCount || selectedRecruitment.vacancies}</strong>
                  </div>
                  {selectedRecruitment.resultsUrl && (
                    <a
                      href={selectedRecruitment.resultsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:underline pt-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Final Merit List ({selectedRecruitment.resultsFileName})</span>
                    </a>
                  )}
                </div>
              )}

              {/* Candidate Instructions */}
              {selectedRecruitment.instructions && (
                <div>
                  <h4 className="font-bold text-gray-900 mb-1.5">Candidate Instructions:</h4>
                  <p className="text-gray-600 leading-relaxed bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                    {selectedRecruitment.instructions}
                  </p>
                </div>
              )}

              {/* Contact Helpdesk */}
              {(selectedRecruitment.contactEmail || selectedRecruitment.contactPhone) && (
                <div className="flex items-center gap-4 text-[11px] text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-200 flex-wrap">
                  <span className="font-semibold text-gray-800">Recruitment Cell:</span>
                  {selectedRecruitment.contactPhone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-gray-400" />
                      {selectedRecruitment.contactPhone}
                    </span>
                  )}
                  {selectedRecruitment.contactEmail && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3 text-gray-400" />
                      {selectedRecruitment.contactEmail}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="p-4 border-t border-border bg-gray-50 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {selectedRecruitment.downloadUrl && selectedRecruitment.downloadUrl !== "#" && (
                  <a
                    href={selectedRecruitment.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-white border border-border text-gray-700 hover:bg-gray-100 font-bold text-xs inline-flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Advt ({selectedRecruitment.fileSize || "PDF"})</span>
                  </a>
                )}
                <a
                  href={selectedRecruitment.applyUrl || "https://mahaonline.gov.in"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-white border border-border text-gray-700 hover:bg-gray-100 font-bold text-xs inline-flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>MahaOnline Portal</span>
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/recruitment/${selectedRecruitment.id}`}
                  className="px-4 py-2 bg-primary hover:bg-primary-hover text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Notice</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
