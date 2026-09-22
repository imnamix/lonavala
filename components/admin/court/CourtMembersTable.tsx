"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Users,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  X,
  MapPin,
} from "lucide-react";
import { CourtCommitteeMember } from "@/types";
import { getAllMembers, deleteMember } from "@/lib/services/court.service";

function getInitials(name: string) {
  const cleaned = name
    .replace(/^(Adv\.|Shri\.|Smt\.|Dr\.)\s+/i, "")
    .replace(/\(.*?\)/g, "")
    .trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "LM";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function CourtMembersTable() {
  const router = useRouter();
  const [members, setMembers] = useState<CourtCommitteeMember[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [selectedMember, setSelectedMember] = useState<CourtCommitteeMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const data = await getAllMembers();
      setMembers(data);
    } catch (err) {
      console.error("Failed to load court members:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const showToast = (text: string) => {
    setToastMessage(text);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove member "${name}"?`)) {
      await deleteMember(id);
      await fetchMembers();
      if (selectedMember?.id === id) setSelectedMember(null);
      showToast(`Member "${name}" removed successfully.`);
    }
  };

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.marathiName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.ward && m.ward.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (m.email && m.email.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCat = categoryFilter === "ALL" || m.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-primary text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Standard Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-border shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-text-primary">Committee Members Directory</h1>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-primary-light text-primary">
              {members.length} Members
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage Hon. Court & Legal Affairs Standing Committee chairpersons, corporators, and appointed municipal advocates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/court/members/new"
            className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Member</span>
          </Link>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-border shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, role, ward, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-gray-50/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-gray-500 font-bold px-1">Category:</span>
          {[
            { id: "ALL", label: "All" },
            { id: "Leadership", label: "Leadership" },
            { id: "Committee Member", label: "Committee Members" },
            { id: "Legal Officer", label: "Legal Officers" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                categoryFilter === cat.id
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-3xl border border-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/75 border-b border-border text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Profile & Name</th>
                <th className="py-3.5 px-4">Designation & Role</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Contact Details</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400">
                    <Users className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                    <p className="font-bold text-gray-600 text-sm">No members found</p>
                    <p className="text-xs mt-1">Try adjusting your search query or category filter.</p>
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => {
                  const initials = getInitials(member.name);
                  const isLeader =
                    member.category === "Leadership" ||
                    member.role.toLowerCase().includes("chair");

                  return (
                    <tr
                      key={member.id}
                      className="hover:bg-gray-50/80 transition-colors group"
                    >
                      {/* Profile & Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {member.image ? (
                            <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-gray-200 shadow-xs relative">
                              <img
                                src={member.image}
                                alt={member.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-xs ${
                                isLeader
                                  ? "bg-primary text-white"
                                  : "bg-gray-100 text-gray-700 border border-gray-200"
                              }`}
                            >
                              {initials}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-text-primary group-hover:text-primary transition-colors text-sm">
                              {member.name}
                            </div>
                            <div className="text-xs text-gray-500 font-medium font-marathi">
                              {member.marathiName}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Designation & Role */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-medium text-gray-800 leading-relaxed">
                          {member.designation}
                        </div>
                        <div className="mt-1">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                              isLeader
                                ? "bg-amber-100 text-amber-900 border border-amber-200"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {member.role}
                          </span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            member.category === "Leadership"
                              ? "bg-emerald-100 text-emerald-800"
                              : member.category === "Legal Officer"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {member.category || "Committee Member"}
                        </span>
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-4 text-gray-600">
                        <div className="space-y-1">
                          {member.phone && (
                            <div className="flex items-center gap-1.5 text-gray-800 font-medium">
                              <Phone className="w-3 h-3 text-primary shrink-0" />
                              <span>{member.phone}</span>
                            </div>
                          )}
                          {member.email && (
                            <div className="flex items-center gap-1.5 text-gray-500 truncate max-w-[180px]">
                              <Mail className="w-3 h-3 text-gray-400 shrink-0" />
                              <span className="truncate">{member.email}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => setSelectedMember(member)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-primary hover:bg-primary-light transition-colors"
                            title="View Full Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <Link
                            href={`/admin/court/members/${member.id}/edit`}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                            title="Edit Member Profile"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(member.id, member.name)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                            title="Delete Member"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* Member Details Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-border p-6 space-y-6">
            <div className="flex items-start justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-4">
                {selectedMember.image ? (
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border border-gray-200 shrink-0">
                    <img
                      src={selectedMember.image}
                      alt={selectedMember.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-primary text-white font-bold text-xl flex items-center justify-center shadow-xs">
                    {getInitials(selectedMember.name)}
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-text-primary">{selectedMember.name}</h3>
                  <p className="text-primary font-bold font-marathi">{selectedMember.marathiName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-primary-light text-primary">
                      {selectedMember.role}
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                      {selectedMember.category}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedMember(null)}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                <span className="font-bold text-gray-500 uppercase">Designation</span>
                <p className="font-bold text-gray-900 text-sm">{selectedMember.designation}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                <span className="font-bold text-gray-500 uppercase">Ward / Jurisdiction</span>
                <p className="font-bold text-gray-900 text-sm">{selectedMember.ward || "Council Jurisdiction"}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                <span className="font-bold text-gray-500 uppercase">Phone</span>
                <p className="font-bold text-gray-900 text-sm">{selectedMember.phone || "—"}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                <span className="font-bold text-gray-500 uppercase">Email Address</span>
                <p className="font-bold text-gray-900 text-sm">{selectedMember.email || "—"}</p>
              </div>
            </div>

            {selectedMember.experience && (
              <div className="p-4 rounded-2xl bg-primary-light/40 border border-primary/20">
                <h4 className="text-xs font-bold text-primary uppercase mb-1">Experience & Background</h4>
                <p className="text-xs text-gray-900 font-medium">{selectedMember.experience}</p>
              </div>
            )}

            {selectedMember.responsibilities && selectedMember.responsibilities.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider">Key Responsibilities</h4>
                <ul className="space-y-2">
                  {selectedMember.responsibilities.map((resp, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                      <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <Link
                href={`/admin/court/members/${selectedMember.id}/edit`}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-primary text-white hover:bg-primary-hover transition-colors"
              >
                Edit Member
              </Link>
              <button
                onClick={() => setSelectedMember(null)}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
