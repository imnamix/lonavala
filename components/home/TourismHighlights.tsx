"use client";

import Image from "next/image";
import Link from "next/link";
import { CloudRain, MapPin, ArrowRight, Star, Compass } from "lucide-react";
import { TOURISM_SPOTS } from "@/data/mockData";
import { useLanguage } from "@/context/LanguageContext";

export function TourismHighlights() {
  const { dict } = useLanguage();
  const featuredSpots = TOURISM_SPOTS.slice(0, 4);

  const spotMap: Record<string, "tigerPoint" | "bhushiDam" | "karlaCaves" | "rajmachi"> = {
    "spot-tiger-point": "tigerPoint",
    "spot-bushi-dam": "bhushiDam",
    "spot-karla-caves": "karlaCaves",
    "spot-rajmachi": "rajmachi",
  };

  return (
    <section className="py-16 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
              <Compass className="w-3.5 h-3.5 text-emerald-600" />
              <span>{dict.tourism.badge}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              {dict.tourism.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
              {dict.tourism.subtitle}
            </p>
          </div>

          {/* Weather Widget */}
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-xs shrink-0">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <CloudRain className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">{dict.tourism.weatherCity}</div>
              <div className="text-[11px] text-emerald-700 font-semibold">{dict.tourism.ghatsStatus}</div>
            </div>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredSpots.map((spot) => {
            const spotKey = spotMap[spot.id];
            const localized = spotKey ? dict.tourism.spots[spotKey] : null;
            const spotName = localized?.name || spot.name;
            const spotDesc = localized?.desc || spot.description;

            return (
              <div
                key={spot.id}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-600/60 hover:-translate-y-1 transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                    <Image
                      src={spot.image}
                      alt={spotName}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-xs text-slate-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span>{spot.rating}</span>
                    </div>
                    <div className="absolute bottom-2.5 left-3 text-white text-[11px] font-semibold flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      <span>{spot.distanceFromStation.split(" ")[0]} km</span>
                    </div>
                  </div>

                  <div className="p-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      {spot.category}
                    </span>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 mt-1.5 mb-1.5 group-hover:text-emerald-700 transition-colors line-clamp-1">
                      {spotName}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                      {spotDesc}
                    </p>
                    <div className="text-[11px] text-slate-600 font-medium bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/70 truncate">
                      🕒 {spot.timings}
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <Link
                    href="/tourism"
                    className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-gradient-to-r hover:from-emerald-700 hover:to-teal-700 hover:text-white text-emerald-800 font-bold text-xs flex items-center justify-center gap-1 transition-all border border-slate-200/80"
                  >
                    <span>{dict.common.details}</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/tourism"
            className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 hover:text-emerald-700 hover:underline"
          >
            <span>{dict.tourism.viewAllSpots}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
