"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award } from "lucide-react";
import { COUNCIL_MEMBERS } from "@/data/mockData";
import { CouncilMember } from "@/types";
import { getCouncilMembers } from "@/lib/services/council.service";
import { useLanguage } from "@/context/LanguageContext";

export function CouncilOverview() {
  const { dict, language } = useLanguage();
  const [members, setMembers] = useState<CouncilMember[]>(COUNCIL_MEMBERS);

  useEffect(() => {
    async function load() {
      try {
        const live = await getCouncilMembers({ active: true });
        if (live && live.length > 0) {
          setMembers(live);
        }
      } catch (err) {
        console.warn("Could not fetch live council members for overview:", err);
      }
    }
    load();
  }, []);

  const president =
    members.find((m) => m.roleCategory === "President") ||
    members[0] ||
    COUNCIL_MEMBERS[0];

  const vicePresident =
    members.find((m) => m.roleCategory === "Vice President") ||
    members[1] ||
    COUNCIL_MEMBERS[1];

  const chiefOfficer =
    members.find(
      (m) =>
        m.roleCategory === "Officer" ||
        m.designation.toLowerCase().includes("chief officer") ||
        m.designation.toLowerCase().includes("commissioner")
    ) ||
    members[2] ||
    COUNCIL_MEMBERS[2];

  const getOfficerDesignation = (id: string, defaultDesignation: string) => {
    if (id === "cm-2" || defaultDesignation?.toLowerCase().includes("vice president"))
      return dict.council.vpDesignation;
    if (
      id === "cm-3" ||
      defaultDesignation?.toLowerCase().includes("chief officer") ||
      defaultDesignation?.toLowerCase().includes("commissioner")
    )
      return dict.council.coDesignation;
    return dict.council.presidentDesignation;
  };

  return (
    <section className="py-16 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
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

        {/* Featured President Card */}
        {president && (
          <div className="bg-gradient-to-br from-slate-50 via-white to-emerald-50/40 border border-slate-200 rounded-3xl p-6 sm:p-8 mb-6 shadow-xs hover:shadow-lg transition-all">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-4 lg:col-span-3 flex justify-center">
                <div className="relative w-36 h-44 sm:w-40 sm:h-48 rounded-2xl overflow-hidden shadow-md border-4 border-white ring-1 ring-slate-200 bg-slate-100">
                  {president.image ? (
                    <Image
                      src={president.image}
                      alt={president.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-emerald-700 text-2xl">
                      {president.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

              <div className="md:col-span-8 lg:col-span-9 space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-emerald-100/70 text-emerald-800 text-xs font-bold border border-emerald-200">
                  <Award className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{dict.council.presidentDesignation}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {language === "mr" && president.marathiName ? president.marathiName : president.name}
                </h3>
                <p className="text-xs text-emerald-700 font-semibold">
                  {language === "mr" ? president.name : president.marathiName}
                </p>

                {/* Snippet / Message */}
                <p className="text-xs sm:text-sm text-slate-600 italic border-l-2 border-emerald-600 pl-3 leading-relaxed">
                  &ldquo;{president.message || dict.council.presidentQuote}&rdquo;
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-600">
                  <span className="font-semibold text-slate-700">{president.tenure || dict.council.tenure}</span>
                  {president.phone && (
                    <>
                      <span>•</span>
                      <span className="text-emerald-700 font-semibold">{president.phone}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VP and Chief Officer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[vicePresident, chiefOfficer].filter(Boolean).map((officer) => (
            <div
              key={officer.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 flex items-center gap-4 shadow-xs hover:border-emerald-600/50 hover:shadow-md transition-all group"
            >
              <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shrink-0 bg-slate-100 border-2 border-slate-100">
                {officer.image ? (
                  <Image
                    src={officer.image}
                    alt={officer.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                    sizes="80px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-emerald-700">
                    {officer.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="overflow-hidden space-y-1 min-w-0">
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  {getOfficerDesignation(officer.id, officer.designation)}
                </span>
                <h4 className="font-bold text-sm sm:text-base text-slate-900 truncate group-hover:text-emerald-700 transition-colors">
                  {language === "mr" && officer.marathiName ? officer.marathiName : officer.name}
                </h4>
                <p className="text-xs text-slate-500 truncate">
                  {language === "mr" ? officer.name : officer.marathiName}
                </p>
                <p className="text-xs font-medium text-emerald-700 truncate">{officer.phone}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/council"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 text-emerald-800 font-bold text-xs sm:text-sm transition-all border border-slate-200 hover:border-emerald-300"
          >
            <span>{dict.council.viewAllMembers}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
