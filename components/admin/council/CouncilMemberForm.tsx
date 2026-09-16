"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Save,
  ArrowLeft,
  CheckCircle2,
  Landmark,
  Award,
  MapPin,
  Phone,
  Mail,
  AlertCircle,
  Eye,
  Info,
  Upload,
  Camera,
  Trash2,
  Home,
} from "lucide-react";
import { CouncilMember } from "@/types";
import {
  getCouncilMemberById,
  saveOrUpdateCouncilMember,
  INITIAL_COUNCIL_MEMBERS,
} from "@/data/councilData";

const COMMON_WARDS = [
  "Ward 1 - Bangarwadi & Railway Station",
  "Ward 2 - Ryewood & Main Bazaar",
  "Ward 3 - Khandala Ridge & Nagpal Estate",
  "Ward 4 - Valvan & Varsoli Road",
  "Ward 5 - Tungarli & Gold Valley",
  "Municipal At-Large (Entire City)",
];

const COMMON_COMMITTEES = [
  "Standing Committee Chairperson",
  "Public Works Committee (सार्वजनिक बांधकाम समिती)",
  "Sanitation & Water Works (स्वच्छता व पाणीपुरवठा समिती)",
  "Women & Child Welfare (महिला व बालकल्याण समिती)",
  "Education & Health Committee (शिक्षण व आरोग्य समिती)",
  "Town Planning Committee (नगर रचना समिती)",
  "Law & Disaster Management (कायदा व आपत्ती व्यवस्थापन)",
  "General Body Member (सर्वसाधारण सभा सदस्य)",
];

interface CouncilMemberFormProps {
  memberId?: string;
  isNew?: boolean;
}

export function CouncilMemberForm({ memberId, isNew = false }: CouncilMemberFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<CouncilMember>({
    id: isNew ? `cm-${Date.now()}` : "",
    name: "",
    marathiName: "",
    designation: "",
    ward: "",
    phone: "",
    email: "",
    address: "",
    image: "",
    tenure: "2022 - 2027",
    committee: "",
    message: "",
    active: true,
    roleCategory: "Corporator",
  });

  const [savedToast, setSavedToast] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<"form" | "preview">("form");

  useEffect(() => {
    if (!isNew && memberId) {
      const existing = getCouncilMemberById(memberId);
      if (existing) {
        setFormData(existing);
      } else {
        const fallback = INITIAL_COUNCIL_MEMBERS.find((m) => m.id === memberId);
        if (fallback) {
          setFormData(fallback);
        }
      }
    }
  }, [memberId, isNew]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      if (uploadEvent.target?.result) {
        setFormData((prev) => ({
          ...prev,
          image: uploadEvent.target!.result as string,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setFormData((prev) => ({ ...prev, image: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Full name (English) is required.";
    if (!formData.marathiName.trim()) newErrors.marathiName = "Full name (Marathi) is required.";
    if (!formData.designation.trim()) newErrors.designation = "Designation is required.";
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

    const memberToSave: CouncilMember = {
      ...formData,
      id: formData.id || `cm-${Date.now()}`,
      active: formData.active !== false,
    };

    saveOrUpdateCouncilMember(memberToSave);
    setSavedToast(true);

    setTimeout(() => {
      router.push("/admin/council");
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Toast */}
      {savedToast && (
        <div className="fixed top-6 right-6 z-50 bg-[#2E8B57] text-white text-xs font-bold px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span>Council member successfully saved! Redirecting to table...</span>
        </div>
      )}

      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D9E8DD] pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/council"
            className="p-2 rounded-xl bg-white border border-gray-200 hover:border-[#2E8B57] text-gray-600 hover:text-[#2E8B57] transition-colors"
            title="Back to Councils list"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#1F2937]">
              {isNew ? "Add New Council Member" : `Edit Council Member: ${formData.name || "Loading..."}`}
            </h1>
            <p className="text-xs text-gray-500">
              {isNew
                ? "Register an elected corporator, president, or municipal authority to the directory."
                : "Update official designations, photo, committees, and citizen contact information."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Mobile Tab Switcher */}
          <div className="flex lg:hidden bg-gray-100 p-1 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab("form")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === "form" ? "bg-white text-[#2E8B57] shadow-xs" : "text-gray-500"
              }`}
            >
              Form
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === "preview" ? "bg-white text-[#2E8B57] shadow-xs" : "text-gray-500"
              }`}
            >
              Preview
            </button>
          </div>

          <Link
            href="/admin/council"
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
            <span>Save Member</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Form Left + Live Preview Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Edit Form */}
        <div
          className={`lg:col-span-7 space-y-6 ${
            activeTab === "preview" ? "hidden lg:block" : "block"
          }`}
        >
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

            {/* Section 1: Official Identity & Role (with Profile Image Upload) */}
            <div className="bg-white p-6 rounded-3xl border border-[#D9E8DD] shadow-xs space-y-5">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <Landmark className="w-4 h-4 text-[#2E8B57]" />
                <h3 className="font-bold text-sm text-[#1F2937]">Official Identity & Role</h3>
              </div>

              {/* Profile Image Upload Field */}
              <div className="p-4 rounded-2xl bg-[#F8FCF9] border border-[#D9E8DD] flex flex-col sm:flex-row items-center gap-4">
                {/* Photo Preview */}
                <div className="relative w-20 h-24 rounded-2xl overflow-hidden bg-white border-2 border-[#D9E8DD] flex items-center justify-center shrink-0 shadow-2xs group">
                  {formData.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={formData.image}
                      alt={formData.name || "Preview"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-2">
                      <Camera className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                      <span className="text-[9px] font-bold text-gray-400 uppercase">No Photo</span>
                    </div>
                  )}
                </div>

                {/* Upload Controls */}
                <div className="space-y-1.5 flex-1 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3.5 py-1.5 rounded-xl bg-[#2E8B57] hover:bg-[#246E45] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{formData.image ? "Change Photo" : "Upload Profile Image"}</span>
                    </button>

                    {formData.image && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="px-3 py-1.5 rounded-xl bg-white border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        title="Remove uploaded photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <p className="text-[11px] text-gray-500">
                    Upload official portrait / headshot. Formats: JPG, PNG, WEBP.
                  </p>
                </div>
              </div>

              {/* Identity Form Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name (English) */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
                    <span>Full Name (English) *</span>
                    {errors.name && <span className="text-red-500 font-normal text-[10px]">{errors.name}</span>}
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Smt. Surekha Nitin Jadhav"
                    className={`w-full px-3.5 py-2.5 bg-[#F8FCF9] border rounded-xl text-xs font-semibold text-gray-800 focus:bg-white focus:outline-hidden transition-all ${
                      errors.name ? "border-red-400 focus:border-red-500" : "border-[#D9E8DD] focus:border-[#2E8B57]"
                    }`}
                  />
                </div>

                {/* Full Name (Marathi) */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
                    <span>Full Name (Marathi देवनागरी) *</span>
                    {errors.marathiName && <span className="text-red-500 font-normal text-[10px]">{errors.marathiName}</span>}
                  </label>
                  <input
                    type="text"
                    value={formData.marathiName}
                    onChange={(e) => setFormData({ ...formData, marathiName: e.target.value })}
                    placeholder="e.g. श्रीमती सुरेखा नितीन जाधव"
                    className={`w-full px-3.5 py-2.5 bg-[#F8FCF9] border rounded-xl text-xs font-semibold text-gray-800 focus:bg-white focus:outline-hidden transition-all ${
                      errors.marathiName ? "border-red-400 focus:border-red-500" : "border-[#D9E8DD] focus:border-[#2E8B57]"
                    }`}
                  />
                </div>

                {/* Role Category */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Governance Role Category</label>
                  <select
                    value={formData.roleCategory || "Corporator"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        roleCategory: e.target.value as any,
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#F8FCF9] border border-[#D9E8DD] rounded-xl text-xs font-semibold text-gray-800 focus:bg-white focus:border-[#2E8B57] focus:outline-hidden"
                  >
                    <option value="President">Council President (नगराध्यक्ष)</option>
                    <option value="Vice President">Council Vice President (उपनगराध्यक्ष)</option>
                    <option value="Corporator">Ward Corporator (नगरसेवक)</option>
                    <option value="Officer">Chief Officer / Commissioner (मुख्याधिकारी)</option>
                    <option value="Nominated">Nominated Council Member</option>
                  </select>
                </div>

                {/* Designation */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
                    <span>Designation Title *</span>
                    {errors.designation && <span className="text-red-500 font-normal text-[10px]">{errors.designation}</span>}
                  </label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    placeholder="e.g. President (नगराध्यक्ष) or Corporator - Ward 1"
                    className={`w-full px-3.5 py-2.5 bg-[#F8FCF9] border rounded-xl text-xs font-semibold text-gray-800 focus:bg-white focus:outline-hidden transition-all ${
                      errors.designation ? "border-red-400 focus:border-red-500" : "border-[#D9E8DD] focus:border-[#2E8B57]"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Ward & Tenure */}
            <div className="bg-white p-6 rounded-3xl border border-[#D9E8DD] shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <MapPin className="w-4 h-4 text-[#2E8B57]" />
                <h3 className="font-bold text-sm text-[#1F2937]">Ward Demarcation & Term</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Ward Selection */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Municipal Ward / Jurisdiction</label>
                  <input
                    type="text"
                    list="wards-list"
                    value={formData.ward || ""}
                    onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                    placeholder="Select or enter ward..."
                    className="w-full px-3.5 py-2.5 bg-[#F8FCF9] border border-[#D9E8DD] rounded-xl text-xs font-semibold text-gray-800 focus:bg-white focus:border-[#2E8B57] focus:outline-hidden"
                  />
                  <datalist id="wards-list">
                    {COMMON_WARDS.map((w, idx) => (
                      <option key={idx} value={w} />
                    ))}
                  </datalist>
                </div>

                {/* Tenure */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Elected Tenure</label>
                  <input
                    type="text"
                    value={formData.tenure}
                    onChange={(e) => setFormData({ ...formData, tenure: e.target.value })}
                    placeholder="e.g. 2022 - 2027"
                    className="w-full px-3.5 py-2.5 bg-[#F8FCF9] border border-[#D9E8DD] rounded-xl text-xs font-semibold text-gray-800 focus:bg-white focus:border-[#2E8B57] focus:outline-hidden"
                  />
                </div>

                {/* Committee Assignment */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-gray-700">Standing / Subject Committee Assignment</label>
                  <input
                    type="text"
                    list="committees-list"
                    value={formData.committee || ""}
                    onChange={(e) => setFormData({ ...formData, committee: e.target.value })}
                    placeholder="e.g. Standing Committee Chairperson or Public Works Committee"
                    className="w-full px-3.5 py-2.5 bg-[#F8FCF9] border border-[#D9E8DD] rounded-xl text-xs font-semibold text-gray-800 focus:bg-white focus:border-[#2E8B57] focus:outline-hidden"
                  />
                  <datalist id="committees-list">
                    {COMMON_COMMITTEES.map((c, idx) => (
                      <option key={idx} value={c} />
                    ))}
                  </datalist>
                </div>
              </div>
            </div>

            {/* Section 3: Citizen Contact Details (with Address) */}
            <div className="bg-white p-6 rounded-3xl border border-[#D9E8DD] shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <Phone className="w-4 h-4 text-[#2E8B57]" />
                <h3 className="font-bold text-sm text-[#1F2937]">Citizen Contact Details</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Phone */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
                    <span>Contact Number / Helpline *</span>
                    {errors.phone && <span className="text-red-500 font-normal text-[10px]">{errors.phone}</span>}
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +91 98220 11221 or +91 2114 273030"
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
                    placeholder="e.g. ward1@lonavalamc.gov.in"
                    className="w-full px-3.5 py-2.5 bg-[#F8FCF9] border border-[#D9E8DD] rounded-xl text-xs font-semibold text-gray-800 focus:bg-white focus:border-[#2E8B57] focus:outline-hidden"
                  />
                </div>

                {/* Address */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-gray-700">Chamber / Office Address</label>
                  <textarea
                    rows={2}
                    value={formData.address || ""}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="e.g. Ward Office No. 1, Near Railway Station, Lonavala - 410401"
                    className="w-full px-3.5 py-2.5 bg-[#F8FCF9] border border-[#D9E8DD] rounded-xl text-xs font-semibold text-gray-800 focus:bg-white focus:border-[#2E8B57] focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2">
              <Link
                href="/admin/council"
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold"
              >
                Cancel & Return
              </Link>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#2E8B57] hover:bg-[#246E45] text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Council Member</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right: Citizen Portal Live Preview */}
        <div
          className={`lg:col-span-5 space-y-5 ${
            activeTab === "form" ? "hidden lg:block" : "block"
          }`}
        >
          <div className="sticky top-20 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-[#2E8B57]" />
                <span className="text-xs font-bold text-gray-700">Citizen Directory Card Preview</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Live Preview
              </span>
            </div>

            {/* Preview Card */}
            <div className="bg-white rounded-3xl border-2 border-[#2E8B57]/30 shadow-lg p-6 space-y-4 overflow-hidden relative">
              <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start text-center sm:text-left">
                {/* Avatar Photo or Initial */}
                <div className="relative w-20 h-24 rounded-2xl overflow-hidden bg-[#E8F5E9] text-[#2E8B57] border-2 border-[#D9E8DD] flex items-center justify-center font-bold text-xl shrink-0 shadow-2xs">
                  {formData.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={formData.image}
                      alt={formData.name || "Council Member"}
                      className="w-full h-full object-cover"
                    />
                  ) : formData.name ? (
                    formData.name.slice(0, 2).toUpperCase()
                  ) : (
                    <Landmark className="w-7 h-7" />
                  )}
                </div>

                {/* Details */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#E8F5E9] text-[#2E8B57] px-2.5 py-0.5 rounded-full inline-block">
                    {formData.designation || "Designation"}
                  </span>
                  <h4 className="text-base font-extrabold text-[#1F2937] truncate">
                    {formData.name || "Member Full Name"}
                  </h4>
                  <p className="text-xs text-[#2E8B57] font-semibold">
                    {formData.marathiName || "नाव (मराठीत)"}
                  </p>

                  {formData.ward && (
                    <p className="text-[11px] text-gray-600 flex items-center justify-center sm:justify-start gap-1">
                      <MapPin className="w-3 h-3 text-[#2E8B57] shrink-0" />
                      <span className="truncate">{formData.ward}</span>
                    </p>
                  )}

                  {formData.committee && (
                    <p className="text-[11px] text-gray-600 flex items-center justify-center sm:justify-start gap-1">
                      <Award className="w-3 h-3 text-amber-500 shrink-0" />
                      <span className="truncate">{formData.committee}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="pt-3 border-t border-gray-100 text-[11px] text-gray-600 space-y-1.5">
                {formData.phone && (
                  <p className="flex items-center justify-center sm:justify-start gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#2E8B57] shrink-0" />
                    <span className="font-semibold">{formData.phone}</span>
                  </p>
                )}
                {formData.email && (
                  <p className="flex items-center justify-center sm:justify-start gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#2E8B57] shrink-0" />
                    <span className="truncate">{formData.email}</span>
                  </p>
                )}
                {formData.address && (
                  <p className="flex items-start justify-center sm:justify-start gap-2 text-gray-500">
                    <Home className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{formData.address}</span>
                  </p>
                )}
              </div>

              {/* Tenure footer banner in preview */}
              <div className="bg-[#E8F5E9]/50 -mx-6 -mb-6 p-3 px-6 border-t border-[#D9E8DD] flex items-center justify-between text-[11px]">
                <span className="font-bold text-gray-600">Tenure: {formData.tenure || "2022 - 2027"}</span>
                <span className="font-bold text-emerald-700">● Active Directory</span>
              </div>
            </div>

            {/* Hint Box */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <Info className="w-3.5 h-3.5 text-amber-700" />
                <span>Publishing Guidelines</span>
              </div>
              <p className="text-[11px] text-amber-900/80 leading-relaxed">
                Ensure phone numbers, official municipal emails, and office addresses are accurate for public citizen access.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
