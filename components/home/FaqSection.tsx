"use client";

import { useState, useEffect } from "react";
import { ChevronDown, HelpCircle, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { FaqItemDto, getFaqs } from "@/lib/services/faq.service";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { dict } = useLanguage();
  const [faqs, setFaqs] = useState<FaqItemDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFaqs() {
      try {
        setLoading(true);
        const data = await getFaqs({ active: true });
        setFaqs(data.filter((f) => f.active));
      } catch (err) {
        console.warn("Failed to load FAQs for homepage:", err);
      } finally {
        setLoading(false);
      }
    }
    loadFaqs();
  }, []);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-16 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>{dict.faq?.badge || "Citizen Help & FAQ"}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {dict.faq?.title || "Frequently Asked Questions"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {dict.faq?.subtitle || "Find answers to citizen queries, property taxes, water supply, and municipal services."}
          </p>
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2 text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="text-xs font-semibold text-gray-500">Loading citizen FAQs...</span>
          </div>
        ) : faqs.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400 text-xs">
            <HelpCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="font-semibold text-gray-600">No FAQs currently available</p>
          </div>
        ) : (
          <div className="space-y-3">
            {faqs.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggle(idx)}
                    className="w-full flex items-center justify-between p-5 text-left text-sm sm:text-base font-bold text-slate-900 hover:text-emerald-700 transition-colors cursor-pointer"
                  >
                    <span className="pr-4">{item.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-emerald-600" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 animate-in fade-in duration-150">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
