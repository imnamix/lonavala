import Image from "next/image";
import Link from "next/link";
import {
  Users,
  Phone,
  Mail,
  Award,
  FileText,
  MapPin,
  CheckCircle,
  Download,
  Calendar,
} from "lucide-react";
import { COUNCIL_MEMBERS } from "@/data/mockData";

export const metadata = {
  title: "Elected Council & Corporators | Lonavala Municipal Council",
  description:
    "Elected President, Vice President, Ward Corporators, Standing Committees and Council resolutions of Lonavala Municipal Council.",
};

export default function CouncilPage() {
  const president = COUNCIL_MEMBERS[0];
  const vicePresident = COUNCIL_MEMBERS[1];
  const corporators = COUNCIL_MEMBERS.slice(3);

  const committees = [
    {
      name: "Standing Committee (स्थायी समिती)",
      chair: "Smt. Surekha Nitin Jadhav (President)",
      members: "5 Elected Corporators",
      mandate: "Financial sanctions, policy formulation, administrative reviews, and annual budget oversight.",
    },
    {
      name: "Public Works Committee (सार्वजनिक बांधकाम समिती)",
      chair: "Shri. Rajesh Shinde (Vice President)",
      members: "4 Elected Corporators",
      mandate: "Road tenders, street lighting, stormwater drainage, and civil infrastructure.",
    },
    {
      name: "Sanitation & Water Works (स्वच्छता व पाणीपुरवठा समिती)",
      chair: "Shri. Amit Vilas Gaikwad",
      members: "4 Elected Corporators",
      mandate: "Solid waste management, dam catchments, water distribution, and environmental safety.",
    },
    {
      name: "Women & Child Welfare Committee (महिला व बालकल्याण समिती)",
      chair: "Smt. Kavita Anil Sonawane",
      members: "4 Elected Corporators",
      mandate: "Self-help group microfinance, Anganwadi nutrition, civic maternity care, and skill training.",
    },
  ];

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
      <div className="bg-[#E8F5E9]/60 border-y border-[#D9E8DD] py-12 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2E8B57] bg-white px-3 py-1 rounded-full border border-[#D9E8DD]">
              Democracy in Action
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] mt-3">
              Elected Council & Ward Corporators
            </h1>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              Representing the citizens across 5 municipal wards, deliberating policies, and driving civic progress for Lonavala.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Leadership: President & Vice President */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-[#1F2937] border-b border-[#D9E8DD] pb-3">
            Council Leadership
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* President Card */}
            <div className="bg-white rounded-2xl border-2 border-[#2E8B57] p-6 shadow-md flex flex-col sm:flex-row gap-6 items-center sm:items-start">
              <div className="relative w-36 h-44 rounded-2xl overflow-hidden shadow-md shrink-0 border-2 border-[#E8F5E9]">
                <Image
                  src={president.image}
                  alt={president.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-2 text-center sm:text-left">
                <span className="text-xs font-bold uppercase tracking-wider bg-[#E8F5E9] text-[#2E8B57] px-3 py-1 rounded-full">
                  {president.designation}
                </span>
                <h3 className="text-xl font-bold text-[#1F2937]">{president.name}</h3>
                <p className="text-xs text-[#2E8B57] font-semibold">{president.marathiName}</p>
                <p className="text-xs text-gray-600 italic">&ldquo;{president.message}&rdquo;</p>
                <div className="pt-2 text-xs text-gray-500 space-y-1">
                  <p className="flex items-center justify-center sm:justify-start gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#2E8B57]" /> {president.phone}
                  </p>
                  <p className="flex items-center justify-center sm:justify-start gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#2E8B57]" /> {president.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Vice President Card */}
            <div className="bg-white rounded-2xl border border-[#D9E8DD] p-6 shadow-xs hover:border-[#2E8B57] transition-all flex flex-col sm:flex-row gap-6 items-center sm:items-start">
              <div className="relative w-36 h-44 rounded-2xl overflow-hidden shadow-md shrink-0 border-2 border-gray-100">
                <Image
                  src={vicePresident.image}
                  alt={vicePresident.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-2 text-center sm:text-left">
                <span className="text-xs font-bold uppercase tracking-wider bg-gray-100 text-gray-800 px-3 py-1 rounded-full">
                  {vicePresident.designation}
                </span>
                <h3 className="text-xl font-bold text-[#1F2937]">{vicePresident.name}</h3>
                <p className="text-xs text-[#2E8B57] font-semibold">{vicePresident.marathiName}</p>
                <p className="text-xs text-gray-600 italic">&ldquo;{vicePresident.message}&rdquo;</p>
                <div className="pt-2 text-xs text-gray-500 space-y-1">
                  <p className="flex items-center justify-center sm:justify-start gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#2E8B57]" /> {vicePresident.phone}
                  </p>
                  <p className="flex items-center justify-center sm:justify-start gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#2E8B57]" /> {vicePresident.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Corporators Grid & Ward Information */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#D9E8DD] pb-3">
            <div>
              <h2 className="text-2xl font-bold text-[#1F2937]">Ward Corporators (नगरसेवक)</h2>
              <p className="text-xs text-gray-600 mt-1">Elected representatives for Wards 1 through 5</p>
            </div>
            <span className="text-xs font-bold text-[#2E8B57] bg-[#E8F5E9] px-3 py-1 rounded-full">
              Tenure 2022 - 2027
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {corporators.map((corp) => (
              <div
                key={corp.id}
                className="bg-white rounded-2xl border border-[#D9E8DD] p-4 shadow-xs hover:border-[#2E8B57] hover:shadow-lg transition-all text-center flex flex-col justify-between group"
              >
                <div>
                  <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden shadow-sm border-2 border-[#E8F5E9] mb-3 group-hover:scale-105 transition-transform">
                    <Image
                      src={corp.image}
                      alt={corp.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-[#2E8B57] bg-[#E8F5E9] px-2 py-0.5 rounded-full">
                    {corp.ward?.split("-")[0] || "Ward Member"}
                  </span>
                  <h4 className="font-bold text-sm text-[#1F2937] mt-2 group-hover:text-[#2E8B57] transition-colors">
                    {corp.name}
                  </h4>
                  <p className="text-[11px] text-gray-500">{corp.marathiName}</p>
                  <p className="text-[11px] font-medium text-gray-700 mt-2 bg-[#F8FCF9] p-1.5 rounded-lg border border-[#D9E8DD]">
                    {corp.ward?.split("-")[1] || "Municipal Ward"}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-600">
                  <p className="flex items-center justify-center gap-1">
                    <Phone className="w-3 h-3 text-[#2E8B57]" /> {corp.phone}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Standing Committees */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-[#1F2937] border-b border-[#D9E8DD] pb-3">
            Standing & Subject Committees
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {committees.map((comm, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-[#D9E8DD] shadow-xs hover:shadow-md transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-[#1F2937]">{comm.name}</h3>
                  <span className="text-xs font-semibold text-[#2E8B57] bg-[#E8F5E9] px-2.5 py-1 rounded-lg">
                    {comm.members}
                  </span>
                </div>
                <div className="text-xs text-gray-700">
                  <strong>Chairperson:</strong> {comm.chair}
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{comm.mandate}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Council Documents & Resolutions */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#D9E8DD] pb-3">
            <h2 className="text-2xl font-bold text-[#1F2937]">Council Gazettes & Resolutions</h2>
            <Link href="/downloads" className="text-xs font-bold text-[#2E8B57] hover:underline">
              View All Documents →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {councilDocs.map((doc, idx) => (
              <div
                key={idx}
                className="bg-white p-4 rounded-xl border border-[#D9E8DD] flex items-center justify-between gap-3 shadow-xs hover:border-[#2E8B57] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#E8F5E9] flex items-center justify-center text-[#2E8B57] shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#1F2937] line-clamp-1">
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
                  className="px-3 py-1.5 bg-gray-100 hover:bg-[#2E8B57] hover:text-white rounded-lg text-xs font-semibold text-gray-700 transition-colors shrink-0 flex items-center gap-1"
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
