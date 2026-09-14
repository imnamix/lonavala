import { CheckCircle2, Clock, CircleDot, AlertCircle } from "lucide-react";
import { GrievanceStatus, GrievanceTimelineEvent } from "@/types";

interface TimelineProps {
  currentStatus: GrievanceStatus;
  events?: GrievanceTimelineEvent[];
}

const ALL_STAGES: GrievanceStatus[] = [
  "Submitted",
  "Acknowledged",
  "Assigned",
  "In Progress",
  "Resolved",
  "Closed",
];

export function Timeline({ currentStatus, events = [] }: TimelineProps) {
  const currentIndex = ALL_STAGES.indexOf(currentStatus);

  return (
    <div className="py-6">
      {/* Horizontal Step Bar (Desktop) */}
      <div className="hidden md:flex items-center justify-between relative mb-10">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0" />
        <div
          className="absolute top-1/2 left-0 h-1 bg-emerald-600 -translate-y-1/2 z-0 transition-all duration-700"
          style={{
            width: `${(Math.max(0, currentIndex) / (ALL_STAGES.length - 1)) * 100}%`,
          }}
        />

        {ALL_STAGES.map((stage, idx) => {
          const isPassed = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const isPending = idx > currentIndex;

          return (
            <div key={stage} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-md ${
                  isPassed
                    ? "bg-emerald-600 text-white ring-4 ring-emerald-100"
                    : isCurrent
                    ? "bg-white border-2 border-emerald-600 text-emerald-700 ring-4 ring-emerald-500/20 scale-110"
                    : "bg-slate-100 border border-slate-300 text-slate-400"
                }`}
              >
                {isPassed ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : isCurrent ? (
                  <CircleDot className="w-5 h-5 animate-pulse text-emerald-600" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>
              <span
                className={`mt-2 text-xs font-semibold whitespace-nowrap ${
                  isCurrent
                    ? "text-emerald-700 font-bold"
                    : isPassed
                    ? "text-slate-800"
                    : "text-slate-400"
                }`}
              >
                {stage}
              </span>
            </div>
          );
        })}
      </div>

      {/* Vertical Detailed Timeline Log */}
      <div className="space-y-6 relative before:absolute before:inset-0 before:left-4 before:w-0.5 before:bg-slate-200">
        {events.map((event, index) => {
          const isLatest = index === events.length - 1;
          return (
            <div key={index} className="relative flex items-start gap-4 pl-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 ${
                  isLatest
                    ? "bg-emerald-600 text-white ring-4 ring-emerald-100"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    {event.status}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    {event.date}
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed mb-2">{event.note}</p>
                <div className="text-[11px] text-slate-500 font-medium">
                  Updated by: <span className="text-slate-900 font-semibold">{event.actor}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
