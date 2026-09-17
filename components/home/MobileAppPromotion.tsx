"use client";

import { Smartphone, CheckCircle2, QrCode } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function MobileAppPromotion() {
  const { dict } = useLanguage();

  return (
    <section className="py-16 bg-gradient-to-tr from-slate-950 via-emerald-950 to-teal-900 text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(var(--color-primary)_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-200 text-xs font-semibold border border-white/15">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>{dict.appPromo.badge}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight whitespace-pre-line">
              {dict.appPromo.title}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              {dict.appPromo.desc}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-medium text-emerald-100">
              {dict.appPromo.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {/* App Store Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <a
                href="#"
                className="flex items-center gap-3 bg-black/80 hover:bg-black px-5 py-2.5 rounded-xl border border-white/20 shadow-lg transition-all"
              >
                <div className="text-xl">🍏</div>
                <div className="text-left">
                  <div className="text-[10px] uppercase text-gray-400 font-semibold leading-none">
                    Download on the
                  </div>
                  <div className="text-xs font-bold text-white leading-tight">{dict.appPromo.downloadApple}</div>
                </div>
              </a>

              <a
                href="#"
                className="flex items-center gap-3 bg-black/80 hover:bg-black px-5 py-2.5 rounded-xl border border-white/20 shadow-lg transition-all"
              >
                <div className="text-xl">🤖</div>
                <div className="text-left">
                  <div className="text-[10px] uppercase text-gray-400 font-semibold leading-none">
                    Get it on
                  </div>
                  <div className="text-xs font-bold text-white leading-tight">{dict.appPromo.downloadGoogle}</div>
                </div>
              </a>
            </div>
          </div>

          {/* QR Code Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="bg-white text-gray-900 p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/40 max-w-xs text-center">
              <div className="w-36 h-36 mx-auto bg-slate-50 rounded-2xl p-3 border-2 border-dashed border-slate-300 flex items-center justify-center">
                <QrCode className="w-28 h-28 text-emerald-900" />
              </div>

              <div className="mt-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {dict.appPromo.scanToInstall}
                </span>
                <h4 className="font-bold text-sm text-slate-900 mt-2">
                  {dict.appPromo.appName}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  {dict.appPromo.compatibility}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
