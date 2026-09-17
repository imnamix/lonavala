"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, ShieldCheck, Phone, Mail } from "lucide-react";
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
  );

  const vicePresident = members.find(
    (m) =>
      m.roleCategory === "Vice President" ||
      m.designation?.toLowerCase().includes("vice president") ||
      m.designation?.toLowerCase().includes("vicepresident") ||
      m.designation?.toLowerCase().includes("उपनगराध्यक्ष")
  );

  const leaders = [
    president
      ? {
          data: president,
          role: dict.council.presidentDesignation,
          icon: <Award className="w-4 h-4 text-emerald-800" />,
          defaultQuote: dict.council.presidentQuote,
          defaultCommittee: "Standing Committee Chairperson",
        }
      : null,
    vicePresident
      ? {
          data: vicePresident,
          role: dict.council.vpDesignation,
          icon: <ShieldCheck className="w-4 h-4 text-emerald-800" />,
          defaultQuote:
            "Committed to world-class public infrastructure, water conservation, and transparent municipal governance for Lonavala.",
          defaultCommittee: "Public Works & Civic Amenities",
        }
      : null,
  ].filter(Boolean) as {
    data: CouncilMember;
    role: string;
    icon: React.ReactNode;
    defaultQuote: string;
    defaultCommittee: string;
  }[];

  if (!loading && leaders.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

        {/* Side-by-Side President & Vice President Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
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
                className="bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs hover:shadow-xl hover:border-emerald-600/40 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Top Badge & Tenure Row */}
                  <div className="flex items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-900 text-xs font-bold border border-emerald-200/80 shadow-2xs">
                      {leader.icon}
                      <span>{leader.role}</span>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 bg-white px-2.5 py-0.5 rounded-full border border-slate-200">
                      {member.tenure || dict.council.tenure || "2022 - 2027"}
                    </span>
                  </div>

                  {/* Profile Header (Portrait + Names + Contacts) */}
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5">
                    <div className="relative w-28 h-36 sm:w-32 sm:h-40 rounded-2xl overflow-hidden shadow-md border-2 border-white ring-1 ring-slate-200/80 shrink-0 bg-slate-100 group-hover:scale-102 transition-transform">
                      {member.image ? (
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 112px, 128px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-emerald-700 text-2xl bg-emerald-50">
                          {member.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5 text-center sm:text-left flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug group-hover:text-emerald-800 transition-colors">
                        {primaryName}
                      </h3>
                      {secondaryName && (
                        <p className="text-xs text-emerald-700 font-semibold">
                          {secondaryName}
                        </p>
                      )}
                      <p className="text-[11px] text-slate-500 font-medium pt-0.5">
                        {member.committee || leader.defaultCommittee}
                      </p>

                      {/* Contact items */}
                      <div className="pt-2 space-y-1 text-xs text-slate-600">
                        {member.phone && (
                          <div className="flex items-center justify-center sm:justify-start gap-2">
                            <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <a
                              href={`tel:${member.phone}`}
                              className="font-semibold text-slate-700 hover:text-emerald-700 transition-colors"
                            >
                              {member.phone}
                            </a>
                          </div>
                        )}
                        {member.email && (
                          <div className="flex items-center justify-center sm:justify-start gap-2 truncate">
                            <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <a
                              href={`mailto:${member.email}`}
                              className="text-slate-600 hover:text-emerald-700 transition-colors truncate"
                            >
                              {member.email}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Message Quote */}
                  <div className="mt-4 pt-3.5 border-t border-slate-100">
                    <p className="text-xs sm:text-sm text-slate-600 italic border-l-2 border-emerald-600 pl-3 leading-relaxed bg-slate-50/70 p-2.5 rounded-r-xl">
                      &ldquo;{member.message || leader.defaultQuote}&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Council Members CTA */}
        <div className="mt-10 text-center">
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
