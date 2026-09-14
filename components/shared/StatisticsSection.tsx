"use client";

import { Users, CheckCircle, Smartphone, Award, Trees, ShieldCheck } from "lucide-react";
import { MUNICIPAL_STATS } from "@/data/mockData";
import { useLanguage } from "@/context/LanguageContext";

export function StatisticsSection() {
  const { dict } = useLanguage();

  const stats = [
    {
      label: dict.stats.citizensServed.label,
      value: MUNICIPAL_STATS.population,
      sub: dict.stats.citizensServed.sub,
      icon: <Users className="w-5 h-5 text-emerald-700" />,
    },
    {
      label: dict.stats.resolutionSla.label,
      value: MUNICIPAL_STATS.grievanceResolvedPercent,
      sub: dict.stats.resolutionSla.sub,
      icon: <CheckCircle className="w-5 h-5 text-emerald-700" />,
    },
    {
      label: dict.stats.annualTourists.label,
      value: MUNICIPAL_STATS.touristsAnnual,
      sub: dict.stats.annualTourists.sub,
      icon: <Trees className="w-5 h-5 text-teal-700" />,
    },
    {
      label: dict.stats.digitalServices.label,
      value: MUNICIPAL_STATS.onlineServicesAvailable,
      sub: dict.stats.digitalServices.sub,
      icon: <Smartphone className="w-5 h-5 text-emerald-700" />,
    },
    {
      label: dict.stats.cleanRank.label,
      value: MUNICIPAL_STATS.cleanCityRank,
      sub: dict.stats.cleanRank.sub,
      icon: <Award className="w-5 h-5 text-amber-600" />,
    },
    {
      label: dict.stats.protectedArea.label,
      value: MUNICIPAL_STATS.areaSqKm,
      sub: dict.stats.protectedArea.sub,
      icon: <ShieldCheck className="w-5 h-5 text-emerald-700" />,
    },
  ];

  return (
    <section className="py-14 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {dict.stats.badge}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {dict.stats.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {dict.stats.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-lg hover:border-emerald-600/60 hover:-translate-y-1 transition-all duration-200 text-center group"
            >
              <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-50/80 border border-emerald-100 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                {item.icon}
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight group-hover:text-emerald-700 transition-colors">
                {item.value}
              </div>
              <div className="text-xs font-bold text-slate-700 mt-1">{item.label}</div>
              <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{item.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
