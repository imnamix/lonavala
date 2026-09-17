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
} from "lucide-react";
import { getAboutUsData, AboutUsData } from "@/lib/services/about.service";
import { StatisticsSection } from "@/components/shared/StatisticsSection";
import { useLanguage } from "@/context/LanguageContext";

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

  if (loading) {
    return (
      <div className="py-16 min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
        <p className="text-sm font-semibold text-slate-600">
          Loading About Us details...
        </p>
      </div>
    );
  }

  const about = data || {
    title: "Lonavala Municipal Council",
    establishedYear: "1877",
    yearsOfService: "148+ Years",
    elevation: "624 meters in the Sahyadri Western Ghats",
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
    ],
    communique: {
      officerName: "Shri. Pandit Patil (IAS/State Cadre)",
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

  return (
    <div className="py-8 bg-slate-50/50">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-900 to-teal-950 text-white py-14 mb-12 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{dict?.council?.badge || "Council Profile"}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              {about.title || "About Lonavala Municipal Council"}
            </h1>
            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed font-light">
              {about.elevation ? `Located at ${about.elevation} • ` : ""}
              {about.yearsOfService ? `${about.yearsOfService} of Civic Service` : ""}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* History Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
              <History className="w-4 h-4" />
              <span>Historical Legacy</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {about.title || "Over a Century of Hill-Station Stewardship"}
            </h2>

            {about.elevation && (
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200/60">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Elevation: {about.elevation}</span>
              </div>
            )}

            {/* Description Text / HTML */}
            {hasHtmlDescription ? (
              <div
                className="prose prose-slate max-w-none text-slate-600 text-sm sm:text-base leading-relaxed space-y-4 prose-p:leading-relaxed prose-headings:text-slate-900 prose-headings:font-bold prose-strong:text-slate-900 prose-ul:list-disc prose-ul:pl-5 prose-li:my-1 break-words"
                dangerouslySetInnerHTML={{ __html: about.description }}
              />
            ) : (
              <div className="text-sm sm:text-base text-slate-600 leading-relaxed space-y-4">
                {about.description ? (
                  <p className="whitespace-pre-line">{about.description}</p>
                ) : (
                  <p>
                    Lonavala was discovered as a hill retreat in 1871 and formally constituted as a Municipal Municipality in 1877. Perched in the Sahyadri mountains of the Western Ghats, Lonavala serves as a vital ecological and recreational gateway.
                  </p>
                )}
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
                alt={about.title || "Lonavala Historical Borghat"}
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
                  {about.establishedYear ? `Est. ${about.establishedYear}` : "Est. 1877"}
                </div>
                <div className="text-xs text-emerald-200 font-medium">
                  {about.yearsOfService || "148+ Years of Civic Service"}
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
              <h3 className="text-xl font-bold text-slate-900 mb-3">Our Vision</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {about.vision ||
                  "To transform Lonavala into India's leading carbon-neutral, clean, and digitally advanced eco-tourism hill station, while preserving its pristine Sahyadri biodiversity and ensuring dignified civic amenities for every resident."}
              </p>
            </div>
          </div>

          {/* Mission */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm hover:shadow-md hover:border-emerald-500 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-800 mb-5 shadow-xs">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Our Mission</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              {about.mission && about.mission.length > 0 ? (
                about.mission.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))
              ) : (
                <>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Deliver 100% door-to-door segregated waste processing and plastic-free tourism.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Provide 24x7 treated potable water supply and eco-conscious underground sewerage.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Enforce zero-tolerance transparency through time-bound online grievance redressal.</span>
                  </li>
                </>
              )}
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
                    alt={about.communique.officerName || "Chief Officer"}
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
                  {about.communique.officerName}
                </h4>
                <p className="text-xs text-emerald-700 font-bold mt-0.5">
                  {about.communique.designation}
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
                  <span>{about.communique.subtitle || "Chief Officer's Communiqué"}</span>
                </div>
                <h3 className="text-xl sm:text-3xl font-extrabold text-slate-900">
                  {about.communique.title || "Advancing Citizen-Centric e-Governance"}
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed italic border-l-2 border-emerald-500 pl-4">
                  &ldquo;{about.communique.messageBody}&rdquo;
                </p>
                {about.communique.signOff && (
                  <div className="pt-2 text-xs sm:text-sm font-bold text-slate-800">
                    {about.communique.signOff}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Organization Chart */}
        {/* <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200">
              Hierarchy & Administration
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Organizational Chart
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Structure of the General Body and Administrative Executive Wings
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs overflow-x-auto">
            <div className="min-w-[680px] flex flex-col items-center text-center space-y-6">
              <div className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white px-6 py-3.5 rounded-2xl shadow-md font-bold text-sm w-80">
                General Body & Municipal President
                <div className="text-[11px] text-emerald-200 font-normal mt-0.5">
                  Smt. Surekha Nitin Jadhav
                </div>
              </div>

              <div className="w-0.5 h-6 bg-slate-300" />

              <div className="bg-white border-2 border-emerald-600 text-slate-900 px-6 py-3.5 rounded-2xl shadow-xs font-bold text-sm w-80">
                Chief Officer / Commissioner
                <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                  {about.communique?.officerName || "Shri. Pandit Patil (State Cadre)"}
                </div>
              </div>

              <div className="w-0.5 h-6 bg-slate-300" />

              <div className="grid grid-cols-4 gap-4 w-full">
                <div className="bg-emerald-50/50 border border-emerald-100 p-3.5 rounded-2xl">
                  <div className="font-bold text-xs text-slate-900">Health & Sanitation</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Dr. Sandeep Deshmukh</div>
                </div>
                <div className="bg-emerald-50/50 border border-emerald-100 p-3.5 rounded-2xl">
                  <div className="font-bold text-xs text-slate-900">Public Works (PWD)</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Er. Mahesh Kulkarni</div>
                </div>
                <div className="bg-emerald-50/50 border border-emerald-100 p-3.5 rounded-2xl">
                  <div className="font-bold text-xs text-slate-900">Water Supply</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Er. Rameshwar Kale</div>
                </div>
                <div className="bg-emerald-50/50 border border-emerald-100 p-3.5 rounded-2xl">
                  <div className="font-bold text-xs text-slate-900">Town Planning</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Ar. Sneha Joshi</div>
                </div>
              </div>
            </div>
          </div>
        </section> */}

        {/* Image Gallery */}
        {/* <section className="space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Lonavala Municipal Gallery
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Glimpses of our scenic hill station landscapes and municipal infrastructure
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {galleryImages.map((img, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs group hover:shadow-md transition-all"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={img.src}
                    alt={img.caption}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="25vw"
                  />
                </div>
                <div className="p-3 text-center text-xs font-semibold text-slate-800">
                  {img.caption}
                </div>
              </div>
            ))}
          </div>
        </section> */}
      </div>

      <div className="mt-16">
        <StatisticsSection />
      </div>
    </div>
  );
}
