"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { HardHat, ArrowRight } from "lucide-react";
import { ProjectCard } from "@/components/shared/ProjectCard";
import { useLanguage } from "@/context/LanguageContext";
import { getAllProjects } from "@/lib/services/project.service";
import { Project } from "@/types";

export function OngoingProjectsSection() {
  const { dict } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        setLoading(true);
        const data = await getAllProjects();
        setProjects(data || []);
      } catch (err) {
        console.warn("Could not load projects for homepage section:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  const ongoing = projects.filter((p) => p.status === "Ongoing").slice(0, 3);
  const displayProjects = ongoing.length > 0 ? ongoing : projects.slice(0, 3);

  if (!loading && displayProjects.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
              <HardHat className="w-3.5 h-3.5 text-emerald-600" />
              <span>{dict.projects.badge}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              {dict.projects.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
              {dict.projects.subtitle}
            </p>
          </div>

          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-700 group shrink-0"
          >
            <span>{dict.projects.viewAll}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs flex flex-col justify-between animate-pulse"
              >
                <div>
                  {/* Thumbnail Skeleton */}
                  <div className="relative h-44 w-full bg-slate-200">
                    <div className="absolute top-3 right-3 h-5 w-16 bg-slate-300/80 rounded-full" />
                    <div className="absolute bottom-2.5 left-3 h-4 w-20 bg-slate-300/80 rounded" />
                  </div>
                  {/* Content Skeleton */}
                  <div className="p-4 sm:p-5">
                    <div className="h-5 bg-slate-200 rounded-md w-4/5 mb-2" />
                    <div className="h-3.5 bg-slate-100 rounded w-full mb-3" />
                    {/* Progress Bar Container Skeleton */}
                    <div className="mb-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                      <div className="flex justify-between mb-1.5">
                        <div className="h-3 w-14 bg-slate-200 rounded" />
                        <div className="h-3 w-8 bg-slate-200 rounded" />
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full" />
                    </div>
                    {/* Meta Grid Skeleton */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="h-3.5 bg-slate-100 rounded" />
                      <div className="h-3.5 bg-slate-100 rounded" />
                      <div className="col-span-2 h-3.5 bg-slate-100 rounded w-2/3" />
                    </div>
                  </div>
                </div>
                {/* Bottom Bar Skeleton */}
                <div className="px-4 sm:px-5 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <div className="h-3 w-24 bg-slate-200 rounded" />
                  <div className="h-3 w-12 bg-slate-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
