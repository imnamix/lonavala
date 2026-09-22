"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  HardHat,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  Search,
  RefreshCw,
  Building,
  MapPin,
  IndianRupee,
  Calendar,
  Layers,
  TrendingUp,
  Clock,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import { Project } from "@/types";
import {
  getAllProjects,
  updateProject,
  deleteProject,
} from "@/lib/services/project.service";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await getAllProjects();
      setProjects(data);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const cycleStatus = async (id: string, currentStatus: "Ongoing" | "Completed" | "Upcoming") => {
    const nextStatus: Record<string, "Ongoing" | "Completed" | "Upcoming"> = {
      Upcoming: "Ongoing",
      Ongoing: "Completed",
      Completed: "Upcoming",
    };
    const newStatus = nextStatus[currentStatus];
    const newProgress = newStatus === "Completed" ? 100 : newStatus === "Upcoming" ? 0 : 50;

    try {
      await updateProject(id, { status: newStatus, progress: newProgress });
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: newStatus, progress: newProgress } : p))
      );
      setFeedbackMessage(`Project status updated to "${newStatus}"`);
      setTimeout(() => setFeedbackMessage(null), 3000);
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete project "${title}"?`)) {
      try {
        await deleteProject(id);
        setProjects((prev) => prev.filter((p) => p.id !== id));
        setFeedbackMessage("Project deleted successfully.");
        setTimeout(() => setFeedbackMessage(null), 3000);
      } catch (err) {
        console.error("Failed to delete project:", err);
      }
    }
  };

  // Stats
  const ongoingCount = projects.filter((p) => p.status === "Ongoing").length;
  const completedCount = projects.filter((p) => p.status === "Completed").length;
  const upcomingCount = projects.filter((p) => p.status === "Upcoming").length;

  const statusBadge = {
    Ongoing: "bg-emerald-100 text-emerald-800 border-emerald-300",
    Completed: "bg-blue-100 text-blue-800 border-blue-300",
    Upcoming: "bg-amber-100 text-amber-800 border-amber-300",
  };

  // Filtered projects
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.contractor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === "All" || p.category === categoryFilter;
    const matchesStatus = statusFilter === "All" || p.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {feedbackMessage && (
        <div className="fixed top-6 right-6 z-50 bg-primary text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Top Banner & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-border shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-text-primary">Capital Works & Projects</h1>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-primary-light text-primary">
              {projects.length} Projects
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Monitor infrastructure contracts, physical completion milestones, and contractor SLAs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchProjects}
            className="p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-border"
            title="Reload projects"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <Link
            href="/admin/projects/new"
            className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </Link>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-4 rounded-2xl border border-border shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center font-bold">
            <HardHat className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-gray-500 font-semibold">Total Projects</div>
            <div className="text-lg font-black text-gray-900">{projects.length}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-border shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-gray-500 font-semibold">Ongoing Works</div>
            <div className="text-lg font-black text-emerald-700">{ongoingCount}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-border shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-gray-500 font-semibold">Completed</div>
            <div className="text-lg font-black text-blue-700">{completedCount}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-border shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-gray-500 font-semibold">Upcoming</div>
            <div className="text-lg font-black text-amber-700">{upcomingCount}</div>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-border shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by title, location, department, or contractor..."
            className="w-full pl-10 pr-4 py-2 bg-primary-surface border border-border rounded-xl text-xs font-semibold text-gray-800 focus:bg-white focus:border-primary focus:outline-hidden"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-primary-surface border border-border rounded-xl font-semibold text-gray-700 text-xs focus:bg-white focus:border-primary focus:outline-hidden"
          >
            <option value="All">All Categories</option>
            <option value="Sanitation & Environment">Sanitation & Environment</option>
            <option value="Tourism Infrastructure">Tourism Infrastructure</option>
            <option value="Urban Aesthetics">Urban Aesthetics</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Public Transport">Public Transport</option>
            <option value="Water Supply & Drainage">Water Supply & Drainage</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-primary-surface border border-border rounded-xl font-semibold text-gray-700 text-xs focus:bg-white focus:border-primary focus:outline-hidden"
          >
            <option value="All">All Statuses</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
            <option value="Upcoming">Upcoming</option>
          </select>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-gray-500 text-xs space-y-2">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-primary" />
            <p>Loading capital projects...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="p-12 text-center text-gray-500 space-y-3">
            <HardHat className="w-8 h-8 text-gray-400 mx-auto" />
            <p className="font-bold text-sm text-gray-700">No projects found</p>
            <p className="text-xs text-gray-400">
              Try adjusting your search query or add a new municipal project.
            </p>
            <Link
              href="/admin/projects/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white font-bold text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Project</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-primary-surface border-b border-border text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                  <th className="py-4 px-6">Project Title & Site</th>
                  <th className="py-4 px-6">Category & Dept</th>
                  <th className="py-4 px-6">Budget & Timeline</th>
                  <th className="py-4 px-6">Contractor</th>
                  <th className="py-4 px-6">Progress & Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                {filteredProjects.map((p) => (
                  <tr key={p.id} className="hover:bg-primary-light/20 transition-colors">
                    {/* Title & Location with Thumbnail */}
                    <td className="py-4 px-6 max-w-sm">
                      <div className="flex items-center gap-3">
                        {p.image ? (
                          <div className="w-12 h-10 rounded-xl overflow-hidden bg-gray-100 border border-border shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center shrink-0">
                            <HardHat className="w-5 h-5" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-extrabold text-text-primary line-clamp-1">{p.title}</p>
                          <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5 font-medium truncate">
                            <MapPin className="w-3 h-3 text-primary shrink-0" />
                            <span>{p.location}</span>
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category & Department */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary-light text-primary">
                        {p.category}
                      </span>
                      <p className="text-[11px] text-gray-600 mt-1 font-medium truncate max-w-[150px]">
                        {p.department}
                      </p>
                    </td>

                    {/* Budget & Timeline */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <p className="font-extrabold text-gray-900">{p.budget}</p>
                      <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3 text-gray-400 shrink-0" />
                        <span>{p.timeline}</span>
                      </p>
                    </td>

                    {/* Contractor */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="font-semibold text-gray-800">{p.contractor}</span>
                    </td>

                    {/* Progress Bar & Status Badge */}
                    <td className="py-4 px-6 whitespace-nowrap min-w-[160px]">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <button
                            onClick={() => cycleStatus(p.id, p.status)}
                            className={`px-2 py-0.5 rounded-full text-[9px] font-bold border transition-transform hover:scale-105 cursor-pointer ${
                              statusBadge[p.status]
                            }`}
                            title="Click to cycle status: Upcoming → Ongoing → Completed"
                          >
                            {p.status}
                          </button>
                          <span className="font-mono font-bold text-gray-700">{p.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              p.status === "Completed"
                                ? "bg-blue-600"
                                : p.status === "Ongoing"
                                ? "bg-emerald-600"
                                : "bg-amber-500"
                            }`}
                            style={{ width: `${Math.min(100, Math.max(0, p.progress))}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/projects/${p.id}`}
                          className="p-2 text-gray-600 hover:text-primary hover:bg-primary-light rounded-xl transition-colors cursor-pointer"
                          title="Edit Project"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => handleDelete(p.id, p.title)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                          title="Delete Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
