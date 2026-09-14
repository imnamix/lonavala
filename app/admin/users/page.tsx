"use client";

import { useState } from "react";
import { Users, ShieldCheck, Check, X, Plus, UserPlus, Key } from "lucide-react";

export default function AdminUsersPage() {
  const staffUsers = [
    {
      id: "usr-1",
      name: "Shri. Pandit Patil",
      email: "co@lonavalamc.gov.in",
      role: "Super Admin",
      department: "Commissioner Secretariat",
      lastLogin: "Today, 10:15 AM",
    },
    {
      id: "usr-2",
      name: "Dr. Sandeep Deshmukh",
      email: "health@lonavalamc.gov.in",
      role: "Department Officer",
      department: "Health & Sanitation",
      lastLogin: "Yesterday, 04:30 PM",
    },
    {
      id: "usr-3",
      name: "Er. Rameshwar Kale",
      email: "water@lonavalamc.gov.in",
      role: "Grievance Officer",
      department: "Water Supply",
      lastLogin: "Today, 09:00 AM",
    },
    {
      id: "usr-4",
      name: "Mr. Tanmay Kulkarni",
      email: "it@lonavalamc.gov.in",
      role: "Content Admin",
      department: "IT & e-Governance",
      lastLogin: "2 hours ago",
    },
    {
      id: "usr-5",
      name: "Ms. Priyanka Rao",
      email: "intern@lonavalamc.gov.in",
      role: "Read Only",
      department: "Citizen Facilitation Centre",
      lastLogin: "3 days ago",
    },
  ];

  const permissions = [
    { module: "Dashboard KPI View", superAdmin: true, contentAdmin: true, grievanceOfficer: true, deptOfficer: true, readOnly: true },
    { module: "Manage Grievance Tickets", superAdmin: true, contentAdmin: false, grievanceOfficer: true, deptOfficer: true, readOnly: false },
    { module: "Assign Grievance Officers", superAdmin: true, contentAdmin: false, grievanceOfficer: true, deptOfficer: false, readOnly: false },
    { module: "Publish Public Notices & Gazettes", superAdmin: true, contentAdmin: true, grievanceOfficer: false, deptOfficer: false, readOnly: false },
    { module: "Edit Department Profiles", superAdmin: true, contentAdmin: true, grievanceOfficer: false, deptOfficer: false, readOnly: false },
    { module: "Modify Project Progress", superAdmin: true, contentAdmin: true, grievanceOfficer: false, deptOfficer: true, readOnly: false },
    { module: "Export Financial Analytics", superAdmin: true, contentAdmin: false, grievanceOfficer: false, deptOfficer: false, readOnly: false },
    { module: "User Role Administration", superAdmin: true, contentAdmin: false, grievanceOfficer: false, deptOfficer: false, readOnly: false },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1F2937]">Users & Role Permissions</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Role-Based Access Control (RBAC) matrix for municipal staff, engineers, and administrators.
          </p>
        </div>

        <button
          onClick={() => alert("Invite staff member modal")}
          className="px-4 py-2.5 bg-[#2E8B57] hover:bg-[#246E45] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Staff User</span>
        </button>
      </div>

      {/* Staff Directory Table */}
      <div className="bg-white rounded-2xl border border-[#D9E8DD] overflow-hidden shadow-xs">
        <div className="p-5 border-b border-[#D9E8DD] bg-[#F8FCF9] flex items-center justify-between">
          <h2 className="font-bold text-sm text-[#1F2937]">Active Staff Accounts</h2>
          <span className="text-xs font-semibold text-gray-500">{staffUsers.length} Officers</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#D9E8DD] text-[11px] font-bold text-gray-500 uppercase">
                <th className="py-3.5 px-6">Name</th>
                <th className="py-3.5 px-6">Assigned Role</th>
                <th className="py-3.5 px-6">Department</th>
                <th className="py-3.5 px-6">Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
              {staffUsers.map((u) => (
                <tr key={u.id} className="hover:bg-[#E8F5E9]/30 transition-colors">
                  <td className="py-3.5 px-6">
                    <div className="font-bold text-[#1F2937]">{u.name}</div>
                    <div className="text-[10px] text-gray-400">{u.email}</div>
                  </td>
                  <td className="py-3.5 px-6 whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#E8F5E9] text-[#2E8B57]">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-gray-600">{u.department}</td>
                  <td className="py-3.5 px-6 text-gray-400">{u.lastLogin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Prompt Requirement: Permission matrix table */}
      <div className="bg-white rounded-2xl border border-[#D9E8DD] overflow-hidden shadow-xs space-y-4">
        <div className="p-5 border-b border-[#D9E8DD] bg-[#F8FCF9] flex items-center justify-between">
          <div>
            <h2 className="font-bold text-sm text-[#1F2937]">Role-Based Permission Matrix</h2>
            <p className="text-[11px] text-gray-500">Privilege assignments across 5 administrative security tiers.</p>
          </div>
          <span className="text-xs font-bold text-[#2E8B57] bg-[#E8F5E9] px-3 py-1 rounded-full">
            Strict RBAC Enforced
          </span>
        </div>

        <div className="overflow-x-auto p-4">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#D9E8DD] text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                <th className="py-3 px-4">System Capability</th>
                <th className="py-3 px-4 text-center">Super Admin</th>
                <th className="py-3 px-4 text-center">Content Admin</th>
                <th className="py-3 px-4 text-center">Grievance Officer</th>
                <th className="py-3 px-4 text-center">Dept Officer</th>
                <th className="py-3 px-4 text-center">Read Only</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {permissions.map((perm, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-semibold text-gray-800">{perm.module}</td>
                  <td className="py-3 px-4 text-center">
                    {perm.superAdmin ? (
                      <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-gray-300 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {perm.contentAdmin ? (
                      <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-gray-300 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {perm.grievanceOfficer ? (
                      <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-gray-300 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {perm.deptOfficer ? (
                      <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-gray-300 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {perm.readOnly ? (
                      <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-gray-300 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
