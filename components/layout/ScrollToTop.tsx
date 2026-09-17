"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { usePathname } from "next/navigation";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  // Show button when scrolled down
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 250) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Auto scroll to top"
      title="Scroll to Top"
      className="fixed bottom-24 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-slate-900/90 hover:bg-emerald-700 text-white shadow-xl hover:shadow-2xl border border-slate-700/60 backdrop-blur-md transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer group animate-in fade-in zoom-in-75 duration-200"
    >
      <ArrowUp className="w-5 h-5 text-emerald-300 group-hover:text-white transition-colors group-hover:-translate-y-0.5 duration-200" strokeWidth={2.5} />
    </button>
  );
}
