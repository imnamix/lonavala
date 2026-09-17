"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, ShieldCheck, Building2, Calendar } from "lucide-react";
import { CouncilMember } from "@/types";
import { getCouncilMembers } from "@/lib/services/council.service";
import { useLanguage } from "@/context/LanguageContext";

export function CouncilOverview() {
  const { dict, language } = useLanguage();
  const [members, setMembers] = useState<CouncilMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
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

  const president = members.find(
    (m) =>
      m.roleCategory === "President" ||
      (m.designation?.toLowerCase().includes("president") &&
        !m.designation?.toLowerCase().includes("vice")) ||
      (m.designation?.toLowerCase().includes("नगराध्यक्ष") &&
        !m.designation?.toLowerCase().includes("उपनगराध्यक्ष"))
  )

  const vicePresident = members.find(
    (m) =>
      m.roleCategory === "Vice President" ||
      m.designation?.toLowerCase().includes("vice president") ||
      m.designation?.toLowerCase().includes("vicepresident") ||
      m.designation?.toLowerCase().includes("उपनगराध्यक्ष")
  ) 

  const chiefOfficer = members.find(
    (m) =>
      m.roleCategory === "Officer" ||
      m.designation?.toLowerCase().includes("chief officer") ||
      m.designation?.toLowerCase().includes("commissioner") ||
      m.designation?.toLowerCase().includes("मुख्याधिकारी") ||
      m.designation?.toLowerCase().includes("आयुक्त")
  ) 

  const leaders = [
    {
      data: president,
      role: dict.council.presidentDesignation,
      icon: <Award className="w-4 h-4 text-emerald-800" />,
      badgeBg: "bg-emerald-100/90 text-emerald-900 border-emerald-200",
    },
    {
      data: vicePresident,
      role: dict.council.vpDesignation,
      icon: <ShieldCheck className="w-4 h-4 text-emerald-800" />,
      badgeBg: "bg-teal-100/90 text-teal-900 border-teal-200",
    },
    {
      data: chiefOfficer,
      role: dict.council.coDesignation,
      icon: <Building2 className="w-4 h-4 text-emerald-800" />,
      badgeBg: "bg-blue-100/90 text-blue-900 border-blue-200",
    },
  ];

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

        {/* 3 Council Leadership Cards in Same Line */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {leaders.map((leader, idx) => {
            const member = leader.data;
            if (!member) return null;

            const primaryName =
              language === "mr" && member.marathiName
                ? member.marathiName
                : member.name;
            const secondaryName =
              language === "mr" ? member.name : member.marathiName;

            return (
              <div
                key={member.id || idx}
                className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-md hover:shadow-2xl hover:border-emerald-600/40 transition-all duration-300 flex flex-col items-center text-center justify-between group"
              >
                {/* 1. Governance Role Category Badge */}
                <div className="w-full flex items-center justify-center mb-4">
                  <div
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border shadow-2xs ${leader.badgeBg}`}
                  >
                    {leader.icon}
                    <span>{leader.role}</span>
                  </div>
                </div>

                {/* 2. Big Size Image */}
                <div className="relative w-full aspect-[4/4.6] max-w-[280px] sm:max-w-none rounded-2xl overflow-hidden shadow-md border-2 border-white ring-1 ring-slate-200/80 bg-slate-100 mb-5 group-hover:scale-[1.02] transition-transform duration-300">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      priority={idx === 0}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-emerald-700 text-4xl bg-emerald-50">
                      {member.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* 3. Name & 4. Elected Tenure */}
                <div className="space-y-2 w-full">
                  <div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 group-hover:text-emerald-800 transition-colors tracking-tight leading-snug">
                      {primaryName}
                    </h3>
                    {secondaryName && secondaryName !== primaryName && (
                      <p className="text-xs text-emerald-700 font-semibold mt-0.5">
                        {secondaryName}
                      </p>
                    )}
                  </div>

                  {/* Elected Tenure */}
                  <div className="pt-2 flex items-center justify-center">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{member.tenure || dict.council.tenure || "2022 - 2027"}</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

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
