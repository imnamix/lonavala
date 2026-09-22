"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  Plus,
  Trash2,
  Edit2,
  Eye,
  Search,
  Phone,
  Mail,
  User,
  MapPin,
  CheckCircle2,
  X,
  ExternalLink,
  Sparkles,
  HeartPulse,
  Droplets,
  HardHat,
  Receipt,
  ShieldAlert,
  Flame,
  Cpu,
  Layers,
  UserCheck,
  RefreshCw,
  FileText,
} from "lucide-react";
import { Department } from "@/types";
import {
  getAllDepartments,
  deleteDepartment,
} from "@/lib/services/department.service";
import { getInlineFileUrl } from "@/lib/utils";

export const DEPT_ICON_MAP: Record<string, any> = {
  Building2,
  HeartPulse,
  Droplets,
  HardHat,
  Receipt,
  ShieldAlert,
  Flame,
  Cpu,
  Layers,
};

export function DepartmentTable() {
  const router = useRouter();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllDepartments();
      setDepartments(data);
    } catch (err) {
      console.error("Failed to load departments:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleDelete = async (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to remove the "${name}" department?`)) {
      try {
        await deleteDepartment(id);
        setDepartments((prev) => prev.filter((d) => d.id !== id && d.slug !== id));
        showToast(`Removed "${name}" department.`);
        if (selectedDept?.id === id || selectedDept?.slug === id) {
          setSelectedDept(null);
        }
      } catch (err) {
        console.error("Error deleting department:", err);
        showToast(`Failed to remove "${name}".`);
      }
    }
  };

  // Filtered departments list
  const filteredDepartments = departments.filter((d) => {
    const q = searchQuery.toLowerCase();
    return (
      searchQuery === "" ||
      d.name.toLowerCase().includes(q) ||
      (d.marathiName && d.marathiName.toLowerCase().includes(q)) ||
      d.headOfficer.toLowerCase().includes(q) ||
      d.designation.toLowerCase().includes(q) ||
      (d.clerkName && d.clerkName.toLowerCase().includes(q)) ||
      (d.clerkPhone && d.clerkPhone.toLowerCase().includes(q)) ||
      (d.clerkEmail && d.clerkEmail.toLowerCase().includes(q)) ||
      d.location.toLowerCase().includes(q) ||
      d.phone.toLowerCase().includes(q) ||
      d.email.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-surface-dark text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-white/10 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Table Card */}
      <div className="bg-white p-5 sm:p-7 rounded-3xl border border-border shadow-xs space-y-5">
        {/* Header & Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center font-bold shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base text-text-primary">Departments</h2>
                {loading && <RefreshCw className="w-3.5 h-3.5 text-primary animate-spin" />}
              </div>
              <p className="text-xs text-gray-500">
                {departments.length} municipal wings configured with leadership and clerk desks.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dept, officer, clerk, location..."
                className="w-full pl-9 pr-3 py-2 bg-primary-surface border border-border rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:bg-white focus:border-primary focus:outline-hidden transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:text-gray-800 hover:bg-gray-100 flex items-center gap-1.5 transition-colors"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => fetchDepartments()}
              className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:text-primary hover:bg-gray-50 transition-colors"
              title="Refresh Departments"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>

            <Link
              href="/admin/departments/new"
              className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Department</span>
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-primary-surface border-b border-border text-gray-700 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-4"># / Department Name</th>
                <th className="py-3.5 px-4">Head Officer (HOD)</th>
                <th className="py-3.5 px-4">Clerk / Desk Officer</th>
                <th className="py-3.5 px-4">Official Contacts</th>
                <th className="py-3.5 px-3 text-center">Services</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredDepartments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    <Building2 className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                    <p className="font-semibold text-gray-600">
                      {loading ? "Loading departments..." : "No departments match your search."}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1">
                      {loading ? "Fetching data from backend..." : "Try resetting your search query."}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredDepartments.map((dept, index) => {
                  const IconComp = DEPT_ICON_MAP[dept.icon] || Building2;
                  return (
                    <tr
                      key={dept.id}
                      onClick={() => router.push(`/admin/departments/${dept.slug || dept.id}`)}
                      className="hover:bg-primary-light/40 transition-colors cursor-pointer group"
                    >
                      {/* # / Department Name */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <span className="w-5 h-5 rounded-full bg-white border border-gray-200 text-gray-600 flex items-center justify-center text-[10px] font-bold shrink-0">
                            {index + 1}
                          </span>
                          <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center shrink-0 border border-border group-hover:bg-primary group-hover:text-white transition-colors">
                            <IconComp className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-bold text-text-primary text-xs leading-tight group-hover:text-primary transition-colors">
                              {dept.name}
                            </div>
                            <div className="text-[11px] text-primary font-semibold mt-0.5">
                              {dept.marathiName}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Head Officer */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          {dept.headOfficerImage ? (
                            <img
                              src={dept.headOfficerImage}
                              alt={dept.headOfficer}
                              className="w-8 h-8 rounded-full object-cover border border-border shrink-0 shadow-xs"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-primary-light text-primary flex items-center justify-center font-bold text-xs shrink-0 border border-border">
                              {dept.headOfficer?.charAt(0) || "H"}
                            </div>
                          )}
                          <div className="space-y-0.5">
                            <div className="font-bold text-text-primary flex items-center gap-1.5">
                              <span>{dept.headOfficer}</span>
                            </div>
                            <div className="text-[11px] text-gray-500">{dept.designation}</div>
                          </div>
                        </div>
                      </td>

                      {/* Clerk Details */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {dept.clerkName ? (
                          <div className="space-y-0.5">
                            <div className="font-semibold text-emerald-800 flex items-center gap-1.5 text-xs">
                              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{dept.clerkName}</span>
                            </div>
                            <div className="text-[11px] text-gray-500 pl-5 flex items-center gap-2">
                              {dept.clerkPhone || dept.clerkMobile ? (
                                <span>{dept.clerkPhone || dept.clerkMobile}</span>
                              ) : (
                                <span className="italic text-gray-400">No phone</span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-[11px] italic">Not assigned</span>
                        )}
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="space-y-1 text-[11px]">
                          {dept.phone && (
                            <a
                              href={`tel:${dept.phone}`}
                              className="flex items-center gap-1.5 text-gray-600 hover:text-primary"
                            >
                              <Phone className="w-3 h-3 text-primary" />
                              <span>{dept.phone}</span>
                            </a>
                          )}
                          {dept.email && (
                            <a
                              href={`mailto:${dept.email}`}
                              className="flex items-center gap-1.5 text-gray-500 hover:text-primary truncate max-w-[150px]"
                              title={dept.email}
                            >
                              <Mail className="w-3 h-3 text-gray-400" />
                              <span className="truncate">{dept.email}</span>
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Services count */}
                      <td className="py-3.5 px-3 text-center whitespace-nowrap">
                        <span className="px-2.5 py-0.5 rounded-full bg-primary-light text-primary font-bold text-[11px] border border-emerald-200">
                          {dept.services?.length || 0} Services
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div
                          className="flex items-center justify-center gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => setSelectedDept(dept)}
                            className="p-1.5 rounded-lg bg-white border border-gray-200 hover:border-primary hover:bg-primary-light text-gray-600 hover:text-primary transition-colors"
                            title="Quick View Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <Link
                            href={`/admin/departments/${dept.slug || dept.id}`}
                            className="px-2.5 py-1.5 rounded-lg bg-white border border-gray-200 hover:border-primary hover:bg-primary-light text-gray-700 hover:text-primary text-xs font-semibold flex items-center gap-1 transition-colors"
                            title="Edit department"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span className="text-[10px]">Edit</span>
                          </Link>

                          <Link
                            href={`/departments/${dept.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg bg-white border border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-gray-500 hover:text-blue-600 transition-colors"
                            title="Preview Citizen Page"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            type="button"
                            onClick={(e) => handleDelete(dept.id, dept.name, e)}
                            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 border border-red-200 transition-colors cursor-pointer"
                            title="Delete department"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick View Details Modal */}
      {selectedDept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-border shadow-2xl overflow-hidden animate-scale-up max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-primary-light p-6 border-b border-border flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white text-primary flex items-center justify-center shadow-xs border border-border">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-text-primary">{selectedDept.name}</h3>
                  <p className="text-xs text-primary font-semibold">{selectedDept.marathiName}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDept(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto">
              {/* Overview */}
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Department Overview
                </h4>
                <p className="text-xs text-gray-700 leading-relaxed bg-primary-surface p-3.5 rounded-2xl border border-border">
                  {selectedDept.overview}
                </p>
              </div>

              {/* Leadership & Coordinates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-200 text-xs">
                <div className="flex items-start gap-3">
                  {selectedDept.headOfficerImage ? (
                    <img
                      src={selectedDept.headOfficerImage}
                      alt={selectedDept.headOfficer}
                      className="w-10 h-10 rounded-full object-cover border border-border shrink-0 shadow-xs mt-0.5"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary-light text-primary flex items-center justify-center font-bold text-sm shrink-0 border border-border mt-0.5">
                      {selectedDept.headOfficer?.charAt(0) || "H"}
                    </div>
                  )}
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Head of Department (HOD)</span>
                    <span className="font-bold text-gray-800 text-xs">{selectedDept.headOfficer}</span>
                    <span className="text-[11px] text-primary block">{selectedDept.designation}</span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Direct Phone</span>
                  <span className="font-semibold text-gray-800">{selectedDept.phone}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Official Email</span>
                  <span className="font-semibold text-gray-800">{selectedDept.email}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Office Location</span>
                  <span className="font-semibold text-gray-800">{selectedDept.location}</span>
                </div>
              </div>

              {/* Clerk / Desk Details */}
              <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 text-xs space-y-2">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-700" />
                  <span className="font-bold text-emerald-900 text-xs">Designated Clerk / Desk Officer</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div>
                    <span className="text-[10px] text-emerald-600 font-bold uppercase block">Clerk Name</span>
                    <span className="font-bold text-gray-800">{selectedDept.clerkName || "Not assigned"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-600 font-bold uppercase block">Clerk Mobile</span>
                    <span className="font-semibold text-gray-800">
                      {selectedDept.clerkPhone || selectedDept.clerkMobile || "—"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-600 font-bold uppercase block">Clerk Email</span>
                    <span className="font-semibold text-gray-800">{selectedDept.clerkEmail || "—"}</span>
                  </div>
                </div>
              </div>

              {/* Responsibilities */}
              {selectedDept.responsibilities?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Key Responsibilities ({selectedDept.responsibilities.length})
                  </h4>
                  <div className="grid grid-cols-1 gap-1.5">
                    {selectedDept.responsibilities.map((resp, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                        <span>{resp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Services */}
              {selectedDept.services?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Public Services ({selectedDept.services.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDept.services.map((srv, idx) => {
                      const title = typeof srv === "string" ? srv : srv?.title || "";
                      return (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-primary-light text-primary font-semibold text-xs border border-emerald-200"
                        >
                          {title}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Documents & By-laws */}
              {selectedDept.documents && selectedDept.documents.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center justify-between">
                    <span>Documents & By-laws ({selectedDept.documents.length})</span>
                  </h4>
                  <div className="space-y-1.5">
                    {selectedDept.documents.map((doc, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between text-xs gap-2"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span className="font-semibold text-gray-800 truncate">{doc.title}</span>
                          <span className="text-[10px] text-gray-400 shrink-0">({doc.size || doc.type})</span>
                        </div>
                        {(doc.fileUrl || doc.url) && (
                          <a
                            href={getInlineFileUrl(doc.fileUrl || doc.url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1 shrink-0"
                          >
                            <span>Open</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="p-4 px-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between shrink-0">
              <Link
                href={`/departments/${selectedDept.slug}`}
                target="_blank"
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                <span>View Public Page ↗</span>
              </Link>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedDept(null)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-white text-xs font-semibold"
                >
                  Close
                </button>
                <Link
                  href={`/admin/departments/${selectedDept.slug || selectedDept.id}`}
                  className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Department</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
