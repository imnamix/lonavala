import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Users,
  Award,
  Phone,
  Mail,
  ChevronRight,
  ArrowLeft,
  Layers,
  MapPin,
  ShieldCheck,
  Building2,
} from "lucide-react";
import { getCommitteeById } from "@/lib/services/committee.service";
import { CouncilMember } from "@/types";
import { CouncilMemberTrigger } from "@/components/council/WardCorporators";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
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

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const committee = await getCommitteeById(id);
  if (!committee) {
    return { title: "Standing Committee | Lonavala Municipal Council" };
  }
  return {
    title: `${committee.name} | Lonavala Municipal Council`,
    description: committee.description || `Committee details and members of ${committee.name}.`,
  };
}

export default async function CommitteeDetailPage({ params }: PageProps) {
  const { id } = await params;
  const committee = await getCommitteeById(id);

  if (!committee) {
    notFound();
  }

  const chairman = committee.chairman;
  const members = committee.members || [];

  return (
    <div className="pt-2 pb-16 bg-slate-50/40 min-h-screen">
      {/* Page Header Banner */}
      <div className="relative bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white border-b border-emerald-800/40 py-12 sm:py-16 mb-12 overflow-hidden">
        {/* Background glow decorations */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
          {/* Breadcrumb & Back Link */}
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-300/80">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/council" className="hover:text-white transition-colors">
              Elected Council
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-semibold truncate max-w-xs sm:max-w-md">
              {committee.name}
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-2">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span>Statutory Subject Committee • विषय समिती</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                {committee.name}
              </h1>
              {committee.marathiName && (
                <p className="text-lg sm:text-xl font-bold text-emerald-300">
                  {committee.marathiName}
                </p>
              )}
              {committee.description && (
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light max-w-2xl pt-1">
                  {committee.description}
                </p>
              )}
            </div>

            {/* Back Button */}
            <div className="shrink-0">
              <Link
                href="/council"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 backdrop-blur-md transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to All Councils</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* 1. Committee Leadership / Chairman Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Committee Chairman / Chairperson (सभापती)
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Designated leadership head for this municipal committee
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Leadership
            </span>
          </div>

          {chairman ? (
            <CouncilMemberTrigger member={chairman}>
              <div className="bg-white rounded-3xl border-2 border-emerald-600/60 p-6 sm:p-8 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer">
                <div>
                  <div className="flex items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/90 text-emerald-900 text-xs font-bold border border-emerald-200 shadow-2xs">
                      <Award className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Committee Chairman (सभापती)</span>
                    </div>
                    {chairman.ward && (
                      <span className="text-[11px] font-semibold text-slate-500 bg-slate-50 px-2.5 py-0.5 rounded-full border border-slate-200">
                        {chairman.ward}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                    <div className="relative w-32 h-40 sm:w-36 sm:h-44 rounded-2xl overflow-hidden shadow-md shrink-0 border-2 border-white ring-1 ring-slate-200 bg-slate-100 group-hover:scale-102 transition-transform">
                      <MemberImage member={chairman} className="object-cover" />
                    </div>
                    <div className="space-y-1.5 text-center sm:text-left flex-1 min-w-0">
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                        {chairman.name}
                      </h3>
                      {chairman.marathiName && (
                        <p className="text-sm text-emerald-700 font-semibold">
                          {chairman.marathiName}
                        </p>
                      )}
                      <p className="text-xs text-slate-500 font-medium">
                        {chairman.designation || "Committee Chairman"}
                      </p>

                      <div className="pt-3 text-xs text-slate-600 space-y-1.5">
                        {chairman.phone && (
                          <p className="flex items-center justify-center sm:justify-start gap-2">
                            <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <a
                              href={`tel:${chairman.phone}`}
                              className="font-semibold text-slate-700 hover:text-emerald-700 transition-colors"
                            >
                              {chairman.phone}
                            </a>
                          </p>
                        )}
                        {chairman.email && (
                          <p className="flex items-center justify-center sm:justify-start gap-2 truncate">
                            <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <a
                              href={`mailto:${chairman.email}`}
                              className="text-slate-600 hover:text-emerald-700 transition-colors truncate"
                            >
                              {chairman.email}
                            </a>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {chairman.message && (
                    <div className="mt-4 pt-3.5 border-t border-slate-100">
                      <p className="text-xs sm:text-sm text-slate-600 italic border-l-2 border-emerald-600 pl-3 leading-relaxed bg-slate-50/70 p-2.5 rounded-r-xl">
                        &ldquo;{chairman.message}&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CouncilMemberTrigger>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
              No Chairperson is currently assigned for this committee.
            </div>
          )}
        </section>

        {/* 2. Committee Members Section */}
        <section className="space-y-6">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Committee Members (समिती सदस्य)
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Elected municipal corporators appointed to this committee
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {members.length} {members.length === 1 ? "Member" : "Members"}
            </span>
          </div>

          {members.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {members.map((member) => (
                <CouncilMemberTrigger key={member.id} member={member}>
                  <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-emerald-600/50 hover:shadow-lg transition-all flex flex-col justify-between group cursor-pointer">
                    <div className="space-y-4">
                      {/* Header badge */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 truncate">
                          {member.roleCategory || "Committee Member"}
                        </span>
                        {member.ward && (
                          <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">
                            {member.ward}
                          </span>
                        )}
                      </div>

                      {/* Member details */}
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-20 rounded-xl overflow-hidden shadow-sm shrink-0 border border-slate-200 bg-slate-100 group-hover:scale-105 transition-transform">
                          <MemberImage member={member} className="object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-base text-slate-900 group-hover:text-emerald-800 transition-colors leading-snug">
                            {member.name}
                          </h4>
                          {member.marathiName && (
                            <p className="text-xs text-emerald-700 font-semibold">
                              {member.marathiName}
                            </p>
                          )}
                          <p className="text-[11px] text-slate-500 font-medium line-clamp-1 mt-0.5">
                            {member.designation}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Contact Footer */}
                    <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                      {member.phone && (
                        <p className="flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="hover:text-emerald-700 font-medium">
                            {member.phone}
                          </span>
                        </p>
                      )}
                      {member.email && (
                        <p className="flex items-center gap-1.5 truncate">
                          <Mail className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="hover:text-emerald-700 truncate">
                            {member.email}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </CouncilMemberTrigger>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
              No additional members are currently listed for this committee.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
