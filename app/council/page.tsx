import Image from "next/image";
import Link from "next/link";
import {
  Phone,
  Mail,
  FileText,
  Download,
  Award,
  ShieldCheck,
  Briefcase,
  Users,
  Building2,
  MapPin,
} from "lucide-react";
import { getCouncilMembers } from "@/lib/services/council.service";
import { CouncilMember } from "@/types";

export const dynamic = "force-dynamic";

const COMMITTEE_MANDATES: Record<string, string> = {
  standing:
    "Financial sanctions, policy formulation, administrative reviews, and annual budget oversight.",
  "public works":
    "Road development, street lighting, stormwater drainage, and municipal civil infrastructure.",
  education:
    "Municipal primary schools, smart classrooms, student scholarships, and educational development.",
  sanitation:
    "Solid waste segregation, sanitation workers welfare, public dispensaries, and public health hygiene.",
  health:
    "Solid waste segregation, sanitation workers welfare, public dispensaries, and public health hygiene.",
  water:
    "Dam catchments, potable water pipeline distribution, water treatment plants, and drainage systems.",
  women:
    "Women self-help groups, microfinance schemes, Anganwadi nutrition, and civic skill training.",
  child:
    "Women self-help groups, microfinance schemes, Anganwadi nutrition, and civic skill training.",
};

function getCommitteeMandate(name: string) {
  const key = name.toLowerCase();
  const matchingKey = Object.keys(COMMITTEE_MANDATES).find((candidate) =>
    key.includes(candidate)
  );
  return matchingKey
    ? COMMITTEE_MANDATES[matchingKey]
    : "Oversees civic planning, public accountability, and service delivery within its assigned portfolio.";
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function MemberImage({
  member,
  className,
}: {
  member: CouncilMember;
  className: string;
}) {
  return member.image ? (
    <Image
      src={member.image}
      alt={member.name}
      fill
      className={className}
      sizes="(max-width: 768px) 100vw, 200px"
    />
  ) : (
    <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-emerald-800 text-xl font-bold">
      {getInitials(member.name)}
    </div>
  );
}

export const metadata = {
  title: "Elected Council & Corporators | Lonavala Municipal Council",
  description:
    "Elected President, Vice President, Committee Chairpersons, Ward Corporators, and Council resolutions of Lonavala Municipal Council.",
};

export default async function CouncilPage() {
  const liveMembers = await getCouncilMembers({ active: true });
  const members = liveMembers || [];

  const isPresident = (m: CouncilMember) =>
    m.roleCategory === "President" ||
    (m.designation?.toLowerCase().includes("president") &&
      !m.designation?.toLowerCase().includes("vice")) ||
    (m.designation?.toLowerCase().includes("नगराध्यक्ष") &&
      !m.designation?.toLowerCase().includes("उपनगराध्यक्ष"));

  const isVicePresident = (m: CouncilMember) =>
    m.roleCategory === "Vice President" ||
    m.designation?.toLowerCase().includes("vice president") ||
    m.designation?.toLowerCase().includes("vicepresident") ||
    m.designation?.toLowerCase().includes("उपनगराध्यक्ष");

  const isChairman = (m: CouncilMember) =>
    !isPresident(m) &&
    !isVicePresident(m) &&
    (m.designation?.toLowerCase().includes("chairman") ||
      m.designation?.toLowerCase().includes("chairperson") ||
      m.designation?.toLowerCase().includes("chair") ||
      m.designation?.toLowerCase().includes("सभापती") ||
      m.designation?.toLowerCase().includes("उपसभापती"));

  const president = members.find(isPresident);
  const vicePresident = members.find(isVicePresident);

  const chairmen = members.filter(isChairman);

  const corporators = members.filter(
    (m) => !isPresident(m) && !isVicePresident(m) && !isChairman(m)
  );

  const tenure = president?.tenure || "2022 - 2027";

  const committeeGroups = new Map<string, CouncilMember[]>();
  members.forEach((member) => {
    const committee = member.committee?.trim();
    if (!committee) return;
    const group = committeeGroups.get(committee) || [];
    group.push(member);
    committeeGroups.set(committee, group);
  });

  const committees = Array.from(committeeGroups, ([name, committeeMembers]) => {
    const chair =
      committeeMembers.find(isPresident) ||
      committeeMembers.find(isVicePresident) ||
      committeeMembers.find(isChairman) ||
      committeeMembers[0];

    return {
      name,
      chair,
      members: `${committeeMembers.length} ${
        committeeMembers.length === 1 ? "Member" : "Members"
      }`,
      mandate: getCommitteeMandate(name),
    };
  });

  const councilDocs = [
    {
      title: "Minutes of General Body Meeting - April 2025",
      date: "2025-04-25",
      size: "1.8 MB",
    },
    {
      title: "Resolution No. 42: Approval for Bushi Dam Promenade Masterplan",
      date: "2025-03-18",
      size: "920 KB",
    },
    {
      title: "Ward Demarcation & Voter Boundary Gazette 2024",
      date: "2024-11-10",
      size: "4.5 MB",
    },
    {
      title: "Code of Conduct & Rules of Procedure for Corporators",
      date: "2024-08-05",
      size: "2.1 MB",
    },
  ];

  return (
    <div className="py-10 bg-slate-50/40">
      {/* Page Header */}
      <div className="bg-gradient-to-br from-slate-50 via-white to-emerald-50/50 border-y border-slate-200/80 py-12 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-3.5 py-1 rounded-full border border-emerald-200">
              Democracy in Action • लोकशाही व जनसेवा
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              Elected Council & Representatives
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-light">
              Representing citizens across municipal wards, leading statutory subject committees, and driving sustainable civic development for Lonavala.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* 1. Council Leadership: President & Vice President */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Council Leadership (नगराध्यक्ष व उपनगराध्यक्ष)
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Executive heads of Lonavala Municipal Council
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 hidden sm:inline-block">
              Tenure {tenure}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* President Card */}
            {president && (
              <div className="bg-white rounded-3xl border-2 border-emerald-600/60 p-6 sm:p-7 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/90 text-emerald-900 text-xs font-bold border border-emerald-200 shadow-2xs">
                      <Award className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{president.designation || "President (नगराध्यक्ष)"}</span>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-50 px-2.5 py-0.5 rounded-full border border-slate-200">
                      {president.tenure || tenure}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
                    <div className="relative w-32 h-40 sm:w-36 sm:h-44 rounded-2xl overflow-hidden shadow-md shrink-0 border-2 border-white ring-1 ring-slate-200 bg-slate-100 group-hover:scale-102 transition-transform">
                      <MemberImage member={president} className="object-cover" />
                    </div>
                    <div className="space-y-1.5 text-center sm:text-left flex-1 min-w-0">
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                        {president.name}
                      </h3>
                      {president.marathiName && (
                        <p className="text-sm text-emerald-700 font-semibold">
                          {president.marathiName}
                        </p>
                      )}
                      <p className="text-xs text-slate-500 font-medium">
                        {president.committee || "Standing Committee Chairperson"}
                      </p>

                      <div className="pt-3 text-xs text-slate-600 space-y-1.5">
                        {president.phone && (
                          <p className="flex items-center justify-center sm:justify-start gap-2">
                            <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <a href={`tel:${president.phone}`} className="font-semibold text-slate-700 hover:text-emerald-700 transition-colors">
                              {president.phone}
                            </a>
                          </p>
                        )}
                        {president.email && (
                          <p className="flex items-center justify-center sm:justify-start gap-2 truncate">
                            <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <a href={`mailto:${president.email}`} className="text-slate-600 hover:text-emerald-700 transition-colors truncate">
                              {president.email}
                            </a>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {president.message && (
                    <div className="mt-4 pt-3.5 border-t border-slate-100">
                      <p className="text-xs sm:text-sm text-slate-600 italic border-l-2 border-emerald-600 pl-3 leading-relaxed bg-slate-50/70 p-2.5 rounded-r-xl">
                        &ldquo;{president.message}&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Vice President Card */}
            {vicePresident && (
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs hover:border-emerald-600/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200 shadow-2xs">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{vicePresident.designation || "Vice President (उपनगराध्यक्ष)"}</span>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-50 px-2.5 py-0.5 rounded-full border border-slate-200">
                      {vicePresident.tenure || tenure}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
                    <div className="relative w-32 h-40 sm:w-36 sm:h-44 rounded-2xl overflow-hidden shadow-md shrink-0 border-2 border-white ring-1 ring-slate-200 bg-slate-100 group-hover:scale-102 transition-transform">
                      <MemberImage member={vicePresident} className="object-cover" />
                    </div>
                    <div className="space-y-1.5 text-center sm:text-left flex-1 min-w-0">
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                        {vicePresident.name}
                      </h3>
                      {vicePresident.marathiName && (
                        <p className="text-sm text-emerald-700 font-semibold">
                          {vicePresident.marathiName}
                        </p>
                      )}
                      <p className="text-xs text-slate-500 font-medium">
                        {vicePresident.committee || "Public Works Committee"}
                      </p>

                      <div className="pt-3 text-xs text-slate-600 space-y-1.5">
                        {vicePresident.phone && (
                          <p className="flex items-center justify-center sm:justify-start gap-2">
                            <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <a href={`tel:${vicePresident.phone}`} className="font-semibold text-slate-700 hover:text-emerald-700 transition-colors">
                              {vicePresident.phone}
                            </a>
                          </p>
                        )}
                        {vicePresident.email && (
                          <p className="flex items-center justify-center sm:justify-start gap-2 truncate">
                            <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <a href={`mailto:${vicePresident.email}`} className="text-slate-600 hover:text-emerald-700 transition-colors truncate">
                              {vicePresident.email}
                            </a>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {vicePresident.message && (
                    <div className="mt-4 pt-3.5 border-t border-slate-100">
                      <p className="text-xs sm:text-sm text-slate-600 italic border-l-2 border-emerald-600 pl-3 leading-relaxed bg-slate-50/70 p-2.5 rounded-r-xl">
                        &ldquo;{vicePresident.message}&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {!president && !vicePresident && (
              <div className="col-span-full rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
                No council leadership records are currently published.
              </div>
            )}
          </div>
        </section>

        {/* 2. Committee Chairpersons (सभापती व उपसभापती) */}
        <section className="space-y-6">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Committee Chairpersons (सभापती व उपसभापती)
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Elected committee leaders heading key municipal subject portfolios
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {chairmen.length} {chairmen.length === 1 ? "Chairperson" : "Chairpersons"}
            </span>
          </div>

          {chairmen.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {chairmen.map((chair) => (
                <div
                  key={chair.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-emerald-600/50 hover:shadow-lg transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    {/* Header badge */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 truncate">
                        {chair.committee || "Committee Chairperson"}
                      </span>
                      {chair.ward && (
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">
                          {chair.ward}
                        </span>
                      )}
                    </div>

                    {/* Member details */}
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-20 rounded-xl overflow-hidden shadow-sm shrink-0 border border-slate-200 bg-slate-100 group-hover:scale-105 transition-transform">
                        <MemberImage member={chair} className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-base text-slate-900 group-hover:text-emerald-800 transition-colors leading-snug">
                          {chair.name}
                        </h4>
                        {chair.marathiName && (
                          <p className="text-xs text-emerald-700 font-semibold">
                            {chair.marathiName}
                          </p>
                        )}
                        <p className="text-[11px] text-slate-500 font-medium line-clamp-1 mt-0.5">
                          {chair.designation}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Footer */}
                  <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                    {chair.phone && (
                      <p className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                        <a href={`tel:${chair.phone}`} className="hover:text-emerald-700 font-medium">
                          {chair.phone}
                        </a>
                      </p>
                    )}
                    {chair.email && (
                      <p className="flex items-center gap-1.5 truncate">
                        <Mail className="w-3 h-3 text-emerald-600 shrink-0" />
                        <a href={`mailto:${chair.email}`} className="hover:text-emerald-700 truncate">
                          {chair.email}
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
              No committee chairpersons are currently listed.
            </div>
          )}
        </section>

        {/* 3. Ward Corporators (नगरसेवक / नगरसेविका) */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Ward Corporators (नगरसेवक व नगरसेविका)
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Elected grassroots representatives serving citizens across municipal wards
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {corporators.length} {corporators.length === 1 ? "Corporator" : "Corporators"}
            </span>
          </div>

          {corporators.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {corporators.map((corp) => (
                <div
                  key={corp.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs hover:border-emerald-600/50 hover:shadow-lg transition-all text-center flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden shadow-sm border-2 border-emerald-100 mb-3 group-hover:scale-105 transition-transform bg-slate-100">
                      <MemberImage member={corp} className="object-cover" />
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {corp.ward || "Ward Member"}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 mt-2 group-hover:text-emerald-800 transition-colors leading-snug">
                      {corp.name}
                    </h4>
                    {corp.marathiName && (
                      <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                        {corp.marathiName}
                      </p>
                    )}
                    <p className="text-[11px] font-medium text-slate-500 mt-1">
                      {corp.designation || "Councillor"}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-600">
                    {corp.phone ? (
                      <a
                        href={`tel:${corp.phone}`}
                        className="flex items-center justify-center gap-1 font-medium hover:text-emerald-700"
                      >
                        <Phone className="w-3 h-3 text-emerald-600" /> {corp.phone}
                      </a>
                    ) : (
                      <span className="text-slate-400">Civic Representative</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
              No active ward representatives are currently listed.
            </div>
          )}
        </section>

        {/* 4. Standing & Subject Committees */}
        <section className="space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-2xl font-bold text-slate-900">
              Standing & Subject Committees (विषय समित्या व कार्यकक्षा)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Statutory committees designated under the Maharashtra Municipal Councils Act
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {committees.map((comm, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-slate-900">{comm.name}</h3>
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    {comm.members}
                  </span>
                </div>
                {comm.chair && (
                  <div className="text-xs text-slate-700">
                    <strong>Chairperson:</strong> {comm.chair.name}
                    {comm.chair.designation ? ` — ${comm.chair.designation}` : ""}
                  </div>
                )}
                <p className="text-xs text-slate-600 leading-relaxed">{comm.mandate}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Council Documents & Resolutions */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Council Gazettes & Resolutions</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Official records of General Body meetings and municipal resolutions
              </p>
            </div>
            <Link href="/downloads" className="text-xs font-bold text-emerald-800 hover:underline">
              View All Documents →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {councilDocs.map((doc, idx) => (
              <div
                key={idx}
                className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-3 shadow-xs hover:border-emerald-600/50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700 shrink-0 border border-emerald-100">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
                      {doc.title}
                    </h4>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2">
                      <span>{doc.date}</span>
                      <span>•</span>
                      <span>{doc.size}</span>
                    </div>
                  </div>
                </div>

                <a
                  href="#"
                  download
                  className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-700 hover:text-white rounded-lg text-xs font-semibold text-slate-700 transition-colors shrink-0 flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">PDF</span>
                </a>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
