"use client";

import { useState } from "react";
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
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function Hero() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { dict } = useLanguage();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/services?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <section className="relative min-h-[620px] lg:min-h-[680px] flex items-center justify-center overflow-hidden">
      {/* Background Video Player with Cinematic Gradient Overlays */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover object-center scale-105"
        >
          <source src="/intro.mp4" type="video/mp4" />
        </video>
        {/* Balanced Cinematic Overlays - reduced darkness to showcase lush video scenery while keeping text sharp */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/55 via-slate-900/30 to-slate-950/70" />
        <div className="absolute inset-0 bg-radial-at-c from-emerald-950/20 via-transparent to-slate-950/45" />
      </div>

      {/* Subtle Micro Dot Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(var(--color-status-success)_1px,transparent_1px)] [background-size:32px_32px] opacity-15 pointer-events-none" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
        {/* Civic Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-emerald-400/20 text-emerald-200 text-xs sm:text-sm font-semibold mb-6 shadow-md">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{dict.hero.portalBadge}</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto drop-shadow-md">
          {dict.hero.welcomePrefix} <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-white">
            {dict.hero.councilName}
          </span>
        </h1>

        {/* Concise Tagline */}
        <p className="mt-4 sm:mt-6 text-sm sm:text-base text-slate-200 max-w-2xl mx-auto leading-relaxed font-normal">
          {dict.hero.tagline}
        </p>

        {/* Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="mt-8 max-w-xl mx-auto flex items-center bg-white/95 backdrop-blur-xl p-1.5 rounded-2xl shadow-2xl border border-white/40 focus-within:ring-4 focus-within:ring-emerald-500/30 transition-all"
        >
          <div className="pl-3.5 text-emerald-700">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={dict.hero.searchPlaceholder}
            className="w-full px-3 py-2 text-xs sm:text-sm bg-transparent text-slate-800 placeholder-slate-400 focus:outline-hidden"
          />
          <button
            type="submit"
            className="px-5 sm:px-6 py-2.5 bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shrink-0"
          >
            {dict.hero.searchBtn}
          </button>
        </form>

        {/* CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/grievance/register"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-sm sm:text-base shadow-xl shadow-emerald-950/40 hover:-translate-y-0.5 transition-all border border-emerald-400/30"
          >
            <AlertCircle className="w-5 h-5 text-emerald-200" />
            <span>{dict.hero.fileGrievance}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/grievance/track"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/95 hover:bg-white text-slate-900 hover:text-emerald-700 font-bold text-sm sm:text-base shadow-xl hover:-translate-y-0.5 transition-all border border-slate-200"
          >
            <Search className="w-5 h-5 text-emerald-700" />
            <span>{dict.nav.trackStatus}</span>
          </Link>

          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm sm:text-base backdrop-blur-md border border-white/20 transition-all"
          >
            <span>{dict.nav.services}</span>
            <ExternalLink className="w-4 h-4 text-emerald-300" />
          </Link>
        </div>

        {/* Ticker Badges */}
        <div className="mt-10 pt-6 border-t border-white/15 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs text-emerald-100 font-medium">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>5-Step Verified Grievance Redressal</span>
          </div>
          <div className="flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-emerald-400" />
            <span>24x7 Control Room: 1800-233-0101</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Swachh Survekshan 3-Star Certified</span>
          </div>
        </div>
      </div>
    </section>
  );
}
