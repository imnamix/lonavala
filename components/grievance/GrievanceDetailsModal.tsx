"use client";

import { useEffect, useState } from "react";
import {
  X,
  CheckCircle2,
  Clock,
  AlertCircle,
  MapPin,
  Building2,
  User,
  Phone,
  Mail,
  Calendar,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Tag,
  FileText,
  Printer,
  Sparkles,
} from "lucide-react";
import { GrievanceItem } from "@/lib/services/citizen.service";
import { GrievanceStatus, GrievanceTimelineEvent } from "@/types";
import { Timeline } from "@/components/shared/Timeline";
import { useLanguage } from "@/context/LanguageContext";

interface GrievanceDetailsModalProps {
  grievance: GrievanceItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORY_NAMES: Record<string, { en: string; mr: string; dept: string }> = {
  ROAD: {
    en: "Road Potholes & Footpaths",
    mr: "रस्ते व पदपथ",
    dept: "Public Works Department (PWD)",
  },
  WATER: {
    en: "Water Supply & Leakage",
    mr: "पाणी पुरवठा",
    dept: "Water Supply & Drainage",
  },
  DRAINAGE: {
    en: "Drainage Choke & Sewage",
    mr: "सांडपाणी व गटारे",
    dept: "Water Supply & Drainage",
  },
  STREET_LIGHT: {
    en: "Street Light Outage",
    mr: "पथदिवे",
    dept: "Electrical & Public Lighting",
  },
  GARBAGE: {
    en: "Garbage Dumping & Cleanliness",
    mr: "कचरा व स्वच्छता",
    dept: "Health & Sanitation",
  },
  SANITATION: {
    en: "Public Toilets & Sanitation",
    mr: "सार्वजनिक स्वच्छता",
    dept: "Health & Sanitation",
  },
  BUILDING: {
    en: "Illegal Construction",
    mr: "अनधिकृत बांधकाम",
    dept: "Town Planning & Encroachment",
  },
  NOISE: {
    en: "Noise Pollution & Nuisance",
    mr: "ध्वनी प्रदूषण",
    dept: "General Administration",
  },
  ELECTRICITY: {
    en: "Electricity & Power Issues",
    mr: "वीज समस्या",
    dept: "Electrical & Public Lighting",
  },
  OTHER: {
    en: "Others / General Civic Issues",
    mr: "इतर नागरी तक्रार",
    dept: "Citizen Facilitation Center",
  },
};

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

export function GrievanceDetailsModal({
  grievance,
  isOpen,
  onClose,
}: GrievanceDetailsModalProps) {
  const { language } = useLanguage();
  const isMr = language === "mr";
  const [copied, setCopied] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (activeImage) {
          setActiveImage(null);
        } else {
          onClose();
        }
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, activeImage]);

  if (!isOpen || !grievance) return null;

  const handleCopyTicket = () => {
    navigator.clipboard.writeText(grievance.ticketNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "RESOLVED":
      case "CLOSED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-extrabold rounded-xl border border-emerald-200 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{isMr ? "निराकरण झाले" : "Resolved"}</span>
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-800 text-xs font-extrabold rounded-xl border border-blue-200 shadow-2xs">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>{isMr ? "काम सुरू" : "In Progress"}</span>
          </span>
        );
      case "ASSIGNED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-800 text-xs font-extrabold rounded-xl border border-purple-200 shadow-2xs">
            <User className="w-4 h-4 text-purple-600" />
            <span>{isMr ? "अधिकारी नियुक्त" : "Assigned"}</span>
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-800 text-xs font-extrabold rounded-xl border border-red-200 shadow-2xs">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span>{isMr ? "फेटाळली" : "Rejected"}</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 text-xs font-extrabold rounded-xl border border-amber-200 shadow-2xs">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>{isMr ? "नोंदणी झाली (प्रलंबित)" : "Submitted (Pending Review)"}</span>
          </span>
        );
    }
  };

  const catMeta = CATEGORY_NAMES[grievance.category] || {
    en: grievance.category,
    mr: "नागरी तक्रार",
    dept: grievance.assignedDepartment || (isMr ? "संबंधित पालिका विभाग" : "Municipal Department"),
  };

  const uiStatus = mapBackendStatusToUi(grievance.status);

  // Generate timeline events from statusHistory if available, otherwise fallback
  const timelineEvents: GrievanceTimelineEvent[] =
    grievance.statusHistory && grievance.statusHistory.length > 0
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
                : "Grievance registered by citizen and assigned to department desk."
              : isMr
              ? `तक्रारीची स्थिती ${item.status} करण्यात आली.`
              : `Status updated to ${item.status.replace(/_/g, " ")}.`),
          actor:
            item.updatedBy ||
            item.assignedDepartment ||
            (item.status === "PENDING"
              ? grievance.citizen?.name || (isMr ? "नागरिक" : "Citizen")
              : isMr
              ? "पालिका तक्रार निवारण अधिकारी"
              : "Municipal Grievance Officer"),
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
                      ? `पालिकेने तक्रारीची स्थिती ${uiStatus} केली.`
                      : `Grievance updated to ${uiStatus} status by municipal authority.`),
                  actor: grievance.assignedDepartment || (isMr ? "लोणावळा नगरपरिषद तक्रार कक्ष" : "LMC Grievance Redressal Cell"),
                },
              ]
            : []),
        ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Dialog Card */}
      <div className="relative z-10 w-full max-w-3xl bg-white rounded-3xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* ── Modal Header ── */}
        <div className="px-6 py-5 bg-slate-50/90 border-b border-border flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-mono font-bold text-sm">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-extrabold text-primary bg-primary-light px-2.5 py-0.5 rounded-lg border border-primary/20">
                  {grievance.ticketNumber}
                </span>
                <button
                  type="button"
                  onClick={handleCopyTicket}
                  className="p-1 text-slate-400 hover:text-primary transition-colors cursor-pointer rounded-md hover:bg-slate-200/60"
                  title="Copy Ticket Number"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                {isMr ? "नोंदणी तारीख:" : "Lodged:"}{" "}
                {new Date(grievance.createdDate).toLocaleDateString("en-IN", {
                  dateStyle: "full",
                })}{" "}
                ({isMr ? "वेळ:" : "Time:"}{" "}
                {new Date(grievance.createdDate).toLocaleTimeString("en-IN", {
                  timeStyle: "short",
                })}
                )
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block">{getStatusBadge(grievance.status)}</div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 rounded-full transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── Modal Scrollable Body ── */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700">
          {/* Mobile Status Badge */}
          <div className="sm:hidden flex justify-between items-center bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <span className="text-xs font-semibold text-slate-500">
              {isMr ? "सद्यस्थिती:" : "Status:"}
            </span>
            {getStatusBadge(grievance.status)}
          </div>

          {/* Title & Category Banner */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200">
                <Tag className="w-3.5 h-3.5 text-primary" />
                <span>
                  {isMr ? catMeta.mr : catMeta.en}
                </span>
              </span>
              {grievance.wardNumber && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg border border-blue-100">
                  <MapPin className="w-3.5 h-3.5 text-blue-500" />
                  <span>{isMr ? `प्रभाग क्रमांक ${grievance.wardNumber}` : `Ward ${grievance.wardNumber}`}</span>
                </span>
              )}
            </div>

            <h2 className="text-xl font-black text-slate-900 leading-snug">
              {grievance.title}
            </h2>
          </div>

          {/* Resolution / Department remarks if available */}
          {grievance.resolutionNotes && (
            <div className="p-4 bg-emerald-50/90 border border-emerald-200 rounded-2xl space-y-1.5 text-xs text-emerald-950">
              <div className="font-extrabold flex items-center gap-1.5 text-emerald-800 text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{isMr ? "अधिकृत निवारण शेरा:" : "Official Resolution Remarks:"}</span>
              </div>
              <p className="leading-relaxed font-medium bg-white/70 p-3 rounded-xl border border-emerald-100">
                {grievance.resolutionNotes}
              </p>
              {grievance.resolvedAt && (
                <div className="text-[11px] text-emerald-700 font-semibold pt-1">
                  {isMr ? "निवारण दिनांक:" : "Resolved On:"}{" "}
                  {new Date(grievance.resolvedAt).toLocaleDateString("en-IN", {
                    dateStyle: "medium",
                  })}
                </div>
              )}
            </div>
          )}

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {isMr ? "तक्रारीचा सविस्तर तपशील" : "Complaint Description"}
            </label>
            <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 text-xs leading-relaxed font-medium text-slate-800 whitespace-pre-wrap">
              {grievance.description}
            </div>
          </div>

          {/* Meta Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Department */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-1">
              <div className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-primary" />
                <span>{isMr ? "संबंधित विभाग" : "Assigned Department"}</span>
              </div>
              <div className="font-bold text-slate-800">
                {grievance.assignedDepartment || catMeta.dept}
              </div>
            </div>

            {/* Address */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-1">
              <div className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span>{isMr ? "पत्ता व ठिकाण" : "Location Address"}</span>
              </div>
              <div className="font-bold text-slate-800 truncate" title={grievance.address || (isMr ? "लोणावळा" : "Lonavala")}>
                {grievance.address || (isMr ? "लोणावळा नगरपरिषद हद्द" : "Lonavala Municipal Area")}
              </div>
            </div>

            {/* Citizen Details */}
            {grievance.citizen && (
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-1 sm:col-span-2">
                <div className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-primary" />
                  <span>{isMr ? "तक्रारदार नागरिकाची माहिती" : "Citizen Details"}</span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-slate-700 font-medium">
                  {grievance.citizen.name && (
                    <span className="font-bold text-slate-900">
                      {grievance.citizen.name}
                    </span>
                  )}
                  {grievance.citizen.phone && (
                    <span className="flex items-center gap-1 text-slate-600">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {grievance.citizen.phone}
                    </span>
                  )}
                  {grievance.citizen.email && (
                    <span className="flex items-center gap-1 text-slate-600">
                      <Mail className="w-3 h-3 text-slate-400" />
                      {grievance.citizen.email}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Attached Photos / Documents */}
          {grievance.attachmentUrls && grievance.attachmentUrls.length > 0 && (
            <div className="space-y-2 pt-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {isMr ? "जोडलेली घटनास्थळ छायाचित्रे" : "Attached Site Photographs"} ({grievance.attachmentUrls.length})
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {grievance.attachmentUrls.map((url, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveImage(url)}
                    className="relative group aspect-square rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 cursor-pointer shadow-2xs hover:border-primary transition-all"
                  >
                    <img
                      src={url}
                      alt={`Evidence ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                      <ExternalLink className="w-4 h-4" />
                      <span>{isMr ? "पहा" : "View"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stage-by-Stage Official Notes History */}
          {grievance.statusHistory && grievance.statusHistory.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-primary" />
                  <span>{isMr ? "टप्प्यांची नोंद व इतिहास" : "Stage Notes & Action Logs"}</span>
                </label>
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  {grievance.statusHistory.length} {isMr ? "नोंदी" : "Updates"}
                </span>
              </div>

              <div className="space-y-2.5">
                {grievance.statusHistory.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-800">
                          {item.status.replace(/_/g, " ")}
                        </span>
                        {item.assignedDepartment && (
                          <span className="text-[10px] bg-slate-200/70 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                            {item.assignedDepartment}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {item.updatedAt
                          ? new Date(String(item.updatedAt)).toLocaleString("en-IN", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })
                          : ""}
                      </span>
                    </div>

                    {item.note && (
                      <p className="text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200/60 leading-relaxed font-medium">
                        {item.note}
                      </p>
                    )}

                    {item.updatedBy && (
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 pt-0.5">
                        <User className="w-3 h-3 text-slate-400" />
                        <span>
                          {isMr ? "अपडेट करणारे:" : "Updated by:"} <strong className="text-slate-600 font-semibold">{item.updatedBy}</strong>
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span>{isMr ? "तक्रार निवारण प्रगती क्रम" : "Redressal Progress Lifecycle"}</span>
              </h3>
              <span className="text-[11px] font-bold text-primary bg-primary-light px-2 py-0.5 rounded-md">
                {isMr ? `सद्यस्थिती: ${uiStatus}` : `Current Status: ${uiStatus}`}
              </span>
            </div>
            <div className="p-4 bg-slate-50/70 border border-slate-200/80 rounded-2xl">
              <Timeline currentStatus={uiStatus} events={timelineEvents} />
            </div>
          </div>
        </div>

        {/* ── Modal Footer ── */}
        <div className="px-6 py-4 bg-slate-50 border-t border-border flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl border border-border transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>{isMr ? "सारांश मुद्रित करा" : "Print Summary"}</span>
            </button>
            <button
              type="button"
              onClick={handleCopyTicket}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl border border-border transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">{isMr ? "कॉपी झाले!" : "Copied!"}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>{isMr ? "टोकन कॉपी करा" : "Copy Ticket"}</span>
                </>
              )}
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            {isMr ? "बंद करा" : "Close"}
          </button>
        </div>
      </div>

      {/* Lightbox full image view */}
      {activeImage && (
        <div
          className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setActiveImage(null)}
        >
          <button
            type="button"
            onClick={() => setActiveImage(null)}
            className="absolute top-4 right-4 p-2.5 text-white bg-white/20 hover:bg-white/40 rounded-full cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={activeImage}
            alt="Full size evidence"
            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
