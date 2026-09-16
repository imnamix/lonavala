"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, Plus, Edit, Trash2, CheckCircle2, FileText, ArrowRight, Eye } from "lucide-react";
import { NOTICES_AND_CIRCULARS } from "@/data/mockData";

type CmsStatus = "Draft" | "Review" | "Published";

interface CmsNoticeItem {
  id: string;
  title: string;
  category: string;
  department: string;
  date: string;
  status: CmsStatus;
}

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<CmsNoticeItem[]>([
    {
      id: "not-1",
      title: "Notice regarding Property Tax Early Bird Rebate 5% till 30th June 2025",
      category: "Notices",
      department: "Revenue & Property Tax",
      date: "2025-05-10",
      status: "Published",
    },
    {
      id: "not-2",
      title: "Monsoon Precautionary Advisory for Heavy Rainfall & Water Body Restrictions",
      category: "Orders",
      department: "Disaster Management Cell",
      date: "2025-05-08",
      status: "Published",
    },
    {
      id: "not-3",
      title: "Draft Proposal: Revised Hill Station Solid Waste By-Laws 2025",
      category: "Circulars",
      department: "Health & Sanitation",
      date: "2025-05-12",
      status: "Review",
    },
    {
      id: "not-4",
      title: "Pre-Monsoon Desilting Tender Notification - Ward 1 to 5",
      category: "Notices",
      department: "Public Works (PWD)",
      date: "2025-05-14",
      status: "Draft",
    },
    {
      id: "not-5",
      title: "Circular regarding Mandatory Ban on Single-Use Plastic in Commercial Resorts",
      category: "Circulars",
      department: "Health & Sanitation",
      date: "2025-04-26",
      status: "Published",
    },
  ]);

  const cycleStatus = (id: string) => {
    setNotices(
      notices.map((n) => {
        if (n.id === id) {
          const nextStatus: Record<CmsStatus, CmsStatus> = {
            Draft: "Review",
            Review: "Published",
            Published: "Draft",
          };
          return { ...n, status: nextStatus[n.status] };
        }
        return n;
      })
    );
  };

  const statusBadge: Record<CmsStatus, string> = {
    Draft: "bg-gray-100 text-gray-700 border-gray-300",
    Review: "bg-amber-100 text-amber-800 border-amber-300",
    Published: "bg-emerald-100 text-emerald-800 border-emerald-300",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary">CMS Notices & Gazettes</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage public announcements with Draft → Review → Publish editorial workflows.
          </p>
        </div>

        <button
          onClick={() => {
            const title = prompt("Enter notice title:");
            if (title) {
              setNotices([
                {
                  id: `not-${Date.now()}`,
                  title,
                  category: "Notices",
                  department: "Chief Officer Secretariat",
                  date: new Date().toISOString().split("T")[0],
                  status: "Draft",
                },
                ...notices,
              ]);
            }
          }}
          className="px-4 py-2.5 bg-primary hover:bg-primary-hover text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>New Notice</span>
        </button>
      </div>

      {/* Notice Table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary-surface border-b border-border text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                <th className="py-4 px-6">Title & Subject</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Department</th>
                <th className="py-4 px-6">Publish Date</th>
                <th className="py-4 px-6">Workflow Status</th>
                <th className="py-4 px-6 text-center">Change State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
              {notices.map((n) => (
                <tr key={n.id} className="hover:bg-primary-light/30 transition-colors">
                  <td className="py-4 px-6 font-bold text-text-primary max-w-sm">
                    {n.title}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-gray-600">{n.category}</td>
                  <td className="py-4 px-6 whitespace-nowrap text-gray-600">{n.department}</td>
                  <td className="py-4 px-6 whitespace-nowrap text-gray-500">{n.date}</td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                        statusBadge[n.status]
                      }`}
                    >
                      {n.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center whitespace-nowrap">
                    <button
                      onClick={() => cycleStatus(n.id)}
                      className="px-3 py-1.5 rounded-lg bg-primary-light text-primary hover:bg-primary hover:text-white font-bold text-xs transition-colors"
                      title="Advance to next workflow state"
                    >
                      Advance State →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
