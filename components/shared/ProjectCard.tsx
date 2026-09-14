import Image from "next/image";
import { MapPin, Calendar, IndianRupee, HardHat, CheckCircle2 } from "lucide-react";
import { Project } from "@/types";

export function ProjectCard({ project }: { project: Project }) {
  const statusColors: Record<string, string> = {
    Ongoing: "bg-emerald-50 text-emerald-800 border-emerald-300",
    Completed: "bg-blue-50 text-blue-800 border-blue-300",
    Upcoming: "bg-amber-50 text-amber-800 border-amber-300",
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-600/60 hover:-translate-y-1 transition-all duration-200 group flex flex-col justify-between">
      <div>
        {/* Project Thumbnail Image */}
        <div className="relative h-44 w-full overflow-hidden bg-slate-100">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
          <div className="absolute top-3 right-3">
            <span
              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border shadow-xs ${
                statusColors[project.status] || "bg-slate-100 text-slate-800"
              }`}
            >
              {project.status}
            </span>
          </div>
          <div className="absolute bottom-2.5 left-3 text-white">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-900/60 backdrop-blur-xs px-2 py-0.5 rounded">
              {project.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5">
          <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1 mb-1.5">
            {project.title}
          </h3>

          {/* Short 1-line description */}
          <p className="text-xs text-slate-600 line-clamp-1 mb-3">
            {project.description}
          </p>

          {/* Progress Bar */}
          <div className="mb-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
            <div className="flex items-center justify-between text-xs mb-1 font-semibold">
              <span className="text-slate-600 text-[11px]">Milestone</span>
              <span className="text-emerald-700 font-bold">{project.progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-700 to-teal-500 rounded-full transition-all duration-700"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>

          {/* Key Meta Grid */}
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
            <div className="flex items-center gap-1.5 truncate">
              <IndianRupee className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate font-bold text-slate-900">{project.budget}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">{project.timeline.split("-")[1] || project.timeline}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate col-span-2 text-slate-500">
              <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
              <span className="truncate">{project.location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-5 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px]">
        <span className="text-slate-500 truncate max-w-[180px]">
          {project.contractor.split("JV")[0]}
        </span>
        <span className="font-bold text-emerald-700 group-hover:underline">
          Details →
        </span>
      </div>
    </div>
  );
}
