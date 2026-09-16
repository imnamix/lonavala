"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Home,
  Info,
  Phone,
  Compass,
  Layers,
  HelpCircle,
} from "lucide-react";
import { HomepageContentEditor } from "@/components/admin/content/HomepageContentEditor";
import { AboutContentEditor } from "@/components/admin/content/AboutContentEditor";
import { ContactsContentEditor } from "@/components/admin/content/ContactsContentEditor";
import { TourismTable } from "@/components/admin/content/TourismTable";
import { FaqTable } from "@/components/admin/content/FaqTable";

type ContentSection = "homepage" | "about" | "contacts" | "tourism" | "faq";

function ContentManagerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sectionParam = searchParams.get("section") as ContentSection | null;

  const [activeSection, setActiveSection] = useState<ContentSection>(
    sectionParam && ["homepage", "about", "contacts", "tourism", "faq"].includes(sectionParam)
      ? sectionParam
      : "homepage"
  );

  useEffect(() => {
    if (sectionParam && ["homepage", "about", "contacts", "tourism", "faq"].includes(sectionParam)) {
      setActiveSection(sectionParam);
    }
  }, [sectionParam]);

  const handleTabChange = (section: ContentSection) => {
    setActiveSection(section);
    router.push(`/admin/content?section=${section}`);
  };

  const SECTIONS = [
    {
      id: "homepage" as ContentSection,
      name: "Homepage",
      icon: Home,
      route: "/",
      desc: "Hero carousel slides, media uploads, action buttons, tags & emergency ticker",
      fieldsCount: "Multi-slide",
    },
    {
      id: "about" as ContentSection,
      name: "About Us",
      icon: Info,
      route: "/about",
      desc: "Historical legacy description, vision/mission statements & commissioner message",
      fieldsCount: "Rich Text",
    },
    {
      id: "contacts" as ContentSection,
      name: "Contacts",
      icon: Phone,
      route: "/contact",
      desc: "Emergency 24x7 hotlines, WhatsApp helpline, municipal complex address & map",
      fieldsCount: "Dynamic List",
    },
    {
      id: "tourism" as ContentSection,
      name: "Tourism",
      icon: Compass,
      route: "/tourism",
      desc: "Attraction landmarks, labels, key-value highlights, proximity distance & advisory points",
      fieldsCount: "Destinations",
    },
    {
      id: "faq" as ContentSection,
      name: "FAQ Knowledge Base",
      icon: HelpCircle,
      route: "/#faq",
      desc: "Citizen queries, property tax guidelines, service FAQs, procedural rules & answers",
      fieldsCount: "Q&A Table",
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header Hub */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-emerald-400/20 text-emerald-200 text-xs font-semibold">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>LMC Content Management System (CMS)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Website Content & Page Modules
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
              Manage public website pages, hero carousels, rich text descriptions, emergency helplines, tourist destinations, and citizen FAQs in real-time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 text-xs">
              <span className="text-emerald-300 font-semibold">Status:</span>{" "}
              <span className="text-white font-bold">Production Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section Switcher Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {SECTIONS.map((sec) => {
          const Icon = sec.icon;
          const isSelected = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => handleTabChange(sec.id)}
              className={`text-left p-5 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? "bg-white border-[#2E8B57] shadow-md ring-2 ring-[#2E8B57]/20"
                  : "bg-white border-[#D9E8DD] hover:border-emerald-300 hover:shadow-xs"
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#2E8B57]" />
              )}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isSelected
                        ? "bg-[#2E8B57] text-white"
                        : "bg-[#E8F5E9] text-[#2E8B57]"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                    {sec.fieldsCount}
                  </span>
                </div>
                <h3 className="font-bold text-base text-[#1F2937]">{sec.name}</h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{sec.desc}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px]">
                <span className="font-mono text-gray-400">Route: {sec.route}</span>
                <span
                  className={`font-bold ${
                    isSelected ? "text-[#2E8B57]" : "text-gray-400"
                  }`}
                >
                  {isSelected ? "Editing Active" : "Click to Edit →"}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Render Active Section Editor */}
      <div className="transition-all duration-200">
        {activeSection === "homepage" && <HomepageContentEditor />}
        {activeSection === "about" && <AboutContentEditor />}
        {activeSection === "contacts" && <ContactsContentEditor />}
        {activeSection === "tourism" && <TourismTable />}
        {activeSection === "faq" && <FaqTable />}
      </div>
    </div>
  );
}

export default function AdminContentPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-gray-500">Loading Content Editor...</div>}>
      <ContentManagerContent />
    </Suspense>
  );
}
