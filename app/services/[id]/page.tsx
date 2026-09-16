import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Receipt,
  Droplets,
  Baby,
  FileHeart,
  Building2,
  Briefcase,
  FileCheck,
  CreditCard,
  Clock,
  IndianRupee,
  Building,
  CheckCircle2,
  FileText,
  ExternalLink,
  ArrowLeft,
  UserCheck,
  AlertCircle,
} from "lucide-react";
import { CITIZEN_SERVICES } from "@/data/mockData";

const iconMap: Record<string, React.ReactNode> = {
  Receipt: <Receipt className="w-8 h-8 text-primary" />,
  Droplets: <Droplets className="w-8 h-8 text-primary" />,
  Baby: <Baby className="w-8 h-8 text-primary" />,
  FileHeart: <FileHeart className="w-8 h-8 text-primary" />,
  Building2: <Building2 className="w-8 h-8 text-primary" />,
  Briefcase: <Briefcase className="w-8 h-8 text-primary" />,
  FileCheck: <FileCheck className="w-8 h-8 text-primary" />,
  CreditCard: <CreditCard className="w-8 h-8 text-primary" />,
};

export function generateStaticParams() {
  return CITIZEN_SERVICES.map((srv) => ({
    id: srv.slug,
  }));
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const service = CITIZEN_SERVICES.find(
    (s) => s.slug === resolvedParams.id || s.id === resolvedParams.id
  );

  if (!service) {
    notFound();
  }

  const icon = iconMap[service.icon] || <FileCheck className="w-8 h-8 text-primary" />;

  return (
    <div className="py-10">
      {/* Back Link */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <Link
          href="/services"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Citizen Services</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="bg-primary-light/60 border-y border-border py-12 mb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center border border-border shrink-0">
                {icon}
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary bg-white px-3 py-1 rounded-full border border-border">
                  {service.category}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary mt-2">
                  {service.title}
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-1 flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-primary" />
                  Department: <span className="font-semibold text-gray-900">{service.department}</span>
                </p>
              </div>
            </div>

            {/* Prompt Requirement: Green button: Go to Official Portal */}
            <a
              href={service.onlinePortalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 shrink-0"
            >
              <span>Go to Official Portal</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Quick Highlights Bar (Timeline, Fees, Department) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-6 rounded-2xl border border-border shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center text-primary shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-gray-500 uppercase">Service Timeline</div>
              <div className="text-sm font-bold text-text-primary mt-0.5">{service.timeline}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center text-primary shrink-0">
              <IndianRupee className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-gray-500 uppercase">Applicable Fees</div>
              <div className="text-sm font-bold text-text-primary mt-0.5">{service.fees}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center text-primary shrink-0">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-gray-500 uppercase">Competent Authority</div>
              <div className="text-sm font-bold text-text-primary mt-0.5">{service.department}</div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-border shadow-xs space-y-3">
          <h2 className="text-lg font-bold text-text-primary">Service Description & Objectives</h2>
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
            {service.description}
          </p>
        </div>

        {/* Eligibility & Required Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Eligibility */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-border shadow-xs space-y-4">
            <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-primary" />
              <span>Eligibility Criteria</span>
            </h3>
            <ul className="space-y-2.5">
              {service.eligibility.map((crit, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>{crit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Required Documents */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-border shadow-xs space-y-4">
            <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <span>Mandatory Documents Required</span>
            </h3>
            <ul className="space-y-2.5">
              {service.requiredDocuments.map((doc, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Step by Step Process */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-border shadow-xs space-y-4">
          <h3 className="text-base font-bold text-text-primary">Step-by-Step Application Procedure</h3>
          <div className="space-y-3">
            {service.steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-primary-surface p-3.5 rounded-xl border border-border">
                <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="text-xs sm:text-sm text-gray-800 leading-normal">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Helpdesk & Officer Contact */}
        <div className="bg-primary-surface p-6 rounded-2xl border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase">Departmental In-Charge</div>
            <div className="text-sm font-bold text-text-primary mt-0.5">{service.contactPerson}</div>
          </div>
          <a
            href={service.onlinePortalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center gap-1.5"
          >
            <span>Go to Official Portal</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
