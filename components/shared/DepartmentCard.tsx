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
  User,
  Phone,
  FileText,
  CheckCircle,
} from "lucide-react";
import { Department } from "@/types";

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

export function DepartmentCard({ dept }: { dept: Department }) {
  const icon = deptIcons[dept.icon] || <Building2 className="w-5 h-5 text-emerald-600" />;

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
            {dept.stats[0]?.value || "Public Service"}
          </span>
        </div>

        <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-tight mb-0.5">
          {dept.name}
        </h3>
        <p className="text-xs text-emerald-700 font-medium mb-2.5">{dept.marathiName}</p>

        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3.5">
          {dept.overview}
        </p>

        {/* Head Officer & Phone */}
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 space-y-1 mb-3 text-xs">
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <User className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">{dept.headOfficer}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-[11px]">
            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{dept.phone}</span>
          </div>
        </div>

        {/* Key Responsibilities summary */}
        <div className="space-y-1 mb-3.5">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Key Responsibilities:
          </p>
          {dept.responsibilities.slice(0, 2).map((item, idx) => (
            <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-600">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span className="line-clamp-1">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
        <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
          <FileText className="w-3.5 h-3.5 text-emerald-600" />
          {dept.documents.length} Docs & Forms
        </span>

        <Link
          href={`/departments/${dept.slug}`}
          className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
        >
          <span>View Dept</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
