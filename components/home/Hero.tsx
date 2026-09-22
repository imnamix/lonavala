"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Search,
  ArrowRight,
  ShieldCheck,
  PhoneCall,
  Sparkles,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Bell,
  DollarSign,
  FileText,
  HelpCircle,
  Building2,
  MapPin,
  Tag as TagIcon,
  Leaf,
  TreePine,
  Mountain,
  Droplets,
  Zap,
  Sun,
  Award,
  FileCheck,
  Waves,
  Landmark,
  Compass,
  Hammer,
  LayoutGrid,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { getHomepageData, HeroSlide, HomepageData } from "@/lib/services/homepage.service";
import { useAutoTranslate, useBatchTranslate } from "@/hooks/useAutoTranslation";

const ICON_MAP: { [key: string]: any } = {
  AlertCircle,
  DollarSign,
  FileText,
  PhoneCall,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  HelpCircle,
  Sparkles,
  Building2,
  MapPin,
  TagIcon,
  Tag: TagIcon,
  Leaf,
  TreePine,
  Mountain,
  Droplets,
  Zap,
  Sun,
  Award,
  FileCheck,
  Waves,
  Landmark,
  Compass,
  Hammer,
  LayoutGrid,
  Search,
};

const BUTTON_COLOR_CLASSES: { [key: string]: string } = {
  Emerald:
    "bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white shadow-xl shadow-emerald-950/40 border border-emerald-400/30",
  primary:
    "bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white shadow-xl shadow-emerald-950/40 border border-emerald-400/30",
  Teal:
    "bg-gradient-to-r from-teal-600 to-emerald-700 hover:from-teal-700 hover:to-emerald-800 text-white shadow-xl shadow-teal-950/40 border border-teal-400/30",
  secondary:
    "bg-gradient-to-r from-teal-600 to-emerald-700 hover:from-teal-700 hover:to-emerald-800 text-white shadow-xl shadow-teal-950/40 border border-teal-400/30",
  Blue:
    "bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-xl shadow-blue-950/40 border border-blue-400/30",
  White:
    "bg-white/95 hover:bg-white text-slate-900 hover:text-emerald-700 shadow-xl border border-slate-200",
  Amber:
    "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-xl shadow-amber-950/40 border border-amber-400/30",
  Red:
    "bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white shadow-xl shadow-red-950/40 border border-red-400/30",
  Indigo:
    "bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white shadow-xl shadow-indigo-950/40 border border-indigo-400/30",
  Dark:
    "bg-slate-900 hover:bg-slate-800 text-white shadow-xl border border-slate-700",
};

export function Hero() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { dict, language } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [homepageData, setHomepageData] = useState<HomepageData | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      try {
        setLoading(true);
        const data = await getHomepageData(false);
        if (isMounted && data) {
          setHomepageData(data);
        }
      } catch (err) {
        console.warn("Homepage dynamic data fetch error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter active slides from API
  const activeSlides = (homepageData?.slides || []).filter((s) => s.active !== false);
  const slidesCount = activeSlides.length;
  const currentSlide: HeroSlide | undefined =
    slidesCount > 0 ? activeSlides[activeSlideIndex % slidesCount] : undefined;

  const showButtons = currentSlide?.showButtons !== false;
  const activeButtons = (currentSlide?.buttons || []).filter((b) => b.active !== false);

  const showTags = currentSlide?.showTags !== false;
  const activeTags = (currentSlide?.tags || []).filter((t) => t.active !== false);

  // Unconditionally call translation hooks at top level
  const badgeText = useAutoTranslate(currentSlide?.badgeEn, currentSlide?.badgeMr);
  const headlineText = useAutoTranslate(currentSlide?.headlineEn, currentSlide?.headlineMr);
  const taglineText = useAutoTranslate(currentSlide?.taglineEn, currentSlide?.taglineMr);

  const translatedButtonNames = useBatchTranslate(
    activeButtons.map((b, idx) => ({ ...b, id: b.id || `btn-${idx}` })),
    (b) => b.name
  );

  const translatedTagNames = useBatchTranslate(
    activeTags.map((t, idx) => ({ ...t, id: t.id || `tag-${idx}` })),
    (t) => t.name
  );

  // Auto-advance slides every 5 seconds if more than 1 slide exists
  useEffect(() => {
    if (slidesCount <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % slidesCount);
    }, 5000);

    return () => clearInterval(timer);
  }, [slidesCount, isPaused]);

  if (loading) {
    return (
      <section className="relative min-h-[500px] sm:min-h-[600px] lg:min-h-[680px] flex flex-col justify-between overflow-hidden bg-slate-950 animate-pulse group/hero">
        {/* Background gradient overlay skeleton */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/60 to-slate-950/90" />
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none" />

        {/* Center content skeleton */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 my-auto w-full">
          <div className="flex flex-col items-center text-center">
            {/* Badge skeleton */}
            <div className="h-7 w-44 sm:w-52 bg-slate-800/90 rounded-full mb-6 border border-emerald-500/20" />

            {/* Headline skeleton */}
            <div className="h-10 sm:h-14 lg:h-16 w-3/4 max-w-2xl bg-slate-800/90 rounded-2xl mb-3" />
            <div className="h-8 sm:h-12 lg:h-14 w-1/2 max-w-lg bg-slate-800/80 rounded-2xl mb-6" />

            {/* Tagline skeleton */}
            <div className="h-4 sm:h-5 w-4/5 max-w-xl bg-slate-800/60 rounded-lg mb-2" />
            <div className="h-4 sm:h-5 w-3/5 max-w-md bg-slate-800/60 rounded-lg mb-8" />

            {/* Action buttons skeleton */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="h-12 w-44 bg-emerald-900/40 rounded-xl border border-emerald-500/30" />
              <div className="h-12 w-36 bg-slate-800/80 rounded-xl border border-slate-700/50" />
            </div>
          </div>
        </div>

        {/* Bottom indicators skeleton */}
        <div className="relative z-10 w-full pb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-2.5 bg-emerald-500/40 rounded-full" />
            <div className="w-2.5 h-2.5 bg-slate-800 rounded-full" />
            <div className="w-2.5 h-2.5 bg-slate-800 rounded-full" />
          </div>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/10 pt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-12">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-4 w-28 bg-slate-800/60 rounded-md" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // If no dynamic data or no active slides, DO NOT show banner
  if (!homepageData || slidesCount === 0 || !currentSlide) {
    return null;
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/services?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const nextSlide = () => {
    if (slidesCount > 1) {
      setActiveSlideIndex((prev) => (prev + 1) % slidesCount);
    }
  };

  const prevSlide = () => {
    if (slidesCount > 1) {
      setActiveSlideIndex((prev) => (prev - 1 + slidesCount) % slidesCount);
    }
  };

  const mediaUrl = currentSlide.mediaUrl;
  const isVideoMedia =
    mediaUrl &&
    (mediaUrl.includes("/video/") ||
      mediaUrl.endsWith(".mp4") ||
      mediaUrl.endsWith(".webm") ||
      mediaUrl.endsWith(".ogg") ||
      mediaUrl.includes("video/upload"));

  const alignment = currentSlide.alignment || "left";
  const alignContainerClass =
    alignment === "left"
      ? "text-left items-start"
      : alignment === "right"
        ? "text-right items-end"
        : "text-center items-center";

  const alignMarginClass =
    alignment === "left"
      ? "mr-auto"
      : alignment === "right"
        ? "ml-auto"
        : "mx-auto";

  // Check if current slide has any overlaid text / buttons
  const hasContent = Boolean(
    badgeText ||
    headlineText ||
    taglineText ||
    (showButtons && activeButtons.length > 0)
  );

  return (
    <section
      className="relative min-h-[500px] sm:min-h-[600px] lg:min-h-[680px] flex flex-col justify-between overflow-hidden group/hero"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Dynamic Background Media */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-slate-900">
        {mediaUrl ? (
          isVideoMedia ? (
            <video
              key={mediaUrl}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover object-center scale-105 transition-opacity duration-1000"
            >
              <source src={mediaUrl} />
            </video>
          ) : (
            <div className="relative w-full h-full">
              <Image
                key={mediaUrl}
                src={mediaUrl}
                alt={headlineText || "Hero Slide"}
                fill
                priority
                unoptimized={mediaUrl.startsWith("http")}
                className="object-cover object-center transition-all duration-1000"
                sizes="100vw"
              />
            </div>
          )
        ) : null}

        {/* Only show dark gradient overlays if the slide has text/content to keep text legible */}
        {hasContent && (
          <>
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/65 via-slate-900/40 to-slate-950/80" />
            <div className="absolute inset-0 bg-radial-at-c from-emerald-950/30 via-transparent to-slate-950/60" />
          </>
        )}
      </div>

      {/* Subtle Micro Dot Pattern (Only when content is present) */}
      {hasContent && (
        <div className="absolute inset-0 bg-[radial-gradient(var(--color-primary)_1px,transparent_1px)] [background-size:32px_32px] opacity-20 pointer-events-none" />
      )}

      {/* Carousel Navigation Arrows (Visible when > 1 slide) */}
      {slidesCount > 1 && (
        <>
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/30 hover:bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all opacity-0 group-hover/hero:opacity-100 cursor-pointer shadow-lg hover:scale-105"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next Slide"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/30 hover:bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all opacity-0 group-hover/hero:opacity-100 cursor-pointer shadow-lg hover:scale-105"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Main Dynamic Hero Content (Only rendered if text/buttons exist) */}
      {hasContent ? (
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 my-auto w-full">
          <div className={`flex flex-col ${alignContainerClass}`}>
            {/* Civic Badge (Only if provided dynamically) */}
            {badgeText && (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-emerald-400/20 text-emerald-200 text-xs sm:text-sm font-semibold mb-6 shadow-md">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>{badgeText}</span>
              </div>
            )}

            {/* Dynamic Headline (Only if provided dynamically) */}
            {headlineText && (
              <h1
                className={`text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl drop-shadow-md transition-all duration-300 ${alignment === "center"
                  ? "text-center mx-auto"
                  : alignment === "right"
                    ? "text-right ml-auto"
                    : "text-left mr-auto"
                  }`}
              >
                {headlineText}
              </h1>
            )}

            {/* Dynamic Tagline (Only if provided dynamically) */}
            {taglineText && (
              <p
                className={`mt-4 sm:mt-6 text-sm sm:text-base text-slate-200 max-w-2xl leading-relaxed font-normal ${alignMarginClass}`}
              >
                {taglineText}
              </p>
            )}

            {/* Dynamic Action Buttons (Only render if active buttons configured) */}
            {showButtons && activeButtons.length > 0 && (
              <div
                className={`mt-8 flex flex-wrap items-center gap-4 ${alignment === "center"
                  ? "justify-center"
                  : alignment === "right"
                    ? "justify-end"
                    : "justify-start"
                  }`}
              >
                {activeButtons.map((btn, bIdx) => {
                  const IconComp = (btn.icon && ICON_MAP[btn.icon]) || ArrowRight;
                  const colorClass =
                    (btn.color && BUTTON_COLOR_CLASSES[btn.color]) || BUTTON_COLOR_CLASSES.Emerald;
                  const isExternal = btn.url?.startsWith("http");
                  const btnId = btn.id || `btn-${bIdx}`;
                  const btnName =
                    language === "mr"
                      ? translatedButtonNames[btnId] || btn.name
                      : btn.name;

                  return (
                    <Link
                      key={btn.id || bIdx}
                      href={btn.url || "#"}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                      className={`inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base hover:-translate-y-0.5 transition-all ${colorClass}`}
                    >
                      <IconComp className="w-5 h-5" />
                      <span>{btnName}</span>
                      {isExternal && <ExternalLink className="w-3.5 h-3.5 opacity-80" />}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1" />
      )}

      {/* Dynamic Slide Dots & Dynamic Feature Tags */}
      <div className="relative z-10 w-full pb-8">
        {/* Slide Indicators */}
        {slidesCount > 1 && (
          <div className="flex items-center justify-center gap-2 mb-4">
            {activeSlides.map((s, idx) => (
              <button
                key={s.id || idx}
                type="button"
                onClick={() => setActiveSlideIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all rounded-full cursor-pointer ${idx === activeSlideIndex % slidesCount
                  ? "w-8 h-2.5 bg-emerald-400 shadow-md ring-1 ring-white/40"
                  : "w-2.5 h-2.5 bg-white/60 hover:bg-white shadow-xs"
                  }`}
              />
            ))}
          </div>
        )}

        {/* Dynamic Feature Tags (Only if active tags configured) */}
        {showTags && activeTags.length > 0 && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/15 pt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs text-emerald-100 font-medium">
            {activeTags.map((tag, tIdx) => {
              const TagIconComponent = (tag.icon && ICON_MAP[tag.icon]) || TagIcon;
              const tagId = tag.id || `tag-${tIdx}`;
              const tagName =
                language === "mr"
                  ? translatedTagNames[tagId] || tag.name
                  : tag.name;

              return (
                <div key={tag.id || tIdx} className="flex items-center gap-2">
                  <TagIconComponent className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{tagName}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}


