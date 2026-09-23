"use client";

import { Check, Clock, CircleDot, ShieldCheck, UserCheck, CheckCircle2 } from "lucide-react";
import { GrievanceStatus, GrievanceTimelineEvent } from "@/types";
import { useLanguage } from "@/context/LanguageContext";

interface TimelineProps {
  currentStatus: GrievanceStatus;
  events?: GrievanceTimelineEvent[];
}

const ALL_STAGES: {
  status: GrievanceStatus;
  label: string;
  labelMr: string;
  desc: string;
  descMr: string;
}[] = [
  {
    status: "Submitted",
    label: "Submitted",
    labelMr: "नोंदणी झाली",
    desc: "Lodged by citizen",
    descMr: "नागरिकाने नोंदवली",
  },
  {
    status: "Acknowledged",
    label: "Acknowledged",
    labelMr: "स्वीकृत",
    desc: "Desk review",
    descMr: "प्राथमिक तपासणी",
  },
  {
    status: "Assigned",
    label: "Assigned",
    labelMr: "अधिकारी नियुक्त",
    desc: "Officer allocated",
    descMr: "विभागाकडे वर्ग",
  },
  {
    status: "In Progress",
    label: "In Progress",
    labelMr: "काम सुरू",
    desc: "Field action",
    descMr: "प्रत्यक्ष कार्यवाही",
  },
  {
    status: "Resolved",
    label: "Resolved",
    labelMr: "निराकरण झाले",
    desc: "Work completed",
    descMr: "तक्रार निवारण पूर्ण",
  },
  {
    status: "Closed",
    label: "Closed",
    labelMr: "तक्रार बंद",
    desc: "Officially closed",
    descMr: "अधिकृतरीत्या बंद",
  },
];

export function Timeline({ currentStatus, events = [] }: TimelineProps) {
  const { language } = useLanguage();
  const isMr = language === "mr";
  const currentIndex = ALL_STAGES.findIndex((s) => s.status === currentStatus);
  const activeIdx = currentIndex >= 0 ? currentIndex : 0;

  return (
    <div className="space-y-8">
      {/* ─── Horizontal 6-Stage Progress Stepper (Desktop & Tablet) ─── */}
      <div className="hidden md:block pt-4 pb-2 px-2">
        <div className="relative">
          {/* Background Connecting Line */}
          <div className="absolute top-5 left-6 right-6 h-1 bg-slate-100 rounded-full z-0" />

          {/* Active Filled Progress Line */}
          <div
            className="absolute top-5 left-6 h-1 bg-gradient-to-r from-emerald-500 via-primary to-primary rounded-full z-0 transition-all duration-700 shadow-2xs"
            style={{
              width: `calc(${((activeIdx) / (ALL_STAGES.length - 1)) * 100}% * ((100% - 48px) / 100%))`,
            }}
          />

          {/* Stepper Nodes */}
          <div className="flex items-start justify-between relative z-10">
            {ALL_STAGES.map((stage, idx) => {
              const isCompleted = idx < activeIdx;
              const isCurrent = idx === activeIdx;
              const isUpcoming = idx > activeIdx;

              return (
                <div key={stage.status} className="flex flex-col items-center group w-24 text-center">
                  {/* Circle Badge */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs transition-all duration-300 ${
                      isCompleted
                        ? "bg-emerald-600 text-white shadow-sm ring-4 ring-emerald-100/80"
                        : isCurrent
                        ? "bg-white border-2 border-primary text-primary shadow-md ring-4 ring-primary/20 scale-110"
                        : "bg-white border border-slate-200 text-slate-400"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4 stroke-[3]" />
                    ) : isCurrent ? (
                      <CircleDot className="w-4 h-4 text-primary animate-pulse stroke-[2.5]" />
                    ) : (
                      <span>{idx + 1}</span>
                    )}
                  </div>

                  {/* Stage Label */}
                  <div className="mt-3 space-y-0.5">
                    <div
                      className={`text-xs font-bold leading-tight ${
                        isCurrent
                          ? "text-primary font-black"
                          : isCompleted
                          ? "text-slate-800 font-bold"
                          : "text-slate-400 font-medium"
                      }`}
                    >
                      {isMr ? stage.labelMr : stage.label}
                    </div>
                    <div className="text-[10px] text-slate-400 leading-tight hidden lg:block">
                      {isMr ? stage.descMr : stage.desc}
                    </div>
                  </div>

                  {/* Active Indicator Chip */}
                  {isCurrent && (
                    <span className="mt-1.5 px-2 py-0.5 rounded-md bg-primary-light text-primary font-extrabold text-[9px] uppercase tracking-wider shadow-2xs">
                      {isMr ? "सक्रिय" : "Active"}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── Mobile Vertical Stepper View ─── */}
      <div className="block md:hidden space-y-3">
        {ALL_STAGES.map((stage, idx) => {
          const isCompleted = idx < activeIdx;
          const isCurrent = idx === activeIdx;
          const isUpcoming = idx > activeIdx;

          return (
            <div
              key={stage.status}
              className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                isCurrent
                  ? "bg-primary-light/40 border-primary shadow-2xs"
                  : isCompleted
                  ? "bg-emerald-50/50 border-emerald-200"
                  : "bg-slate-50/70 border-slate-200 opacity-60"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                  isCompleted
                    ? "bg-emerald-600 text-white"
                    : isCurrent
                    ? "bg-primary text-white ring-2 ring-primary/30"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${isCurrent ? "text-primary font-black" : "text-slate-900"}`}>
                    {isMr ? stage.labelMr : stage.label}
                  </span>
                  {isCurrent && (
                    <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-primary text-white">
                      {isMr ? "सध्याचा टप्पा" : "Current Stage"}
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-slate-500">
                  {isMr ? stage.descMr : stage.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Detailed Activity Log Cards ─── */}
      <div className="border-t border-slate-100 pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-slate-500" />
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            {isMr ? "नोंदवलेली माहिती व इतिहास" : "Activity & Redressal Log"}
          </h4>
        </div>

        <div className="space-y-3">
          {events && events.length > 0 ? (
            events.map((event, index) => {
              const isLatest = index === events.length - 1;
              const matchingStage = ALL_STAGES.find((s) => s.status === event.status);
              const displayStatus = isMr
                ? matchingStage?.labelMr || event.status
                : matchingStage?.label || event.status;

              return (
                <div
                  key={index}
                  className={`p-4 rounded-2xl border transition-all space-y-2 ${
                    isLatest
                      ? "bg-white border-primary/40 shadow-2xs ring-1 ring-primary/10"
                      : "bg-slate-50/60 border-slate-200"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      <span className="font-extrabold text-xs text-slate-900">
                        {displayStatus}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-lg">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{event.date}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed pl-4">
                    {event.note}
                  </p>

                  <div className="pt-1 pl-4 flex items-center gap-1.5 text-[11px] text-slate-500">
                    <span className="font-medium text-slate-400">
                      {isMr ? "कार्यवाही करणारे:" : "Action By:"}
                    </span>
                    <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
                      {event.actor}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-4 rounded-2xl bg-slate-50 text-center text-xs text-slate-500">
              {isMr ? "कोणत्याही नोंदी उपलब्ध नाहीत." : "No activity logs recorded yet."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
