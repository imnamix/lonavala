"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  X,
  History,
  CalendarClock,
  Check,
  FileText,
  Download,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { CourtSession } from "@/types";
import {
  getAllCourtSessions,
  deleteCourtSession,
  updateCourtSession,
  createCourtSession,
} from "@/lib/services/court-session.service";
import { getInlineFileUrl } from "@/lib/utils";

export function CourtSessionsTable() {
  const [sessions, setSessions] = useState<CourtSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSession, setSelectedSession] = useState<CourtSession | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<CourtSession | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const data = await getAllCourtSessions();
      setSessions(data);
    } catch (err) {
      console.error("Failed to load court sessions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const showToast = (text: string) => {
    setToastMessage(text);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete session "${title}"?`)) {
      await deleteCourtSession(id);
      await fetchSessions();
      if (selectedSession?.id === id) setSelectedSession(null);
      showToast("Session removed successfully.");
    }
  };

  const handleMarkConcluded = async (session: CourtSession) => {
    await updateCourtSession(session.id, { status: "Concluded" });
    await fetchSessions();
    showToast(`Session "${session.sessionTitle}" marked as Concluded and moved to history.`);
  };

  // Date helper for date input
  const getFormattedDate = (d?: string) => {
    if (!d) return new Date().toISOString().split("T")[0];
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
    try {
      const parsed = new Date(d);
      if (!isNaN(parsed.getTime())) {
        return parsed.toISOString().split("T")[0];
      }
    } catch {}
    return new Date().toISOString().split("T")[0];
  };

  const handleSaveSession = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);
      const rawDate = (formData.get("hearingDate") as string) || "";
      let formattedDisplayDate = rawDate;
      if (rawDate) {
        try {
          formattedDisplayDate = new Date(rawDate).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });
        } catch {}
      }

      const sessionPayload = {
        sessionTitle: (formData.get("sessionTitle") as string)?.trim() || "",
        marathiSessionTitle: "",
        hearingDate: formattedDisplayDate,
        time: (formData.get("time") as string)?.trim() || "11:00 AM",
        courtForum: (formData.get("courtForum") as string)?.trim() || "",
        presidingBench: (formData.get("presidingBench") as string)?.trim() || "",
        status: ((formData.get("status") as string) || "Scheduled"),
        sessionAgenda: (formData.get("sessionAgenda") as string)?.trim() || "",
        marathiSessionAgenda: "",
        casesListed: [],
        noticePdfUrl: (formData.get("noticePdfUrl") as string)?.trim() || "",
      };

      if (!sessionPayload.sessionTitle) {
        alert("Session Title is required.");
        setIsSubmitting(false);
        return;
      }

      if (editingSession) {
        await updateCourtSession(editingSession.id, sessionPayload);
        showToast("Court session updated successfully!");
      } else {
        await createCourtSession(sessionPayload);
        showToast("New court session scheduled successfully!");
      }

      await fetchSessions();
      setIsModalOpen(false);
      setEditingSession(null);
    } catch (err) {
      console.error(err);
      alert("Failed to save session.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Identify the single upcoming session vs previous sessions
  const upcomingSession = sessions.find(
    (s) => s.status === "Scheduled" || s.status === "In Progress"
  );
  const previousSessions = sessions.filter(
    (s) => s.id !== upcomingSession?.id
  );

  const filteredPreviousSessions = previousSessions.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      s.sessionTitle.toLowerCase().includes(q) ||
      s.sessionAgenda.toLowerCase().includes(q) ||
      s.hearingDate.toLowerCase().includes(q) ||
      (s.courtForum && s.courtForum.toLowerCase().includes(q))
    );
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "bg-emerald-100 text-emerald-800 border border-emerald-200";
      case "In Progress":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "Concluded":
      case "Completed":
        return "bg-slate-100 text-slate-700 border border-slate-200";
      case "Adjourned":
        return "bg-amber-100 text-amber-800 border border-amber-200";
      default:
        return "bg-slate-100 text-slate-800 border border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Standard Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900">Next Session & Hearing Schedule</h1>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              {sessions.length} Total Sessions
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Schedule next upcoming hearing session and maintain past hearing history records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setEditingSession(null);
              setIsModalOpen(true);
            }}
            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule New Session</span>
          </button>
        </div>
      </div>

      {/* Active Upcoming Session Card (Only ONE upcoming session) */}
      <div className="bg-white rounded-3xl border-2 border-emerald-600/20 p-6 shadow-sm space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-700 text-white shadow-2xs">
              <CalendarClock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                  Active Upcoming Hearing
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Single Active Session
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900">Next Scheduled Session</h2>
            </div>
          </div>

          {upcomingSession ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setEditingSession(upcomingSession);
                  setIsModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleMarkConcluded(upcomingSession)}
                className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                title="Mark this session as concluded and archive into previous sessions"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Mark Concluded</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setEditingSession(null);
                setIsModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition-colors cursor-pointer"
            >
              + Schedule Next Session
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-700" />
          </div>
        ) : upcomingSession ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
            <div className="md:col-span-2 space-y-2">
              <h3 className="text-base font-bold text-slate-900">
                {upcomingSession.sessionTitle}
              </h3>
              {upcomingSession.courtForum && (
                <p className="text-xs font-semibold text-emerald-800">
                  {upcomingSession.courtForum} {upcomingSession.presidingBench && `• ${upcomingSession.presidingBench}`}
                </p>
              )}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 mt-2 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Session Agenda</span>
                <p className="text-xs text-slate-800 leading-relaxed font-normal">
                  {upcomingSession.sessionAgenda}
                </p>
              </div>

              {upcomingSession.noticePdfUrl && (
                <div className="pt-1">
                  <a
                    href={getInlineFileUrl(upcomingSession.noticePdfUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-700" />
                    <span>View Notice Document</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            <div className="space-y-3 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-200/80">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-emerald-800 uppercase">Scheduled Date</span>
                <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
                  <Calendar className="w-4 h-4 text-emerald-700" />
                  <span>{upcomingSession.hearingDate}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-emerald-800 uppercase">Session Time</span>
                <div className="flex items-center gap-2 font-bold text-slate-800 text-xs">
                  <Clock className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{upcomingSession.time || "11:00 AM"}</span>
                </div>
              </div>

              <div className="pt-1">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${getStatusBadge(
                    upcomingSession.status
                  )}`}
                >
                  Status: {upcomingSession.status}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-slate-400">
            <CalendarClock className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="font-bold text-slate-600 text-sm">No Active Upcoming Session Scheduled</p>
            <p className="text-xs mt-1">Schedule a session to set it as the single active upcoming hearing.</p>
          </div>
        )}
      </div>

      {/* Previous Sessions History Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-xs">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-slate-600" />
            <h2 className="font-bold text-sm text-slate-900">Previous Sessions History</h2>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {previousSessions.length} Past Sessions
            </span>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search previous sessions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 bg-slate-50/50"
            />
          </div>
        </div>

        {/* Previous Sessions Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Session Title</th>
                  <th className="py-3.5 px-4">Hearing Date</th>
                  <th className="py-3.5 px-4">Time</th>
                  <th className="py-3.5 px-4">Agenda Summary</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredPreviousSessions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-slate-400">
                      <History className="w-8 h-8 mx-auto mb-1 text-slate-300" />
                      <p className="font-bold text-slate-600">No previous sessions found</p>
                    </td>
                  </tr>
                ) : (
                  filteredPreviousSessions.map((session) => (
                    <tr
                      key={session.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Title */}
                      <td className="py-3.5 px-4 max-w-sm">
                        <div className="font-bold text-slate-900 group-hover:text-emerald-800 transition-colors text-sm line-clamp-2">
                          {session.sessionTitle}
                        </div>
                        {session.courtForum && (
                          <div className="text-[11px] text-slate-500 truncate mt-0.5">
                            {session.courtForum}
                          </div>
                        )}
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-700 font-bold">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{session.hearingDate}</span>
                        </div>
                      </td>

                      {/* Time */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{session.time || "11:00 AM"}</span>
                        </div>
                      </td>

                      {/* Agenda */}
                      <td className="py-3.5 px-4 max-w-md text-slate-600">
                        <div className="line-clamp-2 leading-relaxed">
                          {session.sessionAgenda}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${getStatusBadge(
                            session.status
                          )}`}
                        >
                          {session.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => setSelectedSession(session)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                            title="View Full Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingSession(session);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition-colors cursor-pointer"
                            title="Edit Session"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(session.id, session.sessionTitle)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete Session"
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
      </div>

      {/* Schedule / Edit Session Modal Form Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingSession ? "Edit Court Session" : "Schedule New Court Session"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enter session title, date, time, status, forum, and agenda.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingSession(null);
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSession} className="space-y-4">
              {/* Session Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Session Title *
                </label>
                <input
                  type="text"
                  name="sessionTitle"
                  required
                  defaultValue={editingSession?.sessionTitle || ""}
                  placeholder="e.g., Bombay High Court Division Bench Hearing on MRTP Hill Slope Actions"
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                />
              </div>

              {/* Court Forum & Presiding Bench */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Court Forum / Venue
                  </label>
                  <input
                    type="text"
                    name="courtForum"
                    defaultValue={editingSession?.courtForum || ""}
                    placeholder="e.g., Bombay High Court (Principal Bench, Mumbai)"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Presiding Bench / Judge
                  </label>
                  <input
                    type="text"
                    name="presidingBench"
                    defaultValue={editingSession?.presidingBench || ""}
                    placeholder="e.g., Hon'ble Division Bench (Court Room 14)"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                  />
                </div>
              </div>

              {/* Date, Time & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Hearing Date *</span>
                  </label>
                  <input
                    type="date"
                    name="hearingDate"
                    required
                    defaultValue={getFormattedDate(editingSession?.hearingDate)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Time</span>
                  </label>
                  <input
                    type="text"
                    name="time"
                    defaultValue={editingSession?.time || "11:00 AM"}
                    placeholder="e.g., 11:00 AM"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Status *
                  </label>
                  <select
                    name="status"
                    defaultValue={editingSession?.status || "Scheduled"}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 bg-white"
                  >
                    <option value="Scheduled">Scheduled (Upcoming)</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Concluded">Concluded (Previous)</option>
                    <option value="Adjourned">Adjourned (Previous)</option>
                  </select>
                </div>
              </div>

              {/* Agenda */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Session Agenda *
                </label>
                <textarea
                  name="sessionAgenda"
                  rows={3}
                  required
                  defaultValue={editingSession?.sessionAgenda || ""}
                  placeholder="Enter hearing agenda, matters listed for consideration, and purpose of the session..."
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 font-sans leading-relaxed"
                ></textarea>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingSession(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors shadow-xs cursor-pointer disabled:opacity-60 flex items-center gap-1.5"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingSession ? "Update Session" : "Schedule Session"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Session Details Modal */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 space-y-6">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getStatusBadge(
                    selectedSession.status
                  )} mb-1.5 inline-block`}
                >
                  {selectedSession.status}
                </span>
                <h3 className="text-lg font-bold text-slate-900">{selectedSession.sessionTitle}</h3>
                {selectedSession.courtForum && (
                  <p className="text-xs font-semibold text-emerald-800 mt-1">
                    {selectedSession.courtForum} {selectedSession.presidingBench && `• ${selectedSession.presidingBench}`}
                  </p>
                )}
              </div>
              <button
                onClick={() => setSelectedSession(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="font-bold text-slate-500 uppercase">Hearing Date</span>
                <p className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-700" />
                  {selectedSession.hearingDate}
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="font-bold text-slate-500 uppercase">Time</span>
                <p className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-700" />
                  {selectedSession.time || "11:00 AM"}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase">Session Agenda</h4>
              <p className="text-xs text-slate-800 leading-relaxed font-normal">
                {selectedSession.sessionAgenda}
              </p>
            </div>

            {selectedSession.noticePdfUrl && (
              <div className="p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900">Notice Document:</span>
                <a
                  href={getInlineFileUrl(selectedSession.noticePdfUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Open Notice</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                onClick={() => {
                  const s = selectedSession;
                  setSelectedSession(null);
                  setEditingSession(s);
                  setIsModalOpen(true);
                }}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-900 text-white transition-colors cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={() => setSelectedSession(null)}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
