"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

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

export function StateLeadership() {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger smooth staggered entrance animation on mount
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const leaders: LeaderCard[] = [
    {
      id: "cm",
      nameMr: "श्री. देवेंद्र फडणवीस",
      nameEn: "श्री. देवेंद्र फडणवीस",
      nameHi: "श्री देवेंद्र फडणवीस",
      titleMr: "माननीय मुख्यमंत्री",
      titleEn: "माननीय मुख्यमंत्री",
      titleHi: "माननीय मुख्यमंत्री",
      image: "/images/leaders/cm-devendra-fadnavis.jpg",
    },
    {
      id: "dcm1",
      nameMr: "श्री. एकनाथ शिंदे",
      nameEn: "श्री. एकनाथ शिंदे",
      nameHi: "श्री एकनाथ शिंदे",
      titleMr: "माननीय उपमुख्यमंत्री",
      titleEn: "माननीय उपमुख्यमंत्री",
      titleHi: "माननीय उपमुख्यमंत्री",
      image: "/images/leaders/dcm-eknath-shinde.jpg",
    },
    {
      id: "mp",
      nameMr: "श्रीमती सुनेत्रा पवार",
      nameEn: "श्रीमती सुनेत्रा पवार",
      nameHi: "श्रीमती सुनेत्रा पवार",
      titleMr: "माननीय खासदार",
      titleEn: "माननीय खासदार",
      titleHi: "माननीय खासदार",
      image: "/images/leaders/mp-sunetra-pawar.jpg",
    },
    {
      id: "mla",
      nameMr: "श्री. सुनील शेळके",
      nameEn: "श्री. सुनील शेळके",
      nameHi: "श्री सुनील शेळके",
      titleMr: "माननीय आमदार",
      titleEn: "माननीय आमदार",
      titleHi: "माननीय आमदार",
      image: "/images/leaders/mla-sunil-shelke.jpg",
    },
  ];

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

  return (
    <div className="relative z-20 -mt-16 sm:-mt-20 lg:-mt-24 mb-6 sm:mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {leaders.map((leader, index) => (
            <div
              key={leader.id}
              style={{
                transitionDelay: `${index * 140}ms`,
              }}
              className={`bg-white rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-100 p-5 sm:p-6 text-center flex flex-col items-center justify-center transition-all duration-700 ease-out transform ${
                isVisible
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 translate-y-8 scale-95"
              } hover:shadow-2xl hover:-translate-y-2 group cursor-default`}
            >
              {/* Dignitary Portrait with Classic Thick Gold Border Frame */}
              <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 relative border-[4.5px] border-[#B89658] bg-slate-50 shadow-sm mb-3.5 sm:mb-4 overflow-hidden rounded-xs group-hover:border-[#c9a765] group-hover:shadow-md transition-all duration-300">
                <div className="relative w-full h-full overflow-hidden bg-slate-100">
                  <Image
                    src={leader.image}
                    alt={getName(leader)}
                    fill
                    className="object-cover object-top group-hover:scale-106 transition-transform duration-500 ease-out"
                    sizes="(max-width: 640px) 140px, 180px"
                    priority
                  />
                </div>
              </div>

              {/* Dignitary Name */}
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug group-hover:text-emerald-800 transition-colors">
                {getName(leader)}
              </h3>

              {/* Designation / Position */}
              <p className="text-xs sm:text-sm text-slate-700 font-medium mt-1 leading-snug">
                {getTitle(leader)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
