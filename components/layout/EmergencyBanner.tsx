"use client";

import { useState, useEffect } from "react";
import { PhoneCall, AlertTriangle, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { getHomepageData } from "@/lib/services/homepage.service";

interface EmergencyBannerProps {
  isCollapsed?: boolean;
}

export function EmergencyBanner({ isCollapsed = false }: EmergencyBannerProps) {
  const [isDismissed] = useState(false);
  const { dict } = useLanguage();
  const [dynamicAnnouncement, setDynamicAnnouncement] = useState<string | null>(null);
  const [isBannerActive, setIsBannerActive] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function loadAnnouncement() {
      try {
        const data = await getHomepageData(false);
        if (isMounted && data) {
          if (typeof data.announcementActive === "boolean") {
            setIsBannerActive(data.announcementActive);
          }
          if (data.announcement && data.announcement.trim()) {
            setDynamicAnnouncement(data.announcement.trim());
          }
        }
      } catch (err) {
        console.warn("Failed to load emergency announcement:", err);
      }
    }
    loadAnnouncement();
    return () => {
      isMounted = false;
    };
  }, []);

  if (isDismissed || !isBannerActive) return null;

  const defaultText = `${dict.emergencyBanner.monsoonHelpline}: 1800-233-0101 | ${dict.emergencyBanner.fire}: 101 | ${dict.emergencyBanner.police}: 112 | ${dict.emergencyBanner.disasterMgmt}: +91 2114 273999`;
  const displayText = dynamicAnnouncement || defaultText;

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
            {displayText}
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
