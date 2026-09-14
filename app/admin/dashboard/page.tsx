"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Building2,
  Users,
  Bell,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { getStoredGrievances } from "@/data/grievanceStore";
import { DEPARTMENTS, NOTICES_AND_CIRCULARS } from "@/data/mockData";

export default function AdminDashboardPage() {
  const grievances = getStoredGrievances();

  const totalGrievances = grievances.length;
  const resolvedCount = grievances.filter(
    (g) => g.status === "Resolved" || g.status === "Closed"
  ).length;
  const openCount = totalGrievances - resolvedCount;

  const topCards = [
    {
      title: "Total Grievances",
      value: "1,248",
      sub: "+18 this week",
      icon: AlertCircle,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Open & In Progress",
      value: openCount.toString(),
      sub: "Active field tickets",
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      title: "Resolved Cases",
      value: (1248 - openCount).toString(),
      sub: "98.4% resolution rate",
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Municipal Departments",
      value: DEPARTMENTS.length.toString(),
      sub: "All wings active",
      icon: Building2,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Citizens Enrolled",
      value: "68,450",
      sub: "5 Municipal Wards",
      icon: Users,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      title: "Active Notices",
      value: NOTICES_AND_CIRCULARS.length.toString(),
      sub: "Published Gazettes",
      icon: Bell,
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
  ];

  const monthlyGrievancesData = [
    { month: "Jan", received: 110, resolved: 104 },
    { month: "Feb", received: 135, resolved: 130 },
    { month: "Mar", received: 142, resolved: 139 },
    { month: "Apr", received: 168, resolved: 162 },
    { month: "May", received: 195, resolved: 188 },
    { month: "Jun (Monsoon)", received: 245, resolved: 232 },
    { month: "Jul (Monsoon)", received: 290, resolved: 275 },
    { month: "Aug", received: 220, resolved: 216 },
    { month: "Sep", received: 180, resolved: 174 },
  ];

  const slaPerformanceData = [
    { day: "Mon", compliance: 98.5 },
    { day: "Tue", compliance: 97.8 },
    { day: "Wed", compliance: 99.1 },
    { day: "Thu", compliance: 98.2 },
    { day: "Fri", compliance: 99.4 },
    { day: "Sat", compliance: 96.9 },
    { day: "Sun", compliance: 97.5 },
  ];

  const departmentPerformanceData = [
    { name: "Water Supply", count: 42, color: "#2E8B57" },
    { name: "Health & Sanitation", count: 35, color: "#4CAF50" },
    { name: "PWD & Roads", count: 28, color: "#81C784" },
    { name: "Town Planning", count: 14, color: "#A5D6A7" },
    { name: "Revenue & Tax", count: 12, color: "#C8E6C9" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937]">
            Municipal Executive Dashboard
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time civic operations, departmental service level agreements (SLA), and grievance redressal monitoring.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/grievances"
            className="px-4 py-2.5 bg-[#2E8B57] hover:bg-[#246E45] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <AlertCircle className="w-4 h-4" />
            <span>Manage Grievances</span>
          </Link>
        </div>
      </div>

      {/* Top 6 KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {topCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-[#D9E8DD] shadow-xs hover:border-[#2E8B57] transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className={`w-8 h-8 rounded-xl ${card.bg} ${card.color} flex items-center justify-center`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-[#2E8B57]">Live</span>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-[#1F2937]">{card.value}</div>
                <div className="text-xs font-bold text-gray-700 truncate">{card.title}</div>
                <div className="text-[10px] text-gray-400 mt-0.5">{card.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recharts Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Grievances Bar Chart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-[#D9E8DD] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-[#1F2937]">
                Monthly Grievance Volume & Redressal Rate
              </h3>
              <p className="text-xs text-gray-500">
                Tracking ticket velocity during pre-monsoon and peak tourist influx months.
              </p>
            </div>
            <span className="text-xs font-bold text-[#2E8B57] bg-[#E8F5E9] px-2.5 py-1 rounded-lg">
              98.4% SLA Pass
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyGrievancesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "10px",
                    border: "1px solid #D9E8DD",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                <Bar dataKey="received" name="Complaints Received" fill="#1F2937" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" name="Complaints Resolved" fill="#2E8B57" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SLA Adherence Line Chart */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-[#D9E8DD] shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-base text-[#1F2937]">Weekly SLA Adherence (%)</h3>
            <p className="text-xs text-gray-500">Citizen charter SLA compliance target: 95%</p>
          </div>

          <div className="h-44 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={slaPerformanceData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis domain={[94, 100]} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val) => [`${val}%`, "SLA Adherence"]}
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    fontSize: "11px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="compliance"
                  stroke="#2E8B57"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#2E8B57" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#2E8B57]" />
              <span>SLA Target Exceeded</span>
            </div>
            <p className="text-[11px] text-emerald-700">
              Average resolution turnaround across all wards is 2.4 days against charter benchmark of 3.0 days.
            </p>
          </div>
        </div>
      </div>

      {/* Department Performance Pie Chart & Recent Action Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Department Volume Pie */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#D9E8DD] shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-base text-[#1F2937]">
              Grievance Load by Department
            </h3>
            <p className="text-xs text-gray-500">Distribution of active and closed tickets.</p>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentPerformanceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="count"
                >
                  {departmentPerformanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val) => [`${val} Tickets`, "Volume"]}
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    fontSize: "11px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-gray-100 text-xs">
            {departmentPerformanceData.map((d, idx) => (
              <div key={idx} className="flex items-center justify-between text-gray-700">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span>{d.name}</span>
                </div>
                <span className="font-bold">{d.count} tickets</span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Urgent Complaints Queue */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#D9E8DD] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-[#1F2937]">
                Action Priority Grievance Queue
              </h3>
              <p className="text-xs text-gray-500">High priority and escalated citizen tickets</p>
            </div>
            <Link
              href="/admin/grievances"
              className="text-xs font-bold text-[#2E8B57] hover:underline"
            >
              View All →
            </Link>
          </div>

          <div className="divide-y divide-gray-100 text-xs">
            {grievances.slice(0, 3).map((g) => (
              <div key={g.id} className="py-3.5 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#2E8B57]">{g.refNumber}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      {g.status}
                    </span>
                    <span className="text-[10px] font-semibold text-gray-500">{g.department}</span>
                  </div>
                  <h4 className="font-bold text-[#1F2937] leading-snug">{g.title}</h4>
                  <div className="text-[11px] text-gray-500 truncate">
                    Citizen: {g.citizenName} ({g.citizenMobile}) • {g.ward}
                  </div>
                </div>

                <Link
                  href="/admin/grievances"
                  className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-[#2E8B57] hover:text-white font-bold text-[11px] text-gray-700 transition-colors shrink-0"
                >
                  Action
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
