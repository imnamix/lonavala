"use client";

import { useState, useEffect } from "react";
import { PhoneCall, AlertTriangle, ShieldAlert, Globe } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { Language } from "@/lib/translations";
import { getHomepageData } from "@/lib/services/homepage.service";

interface EmergencyBannerProps {
  isCollapsed?: boolean;
}

export function EmergencyBanner({}: EmergencyBannerProps) {
  const [isDismissed] = useState(false);
  const { dict, language, setLanguage } = useLanguage();
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

  const languages: { code: Language; label: string }[] = [
    { code: "en", label: "English" },
    { code: "mr", label: "मराठी" },
  ];

  return (
    <div className="bg-slate-900 text-white text-xs border-b border-slate-800 py-1.5 px-3 sm:px-6 lg:px-8">
      <div className="max-w-[1536px] mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left: Emergency Alert Broadcast */}
        <div className="flex items-center gap-2 overflow-hidden flex-1 min-w-0">
          <span className="flex items-center gap-1 bg-red-600 text-white px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wider uppercase shrink-0 animate-pulse">
            <AlertTriangle className="w-3 h-3" />
            {dict.emergencyBanner.controlRoom}
          </span>
          <p className="truncate text-slate-300 text-[11px] sm:text-xs">
            {displayText}
          </p>
        </div>

        {/* Right: Emergency Actions and Language Switcher at the very end */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link
            href="/grievance/register"
            className="hidden md:inline-flex items-center gap-1 text-emerald-300 hover:text-emerald-200 font-medium text-[11px]"
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

          {/* Language Switcher at the End (English & Marathi only) */}
          <div className="inline-flex items-center bg-slate-800/90 rounded-lg p-0.5 border border-slate-700 shadow-2xs">
            <div className="flex items-center pl-1.5 pr-1 text-slate-400">
              <Globe className="w-3 h-3 text-emerald-400" />
            </div>
            {languages.map((lang) => {
              const isActive = language === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setLanguage(lang.code)}
                  className={`px-2 py-0.5 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-slate-300 hover:text-white hover:bg-slate-700/70"
                  }`}
                  aria-label={`Switch language to ${lang.label}`}
                >
                  {lang.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
