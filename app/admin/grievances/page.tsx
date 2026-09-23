"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Filter,
  X,
  CheckCircle2,
  Clock,
  User,
  Phone,
  Building,
  MapPin,
  ShieldCheck,
  Send,
  Upload,
  ArrowRight,
  AlertCircle,
  FileText,
  Loader2,
  RefreshCw,
  Eye,
  Calendar,
  Layers,
  MessageSquare,
  Check,
  Sparkles,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import {
  getAllGrievances,
  updateAdminGrievanceStatus,
  GrievanceItem,
  GrievanceStatusHistoryItem,
} from "@/lib/services/citizen.service";
import { useAdminAuth } from "@/context/AdminAuthContext";

const STATUS_LIST = [
  { value: "ALL", label: "All Statuses" },
  { value: "PENDING", label: "Pending Review" },
  { value: "ASSIGNED", label: "Assigned" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "CLOSED", label: "Closed" },
  { value: "REJECTED", label: "Rejected" },
];

const STATUS_DETAILS: Record<
  string,
  { label: string; bg: string; text: string; border: string; desc: string }
> = {
  PENDING: {
    label: "Pending Review",
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200",
    desc: "Awaiting initial review and department assignment.",
  },
  ASSIGNED: {
    label: "Assigned",
    bg: "bg-purple-50",
    text: "text-purple-800",
    border: "border-purple-200",
    desc: "Assigned to the responsible municipal department/officer.",
  },
  IN_PROGRESS: {
    label: "In Progress",
    bg: "bg-blue-50",
    text: "text-blue-800",
    border: "border-blue-200",
    desc: "Field inspection and active rectification underway.",
  },
  RESOLVED: {
    label: "Resolved",
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    border: "border-emerald-200",
    desc: "Issue resolved on-site. Verified by field team.",
  },
  CLOSED: {
    label: "Closed",
    bg: "bg-slate-100",
    text: "text-slate-800",
    border: "border-slate-200",
    desc: "Citizen satisfied and grievance case formally closed.",
  },
  REJECTED: {
    label: "Rejected",
    bg: "bg-red-50",
    text: "text-red-800",
    border: "border-red-200",
    desc: "Invalid, duplicate, or out-of-jurisdiction complaint.",
  },
};

export default function AdminGrievancesPage() {
  const { user: currentUser } = useAdminAuth();

  const [grievances, setGrievances] = useState<GrievanceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  // Popup Modal State
  const [selectedGrievance, setSelectedGrievance] = useState<GrievanceItem | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Status & Note Form State
  const [newStatus, setNewStatus] = useState<string>("IN_PROGRESS");
  const [stageNote, setStageNote] = useState("");
  const [assignedDepartment, setAssignedDepartment] = useState("");
  const [assignedOfficerId, setAssignedOfficerId] = useState<number>(1);
  const [updating, setUpdating] = useState(false);
  const [updateSuccessMsg, setUpdateSuccessMsg] = useState<string | null>(null);
  const [updateErrorMsg, setUpdateErrorMsg] = useState<string | null>(null);

  const loadGrievances = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllGrievances({
        status: filterStatus === "ALL" ? undefined : filterStatus,
      });
      setGrievances(res.data || []);
    } catch (err) {
      console.warn("Could not fetch admin grievances:", err);
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    loadGrievances();
  }, [loadGrievances]);

  const handleOpenModal = (g: GrievanceItem) => {
    setSelectedGrievance(g);
    setNewStatus(g.status || "IN_PROGRESS");
    setStageNote("");
    setAssignedDepartment(g.assignedDepartment || "");
    setAssignedOfficerId(g.assignedOfficerId || 1);
    setUpdateSuccessMsg(null);
    setUpdateErrorMsg(null);
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGrievance) return;

    setUpdating(true);
    setUpdateSuccessMsg(null);
    setUpdateErrorMsg(null);

    const officerDisplayName = currentUser?.firstName
      ? `${currentUser.firstName} ${currentUser.lastName || ""}`.trim()
      : currentUser?.email || "Admin Officer";

    try {
      const response = await updateAdminGrievanceStatus(selectedGrievance.id, {
        status: newStatus,
        assignedDepartment: assignedDepartment || undefined,
        assignedOfficerId: assignedOfficerId || undefined,
        note: stageNote.trim() || undefined,
        resolutionNotes: stageNote.trim() || undefined,
        updatedBy: officerDisplayName,
      });

      const updatedGrievance = response?.grievance || response?.data?.grievance || {
        ...selectedGrievance,
        status: newStatus as any,
        assignedDepartment,
        assignedOfficerId,
        resolutionNotes: stageNote.trim() || selectedGrievance.resolutionNotes,
      };

      // If backend returned updated grievance, refresh modal data
      if (response?.grievance || response?.data?.grievance) {
        setSelectedGrievance(response.grievance || response.data.grievance);
      } else {
        // Optimistically update status history
        const updatedHistory: GrievanceStatusHistoryItem[] = [
          ...(selectedGrievance.statusHistory || []),
          {
            status: newStatus as any,
            note: stageNote.trim() || `Status updated to ${newStatus}`,
            updatedAt: new Date().toISOString(),
            updatedBy: officerDisplayName,
            assignedDepartment: assignedDepartment || selectedGrievance.assignedDepartment || undefined,
          },
        ];
        setSelectedGrievance({
          ...selectedGrievance,
          status: newStatus as any,
          assignedDepartment,
          assignedOfficerId,
          resolutionNotes: stageNote.trim() || selectedGrievance.resolutionNotes,
          statusHistory: updatedHistory,
        });
      }

      setStageNote("");
      setUpdateSuccessMsg(`Status updated to "${newStatus}" and note recorded.`);
      await loadGrievances();
    } catch (err: any) {
      console.error("Failed to update status:", err);
      setUpdateErrorMsg(err?.message || "Failed to update grievance status.");
    } finally {
      setUpdating(false);
    }
  };

  const filteredGrievances = grievances.filter((g) => {
    const q = search.toLowerCase();
    const citizenName = g.citizen?.name || "";
    const citizenMobile = g.citizen?.phone || "";
    const matchesSearch =
      g.ticketNumber.toLowerCase().includes(q) ||
      g.title.toLowerCase().includes(q) ||
      citizenName.toLowerCase().includes(q) ||
      citizenMobile.toLowerCase().includes(q) ||
      (g.assignedDepartment || "").toLowerCase().includes(q) ||
      g.category.toLowerCase().includes(q);

    return matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const config = STATUS_DETAILS[status] || STATUS_DETAILS.PENDING;
    return (
      <span
        className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${config.bg} ${config.text} ${config.border} flex items-center gap-1 inline-flex`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
        <span>{config.label}</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Grievance Redressal Desk</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track citizen complaints, review status transitions with stage-specific notes, and assign departments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => loadGrievances()}
            disabled={loading}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-emerald-700" : ""}`} />
          </button>
          <div className="text-xs font-semibold text-slate-500 bg-white px-3 py-2 rounded-xl border border-slate-200">
            Total Complaints: <strong className="text-emerald-700">{filteredGrievances.length}</strong>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:max-w-md relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Ticket ID, Citizen Name, Mobile, Category..."
            className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600 focus:bg-white transition-colors"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Filter Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 focus:outline-hidden focus:border-emerald-600"
          >
            {STATUS_LIST.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grievance Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        {loading ? (
          <div className="py-16 text-center">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-700 mx-auto mb-2" />
            <p className="text-xs text-slate-500">Loading citizen grievances...</p>
          </div>
        ) : filteredGrievances.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500">
            No grievances found matching the criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Ticket Ref</th>
                  <th className="py-4 px-6">Citizen Reference</th>
                  <th className="py-4 px-6">Category & Title</th>
                  <th className="py-4 px-6">Assigned Department</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredGrievances.map((g) => (
                  <tr
                    key={g.id}
                    onClick={() => handleOpenModal(g)}
                    className="hover:bg-emerald-50/40 cursor-pointer transition-colors group"
                  >
                    <td className="py-4 px-6 font-mono font-bold text-emerald-700 whitespace-nowrap">
                      {g.ticketNumber}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="font-bold text-slate-900">
                        {g.citizen?.name || "Citizen (Guest)"}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {g.citizen?.phone || "No phone"}
                      </div>
                    </td>
                    <td className="py-4 px-6 max-w-xs">
                      <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                        {g.category}
                      </div>
                      <div className="font-semibold text-slate-900 truncate">{g.title}</div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-slate-600 font-medium">
                      {g.assignedDepartment || "Pending Wing Assignment"}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">{getStatusBadge(g.status)}</td>
                    <td className="py-4 px-6 text-center whitespace-nowrap">
                      <button
                        type="button"
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-700 group-hover:text-white font-bold text-xs transition-all flex items-center gap-1.5 mx-auto"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Details</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Grievance Details & Status Notes POPUP MODAL */}
      {selectedGrievance && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50/80 flex items-start justify-between gap-4 shrink-0">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-base font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                    {selectedGrievance.ticketNumber}
                  </span>
                  {getStatusBadge(selectedGrievance.status)}
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-200 text-slate-700">
                    {selectedGrievance.category}
                  </span>
                  {selectedGrievance.wardNumber && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                      Ward #{selectedGrievance.wardNumber}
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-extrabold text-slate-900 leading-tight">
                  {selectedGrievance.title}
                </h2>
                <div className="text-[11px] text-slate-400 flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  <span>
                    Reported on:{" "}
                    {new Date(selectedGrievance.createdDate).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedGrievance(null)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 flex-1">
              {/* Alert Feedback Messages */}
              {updateSuccessMsg && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2.5 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold">{updateSuccessMsg}</span>
                </div>
              )}
              {updateErrorMsg && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span className="font-semibold">{updateErrorMsg}</span>
                </div>
              )}

              {/* Top Info Grid: Citizen & Assignment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Citizen Information */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <div className="font-bold uppercase tracking-wider text-slate-400 text-[10px] flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Citizen Reference Details</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Name:</span>
                      <strong className="text-slate-900">
                        {selectedGrievance.citizen?.name || "Citizen (Guest)"}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Mobile Phone:</span>
                      <span className="font-mono font-semibold text-slate-900">
                        {selectedGrievance.citizen?.phone || "N/A"}
                      </span>
                    </div>
                    {selectedGrievance.citizen?.email && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Email:</span>
                        <span className="font-mono text-slate-800">{selectedGrievance.citizen.email}</span>
                      </div>
                    )}
                    <div className="pt-1 border-t border-slate-200 flex items-start gap-1 text-[11px]">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{selectedGrievance.address || "Location within Municipal Limits"}</span>
                    </div>
                  </div>
                </div>

                {/* Assignment & Resolution Status */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <div className="font-bold uppercase tracking-wider text-slate-400 text-[10px] flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Department & Resolution Status</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Assigned Wing:</span>
                      <strong className="text-slate-900">
                        {selectedGrievance.assignedDepartment || "Unassigned"}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Current Status:</span>
                      <span className="font-semibold">{selectedGrievance.status}</span>
                    </div>
                    {selectedGrievance.resolvedAt && (
                      <div className="flex justify-between text-emerald-800 font-medium">
                        <span>Resolved On:</span>
                        <span>
                          {new Date(selectedGrievance.resolvedAt).toLocaleDateString("en-IN", {
                            dateStyle: "medium",
                          })}
                        </span>
                      </div>
                    )}
                    <div className="pt-1 border-t border-slate-200 text-[11px] text-slate-500">
                      Last Updated:{" "}
                      {new Date(selectedGrievance.updatedDate).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Full Description */}
              <div className="space-y-1.5">
                <h4 className="font-bold uppercase tracking-wider text-slate-500 text-[10px] flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Complaint Description</span>
                </h4>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-slate-800 leading-relaxed font-normal whitespace-pre-wrap">
                  {selectedGrievance.description}
                </div>
              </div>

              {/* Attached Photos / Site Evidence */}
              {selectedGrievance.attachmentUrls && selectedGrievance.attachmentUrls.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-bold uppercase tracking-wider text-slate-500 text-[10px] flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Uploaded Site Photos & Evidence ({selectedGrievance.attachmentUrls.length})</span>
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {selectedGrievance.attachmentUrls.map((url, i) => (
                      <div
                        key={i}
                        onClick={() => setSelectedImage(url)}
                        className="group relative h-24 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 cursor-pointer shadow-2xs hover:shadow-md transition-all"
                      >
                        <img
                          src={url}
                          alt={`Evidence #${i + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                          <Eye className="w-5 h-5" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Status History & Stage Notes Timeline */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold uppercase tracking-wider text-slate-700 text-xs flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-emerald-700" />
                    <span>Stage Notes & Status History</span>
                  </h4>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    {(selectedGrievance.statusHistory || []).length} Stage Transitions
                  </span>
                </div>

                <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200 space-y-4">
                  {(!selectedGrievance.statusHistory || selectedGrievance.statusHistory.length === 0) ? (
                    <div className="text-slate-400 italic text-center py-4">
                      Initial status: {selectedGrievance.status}. No detailed stage notes recorded yet.
                    </div>
                  ) : (
                    <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-200">
                      {selectedGrievance.statusHistory.map((step, idx) => {
                        const config = STATUS_DETAILS[step.status] || STATUS_DETAILS.PENDING;
                        return (
                          <div key={idx} className="relative group">
                            {/* Dot Icon */}
                            <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-white border-2 border-emerald-600 flex items-center justify-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                            </div>

                            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${config.bg} ${config.text} ${config.border}`}
                                  >
                                    {config.label}
                                  </span>
                                  {step.assignedDepartment && (
                                    <span className="text-[10px] font-semibold text-slate-500">
                                      • {step.assignedDepartment}
                                    </span>
                                  )}
                                </div>

                                <div className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                                  <Clock className="w-3 h-3" />
                                  <span>
                                    {step.updatedAt
                                      ? new Date(step.updatedAt).toLocaleString("en-IN", {
                                          dateStyle: "medium",
                                          timeStyle: "short",
                                        })
                                      : "Recorded"}
                                  </span>
                                </div>
                              </div>

                              {/* Note / Remarks for this status */}
                              <p className="text-slate-800 text-xs font-medium bg-slate-50/80 p-2.5 rounded-lg border border-slate-100">
                                {step.note || "No specific note provided for this stage."}
                              </p>

                              {step.updatedBy && (
                                <div className="text-[10px] text-slate-400 text-right">
                                  Updated by: <span className="font-semibold text-slate-600">{step.updatedBy}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Status Update & Add Stage Note Form */}
              <form
                onSubmit={handleUpdateStatus}
                className="bg-emerald-50/40 p-5 rounded-2xl border border-emerald-200 space-y-4 pt-4"
              >
                <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2">
                  <h4 className="font-extrabold text-xs text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-700" />
                    <span>Update Status & Record Stage Note</span>
                  </h4>
                  <span className="text-[10px] font-bold text-emerald-800">Officer Action Panel</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      New Status Transition *
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-800 focus:outline-hidden focus:border-emerald-600"
                    >
                      <option value="PENDING">PENDING (Pending Review)</option>
                      <option value="ASSIGNED">ASSIGNED (Assigned to Officer)</option>
                      <option value="IN_PROGRESS">IN_PROGRESS (Under Execution)</option>
                      <option value="RESOLVED">RESOLVED (Action Complete / Repaired)</option>
                      <option value="CLOSED">CLOSED (Verified & Closed)</option>
                      <option value="REJECTED">REJECTED (Invalid / Duplicate)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Assign Department Wing
                    </label>
                    <input
                      type="text"
                      value={assignedDepartment}
                      onChange={(e) => setAssignedDepartment(e.target.value)}
                      placeholder="e.g. Water Supply Department, PWD, Health Wing..."
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl font-medium text-slate-800 focus:outline-hidden focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Stage-Specific Notes / Action Taken for this Status *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={stageNote}
                    onChange={(e) => setStageNote(e.target.value)}
                    placeholder="Enter detailed notes for this status update (e.g. Field engineer inspected spot, excavation completed, water valve replaced, illumination restored...)"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl font-medium text-slate-800 focus:outline-hidden focus:border-emerald-600 text-xs"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setNewStatus("RESOLVED");
                      setStageNote("Issue rectified and verified on site by municipal inspection team.");
                    }}
                    className="px-4 py-2 bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Quick: Mark Resolved
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 disabled:opacity-70 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    {updating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Updating Status...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Save Status & Append Stage Note</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Full-Screen Image Zoom Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-60 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-3xl max-h-[85vh]">
            <img
              src={selectedImage}
              alt="Zoomed Evidence"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-3 -right-3 p-2 bg-white text-slate-900 rounded-full shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
