"use client";

import Link from "next/link";
import {
  HeartPulse,
  Droplets,
  HardHat,
  Building2,
  Receipt,
  ShieldAlert,
  Flame,
  Cpu,
  ArrowRight,
  Phone,
  FileText,
  CheckCircle,
} from "lucide-react";
import { Department } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { useAutoTranslate } from "@/hooks/useAutoTranslation";

const deptIcons: Record<string, React.ReactNode> = {
  HeartPulse: <HeartPulse className="w-5 h-5 text-emerald-600" />,
  Droplets: <Droplets className="w-5 h-5 text-emerald-600" />,
  HardHat: <HardHat className="w-5 h-5 text-emerald-600" />,
  Building2: <Building2 className="w-5 h-5 text-emerald-600" />,
  Receipt: <Receipt className="w-5 h-5 text-emerald-600" />,
  ShieldAlert: <ShieldAlert className="w-5 h-5 text-emerald-600" />,
  Flame: <Flame className="w-5 h-5 text-emerald-600" />,
  Cpu: <Cpu className="w-5 h-5 text-emerald-600" />,
};

function ResponsibilityItemCard({ item }: { item: string }) {
  const translated = useAutoTranslate(item);
  return (
    <div className="flex items-start gap-1.5 text-xs text-slate-600">
      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
      <span className="line-clamp-1">{translated}</span>
    </div>
  );
}

export function DepartmentCard({ dept }: { dept: Department }) {
  const { language } = useLanguage();
  const icon = deptIcons[dept.icon] || <Building2 className="w-5 h-5 text-emerald-600" />;

  const isMr = language === "mr";

  // Dynamic Translations
  const primaryName = isMr ? (dept.marathiName || dept.name) : dept.name;
  const secondaryName = isMr ? (dept.marathiName ? dept.name : "") : dept.marathiName;

  const translatedOverview = useAutoTranslate(dept.overview);
  const translatedOfficer = useAutoTranslate(dept.headOfficer);
  const statBadge = useAutoTranslate(dept.stats?.[0]?.value || (isMr ? "सार्वजनिक सेवा" : "Public Service"));

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-xl hover:border-emerald-500/50 transition-all flex flex-col justify-between group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-50 to-teal-50/20 rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform" />

      <div>
        <div className="flex items-start justify-between gap-3 mb-3.5 relative z-10">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center group-hover:bg-emerald-600 transition-colors shadow-xs">
            <span className="group-hover:text-white [&>svg]:group-hover:text-white transition-colors">
              {icon}
            </span>
          </div>
          <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50/80 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
            {statBadge}
          </span>
        </div>

        <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-tight mb-0.5">
          {primaryName}
        </h3>
        {secondaryName && (
          <p className="text-xs text-emerald-700 font-medium mb-2.5">{secondaryName}</p>
        )}

        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3.5">
          {translatedOverview}
        </p>

        {/* Head Officer Details (Larger Image, No Clerk/Desk) */}
        {dept.headOfficer && (
          <div className="bg-slate-50/80 p-2.5 rounded-2xl border border-slate-200/70 flex items-center gap-3 mb-3.5">
            {dept.headOfficerImage ? (
              <img
                src={dept.headOfficerImage}
                alt={dept.headOfficer}
                className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-xs shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-emerald-100/80 text-emerald-700 font-extrabold text-sm flex items-center justify-center border border-emerald-200/60 shrink-0 shadow-xs">
                {dept.headOfficer.charAt(0)}
              </div>
            )}
            <div className="min-w-0 flex-1 space-y-0.5">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                {isMr ? "विभाग प्रमुख" : "Department Head"}
              </div>
              <h4 className="text-xs font-bold text-slate-900 truncate">{translatedOfficer}</h4>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 flex-wrap">
                {dept.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{dept.phone}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Key Responsibilities summary */}
        {dept.responsibilities && dept.responsibilities.length > 0 && (
          <div className="space-y-1 mb-3.5">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              {isMr ? "मुख्य जबाबदाऱ्या:" : "Key Responsibilities:"}
            </p>
            {dept.responsibilities.slice(0, 2).map((item, idx) => (
              <ResponsibilityItemCard key={idx} item={item} />
            ))}
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
        <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
          <FileText className="w-3.5 h-3.5 text-emerald-600" />
          {dept.documents?.length || 0} {isMr ? "दस्तऐवज आणि अर्ज" : "Docs & Forms"}
        </span>

        <Link
          href={`/departments/${dept.slug || dept.id}`}
          className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
        >
          <span>{isMr ? "विभाग पहा" : "View Dept"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
