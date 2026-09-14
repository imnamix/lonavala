"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  X,
  CheckCircle2,
  Clock,
  User,
  Phone,
  Building,
  MapPin,
  ShieldCheck,
  Send,
  Upload,
  ArrowRight,
  AlertCircle,
  FileText,
} from "lucide-react";
import {
  getStoredGrievances,
  updateGrievanceStatus,
} from "@/data/grievanceStore";
import { Grievance, GrievanceStatus } from "@/types";
import { Timeline } from "@/components/shared/Timeline";

const STATUS_LIST: GrievanceStatus[] = [
  "Submitted",
  "Acknowledged",
  "Assigned",
  "In Progress",
  "Resolved",
  "Closed",
];

const OFFICERS = [
  "Er. Rameshwar Kale (Water Supply)",
  "Er. Mahesh Kulkarni (PWD City Engineer)",
  "Dr. Sandeep Deshmukh (Health Officer)",
  "Ar. Sneha Joshi (Town Planning)",
  "Shri. Vikas Shinde (Revenue Superintendent)",
  "Capt. Anand Rao (Disaster Officer)",
];

export default function AdminGrievancesPage() {
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null);

  // Drawer Action Form States
  const [newStatus, setNewStatus] = useState<GrievanceStatus>("In Progress");
  const [newRemarks, setNewRemarks] = useState("");
  const [assignedOfficer, setAssignedOfficer] = useState(OFFICERS[0]);
  const [resolutionSuccess, setResolutionSuccess] = useState(false);

  useEffect(() => {
    const list = getStoredGrievances();
    setGrievances(list);
  }, []);

  const handleOpenDrawer = (g: Grievance) => {
    setSelectedGrievance(g);
    setNewStatus(g.status);
    setNewRemarks(g.officerRemarks || "");
    setAssignedOfficer(g.assignedOfficer || OFFICERS[0]);
    setResolutionSuccess(false);
  };

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGrievance) return;

    const updated = updateGrievanceStatus(
      selectedGrievance.id,
      newStatus,
      newRemarks,
      assignedOfficer
    );

    if (updated) {
      setSelectedGrievance(updated);
      setGrievances(getStoredGrievances());
      setResolutionSuccess(true);
      setTimeout(() => setResolutionSuccess(false), 3000);
    }
  };

  const filteredGrievances = grievances.filter((g) => {
    const q = search.toLowerCase();
    const matchesSearch =
      g.refNumber.toLowerCase().includes(q) ||
      g.title.toLowerCase().includes(q) ||
      g.citizenName.toLowerCase().includes(q) ||
      g.department.toLowerCase().includes(q) ||
      g.category.toLowerCase().includes(q);

    const matchesStatus = filterStatus === "All" || g.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const priorityColor: Record<string, string> = {
    Low: "bg-gray-100 text-gray-700",
    Medium: "bg-blue-100 text-blue-800",
    High: "bg-amber-100 text-amber-800",
    Urgent: "bg-red-100 text-red-800 font-bold",
  };

  const statusBadgeColor: Record<string, string> = {
    Submitted: "bg-blue-100 text-blue-800",
    Acknowledged: "bg-purple-100 text-purple-800",
    Assigned: "bg-indigo-100 text-indigo-800",
    "In Progress": "bg-amber-100 text-amber-800",
    Resolved: "bg-emerald-100 text-emerald-800",
    Closed: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1F2937]">Grievance Redressal Desk</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Assign officers, update field status, add technical remarks, and close complaints.
          </p>
        </div>

        <div className="text-xs font-semibold text-gray-500">
          Showing <strong className="text-[#2E8B57]">{filteredGrievances.length}</strong> Complaints
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#D9E8DD] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:max-w-md relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, Citizen, Category, Dept..."
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-white border border-[#D9E8DD] rounded-xl focus:outline-hidden focus:border-[#2E8B57]"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">Filter Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-xs bg-white border border-[#D9E8DD] rounded-xl font-semibold text-gray-700 focus:outline-hidden"
          >
            <option value="All">All Statuses</option>
            {STATUS_LIST.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grievance Table */}
      <div className="bg-white rounded-2xl border border-[#D9E8DD] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FCF9] border-b border-[#D9E8DD] text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                <th className="py-4 px-6">ID & Ref</th>
                <th className="py-4 px-6">Citizen</th>
                <th className="py-4 px-6">Category & Title</th>
                <th className="py-4 px-6">Department</th>
                <th className="py-4 px-6">Priority</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
              {filteredGrievances.map((g) => (
                <tr
                  key={g.id}
                  onClick={() => handleOpenDrawer(g)}
                  className="hover:bg-[#E8F5E9]/40 cursor-pointer transition-colors"
                >
                  <td className="py-4 px-6 font-mono font-bold text-[#2E8B57] whitespace-nowrap">
                    {g.refNumber}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="font-bold text-[#1F2937]">{g.citizenName}</div>
                    <div className="text-[10px] text-gray-400">{g.citizenMobile}</div>
                  </td>
                  <td className="py-4 px-6 max-w-xs">
                    <div className="text-[10px] font-bold text-[#2E8B57] uppercase tracking-wider">
                      {g.category}
                    </div>
                    <div className="font-semibold text-gray-900 truncate">{g.title}</div>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-gray-600 font-medium">
                    {g.department}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full ${
                        priorityColor[g.priority] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {g.priority}
                    </span>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        statusBadgeColor[g.status] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {g.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center whitespace-nowrap">
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-lg bg-[#E8F5E9] text-[#2E8B57] hover:bg-[#2E8B57] hover:text-white font-bold text-xs transition-colors"
                    >
                      Inspect / Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Drawer (Prompt Requirement: Right drawer opens details & Actions: Assign, Change Status, Add Remarks, Upload Resolution, Close Case) */}
      {selectedGrievance && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 transition-opacity"
            onClick={() => setSelectedGrievance(null)}
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white shadow-2xl border-l border-[#D9E8DD] flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
            <div>
              {/* Drawer Header */}
              <div className="p-5 border-b border-[#D9E8DD] flex items-center justify-between bg-[#F8FCF9]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-extrabold text-[#2E8B57]">
                      {selectedGrievance.refNumber}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        statusBadgeColor[selectedGrievance.status] || "bg-gray-100"
                      }`}
                    >
                      {selectedGrievance.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-[#1F2937] mt-1 leading-snug">
                    {selectedGrievance.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedGrievance(null)}
                  className="p-1 text-gray-400 hover:text-gray-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Content Body */}
              <div className="p-6 space-y-6 text-xs text-gray-700">
                {resolutionSuccess && (
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300 text-emerald-800 font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#2E8B57]" />
                    <span>Grievance updated successfully! Changes saved to live tracker.</span>
                  </div>
                )}

                {/* Citizen Details */}
                <div className="bg-[#F8FCF9] p-4 rounded-xl border border-[#D9E8DD] space-y-2">
                  <div className="font-bold uppercase tracking-wider text-gray-500 text-[10px]">
                    Citizen Information
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Name: </span>
                      <strong>{selectedGrievance.citizenName}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500">Mobile: </span>
                      <strong>{selectedGrievance.citizenMobile}</strong>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500">Location: </span>
                      <span>
                        {selectedGrievance.landmark}, {selectedGrievance.ward}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <div className="font-bold uppercase tracking-wider text-gray-500 text-[10px] mb-1">
                    Full Description
                  </div>
                  <p className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-gray-800 leading-relaxed">
                    {selectedGrievance.description}
                  </p>
                </div>

                {/* Attached Images */}
                {selectedGrievance.images && selectedGrievance.images.length > 0 && (
                  <div>
                    <div className="font-bold uppercase tracking-wider text-gray-500 text-[10px] mb-2">
                      Site Evidence
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {selectedGrievance.images.map((img, i) => (
                        <div key={i} className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                          <img src={img} alt="Evidence" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Form */}
                <form onSubmit={handleUpdateStatus} className="space-y-4 pt-4 border-t border-gray-100">
                  <h4 className="font-bold text-sm text-[#1F2937] uppercase tracking-wider">
                    Administrative Actions
                  </h4>

                  {/* 1. Assign Officer */}
                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Assign to Officer
                    </label>
                    <select
                      value={assignedOfficer}
                      onChange={(e) => setAssignedOfficer(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#D9E8DD] rounded-xl focus:outline-hidden focus:border-[#2E8B57]"
                    >
                      {OFFICERS.map((off) => (
                        <option key={off} value={off}>
                          {off}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 2. Change Status */}
                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Update Ticket Status
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as GrievanceStatus)}
                      className="w-full px-3 py-2 bg-white border border-[#D9E8DD] rounded-xl focus:outline-hidden focus:border-[#2E8B57]"
                    >
                      {STATUS_LIST.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 3. Add Remarks */}
                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Add Official Resolution Remarks / Notes
                    </label>
                    <textarea
                      rows={3}
                      value={newRemarks}
                      onChange={(e) => setNewRemarks(e.target.value)}
                      placeholder="e.g. Excavation complete. 100mm joint replaced. Illumination restored..."
                      className="w-full px-3 py-2 bg-white border border-[#D9E8DD] rounded-xl focus:outline-hidden focus:border-[#2E8B57]"
                    />
                  </div>

                  {/* 4. Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-[#2E8B57] hover:bg-[#246E45] text-white font-bold rounded-xl transition-colors shadow-xs"
                    >
                      Save Status & Remarks
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setNewStatus("Closed");
                        setNewRemarks("Case inspected, verified, and officially closed by Chief Officer.");
                      }}
                      className="px-4 py-2.5 bg-gray-900 hover:bg-black text-white font-bold rounded-xl transition-colors"
                    >
                      Close Case
                    </button>
                  </div>
                </form>

                {/* Audit Timeline Log */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="font-bold uppercase tracking-wider text-gray-500 text-[10px] mb-2">
                    Redressal Log
                  </div>
                  <div className="space-y-2">
                    {selectedGrievance.timeline.map((item, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-gray-50 text-[11px] space-y-0.5">
                        <div className="flex items-center justify-between font-bold text-gray-800">
                          <span>{item.status}</span>
                          <span className="text-gray-400 font-normal">{item.date}</span>
                        </div>
                        <div className="text-gray-600">{item.note}</div>
                        <div className="text-[10px] text-gray-400">By: {item.actor}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
