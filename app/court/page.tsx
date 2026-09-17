"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Scale,
  Gavel,
  Users,
  Building2,
  FileText,
  Download,
  Phone,
  Mail,
  Calendar,
  Clock,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  MapPin,
  ExternalLink,
  ChevronRight,
  BookOpen,
  Briefcase,
  HelpCircle,
  FileCheck,
} from "lucide-react";
import {
  COURT_COMMITTEE_MEMBERS,
  PANEL_ADVOCATES,
  COURT_CASES_DATA,
  LOK_ADALAT_EVENTS,
  LEGAL_DOCUMENTS,
} from "@/data/courtData";
import { SearchBar } from "@/components/shared/SearchBar";

export default function CourtPage() {
  const [activeTab, setActiveTab] = useState<
    "committee" | "advocates" | "cases" | "lok-adalat" | "documents"
  >("committee");

  const [searchQuery, setSearchQuery] = useState("");
  const [caseFilter, setCaseFilter] = useState("All");
  const [memberCategoryFilter, setMemberCategoryFilter] = useState<
    "All" | "Leadership" | "Elected Corporator" | "Legal Officer" | "Legal Aid & Conciliation"
  >("All");

  const caseTypes = [
    "All",
    "Writ Petition",
    "NGT Matter",
    "Civil Suit",
    "Public Interest Litigation",
    "Revenue Appeal",
  ];

  const memberCategories = [
    { label: "All Members", value: "All" },
    { label: "Leadership & Advisory", value: "Leadership" },
    { label: "Elected Corporators", value: "Elected Corporator" },
    { label: "Legal Officers & Staff", value: "Legal Officer" },
    { label: "Lok Adalat & Legal Aid", value: "Legal Aid & Conciliation" },
  ];

  const filteredCases = COURT_CASES_DATA.filter((item) => {
    const matchesFilter =
      caseFilter === "All" || item.caseType === caseFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      item.title.toLowerCase().includes(q) ||
      item.caseNumber.toLowerCase().includes(q) ||
      item.cnrNumber.toLowerCase().includes(q) ||
      item.court.toLowerCase().includes(q) ||
      item.advocateAssigned.toLowerCase().includes(q) ||
      item.subject.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const filteredAdvocates = PANEL_ADVOCATES.filter((adv) => {
    const q = searchQuery.toLowerCase();
    return (
      adv.name.toLowerCase().includes(q) ||
      adv.courtForum.toLowerCase().includes(q) ||
      adv.specialization.toLowerCase().includes(q) ||
      adv.designation.toLowerCase().includes(q)
    );
  });

  const filteredMembers = COURT_COMMITTEE_MEMBERS.filter((m) => {
    const matchesCategory =
      memberCategoryFilter === "All" || m.category === memberCategoryFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      m.name.toLowerCase().includes(q) ||
      m.role.toLowerCase().includes(q) ||
      m.designation.toLowerCase().includes(q) ||
      (m.ward && m.ward.toLowerCase().includes(q)) ||
      (m.category && m.category.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  const filteredDocs = LEGAL_DOCUMENTS.filter((doc) => {
    const q = searchQuery.toLowerCase();
    return (
      doc.title.toLowerCase().includes(q) ||
      doc.category.toLowerCase().includes(q) ||
      doc.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Header Banner */}
      <div className="relative bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white border-b border-emerald-800/40 overflow-hidden">
        {/* Decorative Background Glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-300/80 mb-4">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-semibold">Court & Legal Cell</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-bold tracking-wide">
                <Scale className="w-3.5 h-3.5 text-emerald-400" />
                <span>Legal Affairs & Judicial Cell • विधी व न्यायालयीन विभाग</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
                Court & Legal Committee
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-light">
                Statutory oversight of municipal litigations, empanelled legal counsel, High Court & District Court proceedings, Lok Adalat citizen conciliation, and civic legal advisory for Lonavala Municipal Council.
              </p>
            </div>

            {/* Quick Action Badges */}
            <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
              <button
                onClick={() => {
                  setActiveTab("lok-adalat");
                  const el = document.getElementById("content-section");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/40 hover:scale-[1.02] active:scale-95 transition-all"
              >
                <Gavel className="w-4 h-4 text-emerald-200" />
                <span>Lok Adalat Settlement</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab("documents");
                  const el = document.getElementById("content-section");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-bold backdrop-blur-md hover:scale-[1.02] active:scale-95 transition-all"
              >
                <FileText className="w-4 h-4 text-emerald-300" />
                <span>Legal Downloads</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-8 border-t border-white/10">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 border border-white/10">
              <div className="text-2xl sm:text-3xl font-black text-white">
                {COURT_COMMITTEE_MEMBERS.length}
              </div>
              <div className="text-xs font-semibold text-emerald-300 mt-0.5">
                Committee & Legal Staff
              </div>
              <div className="text-[11px] text-slate-400">विधी समिती व अधिकारी</div>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 border border-white/10">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">
                {PANEL_ADVOCATES.length}
              </div>
              <div className="text-xs font-semibold text-emerald-300 mt-0.5">
                Panel Advocates
              </div>
              <div className="text-[11px] text-slate-400">मान्यताप्राप्त विधीज्ञ</div>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 border border-white/10">
              <div className="text-2xl sm:text-3xl font-black text-amber-400">150+</div>
              <div className="text-xs font-semibold text-emerald-300 mt-0.5">
                Lok Adalat Cases Settled
              </div>
              <div className="text-[11px] text-slate-400">तडजोडीने निकाली प्रकरणे</div>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 border border-white/10">
              <div className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Next Lok Adalat
              </div>
              <div className="text-sm sm:text-base font-bold text-white mt-1">
                14 Nov 2026
              </div>
              <div className="text-[11px] text-slate-400">LMC Headquarters</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Section */}
      <div id="content-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200">
          <button
            onClick={() => setActiveTab("committee")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === "committee"
                ? "bg-emerald-700 text-white shadow-md shadow-emerald-700/20"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Court Committee Members (समिती सदस्य)</span>
          </button>
          <button
            onClick={() => setActiveTab("advocates")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === "advocates"
                ? "bg-emerald-700 text-white shadow-md shadow-emerald-700/20"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Panel Advocates (मान्यताप्राप्त वकील)</span>
          </button>
          <button
            onClick={() => setActiveTab("cases")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === "cases"
                ? "bg-emerald-700 text-white shadow-md shadow-emerald-700/20"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>Court Cases & Cause List (खटले व सुनावणी)</span>
          </button>
          <button
            onClick={() => setActiveTab("lok-adalat")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === "lok-adalat"
                ? "bg-emerald-700 text-white shadow-md shadow-emerald-700/20"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Gavel className="w-4 h-4" />
            <span>Lok Adalat & Legal Aid (लोक अदालत)</span>
          </button>
          <button
            onClick={() => setActiveTab("documents")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === "documents"
                ? "bg-emerald-700 text-white shadow-md shadow-emerald-700/20"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Acts & Forms (कायदे व नमुने)</span>
          </button>
        </div>

        {/* 1. COMMITTEE MEMBERS TAB */}
        {activeTab === "committee" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Legal & Court Affairs Standing Committee
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    विधी व न्याय स्थायी समिती व विधी विभाग कर्मचारी - लोणावळा नगरपरिषद
                  </p>
                </div>
                <div className="w-full sm:w-72">
                  <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search member, ward or role..."
                  />
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" /> Category:
                </span>
                {memberCategories.map((cat) => {
                  const count =
                    cat.value === "All"
                      ? COURT_COMMITTEE_MEMBERS.length
                      : COURT_COMMITTEE_MEMBERS.filter((m) => m.category === cat.value).length;
                  const isSelected = memberCategoryFilter === cat.value;
                  return (
                    <button
                      key={cat.value}
                      onClick={() => setMemberCategoryFilter(cat.value as any)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        isSelected
                          ? "bg-emerald-700 text-white shadow-xs"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                          isSelected ? "bg-white/20 text-white font-bold" : "bg-white text-slate-600 border border-slate-200"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Chairman Highlight Card (shown if Chairman is in the filtered list) */}
            {filteredMembers.some((m) => m.role === "Chairman") && searchQuery === "" && (
              (() => {
                const chairman = filteredMembers.find((m) => m.role === "Chairman")!;
                return (
                  <div className="bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/50 rounded-3xl border-2 border-emerald-600/60 p-6 sm:p-8 shadow-md hover:shadow-lg transition-all">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 mb-6 border-b border-emerald-100">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-700 text-white text-xs font-bold shadow-xs">
                          <Scale className="w-3.5 h-3.5" />
                          <span>Committee Chairman (सभापती)</span>
                        </span>
                        <span className="text-xs font-semibold text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-full border border-emerald-200">
                          {chairman.ward}
                        </span>
                      </div>
                      <span className="text-xs font-medium text-slate-500">
                        Tenure 2022 - 2027
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6 items-start">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-emerald-700 to-teal-800 text-white flex items-center justify-center font-black text-2xl shadow-md shrink-0 border-2 border-white ring-1 ring-emerald-300">
                        RD
                      </div>
                      <div className="space-y-2 flex-1">
                        <h3 className="text-2xl font-black text-slate-900">
                          {chairman.name}
                        </h3>
                        <p className="text-sm font-bold text-emerald-700">
                          {chairman.marathiName}
                        </p>
                        <p className="text-xs text-slate-600 font-medium">
                          {chairman.designation}
                        </p>
                        {chairman.experience && (
                          <p className="text-xs font-semibold text-slate-500 bg-slate-100 inline-block px-2.5 py-1 rounded-lg">
                            {chairman.experience}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-600">
                          <a
                            href={`tel:${chairman.phone}`}
                            className="flex items-center gap-1.5 font-semibold text-slate-700 hover:text-emerald-700 transition-colors"
                          >
                            <Phone className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{chairman.phone}</span>
                          </a>
                          <a
                            href={`mailto:${chairman.email}`}
                            className="flex items-center gap-1.5 text-slate-600 hover:text-emerald-700 transition-colors"
                          >
                            <Mail className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{chairman.email}</span>
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-5 border-t border-emerald-100">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-2.5">
                        Core Committee Mandates & Portfolio:
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {chairman.responsibilities.map((resp, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2 text-xs text-slate-700 bg-white/80 p-2.5 rounded-xl border border-emerald-100"
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{resp}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()
            )}

            {/* Committee Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredMembers
                .filter((m) =>
                  searchQuery === "" && filteredMembers.some((x) => x.role === "Chairman")
                    ? m.role !== "Chairman"
                    : true
                )
                .map((member) => (
                  <div
                    key={member.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          {member.role}
                        </span>
                        {member.ward && (
                          <span className="text-[10px] text-slate-500 font-medium truncate max-w-[150px]">
                            {member.ward}
                          </span>
                        )}
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                          {member.name
                            .split(" ")
                            .slice(1, 3)
                            .map((p) => p[0])
                            .join("")}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-bold text-slate-900 leading-tight truncate">
                            {member.name}
                          </h4>
                          <p className="text-xs font-semibold text-emerald-700 truncate">
                            {member.marathiName}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                            {member.designation}
                          </p>
                        </div>
                      </div>

                      {member.experience && (
                        <div className="text-[10px] font-semibold text-slate-500 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                          {member.experience}
                        </div>
                      )}

                      {member.responsibilities && (
                        <div className="pt-1 space-y-1">
                          {member.responsibilities.slice(0, 2).map((r, rIdx) => (
                            <div
                              key={rIdx}
                              className="text-[11px] text-slate-600 flex items-start gap-1.5"
                            >
                              <span className="text-emerald-600 font-bold">•</span>
                              <span className="line-clamp-2">{r}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                      <a
                        href={`tel:${member.phone}`}
                        className="flex items-center gap-1 font-semibold text-slate-700 hover:text-emerald-700 text-[11px]"
                      >
                        <Phone className="w-3 h-3 text-emerald-600" />
                        <span>{member.phone}</span>
                      </a>
                      <a
                        href={`mailto:${member.email}`}
                        className="flex items-center gap-1 text-slate-500 hover:text-emerald-700 text-[11px] truncate max-w-[130px]"
                      >
                        <Mail className="w-3 h-3 text-emerald-600" />
                        <span>{member.email}</span>
                      </a>
                    </div>
                  </div>
                ))}
            </div>

            {filteredMembers.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6">
                <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-800">No committee members found</h4>
                <p className="text-xs text-slate-500 mt-1">Try resetting the search query or category filter.</p>
              </div>
            )}
          </div>
        )}

        {/* 2. PANEL ADVOCATES TAB */}
        {activeTab === "advocates" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Empanelled Legal Counsel & Advocates
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  लोणावळा नगरपरिषद पॅनेल विधीज्ञ व कायदेशीर सल्लागार
                </p>
              </div>
              <div className="w-full sm:w-72">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search advocate by name or court..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredAdvocates.map((adv) => (
                <div
                  key={adv.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-[11px] font-bold border border-slate-200">
                        <Scale className="w-3 h-3 text-emerald-600" />
                        <span>{adv.courtForum}</span>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        {adv.experience} Exp.
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {adv.name}
                      </h3>
                      <p className="text-xs font-semibold text-emerald-700">
                        {adv.marathiName}
                      </p>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">
                        {adv.designation}
                      </p>
                    </div>

                    <div className="space-y-2 bg-slate-50/80 p-3 rounded-xl border border-slate-100 text-xs">
                      <div>
                        <span className="text-slate-500">Bar Council Reg: </span>
                        <strong className="text-slate-800 font-semibold">{adv.barRegNo}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500">Specialization: </span>
                        <span className="text-slate-700 font-medium">{adv.specialization}</span>
                      </div>
                      <div className="flex items-start gap-1 text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                        <MapPin className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{adv.officeAddress}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <a
                      href={`tel:${adv.phone}`}
                      className="flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-800"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{adv.phone}</span>
                    </a>
                    <a
                      href={`mailto:${adv.email}`}
                      className="flex items-center gap-1 text-slate-500 hover:text-emerald-700 text-[11px]"
                    >
                      <Mail className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{adv.email}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. COURT CASES & CAUSE LIST TAB */}
        {activeTab === "cases" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Municipal Judicial Matters & Cause List
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    न्यायालयीन प्रकरणे, याचिका व सुनावणी तपशील
                  </p>
                </div>
                <div className="w-full sm:w-72">
                  <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search by case no, court, subject..."
                  />
                </div>
              </div>

              {/* Case Type Filters */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" /> Filter Forum:
                </span>
                {caseTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setCaseFilter(type)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                      caseFilter === type
                        ? "bg-emerald-700 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Cases List */}
            {filteredCases.length > 0 ? (
              <div className="space-y-4">
                {filteredCases.map((caseItem) => (
                  <div
                    key={caseItem.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-white text-xs font-mono font-bold">
                          {caseItem.caseNumber}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">
                          CNR: {caseItem.cnrNumber}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                          {caseItem.caseType}
                        </span>
                      </div>
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full w-fit ${
                          caseItem.status === "Disposed in Favor of LMC"
                            ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                            : caseItem.status === "Interim Stay Vacated"
                            ? "bg-blue-100 text-blue-900 border border-blue-300"
                            : "bg-amber-100 text-amber-900 border border-amber-300"
                        }`}
                      >
                        {caseItem.status}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900">
                        {caseItem.title}
                      </h3>
                      {caseItem.marathiTitle && (
                        <p className="text-xs font-semibold text-emerald-700 mt-0.5">
                          {caseItem.marathiTitle}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-slate-500">Court / Forum: </span>
                        <strong className="text-slate-800 font-semibold">{caseItem.court}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500">Assigned Counsel: </span>
                        <strong className="text-emerald-700 font-semibold">{caseItem.advocateAssigned}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500">Petitioner: </span>
                        <span className="text-slate-700">{caseItem.petitioner}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Respondent: </span>
                        <span className="text-slate-700">{caseItem.respondent}</span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-100">
                      <span className="font-bold text-slate-800">Subject: </span>
                      {caseItem.subject}
                      <p className="mt-1 text-slate-500 font-light">{caseItem.summary}</p>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Next Listing: </span>
                        <strong className="text-slate-900 font-bold">{caseItem.nextHearingDate}</strong>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        Official Law Record • LMC
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6">
                <Scale className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-800">No judicial records found</h4>
                <p className="text-xs text-slate-500 mt-1">Try resetting search filters.</p>
              </div>
            )}
          </div>
        )}

        {/* 4. LOK ADALAT & LEGAL AID TAB */}
        {activeTab === "lok-adalat" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Lok Adalat Special Notice Banner */}
            <div className="bg-gradient-to-r from-amber-500 via-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
              <div className="max-w-2xl space-y-2 relative z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold border border-white/30">
                  <Gavel className="w-3.5 h-3.5 text-amber-200" />
                  <span>National Lok Adalat Initiative • राष्ट्रीय लोक अदालत</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black">
                  Resolve Municipal Disputes Amicably With Full Interest Rebate
                </h2>
                <p className="text-xs sm:text-sm text-emerald-100 font-light leading-relaxed">
                  Citizens of Lonavala can avail 100% penal interest waiver on long-pending property tax and water bills through mutual conciliation at the upcoming National Mega Lok Adalat.
                </p>
              </div>
            </div>

            {/* Events Grid */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900">
                Upcoming Lok Adalat Benches & Conciliation Camps
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {LOK_ADALAT_EVENTS.map((event) => (
                  <div
                    key={event.id}
                    className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
                          {event.status}
                        </span>
                        <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                          {event.date}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-lg font-bold text-slate-900">
                          {event.title}
                        </h4>
                        <p className="text-xs font-semibold text-emerald-700">
                          {event.marathiTitle}
                        </p>
                      </div>

                      <div className="space-y-2 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                        <div className="flex items-start gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-slate-500">Venue: </span>
                            <span className="font-semibold text-slate-800">{event.venue}</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-slate-500">Presiding Bench: </span>
                            <span className="text-slate-700">{event.benchOfficers}</span>
                          </div>
                        </div>
                      </div>

                      {/* Eligible Matters */}
                      <div>
                        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                          Eligible Disputes for Compromise:
                        </h5>
                        <ul className="space-y-1.5 text-xs text-slate-600">
                          {event.eligibleMatters.map((matter, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{matter}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Required Documents */}
                      <div className="pt-2 border-t border-slate-100">
                        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Documents to Bring:
                        </h5>
                        <div className="flex flex-wrap gap-1.5">
                          {event.documentsRequired.map((doc, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg"
                            >
                              {doc}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <span className="text-slate-500 font-medium">
                        Helpdesk: <strong>{event.contactPerson}</strong>
                      </span>
                      <button
                        onClick={() => {
                          setActiveTab("documents");
                          const el = document.getElementById("content-section");
                          el?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="px-3.5 py-2 rounded-xl bg-emerald-700 text-white font-bold hover:bg-emerald-800 transition-colors shadow-2xs text-center"
                      >
                        Download Application
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5. ACTS & DOCUMENTS TAB */}
        {activeTab === "documents" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Acts, Standing Orders & Legal Downloads
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  विधी परिपत्रके, नियम, कायदे व अर्ज नमुने
                </p>
              </div>
              <div className="w-full sm:w-72">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search legal documents..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                        {doc.category}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {doc.fileSize} • {doc.fileType}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">
                      {doc.title}
                    </h3>
                    <p className="text-xs font-semibold text-emerald-700">
                      {doc.marathiTitle}
                    </p>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {doc.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      Updated: <strong>{doc.date}</strong>
                    </span>
                    <a
                      href={`/downloads/${doc.id}.pdf`}
                      download
                      onClick={(e) => {
                        e.preventDefault();
                        alert(`Downloading ${doc.title} (${doc.fileSize})`);
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 hover:bg-emerald-100 transition-colors shadow-2xs"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Download {doc.fileType}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Legal Cell Helpdesk Footer Banner */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold">
                <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Legal Cell Office • विधी शाखा कार्यालय</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Need Legal Assistance or Notice Redressal?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
                Citizens and advocates can visit the Legal Cell, 2nd Floor, Lonavala Municipal Council Administrative Building, Shivaji Chowk, Lonavala - 410401 during working hours (10:00 AM to 5:45 PM).
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <a
                href="tel:02114273203"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md shadow-emerald-700/20 transition-all"
              >
                <Phone className="w-4 h-4" />
                <span>Call Legal Cell</span>
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all"
              >
                <span>Municipal Contact Directory</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
