"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import {
  CalendarDays,
  Mail,
  MapPin,
  Phone,
  X,
  Award,
  ShieldCheck,
  Quote,
  Building,
  UserCheck,
  PhoneCall,
  MailCheck,
} from "lucide-react";
import { CouncilMember } from "@/types";
import { useLanguage } from "@/context/LanguageContext";

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function toMarathiDigits(str: string | number | undefined | null): string {
  if (str === undefined || str === null) return "";
  const s = String(str);
  const marathiDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
  return s.replace(/[0-9]/g, (w) => marathiDigits[+w]);
}

const ROLE_CATEGORY_MARATHI_MAP: Record<string, string> = {
  president: "नगराध्यक्ष",
  "vice president": "उपनगराध्यक्ष",
  vicepresident: "उपनगराध्यक्ष",
  corporator: "प्रभाग नगरसेवक",
  councillor: "प्रभाग नगरसेवक",
  chairman: "समिती सभापती",
  chairperson: "समिती सभापती",
  "leader of opposition": "विरोधी पक्षनेते",
  "opposition leader": "विरोधी पक्षनेते",
  "group leader": "गटनेते",
  "co-opted member": "स्वीकृत नगरसेवक",
  "co-opted councillor": "स्वीकृत नगरसेवक",
  "nominated member": "स्वीकृत नगरसेवक",
  "council member": "नगरपरिषद सदस्य",
  "elected member": "लोकप्रतिनिधी",
};

export function translateRoleCategory(role: string | undefined | null, isMr: boolean): string {
  if (!role) return isMr ? "लोकप्रतिनिधी" : "Elected Representative";
  if (!isMr) return role;
  const lower = role.toLowerCase().trim();
  return ROLE_CATEGORY_MARATHI_MAP[lower] || role;
}

const DESIGNATION_MARATHI_MAP: Record<string, string> = {
  president: "नगराध्यक्ष",
  "vice president": "उपनगराध्यक्ष",
  vicepresident: "उपनगराध्यक्ष",
  councillor: "नगरसेवक",
  "municipal councillor": "नगरसेवक",
  corporator: "नगरसेवक",
  "ward corporator": "प्रभाग नगरसेवक",
  "ward councillor": "प्रभाग नगरसेवक",
  "standing committee chairman": "स्थायी समिती सभापती",
  "standing committee chairperson": "स्थायी समिती सभापती",
  "public works committee chairman": "सार्वजनिक बांधकाम समिती सभापती",
  "water supply committee chairman": "पाणीपुरवठा समिती सभापती",
  "health committee chairman": "आरोग्य समिती सभापती",
  "education committee chairman": "शिक्षण समिती सभापती",
  "women & child welfare committee chairman": "महिला व बालकल्याण समिती सभापती",
  "leader of opposition": "विरोधी पक्षनेते",
  "opposition leader": "विरोधी पक्षनेते",
  "group leader": "गटनेते",
  "co-opted member": "स्वीकृत नगरसेवक",
  "co-opted councillor": "स्वीकृत नगरसेवक",
  "nominated member": "स्वीकृत नगरसेवक",
  member: "सदस्य",
  "committee member": "समिती सदस्य",
};

export function translateDesignation(designation: string | undefined | null, isMr: boolean): string {
  if (!designation) return isMr ? "नगरसेवक" : "Municipal Councillor";
  if (!isMr) return designation;
  const lower = designation.toLowerCase().trim();
  if (DESIGNATION_MARATHI_MAP[lower]) return DESIGNATION_MARATHI_MAP[lower];

  // Regex replacement for combinations
  let translated = designation;
  translated = translated.replace(/Ward Councillor|Ward Corporator/gi, "प्रभाग नगरसेवक");
  translated = translated.replace(/Councillor|Corporator/gi, "नगरसेवक");
  translated = translated.replace(/President/gi, "नगराध्यक्ष");
  translated = translated.replace(/Vice-President|Vice President/gi, "उपनगराध्यक्ष");
  translated = translated.replace(/Chairman|Chairperson/gi, "सभापती");
  translated = translated.replace(/Member/gi, "सदस्य");
  return translated;
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

export function translateCommitteeName(name: string | undefined | null, isMr: boolean): string {
  if (!name) return "";
  if (!isMr) return name;
  const lower = name.toLowerCase().trim();
  return COMMITTEE_MARATHI_MAP[lower] || name;
}

export function translateWard(ward: string | undefined | null, isMr: boolean): string {
  if (!ward) return isMr ? "लोणावळा नगरपरिषद" : "Lonavala Municipal Council";
  if (!isMr) return ward;

  let formatted = ward;
  formatted = formatted.replace(/Ward No\.\s*(\d+)/gi, (_, n) => `प्रभाग क्र. ${toMarathiDigits(n)}`);
  formatted = formatted.replace(/Ward\s*(\d+)/gi, (_, n) => `प्रभाग ${toMarathiDigits(n)}`);
  formatted = formatted.replace(/Prabhag\s*(\d+)/gi, (_, n) => `प्रभाग ${toMarathiDigits(n)}`);
  formatted = formatted.replace(/LMC Council|Lonavala Municipal Council/gi, "लोणावळा नगरपरिषद");

  return toMarathiDigits(formatted);
}

function MemberImage({ member, className }: { member: CouncilMember; className: string }) {
  return member.image ? (
    <Image
      src={member.image}
      alt={member.name}
      fill
      className={className}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px"
    />
  ) : (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-100 via-teal-50 to-emerald-200 text-5xl font-extrabold text-emerald-900">
      {getInitials(member.name)}
    </div>
  );
}

export function CouncilMemberDialog({
  member,
  onClose,
}: {
  member: CouncilMember;
  onClose: () => void;
}) {
  const { language } = useLanguage();
  const isMr = language === "mr";

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const displayName = isMr && member.marathiName ? member.marathiName : member.name;
  const secondaryName = isMr && member.marathiName ? member.name : member.marathiName;
  const roleLabel = translateRoleCategory(member.roleCategory, isMr);
  const designationLabel = translateDesignation(member.designation, isMr);
  const wardLabel = translateWard(member.ward, isMr);
  const committeeLabel = translateCommitteeName(member.committee, isMr);
  const tenureLabel = member.tenure ? (isMr ? toMarathiDigits(member.tenure) : member.tenure) : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 sm:p-6 backdrop-blur-md animate-fade-in"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-2xl border border-white/20 flex flex-col sm:flex-row animate-scale-up"
        role="dialog"
        aria-modal="true"
        aria-labelledby="council-member-dialog-title"
      >
        {/* Floating Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label={isMr ? "माहिती बंद करा" : "Close council member details"}
          className="absolute right-4 top-4 z-30 rounded-full bg-white/90 p-2 text-slate-600 shadow-md backdrop-blur-xs transition-all hover:bg-red-50 hover:text-red-600 hover:scale-105 active:scale-95"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Left Column: Member Photo */}
        <div className="relative w-full sm:w-80 bg-slate-50 border-b sm:border-b-0 sm:border-r border-slate-100 shrink-0 flex flex-col items-center justify-center p-6 sm:p-8">
          <div className="relative w-56 h-72 sm:w-64 sm:h-84 rounded-2xl overflow-hidden shadow-lg border-4 border-white ring-1 ring-slate-200/80 bg-white group">
            <MemberImage member={member} className="object-cover object-top" />
          </div>

          <div className="mt-3.5 text-center">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100/90 text-emerald-800 text-xs font-bold px-3.5 py-1 border border-emerald-200 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>{roleLabel}</span>
            </span>
          </div>
        </div>

        {/* Right Column: Member Details Content */}
        <div className="flex-1 p-6 sm:p-8 overflow-y-auto max-h-[65vh] sm:max-h-[85vh] space-y-5">
          {/* Header & Badges */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
                <Building className="w-3 h-3" />
                <span>{wardLabel}</span>
              </span>

              {member.roleCategory && member.roleCategory !== "Corporator" && (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800">
                  <Award className="w-3 h-3" />
                  <span>{roleLabel}</span>
                </span>
              )}
            </div>

            <h3
              id="council-member-dialog-title"
              className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight"
            >
              {displayName}
            </h3>

            {secondaryName && (
              <p className="text-sm sm:text-base font-semibold text-emerald-700 mt-0.5">
                {secondaryName}
              </p>
            )}

            <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{designationLabel}</span>
            </p>
          </div>

          {/* Contact & Detail Cards */}
          <div className="grid grid-cols-1 gap-2.5 pt-2 border-t border-slate-100">
            {tenureLabel && (
              <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-emerald-700 shadow-2xs shrink-0">
                  <CalendarDays className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    {isMr ? "कार्यकाळ" : "Tenure Period"}
                  </span>
                  <span className="font-bold text-slate-800">{tenureLabel}</span>
                </div>
              </div>
            )}

            {member.phone && (
              <a
                href={`tel:${member.phone}`}
                className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 hover:bg-emerald-50/80 border border-slate-100 hover:border-emerald-200 text-xs text-slate-700 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white shadow-2xs shrink-0 transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                      {isMr ? "अधिकृत संपर्क" : "Official Contact"}
                    </span>
                    <span className="font-bold text-slate-900 group-hover:text-emerald-800">
                      {member.phone}
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px] group-hover:bg-emerald-700 transition-colors flex items-center gap-1">
                  <PhoneCall className="w-3 h-3" />
                  {isMr ? "कॉल करा" : "Call"}
                </span>
              </a>
            )}

            {member.email && (
              <a
                href={`mailto:${member.email}`}
                className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 hover:bg-emerald-50/80 border border-slate-100 hover:border-emerald-200 text-xs text-slate-700 transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white shadow-2xs shrink-0 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                      {isMr ? "ईमेल पत्ता" : "Email Address"}
                    </span>
                    <span className="font-bold text-slate-900 group-hover:text-emerald-800 truncate block">
                      {member.email}
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-slate-200 text-slate-700 font-bold text-[11px] group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0 flex items-center gap-1">
                  <MailCheck className="w-3 h-3" />
                  {isMr ? "ईमेल पाठवा" : "Email"}
                </span>
              </a>
            )}

            {member.address && (
              <div className="flex items-start gap-3 p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-emerald-700 shadow-2xs shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    {isMr ? "प्रभाग कार्यालय / पत्ता" : "Ward Office / Address"}
                  </span>
                  <span className="font-medium text-slate-800 leading-relaxed">
                    {member.address}
                  </span>
                </div>
              </div>
            )}

            {committeeLabel && (
              <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-emerald-700 shadow-2xs shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    {isMr ? "समिती पदभार" : "Committee Charge"}
                  </span>
                  <span className="font-bold text-emerald-800">{committeeLabel}</span>
                </div>
              </div>
            )}
          </div>

          {/* Member Message / Quote */}
          {member.message && (
            <div className="relative p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-slate-700">
              <Quote className="w-5 h-5 text-emerald-400 mb-1 opacity-60" />
              <p className="text-xs sm:text-sm italic leading-relaxed text-slate-700">
                &ldquo;{member.message}&rdquo;
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function CouncilMemberTrigger({
  member,
  children,
}: {
  member: CouncilMember;
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const openOnKeyboard = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setIsOpen(true);
    }
  };

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={(event) => {
          const target = event.target as HTMLElement;
          if (!target.closest("a, button")) setIsOpen(true);
        }}
        onKeyDown={openOnKeyboard}
        aria-label={`View details for ${member.name}`}
        className="cursor-pointer rounded-3xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
      >
        {children}
      </div>
      {isOpen && <CouncilMemberDialog member={member} onClose={() => setIsOpen(false)} />}
    </>
  );
}

export function WardCorporators({ corporators }: { corporators: CouncilMember[] }) {
  const [selectedMember, setSelectedMember] = useState<CouncilMember | null>(null);
  const { language } = useLanguage();
  const isMr = language === "mr";

  return (
    <>
      {corporators.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {corporators.map((corp) => {
            const displayName = isMr && corp.marathiName ? corp.marathiName : corp.name;
            const subName = isMr && corp.marathiName ? corp.name : corp.marathiName;
            const wardLabel = translateWard(corp.ward, isMr);
            const designationLabel = translateDesignation(corp.designation, isMr);

            return (
              <button
                key={corp.id}
                type="button"
                onClick={() => setSelectedMember(corp)}
                className="group flex min-h-[370px] cursor-pointer flex-col items-center justify-between rounded-3xl border border-slate-200/90 bg-white p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-emerald-600/50 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
                aria-label={`View details for ${corp.name}`}
              >
                <div className="w-full">
                  <div className="relative mx-auto mb-5 h-36 w-36 overflow-hidden rounded-full border-4 border-emerald-100 bg-slate-100 shadow-md transition-transform duration-300 group-hover:scale-105">
                    <MemberImage member={corp} className="object-cover object-top" />
                  </div>
                  <span className="inline-flex max-w-full rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
                    <span className="truncate">{wardLabel}</span>
                  </span>
                  <h4 className="mt-3 text-lg font-bold leading-snug text-slate-900 transition-colors group-hover:text-emerald-800">
                    {displayName}
                  </h4>
                  {subName && (
                    <p className="mt-1 text-xs font-semibold text-emerald-700">{subName}</p>
                  )}
                  <p className="mt-2 text-sm font-medium text-slate-500">
                    {designationLabel}
                  </p>
                </div>
                <span className="mt-5 border-t border-slate-100 pt-4 text-xs font-bold text-emerald-700 group-hover:text-emerald-800">
                  {isMr ? "तपशील पहा →" : "View councillor details →"}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          {isMr
            ? "सध्या कोणतेही प्रभाग नगरसेवक उपलब्ध नाहीत."
            : "No active ward representatives are currently listed."}
        </div>
      )}

      {selectedMember && (
        <CouncilMemberDialog member={selectedMember} onClose={() => setSelectedMember(null)} />
      )}
    </>
  );
}

