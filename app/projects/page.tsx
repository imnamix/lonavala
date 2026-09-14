"use client";

import { useState } from "react";
import { HardHat, CheckCircle2, Clock, Sparkles } from "lucide-react";
import { MUNICIPAL_PROJECTS } from "@/data/mockData";
import { ProjectCard } from "@/components/shared/ProjectCard";

export default function ProjectsPage() {
  const [activeTab, setActiveTab] = useState<"All" | "Ongoing" | "Completed" | "Upcoming">("All");

  const filteredProjects =
    activeTab === "All"
      ? MUNICIPAL_PROJECTS
      : MUNICIPAL_PROJECTS.filter((p) => p.status === activeTab);

  const tabs: ("All" | "Ongoing" | "Completed" | "Upcoming")[] = [
    "All",
    "Ongoing",
    "Completed",
    "Upcoming",
  ];

  return (
    <div className="py-10">
      {/* Page Header */}
      <div className="bg-[#E8F5E9]/60 border-y border-[#D9E8DD] py-12 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2E8B57] bg-white px-3 py-1 rounded-full border border-[#D9E8DD]">
              City Infrastructure
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] mt-3">
              Municipal Projects & Works
            </h1>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              Track capital expenditure, physical progress, timelines, and contractors for infrastructure transforming Lonavala&apos;s roads, hospital, sewage systems, and tourist promenades.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Tabs */}
        <div className="flex items-center justify-between border-b border-[#D9E8DD] pb-3">
          <div className="flex items-center gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab
                    ? "bg-[#2E8B57] text-white shadow-xs"
                    : "bg-white border border-[#D9E8DD] text-gray-700 hover:bg-[#E8F5E9] hover:text-[#2E8B57]"
                }`}
              >
                {tab} Projects (
                {tab === "All"
                  ? MUNICIPAL_PROJECTS.length
                  : MUNICIPAL_PROJECTS.filter((p) => p.status === tab).length}
                )
              </button>
            ))}
          </div>

          <div className="hidden sm:block text-xs text-gray-500 font-semibold">
            Total Capital Outlay: <strong className="text-[#2E8B57]">₹114.30 Crores</strong>
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
}
