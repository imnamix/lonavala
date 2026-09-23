"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ChevronDown,
  UserCheck,
  Search,
  FileText,
  AlertCircle,
  Phone,
  Shield,
  Layers,
  MapPin,
  TrendingUp,
  FileCheck2,
  Sparkles,
} from "lucide-react";
import { EmergencyBanner } from "./EmergencyBanner";
import { useLanguage } from "@/context/LanguageContext";
import {
  isCitizenLoggedIn,
  getCitizenData,
  CitizenProfile,
} from "@/lib/services/citizen.service";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [citizen, setCitizen] = useState<CitizenProfile | null>(null);
  const pathname = usePathname();
  const { dict } = useLanguage();

  useEffect(() => {
    const updateCitizen = () => {
      if (isCitizenLoggedIn()) {
        setCitizen(getCitizenData());
      } else {
        setCitizen(null);
      }
    };
    updateCitizen();

    window.addEventListener("citizen-auth-change", updateCitizen);
    window.addEventListener("storage", updateCitizen);
    return () => {
      window.removeEventListener("citizen-auth-change", updateCitizen);
      window.removeEventListener("storage", updateCitizen);
    };
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  const navLinks = [
    { name: dict.nav.home, href: "/" },
    {
      name: dict.nav.aboutLmc,
      dropdown: [
        {
          name: dict.nav.aboutCouncil,
          href: "/about",
          desc: dict.nav.aboutCouncilDesc,
        },
        {
          name: dict.nav.electedCouncil,
          href: "/council",
          desc: dict.nav.electedCouncilDesc,
        },
      ],
    },
    { name: dict.nav.departments, href: "/departments" },
    { name: dict.nav.court, href: "/court" },
    { name: dict.nav.services, href: "/services" },
    {
      name: dict.nav.grievance,
      dropdown: [
        {
          name: dict.nav.registerGrievance,
          href: "/grievance/register",
          desc: dict.nav.registerGrievanceDesc,
        },
        {
          name: dict.nav.trackStatus,
          href: "/grievance/track",
          desc: dict.nav.trackStatusDesc,
        },
      ],
    },
    { name: dict.nav.tourism, href: "/tourism" },
    {
      name: dict.nav.citizenCorner,
      dropdown: [
        {
          name: dict.nav.noticesCirculars,
          href: "/notices",
          desc: dict.nav.noticesCircularsDesc,
        },
        {
          name: dict.nav.tenders,
          href: "/tenders",
          desc: dict.nav.tendersDesc,
        },
       
        {
          name: dict.nav.ongoingProjects,
          href: "/projects",
          desc: dict.nav.ongoingProjectsDesc,
        },
        {
          name: dict.nav.financeBudget,
          href: "/finance",
          desc: dict.nav.financeBudgetDesc,
        },
        { name: dict.nav.rtiRts, href: "/rti", desc: dict.nav.rtiRtsDesc },
        {
          name: dict.nav.downloads,
          href: "/downloads",
          desc: dict.nav.downloadsDesc,
        },
        { name: dict.nav.faq, href: "/faq", desc: dict.nav.faqDesc },
        {
          name: dict.nav.contactHelpdesk,
          href: "/contact",
          desc: dict.nav.contactHelpdeskDesc,
        },
      ],
    },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Emergency Banner (Always Visible) */}
      <EmergencyBanner />

      {/* Main Navbar */}
      <nav
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? "bg-white/98 backdrop-blur-xl shadow-md border-b border-slate-200/90 py-1.5 sm:py-2"
            : "bg-white/98 backdrop-blur-md border-b border-slate-200/80 py-2 sm:py-2.5"
        }`}
      >
        <div className="max-w-[1536px] mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 lg:gap-3 xl:gap-4 h-14 sm:h-16">
            {/* Left: Civic Official Logo & Title */}
            <Link
              href="/"
              className="flex items-center gap-2.5 sm:gap-3 group shrink-0"
            >
              <div className="relative w-11 h-11 sm:w-13 sm:h-13 flex items-center justify-center shrink-0">
                <Image
                  src="/images/logo.png"
                  alt={dict.common.councilName}
                  width={52}
                  height={52}
                  className="w-full h-full object-contain drop-shadow-xs group-hover:scale-105 transition-transform"
                  priority
                />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-sm sm:text-base font-black text-slate-900 tracking-tight group-hover:text-emerald-700 transition-colors leading-tight whitespace-nowrap">
                  {dict.common.councilName}
                </span>
                <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-700 leading-tight whitespace-nowrap">
                  {dict.common.councilSub}
                </span>
              </div>
            </Link>

            {/* Middle: Desktop Nav Links - Centered (visible on xl screens and above) */}
            <div className="hidden xl:flex items-center justify-center flex-1 min-w-0 mx-2 2xl:mx-4 gap-1 2xl:gap-2">
              {navLinks.map((link) => {
                if (link.dropdown) {
                  const isCurrentGroup = link.dropdown.some(
                    (item) => pathname === item.href,
                  );
                  return (
                    <div
                      key={link.name}
                      className="relative shrink-0"
                      onMouseEnter={() => setOpenDropdown(link.name)}
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      <button
                        className={`h-9 inline-flex items-center gap-1 px-2.5 2xl:px-3 text-xs 2xl:text-sm font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                          isCurrentGroup || openDropdown === link.name
                            ? "text-emerald-800 bg-emerald-50/90 font-bold"
                            : "text-slate-700 hover:text-emerald-700 hover:bg-slate-100/80"
                        }`}
                      >
                        <span>{link.name}</span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                            openDropdown === link.name
                              ? "rotate-180 text-emerald-600"
                              : ""
                          }`}
                        />
                      </button>

                      {openDropdown === link.name && (
                        <div className="absolute top-full left-0 w-64 bg-white/98 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/90 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                          {link.dropdown.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className={`block px-4 py-2 hover:bg-emerald-50/80 transition-colors ${
                                pathname === item.href
                                  ? "bg-emerald-50 text-emerald-800 font-bold border-l-2 border-emerald-600"
                                  : "text-slate-800"
                              }`}
                            >
                              <div className="text-xs font-bold hover:text-emerald-700">
                                {item.name}
                              </div>
                              <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                {item.desc}
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`h-9 inline-flex items-center px-2.5 2xl:px-3 text-xs 2xl:text-sm rounded-xl transition-all whitespace-nowrap shrink-0 ${
                      isActive
                        ? "text-emerald-800 bg-emerald-50 font-bold border border-emerald-200/70 shadow-2xs"
                        : "text-slate-700 font-semibold hover:text-emerald-700 hover:bg-slate-100/80"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Right Action Icons & Buttons */}
            <div className="flex items-center gap-2 shrink-0 ml-auto xl:ml-0">
              {/* Citizen Portal / Dashboard Button */}
              <Link
                href={citizen ? "/citizen/dashboard" : "/login"}
                className={`inline-flex h-9 items-center gap-1.5 px-3 sm:px-3.5 text-xs font-bold rounded-xl border transition-all shadow-2xs active:scale-95 shrink-0 whitespace-nowrap ${
                  citizen
                    ? "border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100/80"
                    : "border-slate-300 bg-white hover:bg-emerald-50 hover:border-emerald-300 text-slate-700 hover:text-emerald-700"
                }`}
              >
                {citizen?.profilePicture ? (
                  <img
                    src={citizen.profilePicture}
                    alt={citizen.name || "Citizen"}
                    className="w-4 h-4 rounded-full object-cover shrink-0 border border-emerald-300"
                  />
                ) : (
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                )}
                <span className="inline whitespace-nowrap">
                  {citizen ? (citizen.name ? citizen.name.split(" ")[0] : "Citizen Panel") : dict.nav.citizenPortal}
                </span>
                {citizen && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
                )}
              </Link>

              {/* Mobile / Tablet Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden h-9 w-9 inline-flex items-center justify-center rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-hidden cursor-pointer"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-slate-900" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile / Tablet Menu Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-white/98 backdrop-blur-2xl border-b border-slate-200 shadow-2xl max-h-[85vh] overflow-y-auto px-4 pt-3 pb-6 animate-in slide-in-from-top-4 duration-200">
            <div className="space-y-1">
              {navLinks.map((link) => {
                if (link.dropdown) {
                  return (
                    <div key={link.name} className="py-1">
                      <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        {link.name}
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 mt-1 pl-2">
                        {link.dropdown.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className={`px-3 py-2 text-xs font-semibold rounded-xl ${
                              pathname === sub.href
                                ? "bg-emerald-50 text-emerald-800 font-bold"
                                : "text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block px-3 py-2 text-xs font-semibold rounded-xl ${
                      pathname === link.href
                        ? "bg-emerald-50 text-emerald-800 font-bold"
                        : "text-slate-800 hover:bg-slate-50"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}

              <div className="pt-3 border-t border-slate-200 mt-2 space-y-2">
                <Link
                  href={citizen ? "/citizen/dashboard" : "/login"}
                  className={`flex items-center justify-center gap-2 w-full py-2.5 text-xs font-bold rounded-xl border ${
                    citizen
                      ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                      : "bg-white text-slate-700 border-slate-300"
                  }`}
                >
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span>{citizen ? `Citizen Panel (${citizen.name || citizen.phone})` : dict.nav.citizenPortal}</span>
                </Link>
                <Link
                  href="/grievance/register"
                  className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-700 to-teal-700 text-white shadow-sm"
                >
                  <AlertCircle className="w-4 h-4 text-emerald-200" />
                  <span>{dict.nav.registerGrievance}</span>
                </Link>
                <Link
                  href="/grievance/track"
                  className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-bold rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200"
                >
                  <Search className="w-4 h-4 text-emerald-700" />
                  <span>{dict.nav.trackStatus}</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
