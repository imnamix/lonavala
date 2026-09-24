"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CouncilMember } from "@/types";
import { getCouncilMembers } from "@/lib/services/council.service";
import { useLanguage } from "@/context/LanguageContext";
import { getCachedData } from "@/lib/swr-cache";
import { useAutoTranslate } from "@/hooks/useAutoTranslation";

function CouncilLeaderCard({
  leader,
  idx,
  language,
}: {
  leader: { data: CouncilMember; role: string; badgeBg: string };
  idx: number;
  language: string;
}) {
  const member = leader.data;
  const translatedName = useAutoTranslate(member.name, member.marathiName);

  const primaryName = language === "mr" ? translatedName : member.name;
  const secondaryName =
    language === "mr" ? member.name : member.marathiName || "";

  return (
    <div
      className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-md hover:shadow-2xl hover:border-emerald-600/40 transition-all duration-300 flex flex-col items-center text-center justify-between h-full group"
    >
      {/* 1. Governance Role Category Badge */}
      <div className="w-full flex items-center justify-center min-h-[44px] mb-4">
        <div
          className={`inline-flex items-center justify-center text-center px-4 py-2 sm:px-5 sm:py-2 rounded-full text-sm sm:text-base font-bold border shadow-xs tracking-tight ${leader.badgeBg}`}
        >
          <span>{leader.role}</span>
        </div>
      </div>

      {/* 2. Card Image Container */}
      <div className="relative w-full aspect-[4/4.5] rounded-2xl overflow-hidden shadow-md border-2 border-white ring-1 ring-slate-200/80 bg-slate-100 mb-5 group-hover:scale-[1.02] transition-transform duration-300">
        {member.image ? (
          <Image
            src={member.image}
            alt={member.name}
            fill
            className="object-cover object-top"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 360px"
            priority={idx === 0}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center font-bold text-emerald-800 text-3xl bg-linear-to-br from-emerald-50 to-emerald-100">
            <span>{member.name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase()}</span>
            <span className="text-xs text-emerald-600 font-medium mt-1">LMC Official</span>
          </div>
        )}
      </div>

      {/* 3. Name Container (Fixed Height for Alignment) */}
      <div className="w-full min-h-[56px] flex flex-col justify-center items-center">
        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 group-hover:text-emerald-800 transition-colors tracking-tight leading-snug">
          {primaryName}
        </h3>
        {secondaryName && secondaryName !== primaryName && (
          <p className="text-xs sm:text-sm text-emerald-700 font-semibold mt-0.5">
            {secondaryName}
          </p>
        )}
      </div>
    </div>
  );
}

export function CouncilOverview() {
  const { dict, language } = useLanguage();
  const [members, setMembers] = useState<CouncilMember[]>(() => {
    return getCachedData<CouncilMember[]>("council_members_active=true") || [];
  });
  const [loading, setLoading] = useState<boolean>(() => {
    const cached = getCachedData<CouncilMember[]>("council_members_active=true");
    return !cached || cached.length === 0;
  });

  useEffect(() => {
    async function load() {
      try {
        const live = await getCouncilMembers({ active: true });
        if (live && live.length > 0) {
          setMembers(live);
        }
      } catch (err) {
        console.warn("Could not fetch live council members for overview:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Dynamically find President, Vice President, and Chief Officer from live database records
  const president = members.find(
    (m) =>
      m.roleCategory === "President" ||
      (m.designation?.toLowerCase().includes("president") &&
        !m.designation?.toLowerCase().includes("vice")) ||
      (m.designation?.toLowerCase().includes("नगराध्यक्ष") &&
        !m.designation?.toLowerCase().includes("उपनगराध्यक्ष"))
  );

  const vicePresident = members.find(
    (m) =>
      m.roleCategory === "Vice President" ||
      m.designation?.toLowerCase().includes("vice president") ||
      m.designation?.toLowerCase().includes("vicepresident") ||
      m.designation?.toLowerCase().includes("उपनगराध्यक्ष")
  );

  const chiefOfficer = members.find(
    (m) =>
      m.roleCategory === "Officer" ||
      m.designation?.toLowerCase().includes("chief officer") ||
      m.designation?.toLowerCase().includes("commissioner") ||
      m.designation?.toLowerCase().includes("मुख्याधिकारी") ||
      m.designation?.toLowerCase().includes("आयुक्त")
  );

  const leaders: { data: CouncilMember; role: string; badgeBg: string }[] = [];

  if (president) {
    leaders.push({
      data: president,
      role: dict.council.presidentDesignation,
      badgeBg: "bg-emerald-100/90 text-emerald-900 border-emerald-200",
    });
  }

  if (vicePresident) {
    leaders.push({
      data: vicePresident,
      role: dict.council.vpDesignation,
      badgeBg: "bg-teal-100/90 text-teal-900 border-teal-200",
    });
  }

  if (chiefOfficer) {
    leaders.push({
      data: chiefOfficer,
      role: dict.council.coDesignation,
      badgeBg: "bg-blue-100/90 text-blue-900 border-blue-200",
    });
  }

  // If specific named leadership roles are not found, dynamically display top active members from DB
  if (leaders.length === 0 && members.length > 0) {
    members.slice(0, 3).forEach((m, idx) => {
      leaders.push({
        data: m,
        role: m.designation || "Council Member",
        badgeBg:
          idx === 0
            ? "bg-emerald-100/90 text-emerald-900 border-emerald-200"
            : idx === 1
            ? "bg-teal-100/90 text-teal-900 border-teal-200"
            : "bg-blue-100/90 text-blue-900 border-blue-200",
      });
    });
  }

  if (!loading && leaders.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200">
            {dict.council.badge}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {dict.council.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1.5">
            {dict.council.subtitle}
          </p>
        </div>

        {/* 3 Council Leadership Cards in Same Line with Identical Dimensions */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-md flex flex-col items-center text-center justify-between h-full animate-pulse"
              >
                {/* 1. Governance Role Category Badge Skeleton */}
                <div className="w-full flex items-center justify-center min-h-[44px] mb-4">
                  <div className="h-9 w-44 bg-slate-100 rounded-full border border-slate-200/60" />
                </div>

                {/* 2. Card Image Skeleton */}
                <div className="relative w-full aspect-[4/4.5] rounded-2xl overflow-hidden shadow-md border-2 border-white ring-1 ring-slate-200/80 bg-slate-100 mb-5 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-slate-200" />
                </div>

                {/* 3. Name Container Skeleton */}
                <div className="w-full min-h-[56px] flex flex-col justify-center items-center gap-2">
                  <div className="h-5 w-48 bg-slate-200 rounded-md" />
                  <div className="h-3.5 w-32 bg-slate-100 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {leaders.map((leader, idx) => (
              <CouncilLeaderCard
                key={leader.data.id || idx}
                leader={leader}
                idx={idx}
                language={language}
              />
            ))}
          </div>
        )}

        {/* View All Council Members CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/council"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-50 hover:bg-emerald-50 text-emerald-800 font-bold text-xs sm:text-sm transition-all border border-slate-200 hover:border-emerald-300 shadow-2xs hover:shadow-xs"
          >
            <span>{dict.council.viewAllMembers}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

