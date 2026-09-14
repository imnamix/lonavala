"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Compass,
  Star,
  MapPin,
  Clock,
  IndianRupee,
  CloudSun,
  ShieldAlert,
  Sparkles,
  Info,
  Camera,
  Calendar,
  Waves,
  Mountain,
} from "lucide-react";
import { TOURISM_SPOTS } from "@/data/mockData";

export default function TourismPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = [
    "All",
    "Attractions",
    "Forts",
    "Waterfalls",
    "Lakes",
    "Parks",
    "Caves",
  ];

  const filteredSpots =
    selectedCategory === "All"
      ? TOURISM_SPOTS
      : TOURISM_SPOTS.filter((s) => s.category === selectedCategory);

  const festivals = [
    {
      title: "Rajmachi Fireflies Festival",
      period: "May - June (Pre-Monsoon)",
      desc: "Millions of bioluminescent fireflies illuminate the dense forests and trails around Rajmachi Fort in a breathtaking natural spectacle.",
      icon: "✨",
    },
    {
      title: "Ganeshotsav & Hill Station Rath Yatra",
      period: "August - September",
      desc: "Vibrant community celebrations across Lonavala bazaar with traditional Dhol Tasha troupes, eco-friendly visarjan, and night illuminations.",
      icon: "🐘",
    },
    {
      title: "Ekvira Aai Chaitra Navratri Fair",
      period: "April (Chaitra Navratri)",
      desc: "Grand pilgrimage at Karla Caves with thousands of Agri-Koli devotees seeking blessings of Goddess Ekvira Aai atop the historic hill.",
      icon: "🛕",
    },
    {
      title: "Monsoon Mist Marathon & Hill Run",
      period: "July - August",
      desc: "Scenic endurance run along the winding Tiger Point and Khandala ghat routes attracting avid runners from across India.",
      icon: "🏃",
    },
  ];

  const visitorGuidelines = [
    {
      title: "Water Safety at Bhushi & Dams",
      desc: "Strictly adhere to warning flags. Entry into deep water beyond barricades is prohibited. Avoid drinking alcohol or swimming alone.",
    },
    {
      title: "Fog & Ghat Road Driving",
      desc: "Drive with low-beam headlights and hazard indicators during dense monsoon fog. Maintain safe following distance on hairpin turns.",
    },
    {
      title: "Eco-Sensitive Zone (ESZ) Regulations",
      desc: "Lonavala is a plastic-free protected zone. Littering or throwing plastic bottles into valley gorges invites steep fines.",
    },
    {
      title: "Trekking & Fort Safety",
      desc: "Wear slip-resistant trekking shoes. Avoid cliff selfies during high wind gusts at Tiger Point and Duke's Nose.",
    },
  ];

  return (
    <div className="py-10">
      {/* Hero Banner */}
      <div className="relative h-[380px] sm:h-[460px] flex items-center justify-center overflow-hidden mb-12 -mt-6">
        <Image
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80"
          alt="Lonavala Tourism Panorama"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />

        <div className="relative z-10 text-center max-w-3xl px-4 text-white space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-emerald-200 text-xs font-bold border border-white/30">
            <Compass className="w-4 h-4" />
            <span>Maharashtra&apos;s Premier Hill Sanctuary</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Explore Scenic Lonavala & Khandala
          </h1>
          <p className="text-xs sm:text-base text-emerald-100 max-w-xl mx-auto leading-relaxed">
            Perched 624m high amidst misty clouds, roaring waterfalls, prehistoric caves, and towering Maratha bastions.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Category Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#D9E8DD] pb-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none pb-2 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-[#2E8B57] text-white shadow-xs"
                    : "bg-white border border-[#D9E8DD] text-gray-700 hover:bg-[#E8F5E9] hover:text-[#2E8B57]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="text-xs text-gray-500 font-semibold shrink-0">
            Showing <strong className="text-[#2E8B57]">{filteredSpots.length}</strong> Destinations
          </div>
        </div>

        {/* Large Image Cards Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSpots.map((spot) => (
            <div
              key={spot.id}
              className="bg-white rounded-2xl border border-[#D9E8DD] overflow-hidden shadow-xs hover:shadow-xl hover:border-[#2E8B57] transition-all group flex flex-col justify-between"
            >
              <div>
                {/* Large Image Header */}
                <div className="relative h-64 w-full overflow-hidden bg-gray-100">
                  <Image
                    src={spot.image}
                    alt={spot.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs text-[#1F2937] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{spot.rating}</span>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-[#2E8B57] px-2.5 py-0.5 rounded">
                      {spot.category}
                    </span>
                    <h3 className="text-lg font-bold mt-1 text-white leading-tight">
                      {spot.name}
                    </h3>
                  </div>
                </div>

                {/* Spot Details */}
                <div className="p-6 space-y-4">
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {spot.description}
                  </p>

                  <div className="space-y-2 bg-[#F8FCF9] p-3.5 rounded-xl border border-[#D9E8DD] text-xs text-gray-700">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#2E8B57] shrink-0" />
                      <span>{spot.timings}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IndianRupee className="w-4 h-4 text-[#2E8B57] shrink-0" />
                      <span>{spot.entryFee}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#2E8B57] shrink-0" />
                      <span>{spot.distanceFromStation}</span>
                    </div>
                  </div>

                  {/* Highlights Bullet List */}
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-1.5">
                      Highlights:
                    </span>
                    <div className="space-y-1">
                      {spot.highlights.map((h, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-xs text-gray-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2E8B57] shrink-0" />
                          <span className="line-clamp-1">{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <div className="text-[11px] text-gray-500 font-medium border-t border-gray-100 pt-3 flex items-center justify-between">
                  <span>Best: {spot.bestTimeToVisit.split("(")[0]}</span>
                  <span className="text-[#2E8B57] font-bold">LMC Verified Spot</span>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Hill Station Festivals & Cultural Events */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2E8B57] bg-[#E8F5E9] px-3 py-1 rounded-full border border-[#D9E8DD]">
              Culture & Celebrations
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2937] mt-2">
              Annual Festivals & Experiences
            </h2>
            <p className="text-xs text-gray-600 mt-1">
              Immerse yourself in unique seasonal spectacles and cultural pilgrimages in the hills.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {festivals.map((fest, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-[#D9E8DD] shadow-xs hover:border-[#2E8B57] transition-all space-y-3"
              >
                <div className="text-3xl">{fest.icon}</div>
                <h3 className="font-bold text-sm sm:text-base text-[#1F2937]">{fest.title}</h3>
                <div className="text-[11px] font-bold text-[#2E8B57] bg-[#E8F5E9] px-2.5 py-1 rounded-lg inline-block">
                  {fest.period}
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{fest.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Visitor Information & Safety Advisories */}
        <section className="bg-white rounded-3xl border border-[#D9E8DD] p-8 sm:p-10 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-[#1F2937]">
                Visitor Safety & Hill Station Regulations
              </h3>
              <p className="text-xs text-gray-500">Issued by LMC Disaster Management & Pune Police</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {visitorGuidelines.map((guide, idx) => (
              <div key={idx} className="bg-[#F8FCF9] p-4 rounded-xl border border-[#D9E8DD] space-y-1.5">
                <h4 className="text-xs font-bold text-[#1F2937] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#2E8B57]" />
                  {guide.title}
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">{guide.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-[#E8F5E9] p-4 rounded-xl border border-[#D9E8DD] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="text-gray-800">
              <strong>Need Emergency Assistance on Tour?</strong> Call Lonavala Disaster Helpline:{" "}
              <a href="tel:18002330101" className="text-[#2E8B57] font-bold underline">
                1800-233-0101
              </a>{" "}
              (Toll Free 24x7)
            </div>
            <a
              href="tel:112"
              className="px-4 py-2 rounded-lg bg-[#2E8B57] text-white font-bold shrink-0 hover:bg-[#246E45]"
            >
              Dial 112 Police
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
