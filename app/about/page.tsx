import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  Target,
  Eye,
  Award,
  Users,
  History,
  FileCheck,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { COUNCIL_MEMBERS, MUNICIPAL_STATS } from "@/data/mockData";
import { StatisticsSection } from "@/components/shared/StatisticsSection";

export const metadata = {
  title: "About Us | Lonavala Municipal Council",
  description:
    "History, Vision, Mission, Commissioner's message, and Administrative organization chart of Lonavala Municipal Council.",
};

export default function AboutPage() {
  const commissioner = COUNCIL_MEMBERS[2];

  const galleryImages = [
    {
      src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
      caption: "Sahyadri Mountain Range & Borghat Valley",
    },
    {
      src: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800&q=80",
      caption: "Bushi Dam Monsoon Catchment",
    },
    {
      src: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=800&q=80",
      caption: "Ryewood Botanical Garden Restoration",
    },
    {
      src: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80",
      caption: "Karla Ancient Rock-Cut Heritage",
    },
  ];

  return (
    <div className="py-10">
      {/* Header Banner */}
      <div className="bg-[#E8F5E9]/60 border-y border-[#D9E8DD] py-12 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2E8B57] bg-white px-3 py-1 rounded-full border border-[#D9E8DD]">
              Council Profile
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] mt-3">
              About Lonavala Municipal Council
            </h1>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              Serving the historic hill retreat of Maharashtra with sustainable eco-governance, modern infrastructure, and citizen-first digital services since 1877.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* History Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F5E9] text-[#2E8B57] text-xs font-bold">
              <History className="w-4 h-4" />
              <span>Historical Legacy</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2937]">
              Over a Century of Hill-Station Stewardship
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Lonavala was discovered as a hill retreat in 1871 by Sir Mountstuart Elphinstone and formally constituted as a Municipal Municipality in <strong>1877</strong>. Perched at an elevation of 624 meters in the Sahyadri mountains of the Western Ghats, Lonavala serves as a vital ecological and recreational gateway between Mumbai and Pune.
            </p>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Today, Lonavala Municipal Council (LMC) oversees 5 municipal wards, governing over 68,000 permanent residents and catering to more than 3.5 million domestic and international tourists annually. Under the Maharashtra Municipal Councils, Nagar Panchayats and Industrial Townships Act, 1965, the council upholds the highest standards of environmental conservation, sustainable water supply, and municipal hygiene.
            </p>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative aspect-4/3 rounded-3xl overflow-hidden shadow-xl border-4 border-white">
              <Image
                src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80"
                alt="Lonavala Historical Borghat"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-[#2E8B57] text-white p-4 rounded-2xl shadow-lg">
              <div className="text-2xl font-black">Est. 1877</div>
              <div className="text-[11px] text-emerald-100">148+ Years of Civic Service</div>
            </div>
          </div>
        </section>

        {/* Vision & Mission Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl border border-[#D9E8DD] p-8 shadow-xs hover:border-[#2E8B57] transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#E8F5E9] flex items-center justify-center text-[#2E8B57] mb-4">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#1F2937] mb-3">Our Vision</h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              To transform Lonavala into India&apos;s leading carbon-neutral, clean, and digitally advanced eco-tourism hill station, while preserving its pristine Sahyadri biodiversity and ensuring dignified civic amenities for every resident.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#D9E8DD] p-8 shadow-xs hover:border-[#2E8B57] transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#E8F5E9] flex items-center justify-center text-[#2E8B57] mb-4">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#1F2937] mb-3">Our Mission</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2E8B57] shrink-0 mt-0.5" />
                <span>Deliver 100% door-to-door segregated waste processing and plastic-free tourism.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2E8B57] shrink-0 mt-0.5" />
                <span>Provide 24x7 treated potable water supply and eco-conscious underground sewerage.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2E8B57] shrink-0 mt-0.5" />
                <span>Enforce zero-tolerance transparency through time-bound online grievance redressal.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Commissioner's Message */}
        <section className="bg-[#F8FCF9] border border-[#D9E8DD] rounded-3xl p-8 sm:p-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-4 flex flex-col items-center text-center">
              <div className="relative w-36 h-36 rounded-full overflow-hidden shadow-lg border-4 border-[#2E8B57] mb-3">
                <Image
                  src={commissioner.image}
                  alt={commissioner.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h4 className="font-bold text-[#1F2937] text-base">{commissioner.name}</h4>
              <p className="text-xs text-[#2E8B57] font-semibold">{commissioner.designation}</p>
              <p className="text-[11px] text-gray-500">{commissioner.phone}</p>
            </div>

            <div className="md:col-span-8 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-[#2E8B57]">
                Chief Officer&apos;s Communiqué
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#1F2937]">
                Advancing Citizen-Centric e-Governance
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                &ldquo;It gives me immense pride to welcome you to the official digital portal of Lonavala Municipal Council. As our hill-station welcomes millions of visitors every season, our administrative team is dedicated to balancing rapid urban amenities with strict ecological conservation. Through this portal, citizens can now track grievances in real-time, pay municipal taxes seamlessly, and verify development sanctions with complete transparency.&rdquo;
              </p>
              <div className="pt-2">
                <span className="text-xs font-semibold text-gray-800">
                  — Office of the Chief Officer, LMC Lonavala
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Organization Chart */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2E8B57] bg-[#E8F5E9] px-3 py-1 rounded-full border border-[#D9E8DD]">
              Hierarchy & Administration
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2937] mt-2">
              Organizational Chart
            </h2>
            <p className="text-xs text-gray-600 mt-1">
              Structure of the General Body and Administrative Executive Wings
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#D9E8DD] overflow-x-auto">
            <div className="min-w-[680px] flex flex-col items-center text-center space-y-6">
              {/* Level 1: General Body & President */}
              <div className="bg-[#2E8B57] text-white px-6 py-3 rounded-xl shadow-md font-bold text-sm w-72">
                General Body & Municipal President
                <div className="text-[11px] text-emerald-100 font-normal">Smt. Surekha Nitin Jadhav</div>
              </div>

              <div className="w-0.5 h-6 bg-gray-300" />

              {/* Level 2: Chief Officer */}
              <div className="bg-white border-2 border-[#2E8B57] text-[#1F2937] px-6 py-3 rounded-xl shadow-sm font-bold text-sm w-72">
                Chief Officer / Commissioner
                <div className="text-[11px] text-[#2E8B57] font-semibold">Shri. Pandit Patil (State Cadre)</div>
              </div>

              <div className="w-0.5 h-6 bg-gray-300" />

              {/* Level 3: Department Heads */}
              <div className="grid grid-cols-4 gap-4 w-full">
                <div className="bg-[#F8FCF9] border border-[#D9E8DD] p-3 rounded-xl">
                  <div className="font-bold text-xs text-[#1F2937]">Health & Sanitation</div>
                  <div className="text-[11px] text-gray-500">Dr. Sandeep Deshmukh</div>
                </div>
                <div className="bg-[#F8FCF9] border border-[#D9E8DD] p-3 rounded-xl">
                  <div className="font-bold text-xs text-[#1F2937]">Public Works (PWD)</div>
                  <div className="text-[11px] text-gray-500">Er. Mahesh Kulkarni</div>
                </div>
                <div className="bg-[#F8FCF9] border border-[#D9E8DD] p-3 rounded-xl">
                  <div className="font-bold text-xs text-[#1F2937]">Water Supply</div>
                  <div className="text-[11px] text-gray-500">Er. Rameshwar Kale</div>
                </div>
                <div className="bg-[#F8FCF9] border border-[#D9E8DD] p-3 rounded-xl">
                  <div className="font-bold text-xs text-[#1F2937]">Town Planning</div>
                  <div className="text-[11px] text-gray-500">Ar. Sneha Joshi</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Image Gallery */}
        <section className="space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2937]">
              Lonavala Municipal Gallery
            </h2>
            <p className="text-xs text-gray-600 mt-1">
              Glimpses of our scenic hill station landscapes and municipal infrastructure
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {galleryImages.map((img, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl overflow-hidden border border-[#D9E8DD] shadow-xs group"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={img.src}
                    alt={img.caption}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="25vw"
                  />
                </div>
                <div className="p-3 text-center text-xs font-semibold text-gray-800">
                  {img.caption}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-16">
        <StatisticsSection />
      </div>
    </div>
  );
}
