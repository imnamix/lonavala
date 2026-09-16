"use client";

import { useState, useEffect } from "react";
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
  FileText,
  HeartPulse,
  Droplets,
  HardHat,
  Receipt,
  ShieldAlert,
  Flame,
  Cpu,
  Layers,
} from "lucide-react";
import { Department } from "@/types";
import {
  getDepartments,
  deleteDepartmentById,
} from "@/data/departmentData";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setDepartments(getDepartments());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleDelete = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to remove the "${name}" department?`)) {
      const updated = deleteDepartmentById(id);
      setDepartments(updated);
      showToast(`Removed "${name}" department.`);
      if (selectedDept?.id === id) {
        setSelectedDept(null);
      }
    }
  };

  // Filtered departments list
  const filteredDepartments = departments.filter((d) => {
    return (
      searchQuery === "" ||
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.marathiName && d.marathiName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      d.headOfficer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.email.toLowerCase().includes(searchQuery.toLowerCase())
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
              <h2 className="font-bold text-base text-text-primary">Departments</h2>
              <p className="text-xs text-gray-500">
                {departments.length} municipal wings configured. Click any row to view or edit details.
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
                placeholder="Search department, officer, location..."
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

            <Link
              href="/admin/departments/new"
              className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Department</span>
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-primary-surface border-b border-border text-gray-700 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-4"># / Department Name</th>
                <th className="py-3.5 px-4">Head Officer & Title</th>
                <th className="py-3.5 px-4">Contact Information</th>
                <th className="py-3.5 px-3 text-center">Services</th>
                <th className="py-3.5 px-4">Office Location</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredDepartments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    <Building2 className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                    <p className="font-semibold text-gray-600">No departments match your search.</p>
                    <p className="text-[11px] text-gray-400 mt-1">Try resetting your search query.</p>
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
                        <div className="space-y-0.5">
                          <div className="font-bold text-text-primary flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-primary" />
                            <span>{dept.headOfficer}</span>
                          </div>
                          <div className="text-[11px] text-gray-500 pl-5">{dept.designation}</div>
                        </div>
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

                      {/* Location */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-600 max-w-[180px]">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="truncate" title={dept.location}>{dept.location}</span>
                        </div>
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
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Head of Department</span>
                  <span className="font-bold text-gray-800">{selectedDept.headOfficer}</span>
                  <span className="text-[11px] text-primary block">{selectedDept.designation}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Direct Phone</span>
                  <span className="font-semibold text-gray-800">{selectedDept.phone}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Email Address</span>
                  <span className="font-semibold text-gray-800">{selectedDept.email}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Office Location</span>
                  <span className="font-semibold text-gray-800">{selectedDept.location}</span>
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
                    {selectedDept.services.map((srv, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-primary-light text-primary font-semibold text-xs border border-emerald-200"
                      >
                        {srv}
                      </span>
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
