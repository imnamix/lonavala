"use client";

import { useState } from "react";
import { HardHat, Plus, IndianRupee, Calendar, MapPin, CheckCircle2, TrendingUp } from "lucide-react";
import { MUNICIPAL_PROJECTS } from "@/data/mockData";
import { Project } from "@/types";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(MUNICIPAL_PROJECTS);

  const updateProgress = (id: string, newProgress: number) => {
    setProjects(
      projects.map((p) => {
        if (p.id === id) {
          const status = newProgress >= 100 ? "Completed" : newProgress > 0 ? "Ongoing" : "Upcoming";
          return { ...p, progress: newProgress, status };
        }
        return p;
      })
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1F2937]">Capital Works & Projects</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Monitor infrastructure contracts, update physical completion milestones, and contractor SLAs.
          </p>
        </div>

        <button
          onClick={() => alert("Add project modal (Demo)")}
          className="px-4 py-2.5 bg-[#2E8B57] hover:bg-[#246E45] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>New Civil Project</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="bg-white rounded-2xl border border-[#D9E8DD] p-6 shadow-xs hover:border-[#2E8B57] transition-all space-y-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2E8B57] bg-[#E8F5E9] px-2.5 py-0.5 rounded-full">
                  {proj.category}
                </span>
                <h3 className="font-bold text-base text-[#1F2937] mt-1.5">{proj.title}</h3>
                <div className="text-xs text-gray-500">{proj.department}</div>
              </div>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border ${
                  proj.status === "Completed"
                    ? "bg-blue-100 text-blue-800 border-blue-200"
                    : proj.status === "Ongoing"
                    ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                    : "bg-amber-100 text-amber-800 border-amber-200"
                }`}
              >
                {proj.status}
              </span>
            </div>

            {/* Progress Slider */}
            <div className="p-4 bg-[#F8FCF9] rounded-xl border border-[#D9E8DD] space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-gray-700">Physical Progress:</span>
                <span className="text-[#2E8B57] text-sm">{proj.progress}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={proj.progress}
                onChange={(e) => updateProgress(proj.id, parseInt(e.target.value))}
                className="w-full accent-[#2E8B57] cursor-pointer"
              />
            </div>

            {/* Meta Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div>
                <span className="text-gray-400 text-[10px] uppercase font-semibold">Budget</span>
                <div className="font-bold text-gray-900">{proj.budget}</div>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] uppercase font-semibold">Timeline</span>
                <div className="font-semibold text-gray-800">{proj.timeline}</div>
              </div>
              <div className="col-span-2">
                <span className="text-gray-400 text-[10px] uppercase font-semibold">Contractor</span>
                <div className="font-medium text-gray-800">{proj.contractor}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
