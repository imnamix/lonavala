"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Quote, Sparkles, MapPin, Building2, Trees } from "lucide-react";
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
      "लोणावळा व मावळ परिसराचा सर्वांगीण विकास, पर्यटन क्षेत्राचा सुनियोजित विस्तार आणि सर्व नागरिकांना पारदर्शक, दर्जेदार मूलभूत नागरी सुविधा उपलब्ध करून देणे हेच आमचे प्रमुख ध्येय आहे. लोणावळ्याच्या निरंतर प्रगतीसाठी व समृद्धीसाठी आम्ही सदैव कटिबद्ध आहोत.",
    messageEn:
      "Our foremost priority is the comprehensive development of Lonavala and the Maval region, the planned expansion of world-class tourism infrastructure, and delivering prompt, quality civic services to every citizen. Committed to a clean, prosperous, and progressive Lonavala.",
    messageHi:
      "लोनावला एवं मावल क्षेत्र का सर्वांगीण विकास, पर्यटन का सुव्यवस्थित विस्तार और प्रत्येक नागरिक को पारदर्शी व उत्कृष्ट मूलभूत नागरिक सुविधाएं उपलब्ध कराना ही हमारा मुख्य लक्ष्य है। लोनावला की निरंतर प्रगति और समृद्धि के लिए हम सदैव समर्पित हैं.",
    focusMr: ["शाश्वत पर्यटन विकास", "पायाभूत सुविधा सक्षमीकरण", "नागरी सेवा व सुविधा"],
    focusEn: ["Sustainable Tourism", "Infrastructure Upgradation", "Civic Services"],
    focusHi: ["सतत पर्यटन विकास", "बुनियादी ढांचा सुदृढ़ीकरण", "नागरिक सेवाएं"],
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

  return (
    <div className="relative z-20 -mt-16 sm:-mt-20 lg:-mt-24 mb-6 sm:mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* State Leadership 4 Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {leaders.map((leader, index) => (
            <div
              key={leader.id}
              style={{
                transitionDelay: `${index * 140}ms`,
              }}
              className={`bg-white rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-100 py-3.5 px-4 sm:py-4 sm:px-5 text-center flex flex-col items-center justify-center transition-all duration-700 ease-out transform ${isVisible
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 translate-y-8 scale-95"
                } hover:shadow-2xl hover:-translate-y-2 group cursor-default`}
            >
              {/* Dignitary Portrait with Classic Thick Gold Border Frame */}
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

        {/* Local MLA Sunil Shelke Profile & Message Card */}
        <div
          style={{ transitionDelay: "560ms" }}
          className={`mt-6 sm:mt-8 max-w-6xl mx-auto bg-white rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-100 overflow-hidden p-5 sm:p-6 md:p-7 transition-all duration-700 ease-out transform ${isVisible
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-8 scale-95"
            } hover:shadow-2xl`}
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-5 sm:gap-6 lg:gap-7">
            {/* Left: Dignitary Portrait */}
            <div className="shrink-0 flex flex-col items-center">
              <div className="w-40 h-52 sm:w-48 sm:h-60 md:w-52 md:h-64 relative border-[4px] border-[#B89658] bg-slate-50 shadow-md overflow-hidden rounded-lg group hover:border-[#c9a765] transition-all duration-300">
                <Image
                  src={mlaData.image}
                  alt={currentMlaName}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 640px) 180px, 240px"
                  priority
                />
              </div>
            </div>

            {/* Right: Name, Position, Message & Focus Areas */}
            <div className="flex-1 text-center md:text-left flex flex-col justify-center">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                  {currentMlaBadge}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                {currentMlaName}
              </h3>

              <p className="text-sm sm:text-base font-semibold text-emerald-800 mt-1">
                {currentMlaTitle}
              </p>

              {/* Message Box */}
              <div className="mt-3.5 sm:mt-4 p-4 sm:p-5 rounded-xl bg-slate-50/90 border border-slate-200/70 relative">
                <Quote className="w-5 h-5 sm:w-6 sm:h-6 text-[#B89658]/40 absolute top-3.5 left-3.5 -scale-x-100 hidden sm:block" />
                <p className="text-xs sm:text-sm md:text-base text-slate-700 leading-relaxed sm:pl-7 italic font-medium">
                  &ldquo;{currentMlaMessage}&rdquo;
                </p>
              </div>

              {/* Key Highlights / Pillars */}
              <div className="mt-3.5 flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-2.5">
                {currentMlaFocus.map((focusItem, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 px-2.5 py-1 rounded-md shadow-2xs"
                  >
                    {idx === 0 ? (
                      <Trees className="w-3.5 h-3.5 text-emerald-600" />
                    ) : idx === 1 ? (
                      <Building2 className="w-3.5 h-3.5 text-blue-600" />
                    ) : (
                      <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    )}
                    {focusItem}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

