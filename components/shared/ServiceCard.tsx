"use client";

import Link from "next/link";
import {
  Receipt,
  Droplets,
  Baby,
  FileHeart,
  Building2,
  Briefcase,
  FileCheck,
  CreditCard,
  ArrowRight,
  Clock,
} from "lucide-react";
import { CitizenService } from "@/types";
import { useLanguage } from "@/context/LanguageContext";

const iconMap: Record<string, React.ReactNode> = {
  Receipt: <Receipt className="w-5 h-5 text-emerald-700" />,
  Droplets: <Droplets className="w-5 h-5 text-teal-700" />,
  Baby: <Baby className="w-5 h-5 text-emerald-700" />,
  FileHeart: <FileHeart className="w-5 h-5 text-rose-600" />,
  Building2: <Building2 className="w-5 h-5 text-emerald-700" />,
  Briefcase: <Briefcase className="w-5 h-5 text-amber-700" />,
  FileCheck: <FileCheck className="w-5 h-5 text-teal-700" />,
  CreditCard: <CreditCard className="w-5 h-5 text-emerald-700" />,
};

const serviceKeyMap: Record<string, "propertyTax" | "waterBill" | "birthCert" | "deathCert" | "buildingPermit" | "tradeLicense" | "noc" | "onlinePay"> = {
  "srv-property-tax": "propertyTax",
  "srv-water-bill": "waterBill",
  "srv-birth-cert": "birthCert",
  "srv-death-cert": "deathCert",
  "srv-building-permission": "buildingPermit",
  "srv-trade-license": "tradeLicense",
  "srv-noc": "noc",
  "srv-online-payment": "onlinePay",
};

export function ServiceCard({ service }: { service: CitizenService }) {
  const { dict } = useLanguage();
  const icon = iconMap[service.icon] || <FileCheck className="w-5 h-5 text-emerald-700" />;

  const serviceKey = serviceKeyMap[service.id];
  const localizedItem = serviceKey ? dict.services.items[serviceKey] : null;

  const title = localizedItem?.title || service.title;
  const shortInfo = localizedItem?.desc || service.description;
  const timeline = localizedItem?.timeline || service.timeline;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-xl hover:border-emerald-600/60 hover:-translate-y-1 transition-all duration-200 group flex flex-col justify-between">
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between mb-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100/80 flex items-center justify-center group-hover:scale-105 group-hover:bg-gradient-to-tr group-hover:from-emerald-700 group-hover:to-teal-600 transition-all duration-300">
            <span className="group-hover:text-white [&>svg]:group-hover:text-white transition-colors">
              {icon}
            </span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200/70">
            {service.category.split("&")[0]}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-1.5 group-hover:text-emerald-700 transition-colors leading-snug">
          {title}
        </h3>

        {/* Short info */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
          {shortInfo}
        </p>
      </div>

      <div>
        {/* Short Timeline Badge */}
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 mb-3 bg-emerald-50/70 border border-emerald-200/60 px-2.5 py-1 rounded-lg">
          <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="truncate">{timeline}</span>
        </div>

        {/* Action Row */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <Link
            href={`/services/${service.slug}`}
            className="text-xs font-bold text-slate-700 hover:text-emerald-700 flex items-center gap-1 group/link"
          >
            <span>{dict.common.details}</span>
            <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
          </Link>
          <a
            href={service.onlinePortalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-bold bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white px-3 py-1.5 rounded-lg transition-all shadow-xs"
          >
            {dict.common.applyOnline}
          </a>
        </div>
      </div>
    </div>
  );
}
