"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Shield,
  ArrowRight,
  Lock,
  ExternalLink,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { getContactsData, MunicipalHq } from "@/lib/services/contacts.service";

export function Footer() {
  const { dict } = useLanguage();
  const [hq, setHq] = useState<MunicipalHq | null>(null);

  useEffect(() => {
    getContactsData()
      .then(({ hq: contactHq }) => setHq(contactHq))
      .catch((error) =>
        console.error("Failed to load footer contact details:", error),
      );
  }, []);

  const address = hq
    ? [hq.complexName, hq.addressLine1, hq.addressLine2, hq.pinCode]
        .filter(Boolean)
        .join(", ")
    : "";

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-emerald-600/30 relative overflow-hidden">
      {/* Subtle background ambient radial gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none blur-2xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 pb-12 border-b border-slate-800/80">
          {/* Column 1: About LMC */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                <Image
                  src="/images/logo.png"
                  alt={dict.common.councilName}
                  width={48}
                  height={48}
                  className="w-full h-full object-contain drop-shadow-md"
                />
              </div>
              <div>
                <h3 className="text-white font-bold text-base leading-tight tracking-tight">
                  {dict.common.councilName}
                </h3>
                <p className="text-xs text-emerald-400 font-medium">
                  {dict.footer.aboutSub}
                </p>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-slate-400 pr-4">
              {dict.footer.aboutDesc}
            </p>
            <div className="pt-2 text-xs text-slate-400 space-y-2">
              {address && (
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                  {address}
                </p>
              )}
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                {dict.footer.officeHours}
              </p>
            </div>
          </div>

          {/* Column 2: Citizen Services */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider border-b border-slate-800 pb-2">
              {dict.footer.colCitizenServices}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link
                  href="/services/property-tax"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-emerald-400" />{" "}
                  {dict.services.items.propertyTax.title.split("&")[0]}
                </Link>
              </li>
              <li>
                <Link
                  href="/services/water-bills"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-emerald-400" />{" "}
                  {dict.services.items.waterBill.title.split("&")[0]}
                </Link>
              </li>
              <li>
                <Link
                  href="/services/birth-certificate"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-emerald-400" />{" "}
                  {dict.services.items.birthCert.title}
                </Link>
              </li>
              <li>
                <Link
                  href="/services/death-certificate"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-emerald-400" />{" "}
                  {dict.services.items.deathCert.title}
                </Link>
              </li>
              <li>
                <Link
                  href="/services/building-permission"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-emerald-400" />{" "}
                  {dict.services.items.buildingPermit.title}
                </Link>
              </li>
              <li>
                <Link
                  href="/services/trade-license"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-emerald-400" />{" "}
                  {dict.services.items.tradeLicense.title}
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-emerald-300 transition-colors flex items-center gap-1.5 font-semibold text-emerald-400"
                >
                  {dict.services.exploreAll} →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Departments */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider border-b border-slate-800 pb-2">
              {dict.nav.departments}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link
                  href="/departments/health-sanitation"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-emerald-400" /> Health &
                  Sanitation
                </Link>
              </li>
              <li>
                <Link
                  href="/departments/water-supply"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-emerald-400" /> Water
                  Supply
                </Link>
              </li>
              <li>
                <Link
                  href="/departments/public-works"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-emerald-400" /> Public
                  Works (PWD)
                </Link>
              </li>
              <li>
                <Link
                  href="/departments/town-planning"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-emerald-400" /> Town
                  Planning
                </Link>
              </li>
              <li>
                <Link
                  href="/departments/revenue-tax"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-emerald-400" /> Revenue &
                  Tax
                </Link>
              </li>
              <li>
                <Link
                  href="/departments/fire-brigade"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-emerald-400" /> Fire
                  Brigade & Rescue
                </Link>
              </li>
              <li>
                <Link
                  href="/departments"
                  className="hover:text-emerald-300 transition-colors flex items-center gap-1.5 font-semibold text-emerald-400"
                >
                  {dict.common.viewAll} →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Tourism & Projects */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider border-b border-slate-800 pb-2">
              {dict.nav.tourism}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link
                  href="/tourism#attractions"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-emerald-400" />{" "}
                  {dict.tourism.spots.tigerPoint.name}
                </Link>
              </li>
              <li>
                <Link
                  href="/tourism#waterfalls"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-emerald-400" />{" "}
                  {dict.tourism.spots.bhushiDam.name}
                </Link>
              </li>
              <li>
                <Link
                  href="/tourism#caves"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-emerald-400" />{" "}
                  {dict.tourism.spots.karlaCaves.name}
                </Link>
              </li>
              <li>
                <Link
                  href="/tourism#forts"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-emerald-400" />{" "}
                  {dict.tourism.spots.rajmachi.name}
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-emerald-400" />{" "}
                  {dict.nav.ongoingProjects}
                </Link>
              </li>
              <li>
                <Link
                  href="/tourism"
                  className="hover:text-emerald-300 transition-colors flex items-center gap-1.5 font-semibold text-emerald-400"
                >
                  {dict.tourism.viewAllSpots} →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: RTI & Contact */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider border-b border-slate-800 pb-2">
              {dict.footer.colHelpdesk}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link
                  href="/rti"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-emerald-400" />{" "}
                  {dict.nav.rtiRts}
                </Link>
              </li>
              <li>
                <Link
                  href="/finance"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-emerald-400" />{" "}
                  {dict.nav.financeBudget}
                </Link>
              </li>
              <li>
                <Link
                  href="/downloads"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-emerald-400" />{" "}
                  {dict.nav.downloads}
                </Link>
              </li>
              <li className="pt-2 text-xs">
                <p className="font-semibold text-white">
                  {dict.footer.emergencyControlRoom}:
                </p>
                <a
                  href="tel:18002330101"
                  className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors"
                >
                  1800-233-0101
                </a>
              </li>
              <li className="text-xs">
                <p className="font-semibold text-white">
                  {dict.nav.contactHelpdesk}:
                </p>
                <a
                  href="tel:+912114273030"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  +91 2114 273030
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Copyright and Green Admin Panel Button */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            <p>{dict.footer.copyright}</p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/contact"
              className="hover:text-emerald-400 transition-colors"
            >
              {dict.nav.contactHelpdesk}
            </Link>
            <span className="text-slate-700">|</span>
            <Link
              href="/downloads"
              className="hover:text-emerald-400 transition-colors"
            >
              {dict.footer.privacyPolicy}
            </Link>
            <span className="text-slate-700">|</span>

            {/* Admin Panel Button */}
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition-all shadow-md shadow-emerald-950/50 hover:shadow-emerald-900/70 active:scale-95"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin Panel</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
