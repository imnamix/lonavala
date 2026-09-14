"use client";

import { useState } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Language } from "@/lib/translations";

export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage } = useLanguage();

  const languages: { code: Language; label: string; native: string }[] = [
    { code: "en", label: "English", native: "English" },
    { code: "mr", label: "Marathi", native: "मराठी" },
    { code: "hi", label: "Hindi", native: "हिन्दी" },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-9 inline-flex items-center gap-1.5 px-3 text-xs font-semibold rounded-xl border border-slate-200 bg-white/90 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-all shadow-2xs"
        aria-label="Switch Language"
      >
        <Globe className="w-3.5 h-3.5 text-emerald-600" />
        <span>{languages.find((l) => l.code === language)?.native}</span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-1.5 w-36 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors ${
                  language === lang.code
                    ? "bg-emerald-50 text-emerald-700 font-semibold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span>{lang.native}</span>
                {language === lang.code && <Check className="w-3.5 h-3.5 text-emerald-600" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
