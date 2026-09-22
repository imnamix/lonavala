"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Save,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Upload,
  FileSpreadsheet,
  Trash2,
  Plus,
  Calendar,
  Building,
  Loader2,
  ExternalLink,
  IndianRupee,
  Clock,
  Sparkles,
  FileText,
  Award,
  Phone,
  Mail,
  Eye,
  RefreshCw,
  Layers,
  HelpCircle,
} from "lucide-react";
import { TenderItem, TenderStatus } from "@/types";
import {
  getTenderById,
  createTender,
  updateTender,
  TENDER_DEPARTMENTS,
  TENDER_CATEGORIES,
} from "@/lib/services/tender.service";
import { uploadToCloudinary } from "@/lib/services/cloudinary.service";
import { translateToMarathi } from "@/lib/services/translate.service";

interface TenderFormProps {
  tenderId?: string;
  isNew?: boolean;
}

export function TenderForm({ tenderId, isNew = false }: TenderFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Omit<TenderItem, "id">>({
    tenderId: "",
    title: "",
    marathiTitle: "",
    department: "Public Works (PWD)",
    category: "Civil Works",
    deadline: "",
    openingDate: "",
    publishedDate: new Date().toISOString().split("T")[0],
    estimatedCost: "",
    earnestMoneyDeposit: "",
    tenderFee: "",
    status: "Live",
    downloadUrl: "https://mahatenders.gov.in",
    fileName: "",
    fileSize: "2.5 MB",
    externalPortalUrl: "https://mahatenders.gov.in",
    description: "",
    eligibilityCriteria: [
      "Registered Contractor with LMC / PWD Maharashtra",
      "Valid GSTIN and PAN Registration Certificate",
    ],
    awardedTo: "",
    awardedAmount: "",
    awardDate: "",
    completionPeriod: "90 Days from Work Order",
    contactPerson: "Executive Engineer (Civil)",
    contactPhone: "+91 2114 273200",
    contactEmail: "pwd@lonavalamc.gov.in",
    isNew: true,
  });

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [translating, setTranslating] = useState(false);
  const [savedToast, setSavedToast] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<"form" | "preview">("form");
  const [newCriteriaText, setNewCriteriaText] = useState("");

  // Helper to generate unique reference ID
  const generateTenderId = (dept = formData.department) => {
    const deptPrefix =
      dept === "Public Works (PWD)"
        ? "PWD"
        : dept === "Water Supply & Sewerage"
        ? "WTR"
        : dept === "Health & Sanitation"
        ? "HLT"
        : dept === "IT & e-Governance"
        ? "IT"
        : dept === "Electrical & Street Lighting"
        ? "ELEC"
        : dept === "Garden & Tree Authority"
        ? "GRD"
        : "GEN";
    const year = new Date().getFullYear();
    const randomNum = Math.floor(100 + Math.random() * 900);
    return `LMC/${deptPrefix}/${year}/T-${randomNum}`;
  };

  // Load existing tender for editing
  useEffect(() => {
    async function loadTender() {
      if (!isNew && tenderId) {
        setLoading(true);
        try {
          const existing = await getTenderById(tenderId);
          if (existing) {
            setFormData(existing);
          } else {
            setErrors({ general: "Tender not found with given ID." });
          }
        } catch (err) {
          console.error("Failed to load tender:", err);
          setErrors({ general: "Failed to retrieve tender record." });
        } finally {
          setLoading(false);
        }
      } else if (isNew) {
        // Pre-generate a tender reference number
        setFormData((prev) => ({
          ...prev,
          tenderId: generateTenderId("Public Works (PWD)"),
          deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10) + " 17:00",
        }));
      }
    }
    loadTender();
  }, [tenderId, isNew]);

  const handleChange = (
    field: keyof Omit<TenderItem, "id">,
    value: any
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  // Auto-translate Title to Marathi
  const handleAutoTranslate = async () => {
    if (!formData.title || !formData.title.trim()) {
      setErrors((prev) => ({ ...prev, title: "Enter English title first to auto-translate." }));
      return;
    }
    try {
      setTranslating(true);
      const translated = await translateToMarathi(formData.title);
      if (translated) {
        setFormData((prev) => ({ ...prev, marathiTitle: translated }));
      }
    } catch (err) {
      console.error("Translation error:", err);
    } finally {
      setTranslating(false);
    }
  };

  // Cloudinary document upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingFile(true);
      setUploadSuccess(null);

      const asset = await uploadToCloudinary(file, "lonavala/tenders");
      const targetUrl = asset.secure_url || asset.url;
      const calcSize = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

      setFormData((prev) => ({
        ...prev,
        downloadUrl: targetUrl,
        fileName: file.name,
        fileSize: calcSize,
      }));

      setUploadSuccess(`Tender file "${file.name}" uploaded successfully.`);
      setTimeout(() => setUploadSuccess(null), 4000);
    } catch (err: any) {
      console.error("Tender file upload error:", err);
      setErrors((prev) => ({
        ...prev,
        file: err.message || "Failed to upload file to Cloudinary.",
      }));
    } finally {
      setUploadingFile(false);
      if (e.target) e.target.value = "";
    }
  };

  const handleAddCriteria = () => {
    if (!newCriteriaText.trim()) return;
    setFormData((prev) => ({
      ...prev,
      eligibilityCriteria: [...(prev.eligibilityCriteria || []), newCriteriaText.trim()],
    }));
    setNewCriteriaText("");
  };

  const handleRemoveCriteria = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      eligibilityCriteria: (prev.eligibilityCriteria || []).filter((_, i) => i !== index),
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.tenderId.trim()) newErrors.tenderId = "Tender reference ID is required.";
    if (!formData.title.trim()) newErrors.title = "Tender title is required.";
    if (!formData.department.trim()) newErrors.department = "Department selection is required.";
    if (!formData.deadline.trim()) newErrors.deadline = "Submission deadline is required.";
    if (!formData.estimatedCost.trim()) newErrors.estimatedCost = "Estimated contract cost is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      setSaving(true);
      if (isNew) {
        await createTender(formData);
      } else if (tenderId) {
        await updateTender(tenderId, formData);
      }
      setSavedToast(true);
      setTimeout(() => {
        router.push("/admin/tenders");
      }, 1200);
    } catch (err: any) {
      console.error("Failed to save tender:", err);
      setErrors((prev) => ({
        ...prev,
        general: err.message || "Failed to save tender record.",
      }));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-gray-500 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
        <p className="text-xs font-semibold">Loading tender details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Toast alert */}
      {savedToast && (
        <div className="fixed top-6 right-6 z-50 bg-gray-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-white/10 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Tender {isNew ? "created" : "updated"} successfully! Redirecting...</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-white p-5 rounded-3xl border border-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/tenders"
            className="p-2.5 rounded-2xl bg-primary-surface hover:bg-primary-light text-gray-700 hover:text-primary transition-colors border border-border"
            title="Back to Tenders list"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight">
                {isNew ? "Create New Tender Notice" : `Edit Tender: ${formData.tenderId}`}
              </h1>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-primary-light text-primary">
                {isNew ? "New Entry" : "Editing Record"}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Publish official procurement tenders, bidding schedules, earnest deposits, and technical requirements.
            </p>
          </div>
        </div>

        {/* Action Toggle & Submit Button */}
        <div className="flex items-center gap-2.5">
          <div className="p-1 bg-primary-surface rounded-xl border border-border flex items-center text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("form")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === "form"
                  ? "bg-white text-primary shadow-xs"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Form
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                activeTab === "preview"
                  ? "bg-white text-primary shadow-xs"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Preview
            </button>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saving ? "Saving..." : isNew ? "Publish Tender" : "Update Tender"}</span>
          </button>
        </div>
      </div>

      {/* General Error Banner */}
      {errors.general && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errors.general}</span>
        </div>
      )}

      {/* Main Tab Views */}
      {activeTab === "form" ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Identification & General Info */}
          <div className="bg-white p-6 rounded-3xl border border-border shadow-xs space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-border">
              <FileSpreadsheet className="w-4 h-4 text-primary" />
              <h2 className="font-extrabold text-sm text-text-primary">
                1. Tender Identification & Basic Classification
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Tender Reference ID */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-gray-700">
                    Tender Reference ID <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleChange("tenderId", generateTenderId())}
                    className="text-[10px] font-bold text-primary hover:underline"
                  >
                    Auto-Generate
                  </button>
                </div>
                <input
                  type="text"
                  value={formData.tenderId}
                  onChange={(e) => handleChange("tenderId", e.target.value)}
                  placeholder="e.g. LMC/PWD/2025/T-014"
                  className={`w-full px-3.5 py-2.5 bg-primary-surface border rounded-xl text-xs font-mono font-bold text-gray-900 focus:bg-white focus:border-primary focus:outline-hidden ${
                    errors.tenderId ? "border-red-400 bg-red-50/50" : "border-border"
                  }`}
                />
                {errors.tenderId && (
                  <p className="text-[10px] text-red-500 font-semibold mt-1">{errors.tenderId}</p>
                )}
              </div>

              {/* Department */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Issuing Department <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => handleChange("department", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-primary-surface border border-border rounded-xl text-xs font-semibold text-gray-800 focus:bg-white focus:border-primary focus:outline-hidden"
                >
                  {TENDER_DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Work Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-primary-surface border border-border rounded-xl text-xs font-semibold text-gray-800 focus:bg-white focus:border-primary focus:outline-hidden"
                >
                  {TENDER_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Workflow Status */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Current Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange("status", e.target.value as TenderStatus)}
                  className="w-full px-3.5 py-2.5 bg-primary-surface border border-border rounded-xl text-xs font-bold text-gray-800 focus:bg-white focus:border-primary focus:outline-hidden"
                >
                  <option value="Live">Live (Active Bidding)</option>
                  <option value="Under Evaluation">Under Evaluation (Technical/Financial)</option>
                  <option value="Awarded">Awarded (Contract Issued)</option>
                  <option value="Closed">Closed (Completed)</option>
                  <option value="Cancelled">Cancelled / Retendered</option>
                </select>
              </div>

              {/* Notice Published Date */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Published Date
                </label>
                <input
                  type="date"
                  value={formData.publishedDate}
                  onChange={(e) => handleChange("publishedDate", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-primary-surface border border-border rounded-xl text-xs font-semibold text-gray-800 focus:bg-white focus:border-primary focus:outline-hidden"
                />
              </div>

              {/* Completion Period */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Completion Period
                </label>
                <input
                  type="text"
                  value={formData.completionPeriod || ""}
                  onChange={(e) => handleChange("completionPeriod", e.target.value)}
                  placeholder="e.g. 90 Days from Work Order"
                  className="w-full px-3.5 py-2.5 bg-primary-surface border border-border rounded-xl text-xs font-semibold text-gray-800 focus:bg-white focus:border-primary focus:outline-hidden"
                />
              </div>
            </div>

            {/* Title (English) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-gray-700">
                  Tender Title (English) <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleAutoTranslate}
                  disabled={translating}
                  className="text-[10px] font-bold text-primary hover:underline inline-flex items-center gap-1 disabled:opacity-50"
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>{translating ? "Translating..." : "Auto-translate to Marathi"}</span>
                </button>
              </div>
              <textarea
                rows={2}
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="e.g. Supply, Installation & Maintenance of 25 High Mast LED Floodlights at Tourist Junctions"
                className={`w-full px-3.5 py-2.5 bg-primary-surface border rounded-xl text-xs font-semibold text-gray-900 focus:bg-white focus:border-primary focus:outline-hidden ${
                  errors.title ? "border-red-400 bg-red-50/50" : "border-border"
                }`}
              />
              {errors.title && (
                <p className="text-[10px] text-red-500 font-semibold mt-1">{errors.title}</p>
              )}
            </div>

            {/* Title (Marathi) */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Tender Title in Marathi (मराठी निविदा शीर्षक)
              </label>
              <textarea
                rows={2}
                value={formData.marathiTitle || ""}
                onChange={(e) => handleChange("marathiTitle", e.target.value)}
                placeholder="उदा. पर्यटन चौकांमध्ये २५ हाय मास्ट एलईडी फ्लडलाइट्सचा पुरवठा, उभारणी आणि देखभाल"
                className="w-full px-3.5 py-2.5 bg-primary-surface border border-border rounded-xl text-xs font-semibold text-gray-900 focus:bg-white focus:border-primary focus:outline-hidden"
              />
            </div>
          </div>

          {/* Section 2: Financials & Deposits */}
          <div className="bg-white p-6 rounded-3xl border border-border shadow-xs space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-border">
              <IndianRupee className="w-4 h-4 text-emerald-600" />
              <h2 className="font-extrabold text-sm text-text-primary">
                2. Financial Estimates, EMD & Document Fees
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Estimated Cost */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Estimated Cost (INR) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.estimatedCost}
                  onChange={(e) => handleChange("estimatedCost", e.target.value)}
                  placeholder="e.g. ₹1,45,00,000"
                  className={`w-full px-3.5 py-2.5 bg-primary-surface border rounded-xl text-xs font-bold text-gray-900 focus:bg-white focus:border-primary focus:outline-hidden ${
                    errors.estimatedCost ? "border-red-400 bg-red-50/50" : "border-border"
                  }`}
                />
                <p className="text-[10px] text-gray-400 mt-1">Include currency prefix (e.g. ₹1,45,00,000)</p>
                {errors.estimatedCost && (
                  <p className="text-[10px] text-red-500 font-semibold mt-1">{errors.estimatedCost}</p>
                )}
              </div>

              {/* Earnest Money Deposit */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Earnest Money Deposit (EMD)
                </label>
                <input
                  type="text"
                  value={formData.earnestMoneyDeposit || ""}
                  onChange={(e) => handleChange("earnestMoneyDeposit", e.target.value)}
                  placeholder="e.g. ₹1,45,000 (1%)"
                  className="w-full px-3.5 py-2.5 bg-primary-surface border border-border rounded-xl text-xs font-bold text-gray-900 focus:bg-white focus:border-primary focus:outline-hidden"
                />
                <p className="text-[10px] text-gray-400 mt-1">Refundable security deposit for bidders</p>
              </div>

              {/* Tender Fee */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Tender Document Fee
                </label>
                <input
                  type="text"
                  value={formData.tenderFee || ""}
                  onChange={(e) => handleChange("tenderFee", e.target.value)}
                  placeholder="e.g. ₹5,000"
                  className="w-full px-3.5 py-2.5 bg-primary-surface border border-border rounded-xl text-xs font-bold text-gray-900 focus:bg-white focus:border-primary focus:outline-hidden"
                />
                <p className="text-[10px] text-gray-400 mt-1">Non-refundable portal processing fee</p>
              </div>
            </div>
          </div>

          {/* Section 3: Bidding Timelines & Deadlines */}
          <div className="bg-white p-6 rounded-3xl border border-border shadow-xs space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-border">
              <Clock className="w-4 h-4 text-amber-600" />
              <h2 className="font-extrabold text-sm text-text-primary">
                3. Bidding Schedules & Key Deadlines
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Submission Deadline */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Bid Submission Deadline (Date & Time) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.deadline}
                  onChange={(e) => handleChange("deadline", e.target.value)}
                  placeholder="e.g. 2025-05-28 17:00"
                  className={`w-full px-3.5 py-2.5 bg-primary-surface border rounded-xl text-xs font-bold text-gray-900 focus:bg-white focus:border-primary focus:outline-hidden ${
                    errors.deadline ? "border-red-400 bg-red-50/50" : "border-border"
                  }`}
                />
                <p className="text-[10px] text-gray-400 mt-1">Format: YYYY-MM-DD HH:mm (24-hour IST)</p>
                {errors.deadline && (
                  <p className="text-[10px] text-red-500 font-semibold mt-1">{errors.deadline}</p>
                )}
              </div>

              {/* Technical Bid Opening */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Technical Bid Opening Date
                </label>
                <input
                  type="text"
                  value={formData.openingDate || ""}
                  onChange={(e) => handleChange("openingDate", e.target.value)}
                  placeholder="e.g. 2025-05-30 11:00"
                  className="w-full px-3.5 py-2.5 bg-primary-surface border border-border rounded-xl text-xs font-semibold text-gray-900 focus:bg-white focus:border-primary focus:outline-hidden"
                />
                <p className="text-[10px] text-gray-400 mt-1">Scheduled date for scrutiny of envelopes</p>
              </div>
            </div>
          </div>

          {/* Section 4: Specifications & Scope of Work */}
          <div className="bg-white p-6 rounded-3xl border border-border shadow-xs space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-border">
              <FileText className="w-4 h-4 text-primary" />
              <h2 className="font-extrabold text-sm text-text-primary">
                4. Scope of Work & Eligibility Criteria
              </h2>
            </div>

            {/* Scope of Work */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Detailed Scope of Work / Technical Specifications
              </label>
              <textarea
                rows={4}
                value={formData.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Detailed description of works, material specifications, quality tests, site locations, execution guidelines..."
                className="w-full px-3.5 py-2.5 bg-primary-surface border border-border rounded-xl text-xs font-medium text-gray-900 focus:bg-white focus:border-primary focus:outline-hidden leading-relaxed"
              />
            </div>

            {/* Eligibility Criteria Builder */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">
                Mandatory Eligibility Conditions
              </label>

              <div className="space-y-2 mb-3">
                {(formData.eligibilityCriteria || []).map((crit, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-primary-surface border border-border text-xs text-gray-800 font-medium"
                  >
                    <span className="flex-1 pr-3">• {crit}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCriteria(idx)}
                      className="text-gray-400 hover:text-red-600 p-1 transition-colors"
                      title="Remove condition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newCriteriaText}
                  onChange={(e) => setNewCriteriaText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCriteria();
                    }
                  }}
                  placeholder="Type a new eligibility requirement and press Add..."
                  className="flex-1 px-3.5 py-2 bg-white border border-border rounded-xl text-xs font-medium text-gray-800 focus:border-primary focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={handleAddCriteria}
                  className="px-4 py-2 bg-primary-light hover:bg-primary text-primary hover:text-white font-bold text-xs rounded-xl border border-primary/20 transition-all flex items-center gap-1 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Criteria</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section 5: Award & Allocation (Conditional / Expanded) */}
          <div className="bg-white p-6 rounded-3xl border border-border shadow-xs space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-border">
              <Award className="w-4 h-4 text-blue-600" />
              <h2 className="font-extrabold text-sm text-text-primary">
                5. Contract Award & Vendor Allocation (If Finalized)
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Awarded Contractor / Firm
                </label>
                <input
                  type="text"
                  value={formData.awardedTo || ""}
                  onChange={(e) => handleChange("awardedTo", e.target.value)}
                  placeholder="e.g. GeoInfra Tech Solutions Pvt Ltd"
                  className="w-full px-3.5 py-2.5 bg-primary-surface border border-border rounded-xl text-xs font-semibold text-gray-800 focus:bg-white focus:border-primary focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Final Awarded Amount (₹)
                </label>
                <input
                  type="text"
                  value={formData.awardedAmount || ""}
                  onChange={(e) => handleChange("awardedAmount", e.target.value)}
                  placeholder="e.g. ₹74,50,000"
                  className="w-full px-3.5 py-2.5 bg-primary-surface border border-border rounded-xl text-xs font-semibold text-gray-800 focus:bg-white focus:border-primary focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Date of Contract Award
                </label>
                <input
                  type="date"
                  value={formData.awardDate || ""}
                  onChange={(e) => handleChange("awardDate", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-primary-surface border border-border rounded-xl text-xs font-semibold text-gray-800 focus:bg-white focus:border-primary focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Section 6: Document Upload & External Portal */}
          <div className="bg-white p-6 rounded-3xl border border-border shadow-xs space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-border">
              <Upload className="w-4 h-4 text-primary" />
              <h2 className="font-extrabold text-sm text-text-primary">
                6. Tender Document Attachment & External Portal
              </h2>
            </div>

            {/* Cloudinary File Uploader */}
            <div className="p-5 rounded-2xl bg-primary-surface border border-dashed border-border text-center space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.zip,.xlsx"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div className="w-10 h-10 rounded-2xl bg-white mx-auto flex items-center justify-center text-primary shadow-xs border border-border">
                {uploadingFile ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Upload className="w-5 h-5" />
                )}
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingFile}
                  className="px-4 py-2 rounded-xl bg-white border border-border hover:bg-gray-50 text-gray-800 font-bold text-xs shadow-xs transition-colors cursor-pointer inline-flex items-center gap-2"
                >
                  <span>{uploadingFile ? "Uploading to Cloudinary..." : "Choose Tender PDF / Document"}</span>
                </button>
                <p className="text-[11px] text-gray-400 mt-1">Supports PDF, DOCX, ZIP files up to 25 MB</p>
              </div>

              {uploadSuccess && (
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold inline-flex items-center gap-1.5 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{uploadSuccess}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Direct Download URL */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Direct Document Download URL
                </label>
                <input
                  type="text"
                  value={formData.downloadUrl}
                  onChange={(e) => handleChange("downloadUrl", e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 bg-primary-surface border border-border rounded-xl text-xs font-mono font-medium text-gray-800 focus:bg-white focus:border-primary focus:outline-hidden"
                />
              </div>

              {/* Document File Size */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  File Size Label
                </label>
                <input
                  type="text"
                  value={formData.fileSize}
                  onChange={(e) => handleChange("fileSize", e.target.value)}
                  placeholder="e.g. 3.4 MB"
                  className="w-full px-3.5 py-2.5 bg-primary-surface border border-border rounded-xl text-xs font-semibold text-gray-800 focus:bg-white focus:border-primary focus:outline-hidden"
                />
              </div>

              {/* External Portal URL */}
              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  MahaTenders / State E-Procurement URL
                </label>
                <input
                  type="text"
                  value={formData.externalPortalUrl || ""}
                  onChange={(e) => handleChange("externalPortalUrl", e.target.value)}
                  placeholder="https://mahatenders.gov.in"
                  className="w-full px-3.5 py-2.5 bg-primary-surface border border-border rounded-xl text-xs font-mono font-medium text-gray-800 focus:bg-white focus:border-primary focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Section 7: Nodal Officer & Contact Desk */}
          <div className="bg-white p-6 rounded-3xl border border-border shadow-xs space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-border">
              <Phone className="w-4 h-4 text-primary" />
              <h2 className="font-extrabold text-sm text-text-primary">
                7. Nodal Officer & Tender Enquiries Desk
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Nodal Officer Designation
                </label>
                <input
                  type="text"
                  value={formData.contactPerson || ""}
                  onChange={(e) => handleChange("contactPerson", e.target.value)}
                  placeholder="e.g. Executive Engineer (Civil)"
                  className="w-full px-3.5 py-2.5 bg-primary-surface border border-border rounded-xl text-xs font-semibold text-gray-800 focus:bg-white focus:border-primary focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Official Phone / Helpline
                </label>
                <input
                  type="text"
                  value={formData.contactPhone || ""}
                  onChange={(e) => handleChange("contactPhone", e.target.value)}
                  placeholder="e.g. +91 2114 273200"
                  className="w-full px-3.5 py-2.5 bg-primary-surface border border-border rounded-xl text-xs font-semibold text-gray-800 focus:bg-white focus:border-primary focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Official Email
                </label>
                <input
                  type="email"
                  value={formData.contactEmail || ""}
                  onChange={(e) => handleChange("contactEmail", e.target.value)}
                  placeholder="e.g. pwd@lonavalamc.gov.in"
                  className="w-full px-3.5 py-2.5 bg-primary-surface border border-border rounded-xl text-xs font-semibold text-gray-800 focus:bg-white focus:border-primary focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Bottom Save Bar */}
          <div className="p-5 bg-white rounded-3xl border border-border shadow-xs flex items-center justify-between gap-4">
            <Link
              href="/admin/tenders"
              className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:text-gray-900 transition-colors"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{saving ? "Saving..." : isNew ? "Publish Tender" : "Update Tender"}</span>
            </button>
          </div>
        </form>
      ) : (
        /* Preview Citizen View Tab */
        <div className="space-y-6">
          <div className="bg-primary-light/50 p-4 rounded-2xl border border-border flex items-center justify-between text-xs">
            <span className="font-semibold text-gray-700">
              Citizen Portal Preview: This is how bidders & citizens will see this tender on the public website.
            </span>
            <button
              onClick={() => setActiveTab("form")}
              className="px-3 py-1.5 rounded-lg bg-white border border-border font-bold text-primary hover:bg-gray-50"
            >
              Back to Edit Form
            </button>
          </div>

          {/* Public Style Preview Card */}
          <div className="bg-white rounded-3xl border border-border p-6 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono font-bold text-primary text-xs bg-primary-light px-2.5 py-0.5 rounded-md">
                    {formData.tenderId || "LMC/PWD/2025/T-XXX"}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    {formData.status}
                  </span>
                  {formData.category && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">
                      {formData.category}
                    </span>
                  )}
                </div>
                <h2 className="text-lg sm:text-xl font-black text-text-primary">
                  {formData.title || "Tender Title Preview"}
                </h2>
                {formData.marathiTitle && (
                  <p className="text-xs text-gray-600 font-medium mt-1">{formData.marathiTitle}</p>
                )}
                <div className="text-xs text-gray-500 font-semibold mt-2 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-gray-400" />
                  <span>{formData.department}</span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-xs text-gray-400 font-bold uppercase">Estimated Cost</div>
                <div className="text-xl font-black text-gray-900 mt-0.5">
                  {formData.estimatedCost || "₹0.00"}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-primary-surface border border-border text-xs">
              <div>
                <div className="text-[10px] text-gray-400 font-bold">EMD Deposit</div>
                <div className="font-bold text-gray-800">{formData.earnestMoneyDeposit || "Nil"}</div>
              </div>
              <div>
                <div className="text-[10px] text-gray-400 font-bold">Tender Fee</div>
                <div className="font-bold text-gray-800">{formData.tenderFee || "Nil"}</div>
              </div>
              <div>
                <div className="text-[10px] text-gray-400 font-bold">Published Date</div>
                <div className="font-bold text-gray-800">{formData.publishedDate}</div>
              </div>
              <div>
                <div className="text-[10px] text-gray-400 font-bold">Submission Deadline</div>
                <div className="font-bold text-red-600">{formData.deadline || "Not set"}</div>
              </div>
            </div>

            {formData.description && (
              <div className="text-xs text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div className="font-bold text-gray-900 mb-1">Specifications:</div>
                <p>{formData.description}</p>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-border flex-wrap gap-3 text-xs">
              <div className="text-gray-500 font-medium">
                Officer: <span className="font-bold text-gray-800">{formData.contactPerson}</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={formData.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold inline-flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Download Document ({formData.fileSize || "PDF"})</span>
                </a>
                <a
                  href={formData.externalPortalUrl || "https://mahatenders.gov.in"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-primary text-white font-bold inline-flex items-center gap-1.5 shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Bid on MahaTenders ↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
