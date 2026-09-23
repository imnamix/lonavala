"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  getCitizenToken,
  getCitizenData,
  saveCitizenSession,
  clearCitizenSession,
  getMyGrievances,
  createGrievance,
  trackGrievanceByTicket,
  updateCitizenProfile,
  CitizenProfile,
  GrievanceItem,
  CreateGrievancePayload,
} from "@/lib/services/citizen.service";
import { uploadToCloudinary } from "@/lib/services/cloudinary.service";
import { GrievanceDetailsModal } from "@/components/grievance/GrievanceDetailsModal";
import { useLanguage } from "@/context/LanguageContext";
import {
  User,
  Phone,
  MapPin,
  Mail,
  LogOut,
  PlusCircle,
  FileText,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  Calendar,
  Building2,
  ShieldCheck,
  Send,
  RefreshCw,
  Edit3,
  Check,
  ChevronRight,
  Eye,
  Camera,
  UploadCloud,
  Trash2,
  ImageIcon,
} from "lucide-react";

interface CategoryMeta {
  value: string;
  en: string;
  mr: string;
  deptEn: string;
  deptMr: string;
}

const CATEGORIES: CategoryMeta[] = [
  { value: "ROAD", en: "Road Potholes & Footpaths", mr: "रस्ते व पदपथ", deptEn: "Public Works Department (PWD)", deptMr: "सार्वजनिक बांधकाम विभाग (PWD)" },
  { value: "WATER", en: "Water Supply & Leakage", mr: "पाणी पुरवठा व गळती", deptEn: "Water Supply & Drainage", deptMr: "पाणी पुरवठा व सांडपाणी विभाग" },
  { value: "DRAINAGE", en: "Drainage Choke & Sewage", mr: "सांडपाणी व गटारे", deptEn: "Water Supply & Drainage", deptMr: "पाणी पुरवठा व सांडपाणी विभाग" },
  { value: "STREET_LIGHT", en: "Street Light Outage", mr: "पथदिवे", deptEn: "Electrical & Public Lighting", deptMr: "विद्युत व प्रकाश विभाग" },
  { value: "GARBAGE", en: "Garbage Dumping & Cleanliness", mr: "कचरा व स्वच्छता", deptEn: "Health & Sanitation", deptMr: "आरोग्य व स्वच्छता विभाग" },
  { value: "SANITATION", en: "Public Toilets & Sanitation", mr: "सार्वजनिक स्वच्छता", deptEn: "Health & Sanitation", deptMr: "आरोग्य व स्वच्छता विभाग" },
  { value: "BUILDING", en: "Illegal Construction", mr: "अनधिकृत बांधकाम", deptEn: "Town Planning & Encroachment", deptMr: "नगररचना व अतिक्रमण विभाग" },
  { value: "NOISE", en: "Noise Pollution & Nuisance", mr: "ध्वनी प्रदूषण", deptEn: "General Administration", deptMr: "सामान्य प्रशासन विभाग" },
  { value: "ELECTRICITY", en: "Electricity & Power Issues", mr: "वीज समस्या", deptEn: "Electrical & Public Lighting", deptMr: "विद्युत व प्रकाश विभाग" },
  { value: "OTHER", en: "Others (General Civic Issues)", mr: "इतर नागरी तक्रार", deptEn: "Citizen Facilitation Center", deptMr: "नागरी सुविधा केंद्र" },
];

const WARDS = [
  { id: 1, en: "Ward 1 - Bhangarwadi & Railway Station Area", mr: "प्रभाग १ - भांगरवाडी व रेल्वे स्टेशन परिसर" },
  { id: 2, en: "Ward 2 - Ryewood & Main Market", mr: "प्रभाग २ - रायवूड व मुख्य बाजारपेठ" },
  { id: 3, en: "Ward 3 - Khandala Ridge & Nagpal Estate", mr: "प्रभाग ३ - खंडाळा रिज व नागपाल इस्टेट" },
  { id: 4, en: "Ward 4 - Valvan & Varsoli Road", mr: "प्रभाग ४ - वलवण व वरसोली रोड" },
  { id: 5, en: "Ward 5 - Tungarli & Gold Valley", mr: "प्रभाग ५ - तुंगार्ली व गोल्ड व्हॅली" },
];

type ActiveTab = "grievances" | "new" | "track" | "profile";

export default function CitizenDashboardPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const isMr = language === "mr";

  const [citizen, setCitizen] = useState<CitizenProfile | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>("grievances");
  const [loading, setLoading] = useState(true);

  // Popup Modal State
  const [selectedGrievance, setSelectedGrievance] = useState<GrievanceItem | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Grievances list state
  const [grievances, setGrievances] = useState<GrievanceItem[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // New Grievance form state
  const [form, setForm] = useState<CreateGrievancePayload>({
    title: "",
    category: "ROAD",
    description: "",
    address: "",
    wardNumber: 1,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<GrievanceItem | null>(null);
  const [formError, setFormError] = useState("");

  // Track search state
  const [searchTicket, setSearchTicket] = useState("");
  const [trackedItem, setTrackedItem] = useState<GrievanceItem | null>(null);
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackError, setTrackError] = useState("");

  // Profile update state
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    address: "",
    profilePicture: "",
  });
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState("");

  // Check auth on mount
  useEffect(() => {
    const token = getCitizenToken();
    const data = getCitizenData();
    if (!token) {
      router.replace("/login");
      return;
    }
    setCitizen(data);
    if (data) {
      setProfileForm({
        name: data.name || "",
        email: data.email || "",
        address: data.address || "",
        profilePicture: data.profilePicture || "",
      });
      setForm((prev) => ({ ...prev, address: data.address || "" }));
    }
    setLoading(false);
  }, [router]);

  // Fetch citizen grievances
  const loadGrievances = useCallback(async () => {
    setListLoading(true);
    try {
      const res = await getMyGrievances({
        status: statusFilter === "ALL" ? undefined : statusFilter,
      });
      setGrievances(res.data || []);
    } catch (err) {
      console.error("Failed to load grievances", err);
    } finally {
      setListLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    if (!loading && citizen) {
      loadGrievances();
    }
  }, [loading, citizen, statusFilter, loadGrievances]);

  // Handle Logout
  const handleLogout = () => {
    clearCitizenSession();
    router.replace("/login");
  };

  // Handle Grievance Submit
  const handleSubmitGrievance = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!form.title.trim() || !form.description.trim()) {
      setFormError(
        isMr
          ? "कृपया तक्रारीचा विषय आणि सविस्तर माहिती दोन्ही प्रविष्ट करा."
          : "Please enter both complaint title and description."
      );
      return;
    }
    setSubmitting(true);
    try {
      const created = await createGrievance(form);
      setSubmitSuccess(created.grievance || (created as any));
      setForm({
        title: "",
        category: "ROAD",
        description: "",
        address: citizen?.address || "",
        wardNumber: 1,
      });
      loadGrievances();
    } catch (err: any) {
      setFormError(
        err?.message ||
          (isMr ? "तक्रार नोंदवण्यात त्रुटी आली. कृपया पुन्हा प्रयत्न करा." : "Failed to submit grievance. Please try again.")
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Track Search
  const handleTrackSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTicket.trim()) return;
    setTrackLoading(true);
    setTrackError("");
    setTrackedItem(null);
    try {
      const res = await trackGrievanceByTicket(searchTicket.trim().toUpperCase());
      setTrackedItem(res);
    } catch (err: any) {
      setTrackError(
        isMr
          ? "या टोकन क्रमांकाची तक्रार आढळली नाही. कृपया क्रमांक तपासून पुन्हा प्रयत्न करा."
          : "No grievance found with this ticket number. Please check and try again."
      );
    } finally {
      setTrackLoading(false);
    }
  };

  // Handle Profile Picture upload to Cloudinary
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setProfileError(
        isMr ? "कृपया वैध इमेज फाईल निवडा (PNG, JPG, JPEG, WEBP)." : "Please select an image file (PNG, JPG, JPEG, WEBP)."
      );
      return;
    }
    setUploadingAvatar(true);
    setProfileError("");
    try {
      const res = await uploadToCloudinary(file, "lonavala/citizens");
      setProfileForm((prev) => ({ ...prev, profilePicture: res.secure_url }));
    } catch (err: any) {
      setProfileError(
        err?.message ||
          (isMr ? "प्रोफाइल फोटो अपलोड करताना त्रुटी आली." : "Failed to upload profile picture to Cloudinary.")
      );
    } finally {
      setUploadingAvatar(false);
      if (avatarInputRef.current) {
        avatarInputRef.current.value = "";
      }
    }
  };

  const handleRemoveAvatar = () => {
    setProfileForm((prev) => ({ ...prev, profilePicture: "" }));
  };

  // Handle Profile Update
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileError("");
    setProfileSuccess(false);
    try {
      const updated = await updateCitizenProfile({
        name: profileForm.name,
        email: profileForm.email,
        address: profileForm.address,
        profilePicture: profileForm.profilePicture || undefined,
      });
      setCitizen(updated);
      const token = getCitizenToken();
      if (token && updated) {
        saveCitizenSession(token, updated);
      }
      setProfileForm({
        name: updated?.name || profileForm.name,
        email: updated?.email || profileForm.email,
        address: updated?.address || profileForm.address,
        profilePicture: updated?.profilePicture || "",
      });
      if (updated?.address) {
        setForm((prev) => ({ ...prev, address: updated.address || "" }));
      }
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 4000);
    } catch (err: any) {
      setProfileError(
        err?.message || (isMr ? "प्रोफाइल अद्ययावत करताना त्रुटी आली." : "Failed to update profile.")
      );
    } finally {
      setProfileSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Calculate status counts
  const totalCount = grievances.length;
  const pendingCount = grievances.filter((g) => g.status === "PENDING" || g.status === "ASSIGNED").length;
  const inProgressCount = grievances.filter((g) => g.status === "IN_PROGRESS").length;
  const resolvedCount = grievances.filter((g) => g.status === "RESOLVED" || g.status === "CLOSED").length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "RESOLVED":
      case "CLOSED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 text-[11px] font-bold rounded-lg border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isMr ? "निराकरण झाले" : "Resolved"}</span>
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-800 text-[11px] font-bold rounded-lg border border-blue-200">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>{isMr ? "काम सुरू" : "In Progress"}</span>
          </span>
        );
      case "ASSIGNED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-50 text-purple-800 text-[11px] font-bold rounded-lg border border-purple-200">
            <User className="w-3.5 h-3.5 text-purple-600" />
            <span>{isMr ? "अधिकारी नियुक्त" : "Assigned"}</span>
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-800 text-[11px] font-bold rounded-lg border border-red-200">
            <AlertCircle className="w-3.5 h-3.5 text-red-600" />
            <span>{isMr ? "फेटाळली" : "Rejected"}</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-800 text-[11px] font-bold rounded-lg border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>{isMr ? "प्रलंबित" : "Pending"}</span>
          </span>
        );
    }
  };

  const getCategoryDisplay = (val: string) => {
    const found = CATEGORIES.find((c) => c.value === val);
    if (!found) return val;
    return isMr ? found.mr : found.en;
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">
      {/* ── Top Portal Header ── */}
      <div className="bg-white border-b border-border shadow-2xs pt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 relative shrink-0 rounded-2xl overflow-hidden border-2 border-primary/20 shadow-xs bg-slate-100 flex items-center justify-center">
                {citizen?.profilePicture ? (
                  <img
                    src={citizen.profilePicture}
                    alt={citizen.name || "Citizen Profile"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src="/images/logo.png"
                    alt="LMC Logo"
                    width={56}
                    height={56}
                    className="w-full h-full object-contain p-1"
                  />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-extrabold text-slate-900">
                    {citizen?.name || (isMr ? "नागरिक पोर्टल" : "Citizen Portal")}
                  </h1>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md uppercase tracking-wider">
                    {isMr ? "प्रमाणित नागरिक" : "Verified Citizen"}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {citizen?.phone}
                  </span>
                  {citizen?.address && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {citizen.address}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => {
                  setSubmitSuccess(null);
                  setActiveTab("new");
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{isMr ? "तक्रार नोंदवा" : "Lodge Grievance"}</span>
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-red-50 text-slate-700 hover:text-red-700 border border-border hover:border-red-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                title={isMr ? "नागरिक पोर्टलवरून बाहेर पडा" : "Logout from Citizen Portal"}
              >
                <LogOut className="w-4 h-4 text-red-500" />
                <span>{isMr ? "बाहेर पडा" : "Logout"}</span>
              </button>
            </div>
          </div>

          {/* ── Stats Bar ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-100">
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 text-center">
              <div className="text-xs font-semibold text-slate-500">{isMr ? "एकूण तक्रारी" : "Total Grievances"}</div>
              <div className="text-2xl font-black text-slate-900 mt-0.5">{totalCount}</div>
            </div>
            <div className="bg-amber-50/70 border border-amber-200/60 rounded-2xl p-3.5 text-center">
              <div className="text-xs font-semibold text-amber-700">{isMr ? "प्रलंबित" : "Pending"}</div>
              <div className="text-2xl font-black text-amber-900 mt-0.5">{pendingCount}</div>
            </div>
            <div className="bg-blue-50/70 border border-blue-200/60 rounded-2xl p-3.5 text-center">
              <div className="text-xs font-semibold text-blue-700">{isMr ? "काम सुरू" : "In Progress"}</div>
              <div className="text-2xl font-black text-blue-900 mt-0.5">{inProgressCount}</div>
            </div>
            <div className="bg-emerald-50/70 border border-emerald-200/60 rounded-2xl p-3.5 text-center">
              <div className="text-xs font-semibold text-emerald-700">{isMr ? "निराकरण झाले" : "Resolved"}</div>
              <div className="text-2xl font-black text-emerald-900 mt-0.5">{resolvedCount}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Panel Content ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-border mb-6 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab("grievances")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === "grievances"
                ? "border-primary text-primary bg-primary-light/50"
                : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{isMr ? `माझ्या तक्रारी (${totalCount})` : `My Grievances (${totalCount})`}</span>
          </button>
          <button
            onClick={() => {
              setSubmitSuccess(null);
              setActiveTab("new");
            }}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === "new"
                ? "border-primary text-primary bg-primary-light/50"
                : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>{isMr ? "नागरी तक्रार नोंदवा" : "Lodge Grievance"}</span>
          </button>
          <button
            onClick={() => setActiveTab("track")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === "track"
                ? "border-primary text-primary bg-primary-light/50"
                : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Search className="w-4 h-4" />
            <span>{isMr ? "तक्रार स्थिती तपासा" : "Track Ticket"}</span>
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === "profile"
                ? "border-primary text-primary bg-primary-light/50"
                : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <User className="w-4 h-4" />
            <span>{isMr ? "माझी प्रोफाइल" : "My Profile"}</span>
          </button>
        </div>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* TAB 1: MY GRIEVANCES */}
        {/* ══════════════════════════════════════════════════════════ */}
        {activeTab === "grievances" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-border shadow-2xs">
              <div className="text-xs font-bold text-slate-700">
                {isMr ? "तक्रार वर्गीकरण:" : "Filter Grievances:"}
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {[
                  { id: "ALL", en: "All Grievances", mr: "सर्व तक्रारी" },
                  { id: "PENDING", en: "Pending", mr: "प्रलंबित" },
                  { id: "IN_PROGRESS", en: "In Progress", mr: "काम सुरू" },
                  { id: "RESOLVED", en: "Resolved", mr: "निराकरण झाले" },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setStatusFilter(st.id)}
                    className={`px-3.5 py-1.5 rounded-xl font-bold transition-all text-xs cursor-pointer ${
                      statusFilter === st.id
                        ? "bg-primary text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {isMr ? st.mr : st.en}
                  </button>
                ))}
                <button
                  onClick={() => loadGrievances()}
                  className="p-2 text-slate-500 hover:text-primary hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  title={isMr ? "यादी रिफ्रेश करा" : "Refresh list"}
                >
                  <RefreshCw className={`w-4 h-4 ${listLoading ? "animate-spin" : ""}`} />
                </button>
              </div>
            </div>

            {listLoading ? (
              <div className="py-16 text-center bg-white rounded-3xl border border-border">
                <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto mb-2" />
                <p className="text-xs text-slate-500">
                  {isMr ? "तुमच्या तक्रारींची माहिती लोड होत आहे..." : "Loading your grievances..."}
                </p>
              </div>
            ) : grievances.length === 0 ? (
              <div className="py-16 text-center bg-white rounded-3xl border border-border px-4">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
                  <FileText className="w-8 h-8" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {isMr ? "कोणतीही तक्रार आढळली नाही" : "No grievances found"}
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
                  {isMr
                    ? "या फिल्टर अंतर्गत तुमची कोणतीही तक्रार नोंदवलेली नाही."
                    : "You have not filed any grievances under this filter."}
                </p>
                <button
                  onClick={() => setActiveTab("new")}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{isMr ? "नवीन तक्रार नोंदवा" : "File Grievance"}</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {grievances.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedGrievance(item);
                      setIsDetailsModalOpen(true);
                    }}
                    className="bg-white rounded-2xl border border-border p-5 hover:border-primary/50 hover:shadow-md transition-all space-y-3 shadow-2xs cursor-pointer group relative"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-extrabold text-primary bg-primary-light px-2.5 py-0.5 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                            {item.ticketNumber}
                          </span>
                          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                            {getCategoryDisplay(item.category)}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 mt-1.5 group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(item.status)}
                        <span className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:translate-x-0.5 transition-transform bg-primary-light/60 px-2.5 py-1 rounded-lg">
                          <Eye className="w-3.5 h-3.5" />
                          <span>{isMr ? "तपशील पहा" : "View Details"}</span>
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 text-[11px] text-slate-500">
                      {item.address && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">
                            {item.address} ({isMr ? `प्रभाग ${item.wardNumber || 1}` : `Ward ${item.wardNumber || 1}`})
                          </span>
                        </div>
                      )}
                      {item.assignedDepartment && (
                        <div className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{item.assignedDepartment}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 sm:justify-end">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{new Date(item.createdDate).toLocaleDateString(isMr ? "mr-IN" : "en-IN", { dateStyle: "medium" })}</span>
                      </div>
                    </div>

                    {item.statusHistory && item.statusHistory.length > 0 && item.statusHistory[item.statusHistory.length - 1].note ? (
                      <div className="mt-2 p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-700 flex items-start gap-2">
                        <FileText className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                        <div className="min-w-0">
                          <span className="font-bold text-slate-800">
                            {isMr ? "ताज्या कार्यवाहीची नोंद:" : `${item.statusHistory[item.statusHistory.length - 1].status.replace(/_/g, " ")} Note:`}{" "}
                          </span>
                          <span className="text-slate-600 line-clamp-1 font-medium">
                            {item.statusHistory[item.statusHistory.length - 1].note}
                          </span>
                        </div>
                      </div>
                    ) : item.resolutionNotes ? (
                      <div className="mt-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <div className="min-w-0">
                          <span className="font-bold">{isMr ? "निवारण शेरा: " : "Resolution: "}</span>
                          <span className="line-clamp-1">{item.resolutionNotes}</span>
                        </div>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════ */}
        {/* TAB 2: LODGE NEW GRIEVANCE */}
        {/* ══════════════════════════════════════════════════════════ */}
        {activeTab === "new" && (
          <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-sm">
            {submitSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">
                    {isMr ? "तक्रार यशस्वीरित्या नोंदवली गेली!" : "Grievance Registered Successfully!"}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    {isMr
                      ? "तुमची तक्रार त्वरित निवारणासाठी संबंधित नगरपालिका विभागाकडे पाठवण्यात आली आहे."
                      : "Your grievance has been forwarded to the concerned municipal department for prompt resolution."}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-border rounded-2xl max-w-sm mx-auto text-center space-y-1">
                  <div className="text-xs text-slate-500 font-semibold">
                    {isMr ? "तुमचा संदर्भ टोकन क्रमांक" : "Your Tracking Token Number:"}
                  </div>
                  <div className="text-xl font-black font-mono text-primary tracking-wider">
                    {submitSuccess.ticketNumber}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {isMr ? "तक्रार स्थिती तपासण्यासाठी हा क्रमांक जतन करा" : "Keep this tracking token safe for future reference"}
                  </div>
                </div>

                <div className="flex gap-3 justify-center pt-2">
                  <button
                    onClick={() => {
                      setSubmitSuccess(null);
                      setActiveTab("grievances");
                    }}
                    className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    {isMr ? "माझ्या तक्रारींमध्ये पहा" : "View My Grievances"}
                  </button>
                  <button
                    onClick={() => setSubmitSuccess(null)}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    {isMr ? "दुसरी तक्रार नोंदवा" : "File Another"}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitGrievance} className="space-y-4 text-xs">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    {isMr ? "नागरी तक्रार नोंदवा" : "Lodge a Civic Complaint"}
                  </h2>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    {isMr
                      ? "महाराष्ट्र लोकसेवा हमी कायद्यानुसार निश्चित मुदतीत तक्रार निवारण."
                      : "Timely grievance redressal as per Maharashtra Right to Public Services Act."}
                  </p>
                </div>

                {formError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-700 uppercase tracking-wider">
                    {isMr ? "तक्रार प्रवर्ग *" : "Grievance Category *"}
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full h-11 px-3.5 bg-white border border-border rounded-xl font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {isMr ? cat.mr : cat.en}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Ward */}
                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-700 uppercase tracking-wider">
                    {isMr ? "प्रभाग क्रमांक *" : "Municipal Ward *"}
                  </label>
                  <select
                    value={form.wardNumber}
                    onChange={(e) => setForm({ ...form, wardNumber: Number(e.target.value) })}
                    className="w-full h-11 px-3.5 bg-white border border-border rounded-xl font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800"
                  >
                    {WARDS.map((w) => (
                      <option key={w.id} value={w.id}>
                        {isMr ? w.mr : w.en}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Title */}
                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-700 uppercase tracking-wider">
                    {isMr ? "तक्रारीचा विषय *" : "Subject of Issue *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder={
                      isMr
                        ? "उदा. शिवाजी चौक परिसरातील पिण्याच्या पाण्याची पाईपलाईन फुटली आहे"
                        : "e.g. Broken water pipeline near Shivaji Chowk"
                    }
                    className="w-full h-11 px-3.5 bg-white border border-border rounded-xl font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                  />
                </div>

                {/* Address */}
                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-700 uppercase tracking-wider">
                    {isMr ? "पत्ता व ठिकाण *" : "Location & Street Address *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder={
                      isMr
                        ? "उदा. हॉटेल राम कृष्ण जवळ, जुना मुंबई-पुणे महामार्ग, लोणावळा"
                        : "e.g. Near Hotel Rama Krishna, Old Mumbai-Pune Highway, Lonavala"
                    }
                    className="w-full h-11 px-3.5 bg-white border border-border rounded-xl font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-700 uppercase tracking-wider">
                    {isMr ? "सविस्तर माहिती *" : "Detailed Description *"}
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder={
                      isMr
                        ? "समस्येचे नेमके स्वरूप, कालावधी आणि परिसराची सविस्तर माहिती लिहा..."
                        : "Describe the exact nature of the problem, duration, and locality details..."
                    }
                    className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting || !form.title.trim() || !form.description.trim()}
                  className="w-full h-11 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{isMr ? "तक्रार दाखल करा" : "Submit Grievance"}</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════ */}
        {/* TAB 3: TRACK TICKET */}
        {/* ══════════════════════════════════════════════════════════ */}
        {activeTab === "track" && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-sm">
              <h2 className="text-base font-extrabold text-slate-900 mb-1">
                {isMr ? "तक्रार स्थिती तपासा" : "Track Grievance Status"}
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                {isMr
                  ? "थेट विभागाची सद्यस्थिती जाणून घेण्यासाठी तुमचा तक्रार संदर्भ टोकन क्रमांक टाका."
                  : "Enter your grievance tracking token to check real-time department updates."}
              </p>

              <form onSubmit={handleTrackSearch} className="flex gap-2">
                <input
                  type="text"
                  required
                  value={searchTicket}
                  onChange={(e) => setSearchTicket(e.target.value)}
                  placeholder={isMr ? "उदा. GRV-2026-000004" : "e.g. GRV-2026-000004"}
                  className="flex-1 h-11 px-3.5 bg-white border border-border rounded-xl text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <button
                  type="submit"
                  disabled={trackLoading}
                  className="h-11 px-6 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  {trackLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  <span>{isMr ? "स्थिती शोधा" : "Track Ticket"}</span>
                </button>
              </form>

              {trackError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{trackError}</span>
                </div>
              )}
            </div>

            {trackedItem && (
              <div
                onClick={() => {
                  setSelectedGrievance(trackedItem);
                  setIsDetailsModalOpen(true);
                }}
                className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-sm space-y-4 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="font-mono text-xs font-extrabold text-primary bg-primary-light px-2.5 py-0.5 rounded-md group-hover:bg-primary group-hover:text-white transition-colors">
                      {trackedItem.ticketNumber}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-2 group-hover:text-primary transition-colors">
                      {trackedItem.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(trackedItem.status)}
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-600">
                  <div>
                    <strong>{isMr ? "प्रवर्ग:" : "Category:"}</strong> {getCategoryDisplay(trackedItem.category)}
                  </div>
                  <div>
                    <strong>{isMr ? "तक्रार तपशील:" : "Description:"}</strong> {trackedItem.description}
                  </div>
                  {trackedItem.address && (
                    <div>
                      <strong>{isMr ? "ठिकाण:" : "Location:"}</strong> {trackedItem.address}
                    </div>
                  )}
                  {trackedItem.assignedDepartment && (
                    <div>
                      <strong>{isMr ? "संबंधित विभाग:" : "Department:"}</strong> {trackedItem.assignedDepartment}
                    </div>
                  )}
                  
                  {trackedItem.statusHistory && trackedItem.statusHistory.length > 0 && (
                    <div className="mt-3 p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1.5">
                      <div className="font-bold text-slate-700 text-[11px] flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5 text-primary" />
                          <span>{isMr ? "ताज्या कार्यवाहीची नोंद:" : "Latest Action Log:"}</span>
                        </span>
                        <span className="text-slate-400 font-normal">
                          {trackedItem.statusHistory[trackedItem.statusHistory.length - 1]?.updatedAt
                            ? new Date(
                                String(trackedItem.statusHistory[trackedItem.statusHistory.length - 1].updatedAt)
                              ).toLocaleString(isMr ? "mr-IN" : "en-IN", {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })
                            : ""}
                        </span>
                      </div>
                      {trackedItem.statusHistory[trackedItem.statusHistory.length - 1]?.note && (
                        <p className="text-slate-800 bg-white p-2 rounded-lg border border-slate-200/60 font-medium leading-relaxed">
                          {trackedItem.statusHistory[trackedItem.statusHistory.length - 1].note}
                        </p>
                      )}
                    </div>
                  )}

                  {trackedItem.resolutionNotes && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 mt-2">
                      <strong>{isMr ? "अधिकृत निवारण शेरा:" : "Resolution Remarks:"}</strong> {trackedItem.resolutionNotes}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    {isMr ? "संपूर्ण माहिती व पुरावे पाहण्यासाठी क्लिक करा" : "Click to view full details & evidence"}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedGrievance(trackedItem);
                      setIsDetailsModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{isMr ? "संपूर्ण तपशील पहा" : "View Full Details"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════ */}
        {/* TAB 4: MY PROFILE */}
        {/* ══════════════════════════════════════════════════════════ */}
        {activeTab === "profile" && (
          <div className="max-w-xl mx-auto bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-sm">
            <h2 className="text-base font-extrabold text-slate-900 mb-1">
              {isMr ? "नागरिक प्रोफाइल व संपर्क माहिती" : "Citizen Profile & Contact"}
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              {isMr
                ? "तक्रार निवारणाचे एसएमएस (SMS) व अपडेट्स वेळेवर मिळण्यासाठी तुमची संपर्क माहिती अद्ययावत ठेवा."
                : "Keep your contact information updated to receive timely SMS and grievance updates."}
            </p>

            {profileSuccess && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{isMr ? "प्रोफाइल यशस्वीरित्या जतन केले!" : "Profile updated successfully!"}</span>
              </div>
            )}

            {profileError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{profileError}</span>
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
              {/* Profile Picture Upload Card */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-border flex flex-col sm:flex-row items-center gap-4">
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-primary/30 bg-white shadow-sm shrink-0 flex items-center justify-center group">
                  {profileForm.profilePicture ? (
                    <img
                      src={profileForm.profilePicture}
                      alt="Profile Picture"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400">
                      <User className="w-8 h-8 text-slate-300" />
                    </div>
                  )}

                  {uploadingAvatar && (
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-2xs flex flex-col items-center justify-center text-white text-[10px] font-bold gap-1">
                      <Loader2 className="w-5 h-5 animate-spin text-white" />
                      <span>{isMr ? "अपलोड होत आहे..." : "Uploading..."}</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 text-center sm:text-left space-y-2">
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 flex items-center justify-center sm:justify-start gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-primary" />
                      <span>{isMr ? "प्रोफाइल फोटो" : "Profile Picture"}</span>
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {isMr
                        ? "तुमचे प्रोफाइल कस्टमाइझ करण्यासाठी फोटो अपलोड करा."
                        : "Upload a photo to personalize your citizen account."}
                    </p>
                  </div>

                  <input
                    type="file"
                    ref={avatarInputRef}
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                    <button
                      type="button"
                      disabled={uploadingAvatar}
                      onClick={() => avatarInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-border shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {uploadingAvatar ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <UploadCloud className="w-3.5 h-3.5 text-primary" />
                      )}
                      <span>
                        {profileForm.profilePicture
                          ? isMr
                            ? "फोटो बदला"
                            : "Change Photo"
                          : isMr
                          ? "फोटो अपलोड करा"
                          : "Upload Photo"}
                      </span>
                    </button>

                    {profileForm.profilePicture && (
                      <button
                        type="button"
                        disabled={uploadingAvatar}
                        onClick={handleRemoveAvatar}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-red-50 text-red-600 font-bold text-xs rounded-xl border border-red-200 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                        <span>{isMr ? "काढून टाका" : "Remove"}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700 uppercase tracking-wider">
                  {isMr ? "प्रमाणित मोबाईल क्रमांक" : "Verified Mobile Number"}
                </label>
                <div className="flex items-center h-11 px-3.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-600 font-semibold cursor-not-allowed">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 mr-2" />
                  {citizen?.phone} ({isMr ? "मोबाईल प्रमाणित" : "Verified"})
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700 uppercase tracking-wider">
                  {isMr ? "पूर्ण नाव *" : "Full Name *"}
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  placeholder={isMr ? "उदा. रमेश पाटील" : "e.g. Ramesh Patil"}
                  className="w-full h-11 px-3.5 bg-white border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700 uppercase tracking-wider">
                  {isMr ? "ईमेल पत्ता" : "Email Address"}
                </label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  placeholder="e.g. citizen@example.com"
                  className="w-full h-11 px-3.5 bg-white border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700 uppercase tracking-wider">
                  {isMr ? "रहिवासी पत्ता" : "Residential Address"}
                </label>
                <textarea
                  rows={3}
                  value={profileForm.address}
                  onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                  placeholder={
                    isMr
                      ? "घर क्रमांक, इमारत, प्रभाग, लोणावळा..."
                      : "House No., Building, Ward, Lonavala..."
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium text-sm resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={profileSaving || !profileForm.name.trim()}
                className="w-full h-11 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {profileSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Edit3 className="w-4 h-4" />
                    <span>{isMr ? "बदल जतन करा" : "Save Changes"}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* ── Grievance Details Modal Popup ── */}
      <GrievanceDetailsModal
        grievance={selectedGrievance}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />
    </div>
  );
}
