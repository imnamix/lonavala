"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CloudRain, MapPin, ArrowRight, Compass, Tag } from "lucide-react";
import { TourismDestination, INITIAL_TOURISM_DESTINATIONS } from "@/data/tourismData";
import { getTourismSpots } from "@/lib/services/tourism.service";
import { useLanguage } from "@/context/LanguageContext";
import { useAutoTranslate } from "@/hooks/useAutoTranslation";

function TourismSpotCard({
  spot,
  dict,
  language,
}: {
  spot: TourismDestination;
  dict: any;
  language: string;
}) {
  const spotName = useAutoTranslate(spot.name, (spot as any).nameMr);
  const spotDesc = useAutoTranslate(spot.description, (spot as any).descriptionMr);
  const spotLabel = useAutoTranslate(spot.label, (spot as any).labelMr);
  const spotDistance = useAutoTranslate(spot.distance, (spot as any).distanceMr);

  const highlightKey = spot.highlights?.[0]?.key;
  const highlightVal = spot.highlights?.[0]?.value;
  const translatedHKey = useAutoTranslate(highlightKey);
  const translatedHVal = useAutoTranslate(highlightVal);

  const importantText = spot.importantPoints?.[0]?.text;
  const translatedImportantText = useAutoTranslate(importantText);

  return (
    <div
      className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-600/60 hover:-translate-y-1 transition-all duration-200 group flex flex-col justify-between"
    >
      <div>
        <Link href={`/tourism/${spot.id}`} className="block relative h-44 w-full overflow-hidden bg-slate-100 cursor-pointer">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              spot.imageUrl ||
              "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
            }
            alt={spotName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          {spotLabel && (
            <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-xs text-slate-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
              <Tag className="w-3 h-3 text-emerald-600" />
              <span>{spotLabel}</span>
            </div>
          )}
          {spotDistance && (
            <div className="absolute bottom-2.5 left-3 text-white text-[11px] font-semibold flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="truncate max-w-[180px]">{spotDistance}</span>
            </div>
          )}
        </Link>

        <div className="p-4">
          <Link href={`/tourism/${spot.id}`}>
            <h3 className="font-bold text-sm sm:text-base text-slate-900 mt-1 mb-1.5 group-hover:text-emerald-700 transition-colors line-clamp-1 cursor-pointer">
              {spotName}
            </h3>
          </Link>
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
            {spotDesc}
          </p>
          {spot.highlights?.[0] ? (
            <div className="text-[11px] text-slate-600 font-medium bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/70 truncate">
              ★ {translatedHKey}: {translatedHVal}
            </div>
          ) : spot.importantPoints?.[0] ? (
            <div className="text-[11px] text-slate-600 font-medium bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/70 truncate">
              ℹ {translatedImportantText}
            </div>
          ) : null}
        </div>
      </div>

      <div className="p-4 pt-0">
        <Link
          href={`/tourism/${spot.id}`}
          className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-gradient-to-r hover:from-emerald-700 hover:to-teal-700 hover:text-white text-emerald-800 font-bold text-xs flex items-center justify-center gap-1 transition-all border border-slate-200/80 cursor-pointer"
        >
          <span>{dict.common?.details || "तपशील"}</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}

export function TourismHighlights() {
  const { dict, language } = useLanguage();
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
              <span>{dict.tourism.badge || "हिल स्टेशन व पर्यटन"}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              {dict.tourism.title || "लोणावळ्याची प्रमुख पर्यटन स्थळे"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
              {dict.tourism.subtitle || "सह्याद्रीचे नयनरम्य डोंगरमाथे, फेसाळणारे धबधबे आणि ऐतिहासिक लेणी."}
            </p>
          </div>

          {/* Weather Widget */}
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-xs shrink-0">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <CloudRain className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">{dict.tourism.weatherCity || "लोणावळा २२°से"}</div>
              <div className="text-[11px] text-emerald-700 font-semibold">{dict.tourism.ghatsStatus || "घाटमार्ग खुला"}</div>
            </div>
          </div>
        </div>

        {/* 4 Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs animate-pulse flex flex-col justify-between"
              >
                <div>
                  <div className="h-44 w-full bg-slate-200 relative">
                    <div className="absolute top-2.5 left-2.5 h-5 w-16 bg-slate-300/80 rounded-full" />
                    <div className="absolute bottom-2.5 left-3 h-4 w-28 bg-slate-300/80 rounded" />
                  </div>
                  <div className="p-4 space-y-2.5">
                    <div className="h-4.5 bg-slate-200 rounded-md w-3/4 mb-1" />
                    <div className="h-3 bg-slate-100 rounded w-full" />
                    <div className="h-3 bg-slate-100 rounded w-5/6" />
                    <div className="h-6 bg-slate-100 rounded-lg w-full mt-2" />
                  </div>
                </div>
                <div className="p-4 pt-0">
                  <div className="h-9 bg-slate-100 rounded-xl w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {spots.map((spot) => (
              <TourismSpotCard
                key={spot.id}
                spot={spot}
                dict={dict}
                language={language}
              />
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/tourism"
            className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 hover:text-emerald-700 hover:underline"
          >
            <span>{dict.tourism.viewAllSpots || "सर्व पर्यटन स्थळे पहा"}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

