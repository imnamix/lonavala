"use client";

import { useState, useEffect } from "react";
import { HardHat, Loader2 } from "lucide-react";
import { ProjectCard } from "@/components/shared/ProjectCard";
import { getAllProjects } from "@/lib/services/project.service";
import { Project } from "@/types";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"All" | "Ongoing" | "Completed" | "Upcoming">("All");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getAllProjects();
        setProjects(data || []);
      } catch (e) {
        console.error("Failed to load projects from service:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredProjects =
    activeTab === "All"
      ? projects
      : projects.filter((p) => p.status === activeTab);

  const tabs: ("All" | "Ongoing" | "Completed" | "Upcoming")[] = [
    "All",
    "Ongoing",
    "Completed",
    "Upcoming",
  ];

  return (
    <div className="py-10">
      {/* Page Header */}
      <div className="bg-primary-light/60 border-y border-border py-12 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-white px-3 py-1 rounded-full border border-border">
              City Infrastructure
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary mt-3">
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-3 gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === tab
                    ? "bg-primary text-white shadow-xs"
                    : "bg-white border border-border text-gray-700 hover:bg-primary-light hover:text-primary"
                }`}
              >
                {tab} Projects (
                {tab === "All"
                  ? projects.length
                  : projects.filter((p) => p.status === tab).length}
                )
              </button>
            ))}
          </div>

          <div className="text-xs text-gray-500 font-semibold">
            Total Projects: <strong className="text-primary">{projects.length} Works</strong>
          </div>
        </div>

        {/* Project Cards Grid / Loading / Empty State */}
        {loading ? (
          <div className="py-20 text-center space-y-3 bg-white rounded-3xl border border-border">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
            <p className="text-xs font-bold text-gray-600">Loading municipal projects...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="py-20 text-center space-y-3 bg-white rounded-3xl border border-border">
            <div className="w-12 h-12 rounded-2xl bg-primary-light text-primary flex items-center justify-center mx-auto">
              <HardHat className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-800">
              {activeTab === "All"
                ? "No municipal projects published yet"
                : `No ${activeTab.toLowerCase()} projects found`}
            </h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              Projects published by the municipal administration will be listed here with real-time milestones and status.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
