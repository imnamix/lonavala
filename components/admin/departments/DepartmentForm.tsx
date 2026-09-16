"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Save,
  ArrowLeft,
  CheckCircle2,
  Building2,
  User,
  Phone,
  Mail,
  Plus,
  Trash2,
  AlertCircle,
  Sparkles,
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
  getDepartmentById,
  saveOrUpdateDepartment,
  INITIAL_DEPARTMENTS,
} from "@/data/departmentData";

const AVAILABLE_ICONS = [
  { label: "Building / Admin", key: "Building2", icon: Building2 },
  { label: "Health & Medical", key: "HeartPulse", icon: HeartPulse },
  { label: "Water & Drainage", key: "Droplets", icon: Droplets },
  { label: "Public Works (PWD)", key: "HardHat", icon: HardHat },
  { label: "Tax & Finance", key: "Receipt", icon: Receipt },
  { label: "Disaster & Safety", key: "ShieldAlert", icon: ShieldAlert },
  { label: "Fire & Emergency", key: "Flame", icon: Flame },
  { label: "IT & E-Governance", key: "Cpu", icon: Cpu },
  { label: "General & Planning", key: "Layers", icon: Layers },
];

interface DepartmentFormProps {
  deptId?: string;
  isNew?: boolean;
}

export function DepartmentForm({ deptId, isNew = false }: DepartmentFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<Department>({
    id: isNew ? `dept-${Date.now()}` : "",
    name: "",
    marathiName: "",
    slug: "",
    icon: "Building2",
    headOfficer: "",
    designation: "",
    email: "",
    phone: "",
    location: "LMC Administrative Complex, Lonavala - 410401",
    overview: "",
    responsibilities: [""],
    services: [""],
    documents: [],
    stats: [],
  });

  const [savedToast, setSavedToast] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isNew && deptId) {
      const existing = getDepartmentById(deptId);
      if (existing) {
        setFormData(existing);
      } else {
        const fallback = INITIAL_DEPARTMENTS.find(
          (d) => d.id === deptId || d.slug === deptId
        );
        if (fallback) {
          setFormData(fallback);
        }
      }
    }
  }, [deptId, isNew]);

  const handleNameChange = (nameVal: string) => {
    setFormData((prev) => {
      const newSlug = isNew || !prev.slug
        ? nameVal
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "")
        : prev.slug;
      return { ...prev, name: nameVal, slug: newSlug };
    });
  };

  // Responsibilities handlers
  const handleAddResponsibility = () => {
    setFormData((prev) => ({
      ...prev,
      responsibilities: [...prev.responsibilities, ""],
    }));
  };

  const handleUpdateResponsibility = (index: number, val: string) => {
    setFormData((prev) => {
      const copy = [...prev.responsibilities];
      copy[index] = val;
      return { ...prev, responsibilities: copy };
    });
  };

  const handleRemoveResponsibility = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      responsibilities: prev.responsibilities.filter((_, i) => i !== index),
    }));
  };

  // Services handlers
  const handleAddService = () => {
    setFormData((prev) => ({
      ...prev,
      services: [...prev.services, ""],
    }));
  };

  const handleUpdateService = (index: number, val: string) => {
    setFormData((prev) => {
      const copy = [...prev.services];
      copy[index] = val;
      return { ...prev, services: copy };
    });
  };

  const handleRemoveService = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Department name is required.";
    if (!formData.marathiName.trim()) newErrors.marathiName = "Marathi name is required.";
    if (!formData.slug.trim()) newErrors.slug = "URL slug identifier is required.";
    if (!formData.headOfficer.trim()) newErrors.headOfficer = "Head officer name is required.";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const deptToSave: Department = {
      ...formData,
      id: formData.id || `dept-${Date.now()}`,
      responsibilities: formData.responsibilities.filter((r) => r.trim().length > 0),
      services: formData.services.filter((s) => s.trim().length > 0),
    };

    saveOrUpdateDepartment(deptToSave);
    setSavedToast(true);

    setTimeout(() => {
      router.push("/admin/departments");
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Toast */}
      {savedToast && (
        <div className="fixed top-6 right-6 z-50 bg-[#2E8B57] text-white text-xs font-bold px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span>Department successfully saved! Redirecting to table...</span>
        </div>
      )}

      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D9E8DD] pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/departments"
            className="p-2 rounded-xl bg-white border border-gray-200 hover:border-[#2E8B57] text-gray-600 hover:text-[#2E8B57] transition-colors"
            title="Back to Departments list"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#1F2937]">
              {isNew ? "Add New Department" : `Edit Department: ${formData.name || "Loading..."}`}
            </h1>
            <p className="text-xs text-gray-500">
              {isNew
                ? "Configure a new municipal department, designated head officer, and public services."
                : "Update official leadership, contacts, responsibilities, and citizen services."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Link
            href="/admin/departments"
            className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold transition-colors"
          >
            Cancel
          </Link>

          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-[#2E8B57] hover:bg-[#246E45] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Department</span>
          </button>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Validation alert banner */}
        {Object.keys(errors).length > 0 && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs space-y-1">
            <div className="flex items-center gap-2 font-bold">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span>Please correct the required fields highlighted below:</span>
            </div>
            <ul className="list-disc list-inside pl-1 text-[11px] space-y-0.5 text-red-600">
              {Object.values(errors).map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Section 1: Department Basic Information */}
        <div className="bg-white p-6 rounded-3xl border border-[#D9E8DD] shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Building2 className="w-4 h-4 text-[#2E8B57]" />
            <h3 className="font-bold text-sm text-[#1F2937]">Department Identity</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name (English) */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
                <span>Department Name (English) *</span>
                {errors.name && <span className="text-red-500 font-normal text-[10px]">{errors.name}</span>}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Health & Sanitation"
                className={`w-full px-3.5 py-2.5 bg-[#F8FCF9] border rounded-xl text-xs font-semibold text-gray-800 focus:bg-white focus:outline-hidden transition-all ${
                  errors.name ? "border-red-400 focus:border-red-500" : "border-[#D9E8DD] focus:border-[#2E8B57]"
                }`}
              />
            </div>

            {/* Name (Marathi) */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
                <span>Department Name (Marathi देवनागरी) *</span>
                {errors.marathiName && <span className="text-red-500 font-normal text-[10px]">{errors.marathiName}</span>}
              </label>
              <input
                type="text"
                value={formData.marathiName}
                onChange={(e) => setFormData({ ...formData, marathiName: e.target.value })}
                placeholder="e.g. आरोग्य व स्वच्छता विभाग"
                className={`w-full px-3.5 py-2.5 bg-[#F8FCF9] border rounded-xl text-xs font-semibold text-gray-800 focus:bg-white focus:outline-hidden transition-all ${
                  errors.marathiName ? "border-red-400 focus:border-red-500" : "border-[#D9E8DD] focus:border-[#2E8B57]"
                }`}
              />
            </div>

            {/* Slug */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
                <span>URL Slug Identifier *</span>
                {errors.slug && <span className="text-red-500 font-normal text-[10px]">{errors.slug}</span>}
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="e.g. health-sanitation"
                className={`w-full px-3.5 py-2.5 bg-[#F8FCF9] border rounded-xl text-xs font-semibold text-gray-800 focus:bg-white focus:outline-hidden transition-all ${
                  errors.slug ? "border-red-400 focus:border-red-500" : "border-[#D9E8DD] focus:border-[#2E8B57]"
                }`}
              />
            </div>

            {/* Icon Selection */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Department Icon Symbol</label>
              <select
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#F8FCF9] border border-[#D9E8DD] rounded-xl text-xs font-semibold text-gray-800 focus:bg-white focus:border-[#2E8B57] focus:outline-hidden"
              >
                {AVAILABLE_ICONS.map((i) => (
                  <option key={i.key} value={i.key}>
                    {i.label} ({i.key})
                  </option>
                ))}
              </select>
            </div>

            {/* Overview Description */}
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-bold text-gray-700">Departmental Scope & Overview</label>
              <textarea
                rows={3}
                value={formData.overview}
                onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                placeholder="Describe the department's mandate, public cleanliness, or infrastructure role..."
                className="w-full px-3.5 py-2.5 bg-[#F8FCF9] border border-[#D9E8DD] rounded-xl text-xs font-semibold text-gray-800 focus:bg-white focus:border-[#2E8B57] focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Leadership & Contact Coordinates */}
        <div className="bg-white p-6 rounded-3xl border border-[#D9E8DD] shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <User className="w-4 h-4 text-[#2E8B57]" />
            <h3 className="font-bold text-sm text-[#1F2937]">Leadership & Contact Coordinates</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Head Officer */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
                <span>Head of Department (HOD) *</span>
                {errors.headOfficer && <span className="text-red-500 font-normal text-[10px]">{errors.headOfficer}</span>}
              </label>
              <input
                type="text"
                value={formData.headOfficer}
                onChange={(e) => setFormData({ ...formData, headOfficer: e.target.value })}
                placeholder="e.g. Dr. Sandeep Deshmukh"
                className={`w-full px-3.5 py-2.5 bg-[#F8FCF9] border rounded-xl text-xs font-semibold text-gray-800 focus:bg-white focus:outline-hidden transition-all ${
                  errors.headOfficer ? "border-red-400 focus:border-red-500" : "border-[#D9E8DD] focus:border-[#2E8B57]"
                }`}
              />
            </div>

            {/* Designation */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Designation / Title</label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                placeholder="e.g. Chief Medical & Sanitation Officer"
                className="w-full px-3.5 py-2.5 bg-[#F8FCF9] border border-[#D9E8DD] rounded-xl text-xs font-semibold text-gray-800 focus:bg-white focus:border-[#2E8B57] focus:outline-hidden"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
                <span>Direct Phone Number *</span>
                {errors.phone && <span className="text-red-500 font-normal text-[10px]">{errors.phone}</span>}
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g. +91 2114 273111"
                className={`w-full px-3.5 py-2.5 bg-[#F8FCF9] border rounded-xl text-xs font-semibold text-gray-800 focus:bg-white focus:outline-hidden transition-all ${
                  errors.phone ? "border-red-400 focus:border-red-500" : "border-[#D9E8DD] focus:border-[#2E8B57]"
                }`}
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Official Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. health@lonavalamc.gov.in"
                className="w-full px-3.5 py-2.5 bg-[#F8FCF9] border border-[#D9E8DD] rounded-xl text-xs font-semibold text-gray-800 focus:bg-white focus:border-[#2E8B57] focus:outline-hidden"
              />
            </div>

            {/* Office Location */}
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-bold text-gray-700">Office Location in LMC Complex</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Ground Floor, LMC Administrative Complex, Lonavala - 410401"
                className="w-full px-3.5 py-2.5 bg-[#F8FCF9] border border-[#D9E8DD] rounded-xl text-xs font-semibold text-gray-800 focus:bg-white focus:border-[#2E8B57] focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Key Responsibilities */}
        <div className="bg-white p-6 rounded-3xl border border-[#D9E8DD] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#2E8B57]" />
              <h3 className="font-bold text-sm text-[#1F2937]">Key Responsibilities & Functions</h3>
            </div>
            <button
              type="button"
              onClick={handleAddResponsibility}
              className="px-3 py-1 bg-[#E8F5E9] hover:bg-[#2E8B57] text-[#2E8B57] hover:text-white font-bold text-xs rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Item</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {formData.responsibilities.map((resp, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-[10px] font-bold shrink-0">
                  {idx + 1}
                </span>
                <input
                  type="text"
                  value={resp}
                  onChange={(e) => handleUpdateResponsibility(idx, e.target.value)}
                  placeholder="e.g. Daily door-to-door solid waste collection and segregation..."
                  className="flex-1 px-3.5 py-2 bg-[#F8FCF9] border border-[#D9E8DD] rounded-xl text-xs font-semibold text-gray-800 focus:bg-white focus:border-[#2E8B57] focus:outline-hidden"
                />
                {formData.responsibilities.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveResponsibility(idx)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Citizen Services */}
        <div className="bg-white p-6 rounded-3xl border border-[#D9E8DD] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#2E8B57]" />
              <h3 className="font-bold text-sm text-[#1F2937]">Citizen Services Provided</h3>
            </div>
            <button
              type="button"
              onClick={handleAddService}
              className="px-3 py-1 bg-[#E8F5E9] hover:bg-[#2E8B57] text-[#2E8B57] hover:text-white font-bold text-xs rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Service</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {formData.services.map((srv, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-[10px] font-bold shrink-0">
                  {idx + 1}
                </span>
                <input
                  type="text"
                  value={srv}
                  onChange={(e) => handleUpdateService(idx, e.target.value)}
                  placeholder="e.g. Garbage collection escalation request..."
                  className="flex-1 px-3.5 py-2 bg-[#F8FCF9] border border-[#D9E8DD] rounded-xl text-xs font-semibold text-gray-800 focus:bg-white focus:border-[#2E8B57] focus:outline-hidden"
                />
                {formData.services.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveService(idx)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                    title="Remove service"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-2">
          <Link
            href="/admin/departments"
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold"
          >
            Cancel & Return
          </Link>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#2E8B57] hover:bg-[#246E45] text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Department</span>
          </button>
        </div>
      </form>
    </div>
  );
}
