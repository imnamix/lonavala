"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Scale,
  Users,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  FileText,
  FileCheck,
  Calendar,
  Clock,
  Download,
  MapPin,
  Phone,
  Mail,
  Award,
  ShieldCheck,
  CheckCircle2,
  X,
  ExternalLink,
  RefreshCw,
  Sparkles,
  Gavel,
  BookOpen,
  AlertCircle,
} from "lucide-react";
import {
  getAllMembers,
  getAllProceedings,
  getAllSessions,
  createMember,
  updateMember,
  deleteMember,
  createProceeding,
  updateProceeding,
  deleteProceeding,
  createSession,
  updateSession,
  deleteSession,
} from "@/lib/services/court.service";
import { CourtCommitteeMember, AdalatUpdate, CourtSession } from "@/types";

function getInitials(name: string) {
  const cleaned = name
    .replace(/^(Adv\.|Shri\.|Smt\.|Dr\.)\s+/i, "")
    .replace(/\(.*?\)/g, "")
    .trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "LM";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const STORAGE_KEY_MEMBERS = "lmc_court_committee_members_v1";
const STORAGE_KEY_PROCEEDINGS = "lmc_court_proceedings_v1";
const STORAGE_KEY_SESSIONS = "lmc_court_sessions_v1";

interface CourtAdminManagerProps {
  initialTab?: "members" | "proceedings" | "sessions";
}

export function CourtAdminManager({ initialTab = "members" }: CourtAdminManagerProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"members" | "proceedings" | "sessions">(initialTab);

  // Synchronize with initialTab prop if it changes
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Members state
  const [members, setMembers] = useState<CourtCommitteeMember[]>([]);
  const [memberSearch, setMemberSearch] = useState("");
  const [memberCategoryFilter, setMemberCategoryFilter] = useState("ALL");
  const [selectedMember, setSelectedMember] = useState<CourtCommitteeMember | null>(null);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<CourtCommitteeMember | null>(null);

  // Proceedings state
  const [proceedings, setProceedings] = useState<AdalatUpdate[]>([]);
  const [proceedingSearch, setProceedingSearch] = useState("");
  const [proceedingStatusFilter, setProceedingStatusFilter] = useState("ALL");
  const [isProceedingModalOpen, setIsProceedingModalOpen] = useState(false);
  const [editingProceeding, setEditingProceeding] = useState<AdalatUpdate | null>(null);
  const [selectedProceeding, setSelectedProceeding] = useState<AdalatUpdate | null>(null);

  // Sessions state (Next Session & Hearing Schedule)
  const [sessions, setSessions] = useState<CourtSession[]>([]);
  const [sessionSearch, setSessionSearch] = useState("");
  const [sessionStatusFilter, setSessionStatusFilter] = useState("ALL");
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<CourtSession | null>(null);
  const [selectedSession, setSelectedSession] = useState<CourtSession | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load storage or defaults
  const loadData = async () => {
    try {
      const [memberData, proceedingData, sessionData] = await Promise.all([
        getAllMembers(),
        getAllProceedings(),
        getAllSessions(),
      ]);
      setMembers(memberData || []);
      setProceedings(proceedingData || []);
      setSessions(sessionData || []);
    } catch (err) {
      console.error("Failed to load court data in manager", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = async () => {
    await loadData();
    showToast("Refreshed court data successfully.");
  };

  // Member CRUD
  const handleSaveMember = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const responsibilitiesStr = (formData.get("responsibilities") as string) || "";
    const respList = responsibilitiesStr
      .split("\n")
      .map((r) => r.trim())
      .filter(Boolean);

    const memberPayload = {
      name: (formData.get("name") as string) || "",
      marathiName: (formData.get("marathiName") as string) || "",
      designation: (formData.get("designation") as string) || "",
      role: (formData.get("role") as string) || "Member",
      category: (formData.get("category") as any) || "Committee Member",
      ward: (formData.get("ward") as string) || "",
      phone: (formData.get("phone") as string) || "",
      email: (formData.get("email") as string) || "",
      experience: (formData.get("experience") as string) || "",
      responsibilities: respList.length > 0 ? respList : ["Statutory municipal legal oversight"],
    };

    if (editingMember) {
      await updateMember(editingMember.id, memberPayload);
      showToast(`Updated member '${memberPayload.name}'.`);
    } else {
      await createMember(memberPayload);
      showToast(`Added new member '${memberPayload.name}'.`);
    }

    await loadData();
    setIsMemberModalOpen(false);
    setEditingMember(null);
  };

  const handleDeleteMember = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete member '${name}'?`)) {
      await deleteMember(id);
      await loadData();
      if (selectedMember?.id === id) setSelectedMember(null);
      showToast(`Removed member '${name}'.`);
    }
  };

  // Proceeding CRUD
  const handleSaveProceeding = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const procPayload = {
      subject: (formData.get("subject") as string) || "",
      marathiSubject: (formData.get("marathiSubject") as string) || "",
      description: (formData.get("description") as string) || "",
      marathiDescription: (formData.get("marathiDescription") as string) || "",
      date: (formData.get("date") as string) || "",
      minutes: (formData.get("minutes") as string) || "",
      marathiMinutes: (formData.get("marathiMinutes") as string) || "",
      pdfUrl: (formData.get("pdfUrl") as string) || "",
      fileSize: (formData.get("fileSize") as string) || "1.2 MB",
      benchOfficers: (formData.get("benchOfficers") as string) || "",
      venue: (formData.get("venue") as string) || "",
      status: (formData.get("status") as any) || "Upcoming",
    };

    if (editingProceeding) {
      await updateProceeding(editingProceeding.id, procPayload);
      showToast(`Updated proceeding '${procPayload.subject}'.`);
    } else {
      await createProceeding(procPayload);
      showToast(`Added new proceeding '${procPayload.subject}'.`);
    }

    await loadData();
    setIsProceedingModalOpen(false);
    setEditingProceeding(null);
  };

  const handleDeleteProceeding = async (id: string, subject?: string) => {
    if (confirm(`Are you sure you want to delete this proceeding record${subject ? ` "${subject}"` : ""}?`)) {
      await deleteProceeding(id);
      await loadData();
      if (selectedProceeding?.id === id) setSelectedProceeding(null);
      showToast(`Deleted proceeding record.`);
    }
  };

  // Session CRUD
  const handleSaveSession = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const casesStr = (formData.get("casesListed") as string) || "";
    const casesList = casesStr
      .split("\n")
      .map((c) => c.trim())
      .filter(Boolean);

    const sessionPayload = {
      sessionTitle: (formData.get("sessionTitle") as string) || "",
      marathiSessionTitle: (formData.get("marathiSessionTitle") as string) || "",
      hearingDate: (formData.get("hearingDate") as string) || "",
      time: (formData.get("time") as string) || "11:00 AM",
      courtForum: (formData.get("courtForum") as string) || "",
      presidingBench: (formData.get("presidingBench") as string) || "",
      casesListed: casesList.length > 0 ? casesList : ["Municipal Statutory Review Matter"],
      sessionAgenda: (formData.get("sessionAgenda") as string) || "",
      marathiSessionAgenda: (formData.get("marathiSessionAgenda") as string) || "",
      status: (formData.get("status") as any) || "Scheduled",
      noticePdfUrl: (formData.get("noticePdfUrl") as string) || "",
    };

    if (editingSession) {
      await updateSession(editingSession.id, sessionPayload);
      showToast(`Updated session '${sessionPayload.sessionTitle}'.`);
    } else {
      await createSession(sessionPayload);
      showToast(`Added next session '${sessionPayload.sessionTitle}'.`);
    }

    await loadData();
    setIsSessionModalOpen(false);
    setEditingSession(null);
  };

  const handleDeleteSession = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete session '${title}'?`)) {
      await deleteSession(id);
      await loadData();
      if (selectedSession?.id === id) setSelectedSession(null);
      showToast(`Deleted session record.`);
    }
  };

  // Filters
  const filteredMembers = members.filter((m) => {
    const matchesCat =
      memberCategoryFilter === "ALL" || m.category === memberCategoryFilter;
    const q = memberSearch.toLowerCase();
    const matchesSearch =
      m.name.toLowerCase().includes(q) ||
      m.marathiName.toLowerCase().includes(q) ||
      m.designation.toLowerCase().includes(q) ||
      (m.ward && m.ward.toLowerCase().includes(q)) ||
      m.role.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const filteredProceedings = proceedings.filter((p) => {
    const matchesStatus =
      proceedingStatusFilter === "ALL" || p.status === proceedingStatusFilter;
    const q = proceedingSearch.toLowerCase();
    const matchesSearch =
      p.subject.toLowerCase().includes(q) ||
      (p.marathiSubject && p.marathiSubject.toLowerCase().includes(q)) ||
      (p.venue && p.venue.toLowerCase().includes(q)) ||
      p.description.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const filteredSessions = sessions.filter((s) => {
    const matchesStatus =
      sessionStatusFilter === "ALL" || s.status === sessionStatusFilter;
    const q = sessionSearch.toLowerCase();
    const matchesSearch =
      s.sessionTitle.toLowerCase().includes(q) ||
      (s.marathiSessionTitle && s.marathiSessionTitle.toLowerCase().includes(q)) ||
      s.courtForum.toLowerCase().includes(q) ||
      s.sessionAgenda.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const leadershipCount = members.filter((m) => m.category === "Leadership").length;
  const legalOfficerCount = members.filter((m) => m.category === "Legal Officer").length;
  const nextScheduledSession = sessions.find((s) => s.status === "Scheduled")?.hearingDate || "14 Oct 2026";

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-white text-sm font-semibold animate-in slide-in-from-bottom-5 duration-200 ${
            toastMessage.type === "success" ? "bg-emerald-800" : "bg-rose-800"
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            <Scale className="w-3.5 h-3.5 text-emerald-700" />
            <span>Hon. High Court & Legal Affairs Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Court Committee Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Manage committee members, judicial proceedings, court orders, and next scheduled hearing sessions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/court"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            <span>View Public Page</span>
          </Link>

          <button
            onClick={handleRefresh}
            title="Refresh court data"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {activeTab === "members" && (
            <button
              onClick={() => {
                setEditingMember(null);
                setIsMemberModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md shadow-emerald-700/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Committee Member</span>
            </button>
          )}

          {activeTab === "proceedings" && (
            <button
              onClick={() => {
                setEditingProceeding(null);
                setIsProceedingModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md shadow-emerald-700/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Court Proceeding</span>
            </button>
          )}

          {activeTab === "sessions" && (
            <button
              onClick={() => {
                setEditingSession(null);
                setIsSessionModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md shadow-emerald-700/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Next Session</span>
            </button>
          )}
        </div>
      </div>

      {/* Metrics Summary Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Members</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {members.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">विधी समिती एकूण सदस्य</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Leadership & Advisory</span>
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700 mt-2">
            {leadershipCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">सभापती व कायदेशीर सल्लागार</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Legal Officers & Staff</span>
            <ShieldCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-800 mt-2">
            {legalOfficerCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">विधी विभाग अधिकारी</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Next Scheduled Session</span>
            <Calendar className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-lg sm:text-xl font-black text-emerald-800 mt-2 truncate">
            {nextScheduledSession}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {sessions.length} upcoming hearing schedules
          </div>
        </div>
      </div>

      {/* Main Tab Navigation Buttons */}
      <div className="bg-white rounded-3xl border border-slate-200 p-2 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-2">
        <button
          onClick={() => {
            setActiveTab("members");
            router.push("/admin/court/members");
          }}
          className={`flex items-center justify-center gap-2 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === "members"
              ? "bg-emerald-700 text-white shadow-md shadow-emerald-700/20"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Committee Members ({members.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("proceedings");
            router.push("/admin/court/proceedings");
          }}
          className={`flex items-center justify-center gap-2 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === "proceedings"
              ? "bg-emerald-700 text-white shadow-md shadow-emerald-700/20"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Court Proceedings & Orders ({proceedings.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("sessions");
            router.push("/admin/court/sessions");
          }}
          className={`flex items-center justify-center gap-2 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === "sessions"
              ? "bg-emerald-700 text-white shadow-md shadow-emerald-700/20"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Next Session & Schedule ({sessions.length})</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* 1. COMMITTEE MEMBERS TAB */}
      {/* ========================================================= */}
      {activeTab === "members" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search member by name, role, ward..."
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
              {[
                { label: "All", value: "ALL" },
                { label: "Leadership", value: "Leadership" },
                { label: "Committee Members", value: "Committee Member" },
                { label: "Legal Officers", value: "Legal Officer" },
              ].map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setMemberCategoryFilter(cat.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    memberCategoryFilter === cat.value
                      ? "bg-emerald-700 text-white shadow-2xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Members Table */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-800 uppercase font-bold border-b border-slate-200 text-[11px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Member</th>
                    <th className="py-3.5 px-4">Role & Category</th>
                    <th className="py-3.5 px-4">Ward / Office</th>
                    <th className="py-3.5 px-4">Contact</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMembers.map((member) => (
                    <tr
                      key={member.id}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                      onClick={() => setSelectedMember(member)}
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 border border-white ring-1 ring-slate-200">
                            {getInitials(member.name)}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors text-sm">
                              {member.name}
                            </div>
                            <div className="text-[11px] font-semibold text-emerald-700">
                              {member.marathiName}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate max-w-xs">
                              {member.designation}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              member.role === "Chairman"
                                ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                                : member.category === "Leadership"
                                ? "bg-amber-100 text-amber-900 border border-amber-300"
                                : member.category === "Legal Officer"
                                ? "bg-blue-100 text-blue-900 border border-blue-300"
                                : "bg-slate-100 text-slate-800 border border-slate-200"
                            }`}
                          >
                            {member.role}
                          </span>
                          <div className="text-[10px] text-slate-400">
                            {member.category}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-slate-700 font-medium">
                          {member.ward || "—"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5 text-[11px]">
                          {member.phone && (
                            <div className="flex items-center gap-1 text-slate-700">
                              <Phone className="w-3 h-3 text-emerald-600" />
                              <span>{member.phone}</span>
                            </div>
                          )}
                          {member.email && (
                            <div className="flex items-center gap-1 text-slate-500 truncate max-w-[150px]">
                              <Mail className="w-3 h-3 text-emerald-600" />
                              <span>{member.email}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div
                          className="flex items-center justify-end gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => setSelectedMember(member)}
                            title="View details"
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingMember(member);
                              setIsMemberModalOpen(true);
                            }}
                            title="Edit member"
                            className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-700 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteMember(member.id, member.name)}
                            title="Delete member"
                            className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredMembers.length === 0 && (
                <div className="p-8 text-center text-slate-500 text-xs">
                  No committee members found matching your search.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. COURT PROCEEDINGS & ORDERS TAB */}
      {/* ========================================================= */}
      {activeTab === "proceedings" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search case, forum, subject..."
                value={proceedingSearch}
                onChange={(e) => setProceedingSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            {/* Status Filter */}
            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
              {[
                { label: "All", value: "ALL" },
                { label: "Upcoming", value: "Upcoming" },
                { label: "Order Passed", value: "Order Passed" },
                { label: "Minutes Published", value: "Minutes Published" },
                { label: "In Progress", value: "In Progress" },
                { label: "Completed", value: "Completed" },
              ].map((st) => (
                <button
                  key={st.value}
                  onClick={() => setProceedingStatusFilter(st.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    proceedingStatusFilter === st.value
                      ? "bg-emerald-700 text-white shadow-2xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Proceedings Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProceedings.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs hover:border-emerald-600/50 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        item.status === "Minutes Published"
                          ? "bg-emerald-100 text-emerald-900 border border-emerald-200"
                          : item.status === "Order Passed"
                          ? "bg-teal-100 text-teal-900 border border-teal-200"
                          : item.status === "In Progress"
                          ? "bg-purple-100 text-purple-900 border border-purple-200"
                          : item.status === "Completed"
                          ? "bg-blue-100 text-blue-900 border border-blue-200"
                          : "bg-amber-100 text-amber-900 border border-amber-200"
                      }`}
                    >
                      {item.status}
                    </span>

                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-50 px-2.5 py-0.5 rounded-full border border-slate-200">
                      <Calendar className="w-3 h-3 text-emerald-600" />
                      <span>{item.date}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                      {item.subject}
                    </h3>
                    {item.marathiSubject && (
                      <p className="text-xs font-semibold text-emerald-700 truncate mt-0.5">
                        {item.marathiSubject}
                      </p>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Minutes Snippet */}
                  {item.minutes && (
                    <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100 text-xs text-slate-700 line-clamp-2">
                      <strong className="text-emerald-900">Minutes: </strong>
                      {item.minutes}
                    </div>
                  )}

                  {item.venue && (
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 truncate">
                      <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span className="truncate">{item.venue}</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400 font-mono">
                    {item.fileSize ? `PDF • ${item.fileSize}` : "PDF Order"}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedProceeding(item)}
                      title="View full record"
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setEditingProceeding(item);
                        setIsProceedingModalOpen(true);
                      }}
                      title="Edit proceeding"
                      className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-700 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProceeding(item.id, item.subject)}
                      title="Delete record"
                      className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProceedings.length === 0 && (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center text-slate-500 text-xs">
              No judicial records or court proceedings found matching filter.
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. NEXT SESSION & SCHEDULE TAB */}
      {/* ========================================================= */}
      {activeTab === "sessions" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search hearing by forum, title, case..."
                value={sessionSearch}
                onChange={(e) => setSessionSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            {/* Status Filter */}
            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
              {[
                { label: "All", value: "ALL" },
                { label: "Scheduled", value: "Scheduled" },
                { label: "In Progress", value: "In Progress" },
                { label: "Adjourned", value: "Adjourned" },
                { label: "Concluded", value: "Concluded" },
              ].map((st) => (
                <button
                  key={st.value}
                  onClick={() => setSessionStatusFilter(st.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    sessionStatusFilter === st.value
                      ? "bg-emerald-700 text-white shadow-2xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sessions List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSessions.map((session) => (
              <div
                key={session.id}
                className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:border-emerald-600/50 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        session.status === "Scheduled"
                          ? "bg-emerald-100 text-emerald-900 border border-emerald-200"
                          : session.status === "In Progress"
                          ? "bg-blue-100 text-blue-900 border border-blue-200"
                          : session.status === "Adjourned"
                          ? "bg-amber-100 text-amber-900 border border-amber-200"
                          : "bg-slate-100 text-slate-700 border border-slate-200"
                      }`}
                    >
                      {session.status}
                    </span>

                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800 bg-slate-50 px-2.5 py-0.5 rounded-full border border-slate-200">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{session.hearingDate}</span>
                      {session.time && (
                        <>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-600">{session.time}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2">
                      {session.sessionTitle}
                    </h3>
                    {session.marathiSessionTitle && (
                      <p className="text-xs font-semibold text-emerald-700 truncate mt-0.5">
                        {session.marathiSessionTitle}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                      <Scale className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{session.courtForum}</span>
                    </div>
                    {session.presidingBench && (
                      <div className="text-slate-500 pl-5">
                        {session.presidingBench}
                      </div>
                    )}
                  </div>

                  {session.sessionAgenda && (
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      <strong>Agenda: </strong>
                      {session.sessionAgenda}
                    </p>
                  )}

                  {session.casesListed && session.casesListed.length > 0 && (
                    <div className="pt-1 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Cases Listed ({session.casesListed.length}):
                      </span>
                      {session.casesListed.slice(0, 2).map((c, idx) => (
                        <div key={idx} className="text-xs text-slate-700 flex items-start gap-1.5 truncate">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="truncate">{c}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">
                    Official Hearing Schedule
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedSession(session)}
                      title="View full session schedule"
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setEditingSession(session);
                        setIsSessionModalOpen(true);
                      }}
                      title="Edit session"
                      className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-700 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteSession(session.id, session.sessionTitle)}
                      title="Delete session"
                      className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredSessions.length === 0 && (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center text-slate-500 text-xs">
              No hearing schedules found matching filter.
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD / EDIT COMMITTEE MEMBER */}
      {/* ========================================================= */}
      {isMemberModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-700" />
                <h3 className="text-lg font-bold text-slate-900">
                  {editingMember ? "Edit Committee Member" : "Add New Committee Member"}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsMemberModalOpen(false);
                  setEditingMember(null);
                }}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name (English) *</label>
                  <input
                    name="name"
                    required
                    defaultValue={editingMember?.name || ""}
                    placeholder="Adv. Rajesh Deshmukh"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">नाव (मराठीत) *</label>
                  <input
                    name="marathiName"
                    required
                    defaultValue={editingMember?.marathiName || ""}
                    placeholder="अ‍ॅड. राजेश वि. देशमुख"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Role in Committee *</label>
                  <select
                    name="role"
                    defaultValue={editingMember?.role || "Elected Member"}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  >
                    <option value="Chairman">Chairman (सभापती)</option>
                    <option value="Vice Chairperson">Vice Chairperson (उपसभापती)</option>
                    <option value="Chief Legal Advisor">Chief Legal Advisor (मुख्य कायदेशीर सल्लागार)</option>
                    <option value="Elected Member">Elected Member (नगरसेवक / नगरसेविका)</option>
                    <option value="Chief Legal Officer">Chief Legal Officer (मुख्य विधी सल्लागार)</option>
                    <option value="Assistant Law Officer">Assistant Law Officer (सहाय्यक विधी अधिकारी)</option>
                    <option value="Special Invitee Consultant">Legal Consultant (पर्यावरण विधी सल्लागार)</option>
                    <option value="Panel Conciliator">Panel Conciliator (तडजोडकार)</option>
                    <option value="Legal Aid Counselor">Legal Aid Counselor (विधी सहाय्य सल्लागार)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    name="category"
                    defaultValue={editingMember?.category || "Committee Member"}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  >
                    <option value="Leadership">Leadership & Advisory</option>
                    <option value="Committee Member">Committee Member</option>
                    <option value="Legal Officer">Legal Officer & Staff</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Official Designation *</label>
                <input
                  name="designation"
                  required
                  defaultValue={editingMember?.designation || ""}
                  placeholder="Chairman, Legal & Law Committee (सभापती, विधी व न्याय समिती)"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ward / Office Location</label>
                  <input
                    name="ward"
                    defaultValue={editingMember?.ward || ""}
                    placeholder="Ward 04 - Ryewood / LMC Legal Dept"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Experience / Qualifications</label>
                  <input
                    name="experience"
                    defaultValue={editingMember?.experience || ""}
                    placeholder="18+ years in Municipal Law & Civil Jurisprudence"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    name="phone"
                    defaultValue={editingMember?.phone || ""}
                    placeholder="+91 2114 273201"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    name="email"
                    type="email"
                    defaultValue={editingMember?.email || ""}
                    placeholder="legal.chair@lonavalacouncil.gov.in"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Responsibilities & Key Portfolios (One per line)
                </label>
                <textarea
                  name="responsibilities"
                  rows={3}
                  defaultValue={editingMember?.responsibilities?.join("\n") || ""}
                  placeholder="Presiding over municipal legal review meetings&#10;Evaluating legal claims and High Court writ petitions&#10;Supervising Lok Adalat compromise settlements"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none leading-relaxed"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsMemberModalOpen(false);
                    setEditingMember(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-md shadow-emerald-700/20"
                >
                  {editingMember ? "Save Changes" : "Add Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD / EDIT PROCEEDING */}
      {/* ========================================================= */}
      {isProceedingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-emerald-700" />
                <h3 className="text-lg font-bold text-slate-900">
                  {editingProceeding ? "Edit Court Proceeding / Order" : "Add Court Proceeding / Order"}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsProceedingModalOpen(false);
                  setEditingProceeding(null);
                }}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProceeding} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Subject Title (English) *</label>
                <input
                  name="subject"
                  required
                  defaultValue={editingProceeding?.subject || ""}
                  placeholder="Hon'ble Bombay High Court - WP / 4812 / 2024: Unauthorized Demolition Review"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">विषय शीर्षक (मराठीत) *</label>
                <input
                  name="marathiSubject"
                  required
                  defaultValue={editingProceeding?.marathiSubject || ""}
                  placeholder="मा. मुंबई उच्च न्यायालय - याचिका क्र. ४८१२/२०२४: टेकडी उतार विकास प्रतिबंध"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hearing / Bench Date *</label>
                  <input
                    name="date"
                    required
                    defaultValue={editingProceeding?.date || ""}
                    placeholder="14 October 2026"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status *</label>
                  <select
                    name="status"
                    defaultValue={editingProceeding?.status || "Upcoming"}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  >
                    <option value="Upcoming">Upcoming (आगामी सुनावणी)</option>
                    <option value="Order Passed">Order Passed (आदेश पारित)</option>
                    <option value="Minutes Published">Minutes Published (इतिवृत्त प्रसिद्ध)</option>
                    <option value="In Progress">In Progress (सुनावणी सुरू)</option>
                    <option value="Completed">Completed (पूर्ण झाले)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Court Forum / Venue</label>
                  <input
                    name="venue"
                    defaultValue={editingProceeding?.venue || ""}
                    placeholder="Court Room 14, Bombay High Court Annexe"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Presiding / Bench Officers</label>
                  <input
                    name="benchOfficers"
                    defaultValue={editingProceeding?.benchOfficers || ""}
                    placeholder="Hon. Division Bench / Presiding Judge"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description (English) *</label>
                <textarea
                  name="description"
                  required
                  rows={2}
                  defaultValue={editingProceeding?.description || ""}
                  placeholder="Statutory municipal petition challenging stay on demolition order..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">तपशील (मराठीत)</label>
                <textarea
                  name="marathiDescription"
                  rows={2}
                  defaultValue={editingProceeding?.marathiDescription || ""}
                  placeholder="महाराष्ट्र प्रादेशिक व नगररचना अधिनियम, १९६६ अंतर्गत कारवाई..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Minutes / Proceeding Notes (English)</label>
                <textarea
                  name="minutes"
                  rows={2}
                  defaultValue={editingProceeding?.minutes || ""}
                  placeholder="Hon'ble Division Bench heard LMC senior standing counsel..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">PDF Download URL</label>
                  <input
                    name="pdfUrl"
                    defaultValue={editingProceeding?.pdfUrl || "/downloads/court-order.pdf"}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">PDF File Size</label>
                  <input
                    name="fileSize"
                    defaultValue={editingProceeding?.fileSize || "1.4 MB"}
                    placeholder="1.4 MB"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsProceedingModalOpen(false);
                    setEditingProceeding(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-md shadow-emerald-700/20"
                >
                  {editingProceeding ? "Save Changes" : "Add Proceeding"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD / EDIT NEXT SESSION */}
      {/* ========================================================= */}
      {isSessionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-700" />
                <h3 className="text-lg font-bold text-slate-900">
                  {editingSession ? "Edit Scheduled Session" : "Schedule Next Court Session / Hearing"}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsSessionModalOpen(false);
                  setEditingSession(null);
                }}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSession} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Hearing / Session Title (English) *</label>
                <input
                  name="sessionTitle"
                  required
                  defaultValue={editingSession?.sessionTitle || ""}
                  placeholder="Bombay High Court Division Bench Hearing on MRTP Hill Slope Actions"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">सुनावणी शीर्षक (मराठीत) *</label>
                <input
                  name="marathiSessionTitle"
                  required
                  defaultValue={editingSession?.marathiSessionTitle || ""}
                  placeholder="मा. मुंबई उच्च न्यायालय खंडपीठ सुनावणी - टेकडी उतार निष्कासन"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hearing Date *</label>
                  <input
                    name="hearingDate"
                    required
                    defaultValue={editingSession?.hearingDate || ""}
                    placeholder="14 October 2026"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Time</label>
                  <input
                    name="time"
                    defaultValue={editingSession?.time || "11:00 AM"}
                    placeholder="11:00 AM"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Session Status *</label>
                  <select
                    name="status"
                    defaultValue={editingSession?.status || "Scheduled"}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  >
                    <option value="Scheduled">Scheduled (नियोजित)</option>
                    <option value="In Progress">In Progress (सुरू)</option>
                    <option value="Adjourned">Adjourned (तहकूब)</option>
                    <option value="Concluded">Concluded (पूर्ण)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Court Forum / Location *</label>
                  <input
                    name="courtForum"
                    required
                    defaultValue={editingSession?.courtForum || ""}
                    placeholder="Bombay High Court (Principal Bench, Mumbai)"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Presiding Bench / Judges</label>
                  <input
                    name="presidingBench"
                    defaultValue={editingSession?.presidingBench || ""}
                    placeholder="Hon'ble Division Bench (Court Room 14)"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Cases & Matters Listed (One per line)
                </label>
                <textarea
                  name="casesListed"
                  rows={2}
                  defaultValue={editingSession?.casesListed?.join("\n") || ""}
                  placeholder="WP / 4812 / 2024: LMC vs. Eco Valley Developers Pvt Ltd&#10;PIL / 31 / 2023: Traffic & Parking Masterplan"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Session Agenda & Brief Instructions (English)</label>
                <textarea
                  name="sessionAgenda"
                  rows={2}
                  defaultValue={editingSession?.sessionAgenda || ""}
                  placeholder="Presentation of updated satellite boundary demarcation & compliance affidavit on demolition notices."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">सुनावणी कामकाज व सूचना (मराठीत)</label>
                <textarea
                  name="marathiSessionAgenda"
                  rows={2}
                  defaultValue={editingSession?.marathiSessionAgenda || ""}
                  placeholder="नगररचना विभागाचा उपग्रह सीमांकन नकाशा व वस्तुस्थिती प्रतिज्ञापत्र सादरीकरण."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Cause List / Notice PDF Link</label>
                <input
                  name="noticePdfUrl"
                  defaultValue={editingSession?.noticePdfUrl || "/downloads/hearing-notice.pdf"}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsSessionModalOpen(false);
                    setEditingSession(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-md shadow-emerald-700/20"
                >
                  {editingSession ? "Save Changes" : "Schedule Session"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* DRAWER / MODAL: VIEW MEMBER DETAILS */}
      {/* ========================================================= */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                {selectedMember.role}
              </span>
              <button
                onClick={() => setSelectedMember(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 text-white flex items-center justify-center font-bold text-lg shrink-0 border border-white ring-2 ring-emerald-200">
                {getInitials(selectedMember.name)}
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="text-xl font-bold text-slate-900">{selectedMember.name}</h3>
                <p className="text-sm font-semibold text-emerald-700">{selectedMember.marathiName}</p>
                <p className="text-xs text-slate-500 font-medium">{selectedMember.designation}</p>
                {selectedMember.ward && (
                  <p className="text-xs text-slate-600 font-medium">{selectedMember.ward}</p>
                )}
              </div>
            </div>

            {selectedMember.experience && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700">
                <strong>Experience: </strong> {selectedMember.experience}
              </div>
            )}

            {selectedMember.responsibilities && selectedMember.responsibilities.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Core Mandates & Portfolio:
                </h4>
                <div className="space-y-1.5">
                  {selectedMember.responsibilities.map((r, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="space-y-1">
                {selectedMember.phone && (
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{selectedMember.phone}</span>
                  </div>
                )}
                {selectedMember.email && (
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Mail className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{selectedMember.email}</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  setEditingMember(selectedMember);
                  setSelectedMember(null);
                  setIsMemberModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs"
              >
                Edit Member
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* DRAWER / MODAL: VIEW PROCEEDING DETAILS */}
      {/* ========================================================= */}
      {selectedProceeding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                {selectedProceeding.status}
              </span>
              <button
                onClick={() => setSelectedProceeding(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>Hearing Date: {selectedProceeding.date}</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 leading-snug">
                {selectedProceeding.subject}
              </h3>
              {selectedProceeding.marathiSubject && (
                <p className="text-xs font-semibold text-emerald-700">
                  {selectedProceeding.marathiSubject}
                </p>
              )}
            </div>

            <div className="space-y-1 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs">
              <strong className="text-slate-800 block">Description:</strong>
              <p className="text-slate-600 leading-relaxed font-light">
                {selectedProceeding.description}
              </p>
            </div>

            {selectedProceeding.minutes && (
              <div className="space-y-1 bg-emerald-50/50 p-3.5 rounded-2xl border border-emerald-100 text-xs">
                <strong className="text-emerald-900 block">Proceeding Minutes & Verdict:</strong>
                <p className="text-slate-700 leading-relaxed">
                  {selectedProceeding.minutes}
                </p>
              </div>
            )}

            {selectedProceeding.venue && (
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>{selectedProceeding.venue}</span>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono">
                {selectedProceeding.fileSize || "PDF"}
              </span>

              <button
                onClick={() => {
                  setEditingProceeding(selectedProceeding);
                  setSelectedProceeding(null);
                  setIsProceedingModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs"
              >
                Edit Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* DRAWER / MODAL: VIEW SESSION DETAILS */}
      {/* ========================================================= */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                {selectedSession.status}
              </span>
              <button
                onClick={() => setSelectedSession(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>{selectedSession.hearingDate}</span>
                {selectedSession.time && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span>{selectedSession.time}</span>
                  </>
                )}
              </div>
              <h3 className="text-lg font-black text-slate-900 leading-snug">
                {selectedSession.sessionTitle}
              </h3>
              {selectedSession.marathiSessionTitle && (
                <p className="text-xs font-semibold text-emerald-700">
                  {selectedSession.marathiSessionTitle}
                </p>
              )}
            </div>

            <div className="space-y-1 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs">
              <strong className="text-slate-800 block">Court Forum & Bench:</strong>
              <p className="text-slate-700 font-semibold">{selectedSession.courtForum}</p>
              {selectedSession.presidingBench && (
                <p className="text-slate-500 mt-0.5">{selectedSession.presidingBench}</p>
              )}
            </div>

            {selectedSession.sessionAgenda && (
              <div className="space-y-1 bg-emerald-50/50 p-3.5 rounded-2xl border border-emerald-100 text-xs">
                <strong className="text-emerald-900 block">Session Agenda & Brief Instructions:</strong>
                <p className="text-slate-700 leading-relaxed">
                  {selectedSession.sessionAgenda}
                </p>
                {selectedSession.marathiSessionAgenda && (
                  <p className="text-emerald-700 mt-1">
                    {selectedSession.marathiSessionAgenda}
                  </p>
                )}
              </div>
            )}

            {selectedSession.casesListed && selectedSession.casesListed.length > 0 && (
              <div className="space-y-1 text-xs">
                <strong className="text-slate-700 block">Listed Cases:</strong>
                <div className="space-y-1">
                  {selectedSession.casesListed.map((c, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-slate-600 bg-slate-50 p-2 rounded-xl">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono">
                {selectedSession.noticePdfUrl ? "Notice Attached" : "Official Notice"}
              </span>

              <button
                onClick={() => {
                  setEditingSession(selectedSession);
                  setSelectedSession(null);
                  setIsSessionModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs"
              >
                Edit Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
