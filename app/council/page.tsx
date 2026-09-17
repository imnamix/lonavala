import Image from "next/image";
import Link from "next/link";
import {
  Phone,
  Mail,
  FileText,
  Download,
} from "lucide-react";
import { COUNCIL_MEMBERS } from "@/data/mockData";
import { getCouncilMembers } from "@/lib/services/council.service";
import { CouncilMember } from "@/types";

export const dynamic = "force-dynamic";

const COMMITTEE_MANDATES: Record<string, string> = {
  standing:
    "Financial sanctions, policy formulation, administrative reviews, and annual budget oversight.",
  "public works":
    "Road tenders, street lighting, stormwater drainage, and civil infrastructure.",
  sanitation:
    "Solid waste management, dam catchments, water distribution, and environmental safety.",
  water:
    "Solid waste management, dam catchments, water distribution, and environmental safety.",
  women:
    "Self-help group microfinance, Anganwadi nutrition, civic maternity care, and skill training.",
  child:
    "Self-help group microfinance, Anganwadi nutrition, civic maternity care, and skill training.",
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

function MemberImage({ member, className }: { member: CouncilMember; className: string }) {
  return member.image ? (
    <Image
      src={member.image}
      alt={member.name}
      fill
      className={className}
      sizes="(max-width: 768px) 100vw, 180px"
    />
  ) : (
    <div className="w-full h-full flex items-center justify-center bg-primary-light text-primary text-xl font-bold">
      {getInitials(member.name)}
    </div>
  );
}

export const metadata = {
  title: "Elected Council & Corporators | Lonavala Municipal Council",
  description:
    "Elected President, Vice President, Ward Corporators, Standing Committees and Council resolutions of Lonavala Municipal Council.",
};

export default async function CouncilPage() {
  const liveMembers = await getCouncilMembers({ active: true });
  const members = liveMembers.length > 0 ? liveMembers : COUNCIL_MEMBERS;

  const president = members.find(
    (member) =>
      member.roleCategory === "President" ||
      (member.designation.toLowerCase().includes("president") &&
        !member.designation.toLowerCase().includes("vice"))
  );
  const vicePresident = members.find(
    (member) =>
      member.roleCategory === "Vice President" ||
      member.designation.toLowerCase().includes("vice president")
  );
  const corporators = members.filter(
    (member) =>
      member.roleCategory === "Corporator" ||
      member.designation.toLowerCase().includes("corporator")
  );

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
      committeeMembers.find((member) => member.roleCategory === "President") ||
      committeeMembers.find((member) => member.roleCategory === "Vice President") ||
      committeeMembers[0];

    return {
      name,
      chair,
      members: `${committeeMembers.length} ${
        committeeMembers.length === 1 ? "Council Member" : "Council Members"
      }`,
      mandate: getCommitteeMandate(name),
    };
  });

  const wardCount = new Set(
    corporators
      .map((member) => member.ward?.match(/ward\s+\d+/i)?.[0].toLowerCase())
      .filter(Boolean)
  ).size;
  const tenure =
    president?.tenure ||
    corporators.find((member) => member.tenure)?.tenure ||
    "Current term";

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
    <div className="py-10">
      {/* Page Header */}
      <div className="bg-primary-light/60 border-y border-border py-12 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-white px-3 py-1 rounded-full border border-border">
              Democracy in Action
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary mt-3">
              Elected Council & Ward Corporators
            </h1>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              Representing citizens across {wardCount || "the municipal"} {wardCount === 1 ? "ward" : "wards"}, deliberating policies, and driving civic progress for Lonavala.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Leadership: President & Vice President */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-text-primary border-b border-border pb-3">
            Council Leadership
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* President Card */}
            {president && <div className="bg-white rounded-2xl border-2 border-primary p-6 shadow-md flex flex-col sm:flex-row gap-6 items-center sm:items-start">
              <div className="relative w-36 h-44 rounded-2xl overflow-hidden shadow-md shrink-0 border-2 border-primary-light">
                <MemberImage member={president} className="object-cover" />
              </div>
              <div className="space-y-2 text-center sm:text-left">
                <span className="text-xs font-bold uppercase tracking-wider bg-primary-light text-primary px-3 py-1 rounded-full">
                  {president.designation}
                </span>
                <h3 className="text-xl font-bold text-text-primary">{president.name}</h3>
                <p className="text-xs text-primary font-semibold">{president.marathiName}</p>
                <p className="text-xs text-gray-600 italic">&ldquo;{president.message}&rdquo;</p>
                <div className="pt-2 text-xs text-gray-500 space-y-1">
                  <p className="flex items-center justify-center sm:justify-start gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-primary" /> {president.phone}
                  </p>
                  <p className="flex items-center justify-center sm:justify-start gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-primary" /> {president.email}
                  </p>
                </div>
              </div>
            </div>}

            {/* Vice President Card */}
            {vicePresident && <div className="bg-white rounded-2xl border border-border p-6 shadow-xs hover:border-primary transition-all flex flex-col sm:flex-row gap-6 items-center sm:items-start">
              <div className="relative w-36 h-44 rounded-2xl overflow-hidden shadow-md shrink-0 border-2 border-gray-100">
                <MemberImage member={vicePresident} className="object-cover" />
              </div>
              <div className="space-y-2 text-center sm:text-left">
                <span className="text-xs font-bold uppercase tracking-wider bg-gray-100 text-gray-800 px-3 py-1 rounded-full">
                  {vicePresident.designation}
                </span>
                <h3 className="text-xl font-bold text-text-primary">{vicePresident.name}</h3>
                <p className="text-xs text-primary font-semibold">{vicePresident.marathiName}</p>
                <p className="text-xs text-gray-600 italic">&ldquo;{vicePresident.message}&rdquo;</p>
                <div className="pt-2 text-xs text-gray-500 space-y-1">
                  <p className="flex items-center justify-center sm:justify-start gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-primary" /> {vicePresident.phone}
                  </p>
                  <p className="flex items-center justify-center sm:justify-start gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-primary" /> {vicePresident.email}
                  </p>
                </div>
              </div>
            </div>}
          </div>
        </section>

        {/* Corporators Grid & Ward Information */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-3">
            <div>
              <h2 className="text-2xl font-bold text-text-primary">Ward Corporators (नगरसेवक)</h2>
              <p className="text-xs text-gray-600 mt-1">
                Elected representatives for {wardCount ? `${wardCount} municipal wards` : "the municipal wards"}
              </p>
            </div>
            <span className="text-xs font-bold text-primary bg-primary-light px-3 py-1 rounded-full">
              Tenure {tenure}
            </span>
          </div>

          {corporators.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {corporators.map((corp) => (
              <div
                key={corp.id}
                className="bg-white rounded-2xl border border-border p-4 shadow-xs hover:border-primary hover:shadow-lg transition-all text-center flex flex-col justify-between group"
              >
                <div>
                  <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden shadow-sm border-2 border-primary-light mb-3 group-hover:scale-105 transition-transform">
                    <MemberImage member={corp} className="object-cover" />
                  </div>
                  <span className="text-[10px] font-bold text-primary bg-primary-light px-2 py-0.5 rounded-full">
                    {corp.ward?.split("-")[0] || "Ward Member"}
                  </span>
                  <h4 className="font-bold text-sm text-text-primary mt-2 group-hover:text-primary transition-colors">
                    {corp.name}
                  </h4>
                  <p className="text-[11px] text-gray-500">{corp.marathiName}</p>
                  <p className="text-[11px] font-medium text-gray-700 mt-2 bg-primary-surface p-1.5 rounded-lg border border-border">
                    {corp.ward?.split("-")[1] || "Municipal Ward"}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-600">
                  <p className="flex items-center justify-center gap-1">
                    <Phone className="w-3 h-3 text-primary" /> {corp.phone}
                  </p>
                </div>
              </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-white p-8 text-center text-sm text-gray-500">
              No active ward representatives are currently listed.
            </div>
          )}
        </section>

        {/* Standing Committees */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-text-primary border-b border-border pb-3">
            Standing & Subject Committees
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {committees.map((comm, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-border shadow-xs hover:shadow-md transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-text-primary">{comm.name}</h3>
                  <span className="text-xs font-semibold text-primary bg-primary-light px-2.5 py-1 rounded-lg">
                    {comm.members}
                  </span>
                </div>
                <div className="text-xs text-gray-700">
                    <strong>Chairperson:</strong> {comm.chair.name}
                    {comm.chair.designation ? ` — ${comm.chair.designation}` : ""}
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{comm.mandate}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Council Documents & Resolutions */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="text-2xl font-bold text-text-primary">Council Gazettes & Resolutions</h2>
            <Link href="/downloads" className="text-xs font-bold text-primary hover:underline">
              View All Documents →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {councilDocs.map((doc, idx) => (
              <div
                key={idx}
                className="bg-white p-4 rounded-xl border border-border flex items-center justify-between gap-3 shadow-xs hover:border-primary transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center text-primary shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-text-primary line-clamp-1">
                      {doc.title}
                    </h4>
                    <div className="text-[11px] text-gray-500 flex items-center gap-2">
                      <span>{doc.date}</span>
                      <span>•</span>
                      <span>{doc.size}</span>
                    </div>
                  </div>
                </div>

                <a
                  href="#"
                  download
                  className="px-3 py-1.5 bg-gray-100 hover:bg-primary hover:text-white rounded-lg text-xs font-semibold text-gray-700 transition-colors shrink-0 flex items-center gap-1"
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
