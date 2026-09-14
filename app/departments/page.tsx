"use client";

import { useState } from "react";
import { Building2, Search, Filter } from "lucide-react";
import { DEPARTMENTS } from "@/data/mockData";
import { DepartmentCard } from "@/components/shared/DepartmentCard";
import { SearchBar } from "@/components/shared/SearchBar";

export default function DepartmentsPage() {
  const [search, setSearch] = useState("");

  const filteredDepts = DEPARTMENTS.filter((dept) => {
    const q = search.toLowerCase();
    return (
      dept.name.toLowerCase().includes(q) ||
      dept.marathiName.includes(q) ||
      dept.headOfficer.toLowerCase().includes(q) ||
      dept.responsibilities.some((r) => r.toLowerCase().includes(q)) ||
      dept.services.some((s) => s.toLowerCase().includes(q))
    );
  });

  return (
    <div className="py-10">
      {/* Header */}
      <div className="bg-[#E8F5E9]/60 border-y border-[#D9E8DD] py-12 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2E8B57] bg-white px-3 py-1 rounded-full border border-[#D9E8DD]">
              Municipal Wings
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] mt-3">
              Administrative Departments
            </h1>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              Explore our civic departments, organizational mandates, key officers, citizen service charters, and direct contact directories.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#D9E8DD] shadow-xs">
          <div className="w-full sm:max-w-md">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search by department name, officer, or service..."
            />
          </div>
          <div className="text-xs font-semibold text-gray-500 shrink-0">
            Showing <strong className="text-[#2E8B57]">{filteredDepts.length}</strong> of{" "}
            {DEPARTMENTS.length} Departments
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
          <div className="text-center py-16 bg-white rounded-2xl border border-[#D9E8DD] p-8">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-800">No departments found</h3>
            <p className="text-xs text-gray-500 mt-1">
              Try searching with different keywords like &apos;Water&apos;, &apos;Tax&apos;, or &apos;PWD&apos;.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
