"use client";

import { useState, useEffect } from "react";
import { Building2 } from "lucide-react";
import { Department } from "@/types";
import { DepartmentCard } from "@/components/shared/DepartmentCard";
import { SearchBar } from "@/components/shared/SearchBar";
import { getAllDepartments } from "@/lib/services/department.service";
import { useLanguage } from "@/context/LanguageContext";

export default function DepartmentsPage() {
  const { language } = useLanguage();
  const isMr = language === "mr";

  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadDepts() {
      try {
        const data = await getAllDepartments({ isActive: true });
        setDepartments(data || []);
      } catch (err) {
        console.error("Failed to load departments:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDepts();
  }, []);

  const filteredDepts = departments.filter((dept) => {
    const q = search.toLowerCase();
    return (
      dept.name.toLowerCase().includes(q) ||
      (dept.marathiName && dept.marathiName.includes(q)) ||
      dept.headOfficer.toLowerCase().includes(q) ||
      (dept.clerkName && dept.clerkName.toLowerCase().includes(q)) ||
      dept.responsibilities.some((r) => r.toLowerCase().includes(q)) ||
      dept.services.some((s) => {
        const title = typeof s === "string" ? s : s?.title || "";
        return title.toLowerCase().includes(q);
      })
    );
  });

  return (
    <div className="py-10">
      {/* Header */}
      <div className="bg-primary-light/60 border-y border-border py-12 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-white px-3 py-1 rounded-full border border-border">
              {isMr ? "प्रशासकीय विभाग" : "Municipal Wings"}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary mt-3">
              {isMr ? "प्रशासकीय विभाग" : "Administrative Departments"}
            </h1>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              {isMr
                ? "लोणावळा नगर परिषदेचे प्रशासकीय विभाग, जबाबदाऱ्या, विभाग प्रमुख, अधिकारी, नागरिक सेवा आणि थेट संपर्क तपशील."
                : "Explore our civic departments, organizational mandates, key officers, desk clerks, citizen service charters, and direct contact directories."}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-border shadow-xs">
          <div className="w-full sm:max-w-md">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder={
                isMr
                  ? "विभाग, अधिकारी किंवा सेवेचे नाव शोधा..."
                  : "Search by department name, officer, clerk, or service..."
              }
            />
          </div>
          <div className="text-xs font-semibold text-gray-500 shrink-0">
            {isMr ? (
              <>
                एकूण {departments.length} पैकी{" "}
                <strong className="text-primary">{filteredDepts.length}</strong> विभाग दर्शवित आहे
              </>
            ) : (
              <>
                Showing <strong className="text-primary">{filteredDepts.length}</strong> of{" "}
                {departments.length} Departments
              </>
            )}
          </div>
        </div>

        {/* Department Cards Grid */}
        {filteredDepts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDepts.map((dept) => (
              <DepartmentCard key={dept.id} dept={dept} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-border p-8">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-800">
              {loading
                ? isMr
                  ? "विभाग लोड होत आहेत..."
                  : "Loading departments..."
                : isMr
                ? "कोणताही विभाग आढळला नाही"
                : "No departments found"}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {loading
                ? isMr
                  ? "माहिती लोड होत आहे..."
                  : "Connecting to municipal database..."
                : isMr
                ? "'पाणी', 'कर', किंवा 'बांधकाम' यांसारखे कीवर्ड शोधून पहा."
                : "Try searching with different keywords like 'Water', 'Tax', or 'PWD'."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
