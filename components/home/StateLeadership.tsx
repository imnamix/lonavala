"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Quote,
  Sparkles,
  MapPin,
  Building2,
  Trees,
  Megaphone,
  ArrowRight,
  ExternalLink,
  Download,
  FileText,
  ChevronRight,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import {
  ImportantUpdateRecord,
  getActiveImportantUpdates,
} from "@/lib/services/important-update.service";

interface LeaderCard {
  id: string;
  nameMr: string;
  nameEn: string;
  nameHi: string;
  titleMr: string;
  titleEn: string;
  titleHi: string;
  image: string;
}

// Exact 16-point starburst badge matching civic announcement style
function StarburstBadge({
  text = "NEW",
  bg = "#F95700",
  color = "#FFFFFF",
}: {
  text?: string;
  bg?: string;
  color?: string;
}) {
  return (
    <div className="relative inline-flex items-center justify-center shrink-0 w-6 h-6 sm:w-7 sm:h-7 hover:scale-110 transition-transform">
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-xs animate-pulse"
        style={{ fill: bg }}
      >
        <polygon points="50,0 62,20 85,15 82,38 100,50 82,62 85,85 62,80 50,100 38,80 15,85 18,62 0,50 18,38 15,15 38,20" />
      </svg>
      <span
        className="absolute text-[7px] sm:text-[7.5px] font-black uppercase tracking-tighter"
        style={{ color: color }}
      >
        {text}
      </span>
    </div>
  );
}

export function StateLeadership() {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [updates, setUpdates] = useState<ImportantUpdateRecord[]>([]);
  const [loadingUpdates, setLoadingUpdates] = useState(true);

  useEffect(() => {
    // Trigger smooth staggered entrance animation on mount
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    // Fetch active important updates
    async function loadUpdates() {
      try {
        setLoadingUpdates(true);
        const data = await getActiveImportantUpdates(8);
        setUpdates(data);
      } catch (err) {
        console.error("Failed to load active updates in StateLeadership:", err);
      } finally {
        setLoadingUpdates(false);
      }
    }
    loadUpdates();

    return () => clearTimeout(timer);
  }, []);

  const leaders: LeaderCard[] = [
    {
      id: "cm",
      nameMr: "श्री. देवेंद्र फडणवीस",
      nameEn: "Shri. Devendra Fadnavis",
      nameHi: "श्री देवेंद्र फडणवीस",
      titleMr: "मा. मुख्यमंत्री, महाराष्ट्र राज्य",
      titleEn: "Hon'ble Chief Minister, Maharashtra State",
      titleHi: "माननीय मुख्यमंत्री, महाराष्ट्र राज्य",
      image: "/images/leaders/devendra-fadnavis.png",
    },
    {
      id: "dcm1",
      nameMr: "श्री. एकनाथ शिंदे",
      nameEn: "Shri. Eknath Shinde",
      nameHi: "श्री एकनाथ शिंदे",
      titleMr: "मा. उपमुख्यमंत्री (नगरविकास व गृहनिर्माण)",
      titleEn: "Hon'ble Deputy Chief Minister (Urban Development & Housing)",
      titleHi: "माननीय उपमुख्यमंत्री (नगर विकास एवं आवास)",
      image: "/images/leaders/dcm-eknath-shinde.jpg",
    },
    {
      id: "dcm2",
      nameMr: "श्रीमती सुनेत्रा अजित पवार",
      nameEn: "Smt. Sunetra Ajit Pawar",
      nameHi: "श्रीमती सुनेत्रा अजित पवार",
      titleMr: "मा. उपमुख्यमंत्री",
      titleEn: "Hon'ble Deputy Chief Minister",
      titleHi: "माननीय उपमुख्यमंत्री",
      image: "/images/leaders/mp-sunetra-pawar.jpg",
    },
    {
      id: "mos",
      nameMr: "श्रीमती. माधुरी मिसाळ",
      nameEn: "Smt. Madhuri Misal",
      nameHi: "श्रीमती माधुरी मिसाळ",
      titleMr: "मा. राज्यमंत्री (नगरविकास)",
      titleEn: "Hon'ble Minister of State (Urban Development)",
      titleHi: "माननीय राज्यमंत्री (नगर विकास)",
      image: "/images/leaders/mos-madhuri-misal.jpg",
    },
  ];

  const mlaData = {
    image: "/images/leaders/sunil-shelke.png",
    nameMr: "श्री. सुनील शेळके",
    nameEn: "Shri. Sunil Shelke",
    nameHi: "श्री सुनील शेळके",
    titleMr: "मा. आमदार, मावळ-लोणावळा विधानसभा मतदारसंघ",
    titleEn: "Hon'ble Member of Legislative Assembly (MLA), Maval-Lonavala",
    titleHi: "माननीय विधायक, मावल-लोनावला विधानसभा क्षेत्र",
    badgeMr: "स्थानिक लोकप्रतिनिधी • मावळ विधानसभा",
    badgeEn: "Local People's Representative • Maval Constituency",
    badgeHi: "स्थानीय जनप्रतिनिधि • मावल विधानसभा",
    messageMr:
      "लोणावळा व मावळ परिसराचा सर्वांगीण विकास, पर्यटन क्षेत्राचा सुनियोजित विस्तार आणि सर्व नागरिकांना पारदर्शक नागरी सुविधा देणे हेच आमचे ध्येय आहे.",
    messageEn:
      "Our foremost priority is the comprehensive development of Lonavala and Maval, planned tourism expansion, and prompt civic amenities for all.",
    messageHi:
      "लोनावला एवं मावल क्षेत्र का सर्वांगीण विकास, पर्यटन का सुव्यवस्थित विस्तार और प्रत्येक नागरिक को पारदर्शी नागरिक सुविधाएं देना ही हमारा लक्ष्य है.",
    focusMr: ["शाश्वत पर्यटन विकास", "पायाभूत सुविधा", "नागरी सेवा"],
    focusEn: ["Sustainable Tourism", "Infrastructure", "Civic Services"],
    focusHi: ["सतत पर्यटन विकास", "बुनियादी ढांचा", "नागरिक सेवाएं"],
  };

  const getName = (leader: LeaderCard) => {
    if (language === "hi") return leader.nameHi;
    if (language === "en") return leader.nameEn;
    return leader.nameMr;
  };

  const getTitle = (leader: LeaderCard) => {
    if (language === "hi") return leader.titleHi;
    if (language === "en") return leader.titleEn;
    return leader.titleMr;
  };

  const currentMlaName =
    language === "hi" ? mlaData.nameHi : language === "en" ? mlaData.nameEn : mlaData.nameMr;

  const currentMlaTitle =
    language === "hi" ? mlaData.titleHi : language === "en" ? mlaData.titleEn : mlaData.titleMr;

  const currentMlaBadge =
    language === "hi" ? mlaData.badgeHi : language === "en" ? mlaData.badgeEn : mlaData.badgeMr;

  const currentMlaMessage =
    language === "hi" ? mlaData.messageHi : language === "en" ? mlaData.messageEn : mlaData.messageMr;

  const currentMlaFocus =
    language === "hi" ? mlaData.focusHi : language === "en" ? mlaData.focusEn : mlaData.focusMr;

  const getUpdateTarget = (update: ImportantUpdateRecord) => {
    if (update.actionType === "DOWNLOAD_FILE") {
      return {
        href: update.fileUrl || "#",
        target: "_blank",
        rel: "noopener noreferrer",
      };
    }
    if (update.actionType === "EXTERNAL_LINK") {
      return {
        href: update.externalUrl || "#",
        target: update.openInNewTab ? "_blank" : undefined,
        rel: update.openInNewTab ? "noopener noreferrer" : undefined,
      };
    }
    if (update.actionType === "INTERNAL_ROUTE") {
      return {
        href: update.internalRoute || "/notices",
      };
    }
    return {
      href: `/updates/${update.slug || update.id}`,
    };
  };

  return (
    <div className="relative z-20 -mt-16 sm:-mt-20 lg:-mt-24 mb-6 sm:mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. State Leadership 4 Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {leaders.map((leader, index) => (
            <div
              key={leader.id}
              style={{
                transitionDelay: `${index * 140}ms`,
              }}
              className={`bg-white rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-100 py-3.5 px-4 sm:py-4 sm:px-5 text-center flex flex-col items-center justify-center transition-all duration-700 ease-out transform ${
                isVisible
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 translate-y-8 scale-95"
              } hover:shadow-2xl hover:-translate-y-2 group cursor-default`}
            >
              {/* Dignitary Portrait with Classic Gold Frame */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-[120px] md:h-[120px] relative border-[3.5px] sm:border-[4px] border-[#B89658] bg-slate-50 shadow-sm mb-2.5 sm:mb-3 overflow-hidden rounded-xs group-hover:border-[#c9a765] group-hover:shadow-md transition-all duration-300">
                <div className="relative w-full h-full overflow-hidden bg-slate-100">
                  <Image
                    src={leader.image}
                    alt={getName(leader)}
                    fill
                    className="object-cover object-top group-hover:scale-106 transition-transform duration-500 ease-out"
                    sizes="(max-width: 640px) 110px, 150px"
                    priority
                  />
                </div>
              </div>

              {/* Dignitary Name */}
              <h3 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 tracking-tight leading-snug group-hover:text-emerald-800 transition-colors">
                {getName(leader)}
              </h3>

              {/* Designation / Position */}
              <p className="text-xs sm:text-sm text-slate-700 font-medium mt-0.5 leading-snug">
                {getTitle(leader)}
              </p>
            </div>
          ))}
        </div>

        {/* 2. Side-by-Side Row: Sunil Shelke (Left 66%) & Important Updates (Right 33% Compact) */}
        <div
          style={{ transitionDelay: "560ms" }}
          className={`mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch transition-all duration-700 ease-out transform ${
            isVisible
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-8 scale-95"
          }`}
        >
          {/* LEFT: Local MLA Sunil Shelke Profile Card (66% Width) */}
          <div className="lg:col-span-8 bg-white rounded-3xl shadow-xl shadow-slate-900/10 border border-slate-100 p-5 sm:p-6 flex flex-col justify-between hover:shadow-2xl transition-all">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6">
              {/* Dignitary Portrait (Enlarged) */}
              <div className="shrink-0 flex flex-col items-center">
                <div className="w-36 h-48 sm:w-44 sm:h-56 md:w-48 md:h-60 lg:w-52 lg:h-64 relative border-[4px] border-[#B89658] bg-slate-50 shadow-md overflow-hidden rounded-xl group hover:border-[#c9a765] transition-all duration-300">
                  <Image
                    src={mlaData.image}
                    alt={currentMlaName}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 180px, (max-width: 1024px) 220px, 240px"
                    priority
                  />
                </div>
              </div>

              {/* Title, Badge & Name */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start mb-1.5">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/80">
                    <Sparkles className="w-3 h-3 text-emerald-700" />
                    {currentMlaBadge}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  {currentMlaName}
                </h3>

                <p className="text-xs sm:text-sm font-semibold text-emerald-800 mt-0.5">
                  {currentMlaTitle}
                </p>

                {/* Focus Pillars */}
                <div className="mt-2.5 flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                  {currentMlaFocus.map((focusItem, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-700 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md"
                    >
                      {idx === 0 ? (
                        <Trees className="w-3 h-3 text-emerald-600" />
                      ) : idx === 1 ? (
                        <Building2 className="w-3 h-3 text-blue-600" />
                      ) : (
                        <MapPin className="w-3 h-3 text-amber-600" />
                      )}
                      {focusItem}
                    </span>
                  ))}
                </div>

                {/* Message Box directly below Focus Pillars */}
                <div className="mt-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/70 relative">
                  <Quote className="w-4 h-4 text-[#B89658]/40 absolute top-2.5 left-2.5 -scale-x-100 hidden sm:block" />
                  <p className="text-xs text-slate-700 leading-relaxed sm:pl-5 italic font-medium">
                    &ldquo;{currentMlaMessage}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Compact Important Updates (33% Width) */}
          <div className="lg:col-span-4 bg-white rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-100 p-4 sm:p-4.5 flex flex-col justify-between hover:shadow-2xl transition-all">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-2.5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-orange-50 text-orange-600 border border-orange-200">
                    <Megaphone className="w-3.5 h-3.5 animate-bounce" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
                      {language === "mr"
                        ? "महत्त्वाच्या सूचना"
                        : "Important Updates"}
                    </h3>
                  </div>
                </div>

                <Link
                  href="/notices"
                  className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-0.5 hover:underline"
                >
                  <span>{language === "mr" ? "सर्व पहा" : "View All"}</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

              {/* Updates List with Compact Starburst Badges & Blue Links */}
              {loadingUpdates ? (
                <div className="space-y-3 py-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 animate-pulse"
                    >
                      <div className="w-6 h-6 rounded-full bg-slate-200 shrink-0" />
                      <div className="h-3.5 bg-slate-200 rounded w-full" />
                    </div>
                  ))}
                </div>
              ) : updates.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  {language === "mr"
                    ? "सध्या नवीन सूचना उपलब्ध नाहीत."
                    : "No active updates."}
                </div>
              ) : (
                <div className="space-y-2.5 overflow-y-auto max-h-[235px] pr-1 scrollbar-thin">
                  {updates.map((update) => {
                    const target = getUpdateTarget(update);
                    const tagLabel = update.tag || "NEW";
                    const tagBg = update.tagBgColor || "#F95700";
                    const tagColor = update.tagTextColor || "#FFFFFF";

                    return (
                      <div
                        key={update.id}
                        className="group flex items-start gap-2 py-0.5 transition-all"
                      >
                        {/* 16-point Starburst Badge */}
                        <StarburstBadge
                          text={tagLabel}
                          bg={tagBg}
                          color={tagColor}
                        />

                        {/* Bold Blue Link */}
                        <Link
                          href={target.href}
                          target={target.target}
                          rel={target.rel}
                          className="flex-1 text-[11px] sm:text-xs font-bold text-blue-700 hover:text-blue-950 transition-colors hover:underline leading-snug line-clamp-2"
                        >
                          {update.title}
                        </Link>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bottom Status / Quick Info */}
            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-emerald-700 font-semibold">
                  {language === "mr" ? "थेट अपडेट्स" : "Live Active"}
                </span>
              </span>
              <span>
                {updates.length} {language === "mr" ? "सूचना" : "Updates"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
