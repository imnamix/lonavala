"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Users,
  Search,
  Phone,
  Mail,
  MapPin,
  Calendar,
  AlertCircle,
  FileText,
  Loader2,
  RefreshCw,
  Eye,
  CheckCircle2,
  Clock,
  ShieldCheck,
  X,
  Printer,
  ChevronRight,
  User,
  ArrowUpDown,
  Building2,
} from "lucide-react";
import {
  getAllCitizens,
  getCitizenDetails,
  CitizenListItem,
  CitizenDetailResponse,
  GrievanceItem,
} from "@/lib/services/citizen.service";
import { GrievanceDetailsModal } from "@/components/grievance/GrievanceDetailsModal";

export default function AdminCitizensPage() {
  const [citizens, setCitizens] = useState<CitizenListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Selected Citizen for Details Popup
  const [selectedCitizenId, setSelectedCitizenId] = useState<number | null>(null);
  const [citizenDetail, setCitizenDetail] = useState<CitizenDetailResponse | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Secondary modal for grievance inspection if clicked inside citizen modal
  const [inspectGrievance, setInspectGrievance] = useState<GrievanceItem | null>(null);
  const [isGrievanceModalOpen, setIsGrievanceModalOpen] = useState(false);

  // Fetch Citizens
  const fetchCitizens = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllCitizens({ search: search.trim() || undefined, page, limit: 50 });
      setCitizens(res.data || []);
      setTotalCount(res.meta?.total || (res.data ? res.data.length : 0));
    } catch (err) {
      console.error("Failed to fetch citizens:", err);
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCitizens();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchCitizens]);

  // Handle row click to open Citizen Details Modal
  const handleOpenDetail = async (id: number) => {
    setSelectedCitizenId(id);
    setIsDetailModalOpen(true);
    setDetailLoading(true);
    setCitizenDetail(null);
    try {
      const res = await getCitizenDetails(id);
      setCitizenDetail(res);
    } catch (err) {
      console.error("Failed to load citizen details:", err);
    } finally {
      setDetailLoading(false);
    }
  };

  // Close modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isGrievanceModalOpen) {
          setIsGrievanceModalOpen(false);
        } else if (isDetailModalOpen) {
          setIsDetailModalOpen(false);
        }
      }
    };
    if (isDetailModalOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDetailModalOpen, isGrievanceModalOpen]);

  // Statistics
  const activeCount = citizens.filter((c) => c.isActive).length;
  const withGrievancesCount = citizens.filter((c) => (c.grievancesCount || 0) > 0).length;
  const totalGrievances = citizens.reduce((acc, curr) => acc + (curr.grievancesCount || 0), 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "RESOLVED":
      case "CLOSED":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded-md border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Resolved</span>
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-800 text-[10px] font-bold rounded-md border border-blue-200">
            <Clock className="w-3 h-3 text-blue-600" />
            <span>In Progress</span>
          </span>
        );
      case "ASSIGNED":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-50 text-purple-800 text-[10px] font-bold rounded-md border border-purple-200">
            <User className="w-3 h-3 text-purple-600" />
            <span>Assigned</span>
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-800 text-[10px] font-bold rounded-md border border-red-200">
            <AlertCircle className="w-3 h-3 text-red-600" />
            <span>Rejected</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-800 text-[10px] font-bold rounded-md border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Pending</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 leading-snug">
                Citizen Directory / नागरिक नोंदणी
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Comprehensive directory of verified citizens and their municipal engagement history
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fetchCitizens()}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500">Total Registered Citizens</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalCount}</div>
        </div>
        <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200/60 shadow-2xs">
          <div className="text-xs font-semibold text-emerald-800">Active Citizens</div>
          <div className="text-2xl font-black text-emerald-900 mt-1">{activeCount}</div>
        </div>
        <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200/60 shadow-2xs">
          <div className="text-xs font-semibold text-blue-800">Citizens with Grievances</div>
          <div className="text-2xl font-black text-blue-900 mt-1">{withGrievancesCount}</div>
        </div>
        <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200/60 shadow-2xs">
          <div className="text-xs font-semibold text-amber-800">Total Grievances Lodged</div>
          <div className="text-2xl font-black text-amber-900 mt-1">{totalGrievances}</div>
        </div>
      </div>

      {/* ── Search & Filter Bar ── */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search citizen by name, mobile, email, address..."
            className="w-full h-10 pl-9 pr-8 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-medium text-slate-800"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="text-xs font-semibold text-slate-500 hidden sm:block">
          Showing <strong className="text-slate-800">{citizens.length}</strong> of{" "}
          <strong className="text-slate-800">{totalCount}</strong> citizens
        </div>
      </div>

      {/* ── Citizens Table Card ── */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-700 mx-auto mb-2" />
            <p className="text-xs text-slate-500 font-medium">Fetching citizen directory...</p>
          </div>
        ) : citizens.length === 0 ? (
          <div className="py-20 text-center px-4">
            <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No citizens found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {search ? `No citizens match your search "${search}".` : "No citizens have registered on the portal yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 uppercase tracking-wider text-[10px] font-extrabold">
                  <th className="py-3.5 px-4 sm:px-6">Citizen</th>
                  <th className="py-3.5 px-4">Contact & Location</th>
                  <th className="py-3.5 px-4">Grievances</th>
                  <th className="py-3.5 px-4">Registered Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {citizens.map((citizen) => (
                  <tr
                    key={citizen.id}
                    onClick={() => handleOpenDetail(citizen.id)}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                  >
                    {/* Citizen Name & Avatar */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center font-bold text-slate-600 text-sm">
                          {citizen.profilePicture ? (
                            <img
                              src={citizen.profilePicture}
                              alt={citizen.name || "Citizen"}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors flex items-center gap-1.5">
                            <span>{citizen.name || "Citizen User"}</span>
                            <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">
                              ID: {citizen.id}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono font-medium flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{citizen.phone}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Email & Location */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        {citizen.email ? (
                          <div className="text-slate-600 flex items-center gap-1 truncate max-w-[200px]" title={citizen.email}>
                            <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{citizen.email}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">No email registered</span>
                        )}
                        {citizen.address ? (
                          <div className="text-[11px] text-slate-500 flex items-center gap-1 truncate max-w-[220px]" title={citizen.address}>
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{citizen.address}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px] block">Lonavala</span>
                        )}
                      </div>
                    </td>

                    {/* Grievance Count */}
                    <td className="py-3.5 px-4">
                      {(citizen.grievancesCount || 0) > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-800 text-xs font-extrabold rounded-lg border border-amber-200">
                          <FileText className="w-3.5 h-3.5 text-amber-600" />
                          <span>{citizen.grievancesCount} Complaints</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-500 text-[11px] font-medium rounded-lg">
                          0 Filed
                        </span>
                      )}
                    </td>

                    {/* Registration Date */}
                    <td className="py-3.5 px-4 text-slate-600 text-[11px] font-medium">
                      {citizen.createdDate
                        ? new Date(citizen.createdDate).toLocaleDateString("en-IN", {
                            dateStyle: "medium",
                          })
                        : "Registered"}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {citizen.isActive ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-800 text-[11px] font-bold rounded-lg border border-emerald-200">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>Verified</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-800 text-[11px] font-bold rounded-lg border border-red-200">
                          Deactivated
                        </span>
                      )}
                    </td>

                    {/* Action Button */}
                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDetail(citizen.id);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 font-bold text-xs rounded-xl shadow-2xs transition-all cursor-pointer group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Details / तपशील पहा</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* ── CITIZEN DETAILS POPUP MODAL ── */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {isDetailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="fixed inset-0" onClick={() => setIsDetailModalOpen(false)} />

          <div className="relative z-10 w-full max-w-3xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="px-6 py-5 bg-slate-50/90 border-b border-slate-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-black text-slate-900">
                      Citizen Profile Details
                    </h2>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md uppercase tracking-wider">
                      Verified Account
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Lonavala Municipal Corporation Citizen Registry
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 rounded-full transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-slate-700 text-xs">
              {detailLoading ? (
                <div className="py-16 text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-700 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">Loading citizen profile & grievances...</p>
                </div>
              ) : citizenDetail ? (
                <>
                  {/* Top Citizen Card */}
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white border-2 border-slate-200 shadow-sm shrink-0 flex items-center justify-center font-bold text-2xl text-slate-600">
                      {citizenDetail.profilePicture ? (
                        <img
                          src={citizenDetail.profilePicture}
                          alt={citizenDetail.name || "Citizen"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-10 h-10 text-slate-400" />
                      )}
                    </div>

                    <div className="flex-1 space-y-1.5">
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        <h3 className="text-lg font-black text-slate-900">
                          {citizenDetail.name || "Citizen User"}
                        </h3>
                        <span className="text-xs font-mono font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md">
                          Citizen ID: #{citizenDetail.id}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-slate-600">
                        <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                          <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="font-mono font-bold text-slate-900">{citizenDetail.phone}</span>
                        </div>
                        <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{citizenDetail.email || "No email address registered"}</span>
                        </div>
                        <div className="flex items-center gap-1.5 justify-center sm:justify-start sm:col-span-2">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{citizenDetail.address || "Lonavala Municipal Jurisdiction"}</span>
                        </div>
                        <div className="flex items-center gap-1.5 justify-center sm:justify-start sm:col-span-2 text-[11px] text-slate-400">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>
                            Registered on:{" "}
                            {citizenDetail.createdDate
                              ? new Date(citizenDetail.createdDate).toLocaleString("en-IN", {
                                  dateStyle: "full",
                                  timeStyle: "short",
                                })
                              : "Recently"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Grievances Section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Submitted Grievances / तक्रारींचा इतिहास</span>
                      </h4>
                      <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md">
                        {citizenDetail.grievances?.length || 0} Total Filed
                      </span>
                    </div>

                    {!citizenDetail.grievances || citizenDetail.grievances.length === 0 ? (
                      <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
                        <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-slate-500 font-medium">This citizen has not lodged any grievances yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {citizenDetail.grievances.map((grv) => (
                          <div
                            key={grv.id}
                            onClick={() => {
                              setInspectGrievance(grv);
                              setIsGrievanceModalOpen(true);
                            }}
                            className="p-4 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 hover:border-emerald-400 transition-all cursor-pointer space-y-2 group shadow-2xs"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                  {grv.ticketNumber}
                                </span>
                                <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-800 transition-colors">
                                  {grv.title}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                {getStatusBadge(grv.status)}
                                <span className="text-[10px] text-slate-400">
                                  {grv.createdDate ? new Date(grv.createdDate).toLocaleDateString("en-IN") : ""}
                                </span>
                              </div>
                            </div>

                            <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                              {grv.description}
                            </p>

                            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[10px] text-slate-500 border-t border-slate-100">
                              <span className="font-semibold text-slate-700">
                                Category: {grv.category}
                              </span>
                              {grv.assignedDepartment && (
                                <span className="bg-slate-100 px-2 py-0.5 rounded">
                                  Dept: {grv.assignedDepartment}
                                </span>
                              )}
                              <span className="text-emerald-700 font-bold group-hover:underline flex items-center gap-0.5">
                                Inspect Full Redressal Lifecycle &rarr;
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-slate-500">Failed to load citizen data.</div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>Print Profile</span>
              </button>

              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Close / बंद करा
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Sub-modal for inspecting grievance inside citizen popup ── */}
      {inspectGrievance && (
        <GrievanceDetailsModal
          grievance={inspectGrievance}
          isOpen={isGrievanceModalOpen}
          onClose={() => setIsGrievanceModalOpen(false)}
        />
      )}
    </div>
  );
}
