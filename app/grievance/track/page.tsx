"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Building,
  User,
  ShieldCheck,
  AlertCircle,
  FileText,
  Phone,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { findGrievanceByRefOrMobile, getStoredGrievances } from "@/data/grievanceStore";
import { Grievance } from "@/types";
import { Timeline } from "@/components/shared/Timeline";

function TrackGrievanceContent() {
  const searchParams = useSearchParams();
  const initialRef = searchParams.get("ref") || "";

  const [searchQuery, setSearchQuery] = useState(initialRef || "GRV2026001245");
  const [grievance, setGrievance] = useState<Grievance | null>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    // Load initial sample grievance
    const queryToUse = initialRef || "GRV2026001245";
    const found = findGrievanceByRefOrMobile(queryToUse);
    if (found) {
      setGrievance(found);
    } else {
      const all = getStoredGrievances();
      if (all.length > 0) setGrievance(all[0]);
    }
    setSearched(true);
  }, [initialRef]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const found = findGrievanceByRefOrMobile(searchQuery.trim());
    setGrievance(found || null);
    setSearched(true);
  };

  const statusBadgeColor: Record<string, string> = {
    Submitted: "bg-blue-100 text-blue-800 border-blue-200",
    Acknowledged: "bg-purple-100 text-purple-800 border-purple-200",
    Assigned: "bg-indigo-100 text-indigo-800 border-indigo-200",
    "In Progress": "bg-amber-100 text-amber-800 border-amber-200",
    Resolved: "bg-emerald-100 text-emerald-800 border-emerald-200",
    Closed: "bg-gray-100 text-gray-800 border-gray-200",
  };

  return (
    <div className="py-10">
      {/* Header */}
      <div className="bg-[#E8F5E9]/60 border-y border-[#D9E8DD] py-12 mb-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2E8B57] bg-white px-3 py-1 rounded-full border border-[#D9E8DD]">
            Live Public Status
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1F2937] mt-3">
            Track Grievance Redressal
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-2">
            Enter your 13-digit Reference Number (e.g. GRV2026001245) or registered Mobile Number to check real-time officer actions.
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="mt-6 max-w-xl mx-auto flex items-center bg-white p-2 rounded-2xl shadow-md border border-[#D9E8DD]"
          >
            <div className="pl-3 text-gray-400">
              <Search className="w-5 h-5 text-[#2E8B57]" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter Reference Number (e.g. GRV2026001245) or Mobile"
              className="w-full px-3 py-2 text-xs sm:text-sm text-[#1F2937] placeholder-gray-400 focus:outline-hidden"
            />
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#2E8B57] hover:bg-[#246E45] text-white font-bold text-xs sm:text-sm shadow-xs transition-colors shrink-0"
            >
              Track Now
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {grievance ? (
          <div className="space-y-8">
            {/* Grievance Summary Card */}
            <div className="bg-white rounded-2xl border border-[#D9E8DD] p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-extrabold text-[#2E8B57]">
                      {grievance.refNumber}
                    </span>
                    <span
                      className={`text-xs font-bold px-3 py-0.5 rounded-full border ${
                        statusBadgeColor[grievance.status] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {grievance.status}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-[#1F2937] mt-2 leading-snug">
                    {grievance.title}
                  </h2>
                </div>

                <Link
                  href="/grievance/register"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2E8B57] hover:underline shrink-0"
                >
                  <span>File Another Grievance</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Meta Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-xs">
                <div>
                  <div className="text-gray-400 font-semibold uppercase text-[10px]">
                    Department
                  </div>
                  <div className="font-bold text-gray-800 mt-0.5">{grievance.department}</div>
                </div>
                <div>
                  <div className="text-gray-400 font-semibold uppercase text-[10px]">
                    Ward & Landmark
                  </div>
                  <div className="font-bold text-gray-800 mt-0.5 truncate">
                    {grievance.landmark}, {grievance.ward}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 font-semibold uppercase text-[10px]">
                    Assigned Officer
                  </div>
                  <div className="font-bold text-[#2E8B57] mt-0.5">
                    {grievance.assignedOfficer || "Pending Assignment"}
                  </div>
                </div>
              </div>

              {/* Officer Remarks Banner */}
              {grievance.officerRemarks && (
                <div className="mt-6 p-4 rounded-xl bg-[#E8F5E9] border border-[#D9E8DD] text-xs">
                  <div className="font-bold text-[#2E8B57] flex items-center gap-1.5 mb-1">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Official Desk Remarks / Resolution Note:</span>
                  </div>
                  <p className="text-gray-800 leading-relaxed">{grievance.officerRemarks}</p>
                </div>
              )}

              {/* Uploaded Photos Section */}
              {grievance.images && grievance.images.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
                    Attached Site Photos
                  </div>
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {grievance.images.map((img, idx) => (
                      <div
                        key={idx}
                        className="w-28 h-28 rounded-xl overflow-hidden border border-[#D9E8DD] shrink-0 bg-gray-100 shadow-xs"
                      >
                        <img
                          src={img}
                          alt="Grievance Evidence"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Prompt Requirement: Timeline component rendering the 6 statuses */}
            <div className="bg-white rounded-2xl border border-[#D9E8DD] p-6 sm:p-8 shadow-xs">
              <h3 className="text-base font-bold text-[#1F2937] mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#2E8B57]" />
                <span>Grievance Redressal Timeline</span>
              </h3>

              <Timeline
                currentStatus={grievance.status}
                events={grievance.timeline}
              />
            </div>
          </div>
        ) : searched ? (
          <div className="bg-white p-10 rounded-2xl border border-[#D9E8DD] text-center shadow-xs">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-900">
              No Grievance Found for &quot;{searchQuery}&quot;
            </h3>
            <p className="text-xs text-gray-600 mt-1 max-w-sm mx-auto">
              Please verify the Reference Number (e.g. GRV2026001245) or 10-digit mobile number you used during registration.
            </p>
            <div className="mt-6">
              <Link
                href="/grievance/register"
                className="px-5 py-2.5 rounded-xl bg-[#2E8B57] text-white font-bold text-xs hover:bg-[#246E45] inline-flex items-center gap-1.5"
              >
                <span>Register New Complaint</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function GrievanceTrackPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-xs">Loading grievance tracker...</div>}>
      <TrackGrievanceContent />
    </Suspense>
  );
}
