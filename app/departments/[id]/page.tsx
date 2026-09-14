import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  FileText,
  Download,
  ArrowLeft,
  AlertCircle,
  Clock,
  Sparkles,
  HeartPulse,
  Droplets,
  HardHat,
  Receipt,
  ShieldAlert,
  Flame,
  Cpu,
} from "lucide-react";
import { DEPARTMENTS, CITIZEN_SERVICES } from "@/data/mockData";

const deptIcons: Record<string, React.ReactNode> = {
  HeartPulse: <HeartPulse className="w-8 h-8 text-[#2E8B57]" />,
  Droplets: <Droplets className="w-8 h-8 text-[#2E8B57]" />,
  HardHat: <HardHat className="w-8 h-8 text-[#2E8B57]" />,
  Building2: <Building2 className="w-8 h-8 text-[#2E8B57]" />,
  Receipt: <Receipt className="w-8 h-8 text-[#2E8B57]" />,
  ShieldAlert: <ShieldAlert className="w-8 h-8 text-[#2E8B57]" />,
  Flame: <Flame className="w-8 h-8 text-[#2E8B57]" />,
  Cpu: <Cpu className="w-8 h-8 text-[#2E8B57]" />,
};

export function generateStaticParams() {
  return DEPARTMENTS.map((dept) => ({
    id: dept.slug,
  }));
}

export default async function DepartmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const dept = DEPARTMENTS.find(
    (d) => d.slug === resolvedParams.id || d.id === resolvedParams.id
  );

  if (!dept) {
    notFound();
  }

  const relatedServices = CITIZEN_SERVICES.filter(
    (s) => s.departmentId === dept.id || s.department.toLowerCase().includes(dept.name.toLowerCase())
  );

  const icon = deptIcons[dept.icon] || <Building2 className="w-8 h-8 text-[#2E8B57]" />;

  return (
    <div className="py-10">
      {/* Back Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <Link
          href="/departments"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2E8B57] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Departments</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="bg-[#E8F5E9]/60 border-y border-[#D9E8DD] py-12 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center border border-[#D9E8DD] shrink-0">
              {icon}
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#2E8B57] bg-white px-3 py-1 rounded-full border border-[#D9E8DD]">
                Municipal Department
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1F2937] mt-2">
                {dept.name}
              </h1>
              <p className="text-sm font-semibold text-[#2E8B57] mt-1">{dept.marathiName}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Overview & Key Stats */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#D9E8DD] shadow-xs space-y-4">
              <h2 className="text-xl font-bold text-[#1F2937]">Departmental Overview</h2>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {dept.overview}
              </p>

              {/* Responsibilities */}
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <h3 className="text-sm font-bold text-[#1F2937] uppercase tracking-wider">
                  Key Responsibilities & Scope:
                </h3>
                <div className="grid grid-cols-1 gap-2.5">
                  {dept.responsibilities.map((resp, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-[#2E8B57] shrink-0 mt-0.5" />
                      <span>{resp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Citizen Services Provided */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#D9E8DD] shadow-xs space-y-4">
              <h2 className="text-xl font-bold text-[#1F2937]">Citizen Services Provided</h2>
              <p className="text-xs text-gray-600">
                Services delivered digitally or at the Citizen Facilitation Center (CFC).
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {dept.services.map((srv, idx) => (
                  <div
                    key={idx}
                    className="bg-[#F8FCF9] p-4 rounded-xl border border-[#D9E8DD] flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#2E8B57] shrink-0" />
                      <span className="text-xs font-semibold text-gray-800">{srv}</span>
                    </div>
                    <Link
                      href="/services"
                      className="text-[11px] font-bold text-[#2E8B57] hover:underline shrink-0"
                    >
                      Apply →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar: Head Officer & Contact */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-[#D9E8DD] shadow-xs space-y-4">
              <h3 className="font-bold text-base text-[#1F2937] border-b border-gray-100 pb-2">
                Departmental Leadership
              </h3>

              <div className="space-y-1">
                <div className="text-xs text-gray-500 font-medium">Head of Department</div>
                <div className="text-base font-bold text-[#1F2937]">{dept.headOfficer}</div>
                <div className="text-xs text-[#2E8B57] font-semibold">{dept.designation}</div>
              </div>

              <div className="space-y-3 pt-3 text-xs text-gray-600 border-t border-gray-100">
                <div className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-[#2E8B57] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-gray-900">Direct Contact</div>
                    <a href={`tel:${dept.phone}`} className="hover:underline text-[#2E8B57]">
                      {dept.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-[#2E8B57] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-gray-900">Official Email</div>
                    <a href={`mailto:${dept.email}`} className="hover:underline text-[#2E8B57]">
                      {dept.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#2E8B57] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-gray-900">Office Location</div>
                    <div>{dept.location}</div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/grievance/register"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#2E8B57] hover:bg-[#246E45] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>Report Departmental Issue</span>
                </Link>
              </div>
            </div>

            {/* Department Stats */}
            <div className="bg-[#F8FCF9] p-6 rounded-2xl border border-[#D9E8DD] space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-gray-500">
                Department Performance
              </h3>
              <div className="space-y-2">
                {dept.stats.map((stat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs py-1.5 border-b border-gray-200/60 last:border-none"
                  >
                    <span className="text-gray-600">{stat.label}</span>
                    <span className="font-bold text-[#2E8B57]">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Downloadable Documents */}
            <div className="bg-white p-6 rounded-2xl border border-[#D9E8DD] shadow-xs space-y-3">
              <h3 className="font-bold text-sm text-[#1F2937]">Documents & By-laws</h3>
              <div className="space-y-2">
                {dept.documents.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-xs hover:border-[#2E8B57] transition-colors"
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      <FileText className="w-4 h-4 text-[#2E8B57] shrink-0" />
                      <span className="truncate font-medium text-gray-700">{doc.title}</span>
                    </div>
                    <a
                      href="#"
                      download
                      className="text-[11px] font-bold text-[#2E8B57] hover:underline shrink-0 flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>{doc.size}</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
