"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { Language, Translations, translations } from "@/lib/translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  dict: Translations;
  t: (keyPath: string, fallback?: string) => string;
  localize: (options: { en: string; mr?: string; hi?: string }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "lmc_language";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem(STORAGE_KEY) as Language | null;
      if (savedLang && (savedLang === "en" || savedLang === "mr" || savedLang === "hi")) {
        setLanguageState(savedLang);
        document.documentElement.lang = savedLang;
      }
    } catch {
      // Ignore storage access errors if blocked
    }
    setMounted(true);
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
      document.documentElement.lang = lang;
    } catch {
      // Ignore storage errors
    }
  }, []);

  const dict = translations[language] || translations.en;

  const t = useCallback(
    (keyPath: string, fallback?: string): string => {
      const keys = keyPath.split(".");
      let current: any = dict;
      for (const k of keys) {
        if (current && typeof current === "object" && k in current) {
          current = current[k];
        } else {
          return fallback || keyPath;
        }
      }
      return typeof current === "string" ? current : fallback || keyPath;
    },
    [dict]
  );

  const localize = useCallback(
    ({ en, mr, hi }: { en: string; mr?: string; hi?: string }): string => {
      if (language === "mr") return mr || en;
      if (language === "hi") return hi || mr || en;
      return en;
    },
    [language]
  );

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        dict,
        t,
        localize,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback if accessed outside provider during static generation
    return {
      language: "en",
      setLanguage: () => {},
      dict: translations.en,
      t: (keyPath: string, fallback?: string) => fallback || keyPath,
      localize: ({ en }: { en: string }) => en,
    };
  }
  return context;
}
