"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Building,
  User,
  ShieldCheck,
  AlertCircle,
  FileText,
  Phone,
  ArrowRight,
  Loader2,
  Eye,
} from "lucide-react";
import { trackGrievanceByTicket, GrievanceItem } from "@/lib/services/citizen.service";
import { GrievanceStatus, GrievanceTimelineEvent } from "@/types";
import { Timeline } from "@/components/shared/Timeline";
import { GrievanceDetailsModal } from "@/components/grievance/GrievanceDetailsModal";
import { useLanguage } from "@/context/LanguageContext";

const mapBackendStatusToUi = (s: string): GrievanceStatus => {
  switch (s) {
    case "PENDING":
      return "Submitted";
    case "ASSIGNED":
      return "Assigned";
    case "IN_PROGRESS":
      return "In Progress";
    case "RESOLVED":
      return "Resolved";
    case "CLOSED":
      return "Closed";
    default:
      return "Submitted";
  }
};

const formatStatusText = (s: string, isMr: boolean) => {
  if (!isMr) {
    switch (s) {
      case "PENDING":
      case "Submitted":
        return "Submitted";
      case "ASSIGNED":
      case "Assigned":
        return "Assigned";
      case "IN_PROGRESS":
      case "In Progress":
        return "In Progress";
      case "RESOLVED":
      case "Resolved":
        return "Resolved";
      case "CLOSED":
      case "Closed":
        return "Closed";
      case "REJECTED":
      case "Rejected":
        return "Rejected";
      default:
        return s;
    }
  }

  switch (s) {
    case "PENDING":
    case "Submitted":
      return "नोंदणी झाली";
    case "ASSIGNED":
    case "Assigned":
      return "अधिकारी नियुक्त";
    case "IN_PROGRESS":
    case "In Progress":
      return "काम सुरू";
    case "RESOLVED":
    case "Resolved":
      return "निराकरण झाले";
    case "CLOSED":
    case "Closed":
      return "तक्रार बंद";
    case "REJECTED":
    case "Rejected":
      return "फेटाळली";
    default:
      return s;
  }
};

const statusBadgeColor: Record<string, string> = {
  Submitted: "bg-blue-100 text-blue-800 border-blue-200",
  Acknowledged: "bg-purple-100 text-purple-800 border-purple-200",
  Assigned: "bg-indigo-100 text-indigo-800 border-indigo-200",
  "In Progress": "bg-amber-100 text-amber-800 border-amber-200",
  Resolved: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Closed: "bg-gray-100 text-gray-800 border-gray-200",
};

function TrackGrievanceContent() {
  const { language } = useLanguage();
  const isMr = language === "mr";
  const searchParams = useSearchParams();
  const initialRef = searchParams.get("ref") || "";

  const [searchQuery, setSearchQuery] = useState(initialRef);
  const [grievance, setGrievance] = useState<GrievanceItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const doTrack = async (ticket: string) => {
    if (!ticket.trim()) return;
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await trackGrievanceByTicket(ticket.trim());
      setGrievance(res);
      setSearched(true);
    } catch (err: any) {
      setGrievance(null);
      setErrorMsg(
        err?.message ||
          (isMr
            ? "या टोकन क्रमांकाची कोणतीही तक्रार आढळली नाही."
            : "No grievance found matching this ticket reference.")
      );
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialRef) {
      doTrack(initialRef);
    }
  }, [initialRef]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    doTrack(searchQuery);
  };

  const uiStatus = grievance ? mapBackendStatusToUi(grievance.status) : "Submitted";
  const timelineEvents: GrievanceTimelineEvent[] = grievance
    ? grievance.statusHistory && grievance.statusHistory.length > 0
      ? grievance.statusHistory.map((item) => ({
          status: mapBackendStatusToUi(item.status),
          date: item.updatedAt
            ? new Date(item.updatedAt).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })
            : "Recently",
          note:
            item.note ||
            (item.status === "PENDING"
              ? isMr
                ? "नागरिकाने तक्रार नोंदवली आणि संबंधित विभागाकडे वर्ग करण्यात आली."
                : "Grievance lodged by citizen and assigned to department desk."
              : isMr
              ? `तक्रारीची स्थिती ${formatStatusText(item.status, true)} करण्यात आली.`
              : `Status updated to ${formatStatusText(item.status, false)}.`),
          actor:
            item.updatedBy ||
            item.assignedDepartment ||
            (item.status === "PENDING"
              ? grievance.citizen?.name
                ? `${isMr ? "नागरिक" : "Citizen"} (${grievance.citizen.name})`
                : isMr
                ? "नागरिक"
                : "Citizen"
              : isMr
              ? "लोणावळा नगरपरिषद तक्रार निवारण अधिकारी"
              : "LMC Grievance Redressal Officer"),
        }))
      : [
          {
            status: "Submitted",
            date: grievance.createdDate
              ? new Date(grievance.createdDate).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })
              : "Recently",
            note: isMr
              ? "नागरिकाने तक्रार नोंदवली आणि संबंधित विभागाकडे वर्ग करण्यात आली."
              : "Grievance lodged by citizen and assigned to department desk.",
            actor: grievance.citizen?.name
              ? `${isMr ? "नागरिक" : "Citizen"} (${grievance.citizen.name})`
              : isMr
              ? "नागरिक"
              : "Citizen",
          },
          ...(grievance.status !== "PENDING"
            ? [
                {
                  status: uiStatus,
                  date: grievance.updatedDate
                    ? new Date(grievance.updatedDate).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })
                    : "Recently",
                  note:
                    grievance.resolutionNotes ||
                    (isMr
                      ? `तक्रारीची स्थिती ${formatStatusText(uiStatus, true)} करण्यात आली.`
                      : `Grievance status updated to ${formatStatusText(uiStatus, false)}.`),
                  actor:
                    grievance.assignedDepartment ||
                    (isMr ? "लोणावळा नगरपरिषद तक्रार कक्ष" : "LMC Grievance Redressal Cell"),
                },
              ]
            : []),
        ]
    : [];

  return (
    <div className="py-10">
      {/* Header */}
      <div className="bg-primary-light/60 border-y border-border py-12 mb-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-primary bg-white px-3 py-1 rounded-full border border-border">
            {isMr ? "थेट सार्वजनिक स्थिती" : "Live Grievance Tracking"}
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-text-primary mt-3">
            {isMr ? "तक्रार निवारण स्थिती तपासा" : "Track Public Grievance Status"}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-2 max-w-xl mx-auto">
            {isMr
              ? "तुमच्या तक्रारीची सद्यस्थिती आणि नगरपरिषदेची कार्यवाही जाणून घेण्यासाठी संदर्भ टोकन क्रमांक (उदा. GRV-2026-000004) टाका."
              : "Enter your reference ticket number (e.g. GRV-2026-000004) to track real-time resolution progress and municipal field action."}
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="mt-6 max-w-xl mx-auto flex items-center bg-white p-2 rounded-2xl shadow-md border border-border"
          >
            <div className="pl-3 text-gray-400">
              <Search className="w-5 h-5 text-primary" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isMr ? "तक्रार टोकन क्रमांक टाका (उदा. GRV-2026-000004)" : "Enter ticket reference (e.g. GRV-2026-000004)"}
              className="w-full px-3 py-2 text-xs sm:text-sm text-text-primary placeholder-gray-400 focus:outline-hidden uppercase font-mono"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isMr ? "स्थिती शोधा" : "Track Status"}</span>
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-border">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
            <p className="text-xs text-gray-500">
              {isMr ? "पालिकेच्या सर्व्हरवरून माहिती आणली जात आहे..." : "Fetching live status from municipal desk..."}
            </p>
          </div>
        ) : grievance ? (
          <div className="space-y-8">
            {/* Grievance Summary Card */}
            <div
              onClick={() => setIsModalOpen(true)}
              className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-xs hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-extrabold text-primary group-hover:underline">
                      {grievance.ticketNumber}
                    </span>
                    <span
                      className={`text-xs font-bold px-3 py-0.5 rounded-full border ${
                        statusBadgeColor[uiStatus] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {formatStatusText(uiStatus, isMr)}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-text-primary mt-2 leading-snug group-hover:text-primary transition-colors">
                    {grievance.title}
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{isMr ? "तपशील पहा" : "View Details"}</span>
                  </button>
                  <Link
                    href="/grievance/register"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-primary shrink-0"
                  >
                    <span>{isMr ? "नवीन तक्रार नोंदवा" : "Lodge Grievance"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Meta Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-xs">
                <div>
                  <div className="text-gray-400 font-semibold uppercase text-[10px]">
                    {isMr ? "संबंधित विभाग" : "Department"}
                  </div>
                  <div className="font-bold text-gray-800 mt-0.5">
                    {grievance.assignedDepartment || (isMr ? "लोणावळा नगरपरिषद तक्रार निवारण कक्ष" : "LMC Grievance Redressal Desk")}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 font-semibold uppercase text-[10px]">
                    {isMr ? "ठिकाण व प्रभाग" : "Location & Ward"}
                  </div>
                  <div className="font-bold text-gray-800 mt-0.5 truncate">
                    {grievance.address || (isMr ? `प्रभाग क्रमांक ${grievance.wardNumber || 1}` : `Ward ${grievance.wardNumber || 1}`)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 font-semibold uppercase text-[10px]">
                    {isMr ? "तक्रारदार नागरिक" : "Citizen"}
                  </div>
                  <div className="font-bold text-primary mt-0.5">
                    {grievance.citizen?.name || (isMr ? "नोंदणीकृत नागरिक" : "Registered Citizen")} {grievance.citizen?.phone ? `(${grievance.citizen.phone})` : ""}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-600">
                <div className="font-bold text-gray-700 uppercase tracking-wider text-[10px] mb-1">
                  {isMr ? "तक्रारीचा सविस्तर तपशील" : "Complaint Description"}
                </div>
                <p className="leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  {grievance.description}
                </p>
              </div>

              {/* Stage-by-Stage Official Notes History */}
              {grievance.statusHistory && grievance.statusHistory.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100 text-xs space-y-2">
                  <div className="font-bold text-gray-700 uppercase tracking-wider text-[10px] flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-primary" />
                      <span>{isMr ? "टप्प्यांची नोंद व इतिहास" : "Stage-by-Stage Notes & Action Logs"}</span>
                    </span>
                    <span className="text-gray-400 font-normal">
                      {grievance.statusHistory.length} {isMr ? "नोंदी" : "Updates"}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {grievance.statusHistory.map((sh, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-50/80 p-3 rounded-xl border border-slate-200/70 space-y-1"
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-extrabold text-slate-800">
                            {formatStatusText(sh.status, isMr)}
                          </span>
                          <span className="text-slate-400 font-medium">
                            {sh.updatedAt
                              ? new Date(String(sh.updatedAt)).toLocaleString("en-IN", {
                                  dateStyle: "medium",
                                  timeStyle: "short",
                                })
                              : ""}
                          </span>
                        </div>
                        {sh.note && (
                          <p className="text-slate-700 leading-relaxed font-medium bg-white p-2 rounded-lg border border-slate-200/50">
                            {sh.note}
                          </p>
                        )}
                        {sh.updatedBy && (
                          <div className="text-[10px] text-slate-400">
                            {isMr ? "कार्यवाही करणारे:" : "Action By:"} <strong className="text-slate-600 font-semibold">{sh.updatedBy}</strong>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Officer Remarks Banner */}
              {grievance.resolutionNotes && (
                <div className="mt-6 p-4 rounded-xl bg-primary-light border border-border text-xs">
                  <div className="font-bold text-primary flex items-center gap-1.5 mb-1">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{isMr ? "अधिकृत निवारण शेरा:" : "Official Resolution Remarks:"}</span>
                  </div>
                  <p className="text-gray-800 leading-relaxed">{grievance.resolutionNotes}</p>
                </div>
              )}

              {/* Uploaded Photos Section */}
              {grievance.attachmentUrls && grievance.attachmentUrls.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
                    {isMr ? "जोडलेली घटनास्थळ छायाचित्रे" : "Attached Site Photographs"} ({grievance.attachmentUrls.length})
                  </div>
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {grievance.attachmentUrls.map((img, idx) => (
                      <div
                        key={idx}
                        className="w-28 h-28 rounded-xl overflow-hidden border border-border shrink-0 bg-gray-100 shadow-xs"
                      >
                        <img
                          src={img}
                          alt="Grievance Evidence"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Timeline component rendering the 6 statuses */}
            <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-primary-light text-primary flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                      {isMr ? "तक्रार निवारण प्रगती क्रम" : "Redressal Progress Timeline"}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      {isMr
                        ? "तक्रार नोंदणीपासून प्रत्यक्ष निवारणापर्यंतची थेट सद्यस्थिती"
                        : "Real-time step by step status from submission to resolution"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1 rounded-xl border border-slate-200">
                  <span className="text-slate-400 font-normal">{isMr ? "सद्यस्थिती:" : "Current Status:"}</span>
                  <span className="text-primary font-bold">{formatStatusText(uiStatus, isMr)}</span>
                </div>
              </div>

              <Timeline
                currentStatus={uiStatus}
                events={timelineEvents}
              />
            </div>
          </div>
        ) : searched ? (
          <div className="bg-white p-10 rounded-2xl border border-border text-center shadow-xs">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-900">
              {errorMsg || (isMr ? `"${searchQuery}" क्रमांकाची कोणतीही तक्रार आढळली नाही.` : `No grievance found matching "${searchQuery}".`)}
            </h3>
            <p className="text-xs text-gray-600 mt-1 max-w-sm mx-auto">
              {isMr
                ? "कृपया तक्रार नोंदणीच्या वेळी प्राप्त झालेला टोकन क्रमांक (उदा. GRV-2026-000004) तपासा."
                : "Please verify the grievance ticket token number provided during registration (e.g. GRV-2026-000004)."}
            </p>
            <div className="mt-6">
              <Link
                href="/grievance/register"
                className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-hover inline-flex items-center gap-1.5"
              >
                <span>{isMr ? "नवीन तक्रार नोंदवा" : "Lodge New Grievance"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : null}
      </div>

      {/* Grievance Details Modal Popup */}
      <GrievanceDetailsModal
        grievance={grievance}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default function GrievanceTrackPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-xs">Loading grievance tracker...</div>}>
      <TrackGrievanceContent />
    </Suspense>
  );
}
