"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, Plus, Edit2, Trash2, CheckCircle2, Phone, Mail, User } from "lucide-react";
import { DEPARTMENTS } from "@/data/mockData";

export default function AdminDepartmentsPage() {
  const [departments, setDepartments] = useState(DEPARTMENTS);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1F2937]">Manage Departments</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure municipal departments, designated head officers, contacts, and public documents.
          </p>
        </div>

        <button
          onClick={() => alert("New department modal opened (Demo mode)")}
          className="px-4 py-2.5 bg-[#2E8B57] hover:bg-[#246E45] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Department</span>
        </button>
      </div>

      {/* Grid of Department Management Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <div
            key={dept.id}
            className="bg-white rounded-2xl border border-[#D9E8DD] p-5 shadow-xs hover:border-[#2E8B57] transition-all space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#2E8B57] bg-[#E8F5E9] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Active Wing
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => alert(`Edit ${dept.name}`)}
                    className="p-1.5 text-gray-400 hover:text-[#2E8B57] rounded-lg"
                    title="Edit Department"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Remove ${dept.name}?`)) {
                        setDepartments(departments.filter((d) => d.id !== dept.id));
                      }
                    }}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg"
                    title="Delete Department"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="font-bold text-base text-[#1F2937] mt-2">{dept.name}</h3>
              <p className="text-xs text-[#2E8B57] font-semibold">{dept.marathiName}</p>

              <div className="mt-3 p-3 rounded-xl bg-[#F8FCF9] border border-[#D9E8DD] space-y-1.5 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-[#2E8B57]" />
                  <span className="font-bold text-gray-800">{dept.headOfficer}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  <span>{dept.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  <span className="truncate">{dept.email}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-gray-500">{dept.services.length} Public Services</span>
              <Link
                href={`/departments/${dept.slug}`}
                target="_blank"
                className="font-bold text-[#2E8B57] hover:underline"
              >
                Preview Page ↗
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
