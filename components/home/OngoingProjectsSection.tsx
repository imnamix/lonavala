"use client";

import Link from "next/link";
import { HardHat, ArrowRight } from "lucide-react";
import { MUNICIPAL_PROJECTS } from "@/data/mockData";
import { ProjectCard } from "@/components/shared/ProjectCard";
import { useLanguage } from "@/context/LanguageContext";

export function OngoingProjectsSection() {
  const { dict } = useLanguage();
  const ongoing = MUNICIPAL_PROJECTS.filter((p) => p.status === "Ongoing").slice(0, 3);

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ongoing.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
