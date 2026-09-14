"use client";

import { useState } from "react";
import {
  Download,
  FileSpreadsheet,
  FileText,
  Calendar,
  Filter,
  BarChart3,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

export default function AdminReportsPage() {
  const [downloadMsg, setDownloadMsg] = useState("");

  const handleExport = (format: "PDF" | "Excel" | "CSV") => {
    setDownloadMsg(`Generating ${format} report... Download started!`);
    setTimeout(() => {
      // Mock client file generation
      const content = `Lonavala Municipal Council - Executive Analytics Report (${format})
Generated: ${new Date().toLocaleString()}
Citizen Satisfaction: 94.2%
Total Grievances (YTD): 1,248
SLA Redressal Rate: 98.4%
Property Tax Collection: ₹48.2 Cr
Water Purity Index: 99.2%`;

      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `LMC_Analytics_Report_${Date.now()}.${format.toLowerCase()}`;
      a.click();
      URL.revokeObjectURL(url);
      setDownloadMsg(`✓ ${format} report downloaded successfully.`);
    }, 600);
  };

  const trendData = [
    { month: "Jan", complaints: 110, resolutionDays: 2.9 },
    { month: "Feb", complaints: 135, resolutionDays: 2.8 },
    { month: "Mar", complaints: 142, resolutionDays: 2.6 },
    { month: "Apr", complaints: 168, resolutionDays: 2.5 },
    { month: "May", complaints: 195, resolutionDays: 2.4 },
    { month: "Jun", complaints: 245, resolutionDays: 2.3 },
    { month: "Jul", complaints: 290, resolutionDays: 2.2 },
    { month: "Aug", complaints: 220, resolutionDays: 2.4 },
  ];

  const wardDistributionData = [
    { ward: "Ward 1 (Bangarwadi)", resolved: 240, pending: 6 },
    { ward: "Ward 2 (Ryewood)", resolved: 310, pending: 8 },
    { ward: "Ward 3 (Khandala)", resolved: 225, pending: 5 },
    { ward: "Ward 4 (Valvan)", resolved: 260, pending: 4 },
    { ward: "Ward 5 (Tungarli)", resolved: 195, pending: 3 },
  ];

  return (
    <div className="space-y-8">
      {/* Header & Export Triggers */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1F2937]">Civic Reports & Analytics</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time business intelligence on municipal efficiency, ward resolution SLAs, and public service charters.
          </p>
        </div>

        {/* Prompt Requirement: Include export buttons: PDF, Excel, CSV */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport("PDF")}
            className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>PDF Export</span>
          </button>
          <button
            onClick={() => handleExport("Excel")}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Excel Export</span>
          </button>
          <button
            onClick={() => handleExport("CSV")}
            className="px-3.5 py-2 bg-gray-800 hover:bg-black text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV Export</span>
          </button>
        </div>
      </div>

      {downloadMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#2E8B57]" />
          <span>{downloadMsg}</span>
        </div>
      )}

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Turnaround speed area chart */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-[#D9E8DD] shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-base text-[#1F2937]">Average Turnaround Time (Days)</h3>
            <p className="text-xs text-gray-500">Days taken to resolve citizen issues vs monthly complaint volume</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 4]} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val, name) => [
                    name === "resolutionDays" ? `${val} Days` : val,
                    name === "resolutionDays" ? "Avg Days" : "Complaints",
                  ]}
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "10px",
                    border: "1px solid #D9E8DD",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="resolutionDays"
                  name="Resolution Turnaround"
                  stroke="#2E8B57"
                  fill="#E8F5E9"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ward-wise performance bar chart */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-[#D9E8DD] shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-base text-[#1F2937]">Ward Performance Breakdown</h3>
            <p className="text-xs text-gray-500">Resolved vs active pending tickets across 5 wards</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wardDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="ward" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "10px",
                    border: "1px solid #D9E8DD",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="resolved" name="Resolved" fill="#2E8B57" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" name="In Progress" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
