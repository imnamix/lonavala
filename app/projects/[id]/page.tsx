"use client";

import { useEffect, useState, use, useCallback } from "react";
import Link from "next/link";
import {
  HardHat,
  MapPin,
  Calendar,
  IndianRupee,
  Building,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowLeft,
  ShieldCheck,
  TrendingUp,
  FileText,
  Layers,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
  Images,
} from "lucide-react";
import { getProjectById, getAllProjects } from "@/lib/services/project.service";
import { Project } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [project, setProject] = useState<Project | null>(null);
  const [otherProjects, setOtherProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number | null>(null);

  useEffect(() => {
    async function loadProject() {
      try {
        setLoading(true);
        const [projData, allProj] = await Promise.all([
          getProjectById(id),
          getAllProjects(),
        ]);

        setProject(projData);

        if (allProj && allProj.length > 0) {
          setOtherProjects(
            allProj.filter((p) => String(p.id) !== String(id)).slice(0, 3)
          );
        }
      } catch (err) {
        console.error(`Failed to load project #${id}:`, err);
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [id]);

  const handlePrevImage = useCallback(() => {
    if (activeGalleryIndex === null || !project?.gallery?.length) return;
    setActiveGalleryIndex((prev) =>
      prev !== null && prev > 0 ? prev - 1 : project.gallery!.length - 1
    );
  }, [activeGalleryIndex, project?.gallery]);

  const handleNextImage = useCallback(() => {
    if (activeGalleryIndex === null || !project?.gallery?.length) return;
    setActiveGalleryIndex((prev) =>
      prev !== null && prev < project.gallery!.length - 1 ? prev + 1 : 0
    );
  }, [activeGalleryIndex, project?.gallery]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (activeGalleryIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveGalleryIndex(null);
      } else if (e.key === "ArrowLeft") {
        handlePrevImage();
      } else if (e.key === "ArrowRight") {
        handleNextImage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeGalleryIndex, handlePrevImage, handleNextImage]);

  if (loading) {
    return (
      <div className="py-20 max-w-4xl mx-auto px-4 text-center space-y-4">
        <div className="p-16 bg-white rounded-3xl border border-border shadow-xs flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm font-bold text-gray-700">Loading Project Details...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="py-20 max-w-2xl mx-auto px-4 text-center">
        <div className="p-10 bg-white rounded-3xl border border-border shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-gray-900">Project Not Found</h2>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            The requested municipal project could not be located. It may have been modified, unlisted, or moved.
          </p>
          <div className="pt-2">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-hover transition-colors shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Projects & Works</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const statusBadge = {
    Ongoing: "bg-emerald-500/90 text-white",
    Completed: "bg-blue-500/90 text-white",
    Upcoming: "bg-amber-500/90 text-white",
  };

  const statusProgressColor = {
    Ongoing: "from-emerald-600 to-teal-500",
    Completed: "from-blue-600 to-cyan-500",
    Upcoming: "from-amber-600 to-yellow-500",
  };

  const activeImage =
    activeGalleryIndex !== null && project.gallery
      ? project.gallery[activeGalleryIndex]
      : null;

  return (
    <div className="py-8 space-y-10">
      {/* Lightbox Popup Modal with Next/Prev Controls */}
      {activeImage && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveGalleryIndex(null)}
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6 select-none animate-in fade-in duration-200"
        >
          {/* Top Bar: Counter & Close Button */}
          <div
            className="w-full flex items-center justify-between z-20 max-w-7xl mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <span className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold backdrop-blur-md">
                Photo {activeGalleryIndex! + 1} of {project.gallery!.length}
              </span>
              <span className="text-gray-300 text-xs font-medium hidden sm:inline-block truncate max-w-md">
                {project.title}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setActiveGalleryIndex(null)}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer border border-white/20 shadow-lg hover:scale-105 flex items-center gap-1.5 px-3.5"
              title="Close viewer (Esc)"
            >
              <X className="w-5 h-5" />
              <span className="text-xs font-bold hidden sm:inline">Close</span>
            </button>
          </div>

          {/* Main Content Area with Arrows and Image */}
          <div
            className="relative w-full flex-1 flex items-center justify-center my-2 max-w-7xl mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Previous Image Arrow */}
            {project.gallery!.length > 1 && (
              <button
                type="button"
                onClick={handlePrevImage}
                className="absolute left-2 sm:left-4 z-30 p-3 sm:p-4 rounded-full bg-black/70 hover:bg-black/90 text-white hover:scale-110 active:scale-95 transition-all border border-white/25 shadow-2xl cursor-pointer backdrop-blur-md"
                title="Previous photo (Left Arrow)"
              >
                <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
            )}

            {/* Main Center Image */}
            <div className="flex flex-col items-center justify-center max-h-[75vh] max-w-full px-12 sm:px-16">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={activeImage.url}
                src={activeImage.url}
                alt={activeImage.title || `${project.title} photo`}
                className="max-h-[68vh] max-w-[85vw] sm:max-w-[80vw] object-contain rounded-2xl shadow-2xl border border-white/15 animate-in zoom-in-95 duration-200"
              />

              {/* Caption Title */}
              {activeImage.title && (
                <div className="mt-3 px-5 py-2 rounded-xl bg-black/80 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-semibold max-w-2xl text-center shadow-xl">
                  {activeImage.title}
                </div>
              )}
            </div>

            {/* Next Image Arrow */}
            {project.gallery!.length > 1 && (
              <button
                type="button"
                onClick={handleNextImage}
                className="absolute right-2 sm:right-4 z-30 p-3 sm:p-4 rounded-full bg-black/70 hover:bg-black/90 text-white hover:scale-110 active:scale-95 transition-all border border-white/25 shadow-2xl cursor-pointer backdrop-blur-md"
                title="Next photo (Right Arrow)"
              >
                <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
            )}
          </div>

          {/* Bottom Thumbnails Strip */}
          {project.gallery!.length > 1 && (
            <div
              className="w-full flex items-center justify-center gap-2 overflow-x-auto py-2 px-4 z-20 max-w-3xl mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {project.gallery!.map((thumb, idx) => (
                <button
                  key={thumb.id || idx}
                  type="button"
                  onClick={() => setActiveGalleryIndex(idx)}
                  className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                    activeGalleryIndex === idx
                      ? "border-primary scale-110 shadow-lg ring-2 ring-primary/50"
                      : "border-white/30 opacity-60 hover:opacity-100 hover:border-white/70"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumb.url}
                    alt={thumb.title || `Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Top Breadcrumbs & Back Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Projects & Works</span>
          </Link>
        </div>
      </div>

      {/* Hero Banner with Project Photo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative h-[320px] sm:h-[440px] rounded-3xl overflow-hidden shadow-lg border border-border">
          {project.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-slate-900 flex items-center justify-center">
              <HardHat className="w-20 h-20 text-gray-600" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />

          {/* Top Badges */}
          <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-xs text-text-primary text-xs font-extrabold shadow-md">
              <Layers className="w-3.5 h-3.5 text-primary" />
              <span>{project.category}</span>
            </span>

            <span
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-md ${
                statusBadge[project.status] || "bg-emerald-600 text-white"
              }`}
            >
              {project.status === "Completed" ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : project.status === "Ongoing" ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <Clock className="w-3.5 h-3.5" />
              )}
              <span>{project.status}</span>
            </span>
          </div>

          {/* Title & Location Banner */}
          <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 text-white space-y-2 max-w-3xl">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight drop-shadow-md">
              {project.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-200">
              <div className="inline-flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span>{project.location}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                <Building className="w-3.5 h-3.5 text-primary" />
                <span>{project.department}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Highlight Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-border shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <IndianRupee className="w-3.5 h-3.5 text-primary" />
              <span>Sanctioned Budget</span>
            </span>
            <p className="text-lg sm:text-xl font-black text-text-primary">{project.budget}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-border shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              <span>Execution Timeline</span>
            </span>
            <p className="text-sm sm:text-base font-bold text-text-primary">{project.timeline}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-border shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-primary" />
              <span>Physical Completion</span>
            </span>
            <div className="flex items-center justify-between">
              <p className="text-lg sm:text-xl font-black text-primary">{project.progress}%</p>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-light text-primary">
                {project.status}
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-border shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <HardHat className="w-3.5 h-3.5 text-primary" />
              <span>Contractor / Agency</span>
            </span>
            <p className="text-xs sm:text-sm font-bold text-text-primary truncate" title={project.contractor}>
              {project.contractor}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column: Scope, Milestones, and Gallery */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Physical Progress Milestone Box */}
            <section className="bg-white p-6 sm:p-8 rounded-3xl border border-border shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
                  <TrendingUp className="w-4 h-4" />
                  <span>Physical Execution Progress</span>
                </div>
                <span className="font-mono font-extrabold text-sm text-gray-900">{project.progress}% Complete</span>
              </div>

              <div className="space-y-2">
                <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden p-0.5 border border-border">
                  <div
                    className={`h-full bg-gradient-to-r ${
                      statusProgressColor[project.status] || "from-emerald-600 to-teal-500"
                    } rounded-full transition-all duration-1000 shadow-sm`}
                    style={{ width: `${Math.min(100, Math.max(0, project.progress))}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-bold text-gray-400">
                  <span>Project Sanction & Foundation (0%)</span>
                  <span>Mid-Stage Execution (50%)</span>
                  <span>Operational Handover (100%)</span>
                </div>
              </div>
            </section>

            {/* Scope of Work & Description */}
            <section className="bg-white p-6 sm:p-8 rounded-3xl border border-border shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
                <FileText className="w-4 h-4" />
                <span>Scope of Civil Works</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
                Detailed Project Description
              </h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">
                {project.description}
              </p>
            </section>

            {/* Key Deliverables & Highlights */}
            {project.highlights && project.highlights.length > 0 && (
              <section className="bg-white p-6 sm:p-8 rounded-3xl border border-border shadow-xs space-y-5">
                <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>Key Project Highlights & Milestones</span>
                </div>

                <div className="space-y-3">
                  {project.highlights.map((highlight, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3.5 p-4 rounded-2xl bg-primary-surface border border-border text-xs sm:text-sm text-gray-800"
                    >
                      <div className="w-6 h-6 rounded-full bg-primary-light text-primary flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                        {idx + 1}
                      </div>
                      <p className="leading-relaxed font-semibold">{highlight}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Project Photo Gallery with Compact Grid & Lightbox Trigger */}
            {project.gallery && project.gallery.length > 0 && (
              <section className="bg-white p-6 sm:p-8 rounded-3xl border border-border shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
                    <Images className="w-4 h-4" />
                    <span>Project Photo Gallery & Site Documentation</span>
                  </div>
                  <span className="text-xs font-bold text-primary bg-primary-light px-3 py-1 rounded-full">
                    {project.gallery.length} Photos
                  </span>
                </div>

                <p className="text-xs text-gray-500">
                  Click any photo below to open in high-resolution interactive lightbox viewer.
                </p>

                {/* Compact Photo Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {project.gallery.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      onClick={() => setActiveGalleryIndex(idx)}
                      className="group rounded-2xl overflow-hidden border border-border bg-primary-surface hover:shadow-lg hover:border-primary/60 transition-all flex flex-col justify-between cursor-pointer p-1.5"
                    >
                      <div className="relative h-28 sm:h-32 w-full overflow-hidden rounded-xl bg-gray-900">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.url}
                          alt={item.title || `${project.title} gallery photo ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <span className="p-2 rounded-full bg-white/80 text-primary shadow-md backdrop-blur-xs">
                            <ZoomIn className="w-4 h-4" />
                          </span>
                        </div>
                        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-[9px] font-bold text-white px-2 py-0.5 rounded-full">
                          #{idx + 1}
                        </div>
                      </div>

                      {item.title ? (
                        <div className="p-2 bg-white rounded-lg mt-1 border border-border/50">
                          <p className="font-bold text-[11px] sm:text-xs text-text-primary leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                            {item.title}
                          </p>
                        </div>
                      ) : (
                        <div className="p-1 text-center">
                          <span className="text-[10px] text-gray-400 font-medium">Photo #{idx + 1}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column: Governance, SLA, Supervision */}
          <div className="space-y-6">
            {/* Municipal Project Governance Card */}
            <div className="bg-white p-6 rounded-3xl border border-border shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Governance & Oversight</span>
              </div>

              <div className="divide-y divide-gray-100 text-xs text-gray-700">
                <div className="py-2.5 flex items-center justify-between">
                  <span className="font-semibold text-gray-500">Supervising Dept:</span>
                  <span className="font-bold text-gray-900 text-right">{project.department}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="font-semibold text-gray-500">Project Category:</span>
                  <span className="font-bold text-primary text-right">{project.category}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="font-semibold text-gray-500">Executing Contractor:</span>
                  <span className="font-bold text-gray-900 text-right truncate max-w-[150px]" title={project.contractor}>
                    {project.contractor}
                  </span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="font-semibold text-gray-500">Site Location:</span>
                  <span className="font-bold text-gray-900 text-right">{project.location}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="font-semibold text-gray-500">Quality Audit:</span>
                  <span className="font-bold text-emerald-700 text-right">LMC Engineering Wing</span>
                </div>
              </div>
            </div>

            {/* Public Grievance / Project Inquiries */}
            <div className="bg-gradient-to-br from-primary to-primary-hover text-white p-6 rounded-3xl shadow-md space-y-3.5">
              <div className="flex items-center gap-2">
                <HardHat className="w-5 h-5 text-emerald-300" />
                <h3 className="font-bold text-sm sm:text-base">Project Feedback & Inquiries</h3>
              </div>
              <p className="text-xs text-emerald-100 leading-relaxed">
                Citizens and stakeholders can submit representations or report civic concerns regarding ongoing civil works.
              </p>

              <div className="space-y-2 pt-2 border-t border-white/20 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-100">PWD Engineering Desk:</span>
                  <a href="tel:02114273030" className="font-bold text-white underline">
                    +91 2114 273030
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-emerald-100">Online Grievance:</span>
                  <Link href="/grievance/register" className="font-bold text-white underline">
                    Register Grievance →
                  </Link>
                </div>
              </div>
            </div>

            {/* Environmental & Quality Standard Notice */}
            <div className="bg-primary-surface p-5 rounded-3xl border border-border text-xs space-y-2 text-gray-600">
              <div className="flex items-center gap-2 font-bold text-text-primary">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span>Eco-Sensitive Zone (ESZ) Compliance</span>
              </div>
              <p className="leading-relaxed">
                All infrastructure works adhere strictly to Maharashtra Eco-Sensitive Zone directives, rain-water harvesting mandates, and minimal hill-slope disturbance guidelines.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Explore Other Projects */}
      {otherProjects.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-border space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">City Transformation</span>
              <h3 className="text-xl sm:text-2xl font-bold text-text-primary mt-1">
                Other Municipal Projects & Works
              </h3>
            </div>
            <Link
              href="/projects"
              className="text-xs font-bold text-primary hover:underline hidden sm:inline-block"
            >
              View All Projects ({otherProjects.length + 1}) →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherProjects.map((other) => (
              <Link
                key={other.id}
                href={`/projects/${other.id}`}
                className="bg-white rounded-2xl border border-border overflow-hidden shadow-xs hover:shadow-lg hover:border-primary transition-all group flex flex-col justify-between"
              >
                <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
                  {other.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={other.image}
                      alt={other.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500">
                      <HardHat className="w-8 h-8" />
                    </div>
                  )}
                  <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-xs text-[10px] font-bold px-2.5 py-0.5 rounded-full text-text-primary shadow-xs">
                    {other.status}
                  </div>
                  <div className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-[10px] font-bold px-2 py-0.5 rounded text-white">
                    {other.category}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h4 className="font-bold text-sm text-text-primary group-hover:text-primary transition-colors line-clamp-1">
                    {other.title}
                  </h4>
                  <div className="flex items-center justify-between text-[11px] text-gray-500">
                    <span className="font-bold text-gray-900">{other.budget}</span>
                    <span className="font-bold text-primary">{other.progress}% Done</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
