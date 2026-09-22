"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
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
  Sparkles,
  HeartPulse,
  Droplets,
  HardHat,
  Receipt,
  ShieldAlert,
  Flame,
  Cpu,
  UserCheck,
  Eye,
  Loader2,
} from "lucide-react";
import { getDepartmentById } from "@/lib/services/department.service";
import { getInlineFileUrl } from "@/lib/utils";
import { Department } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { useAutoTranslate } from "@/hooks/useAutoTranslation";

const deptIcons: Record<string, React.ReactNode> = {
  HeartPulse: <HeartPulse className="w-8 h-8 text-primary" />,
  Droplets: <Droplets className="w-8 h-8 text-primary" />,
  HardHat: <HardHat className="w-8 h-8 text-primary" />,
  Building2: <Building2 className="w-8 h-8 text-primary" />,
  Receipt: <Receipt className="w-8 h-8 text-primary" />,
  ShieldAlert: <ShieldAlert className="w-8 h-8 text-primary" />,
  Flame: <Flame className="w-8 h-8 text-primary" />,
  Cpu: <Cpu className="w-8 h-8 text-primary" />,
};

function ResponsibilityItem({ text }: { text: string }) {
  const translated = useAutoTranslate(text);
  return (
    <div className="flex items-start gap-2.5 text-xs text-gray-700">
      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
      <span>{translated}</span>
    </div>
  );
}

function AdditionalInfoBlock({ info }: { info: { title: string; description: string } }) {
  const translatedTitle = useAutoTranslate(info.title);
  const translatedDesc = useAutoTranslate(info.description);

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-border shadow-xs space-y-4">
      {info.title && (
        <h2 className="text-xl font-bold text-text-primary border-b border-gray-100 pb-3">
          {translatedTitle}
        </h2>
      )}
      <div
        className="department-rich-content text-sm text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: translatedDesc }}
      />
    </div>
  );
}

function ServiceItem({ srv }: { srv: any }) {
  const { language } = useLanguage();
  const rawTitle = typeof srv === "string" ? srv : srv?.title || "";
  const rawLink = typeof srv === "string" ? "/services" : srv?.link || "/services";
  const isExternal = rawLink.startsWith("http://") || rawLink.startsWith("https://");
  const targetLink = isExternal || rawLink.startsWith("/") ? rawLink : `/${rawLink}`;
  const translatedTitle = useAutoTranslate(rawTitle);

  return (
    <div className="bg-primary-surface p-4 rounded-xl border border-border flex items-center justify-between gap-2 hover:border-primary/40 transition-all">
      <div className="flex items-center gap-2 min-w-0">
        <Sparkles className="w-4 h-4 text-primary shrink-0" />
        <span className="text-xs font-semibold text-gray-800 truncate">{translatedTitle}</span>
      </div>
      <Link
        href={targetLink}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="text-[11px] font-bold text-primary hover:underline shrink-0 flex items-center gap-1"
      >
        <span>{language === "mr" ? "अर्ज करा" : "Apply"}</span>
        <span>→</span>
      </Link>
    </div>
  );
}

function StatRow({ stat }: { stat: { label: string; value: string } }) {
  const translatedLabel = useAutoTranslate(stat.label);
  const translatedValue = useAutoTranslate(stat.value);

  return (
    <div className="flex items-center justify-between text-xs py-1.5 border-b border-gray-200/60 last:border-none">
      <span className="text-gray-600">{translatedLabel}</span>
      <span className="font-bold text-primary">{translatedValue}</span>
    </div>
  );
}

function DocumentRow({ doc }: { doc: any }) {
  const { language } = useLanguage();
  const isMr = language === "mr";
  const docUrl = doc.fileUrl || doc.url || "";
  const translatedTitle = useAutoTranslate(doc.title);
  const translatedSize = doc.size ? useAutoTranslate(doc.size) : isMr ? "अधिकृत दस्तऐवज" : "Official Document";

  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/90 border border-gray-100 hover:border-primary/40 text-xs transition-colors gap-3">
      <div className="flex items-start gap-2.5 min-w-0 flex-1">
        <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold shrink-0 uppercase mt-0.5">
          {doc.type || "PDF"}
        </span>
        <div className="min-w-0">
          <p className="font-semibold text-gray-800 text-xs leading-snug line-clamp-2">
            {translatedTitle}
          </p>
          <span className="text-[10px] text-gray-400 font-medium">
            {translatedSize}
          </span>
        </div>
      </div>

      {docUrl ? (
        <div className="flex items-center gap-1.5 shrink-0">
          <a
            href={getInlineFileUrl(docUrl) || docUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-7 h-7 rounded-lg bg-white border border-gray-200 hover:border-primary text-gray-600 hover:text-primary flex items-center justify-center transition-all shadow-2xs"
            title={isMr ? "दस्तऐवज पहा" : "View Document"}
            aria-label={isMr ? "दस्तऐवज पहा" : "View Document"}
          >
            <Eye className="w-3.5 h-3.5" />
          </a>
          <a
            href={docUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="w-7 h-7 rounded-lg bg-primary hover:bg-primary-hover text-white flex items-center justify-center transition-all shadow-2xs"
            title={isMr ? "दस्तऐवज डाउनलोड करा" : "Download Document"}
            aria-label={isMr ? "दस्तऐवज डाउनलोड करा" : "Download Document"}
          >
            <Download className="w-3.5 h-3.5" />
          </a>
        </div>
      ) : (
        <span className="text-[10px] text-gray-400 italic">
          {isMr ? "नागरी सुविधा केंद्रात उपलब्ध" : "Available at CFC"}
        </span>
      )}
    </div>
  );
}

export default function DepartmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const { language } = useLanguage();
  const isMr = language === "mr";

  const [dept, setDept] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDepartment() {
      try {
        setLoading(true);
        const data = await getDepartmentById(id);
        setDept(data);
      } catch (err) {
        console.error(`Failed to load department ${id}:`, err);
      } finally {
        setLoading(false);
      }
    }
    loadDepartment();
  }, [id]);

  // Dynamic Translations for parent fields
  const translatedOverview = useAutoTranslate(dept?.overview);
  const translatedHeadOfficer = useAutoTranslate(dept?.headOfficer);
  const translatedDesignation = useAutoTranslate(dept?.designation);
  const translatedLocation = useAutoTranslate(dept?.location);
  const translatedClerkName = useAutoTranslate(dept?.clerkName);

  if (loading) {
    return (
      <div className="py-24 max-w-4xl mx-auto px-4 text-center">
        <div className="p-16 bg-white rounded-3xl border border-border shadow-xs flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm font-bold text-gray-700">
            {isMr ? "विभागाची माहिती लोड होत आहे..." : "Loading Department Details..."}
          </p>
        </div>
      </div>
    );
  }

  if (!dept) {
    return (
      <div className="py-24 max-w-2xl mx-auto px-4 text-center">
        <div className="p-10 bg-white rounded-3xl border border-border shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-gray-900">
            {isMr ? "विभाग आढळला नाही" : "Department Not Found"}
          </h2>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            {isMr
              ? "विनंती केलेला विभाग उपलब्ध नाही किंवा हटविला गेला आहे."
              : "The requested department could not be found. It may have been archived or removed."}
          </p>
          <div className="pt-2">
            <Link
              href="/departments"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-hover transition-colors shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{isMr ? "सर्व विभागांकडे परत जा" : "Back to All Departments"}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const icon = deptIcons[dept.icon] || <Building2 className="w-8 h-8 text-primary" />;

  const primaryName = isMr ? (dept.marathiName || dept.name) : dept.name;
  const secondaryName = isMr ? (dept.marathiName ? dept.name : "") : dept.marathiName;

  return (
    <div className="py-10">
      {/* Back Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <Link
          href="/departments"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isMr ? "सर्व विभागांकडे परत जा" : "Back to All Departments"}</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="bg-primary-light/60 border-y border-border py-12 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center border border-border shrink-0">
              {icon}
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary bg-white px-3 py-1 rounded-full border border-border">
                {isMr ? "नगर परिषद विभाग" : "Municipal Department"}
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-text-primary mt-2">
                {primaryName}
              </h1>
              {secondaryName && (
                <p className="text-sm font-semibold text-primary mt-1">{secondaryName}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Overview & Key Stats */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-border shadow-xs space-y-4">
              <h2 className="text-xl font-bold text-text-primary">
                {isMr ? "विभागीय विहंगावलोकन" : "Departmental Overview"}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {translatedOverview}
              </p>

              {/* Responsibilities */}
              {dept.responsibilities && dept.responsibilities.length > 0 && (
                <div className="pt-4 border-t border-gray-100 space-y-3">
                  <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
                    {isMr ? "मुख्य जबाबदाऱ्या आणि कार्यक्षेत्र:" : "Key Responsibilities & Scope:"}
                  </h3>
                  <div className="grid grid-cols-1 gap-2.5">
                    {dept.responsibilities.map((resp, idx) => (
                      <ResponsibilityItem key={idx} text={resp} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Additional Information Sections (Rendered above citizen services) */}
            {dept.additionalInfo && dept.additionalInfo.length > 0 && (
              <div className="space-y-6">
                {dept.additionalInfo.map((info, idx) => (
                  <AdditionalInfoBlock key={idx} info={info} />
                ))}
              </div>
            )}

            {/* Citizen Services Provided */}
            {dept.services && dept.services.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-border shadow-xs space-y-4">
                <h2 className="text-xl font-bold text-text-primary">
                  {isMr ? "नागरिक सेवा" : "Citizen Services Provided"}
                </h2>
                <p className="text-xs text-gray-600">
                  {isMr
                    ? "डिजिटल पद्धतीने किंवा नागरी सुविधा केंद्रावर (CFC) पुरविल्या जाणाऱ्या सेवा."
                    : "Services delivered digitally or at the Citizen Facilitation Center (CFC)."}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {dept.services.map((srv: any, idx: number) => (
                    <ServiceItem key={idx} srv={srv} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar: Head Officer & Contact & Clerk */}
          <div className="lg:col-span-4 space-y-6">
            {/* Department Head (HOD) */}
            <div className="bg-white p-6 rounded-2xl border border-border shadow-xs space-y-4">
              <h3 className="font-bold text-base text-text-primary border-b border-gray-100 pb-2">
                {isMr ? "विभागीय नेतृत्व" : "Departmental Leadership"}
              </h3>

              <div className="flex items-center gap-3.5">
                {dept.headOfficerImage ? (
                  <img
                    src={dept.headOfficerImage}
                    alt={dept.headOfficer}
                    className="w-14 h-14 rounded-2xl object-cover border border-border shadow-xs shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-primary-light text-primary flex items-center justify-center font-extrabold text-lg border border-border shrink-0 shadow-xs">
                    {dept.headOfficer?.charAt(0) || "H"}
                  </div>
                )}
                <div className="space-y-0.5">
                  <div className="text-[11px] text-gray-500 font-medium">
                    {isMr ? "विभाग प्रमुख" : "Head of Department (HOD)"}
                  </div>
                  <div className="text-base font-bold text-text-primary leading-tight">
                    {translatedHeadOfficer}
                  </div>
                  <div className="text-xs text-primary font-semibold">{translatedDesignation}</div>
                </div>
              </div>

              <div className="space-y-3 pt-3 text-xs text-gray-600 border-t border-gray-100">
                <div className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {isMr ? "थेट संपर्क" : "Direct Contact"}
                    </div>
                    <a href={`tel:${dept.phone}`} className="hover:underline text-primary">
                      {dept.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {isMr ? "अधिकृत ईमेल" : "Official Email"}
                    </div>
                    <a href={`mailto:${dept.email}`} className="hover:underline text-primary">
                      {dept.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {isMr ? "कार्यालय पत्ता" : "Office Location"}
                    </div>
                    <div>{translatedLocation}</div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/grievance/register"
                  className="w-full py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>{isMr ? "विभागीय तक्रार नोंदवा" : "Report Departmental Issue"}</span>
                </Link>
              </div>
            </div>

            {/* Designated Department Clerk / Desk Officer */}
            {(dept.clerkName || dept.clerkPhone || dept.clerkMobile || dept.clerkEmail) && (
              <div className="bg-gradient-to-br from-emerald-50/90 to-teal-50/40 p-6 rounded-2xl border border-emerald-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
                  <h3 className="font-bold text-sm text-emerald-950 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    <span>{isMr ? "टेबल अधिकारी / लिपिक" : "Desk Officer / Clerk"}</span>
                  </h3>
                  <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                    {isMr ? "नागरी टेबल" : "Citizen Desk"}
                  </span>
                </div>

                {dept.clerkName && (
                  <div className="space-y-0.5">
                    <div className="text-[11px] text-emerald-700 font-medium">
                      {isMr ? "नियुक्त सहाय्यक" : "Designated Assistant"}
                    </div>
                    <div className="text-sm font-bold text-gray-900">{translatedClerkName}</div>
                  </div>
                )}

                <div className="space-y-2.5 pt-1 text-xs text-gray-700">
                  {(dept.clerkPhone || dept.clerkMobile) && (
                    <div className="flex items-center gap-2.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <div>
                        <span className="text-gray-500 mr-1">
                          {isMr ? "थेट मोबाईल:" : "Direct Mobile:"}
                        </span>
                        <a
                          href={`tel:${dept.clerkPhone || dept.clerkMobile}`}
                          className="font-semibold text-emerald-800 hover:underline"
                        >
                          {dept.clerkPhone || dept.clerkMobile}
                        </a>
                      </div>
                    </div>
                  )}

                  {dept.clerkEmail && (
                    <div className="flex items-center gap-2.5">
                      <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <div className="truncate">
                        <span className="text-gray-500 mr-1">
                          {isMr ? "टेबल ईमेल:" : "Desk Email:"}
                        </span>
                        <a
                          href={`mailto:${dept.clerkEmail}`}
                          className="font-semibold text-emerald-800 hover:underline truncate"
                        >
                          {dept.clerkEmail}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Department Stats */}
            {dept.stats && dept.stats.length > 0 && (
              <div className="bg-primary-surface p-6 rounded-2xl border border-border space-y-3">
                <h3 className="font-bold text-xs uppercase tracking-wider text-gray-500">
                  {isMr ? "विभागाची कामगिरी" : "Department Performance"}
                </h3>
                <div className="space-y-2">
                  {dept.stats.map((stat, idx) => (
                    <StatRow key={idx} stat={stat} />
                  ))}
                </div>
              </div>
            )}

            {/* Downloadable Documents & By-laws */}
            {dept.documents && dept.documents.length > 0 && (
              <div className="bg-white p-6 rounded-2xl border border-border shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <h3 className="font-bold text-sm text-text-primary flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    <span>{isMr ? "दस्तऐवज व उपविधी" : "Documents & By-laws"}</span>
                  </h3>
                  <span className="text-[10px] font-bold text-primary bg-primary-light px-2 py-0.5 rounded-full border border-primary/20">
                    {dept.documents.length} {isMr ? "फाईल्स" : "Files"}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {dept.documents.map((doc, idx) => (
                    <DocumentRow key={idx} doc={doc} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
