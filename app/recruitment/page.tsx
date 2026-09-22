"use client";

import { useState, useEffect } from "react";
import { Briefcase, Download, Calendar, CheckCircle2, FileText, ArrowRight, UserCheck, AlertCircle } from "lucide-react";
import { getAllRecruitments, INITIAL_RECRUITMENTS } from "@/lib/services/recruitment.service";
import { RecruitmentVacancy } from "@/types";

export default function RecruitmentPage() {
  const [recruitments, setRecruitments] = useState<RecruitmentVacancy[]>(INITIAL_RECRUITMENTS);
  const [activeTab, setActiveTab] = useState<"Vacancies" | "Advertisements" | "Results" | "Documents">("Vacancies");

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getAllRecruitments();
        if (data && data.length > 0) {
          setRecruitments(data);
        }
      } catch (e) {
        console.error("Failed to load recruitments on public page:", e);
      }
    }
    loadData();
  }, []);

  const vacancies = recruitments.filter((r) => r.status === "Active");
  const results = recruitments.filter((r) => r.status === "Result Declared");
  const archived = recruitments;

  return (
    <div className="py-10">
      {/* Header */}
      <div className="bg-primary-light/60 border-y border-border py-12 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-white px-3 py-1 rounded-full border border-border">
              Municipal Careers
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary mt-3">
              Recruitment & Career Opportunities
            </h1>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              Official notifications, advertisements, application procedures, syllabi, and selection results for Lonavala Municipal Council staff postings.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* How to Apply Information Card */}
        <div className="bg-white rounded-3xl border-2 border-primary p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center text-primary shrink-0">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-text-primary">
                  Important Instructions for Candidates
                </h2>
                <p className="text-xs text-gray-500">
                  Direct online submission via Maharashtra Government Portal
                </p>
              </div>
            </div>

            <a
              href="https://mahaonline.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
            >
              <span>Apply on MahaOnline Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 text-xs text-gray-700">
            <div className="space-y-1">
              <div className="font-bold text-text-primary flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span>Eligibility & Reservation</span>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Age limits, educational qualifications, and state caste/domicile reservation norms as per Maharashtra Civil Services Rules.
              </p>
            </div>

            <div className="space-y-1">
              <div className="font-bold text-text-primary flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span>Application Fee</span>
              </div>
              <p className="text-gray-600 leading-relaxed">
                General Category: ₹500 | Reserved Categories: ₹300. Payable online via credit/debit card or net banking.
              </p>
            </div>

            <div className="space-y-1">
              <div className="font-bold text-text-primary flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span>Document Verification</span>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Shortlisted candidates must produce original mark sheets, domicile certificates, and MSCIT computer proficiency proofs.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-border pb-3">
          {(["Vacancies", "Advertisements", "Results", "Documents"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab
                  ? "bg-primary text-white shadow-xs"
                  : "bg-white border border-border text-gray-700 hover:bg-primary-light hover:text-primary"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab 1: Current Vacancies */}
        {activeTab === "Vacancies" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {vacancies.map((vac) => (
              <div
                key={vac.id}
                className="bg-white rounded-2xl border border-border p-6 shadow-xs hover:border-primary hover:shadow-lg transition-all space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-primary bg-primary-light px-2.5 py-1 rounded-full">
                      Advt: {vac.advertisementNo}
                    </span>
                    <span className="text-xs font-bold text-gray-700 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-200">
                      {vac.vacancies} Posts
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-text-primary leading-snug">{vac.postName}</h3>
                  <div className="text-xs text-gray-500 mt-1">Department: {vac.department}</div>

                  <div className="mt-4 p-3 rounded-xl bg-primary-surface border border-border space-y-1.5 text-xs text-gray-700">
                    <div>
                      <strong>Qualification:</strong> {vac.qualification}
                    </div>
                    <div>
                      <strong>Pay Scale:</strong> {vac.payScale}
                    </div>
                    <div className="text-red-600 font-semibold">
                      <strong>Last Date:</strong> {vac.lastDate}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <a
                    href="#"
                    download
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Detailed Notification</span>
                  </a>

                  <a
                    href="https://mahaonline.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                  >
                    Apply Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Advertisement */}
        {activeTab === "Advertisements" && (
          <div className="bg-white rounded-2xl border border-border p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-text-primary">Published Employment Gazettes</h3>
            <div className="divide-y divide-gray-100">
              {archived.map((adv) => (
                <div key={adv.id} className="py-4 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-sm text-text-primary">{adv.postName}</h4>
                    <p className="text-xs text-gray-500">
                      Advt No: {adv.advertisementNo} • Dept: {adv.department}
                    </p>
                  </div>
                  <a
                    href="#"
                    download
                    className="px-3.5 py-1.5 bg-gray-100 hover:bg-primary hover:text-white rounded-lg text-xs font-semibold text-gray-700 transition-colors flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>PDF</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Results */}
        {activeTab === "Results" && (
          <div className="bg-white rounded-2xl border border-border p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-text-primary">Declared Selection & Merit Lists</h3>
            <div className="divide-y divide-gray-100">
              {results.map((res) => (
                <div key={res.id} className="py-4 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      Result Declared
                    </span>
                    <h4 className="font-bold text-sm text-text-primary mt-1">{res.postName}</h4>
                    <p className="text-xs text-gray-500">
                      Final Merit & Waitlist List for Advertisement: {res.advertisementNo}
                    </p>
                  </div>
                  <a
                    href="#"
                    download
                    className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Merit List</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Documents */}
        {activeTab === "Documents" && (
          <div className="bg-white rounded-2xl border border-border p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-text-primary">Recruitment Rules & Syllabi</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: "Maharashtra Municipal Councils Cadre Recruitment Rules 2024", size: "3.4 MB" },
                { title: "Syllabus for Junior Engineer (Civil) Written Examination", size: "1.2 MB" },
                { title: "Sanitary Inspector Physical Standards & Examination Scheme", size: "850 KB" },
                { title: "Self-Declaration Format for Small Family Certificate", size: "310 KB" },
              ].map((doc, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-primary-surface border border-border flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5 pr-2">
                    <FileText className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-xs font-semibold text-gray-800">{doc.title}</span>
                  </div>
                  <a
                    href="#"
                    download
                    className="text-xs font-bold text-primary hover:underline shrink-0"
                  >
                    Download ({doc.size})
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
