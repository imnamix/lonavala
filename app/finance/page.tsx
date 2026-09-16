"use client";

import { useState } from "react";
import {
  IndianRupee,
  TrendingUp,
  TrendingDown,
  PieChart as PieChartIcon,
  Download,
  FileCheck2,
  Calendar,
  ShieldCheck,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function FinancePage() {
  const financialSummary = {
    totalBudget: "₹78.50 Cr",
    budgetChange: "+12.4% vs FY24",
    revenueCollected: "₹52.30 Cr",
    revenueTarget: "66.6% of Target",
    expenditureIncurred: "₹46.80 Cr",
    expenditureRatio: "59.6% Disbursed",
    auditStatus: "Clean Audit",
    auditYear: "FY 2023-24 CAG Passed",
  };

  const budgetTrends = [
    { year: "2021-22", budget: 52.0, expenditure: 48.2 },
    { year: "2022-23", budget: 61.5, expenditure: 57.8 },
    { year: "2023-24", budget: 69.8, expenditure: 64.1 },
    { year: "2024-25", budget: 74.2, expenditure: 68.9 },
    { year: "2025-26 (BE)", budget: 78.5, expenditure: 46.8 },
  ];

  const revenueBreakdown = [
    { name: "Property & Wealth Tax", value: 48, color: "var(--color-primary)" },
    { name: "Water & Utility Charges", value: 20, color: "var(--color-chart-2)" },
    { name: "Government Grants & 15th FC", value: 18, color: "var(--color-chart-3)" },
    { name: "Trade & Hotel Tourism Cess", value: 10, color: "var(--color-chart-4)" },
    { name: "Building & Development Fees", value: 4, color: "var(--color-chart-5)" },
  ];

  const auditReports = [
    {
      title: "Statutory Auditor Financial Audit Report FY 2023-24",
      date: "2024-11-20",
      cagCertified: true,
      size: "4.2 MB",
    },
    {
      title: "Comptroller and Auditor General (CAG) Performance Review",
      date: "2024-07-15",
      cagCertified: true,
      size: "6.8 MB",
    },
    {
      title: "Municipal Internal Audit & Balance Sheet Statement FY 2024-25 (Q3)",
      date: "2025-01-30",
      cagCertified: false,
      size: "2.1 MB",
    },
    {
      title: "Grant Utilization Certificate (15th Finance Commission Schemes)",
      date: "2025-02-14",
      cagCertified: true,
      size: "1.4 MB",
    },
  ];

  return (
    <div className="py-10">
      {/* Header */}
      <div className="bg-primary-light/60 border-y border-border py-12 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-white px-3 py-1 rounded-full border border-border">
              Public Financial Transparency
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary mt-3">
              Municipal Finance, Budget & Audits
            </h1>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              Open fiscal disclosure of Lonavala Municipal Council&apos;s annual budget, revenue streams, capital expenditures, and statutory auditor certificates.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top 4 KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-border shadow-xs hover:border-primary transition-all space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-500 font-semibold uppercase">
              <span>Annual Budget (FY 25-26)</span>
              <div className="w-8 h-8 rounded-lg bg-primary-light text-primary flex items-center justify-center">
                <IndianRupee className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-text-primary">
              {financialSummary.totalBudget}
            </div>
            <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{financialSummary.budgetChange}</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-border shadow-xs hover:border-primary transition-all space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-500 font-semibold uppercase">
              <span>Revenue Collected</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-text-primary">
              {financialSummary.revenueCollected}
            </div>
            <div className="text-xs text-gray-500 font-medium">
              {financialSummary.revenueTarget}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-border shadow-xs hover:border-primary transition-all space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-500 font-semibold uppercase">
              <span>Capital & Operational Exp.</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <TrendingDown className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-text-primary">
              {financialSummary.expenditureIncurred}
            </div>
            <div className="text-xs text-gray-500 font-medium">
              {financialSummary.expenditureRatio}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-border shadow-xs hover:border-primary transition-all space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-500 font-semibold uppercase">
              <span>Audit Compliance</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-primary flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-primary">
              {financialSummary.auditStatus}
            </div>
            <div className="text-xs text-gray-500 font-medium">
              {financialSummary.auditYear}
            </div>
          </div>
        </div>

        {/* Recharts Graphs Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* BarChart: Budget vs Expenditure */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-border shadow-xs space-y-4">
            <div>
              <h3 className="font-bold text-base text-text-primary">
                Budget Allocation vs Expenditure Trends (₹ in Crores)
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Multi-year municipal fiscal prudence and capital utilization.
              </p>
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={budgetTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-surface)",
                      borderRadius: "12px",
                      border: "1px solid var(--color-border)",
                      fontSize: "12px",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                  <Bar dataKey="budget" name="Sanctioned Budget" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenditure" name="Actual Expenditure" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* PieChart: Revenue Breakdown */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-border shadow-xs space-y-4">
            <div>
              <h3 className="font-bold text-base text-text-primary">
                Revenue Sources Breakdown (%)
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Key income sources funding hill-station amenities.
              </p>
            </div>

            <div className="h-48 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {revenueBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val) => [`${val}%`, "Share"]}
                    contentStyle={{
                      backgroundColor: "var(--color-surface)",
                      borderRadius: "8px",
                      fontSize: "11px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-gray-100 text-xs">
              {revenueBreakdown.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-gray-700">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="truncate max-w-[200px]">{item.name}</span>
                  </div>
                  <span className="font-bold text-gray-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Statutory Audit Reports Section */}
        <div className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-text-primary">
                Statutory Financial Audit Reports & Disclosures
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Compliant with Maharashtra Local Fund Audit Act and Comptroller & Auditor General norms.
              </p>
            </div>
            <span className="text-xs font-bold text-primary bg-primary-light px-3 py-1 rounded-full shrink-0">
              100% Audit Cleared
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {auditReports.map((report, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-primary-surface border border-border flex items-center justify-between gap-3 hover:border-primary transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-primary shrink-0" />
                    <h4 className="text-xs sm:text-sm font-bold text-text-primary line-clamp-1">
                      {report.title}
                    </h4>
                  </div>
                  <div className="text-[11px] text-gray-500 pl-6">
                    Audit Date: {report.date} • {report.size}
                  </div>
                </div>

                <a
                  href="#"
                  download
                  className="px-3 py-1.5 bg-white border border-border hover:bg-primary hover:text-white rounded-lg text-xs font-semibold text-gray-700 transition-colors shrink-0 flex items-center gap-1 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>PDF</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
