"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  Target,
  Eye,
  History,
  CheckCircle2,
  MapPin,
  Calendar,
  Award,
  Phone,
  Mail,
  Quote,
  Loader2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { getAboutUsData, AboutUsData } from "@/lib/services/about.service";
import { StatisticsSection } from "@/components/shared/StatisticsSection";
import { useLanguage } from "@/context/LanguageContext";
import { useAutoTranslate } from "@/hooks/useAutoTranslation";

function AboutPageSkeleton() {
  return (
    <div className="pt-0 pb-16 bg-slate-50/50">
      {/* Header Banner Skeleton */}
      <div className="relative bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white border-b border-emerald-800/40 py-12 sm:py-16 mb-12 overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl space-y-4 animate-pulse">
            {/* Breadcrumb Skeleton */}
            <div className="flex items-center gap-2">
              <div className="h-3.5 w-14 bg-white/20 rounded-md" />
              <div className="h-3.5 w-3.5 bg-white/20 rounded-full" />
              <div className="h-3.5 w-20 bg-white/30 rounded-md" />
            </div>

            {/* Badge Skeleton */}
            <div className="h-7 w-48 bg-emerald-500/20 border border-emerald-400/30 rounded-full" />

            {/* Title Skeleton */}
            <div className="space-y-2">
              <div className="h-9 sm:h-12 w-3/4 max-w-xl bg-white/20 rounded-xl" />
            </div>

            {/* Subtitle / Meta row Skeleton */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="h-5 w-52 bg-emerald-400/20 rounded-md" />
              <div className="h-2 w-2 rounded-full bg-emerald-400/30" />
              <div className="h-5 w-44 bg-emerald-400/20 rounded-md" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* History Section Skeleton */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start animate-pulse">
          <div className="lg:col-span-7 space-y-5">
            <div className="h-6 w-36 bg-slate-200 rounded-full" />
            <div className="h-9 w-4/5 bg-slate-200 rounded-xl" />
            <div className="h-7 w-44 bg-slate-100 rounded-xl" />

            <div className="space-y-3 pt-2">
              <div className="h-4 bg-slate-200 rounded w-full" />
              <div className="h-4 bg-slate-200 rounded w-11/12" />
              <div className="h-4 bg-slate-200 rounded w-5/6" />
              <div className="h-4 bg-slate-200 rounded w-full" />
              <div className="h-4 bg-slate-200 rounded w-4/5" />
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-3xl bg-slate-200 border-4 border-white shadow-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-300 to-slate-200" />
              <div className="absolute bottom-4 left-4 p-4 rounded-2xl bg-slate-800/40 w-44 h-16 space-y-1.5 backdrop-blur-xs">
                <div className="h-5 w-24 bg-white/40 rounded" />
                <div className="h-3 w-32 bg-white/30 rounded" />
              </div>
            </div>
          </div>
        </section>

        {/* Vision & Mission Cards Skeleton */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
          {/* Vision */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-100" />
            <div className="h-6 w-36 bg-slate-200 rounded-lg" />
            <div className="space-y-2.5">
              <div className="h-4 bg-slate-100 rounded w-full" />
              <div className="h-4 bg-slate-100 rounded w-11/12" />
              <div className="h-4 bg-slate-100 rounded w-4/5" />
            </div>
          </div>

          {/* Mission */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-100" />
            <div className="h-6 w-36 bg-slate-200 rounded-lg" />
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-slate-200 shrink-0" />
                  <div className="h-4 bg-slate-100 rounded w-5/6" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Commissioner's Message Skeleton */}
        <section className="bg-gradient-to-br from-slate-50 via-white to-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-xs animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-4 flex flex-col items-center text-center space-y-3">
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-slate-200 border-4 border-white ring-4 ring-slate-100" />
              <div className="h-5 w-40 bg-slate-200 rounded-lg" />
              <div className="h-4 w-32 bg-slate-100 rounded-md" />
            </div>

            <div className="md:col-span-8 space-y-4">
              <div className="h-6 w-44 bg-slate-200 rounded-full" />
              <div className="h-8 w-3/4 bg-slate-200 rounded-xl" />
              <div className="space-y-2.5 border-l-2 border-slate-200 pl-4 py-1">
                <div className="h-4 bg-slate-100 rounded w-full" />
                <div className="h-4 bg-slate-100 rounded w-11/12" />
                <div className="h-4 bg-slate-100 rounded w-4/5" />
              </div>
              <div className="h-4 w-48 bg-slate-200 rounded pt-2" />
            </div>
          </div>
        </section>
      </div>

      <div className="mt-16">
        <StatisticsSection />
      </div>
    </div>
  );
}

function MissionItem({ point, fallback }: { point: string; fallback?: string }) {
  const translated = useAutoTranslate(point, fallback);
  return (
    <li className="flex items-start gap-3">
      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
      <span>{translated}</span>
    </li>
  );
}

export default function AboutPage() {
  const { dict, language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AboutUsData | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setLoading(true);
        const res = await getAboutUsData();
        if (isMounted) {
          setData(res);
        }
      } catch (err) {
        console.error("Failed to load About Us data:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const galleryImages = [
    {
      src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
      caption: "Sahyadri Mountain Range & Borghat Valley",
    },
    {
      src: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800&q=80",
      caption: "Bushi Dam Monsoon Catchment",
    },
    {
      src: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=800&q=80",
      caption: "Ryewood Botanical Garden Restoration",
    },
    {
      src: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80",
      caption: "Karla Ancient Rock-Cut Heritage",
    },
  ];

  const about = data || {
    title: "Lonavala Municipal Council (लोणावळा नगर परिषद)",
    establishedYear: "1877",
    yearsOfService: "149+ Years",
    elevation: "622 m (2,041 ft)",
    mediaUrl:
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80",
    description:
      "Lonavala was discovered as a hill retreat in 1871 and formally constituted as a Municipality in 1877.",
    vision:
      "To transform Lonavala into India's leading carbon-neutral, clean, and digitally advanced eco-tourism hill station.",
    mission: [
      "Deliver 100% door-to-door segregated waste processing and plastic-free tourism.",
      "Provide 24x7 treated potable water supply and eco-conscious underground sewerage.",
      "Enforce zero-tolerance transparency through time-bound online grievance redressal.",
      "Preserve and develop eco-tourism trails, heritage viewpoints, and hill lakes with zero ecological degradation.",
      "Maintain an accountable, corruption-free administrative ecosystem through transparent public e-tenders.",
    ],
    communique: {
      officerName: "Shri. Pandit Patil (State Cadre)",
      designation: "Chief Officer / Commissioner",
      phone: "+91 2114 273032",
      email: "co@lonavalamc.gov.in",
      mediaUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
      title: "Advancing Citizen-Centric e-Governance",
      subtitle: "Chief Officer's Communiqué",
      messageBody:
        "It gives me immense pride to welcome you to the official digital portal of Lonavala Municipal Council.",
      signOff: "— Office of the Chief Officer, LMC Lonavala",
    },
  };

  const hasHtmlDescription =
    about.description &&
    (about.description.includes("<p>") ||
      about.description.includes("<br") ||
      about.description.includes("<div>"));

  // Dynamic & dictionary auto-translations
  const translatedDesc = useAutoTranslate(
    about.description,
    dict?.aboutPage?.historyDescDefault
  );
  const translatedVision = useAutoTranslate(
    about.vision,
    dict?.aboutPage?.visionDefault
  );
  const translatedCommuniqueTitle = useAutoTranslate(
    about.communique?.title,
    dict?.aboutPage?.communiqueTitleDefault
  );
  const translatedCommuniqueBody = useAutoTranslate(
    about.communique?.messageBody,
    dict?.aboutPage?.communiqueBodyDefault
  );
  const translatedCommuniqueSignOff = useAutoTranslate(
    about.communique?.signOff,
    dict?.aboutPage?.communiqueSignOffDefault
  );
  const translatedOfficerName = useAutoTranslate(
    about.communique?.officerName,
    dict?.aboutPage?.communiqueOfficerNameDefault
  );
  const translatedOfficerDesignation = useAutoTranslate(
    about.communique?.designation,
    dict?.aboutPage?.communiqueDesignationDefault
  );

  const mainTitle =
    language === "mr"
      ? dict?.aboutPage?.councilName || "लोणावळा नगरपरिषद"
      : dict?.aboutPage?.councilName || "Lonavala Municipal Council";

  const secondaryTitle =
    language === "mr"
      ? dict?.aboutPage?.councilNameMr || "(Lonavala Municipal Council)"
      : dict?.aboutPage?.councilNameMr || "(लोणावळा नगर परिषद)";

  const elevationText =
    language === "mr"
      ? dict?.aboutPage?.elevation || "समुद्रसपाटीपासून ६२२ मीटर (२,०४१ फूट) उंचीवर"
      : dict?.aboutPage?.elevation || "Located at 622 m (2,041 ft)";

  const yearsText =
    language === "mr"
      ? dict?.aboutPage?.yearsOfService || "१४९+ वर्षांची अखंड जनसेवा"
      : dict?.aboutPage?.yearsOfService || "149+ Years of Civic Service";

  const missionList =
    about.mission && about.mission.length > 0
      ? about.mission
      : dict?.aboutPage?.missionDefault || [
          "Deliver 100% door-to-door segregated waste processing and plastic-free tourism.",
          "Provide 24x7 treated potable water supply and eco-conscious underground sewerage.",
          "Enforce zero-tolerance transparency through time-bound online grievance redressal.",
        ];

  if (loading) {
    return <AboutPageSkeleton />;
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
              {dict?.nav?.home || "Home"}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-semibold">
              {dict?.aboutPage?.breadcrumb || "About Us"}
            </span>
          </div>

          <div className="max-w-4xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {dict?.aboutPage?.badge || "Council Profile • नगरपरिषद परिचय"}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span>{mainTitle}</span>
              <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-emerald-300/90 font-sans">
                {secondaryTitle}
              </span>
            </h1>
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-sm sm:text-base text-slate-200 leading-relaxed font-normal pt-1">
              <span className="inline-flex items-center gap-1.5 text-emerald-300 font-medium">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{elevationText}</span>
              </span>
              <span className="text-emerald-400/60">•</span>
              <span className="inline-flex items-center gap-1.5 text-emerald-300 font-medium">
                <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{yearsText}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* History Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
              <History className="w-4 h-4" />
              <span>
                {dict?.aboutPage?.historyBadge || "Historical Legacy"}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {dict?.aboutPage?.historyTitle ||
                "Over a Century of Hill-Station Stewardship"}
            </h2>

            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200/60">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {dict?.aboutPage?.historyElevation ||
                  (about.elevation
                    ? `Elevation: ${about.elevation}`
                    : "Elevation: 622 m (2,041 ft)")}
              </span>
            </div>

            {/* Description Text / HTML */}
            {hasHtmlDescription ? (
              <div
                className="prose prose-slate max-w-none text-slate-600 text-sm sm:text-base leading-relaxed space-y-4 prose-p:leading-relaxed prose-headings:text-slate-900 prose-headings:font-bold prose-strong:text-slate-900 prose-ul:list-disc prose-ul:pl-5 prose-li:my-1 break-words"
                dangerouslySetInnerHTML={{ __html: translatedDesc || about.description }}
              />
            ) : (
              <div className="text-sm sm:text-base text-slate-600 leading-relaxed space-y-4">
                <p className="whitespace-pre-line leading-relaxed">
                  {translatedDesc ||
                    dict?.aboutPage?.historyDescDefault ||
                    about.description}
                </p>
              </div>
            )}
          </div>

          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-slate-100 group">
              <Image
                src={
                  about.mediaUrl ||
                  "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80"
                }
                alt={mainTitle}
                fill
                unoptimized={about.mediaUrl ? about.mediaUrl.startsWith("http") : false}
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              {/* Scrim overlay for contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

              {/* Establishment Badge securely inside image container */}
              <div className="absolute bottom-4 left-4 sm:bottom-5 sm:left-5 bg-gradient-to-r from-emerald-950/90 to-teal-950/90 backdrop-blur-md text-white p-3.5 sm:p-4 rounded-2xl shadow-xl border border-emerald-400/30">
                <div className="text-xl sm:text-2xl font-black tracking-tight">
                  {dict?.aboutPage?.estLabel ||
                    (about.establishedYear
                      ? `Est. ${about.establishedYear}`
                      : "Est. 1877")}
                </div>
                <div className="text-xs text-emerald-200 font-medium">
                  {yearsText}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vision & Mission Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Vision */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm hover:shadow-md hover:border-emerald-500 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-800 mb-5 shadow-xs">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {dict?.aboutPage?.visionTitle || "Our Vision"}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {translatedVision ||
                  dict?.aboutPage?.visionDefault ||
                  about.vision}
              </p>
            </div>
          </div>

          {/* Mission */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm hover:shadow-md hover:border-emerald-500 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-800 mb-5 shadow-xs">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              {dict?.aboutPage?.missionTitle || "Our Mission"}
            </h3>
            <ul className="space-y-3 text-sm text-slate-600">
              {missionList.map((point, idx) => (
                <MissionItem
                  key={idx}
                  point={point}
                  fallback={dict?.aboutPage?.missionDefault?.[idx]}
                />
              ))}
            </ul>
          </div>
        </section>

        {/* Commissioner's Message */}
        {about.communique && (
          <section className="bg-gradient-to-br from-emerald-50/60 via-white to-teal-50/40 border border-emerald-200/70 rounded-3xl p-8 sm:p-12 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-4 flex flex-col items-center text-center">
                <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden shadow-xl border-4 border-white ring-4 ring-emerald-600/30 mb-4 bg-slate-100">
                  <Image
                    src={
                      about.communique.mediaUrl ||
                      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80"
                    }
                    alt={translatedOfficerName || "Chief Officer"}
                    fill
                    unoptimized={
                      about.communique.mediaUrl
                        ? about.communique.mediaUrl.startsWith("http")
                        : false
                    }
                    className="object-cover"
                    sizes="180px"
                  />
                </div>
                <h4 className="font-extrabold text-slate-900 text-base sm:text-lg">
                  {translatedOfficerName ||
                    dict?.aboutPage?.communiqueOfficerNameDefault}
                </h4>
                <p className="text-xs text-emerald-700 font-bold mt-0.5">
                  {translatedOfficerDesignation ||
                    dict?.aboutPage?.communiqueDesignationDefault}
                </p>

                <div className="mt-3 space-y-1 text-xs text-slate-500">
                  {about.communique.phone && (
                    <div className="flex items-center gap-1.5 justify-center">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{about.communique.phone}</span>
                    </div>
                  )}
                  {about.communique.email && (
                    <div className="flex items-center gap-1.5 justify-center">
                      <Mail className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{about.communique.email}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="md:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                  <Quote className="w-3.5 h-3.5 text-emerald-700" />
                  <span>
                    {dict?.aboutPage?.communiqueBadge ||
                      about.communique.subtitle ||
                      "Chief Officer's Communiqué"}
                  </span>
                </div>
                <h3 className="text-xl sm:text-3xl font-extrabold text-slate-900">
                  {translatedCommuniqueTitle ||
                    dict?.aboutPage?.communiqueTitleDefault ||
                    about.communique.title}
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed italic border-l-2 border-emerald-500 pl-4">
                  &ldquo;
                  {translatedCommuniqueBody ||
                    dict?.aboutPage?.communiqueBodyDefault ||
                    about.communique.messageBody}
                  &rdquo;
                </p>
                {(translatedCommuniqueSignOff ||
                  dict?.aboutPage?.communiqueSignOffDefault ||
                  about.communique.signOff) && (
                  <div className="pt-2 text-xs sm:text-sm font-bold text-slate-800">
                    {translatedCommuniqueSignOff ||
                      dict?.aboutPage?.communiqueSignOffDefault ||
                      about.communique.signOff}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </div>

      <div className="mt-16">
        <StatisticsSection />
      </div>
    </div>
  );
}
