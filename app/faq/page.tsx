"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  HelpCircle,
  Search,
  ChevronDown,
  Phone,
  AlertCircle,
  // FileText,
  // Building2,
  // Droplets,
  // Receipt,
  // Sparkles,
  // ShieldCheck,
  // Compass,
  // ArrowRight,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { FaqItemDto, getFaqs } from "@/lib/services/faq.service";
// import { INITIAL_FAQS } from "@/data/faqData";

interface FaqEntry {
  id: string | number;
  question: string;
  answer: string;
  category: string;
  active: boolean;
}

const CATEGORIES = [
  "All",
  "Property Tax",
  "Water Supply",
  "Grievance & Complaints",
  "Certificates & Civil Records",
  "Tourism & Hill Station",
  "Trade & Commerce",
  "Town Planning & Environment",
];

export default function FaqPage() {
  const { dict } = useLanguage();
  const [faqs, setFaqs] = useState<FaqEntry[]>();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openIds, setOpenIds] = useState<Record<string | number, boolean>>({
    "faq-1": true,
  });

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const apiData = await getFaqs({ active: true });
        if (apiData && apiData.length > 0) {
          const mapped: FaqEntry[] = apiData
            .filter((item) => item.active !== false)
            .map((item) => ({
              id: item.id,
              question: item.question,
              answer: item.answer,
              category: item.category || "General Services",
              active: item.active,
            }));
          setFaqs(mapped);
        }
      } catch (err) {
        console.warn("Could not fetch FAQs from API, using default list:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const toggleAccordion = (id: string | number) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredFaqs = useMemo(() => {
    return (faqs || []).filter((faq) => {
      const matchCat =
        selectedCategory === "All" ||
        (faq.category && faq.category.toLowerCase() === selectedCategory.toLowerCase());
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        (faq.question && faq.question.toLowerCase().includes(q)) ||
        (faq.answer && faq.answer.toLowerCase().includes(q)) ||
        (faq.category && faq.category.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [faqs, selectedCategory, search]);

  return (
    <div className="min-h-screen bg-slate-50 pt-5 pb-16">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.15),transparent_50%)] pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Citizen Help & Knowledge Portal</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Frequently Asked Questions
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Find immediate answers regarding Property Tax rebates, Water bill connections, 
            Grievance resolution timelines, Tourism spots, and civic services in Lonavala.
          </p>

          {/* Search Box */}
          <div className="max-w-2xl mx-auto pt-2">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search queries (e.g., 'tax rebate', 'water connection', 'birth certificate')..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white text-slate-900 text-sm placeholder:text-slate-400 shadow-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 font-medium"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-8">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? "bg-emerald-700 text-white shadow-md shadow-emerald-700/20 scale-[1.02]"
                    : "bg-white text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200/90 shadow-2xs"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
          <span>
            Showing <strong className="text-emerald-700 font-bold">{filteredFaqs.length}</strong> questions
            {selectedCategory !== "All" && ` in ${selectedCategory}`}
          </span>
          {filteredFaqs.length > 0 && (
            <button
              type="button"
              onClick={() => {
                const allOpen: Record<string | number, boolean> = {};
                filteredFaqs.forEach((f) => {
                  allOpen[f.id] = true;
                });
                setOpenIds(allOpen);
              }}
              className="text-emerald-700 hover:text-emerald-800 font-bold hover:underline cursor-pointer"
            >
              Expand All
            </button>
          )}
        </div>

        {/* FAQ Accordion List */}
        {filteredFaqs.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <HelpCircle className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No matching questions found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We couldn't find any questions matching &ldquo;{search}&rdquo;. Try using different keywords or contact our 24x7 helpline.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedCategory("All");
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFaqs.map((faq, index) => {
              const isOpen = !!openIds[faq.id];
              return (
                <div
                  key={faq.id}
                  className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? "border-emerald-500/50 shadow-md ring-1 ring-emerald-500/20"
                      : "border-slate-200/90 shadow-2xs hover:border-slate-300"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full flex items-center justify-between p-5 text-left transition-colors cursor-pointer group"
                  >
                    <div className="flex items-start gap-3.5 pr-4">
                      <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 group-hover:bg-emerald-100 transition-colors">
                        Q{index + 1}
                      </span>
                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {faq.question}
                        </h3>
                        {faq.category && (
                          <span className="inline-block mt-1 text-[11px] font-semibold text-slate-400">
                            {faq.category}
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-emerald-600" : "group-hover:text-slate-600"
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-2 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Quick Contact & Escalation Help Box */}
        <div className="bg-gradient-to-br from-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl mt-12 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300 text-[11px] font-bold border border-emerald-400/30 inline-block">
                Still have unanswered questions?
              </span>
              <h2 className="text-xl sm:text-2xl font-black">
                We&apos;re here to help Lonavala citizens
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100 max-w-lg">
                Contact our 24x7 citizen helpline or register a direct grievance with guaranteed resolution tracking.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
              <a
                href="tel:18002330101"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-emerald-900 font-bold text-xs hover:bg-emerald-50 transition-all shadow-md active:scale-95"
              >
                <Phone className="w-4 h-4 text-emerald-700" />
                <span>Call 1800-233-0101</span>
              </a>

              <Link
                href="/grievance/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-700/80 hover:bg-emerald-600 text-white font-bold text-xs border border-emerald-500/40 transition-all shadow-md active:scale-95"
              >
                <AlertCircle className="w-4 h-4 text-emerald-200" />
                <span>Register Grievance</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
