"use client";

import { useState } from "react";
import { Mail, CheckCircle2, Send } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { dict } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setIsSubmitted(true);
  };

  return (
    <section className="py-14 bg-white border-t border-slate-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-50 rounded-3xl border border-slate-200 p-8 sm:p-10 text-center shadow-xs">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-800 to-teal-600 text-white flex items-center justify-center mb-4 shadow-md ring-2 ring-emerald-600/20">
            <Mail className="w-6 h-6" />
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {dict.newsletter.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-lg mx-auto">
            {dict.newsletter.subtitle}
          </p>

          {isSubmitted ? (
            <div className="mt-6 inline-flex items-center gap-2 bg-white px-5 py-3 rounded-2xl border border-emerald-300 text-emerald-800 text-xs sm:text-sm font-bold shadow-xs animate-in zoom-in-95 duration-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>{dict.newsletter.thankYou}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 max-w-md mx-auto flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={dict.newsletter.placeholder}
                className="w-full px-4 py-3 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 shadow-xs"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shrink-0 flex items-center justify-center gap-2"
              >
                <span>{dict.newsletter.subscribeBtn}</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}

          <p className="text-[11px] text-slate-400 mt-3">
            {dict.newsletter.privacyNotice}
          </p>
        </div>
      </div>
    </section>
  );
}
