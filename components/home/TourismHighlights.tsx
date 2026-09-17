"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CloudRain, MapPin, ArrowRight, Compass, Tag, Loader2 } from "lucide-react";
import { TourismDestination, INITIAL_TOURISM_DESTINATIONS } from "@/data/tourismData";
import { getTourismSpots } from "@/lib/services/tourism.service";
import { useLanguage } from "@/context/LanguageContext";

export function TourismHighlights() {
  const { dict } = useLanguage();
  const [spots, setSpots] = useState<TourismDestination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await getTourismSpots({ active: true });
        if (data && data.length > 0) {
          setSpots(data.filter((d) => d.active).slice(0, 4));
        } else {
          setSpots(INITIAL_TOURISM_DESTINATIONS.slice(0, 4));
        }
      } catch (err) {
        console.warn("Failed to load tourism spots for homepage, using fallback:", err);
        setSpots(INITIAL_TOURISM_DESTINATIONS.slice(0, 4));
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <section className="py-16 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
              <Compass className="w-3.5 h-3.5 text-emerald-600" />
              <span>{dict.tourism.badge || "Hill Station & Tourism"}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              {dict.tourism.title || "Scenic Attractions & Landmarks"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
              {dict.tourism.subtitle || "Explore top destinations, breathtaking valley viewpoints, ancient caves, and cascading waterfalls."}
            </p>
          </div>

          {/* Weather Widget */}
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-xs shrink-0">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <CloudRain className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">{dict.tourism.weatherCity || "Lonavala 22°C"}</div>
              <div className="text-[11px] text-emerald-700 font-semibold">{dict.tourism.ghatsStatus || "Ghats Open & Clear"}</div>
            </div>
          </div>
        </div>

        {/* 4 Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs animate-pulse flex flex-col justify-between h-80"
              >
                <div className="h-44 bg-slate-200" />
                <div className="p-4 space-y-2.5">
                  <div className="h-3 bg-slate-200 rounded w-1/3" />
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 rounded w-full" />
                </div>
                <div className="p-4 pt-0">
                  <div className="h-8 bg-slate-200 rounded-xl w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {spots.map((spot) => (
              <div
                key={spot.id}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-600/60 hover:-translate-y-1 transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        spot.imageUrl ||
                        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
                      }
                      alt={spot.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    {spot.label && (
                      <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-xs text-slate-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                        <Tag className="w-3 h-3 text-emerald-600" />
                        <span>{spot.label}</span>
                      </div>
                    )}
                    {spot.distance && (
                      <div className="absolute bottom-2.5 left-3 text-white text-[11px] font-semibold flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span className="truncate max-w-[180px]">{spot.distance}</span>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 mt-1 mb-1.5 group-hover:text-emerald-700 transition-colors line-clamp-1">
                      {spot.name}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                      {spot.description}
                    </p>
                    {spot.highlights?.[0] ? (
                      <div className="text-[11px] text-slate-600 font-medium bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/70 truncate">
                        ★ {spot.highlights[0].key}: {spot.highlights[0].value}
                      </div>
                    ) : spot.importantPoints?.[0] ? (
                      <div className="text-[11px] text-slate-600 font-medium bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/70 truncate">
                        ℹ {spot.importantPoints[0].text}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <Link
                    href="/tourism"
                    className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-gradient-to-r hover:from-emerald-700 hover:to-teal-700 hover:text-white text-emerald-800 font-bold text-xs flex items-center justify-center gap-1 transition-all border border-slate-200/80"
                  >
                    <span>{dict.common?.details || "View Details"}</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/tourism"
            className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 hover:text-emerald-700 hover:underline"
          >
            <span>{dict.tourism.viewAllSpots || "Explore All Tourism Destinations"}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
