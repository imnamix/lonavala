"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Save,
  ArrowLeft,
  CheckCircle2,
  Users,
  Award,
  Search,
  Check,
  X,
  AlertCircle,
  Loader2,
  ChevronDown,
  Layers,
  UserCheck,
  ShieldCheck,
} from "lucide-react";
import { StandingCommittee, CouncilMember } from "@/types";
import {
  getCommitteeById,
  createCommittee,
  updateCommittee,
} from "@/lib/services/committee.service";
import { getCouncilMembers } from "@/lib/services/council.service";

interface CommitteeFormProps {
  committeeId?: string | number;
  isNew?: boolean;
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

export function CommitteeForm({ committeeId, isNew = false }: CommitteeFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<StandingCommittee>({
    id: isNew ? 0 : committeeId || 0,
    name: "",
    marathiName: "",
    description: "",
    chairmanId: null,
    chairman: null,
    memberIds: [],
    members: [],
    isActive: true,
    displayOrder: 0,
  });

  const [displayOrderStr, setDisplayOrderStr] = useState("0");
  const [councilMembers, setCouncilMembers] = useState<CouncilMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedToast, setSavedToast] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Dropdown UI states
  const [chairmanDropdownOpen, setChairmanDropdownOpen] = useState(false);
  const [chairmanSearch, setChairmanSearch] = useState("");

  const [membersDropdownOpen, setMembersDropdownOpen] = useState(false);
  const [membersSearch, setMembersSearch] = useState("");

  const chairmanDropdownRef = useRef<HTMLDivElement>(null);
  const membersDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        chairmanDropdownRef.current &&
        !chairmanDropdownRef.current.contains(event.target as Node)
      ) {
        setChairmanDropdownOpen(false);
      }
      if (
        membersDropdownRef.current &&
        !membersDropdownRef.current.contains(event.target as Node)
      ) {
        setMembersDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch council members and existing committee data
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const membersList = await getCouncilMembers();
        setCouncilMembers(membersList);

        if (!isNew && committeeId) {
          const existing = await getCommitteeById(committeeId);
          if (existing) {
            setFormData(existing);
            setDisplayOrderStr(String(existing.displayOrder ?? 0));
          }
        }
      } catch (err) {
        console.error("Failed to load committee data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [committeeId, isNew]);

  const selectedChairman = councilMembers.find(
    (m) => Number(m.id) === Number(formData.chairmanId)
  ) || formData.chairman;

  const selectedMembers = councilMembers.filter((m) =>
    formData.memberIds.includes(Number(m.id))
  );

  const filteredChairmanOptions = councilMembers.filter((m) => {
    const q = chairmanSearch.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      (m.marathiName && m.marathiName.toLowerCase().includes(q)) ||
      (m.ward && m.ward.toLowerCase().includes(q)) ||
      (m.designation && m.designation.toLowerCase().includes(q))
    );
  });

  const filteredMemberOptions = councilMembers.filter((m) => {
    const q = membersSearch.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      (m.marathiName && m.marathiName.toLowerCase().includes(q)) ||
      (m.ward && m.ward.toLowerCase().includes(q)) ||
      (m.designation && m.designation.toLowerCase().includes(q))
    );
  });

  const handleSelectChairman = (member: CouncilMember | null) => {
    const newChairmanId = member ? Number(member.id) : null;
    setFormData((prev) => ({
      ...prev,
      chairmanId: newChairmanId,
      chairman: member,
      // If selected chairman was previously in memberIds, remove them from memberIds
      memberIds: newChairmanId
        ? prev.memberIds.filter((id) => id !== newChairmanId)
        : prev.memberIds,
    }));
    setChairmanDropdownOpen(false);
    setChairmanSearch("");
  };

  const handleToggleMember = (memberId: number) => {
    // If this member is currently the Chairman, do not allow toggling as regular member
    if (Number(formData.chairmanId) === Number(memberId)) {
      return;
    }

    setFormData((prev) => {
      const exists = prev.memberIds.includes(memberId);
      const newMemberIds = exists
        ? prev.memberIds.filter((id) => id !== memberId)
        : [...prev.memberIds, memberId];
      return {
        ...prev,
        memberIds: newMemberIds,
      };
    });
  };

  const handleSelectAllMembers = () => {
    const chairmanIdNum = formData.chairmanId ? Number(formData.chairmanId) : null;
    const selectableIds = councilMembers
      .map((m) => Number(m.id))
      .filter((id) => id !== chairmanIdNum);
    setFormData((prev) => ({ ...prev, memberIds: selectableIds }));
  };

  const handleClearAllMembers = () => {
    setFormData((prev) => ({ ...prev, memberIds: [] }));
  };

  const validate = () => {
    const err: Record<string, string> = {};
    if (!formData.name.trim()) {
      err.name = "Committee name is required";
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const parsedDisplayOrder = displayOrderStr.trim() === "" ? 0 : Number(displayOrderStr) || 0;

      const payload = {
        name: formData.name.trim(),
        marathiName: formData.marathiName?.trim() || "",
        description: formData.description?.trim() || "",
        chairmanId: formData.chairmanId ? Number(formData.chairmanId) : null,
        memberIds: formData.memberIds.map(Number),
        isActive: formData.isActive !== false,
        displayOrder: parsedDisplayOrder,
      };

      if (isNew) {
        const res = await createCommittee(payload);
        if (res.data) {
          setSavedToast(true);
          setTimeout(() => {
            router.push("/admin/committees");
          }, 1200);
        }
      } else if (committeeId) {
        const res = await updateCommittee(committeeId, payload);
        if (res.data) {
          setSavedToast(true);
          setTimeout(() => {
            router.push("/admin/committees");
          }, 1200);
        }
      }
    } catch (err) {
      console.error("Failed to save committee:", err);
      alert("Error saving committee. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm font-medium text-text-muted">Loading committee details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Toast */}
      {savedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-surface-dark text-white text-xs font-semibold px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-2.5 border border-white/10 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>Committee successfully {isNew ? "created" : "updated"}!</span>
        </div>
      )}

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-border shadow-xs">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/committees"
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                Standing Committees Module
              </span>
              <span className="text-xs text-text-muted">•</span>
              <span className="text-xs font-semibold text-text-muted">
                {isNew ? "New Committee" : `Editing ID #${committeeId}`}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-text-primary mt-0.5">
              {isNew ? "Create Standing Committee" : formData.name || "Edit Committee"}
            </h1>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-md shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saving ? "Saving..." : isNew ? "Create Committee" : "Save Changes"}</span>
          </button>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card 1: Basic Information */}
        <div className="bg-white rounded-2xl border border-border p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <Layers className="w-4 h-4 text-primary" />
            <h2 className="text-base font-bold text-text-primary">
              Committee Identity & Details
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Committee Name (English) */}
            <div>
              <label className="block text-xs font-bold text-text-primary mb-1.5">
                Committee Name (English) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: "" });
                }}
                placeholder="e.g. Standing Committee, Public Works Committee"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                  errors.name
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-200 focus:border-primary focus:ring-primary/20"
                }`}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Committee Name (Marathi) */}
            <div>
              <label className="block text-xs font-bold text-text-primary mb-1.5">
                Committee Name (Marathi / मराठी नाव)
              </label>
              <input
                type="text"
                value={formData.marathiName || ""}
                onChange={(e) =>
                  setFormData({ ...formData, marathiName: e.target.value })
                }
                placeholder="e.g. स्थायी समिती, सार्वजनिक बांधकाम समिती"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-text-primary mb-1.5">
              Committee Mandate & Description
            </label>
            <textarea
              rows={3}
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe statutory duties, powers, budget sanction authorizations, and civic portfolio responsibilities..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Card 2: Chairman / Chairperson Selection (Single Select Dropdown) */}
        <div className="bg-white rounded-2xl border border-border p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" />
              <h2 className="text-base font-bold text-text-primary">
                Committee Chairman / Chairperson (सभापती)
              </h2>
            </div>
            <span className="text-xs font-semibold text-text-muted">
              Single Council Member Selection
            </span>
          </div>

          <div className="relative" ref={chairmanDropdownRef}>
            <label className="block text-xs font-bold text-text-primary mb-1.5">
              Select Chairman from Council Members
            </label>

            {/* Trigger Button */}
            <button
              type="button"
              onClick={() => setChairmanDropdownOpen(!chairmanDropdownOpen)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white hover:border-emerald-500 text-left flex items-center justify-between shadow-2xs transition-all"
            >
              {selectedChairman ? (
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-9 h-9 rounded-full overflow-hidden bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-300">
                    {selectedChairman.image ? (
                      <Image
                        src={selectedChairman.image}
                        alt={selectedChairman.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      getInitials(selectedChairman.name)
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-slate-900 truncate">
                      {selectedChairman.name}
                    </div>
                    <div className="text-xs text-emerald-700 font-medium truncate">
                      {selectedChairman.designation || "Council Member"}{" "}
                      {selectedChairman.ward ? `• ${selectedChairman.ward}` : ""}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-400 flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span>-- Select Council Member as Chairman --</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                {selectedChairman && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectChairman(null);
                    }}
                    className="p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Clear Chairman"
                  >
                    <X className="w-4 h-4" />
                  </span>
                )}
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </button>

            {/* Dropdown Menu */}
            {chairmanDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-200 shadow-2xl z-30 overflow-hidden animate-in fade-in duration-150">
                {/* Search bar inside dropdown */}
                <div className="p-3 border-b border-gray-100 bg-slate-50 flex items-center gap-2">
                  <Search className="w-4 h-4 text-gray-400 shrink-0" />
                  <input
                    type="text"
                    value={chairmanSearch}
                    onChange={(e) => setChairmanSearch(e.target.value)}
                    placeholder="Search member by name, ward, or designation..."
                    className="w-full bg-transparent text-xs text-slate-800 placeholder-gray-400 focus:outline-none"
                    autoFocus
                  />
                  {chairmanSearch && (
                    <button
                      type="button"
                      onClick={() => setChairmanSearch("")}
                      className="text-gray-400 hover:text-gray-600 text-xs"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* List of members */}
                <div className="max-h-60 overflow-y-auto divide-y divide-gray-50 p-1">
                  {/* None option */}
                  <button
                    type="button"
                    onClick={() => handleSelectChairman(null)}
                    className={`w-full px-3 py-2.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between hover:bg-gray-100 transition-colors ${
                      !formData.chairmanId ? "bg-emerald-50 text-emerald-900" : "text-gray-600"
                    }`}
                  >
                    <span>-- None (Vacant / Not Appointed) --</span>
                    {!formData.chairmanId && <Check className="w-4 h-4 text-emerald-600" />}
                  </button>

                  {filteredChairmanOptions.map((member) => {
                    const isSelected = Number(member.id) === Number(formData.chairmanId);
                    return (
                      <button
                        key={member.id}
                        type="button"
                        onClick={() => handleSelectChairman(member)}
                        className={`w-full px-3 py-2.5 rounded-xl text-left flex items-center justify-between hover:bg-slate-50 transition-colors ${
                          isSelected ? "bg-emerald-50 text-emerald-900" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-slate-100 text-slate-700 font-bold text-[11px] flex items-center justify-center shrink-0 border border-slate-200">
                            {member.image ? (
                              <Image
                                src={member.image}
                                alt={member.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              getInitials(member.name)
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-900 truncate">
                              {member.name}
                            </div>
                            <div className="text-[11px] text-slate-500 truncate">
                              {member.designation} {member.ward ? `• ${member.ward}` : ""}
                            </div>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                      </button>
                    );
                  })}

                  {filteredChairmanOptions.length === 0 && (
                    <div className="p-4 text-center text-xs text-gray-500">
                      No matching council members found.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Card 3: Committee Members (Multi-Select Dropdown) */}
        <div className="bg-white rounded-2xl border border-border p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <h2 className="text-base font-bold text-text-primary">
                Committee Members (समिती सदस्य)
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                {formData.memberIds.length} Selected
              </span>
              <button
                type="button"
                onClick={handleSelectAllMembers}
                className="text-xs font-bold text-primary hover:underline"
              >
                Select All
              </button>
              <span className="text-gray-300">•</span>
              <button
                type="button"
                onClick={handleClearAllMembers}
                className="text-xs font-bold text-red-600 hover:underline"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Selected Members Badges Preview */}
          {selectedMembers.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-text-muted">
                Assigned Members ({selectedMembers.length}):
              </label>
              <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                {selectedMembers.map((member) => (
                  <div
                    key={member.id}
                    className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 shadow-2xs group"
                  >
                    <div className="relative w-5 h-5 rounded-full overflow-hidden bg-slate-100 text-[10px] font-bold text-slate-700 flex items-center justify-center shrink-0">
                      {member.image ? (
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        getInitials(member.name)
                      )}
                    </div>
                    <span className="font-semibold">{member.name}</span>
                    <button
                      type="button"
                      onClick={() => handleToggleMember(Number(member.id))}
                      className="text-gray-400 hover:text-red-500 rounded-full transition-colors ml-0.5"
                      title="Remove member"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Multi-Select Dropdown Picker */}
          <div className="relative" ref={membersDropdownRef}>
            <label className="block text-xs font-bold text-text-primary mb-1.5">
              Add / Select Council Members (Multi-Select)
            </label>

            {/* Trigger Button */}
            <button
              type="button"
              onClick={() => setMembersDropdownOpen(!membersDropdownOpen)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white hover:border-primary text-left flex items-center justify-between shadow-2xs transition-all"
            >
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <UserCheck className="w-4 h-4 text-primary shrink-0" />
                <span className="font-medium">
                  {formData.memberIds.length === 0
                    ? "-- Click to choose committee members --"
                    : `${formData.memberIds.length} Council Member${
                        formData.memberIds.length === 1 ? "" : "s"
                      } Selected`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-text-muted bg-gray-100 px-2.5 py-1 rounded-md">
                  {formData.memberIds.length} / {formData.chairmanId ? councilMembers.length - 1 : councilMembers.length}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </button>

            {/* Multi-Select Dropdown Menu */}
            {membersDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-200 shadow-2xl z-30 overflow-hidden animate-in fade-in duration-150">
                {/* Search inside multi-select */}
                <div className="p-3 border-b border-gray-100 bg-slate-50 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-1">
                    <Search className="w-4 h-4 text-gray-400 shrink-0" />
                    <input
                      type="text"
                      value={membersSearch}
                      onChange={(e) => setMembersSearch(e.target.value)}
                      placeholder="Search members to select..."
                      className="w-full bg-transparent text-xs text-slate-800 placeholder-gray-400 focus:outline-none"
                      autoFocus
                    />
                  </div>
                  {membersSearch && (
                    <button
                      type="button"
                      onClick={() => setMembersSearch("")}
                      className="text-gray-400 hover:text-gray-600 text-xs"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Multi-select Member items with checkboxes */}
                <div className="max-h-72 overflow-y-auto divide-y divide-gray-50 p-1">
                  {filteredMemberOptions.map((member) => {
                    const isChairman = Number(member.id) === Number(formData.chairmanId);
                    const isSelected = formData.memberIds.includes(Number(member.id));

                    return (
                      <div
                        key={member.id}
                        onClick={() => {
                          if (!isChairman) {
                            handleToggleMember(Number(member.id));
                          }
                        }}
                        className={`w-full px-3 py-2.5 rounded-xl flex items-center justify-between transition-colors ${
                          isChairman
                            ? "bg-slate-100/70 text-slate-400 cursor-not-allowed opacity-60"
                            : isSelected
                            ? "bg-primary/5 text-primary cursor-pointer hover:bg-primary/10"
                            : "cursor-pointer hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Checkbox */}
                          <input
                            type="checkbox"
                            checked={isSelected}
                            disabled={isChairman}
                            onChange={() => {}} // Handled by parent div
                            className={`w-4 h-4 rounded text-primary focus:ring-primary/20 ${
                              isChairman ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                            }`}
                          />
                          {/* Avatar */}
                          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-slate-100 text-slate-700 font-bold text-[11px] flex items-center justify-center shrink-0 border border-slate-200">
                            {member.image ? (
                              <Image
                                src={member.image}
                                alt={member.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              getInitials(member.name)
                            )}
                          </div>
                          {/* Member info */}
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-900 truncate">
                              {member.name}
                            </div>
                            <div className="text-[11px] text-slate-500 truncate">
                              {member.designation} {member.ward ? `• ${member.ward}` : ""}
                            </div>
                          </div>
                        </div>

                        {/* Status badge */}
                        {isChairman ? (
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md shrink-0 border border-amber-200">
                            Chairman (Already Selected)
                          </span>
                        ) : isSelected ? (
                          <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md shrink-0">
                            Selected
                          </span>
                        ) : null}
                      </div>
                    );
                  })}

                  {filteredMemberOptions.length === 0 && (
                    <div className="p-4 text-center text-xs text-gray-500">
                      No matching council members found.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Card 4: Settings & Visibility */}
        <div className="bg-white rounded-2xl border border-border p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <h2 className="text-base font-bold text-text-primary">
              Display & Publication Settings
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Display Order */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-text-primary">
                Display Sort Order
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={displayOrderStr}
                onChange={(e) => {
                  const val = e.target.value;
                  setDisplayOrderStr(val);
                  setFormData((prev) => ({
                    ...prev,
                    displayOrder: val === "" ? 0 : Number(val) || 0,
                  }));
                }}
                placeholder="0"
                className="w-full h-[42px] px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white"
              />
              <p className="text-[11px] text-text-muted">
                Lower numbers (e.g. 1, 2, 3) will be displayed first on the website.
              </p>
            </div>

            {/* Active / Visibility Toggle Card */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-text-primary">
                Public Portal Visibility
              </label>
              <div className="w-full h-[42px] px-3.5 py-2 rounded-xl border border-gray-200 bg-white flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      formData.isActive !== false ? "bg-emerald-500" : "bg-gray-400"
                    }`}
                  />
                  <span className="text-xs font-bold text-slate-800 truncate">
                    {formData.isActive !== false ? "Active & Published" : "Draft / Inactive"}
                  </span>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive !== false}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
              <p className="text-[11px] text-text-muted">
                {formData.isActive !== false
                  ? "Committee is visible to citizens on the public portal."
                  : "Committee is hidden from citizen view."}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Action Footer */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/admin/committees"
            className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-md shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saving ? "Saving..." : isNew ? "Create Standing Committee" : "Save Changes"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
