"use client";

import { useState } from "react";
import { PhoneCall, AlertTriangle, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

interface EmergencyBannerProps {
  isCollapsed?: boolean;
}

export function EmergencyBanner({ isCollapsed = false }: EmergencyBannerProps) {
  const [isDismissed] = useState(false);
  const { dict } = useLanguage();

  if (isDismissed) return null;

  return (
    <div
      className={`bg-slate-900 text-white text-xs border-b border-slate-800 transition-all duration-300 overflow-hidden ${
        isCollapsed ? "max-h-0 opacity-0 py-0" : "max-h-12 opacity-100 py-2 px-4"
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="flex items-center gap-1 bg-red-600 text-white px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wider uppercase shrink-0 animate-pulse">
            <AlertTriangle className="w-3 h-3" />
            {dict.emergencyBanner.controlRoom}
          </span>
          <p className="truncate text-slate-300 text-[11px] sm:text-xs">
            {dict.emergencyBanner.monsoonHelpline}:{" "}
            <a href="tel:18002330101" className="font-bold text-emerald-400 hover:underline">
              1800-233-0101
            </a>{" "}
            | {dict.emergencyBanner.fire}: <span className="font-semibold text-emerald-300">101</span> | {dict.emergencyBanner.police}:{" "}
            <span className="font-semibold text-emerald-300">112</span> | {dict.emergencyBanner.disasterMgmt}:{" "}
            <span className="font-semibold text-emerald-300">+91 2114 273999</span>
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/grievance/register"
            className="hidden sm:inline-flex items-center gap-1 text-emerald-300 hover:text-emerald-200 font-medium text-[11px]"
          >
            <ShieldAlert className="w-3 h-3" />
            {dict.emergencyBanner.lodgeComplaint}
          </Link>
          <a
            href="tel:18002330101"
            className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 px-2 py-0.5 rounded text-white font-bold text-[10px] transition-colors shadow-xs"
          >
            <PhoneCall className="w-2.5 h-2.5" />
            {dict.emergencyBanner.tollFree}
          </a>
        </div>
      </div>
    </div>
  );
}
