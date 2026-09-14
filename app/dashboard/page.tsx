"use client";

import { useState } from "react";
import Link from "next/link";
import {
  User,
  AlertCircle,
  Bell,
  FileText,
  Settings,
  LogOut,
  Clock,
  CheckCircle2,
  Download,
  Plus,
  ArrowRight,
  ShieldAlert,
  Building,
  MapPin,
  FileCheck,
} from "lucide-react";
import { getStoredGrievances } from "@/data/grievanceStore";

export default function CitizenDashboardPage() {
  const [activeTab, setActiveTab] = useState<
    "grievances" | "profile" | "notifications" | "documents" | "settings"
  >("grievances");

  const grievances = getStoredGrievances();

  const userProfile = {
    name: "Aniket Sharma",
    mobile: "+91 9876543210",
    email: "aniket.sharma@example.com",
    ward: "Ward 3 - Khandala Ridge & Nagpal Estate",
    address: "Bungalow 14, St. Joseph Hill Road, Lonavala - 410401",
    pidNumber: "LMC-PID-98214",
  };

  const notifications = [
    {
      id: "notif-1",
      title: "Grievance GRV2026001245 Updated",
      desc: "Water engineer Er. Rameshwar Kale has updated the status to In Progress. On-site joint replacement underway.",
      time: "2 hours ago",
      unread: true,
    },
    {
      id: "notif-2",
      title: "5% Early Bird Rebate on Property Tax",
      desc: "Pay your annual property tax before 30th June 2025 to avail a 5% instant discount.",
      time: "1 day ago",
      unread: false,
    },
    {
      id: "notif-3",
      title: "Monsoon Precaution Advisory",
      desc: "LMC disaster cell has issued heavy rainfall alerts for Khandala and Tiger Point curves.",
      time: "3 days ago",
      unread: false,
    },
  ];

  const citizenDocs = [
    {
      title: "Property Tax Receipt FY 2024-25",
      type: "PDF",
      date: "2024-05-12",
      size: "420 KB",
    },
    {
      title: "Water Bill No-Dues Certificate",
      type: "PDF",
      date: "2024-09-18",
      size: "310 KB",
    },
    {
      title: "Grievance Acknowledgement GRV2026001245",
      type: "PDF",
      date: "2026-09-12",
      size: "180 KB",
    },
  ];

  const statusBadgeColor: Record<string, string> = {
    Submitted: "bg-blue-100 text-blue-800",
    Acknowledged: "bg-purple-100 text-purple-800",
    Assigned: "bg-indigo-100 text-indigo-800",
    "In Progress": "bg-amber-100 text-amber-800",
    Resolved: "bg-emerald-100 text-emerald-800",
    Closed: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Welcome Banner */}
      <div className="bg-white rounded-3xl border border-[#D9E8DD] p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#2E8B57] text-white flex items-center justify-center font-bold text-xl shadow-md">
            AS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-[#1F2937]">{userProfile.name}</h1>
              <span className="text-[10px] font-bold text-[#2E8B57] bg-[#E8F5E9] px-2 py-0.5 rounded-full">
                Verified Citizen
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              PID: {userProfile.pidNumber} • {userProfile.ward}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/grievance/register"
            className="px-4 py-2.5 bg-[#2E8B57] hover:bg-[#246E45] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Grievance</span>
          </Link>
          <Link
            href="/login"
            className="px-3.5 py-2.5 border border-gray-200 text-gray-600 hover:text-red-600 hover:bg-gray-50 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </Link>
        </div>
      </div>

      {/* Main Grid: Sidebar + Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Menu */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-[#D9E8DD] p-3 shadow-xs space-y-1">
            <button
              onClick={() => setActiveTab("grievances")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-left transition-colors ${
                activeTab === "grievances"
                  ? "bg-[#2E8B57] text-white shadow-xs"
                  : "text-gray-700 hover:bg-[#E8F5E9] hover:text-[#2E8B57]"
              }`}
            >
              <AlertCircle className="w-4 h-4" />
              <span>My Grievances ({grievances.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-left transition-colors ${
                activeTab === "profile"
                  ? "bg-[#2E8B57] text-white shadow-xs"
                  : "text-gray-700 hover:bg-[#E8F5E9] hover:text-[#2E8B57]"
              }`}
            >
              <User className="w-4 h-4" />
              <span>Citizen Profile</span>
            </button>

            <button
              onClick={() => setActiveTab("notifications")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-left transition-colors ${
                activeTab === "notifications"
                  ? "bg-[#2E8B57] text-white shadow-xs"
                  : "text-gray-700 hover:bg-[#E8F5E9] hover:text-[#2E8B57]"
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Notifications (1 New)</span>
            </button>

            <button
              onClick={() => setActiveTab("documents")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-left transition-colors ${
                activeTab === "documents"
                  ? "bg-[#2E8B57] text-white shadow-xs"
                  : "text-gray-700 hover:bg-[#E8F5E9] hover:text-[#2E8B57]"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>My Receipts & Certificates</span>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-left transition-colors ${
                activeTab === "settings"
                  ? "bg-[#2E8B57] text-white shadow-xs"
                  : "text-gray-700 hover:bg-[#E8F5E9] hover:text-[#2E8B57]"
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Account Settings</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="lg:col-span-9 space-y-6">
          {/* TAB 1: MY GRIEVANCES */}
          {activeTab === "grievances" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#1F2937]">Registered Grievances</h2>
                <span className="text-xs text-gray-500">Live Redressal Tracker</span>
              </div>

              {grievances.map((g) => (
                <div
                  key={g.id}
                  className="bg-white rounded-2xl border border-[#D9E8DD] p-6 shadow-xs hover:border-[#2E8B57] transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-extrabold text-[#2E8B57]">
                        {g.refNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          statusBadgeColor[g.status] || "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {g.status}
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-400">
                      Filed on {new Date(g.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-[#1F2937] leading-snug">{g.title}</h3>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">{g.description}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-[#F8FCF9] p-3 rounded-xl border border-[#D9E8DD] text-xs">
                    <div>
                      <span className="text-gray-400 text-[10px] uppercase font-semibold">
                        Department
                      </span>
                      <div className="font-medium text-gray-800 truncate">{g.department}</div>
                    </div>
                    <div>
                      <span className="text-gray-400 text-[10px] uppercase font-semibold">
                        Location
                      </span>
                      <div className="font-medium text-gray-800 truncate">{g.landmark}</div>
                    </div>
                    <div>
                      <span className="text-gray-400 text-[10px] uppercase font-semibold">
                        Assigned Officer
                      </span>
                      <div className="font-medium text-[#2E8B57] truncate">
                        {g.assignedOfficer || "Pending Assignment"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="text-[11px] text-gray-500">
                      Latest Note:{" "}
                      <span className="text-gray-700 italic">
                        {g.timeline[g.timeline.length - 1]?.note || "Ticket submitted."}
                      </span>
                    </div>

                    <Link
                      href={`/grievance/track?ref=${g.refNumber}`}
                      className="px-3.5 py-1.5 rounded-lg bg-[#E8F5E9] hover:bg-[#2E8B57] hover:text-white text-[#2E8B57] font-bold text-xs transition-colors flex items-center gap-1 shrink-0"
                    >
                      <span>Track Timeline</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: PROFILE */}
          {activeTab === "profile" && (
            <div className="bg-white rounded-2xl border border-[#D9E8DD] p-6 sm:p-8 shadow-xs space-y-6">
              <h2 className="text-lg font-bold text-[#1F2937]">Citizen Profile Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-gray-400 uppercase font-semibold text-[10px]">
                    Full Legal Name
                  </span>
                  <div className="font-bold text-gray-800 text-sm mt-0.5">{userProfile.name}</div>
                </div>
                <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-gray-400 uppercase font-semibold text-[10px]">
                    Registered Mobile
                  </span>
                  <div className="font-bold text-gray-800 text-sm mt-0.5">{userProfile.mobile}</div>
                </div>
                <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-gray-400 uppercase font-semibold text-[10px]">
                    Email Address
                  </span>
                  <div className="font-bold text-gray-800 text-sm mt-0.5">{userProfile.email}</div>
                </div>
                <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-gray-400 uppercase font-semibold text-[10px]">
                    Property PID
                  </span>
                  <div className="font-bold text-[#2E8B57] text-sm mt-0.5">
                    {userProfile.pidNumber}
                  </div>
                </div>
                <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 sm:col-span-2">
                  <span className="text-gray-400 uppercase font-semibold text-[10px]">
                    Residential Address
                  </span>
                  <div className="font-bold text-gray-800 text-sm mt-0.5">{userProfile.address}</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <div className="bg-white rounded-2xl border border-[#D9E8DD] p-6 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-[#1F2937]">Citizen Alerts & Notifications</h2>
              <div className="space-y-3">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 rounded-xl border transition-colors ${
                      notif.unread
                        ? "bg-emerald-50/70 border-emerald-200"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-[#1F2937]">{notif.title}</span>
                      <span className="text-[10px] text-gray-400">{notif.time}</span>
                    </div>
                    <p className="text-xs text-gray-600">{notif.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: DOCUMENTS */}
          {activeTab === "documents" && (
            <div className="bg-white rounded-2xl border border-[#D9E8DD] p-6 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-[#1F2937]">Saved Receipts & Official Extracts</h2>
              <div className="space-y-3">
                {citizenDocs.map((doc, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#F8FCF9] border border-[#D9E8DD] flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <FileCheck className="w-5 h-5 text-[#2E8B57] shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-[#1F2937]">{doc.title}</div>
                        <div className="text-[10px] text-gray-500">
                          {doc.date} • {doc.size}
                        </div>
                      </div>
                    </div>
                    <a
                      href="#"
                      download
                      className="px-3 py-1.5 bg-[#2E8B57] hover:bg-[#246E45] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SETTINGS */}
          {activeTab === "settings" && (
            <div className="bg-white rounded-2xl border border-[#D9E8DD] p-6 sm:p-8 shadow-xs space-y-6">
              <h2 className="text-lg font-bold text-[#1F2937]">Account & Alert Preferences</h2>
              <div className="space-y-4 text-xs text-gray-700">
                <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                  <div>
                    <div className="font-bold text-gray-900">SMS Grievance Status Alerts</div>
                    <div className="text-gray-500 text-[11px]">
                      Receive instant SMS whenever an officer takes action on your complaints.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 text-[#2E8B57] rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                  <div>
                    <div className="font-bold text-gray-900">Email Tax Due Reminders</div>
                    <div className="text-gray-500 text-[11px]">
                      Get notified before early bird rebate deadlines expire.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 text-[#2E8B57] rounded"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
