"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Scale,
  Users,
  FileText,
  CalendarClock,
  ArrowRight,
  Clock,
  Calendar,
} from "lucide-react";
import {
  getAllMembers,
  getAllProceedings,
  getAllSessions,
} from "@/lib/services/court.service";
import { CourtCommitteeMember, AdalatUpdate, CourtSession } from "@/types";

export default function AdminCourtPage() {
  const [members, setMembers] = useState<CourtCommitteeMember[]>([]);
  const [proceedings, setProceedings] = useState<AdalatUpdate[]>([]);
  const [sessions, setSessions] = useState<CourtSession[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [memberData, proceedingData, sessionData] = await Promise.all([
          getAllMembers(),
          getAllProceedings(),
          getAllSessions(),
        ]);
        setMembers(memberData);
        setProceedings(proceedingData);
        setSessions(sessionData);
      } catch (e) {
        console.error("Failed to load court data in admin dashboard", e);
      }
    }
    loadData();
  }, []);

  const upcomingSession = sessions.find(
    (s) => s.status === "Scheduled" || s.status === "In Progress"
  );
  const previousSessionsCount = sessions.filter(
    (s) => s.id !== upcomingSession?.id
  ).length;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Standard Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-border shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-text-primary">Court Committee Management</h1>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-primary-light text-primary">
              Control Hub
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage committee members directory, High Court / Tribunal proceedings & orders, and hearing session schedules.
          </p>
        </div>
      </div>

      {/* 3 Dedicated Modules Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Committee Members */}
        <Link
          href="/admin/court/members"
          className="group block p-6 bg-white rounded-3xl border border-border hover:border-primary/50 hover:shadow-lg transition-all"
        >
          <div className="w-12 h-12 rounded-2xl bg-primary-light text-primary flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <Users className="w-6 h-6" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              {members.length} Members
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 font-bold">
              Directory
            </span>
          </div>
          <h3 className="text-lg font-bold text-text-primary mt-2 group-hover:text-primary transition-colors">
            Committee Members
          </h3>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            Manage chairpersons, corporators, and legal officers with profile photos and ward assignments.
          </p>
          <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
            <span>Manage Members Directory</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>

        {/* Card 2: Court Proceedings */}
        <Link
          href="/admin/court/proceedings"
          className="group block p-6 bg-white rounded-3xl border border-border hover:border-primary/50 hover:shadow-lg transition-all"
        >
          <div className="w-12 h-12 rounded-2xl bg-primary-light text-primary flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <FileText className="w-6 h-6" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              {proceedings.length} Records
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 font-bold">
              Orders & Minutes
            </span>
          </div>
          <h3 className="text-lg font-bold text-text-primary mt-2 group-hover:text-primary transition-colors">
            Court Proceedings & Orders
          </h3>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            Record High Court writs, NGT hearings, Lok Adalat compromise minutes, and upload certified orders.
          </p>
          <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
            <span>Manage Proceedings & Orders</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>

        {/* Card 3: Next & Previous Sessions */}
        <Link
          href="/admin/court/sessions"
          className="group block p-6 bg-white rounded-3xl border border-border hover:border-primary/50 hover:shadow-lg transition-all"
        >
          <div className="w-12 h-12 rounded-2xl bg-primary-light text-primary flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <CalendarClock className="w-6 h-6" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              {upcomingSession ? "1 Upcoming" : "0 Upcoming"} • {previousSessionsCount} History
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 font-bold">
              Sessions
            </span>
          </div>
          <h3 className="text-lg font-bold text-text-primary mt-2 group-hover:text-primary transition-colors">
            Sessions & History
          </h3>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            Schedule next hearing with title & date, and maintain previous concluded hearings history.
          </p>
          <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
            <span>Manage Sessions Schedule</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>
      </div>

      {/* Overview Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Next Session Snapshot */}
        <div className="bg-white rounded-3xl border border-border p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <CalendarClock className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-text-primary text-sm">Next Scheduled Hearing</h3>
            </div>
            <Link
              href="/admin/court/sessions"
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {upcomingSession ? (
            <div className="p-4 rounded-2xl bg-primary-light/30 border border-primary/20 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <h4 className="text-xs font-bold text-text-primary">
                  {upcomingSession.sessionTitle}
                </h4>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary text-white shrink-0">
                  {upcomingSession.hearingDate}
                </span>
              </div>
              <p className="text-xs text-gray-600 line-clamp-2">
                {upcomingSession.sessionAgenda}
              </p>
              <div className="flex items-center gap-3 text-[11px] text-gray-500 pt-1 border-t border-primary/20">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-primary" />
                  {upcomingSession.time || "11:00 AM"}
                </span>
                <span>•</span>
                <span className="font-bold text-primary">{upcomingSession.status}</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p className="text-xs">No active upcoming session scheduled.</p>
            </div>
          )}
        </div>

        {/* Recent Proceedings Snapshot */}
        <div className="bg-white rounded-3xl border border-border p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-text-primary text-sm">Recent Court Proceedings</h3>
            </div>
            <Link
              href="/admin/court/proceedings"
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {proceedings.slice(0, 2).map((proc) => (
              <div
                key={proc.id}
                className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-1"
              >
                <div className="flex items-start justify-between gap-3">
                  <h4 className="text-xs font-bold text-text-primary line-clamp-1">
                    {proc.subject}
                  </h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-200 text-gray-800 shrink-0">
                    {proc.status}
                  </span>
                </div>
                <p className="text-[11px] text-gray-600 line-clamp-1">
                  {proc.description}
                </p>
                <div className="text-[10px] text-gray-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{proc.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
