"use client";

import { useState } from "react";
import {
  FileText,
  Download,
  Users,
  Clock,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Mail,
  Scale,
} from "lucide-react";

export default function RtiRtsPage() {
  const [activeTab, setActiveTab] = useState<"RTI" | "RTS">("RTI");

  const rtiOfficers = [
    {
      role: "First Appellate Authority (प्रथम अपिलीय अधिकारी)",
      name: "Shri. Pandit Patil",
      designation: "Chief Officer / Commissioner",
      phone: "+91 2114 273032",
      email: "co@lonavalamc.gov.in",
      location: "Office of the Chief Officer, LMC Administrative Building",
    },
    {
      role: "Public Information Officer (जन माहिती अधिकारी - General)",
      name: "Shri. Tanmay Kulkarni",
      designation: "Assistant Municipal Commissioner & Admin In-Charge",
      phone: "+91 2114 273666",
      email: "admin@lonavalamc.gov.in",
      location: "Admin Wing, 1st Floor",
    },
    {
      role: "Public Information Officer (जन माहिती अधिकारी - Engineering)",
      name: "Er. Mahesh Kulkarni",
      designation: "City Engineer (PWD & Water)",
      phone: "+91 2114 273333",
      email: "pwd@lonavalamc.gov.in",
      location: "Engineering Wing, 2nd Floor",
    },
    {
      role: "Assistant Public Information Officer (सहाय्यक जन माहिती अधिकारी)",
      name: "Shri. Vikas Shinde",
      designation: "Superintendent, Citizen Facilitation Centre",
      phone: "+91 2114 273555",
      email: "cfc@lonavalamc.gov.in",
      location: "Ground Floor CFC Desk",
    },
  ];

  const rtsServices = [
    {
      service: "Issuance of Birth Certificate",
      designatedOfficer: "Medical Officer of Health",
      timeline: "3 Working Days",
      firstAppellate: "Chief Officer, LMC",
    },
    {
      service: "Issuance of Death Certificate",
      designatedOfficer: "Medical Officer of Health",
      timeline: "3 Working Days",
      firstAppellate: "Chief Officer, LMC",
    },
    {
      service: "Assessment & Transfer of Property (Mutation)",
      designatedOfficer: "Tax Superintendent",
      timeline: "15 Working Days",
      firstAppellate: "Chief Officer, LMC",
    },
    {
      service: "Sanction of Domestic Water Connection",
      designatedOfficer: "Executive Water Engineer",
      timeline: "14 Working Days",
      firstAppellate: "City Engineer, LMC",
    },
    {
      service: "Building Commencement Certificate (CC)",
      designatedOfficer: "Town Planning Officer",
      timeline: "30 Working Days",
      firstAppellate: "Chief Officer, LMC",
    },
    {
      service: "Trade License / Renewal",
      designatedOfficer: "Sanitary Inspector / License Superintendent",
      timeline: "7 Working Days",
      firstAppellate: "Chief Officer, LMC",
    },
    {
      service: "Tree Trimming & Danger Tree Cutting Permission",
      designatedOfficer: "Tree Officer",
      timeline: "10 Working Days",
      firstAppellate: "Chief Officer, LMC",
    },
  ];

  const rtiManuals = [
    { no: "Manual 1", title: "Particulars of Organization, Functions & Duties" },
    { no: "Manual 2", title: "Powers and Duties of Officers and Employees" },
    { no: "Manual 3", title: "Procedure followed in Decision-Making Process" },
    { no: "Manual 4", title: "Norms set for Discharge of Municipal Functions" },
    { no: "Manual 5", title: "Rules, Regulations, Instructions & Records Held" },
    { no: "Manual 6", title: "Statement of the Categories of Documents Held" },
    { no: "Manual 7", title: "Consultation with Members of the Public" },
    { no: "Manual 8", title: "Boards, Councils & Standing Committees" },
    { no: "Manual 9", title: "Directory of Municipal Officers and Employees" },
    { no: "Manual 10", title: "Monthly Remuneration Received by Each Officer" },
    { no: "Manual 11", title: "Budget Allocated to Each Agency & Plan Outlays" },
    { no: "Manual 12", title: "Manner of Execution of Subsidy Programs" },
  ];

  return (
    <div className="py-10">
      {/* Header */}
      <div className="bg-[#E8F5E9]/60 border-y border-[#D9E8DD] py-12 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2E8B57] bg-white px-3 py-1 rounded-full border border-[#D9E8DD]">
              Accountability & Citizen Rights
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] mt-3">
              RTI & Maharashtra Right to Services (RTS)
            </h1>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              Empowering citizens under the Right to Information Act, 2005 and Maharashtra Right to Public Services Act, 2015 with time-bound public delivery guarantees.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Tab Switcher */}
        <div className="flex items-center gap-4 border-b border-[#D9E8DD] pb-3">
          <button
            onClick={() => setActiveTab("RTI")}
            className={`px-6 py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 ${
              activeTab === "RTI"
                ? "bg-[#2E8B57] text-white shadow-md"
                : "bg-white border border-[#D9E8DD] text-gray-700 hover:bg-[#E8F5E9] hover:text-[#2E8B57]"
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>Right to Information (RTI 2005)</span>
          </button>

          <button
            onClick={() => setActiveTab("RTS")}
            className={`px-6 py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 ${
              activeTab === "RTS"
                ? "bg-[#2E8B57] text-white shadow-md"
                : "bg-white border border-[#D9E8DD] text-gray-700 hover:bg-[#E8F5E9] hover:text-[#2E8B57]"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Right to Public Services (RTS 2015)</span>
          </button>
        </div>

        {/* TAB 1: RTI CONTENT */}
        {activeTab === "RTI" && (
          <div className="space-y-12">
            {/* Officers Directory */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#1F2937]">
                    Public Information Officers & Appellate Authority
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Designated under Section 5(1) and Section 19(1) of the RTI Act, 2005
                  </p>
                </div>
                <a
                  href="https://rtionline.maharashtra.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-[#2E8B57] hover:bg-[#246E45] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs shrink-0"
                >
                  <span>File RTI Online</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {rtiOfficers.map((off, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-[#D9E8DD] p-6 shadow-xs hover:border-[#2E8B57] transition-all space-y-3"
                  >
                    <span className="text-[10px] font-bold text-[#2E8B57] bg-[#E8F5E9] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {off.role}
                    </span>
                    <h3 className="text-base font-bold text-[#1F2937]">{off.name}</h3>
                    <p className="text-xs text-gray-600 font-semibold">{off.designation}</p>

                    <div className="text-xs text-gray-500 space-y-1 pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-[#2E8B57]" />
                        <span>{off.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-[#2E8B57]" />
                        <span>{off.email}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 4(1)(b) Mandatory Disclosure Manuals */}
            <section className="bg-white rounded-2xl border border-[#D9E8DD] p-6 sm:p-8 shadow-xs space-y-4">
              <div>
                <h3 className="text-lg font-bold text-[#1F2937]">
                  Section 4(1)(b) Proactive Disclosures (17 Manuals)
                </h3>
                <p className="text-xs text-gray-500">
                  Voluntary transparency publication updated annually as per Central & State Information Commission mandates.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                {rtiManuals.map((man, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#F8FCF9] border border-[#D9E8DD] flex items-center justify-between hover:border-[#2E8B57] transition-colors"
                  >
                    <div className="overflow-hidden pr-2">
                      <span className="text-[10px] font-bold text-[#2E8B57]">{man.no}</span>
                      <h4 className="text-xs font-semibold text-gray-800 line-clamp-1">{man.title}</h4>
                    </div>
                    <a
                      href="#"
                      download
                      className="text-[11px] font-bold text-[#2E8B57] hover:underline shrink-0"
                    >
                      PDF
                    </a>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* TAB 2: RTS CONTENT */}
        {activeTab === "RTS" && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-[#1F2937]">
                  Maharashtra Right to Public Services Act (RTS), 2015
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Citizen Services Charter with legal time-bound guarantee and appeal hierarchy.
                </p>
              </div>
              <a
                href="https://aaplesarkar.mahaonline.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-[#2E8B57] hover:bg-[#246E45] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs shrink-0"
              >
                <span>Aaple Sarkar Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* RTS Table */}
            <div className="bg-white rounded-2xl border border-[#D9E8DD] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F8FCF9] border-b border-[#D9E8DD] text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                      <th className="py-4 px-6">Notified Civic Service</th>
                      <th className="py-4 px-6">Designated Officer</th>
                      <th className="py-4 px-6">Stipulated Timeline</th>
                      <th className="py-4 px-6">First Appellate Authority</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                    {rtsServices.map((rts, idx) => (
                      <tr key={idx} className="hover:bg-[#E8F5E9]/30 transition-colors">
                        <td className="py-4 px-6 font-bold text-[#1F2937]">{rts.service}</td>
                        <td className="py-4 px-6 text-gray-600">{rts.designatedOfficer}</td>
                        <td className="py-4 px-6">
                          <span className="font-bold text-[#2E8B57] bg-[#E8F5E9] px-2.5 py-1 rounded-full">
                            {rts.timeline}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-600 font-medium">{rts.firstAppellate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
