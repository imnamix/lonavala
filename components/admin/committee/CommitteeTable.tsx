"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Layers,
  Plus,
  Trash2,
  Edit2,
  Eye,
  Search,
  Users,
  Award,
  CheckCircle2,
  X,
  Loader2,
  RefreshCw,
  UserCheck,
  ShieldCheck,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { StandingCommittee, CouncilMember } from "@/types";
import {
  getCommittees,
  deleteCommittee,
  toggleCommitteeActive,
} from "@/lib/services/committee.service";

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

export function CommitteeTable() {
  const router = useRouter();
  const [committees, setCommittees] = useState<StandingCommittee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedCommittee, setSelectedCommittee] = useState<StandingCommittee | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchCommittees = async () => {
    try {
      setLoading(true);
      const data = await getCommittees();
      setCommittees(data);
    } catch (err) {
      console.error("Failed to load standing committees:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommittees();
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
      await toggleCommitteeActive(id);
      setCommittees((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, isActive: c.isActive === false ? true : false } : c
        )
      );
      showToast("Visibility status updated successfully.");
    } catch (err) {
      console.error("Failed to toggle active status:", err);
      showToast("Error updating visibility status.");
    }
  };

  const handleDelete = async (id: string | number, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete '${name}' committee?`)) {
      try {
        await deleteCommittee(id);
        setCommittees((prev) => prev.filter((c) => c.id !== id));
        showToast(`Removed '${name}' successfully.`);
        if (selectedCommittee?.id === id) {
          setSelectedCommittee(null);
        }
      } catch (err) {
        console.error("Failed to delete committee:", err);
        showToast("Failed to delete committee.");
      }
    }
  };

  // Filter committees based on search and status
  const filteredCommittees = committees.filter((c) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      searchQuery === "" ||
      c.name.toLowerCase().includes(q) ||
      (c.marathiName && c.marathiName.toLowerCase().includes(q)) ||
      (c.description && c.description.toLowerCase().includes(q)) ||
      (c.chairman && c.chairman.name.toLowerCase().includes(q));

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE" && c.isActive !== false) ||
      (statusFilter === "INACTIVE" && c.isActive === false);

    return matchesSearch && matchesStatus;
  });

  const totalAssignedMembers = new Set(
    committees.flatMap((c) => (Array.isArray(c.memberIds) ? c.memberIds : []))
  ).size;

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
              {committees.length} Standing Committees
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-text-primary mt-0.5">
            Standing Committees Management
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Manage municipal statutory committees, assigned Chairpersons, and multi-member rosters.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchCommittees}
            disabled={loading}
            className="p-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors shadow-2xs"
            title="Refresh List"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-primary" : ""}`} />
          </button>
          <Link
            href="/admin/committees/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-md shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Standing Committee</span>
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-border shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search committees, chairman..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs focus:outline-none focus:border-primary focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-text-muted whitespace-nowrap">Status:</span>
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

      {/* Committees Table */}
      <div className="bg-white rounded-2xl border border-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-text-muted font-bold border-b border-gray-100 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-3.5">Committee Name</th>
                <th className="px-5 py-3.5">Chairman (सभापती)</th>
                <th className="px-5 py-3.5">Members ({totalAssignedMembers})</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-text-muted">
                    <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto mb-2" />
                    <span>Loading committees...</span>
                  </td>
                </tr>
              ) : filteredCommittees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-text-muted">
                    <Layers className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <div className="font-bold text-slate-800">No standing committees found</div>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {searchQuery
                        ? "Try clearing your search query"
                        : "Click 'Add Standing Committee' to create the first committee."}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredCommittees.map((committee) => (
                  <tr
                    key={committee.id}
                    onClick={() => setSelectedCommittee(committee)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                  >
                    {/* Committee Name */}
                    <td className="px-5 py-4 min-w-[220px]">
                      <div className="font-bold text-sm text-slate-900 group-hover:text-primary transition-colors">
                        {committee.name}
                      </div>
                      {committee.marathiName && (
                        <div className="text-xs text-emerald-700 font-medium">
                          {committee.marathiName}
                        </div>
                      )}
                      {committee.description && (
                        <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 max-w-sm">
                          {committee.description}
                        </div>
                      )}
                    </td>

                    {/* Chairman */}
                    <td className="px-5 py-4 min-w-[200px]">
                      {committee.chairman ? (
                        <div className="flex items-center gap-2.5">
                          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0 border border-emerald-300">
                            {committee.chairman.image ? (
                              <Image
                                src={committee.chairman.image}
                                alt={committee.chairman.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              getInitials(committee.chairman.name)
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 leading-tight">
                              {committee.chairman.name}
                            </div>
                            <div className="text-[10px] text-slate-500">
                              {committee.chairman.ward || committee.chairman.designation || "Chairman"}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">Not Appointed</span>
                      )}
                    </td>

                    {/* Members List / Avatar pile */}
                    <td className="px-5 py-4 min-w-[200px]">
                      <div className="flex items-center gap-2">
                        {/* Member avatars */}
                        <div className="flex -space-x-2 overflow-hidden">
                          {(committee.members || []).slice(0, 4).map((member, mIdx) => (
                            <div
                              key={member.id || mIdx}
                              title={`${member.name} (${member.ward || ""})`}
                              className="relative w-7 h-7 rounded-full ring-2 ring-white overflow-hidden bg-slate-200 text-slate-700 font-bold text-[9px] flex items-center justify-center shrink-0 shadow-2xs"
                            >
                              {member.image ? (
                                <Image
                                  src={member.image}
                                  alt={member.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                getInitials(member.name)
                              )}
                            </div>
                          ))}
                        </div>

                        <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                          {committee.memberIds?.length || 0} Member{committee.memberIds?.length === 1 ? "" : "s"}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <button
                        onClick={(e) => handleToggleActive(committee.id, e)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                          committee.isActive !== false
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
                            : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200"
                        }`}
                        title="Click to toggle visibility"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            committee.isActive !== false ? "bg-emerald-500" : "bg-gray-400"
                          }`}
                        />
                        <span>{committee.isActive !== false ? "Active" : "Inactive"}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/committees/${committee.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-primary hover:bg-primary/5 transition-colors"
                          title="Edit Committee"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={(e) => handleDelete(committee.id, committee.name, e)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete Committee"
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

      {/* Side Drawer Modal for Detailed View */}
      {selectedCommittee && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="w-full max-w-lg bg-white h-full shadow-2xl overflow-y-auto p-6 flex flex-col justify-between space-y-6 animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-start justify-between pb-4 border-b border-gray-100">
                <div>
                  <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                    Standing Committee Details
                  </span>
                  <h3 className="text-xl font-black text-slate-900 mt-1">
                    {selectedCommittee.name}
                  </h3>
                  {selectedCommittee.marathiName && (
                    <p className="text-sm font-bold text-emerald-700 mt-0.5">
                      {selectedCommittee.marathiName}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setSelectedCommittee(null)}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Description */}
              {selectedCommittee.description && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Mandate & Description
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    {selectedCommittee.description}
                  </p>
                </div>
              )}

              {/* Chairman Card */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Committee Chairman (सभापती)
                </h4>
                {selectedCommittee.chairman ? (
                  <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200 flex items-center gap-3">
                    <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-300">
                      {selectedCommittee.chairman.image ? (
                        <Image
                          src={selectedCommittee.chairman.image}
                          alt={selectedCommittee.chairman.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        getInitials(selectedCommittee.chairman.name)
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        {selectedCommittee.chairman.name}
                      </div>
                      <div className="text-[11px] text-emerald-700 font-semibold">
                        {selectedCommittee.chairman.marathiName}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {selectedCommittee.chairman.designation} {selectedCommittee.chairman.ward ? `• ${selectedCommittee.chairman.ward}` : ""}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No chairman currently assigned.</p>
                )}
              </div>

              {/* Committee Members list */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Assigned Committee Members ({selectedCommittee.members?.length || 0})
                  </h4>
                </div>

                {(selectedCommittee.members || []).length > 0 ? (
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {selectedCommittee.members?.map((member) => (
                      <div
                        key={member.id}
                        className="p-2.5 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 flex items-center gap-3 transition-colors shadow-2xs"
                      >
                        <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0 border border-slate-200">
                          {member.image ? (
                            <Image
                              src={member.image}
                              alt={member.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            getInitials(member.name)
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-slate-900 truncate">
                            {member.name}
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">
                            {member.designation} {member.ward ? `• ${member.ward}` : ""}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No members assigned to this committee.</p>
                )}
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
              <button
                onClick={(e) => handleDelete(selectedCommittee.id, selectedCommittee.name, e)}
                className="px-4 py-2 rounded-xl text-red-600 hover:bg-red-50 text-xs font-bold transition-colors"
              >
                Delete
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedCommittee(null)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors"
                >
                  Close
                </button>
                <Link
                  href={`/admin/committees/${selectedCommittee.id}`}
                  className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-colors"
                >
                  Edit Committee
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
