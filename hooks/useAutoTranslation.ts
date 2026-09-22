"use client";

import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import {
  translateToMarathi,
  translateBatchToMarathi,
  getCachedMarathi,
  isDevanagari,
} from "@/lib/services/translate.service";

/**
 * Common category translations for quick synchronous lookup
 */
export const CATEGORY_TRANSLATIONS: Record<string, string> = {
  // Notices
  All: "सर्व",
  Notices: "सूचना",
  Circulars: "परिपत्रके",
  Orders: "आदेश",
  News: "बातम्या",
  Events: "कार्यक्रम",
  Gazettes: "राजपत्रे",
  // Services
  "TAX & REVENUE": "कर व महसूल",
  "WATER SUPPLY": "पाणी पुरवठा",
  "CIVIL REGISTRATION": "नागरी नोंदणी",
  "PLANNING & PERMITS": "नगररचना व परवानग्या",
  "COMMERCIAL LICENSES": "व्यापार परवाने",
  "SAFETY & CLEARANCES": "सुरक्षा व ना-हरकत",
  "DIGITAL PAYMENTS": "डिजिटल देयके",
  "HEALTH & SANITATION": "आरोग्य व स्वच्छता",
  // Projects
  Infrastructure: "पायाभूत सुविधा",
  Sanitation: "स्वच्छता व सांडपाणी",
  Tourism: "पर्यटन विकास",
  Healthcare: "आरोग्य व वैद्यकीय",
  Roads: "रस्ते व वाहतूक",
  Water: "जलपुरवठा प्रकल्प",
  Environment: "पर्यावरण व संवर्धन",
  Education: "शिक्षण व क्रीडा",
};

/**
 * Common status translations for quick synchronous lookup
 */
export const STATUS_TRANSLATIONS: Record<string, string> = {
  Ongoing: "चालू काम",
  Completed: "पूर्ण",
  Upcoming: "प्रस्तावित",
  Pending: "प्रलंबित",
  Approved: "मंजूर",
  Published: "प्रकाशित",
  Draft: "मसुदा",
  Review: "पुनरावलोकन",
  Active: "सक्रिय",
  Closed: "बंद",
};

/**
 * Translates a single text string to Marathi if in Marathi mode and no Marathi text is given.
 */
export function useAutoTranslate(
  enText?: string,
  mrText?: string,
  overrideLang?: string
): string {
  const { language } = useLanguage();
  const currentLang = overrideLang || language;

  const rawEn = (enText || "").trim();
  const rawMr = (mrText || "").trim();

  // Always invoke hooks unconditionally at the top level
  const syncCache = getCachedMarathi(rawEn);
  const [translated, setTranslated] = useState<string>(syncCache || rawEn);

  useEffect(() => {
    if (currentLang !== "mr" || !rawEn || rawMr || isDevanagari(rawEn)) {
      return;
    }

    if (CATEGORY_TRANSLATIONS[rawEn] || STATUS_TRANSLATIONS[rawEn]) {
      return;
    }

    const cached = getCachedMarathi(rawEn);
    if (cached) {
      setTranslated(cached);
      return;
    }

    let isMounted = true;
    translateToMarathi(rawEn)
      .then((res) => {
        if (isMounted && res) {
          setTranslated(res);
        }
      })
      .catch((err) => {
        console.warn("useAutoTranslate failed:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [rawEn, rawMr, currentLang]);

  // If not Marathi mode, return English
  if (currentLang !== "mr") {
    return rawEn || rawMr;
  }

  // If Marathi text is explicitly provided and non-empty, use it directly
  if (rawMr) {
    return rawMr;
  }

  // If English text is already in Devanagari script, return as is
  if (isDevanagari(rawEn)) {
    return rawEn;
  }

  // Check category or status dictionary mappings first
  if (CATEGORY_TRANSLATIONS[rawEn]) {
    return CATEGORY_TRANSLATIONS[rawEn];
  }
  if (STATUS_TRANSLATIONS[rawEn]) {
    return STATUS_TRANSLATIONS[rawEn];
  }

  return syncCache || translated || rawEn;
}

/**
 * Batch translation hook for collections of objects
 */
export function useBatchTranslate<T extends { id: string | number }>(
  items: T[],
  getFieldEn: (item: T) => string,
  getFieldMr?: (item: T) => string | undefined,
  overrideLang?: string
): Record<string | number, string> {
  const { language } = useLanguage();
  const currentLang = overrideLang || language;
  const [translatedMap, setTranslatedMap] = useState<Record<string | number, string>>({});
  const prevItemsRef = useRef<string>("");

  useEffect(() => {
    if (currentLang !== "mr" || !items || items.length === 0) {
      return;
    }

    const itemsKey = items.map((it) => `${it.id}:${getFieldEn(it)}`).join("|");
    if (prevItemsRef.current === itemsKey && Object.keys(translatedMap).length > 0) {
      return;
    }
    prevItemsRef.current = itemsKey;

    const newMap: Record<string | number, string> = {};
    const textsToTranslate: string[] = [];
    const itemIdsToTranslate: (string | number)[] = [];

    items.forEach((item) => {
      const en = (getFieldEn(item) || "").trim();
      const mr = (getFieldMr ? getFieldMr(item) : "") || "";

      if (mr.trim()) {
        newMap[item.id] = mr.trim();
        return;
      }
      if (!en) {
        newMap[item.id] = "";
        return;
      }
      if (isDevanagari(en)) {
        newMap[item.id] = en;
        return;
      }
      if (CATEGORY_TRANSLATIONS[en]) {
        newMap[item.id] = CATEGORY_TRANSLATIONS[en];
        return;
      }
      if (STATUS_TRANSLATIONS[en]) {
        newMap[item.id] = STATUS_TRANSLATIONS[en];
        return;
      }

      const cached = getCachedMarathi(en);
      if (cached) {
        newMap[item.id] = cached;
      } else {
        textsToTranslate.push(en);
        itemIdsToTranslate.push(item.id);
        newMap[item.id] = en; // fallback initially
      }
    });

    setTranslatedMap(newMap);

    if (textsToTranslate.length > 0) {
      let isMounted = true;
      translateBatchToMarathi(textsToTranslate)
        .then((translatedArray) => {
          if (!isMounted) return;
          setTranslatedMap((prev) => {
            const updated = { ...prev };
            itemIdsToTranslate.forEach((id, idx) => {
              if (translatedArray[idx]) {
                updated[id] = translatedArray[idx];
              }
            });
            return updated;
          });
        })
        .catch((err) => {
          console.warn("useBatchTranslate batch fetch failed:", err);
        });

      return () => {
        isMounted = false;
      };
    }
  }, [items, currentLang, getFieldEn, getFieldMr]);

  return translatedMap;
}

/**
 * Utility helper to translate a known status or fall back
 */
export function getLocalizedStatus(status: string, lang: string): string {
  if (lang === "mr" && STATUS_TRANSLATIONS[status]) {
    return STATUS_TRANSLATIONS[status];
  }
  return status;
}

/**
 * Utility helper to translate a known category or fall back
 */
export function getLocalizedCategory(category: string, lang: string): string {
  if (lang === "mr" && CATEGORY_TRANSLATIONS[category]) {
    return CATEGORY_TRANSLATIONS[category];
  }
  return category;
}
