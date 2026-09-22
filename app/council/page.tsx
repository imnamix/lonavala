"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Phone,
  Mail,
  FileText,
  Download,
  Award,
  ShieldCheck,
  Users,
  ChevronRight,
  Calendar,
  Layers,
  Sparkles,
} from "lucide-react";
import { getCouncilMembers } from "@/lib/services/council.service";
import { getCommittees } from "@/lib/services/committee.service";
import { getResolutions } from "@/lib/services/resolution.service";
import { CouncilMember, StandingCommittee, CouncilResolution } from "@/types";
import {
  CouncilMemberTrigger,
  WardCorporators,
} from "@/components/council/WardCorporators";
import { useLanguage } from "@/context/LanguageContext";

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

function toMarathiDigits(str: string | number | undefined | null): string {
  if (str === undefined || str === null) return "";
  const s = String(str);
  const marathiDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
  return s.replace(/[0-9]/g, (w) => marathiDigits[+w]);
}

const COMMITTEE_MARATHI_MAP: Record<string, string> = {
  "standing committee": "स्थायी समिती",
  "public works committee": "सार्वजनिक बांधकाम समिती",
  "water supply & drainage committee": "पाणीपुरवठा व जलनिस्सारण समिती",
  "water supply and drainage committee": "पाणीपुरवठा व जलनिस्सारण समिती",
  "health & sanitation committee": "आरोग्य व स्वच्छता समिती",
  "health and sanitation committee": "आरोग्य व स्वच्छता समिती",
  "education & sports committee": "शिक्षण व क्रीडा समिती",
  "education and sports committee": "शिक्षण व क्रीडा समिती",
  "women & child welfare committee": "महिला व बालकल्याण समिती",
  "women and child welfare committee": "महिला व बालकल्याण समिती",
  "planning & development committee": "नियोजन व विकास समिती",
  "planning and development committee": "नियोजन व विकास समिती",
  "tree authority committee": "वृक्ष प्राधिकरण समिती",
  "town planning committee": "नगर रचना समिती",
};

function getCommitteeMarathiName(name: string, marathiName?: string): string {
  if (marathiName && marathiName.trim()) return marathiName.trim();
  const normalized = (name || "").toLowerCase().trim();
  return COMMITTEE_MARATHI_MAP[normalized] || name;
}

const RESOLUTION_DICTIONARY: Record<string, string> = {
  "application form for new water tap connection (domestic & commercial)":
    "नवीन नळ जोडणीसाठी अर्ज (घरगुती व व्यावसायिक)",
  "application form for new water tap connection (domestic and commercial)":
    "नवीन नळ जोडणीसाठी अर्ज (घरगुती व व्यावसायिक)",
  "application form for new water tap connection":
    "नवीन नळ जोडणीसाठी अर्ज",
  "sanction of annual municipal budget and development scheme":
    "वार्षिक नगरपरिषद अर्थसंकल्प आणि विकास योजना मंजुरी",
  "development and maintenance of city roads & infrastructure":
    "शहरातील रस्ते व पायाभूत सुविधांचा विकास आणि देखभाल",
  "development and maintenance of city roads and infrastructure":
    "शहरातील रस्ते व पायाभूत सुविधांचा विकास आणि देखभाल",
  "solid waste management and city cleanliness campaign":
    "घनकचरा व्यवस्थापन व शहर स्वच्छता अभियान",
  "approval for public parks and garden beautification project":
    "सार्वजनिक उद्याने आणि बगीचा सुशोभीकरण प्रकल्प मंजुरी",
  "approval for underground drainage and sewerage line expansion":
    "भूमिगत गटार व सांडपाणी वाहिनी विस्तार मंजुरी",
  "installation and maintenance of led street lights across all wards":
    "सर्व प्रभागांमध्ये एलईडी पथदिवे बसविणे व देखभाल",
  "monsoon preparedness and disaster management plan":
    "पावसाळा पूर्वतयारी व आपत्ती व्यवस्थापन योजना",
  "granting no objection certificate (noc) and building permission guidelines":
    "ना हरकत प्रमाणपत्र (NOC) व बांधकाम परवानगी मार्गदर्शक तत्त्वे",
  "implementation of solar power projects on municipal council buildings":
    "नगरपरिषद इमारतींवर सौरऊर्जा प्रकल्प राबविणे",
  "health and sanitation measures in commercial and tourist areas":
    "व्यावसायिक व पर्यटन क्षेत्रातील आरोग्य आणि स्वच्छता उपाययोजना",
  "fire safety audit and emergency services upgrade in municipal limits":
    "नगरपरिषद हद्दीतील अग्निसुरक्षा ऑडिट आणि आपत्कालीन सेवांचे आधुनिकीकरण",
  "water supply scheme maintenance and pipeline augmentation":
    "पाणीपुरवठा योजना देखभाल व जलवाहिनी क्षमता वृद्धी",
  "property tax assessment and online payment system upgrade":
    "मालमत्ता कर आकारणी व ऑनलाइन पेमेंट प्रणाली आधुनिकीकरण",
  "town planning and development control regulations implementation":
    "नगररचना व विकास नियंत्रण नियमावली अंमलबजावणी",
  "e-governance and citizen public service portal implementation":
    "ई-प्रशासन आणि नागरिक सार्वजनिक सेवा पोर्टल अंमलबजावणी",
  "public health center equipment procurement and facility improvement":
    "सार्वजनिक आरोग्य केंद्र उपकरण खरेदी व सुविधा सुधारणा",
  "tree plantation and environmental protection drive in lonavala":
    "लोणावळा शहरात वृक्षारोपण व पर्यावरण संरक्षण मोहीम",
  "tourist facility and traffic management scheme for peak season":
    "पर्यटन हंगाम नागरिक सुविधा व वाहतूक व्यवस्थापन योजना",
  "financial assistance and welfare scheme for economically weaker sections":
    "आर्थिक दुर्बल घटकांसाठी आर्थिक सहाय्य व कल्याणकारी योजना",
};

function translateResolutionTitle(
  title: string | undefined | null,
  marathiTitle: string | undefined | null,
  isMr: boolean
): string {
  if (!title && !marathiTitle) return "";
  if (!isMr) return title || marathiTitle || "";

  // 1. If explicit marathiTitle exists from backend, use it
  if (marathiTitle && marathiTitle.trim()) {
    return marathiTitle.trim();
  }

  if (!title) return "";
  const trimmed = title.trim();
  const lower = trimmed.toLowerCase();

  // 2. Direct statutory lookup
  if (RESOLUTION_DICTIONARY[lower]) {
    return RESOLUTION_DICTIONARY[lower];
  }

  // 3. Intelligent statutory phrase replacements
  let translated = trimmed;
  const replacements: [RegExp, string | ((substring: string, ...args: any[]) => string)][] = [
    [/Application Form for/gi, "अर्ज -"],
    [/Application Form/gi, "अर्ज"],
    [/New Water Tap Connection/gi, "नवीन नळ जोडणी"],
    [/Water Tap Connection/gi, "नळ जोडणी"],
    [/\(Domestic & Commercial\)/gi, "(घरगुती व व्यावसायिक)"],
    [/\(Domestic and Commercial\)/gi, "(घरगुती व व्यावसायिक)"],
    [/Domestic & Commercial/gi, "घरगुती व व्यावसायिक"],
    [/Domestic and Commercial/gi, "घरगुती व व्यावसायिक"],
    [/Domestic/gi, "घरगुती"],
    [/Commercial/gi, "व्यावसायिक"],
    [/Sanction of/gi, "मंजुरी -"],
    [/Approval for/gi, "मंजुरी -"],
    [/Approval of/gi, "मंजुरी -"],
    [/Annual Municipal Budget/gi, "वार्षिक नगरपरिषद अर्थसंकल्प"],
    [/Annual Budget/gi, "वार्षिक अर्थसंकल्प"],
    [/Development Scheme/gi, "विकास योजना"],
    [/Development Plan/gi, "विकास आराखडा"],
    [/Solid Waste Management/gi, "घनकचरा व्यवस्थापन"],
    [/City Cleanliness/gi, "शहर स्वच्छता"],
    [/Drainage System|Drainage Line/gi, "जलनिस्सारण वाहिनी"],
    [/Underground Drainage/gi, "भूमिगत गटार"],
    [/Water Supply/gi, "पाणीपुरवठा"],
    [/Street Light|Street Lights|LED Street Lights/gi, "एलईडी पथदिवे"],
    [/Public Works/gi, "सार्वजनिक बांधकाम"],
    [/Disaster Management/gi, "आपत्ती व्यवस्थापन"],
    [/Building Permission/gi, "बांधकाम परवानगी"],
    [/Property Tax/gi, "मालमत्ता कर"],
    [/Town Planning/gi, "नगररचना"],
    [/Tree Plantation/gi, "वृक्षारोपण"],
    [/Municipal Council/gi, "नगरपरिषद"],
    [/Lonavala/gi, "लोणावळा"],
    [/Resolution/gi, "ठराव"],
    [/Ward No\.\s*(\d+)/gi, (_match: string, n: string) => `प्रभाग क्र. ${toMarathiDigits(n)}`],
    [/Ward\s*(\d+)/gi, (_match: string, n: string) => `प्रभाग ${toMarathiDigits(n)}`],
  ];

  for (const [re, rep] of replacements) {
    // @ts-expect-error replace with string or function overload
    translated = translated.replace(re, rep);
  }

  return translated;
}

const MEETING_TYPE_MARATHI_MAP: Record<string, string> = {
  "general body meeting": "सर्वसाधारण सभा",
  "special meeting": "विशेष सभा",
  "standing committee meeting": "स्थायी समिती सभा",
  "budget session": "अर्थसंकल्पीय अधिवेशन",
  "gazette notification": "राजपत्र अधिसूचना",
  "standing order": "स्थायी आदेश",
  "executive resolution": "प्रशासकीय ठराव",
  "annual general meeting": "वार्षिक सर्वसाधारण सभा",
  "urgent meeting": "तातडीची सभा",
};

function getMeetingTypeLabel(type: string | undefined | null, isMr: boolean): string {
  if (!type) return "";
  if (!isMr) return type;
  const normalized = type.toLowerCase().trim();
  return MEETING_TYPE_MARATHI_MAP[normalized] || type;
}

function MemberImage({
  member,
  className,
}: {
  member: CouncilMember;
  className: string;
}) {
  return member.image ? (
    <Image
      src={member.image}
      alt={member.name}
      fill
      className={className}
      sizes="(max-width: 768px) 100vw, 200px"
    />
  ) : (
    <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-emerald-800 text-xl font-bold">
      {getInitials(member.name)}
    </div>
  );
}

function CouncilSkeleton() {
  return (
    <div className="pt-0 pb-16 bg-slate-50/50">
      {/* Header Banner Skeleton */}
      <div className="relative bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white border-b border-emerald-800/40 py-12 sm:py-16 mb-12 overflow-hidden">
        {/* Decorative Background Glows */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl space-y-4 animate-pulse">
            {/* Breadcrumb Skeleton */}
            <div className="flex items-center gap-2">
              <div className="h-3.5 w-14 bg-white/20 rounded-md" />
              <div className="h-3.5 w-3.5 bg-white/20 rounded-full" />
              <div className="h-3.5 w-28 bg-white/30 rounded-md" />
            </div>

            {/* Badge Skeleton */}
            <div className="h-7 w-56 bg-emerald-500/20 border border-emerald-400/30 rounded-full" />

            {/* Title Skeleton */}
            <div className="space-y-2">
              <div className="h-9 sm:h-12 w-3/4 max-w-xl bg-white/20 rounded-xl" />
            </div>

            {/* Subtitle Skeleton */}
            <div className="space-y-2 pt-1 max-w-2xl">
              <div className="h-4 bg-emerald-400/20 rounded-md w-full" />
              <div className="h-4 bg-emerald-400/20 rounded-md w-4/5" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section 1: Leadership Skeleton */}
        <section className="space-y-6 animate-pulse">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="space-y-2">
              <div className="h-7 w-64 bg-slate-200 rounded-xl" />
              <div className="h-4 w-48 bg-slate-100 rounded" />
            </div>
            <div className="h-6 w-28 bg-emerald-100 rounded-full" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5"
              >
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="h-6 w-36 bg-emerald-100/70 rounded-full" />
                  <div className="h-5 w-20 bg-slate-100 rounded-full" />
                </div>
                <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
                  <div className="w-32 h-40 sm:w-36 sm:h-44 rounded-2xl bg-slate-200 shrink-0" />
                  <div className="space-y-2.5 flex-1 w-full text-center sm:text-left">
                    <div className="h-6 w-3/4 mx-auto sm:mx-0 bg-slate-200 rounded-lg" />
                    <div className="h-4 w-1/2 mx-auto sm:mx-0 bg-emerald-100 rounded" />
                    <div className="h-3.5 w-2/3 mx-auto sm:mx-0 bg-slate-100 rounded" />
                    <div className="pt-3 space-y-2">
                      <div className="h-3.5 w-32 mx-auto sm:mx-0 bg-slate-100 rounded" />
                      <div className="h-3.5 w-40 mx-auto sm:mx-0 bg-slate-100 rounded" />
                    </div>
                  </div>
                </div>
                <div className="pt-3 border-t border-slate-100">
                  <div className="h-12 bg-slate-50 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Committee Chairpersons Skeleton */}
        <section className="space-y-6 animate-pulse">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="space-y-2">
              <div className="h-7 w-56 bg-slate-200 rounded-xl" />
              <div className="h-4 w-44 bg-slate-100 rounded" />
            </div>
            <div className="h-6 w-20 bg-emerald-100 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="h-5 w-28 bg-emerald-100/70 rounded-full" />
                  <div className="h-4 w-14 bg-slate-100 rounded-full" />
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-20 rounded-xl bg-slate-200 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-3/4 bg-slate-200 rounded" />
                    <div className="h-3.5 w-1/2 bg-emerald-100 rounded" />
                    <div className="h-3 w-2/3 bg-slate-100 rounded" />
                  </div>
                </div>
                <div className="pt-3 border-t border-slate-100 space-y-1.5">
                  <div className="h-3 w-28 bg-slate-100 rounded" />
                  <div className="h-3 w-36 bg-slate-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Ward Corporators Skeleton */}
        <section className="space-y-6 animate-pulse">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="space-y-2">
              <div className="h-7 w-60 bg-slate-200 rounded-xl" />
              <div className="h-4 w-52 bg-slate-100 rounded" />
            </div>
            <div className="h-6 w-24 bg-emerald-100 rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col items-center justify-between min-h-[360px] shadow-xs"
              >
                <div className="w-full flex flex-col items-center space-y-3">
                  <div className="w-32 h-32 rounded-full bg-slate-200 mb-2" />
                  <div className="h-5 w-24 bg-emerald-100 rounded-full" />
                  <div className="h-5 w-36 bg-slate-200 rounded-lg" />
                  <div className="h-3.5 w-24 bg-emerald-100 rounded" />
                  <div className="h-3.5 w-28 bg-slate-100 rounded" />
                </div>
                <div className="w-full pt-4 border-t border-slate-100 flex justify-center">
                  <div className="h-4 w-28 bg-emerald-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Committees Skeleton */}
        <section className="space-y-6 animate-pulse">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="space-y-2">
              <div className="h-7 w-52 bg-slate-200 rounded-xl" />
              <div className="h-4 w-60 bg-slate-100 rounded" />
            </div>
            <div className="h-6 w-20 bg-emerald-100 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1.5 flex-1">
                    <div className="h-5 w-3/4 bg-slate-200 rounded-lg" />
                    <div className="h-3.5 w-1/2 bg-emerald-100 rounded" />
                  </div>
                  <div className="h-6 w-16 bg-emerald-100 rounded-lg" />
                </div>
                <div className="h-9 bg-slate-50 rounded-xl border border-slate-100" />
                <div className="space-y-2">
                  <div className="h-3.5 bg-slate-100 rounded w-full" />
                  <div className="h-3.5 bg-slate-100 rounded w-5/6" />
                </div>
                <div className="pt-3 border-t border-slate-100 flex justify-between">
                  <div className="h-4 w-32 bg-emerald-100 rounded" />
                  <div className="h-4 w-4 bg-emerald-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5: Resolutions Skeleton */}
        <section className="space-y-6 animate-pulse">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="space-y-2">
              <div className="h-7 w-56 bg-slate-200 rounded-xl" />
              <div className="h-4 w-52 bg-slate-100 rounded" />
            </div>
            <div className="h-4 w-28 bg-emerald-100 rounded" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-3 shadow-xs"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100/70 shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="h-3 w-16 bg-slate-100 rounded" />
                    <div className="h-4 w-3/4 bg-slate-200 rounded" />
                    <div className="h-3 w-1/2 bg-slate-100 rounded" />
                  </div>
                </div>
                <div className="w-12 h-8 bg-slate-100 rounded-lg shrink-0" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default function CouncilPage() {
  const { language } = useLanguage();
  const isMr = language === "mr";

  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<CouncilMember[]>([]);
  const [dbCommittees, setDbCommittees] = useState<StandingCommittee[]>([]);
  const [dbResolutions, setDbResolutions] = useState<CouncilResolution[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [liveMembers, liveCommittees, liveResolutions] = await Promise.all([
          getCouncilMembers({ active: true }),
          getCommittees({ isActive: true }),
          getResolutions({ isActive: true }),
        ]);

        const isChiefOfficer = (m: CouncilMember) => {
          const role = (m.roleCategory || "").toLowerCase();
          const desig = (m.designation || "").toLowerCase();
          return (
            role.includes("chief officer") ||
            role.includes("commissioner") ||
            role.includes("administrator") ||
            role === "officer" ||
            role === "co" ||
            desig.includes("chief officer") ||
            desig.includes("मुख्याधिकारी") ||
            desig.includes("administrator") ||
            desig.includes("प्रशासक") ||
            desig.includes("commissioner") ||
            desig.includes("आयुक्त")
          );
        };

        const filteredMembers = (liveMembers || []).filter((m) => !isChiefOfficer(m));
        setMembers(filteredMembers);
        setDbCommittees(liveCommittees || []);
        setDbResolutions(liveResolutions || []);
      } catch (err) {
        console.error("Failed to load council page data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const isPresident = (m: CouncilMember) =>
    m.roleCategory === "President" ||
    (m.designation?.toLowerCase().includes("president") &&
      !m.designation?.toLowerCase().includes("vice")) ||
    (m.designation?.toLowerCase().includes("नगराध्यक्ष") &&
      !m.designation?.toLowerCase().includes("उपनगराध्यक्ष"));

  const isVicePresident = (m: CouncilMember) =>
    m.roleCategory === "Vice President" ||
    m.designation?.toLowerCase().includes("vice president") ||
    m.designation?.toLowerCase().includes("vicepresident") ||
    m.designation?.toLowerCase().includes("उपनगराध्यक्ष");

  const isChairman = (m: CouncilMember) =>
    !isPresident(m) &&
    !isVicePresident(m) &&
    (m.designation?.toLowerCase().includes("chairman") ||
      m.designation?.toLowerCase().includes("chairperson") ||
      m.designation?.toLowerCase().includes("chair") ||
      m.designation?.toLowerCase().includes("सभापती") ||
      m.designation?.toLowerCase().includes("उपसभापती"));

  const president = members.find(isPresident);
  const vicePresident = members.find(isVicePresident);
  const chairmen = members.filter(isChairman);
  const corporators = members.filter(
    (m) => !isPresident(m) && !isVicePresident(m) && !isChairman(m)
  );

  const rawTenure = president?.tenure || "2024 - 2029";
  const tenure = isMr ? toMarathiDigits(rawTenure) : rawTenure;

  const displayCommittees = dbCommittees.map((comm) => ({
    id: comm.id,
    name: comm.name,
    marathiName: getCommitteeMarathiName(comm.name, comm.marathiName),
    chair: comm.chairman,
    membersCount: comm.memberIds?.length || 0,
    mandate: comm.description || "",
  }));

  if (loading) {
    return <CouncilSkeleton />;
  }

  return (
    <div className="pt-0 pb-16 bg-slate-50/50">
      {/* Header Banner */}
      <div className="relative bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white border-b border-emerald-800/40 py-12 sm:py-16 mb-12 overflow-hidden">
        {/* Decorative Background Glows */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-300/80 mb-4">
            <Link href="/" className="hover:text-white transition-colors">
              {isMr ? "मुख्यपृष्ठ" : "Home"}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-semibold">
              {isMr ? "लोकप्रतिनिधी व नगरसेवक" : "Elected Council"}
            </span>
          </div>

          <div className="max-w-4xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {isMr ? "लोकशाही व जनसेवा • लोकप्रतिनिधी" : "Democracy in Action • Public Service"}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mt-2">
              {isMr ? "निवडलेली नगरपरिषद व लोकप्रतिनिधी" : "Elected Council & Representatives"}
            </h1>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal pt-1 max-w-3xl">
              {isMr
                ? "लोणावळा शहरातील विविध प्रभागांचे प्रतिनिधित्व करणारे, विषय समित्यांचे नेतृत्व करणारे व शाश्वत नागरी विकासासाठी कटिबद्ध लोकप्रतिनिधी."
                : "Representing citizens across municipal wards, leading statutory subject committees, and driving sustainable civic development for Lonavala."}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* 1. Council Leadership: President & Vice President */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {isMr ? "नगरपरिषद नेतृत्व (नगराध्यक्ष व उपनगराध्यक्ष)" : "Council Leadership (President & Vice President)"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {isMr
                  ? "लोणावळा नगरपरिषदेचे प्रमुख लोकप्रतिनिधी"
                  : "Executive heads of Lonavala Municipal Council"}
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 hidden sm:inline-block">
              {isMr ? `कार्यकाळ ${tenure}` : `Tenure ${tenure}`}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* President Card */}
            {president && (
              <CouncilMemberTrigger member={president}>
                <div className="bg-white rounded-3xl border-2 border-emerald-600/60 p-6 sm:p-7 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/90 text-emerald-900 text-xs font-bold border border-emerald-200 shadow-2xs">
                        <Award className="w-3.5 h-3.5 text-emerald-700" />
                        <span>
                          {isMr
                            ? "नगराध्यक्ष"
                            : president.designation || "President (नगराध्यक्ष)"}
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-500 bg-slate-50 px-2.5 py-0.5 rounded-full border border-slate-200">
                        {isMr ? toMarathiDigits(president.tenure || rawTenure) : (president.tenure || rawTenure)}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
                      <div className="relative w-32 h-40 sm:w-36 sm:h-44 rounded-2xl overflow-hidden shadow-md shrink-0 border-2 border-white ring-1 ring-slate-200 bg-slate-100 group-hover:scale-102 transition-transform">
                        <MemberImage member={president} className="object-cover" />
                      </div>
                      <div className="space-y-1.5 text-center sm:text-left flex-1 min-w-0">
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                          {isMr && president.marathiName ? president.marathiName : president.name}
                        </h3>
                        {president.marathiName && (
                          <p className="text-sm text-emerald-700 font-semibold">
                            {isMr ? president.name : president.marathiName}
                          </p>
                        )}
                        <p className="text-xs text-slate-500 font-medium">
                          {president.committee || (isMr ? "स्थायी समिती सभापती" : "Standing Committee Chairperson")}
                        </p>

                        <div className="pt-3 text-xs text-slate-600 space-y-1.5">
                          {president.phone && (
                            <p className="flex items-center justify-center sm:justify-start gap-2">
                              <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <a href={`tel:${president.phone}`} className="font-semibold text-slate-700 hover:text-emerald-700 transition-colors">
                                {president.phone}
                              </a>
                            </p>
                          )}
                          {president.email && (
                            <p className="flex items-center justify-center sm:justify-start gap-2 truncate">
                              <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <a href={`mailto:${president.email}`} className="text-slate-600 hover:text-emerald-700 transition-colors truncate">
                                {president.email}
                              </a>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {president.message && (
                      <div className="mt-4 pt-3.5 border-t border-slate-100">
                        <p className="text-xs sm:text-sm text-slate-600 italic border-l-2 border-emerald-600 pl-3 leading-relaxed bg-slate-50/70 p-2.5 rounded-r-xl">
                          &ldquo;{president.message}&rdquo;
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CouncilMemberTrigger>
            )}

            {/* Vice President Card */}
            {vicePresident && (
              <CouncilMemberTrigger member={vicePresident}>
                <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs hover:border-emerald-600/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200 shadow-2xs">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                        <span>
                          {isMr
                            ? "उपनगराध्यक्ष"
                            : vicePresident.designation || "Vice President (उपनगराध्यक्ष)"}
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-500 bg-slate-50 px-2.5 py-0.5 rounded-full border border-slate-200">
                        {isMr ? toMarathiDigits(vicePresident.tenure || rawTenure) : (vicePresident.tenure || rawTenure)}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
                      <div className="relative w-32 h-40 sm:w-36 sm:h-44 rounded-2xl overflow-hidden shadow-md shrink-0 border-2 border-white ring-1 ring-slate-200 bg-slate-100 group-hover:scale-102 transition-transform">
                        <MemberImage member={vicePresident} className="object-cover" />
                      </div>
                      <div className="space-y-1.5 text-center sm:text-left flex-1 min-w-0">
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                          {isMr && vicePresident.marathiName ? vicePresident.marathiName : vicePresident.name}
                        </h3>
                        {vicePresident.marathiName && (
                          <p className="text-sm text-emerald-700 font-semibold">
                            {isMr ? vicePresident.name : vicePresident.marathiName}
                          </p>
                        )}
                        <p className="text-xs text-slate-500 font-medium">
                          {vicePresident.committee || (isMr ? "सार्वजनिक बांधकाम समिती" : "Public Works Committee")}
                        </p>

                        <div className="pt-3 text-xs text-slate-600 space-y-1.5">
                          {vicePresident.phone && (
                            <p className="flex items-center justify-center sm:justify-start gap-2">
                              <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <a href={`tel:${vicePresident.phone}`} className="font-semibold text-slate-700 hover:text-emerald-700 transition-colors">
                                {vicePresident.phone}
                              </a>
                            </p>
                          )}
                          {vicePresident.email && (
                            <p className="flex items-center justify-center sm:justify-start gap-2 truncate">
                              <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <a href={`mailto:${vicePresident.email}`} className="text-slate-600 hover:text-emerald-700 transition-colors truncate">
                                {vicePresident.email}
                              </a>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {vicePresident.message && (
                      <div className="mt-4 pt-3.5 border-t border-slate-100">
                        <p className="text-xs sm:text-sm text-slate-600 italic border-l-2 border-emerald-600 pl-3 leading-relaxed bg-slate-50/70 p-2.5 rounded-r-xl">
                          &ldquo;{vicePresident.message}&rdquo;
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CouncilMemberTrigger>
            )}

            {!president && !vicePresident && (
              <div className="col-span-full rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
                {isMr
                  ? "सध्या कोणतीही नगरपरिषद नेतृत्व माहिती उपलब्ध नाही."
                  : "No council leadership records are currently published."}
              </div>
            )}
          </div>
        </section>

        {/* 2. Committee Chairpersons (सभापती व उपसभापती) */}
        <section className="space-y-6">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {isMr ? "विषय समित्यांचे सभापती (सभापती व उपसभापती)" : "Committee Chairpersons"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {isMr
                  ? "महत्त्वाच्या वैधानिक विषय समित्यांचे नेतृत्व करणारे लोकप्रतिनिधी"
                  : "Elected committee leaders heading key municipal subject portfolios"}
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {isMr ? toMarathiDigits(chairmen.length) : chairmen.length} {isMr ? "सभापती" : chairmen.length === 1 ? "Chairperson" : "Chairpersons"}
            </span>
          </div>

          {chairmen.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {chairmen.map((chair) => {
                const displayName = isMr && chair.marathiName ? chair.marathiName : chair.name;
                const subName = isMr && chair.marathiName ? chair.name : chair.marathiName;

                return (
                  <CouncilMemberTrigger key={chair.id} member={chair}>
                    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-emerald-600/50 hover:shadow-lg transition-all flex flex-col justify-between group">
                      <div className="space-y-4">
                        {/* Header badge */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 truncate">
                            {chair.committee || (isMr ? "समिती सभापती" : "Committee Chairperson")}
                          </span>
                          {chair.ward && (
                            <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">
                              {chair.ward}
                            </span>
                          )}
                        </div>

                        {/* Member details */}
                        <div className="flex items-center gap-4">
                          <div className="relative w-16 h-20 rounded-xl overflow-hidden shadow-sm shrink-0 border border-slate-200 bg-slate-100 group-hover:scale-105 transition-transform">
                            <MemberImage member={chair} className="object-cover" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-base text-slate-900 group-hover:text-emerald-800 transition-colors leading-snug">
                              {displayName}
                            </h4>
                            {subName && (
                              <p className="text-xs text-emerald-700 font-semibold">
                                {subName}
                              </p>
                            )}
                            <p className="text-[11px] text-slate-500 font-medium line-clamp-1 mt-0.5">
                              {chair.designation || (isMr ? "समिती सभापती" : "Chairperson")}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Contact Footer */}
                      <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                        {chair.phone && (
                          <p className="flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                            <a href={`tel:${chair.phone}`} className="hover:text-emerald-700 font-medium">
                              {chair.phone}
                            </a>
                          </p>
                        )}
                        {chair.email && (
                          <p className="flex items-center gap-1.5 truncate">
                            <Mail className="w-3 h-3 text-emerald-600 shrink-0" />
                            <a href={`mailto:${chair.email}`} className="hover:text-emerald-700 truncate">
                              {chair.email}
                            </a>
                          </p>
                        )}
                      </div>
                    </div>
                  </CouncilMemberTrigger>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
              {isMr
                ? "सध्या कोणतेही समिती सभापती उपलब्ध नाहीत."
                : "No committee chairpersons are currently listed."}
            </div>
          )}
        </section>

        {/* 3. Ward Corporators (नगरसेवक व नगरसेविका) */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {isMr ? "प्रभाग नगरसेवक व नगरसेविका (Ward Corporators)" : "Ward Corporators"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {isMr
                  ? "विविध प्रभागांतील नागरिकांची सेवा करणारे स्थानिक लोकप्रतिनिधी"
                  : "Elected grassroots representatives serving citizens across municipal wards"}
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {isMr ? toMarathiDigits(corporators.length) : corporators.length} {isMr ? "नगरसेवक" : corporators.length === 1 ? "Corporator" : "Corporators"}
            </span>
          </div>

          <WardCorporators corporators={corporators} />
        </section>

        {/* 4. Committees */}
        <section className="space-y-6">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {isMr ? "वैधानिक विषय समित्या (Committees)" : "Statutory Committees"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {isMr
                  ? "महाराष्ट्र नगरपरिषद अधिनियमांतर्गत गठीत वैधानिक समित्या व कार्यकक्षा"
                  : "Statutory committees designated under the Maharashtra Municipal Councils Act"}
              </p>
            </div>
            {displayCommittees.length > 0 && (
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                {isMr ? toMarathiDigits(displayCommittees.length) : displayCommittees.length} {isMr ? "समित्या" : displayCommittees.length === 1 ? "Committee" : "Committees"}
              </span>
            )}
          </div>

          {displayCommittees.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayCommittees.map((comm) => {
                const title = isMr && comm.marathiName ? comm.marathiName : comm.name;
                const subTitle = isMr && comm.marathiName ? comm.name : comm.marathiName;

                const CardContent = (
                  <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs hover:border-emerald-600/50 hover:shadow-lg transition-all space-y-3.5 h-full flex flex-col justify-between group">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-800 transition-colors">
                            {title}
                          </h3>
                          {subTitle && (
                            <p className="text-xs text-emerald-700 font-semibold mt-0.5">
                              {subTitle}
                            </p>
                          )}
                        </div>
                        <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 shrink-0">
                          {isMr ? toMarathiDigits(comm.membersCount) : comm.membersCount} {isMr ? "सदस्य" : comm.membersCount === 1 ? "Member" : "Members"}
                        </span>
                      </div>

                      {comm.chair && (
                        <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-2">
                          <Award className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">
                            <strong>{isMr ? "सभापती:" : "Chairperson:"}</strong>{" "}
                            {isMr && comm.chair.marathiName ? comm.chair.marathiName : comm.chair.name}
                          </span>
                        </div>
                      )}

                      {comm.mandate && (
                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                          {comm.mandate}
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:text-emerald-800">
                      <span>{isMr ? "समिती व सदस्य पहा" : "View Committee & Members"}</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                );

                return (
                  <Link key={comm.id} href={`/council/committees/${comm.id}`} className="block h-full">
                    {CardContent}
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
              {isMr
                ? "सध्या कोणत्याही वैधानिक समित्या प्रसिद्ध नाहीत."
                : "No statutory committees are currently published."}
            </div>
          )}
        </section>

        {/* 5. Council Documents & Resolutions */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {isMr ? "नगरपरिषद ठराव व इतिवृत्त (Council Resolutions)" : "Council Resolutions"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {isMr
                  ? "सर्वसाधारण सभा इतिवृत्त आणि अधिकृत नगरपरिषद ठरावांची नोंद"
                  : "Official records of General Body meetings and municipal resolutions"}
              </p>
            </div>
            <Link href="/downloads" className="text-xs font-bold text-emerald-800 hover:underline">
              {isMr ? "सर्व कागदपत्रे पहा →" : "View All Documents →"}
            </Link>
          </div>

          {dbResolutions.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {dbResolutions.slice(0, 4).map((res) => {
                const formattedDate = res.resolutionDate
                  ? new Date(res.resolutionDate).toLocaleDateString(isMr ? "mr-IN" : "en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : null;

                const resTitle = translateResolutionTitle(res.title, res.marathiTitle, isMr);
                const resSubTitle = isMr
                  ? (res.marathiTitle ? res.title : (res.title !== resTitle ? res.title : null))
                  : res.marathiTitle;
                const meetingTypeLabel = getMeetingTypeLabel(res.meetingType, isMr);
                const durationFromStr = isMr ? toMarathiDigits(res.durationFrom) : res.durationFrom;
                const durationToStr = isMr ? toMarathiDigits(res.durationTo) : res.durationTo;

                return (
                  <div
                    key={res.id}
                    className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-3 shadow-xs hover:border-emerald-600/50 transition-all group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700 shrink-0 border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        {res.resolutionNumber && (
                          <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 mb-0.5">
                            {isMr ? `ठराव क्र. ${toMarathiDigits(res.resolutionNumber)}` : `Res. No. ${res.resolutionNumber}`}
                          </span>
                        )}
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-emerald-800 transition-colors">
                          {resTitle}
                        </h4>
                        {resSubTitle && (
                          <p className="text-[11px] text-slate-500 line-clamp-1 font-marathi">
                            {resSubTitle}
                          </p>
                        )}
                        <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-2 mt-1">
                          {formattedDate && <span>{formattedDate}</span>}
                          {formattedDate && meetingTypeLabel && <span>•</span>}
                          {meetingTypeLabel && (
                            <span className="text-emerald-800 font-medium">
                              {meetingTypeLabel}
                            </span>
                          )}
                          {(res.durationFrom || res.durationTo) && (
                            <>
                              <span>•</span>
                              <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[10px] border border-emerald-200/80">
                                {isMr ? "कालावधी:" : "Duration:"} {durationFromStr || "—"} - {durationToStr || "—"}
                              </span>
                            </>
                          )}
                          {res.fileSize && <span>•</span>}
                          {res.fileSize && <span>{res.fileSize}</span>}
                        </div>
                      </div>
                    </div>

                    {res.fileUrl ? (
                      <a
                        href={res.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-700 hover:text-white rounded-lg text-xs font-semibold text-slate-700 transition-colors shrink-0 flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{isMr ? "डाउनलोड" : "PDF"}</span>
                      </a>
                    ) : (
                      <span className="px-3 py-1.5 bg-slate-50 text-slate-400 rounded-lg text-xs font-semibold shrink-0">
                        {isMr ? "प्रतीक्षेत" : "Pending"}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
              {isMr
                ? "सध्या कोणतेही नगरपरिषद ठराव प्रसिद्ध नाहीत."
                : "No council resolutions are currently published."}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

