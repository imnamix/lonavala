"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Landmark,
  Plus,
  Trash2,
  Edit2,
  Eye,
  Search,
  Phone,
  Mail,
  Users,
  Award,
  MapPin,
  CheckCircle2,
  X,
  ExternalLink,
} from "lucide-react";
import { CouncilMember } from "@/types";
import {
  getCouncilMembers,
  deleteCouncilMemberById,
  toggleCouncilMemberActive,
} from "@/data/councilData";

export function CouncilTable() {
  const router = useRouter();
  const [members, setMembers] = useState<CouncilMember[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [wardFilter, setWardFilter] = useState<string>("ALL");
  const [selectedMember, setSelectedMember] = useState<CouncilMember | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setMembers(getCouncilMembers());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleToggleActive = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = toggleCouncilMemberActive(id);
    setMembers(updated);
    showToast("Status updated successfully.");
  };

  const handleDelete = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to remove ${name} from the Council directory?`)) {
      const updated = deleteCouncilMemberById(id);
      setMembers(updated);
      showToast(`Removed ${name} from directory.`);
      if (selectedMember?.id === id) {
        setSelectedMember(null);
      }
    }
  };

  // Filtered members list based on search and ward
  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      searchQuery === "" ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.marathiName && m.marathiName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      m.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.ward && m.ward.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (m.committee && m.committee.toLowerCase().includes(searchQuery.toLowerCase())) ||
      m.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesWard =
      wardFilter === "ALL" ||
      (m.ward && m.ward.toLowerCase().includes(wardFilter.toLowerCase()));

    return matchesSearch && matchesWard;
  });

  return (
    <div className="space-y-6">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-surface-dark text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-white/10 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Table Card */}
      <div className="bg-white p-5 sm:p-7 rounded-3xl border border-border shadow-xs space-y-5">
        {/* Header & Controls: Search, Ward Filter & Add Member */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center font-bold shrink-0">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-text-primary">Councils</h2>
              <p className="text-xs text-gray-500">
                {members.length} members configured. Click any row or edit button to manage.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, ward, phone..."
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

            {/* Ward Filter */}
            <select
              value={wardFilter}
              onChange={(e) => setWardFilter(e.target.value)}
              className="px-3 py-2 bg-primary-surface border border-border rounded-xl text-xs text-gray-700 font-semibold focus:bg-white focus:border-primary focus:outline-hidden"
            >
              <option value="ALL">All Wards (1 to 5)</option>
              <option value="Ward 1">Ward 1 - Bangarwadi</option>
              <option value="Ward 2">Ward 2 - Ryewood</option>
              <option value="Ward 3">Ward 3 - Khandala</option>
              <option value="Ward 4">Ward 4 - Valvan</option>
              <option value="Ward 5">Ward 5 - Tungarli</option>
            </select>

            {(searchQuery || wardFilter !== "ALL") && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setWardFilter("ALL");
                }}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:text-gray-800 hover:bg-gray-100 flex items-center gap-1.5 transition-colors"
                title="Clear filters"
              >
                <X className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}

            <Link
              href="/admin/council/new"
              className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Council</span>
            </Link>
          </div>
        </div>

        {/* Council Table */}
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-primary-surface border-b border-border text-gray-700 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-4"># / Official</th>
                <th className="py-3.5 px-4">Designation & Role</th>
                <th className="py-3.5 px-4">Ward Demarcation</th>
                <th className="py-3.5 px-3 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400">
                    <Users className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                    <p className="font-semibold text-gray-600">No council members match your filter.</p>
                    <p className="text-[11px] text-gray-400 mt-1">Try resetting your search query or filters.</p>
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member, index) => {
                  const isActive = member.active !== false;
                  return (
                    <tr
                      key={member.id}
                      onClick={() => router.push(`/admin/council/${member.id}`)}
                      className="hover:bg-primary-light/40 transition-colors cursor-pointer group"
                    >
                      {/* Photo + Name */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <span className="w-5 h-5 rounded-full bg-white border border-gray-200 text-gray-600 flex items-center justify-center text-[10px] font-bold shrink-0">
                            {index + 1}
                          </span>
                          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-primary-light border-2 border-border shrink-0 group-hover:border-primary transition-all">
                            {member.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={member.image}
                                alt={member.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-primary font-bold text-xs">
                                {member.name.slice(0, 2).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-text-primary text-xs leading-tight group-hover:text-primary transition-colors">
                              {member.name}
                            </div>
                            <div className="text-[11px] text-primary font-semibold mt-0.5">
                              {member.marathiName}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Designation */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary-light text-primary font-bold text-[11px] border border-emerald-200">
                          <Award className="w-3 h-3 text-primary" />
                          <span>{member.designation}</span>
                        </span>
                      </td>

                      {/* Ward */}
                      <td className="py-3.5 px-4">
                        {member.ward ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[11px] font-medium">
                            <MapPin className="w-3 h-3 text-gray-500" />
                            <span>{member.ward}</span>
                          </span>
                        ) : (
                          <span className="text-gray-400 italic text-[11px]">Council At-Large</span>
                        )}
                      </td>

                      {/* Status Toggle */}
                      <td className="py-3.5 px-3 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={(e) => handleToggleActive(member.id, e)}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
                            isActive
                              ? "bg-primary text-white hover:bg-primary-hover"
                              : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                          }`}
                          title="Click to toggle member active status on public portal"
                        >
                          {isActive ? "● Active" : "○ Inactive"}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div
                          className="flex items-center justify-center gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => setSelectedMember(member)}
                            className="p-1.5 rounded-lg bg-white border border-gray-200 hover:border-primary hover:bg-primary-light text-gray-600 hover:text-primary transition-colors"
                            title="Quick View Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <Link
                            href={`/admin/council/${member.id}`}
                            className="px-2.5 py-1.5 rounded-lg bg-white border border-gray-200 hover:border-primary hover:bg-primary-light text-gray-700 hover:text-primary text-xs font-semibold flex items-center gap-1 transition-colors"
                            title="Edit member profile"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span className="text-[10px]">Edit</span>
                          </Link>

                          <button
                            type="button"
                            onClick={(e) => handleDelete(member.id, member.name, e)}
                            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 border border-red-200 transition-colors cursor-pointer"
                            title="Delete council member"
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

      {/* Quick View Profile Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-border shadow-2xl overflow-hidden animate-scale-up">
            <div className="bg-primary-light p-6 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Landmark className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-sm text-text-primary">Council Member Profile Card</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Member Card */}
              <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start text-center sm:text-left">
                <div className="relative w-28 h-36 rounded-2xl overflow-hidden shadow-md shrink-0 border-2 border-primary-light">
                  {selectedMember.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={selectedMember.image}
                      alt={selectedMember.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary-light text-primary flex items-center justify-center font-bold text-xl">
                      {selectedMember.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="space-y-2 flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-primary-light text-primary px-2.5 py-1 rounded-full inline-block">
                    {selectedMember.designation}
                  </span>
                  <h4 className="text-lg font-bold text-text-primary">{selectedMember.name}</h4>
                  <p className="text-xs text-primary font-semibold">{selectedMember.marathiName}</p>
                  
                  {selectedMember.ward && (
                    <p className="text-xs text-gray-600 flex items-center justify-center sm:justify-start gap-1">
                      <MapPin className="w-3 h-3 text-primary" />
                      <span>{selectedMember.ward}</span>
                    </p>
                  )}

                  {selectedMember.committee && (
                    <p className="text-xs text-gray-600 flex items-center justify-center sm:justify-start gap-1">
                      <Award className="w-3 h-3 text-amber-500" />
                      <span>{selectedMember.committee}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Message / Bio Quote */}
              {selectedMember.message && (
                <div className="p-3.5 rounded-2xl bg-primary-surface border border-border text-xs text-gray-700 italic">
                  &ldquo;{selectedMember.message}&rdquo;
                </div>
              )}

              {/* Contact Info Table */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Phone</span>
                  <span className="font-semibold text-gray-800">{selectedMember.phone || "N/A"}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Email</span>
                  <span className="font-semibold text-gray-800 truncate block">{selectedMember.email || "N/A"}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Tenure</span>
                  <span className="font-semibold text-gray-800">{selectedMember.tenure || "2022 - 2027"}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Portal Status</span>
                  <span className={`font-bold ${selectedMember.active !== false ? "text-emerald-600" : "text-gray-400"}`}>
                    {selectedMember.active !== false ? "Active & Published" : "Hidden"}
                  </span>
                </div>
                {selectedMember.address && (
                  <div className="col-span-2 pt-2 border-t border-gray-200/60">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Chamber / Office Address</span>
                    <span className="font-medium text-gray-700">{selectedMember.address}</span>
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setSelectedMember(null)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold"
                >
                  Close
                </button>
                <Link
                  href={`/admin/council/${selectedMember.id}`}
                  className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Full Profile</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
