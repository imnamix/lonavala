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
  Briefcase,
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
  GraduationCap,
  Users,
  UserCheck,
} from "lucide-react";
import { RecruitmentVacancy, RecruitmentStatus } from "@/types";
import {
  getRecruitmentById,
  createRecruitment,
  updateRecruitment,
  RECRUITMENT_DEPARTMENTS,
  RECRUITMENT_GRADES,
  RECRUITMENT_PAY_SCALES,
} from "@/lib/services/recruitment.service";
import { uploadToCloudinary } from "@/lib/services/cloudinary.service";
import { translateToMarathi } from "@/lib/services/translate.service";

interface RecruitmentFormProps {
  recruitmentId?: string;
  isNew?: boolean;
}

export function RecruitmentForm({ recruitmentId, isNew = false }: RecruitmentFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultFileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Omit<RecruitmentVacancy, "id">>({
    advertisementNo: "",
    postName: "",
    marathiPostName: "",
    department: "Public Works (PWD)",
    grade: "Grade B",
    vacancies: 1,
    categoryBreakdown: "Open: 1",
    qualification: "",
    experience: "",
    ageLimit: "18 to 38 years (5 yrs relaxation for reserved)",
    publishedDate: new Date().toISOString().split("T")[0],
    lastDate: "",
    examDate: "",
    status: "Active",
    downloadUrl: "https://mahaonline.gov.in",
    fileName: "",
    fileSize: "1.5 MB",
    payScale: "S-14: ₹38,600 - ₹1,22,800",
    applicationFee: "General / OBC: ₹500 | Reserved: ₹300",
    applyUrl: "https://mahaonline.gov.in",
    selectionProcess: "Computer Based Written Test (100 marks) + Educational Merit & Document Scrutiny",
    instructions: "Apply online through MahaOnline portal. Hard copies will not be accepted.",
    resultsUrl: "",
    resultsFileName: "",
    selectedCandidatesCount: undefined,
    contactEmail: "recruitment@lonavalamc.gov.in",
    contactPhone: "+91 2114 273200",
    isNew: true,
  });

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploadingAdvt, setUploadingAdvt] = useState(false);
  const [uploadingResult, setUploadingResult] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [translating, setTranslating] = useState(false);
  const [savedToast, setSavedToast] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<"form" | "preview">("form");

  const generateAdvtNo = () => {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(10 + Math.random() * 90);
    return `LMC/EST/${randomNum}/${year}`;
  };

  // Load existing recruitment for editing
  useEffect(() => {
    async function loadRecruitment() {
      if (!isNew && recruitmentId) {
        setLoading(true);
        try {
          const existing = await getRecruitmentById(recruitmentId);
          if (existing) {
            setFormData(existing);
          } else {
            setErrors({ general: "Recruitment notice not found with given ID." });
          }
        } catch (err) {
          console.error("Failed to load recruitment:", err);
          setErrors({ general: "Failed to retrieve recruitment record." });
        } finally {
          setLoading(false);
        }
      } else if (isNew) {
        const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
        setFormData((prev) => ({
          ...prev,
          advertisementNo: generateAdvtNo(),
          lastDate: nextMonth,
        }));
      }
    }
    loadRecruitment();
  }, [recruitmentId, isNew]);

  const handleChange = (
    field: keyof Omit<RecruitmentVacancy, "id">,
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

  // Auto-translate post name to Marathi
  const handleAutoTranslate = async () => {
    if (!formData.postName || !formData.postName.trim()) {
      setErrors((prev) => ({ ...prev, postName: "Enter English post name first to auto-translate." }));
      return;
    }
    try {
      setTranslating(true);
      const translated = await translateToMarathi(formData.postName);
      if (translated) {
        setFormData((prev) => ({ ...prev, marathiPostName: translated }));
      }
    } catch (err) {
      console.error("Translation error:", err);
    } finally {
      setTranslating(false);
    }
  };

  // Cloudinary Advt PDF Upload
  const handleAdvtUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingAdvt(true);
      setUploadSuccess(null);

      const asset = await uploadToCloudinary(file, "lonavala/recruitment");
      const targetUrl = asset.secure_url || asset.url;
      const calcSize = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

      setFormData((prev) => ({
        ...prev,
        downloadUrl: targetUrl,
        fileName: file.name,
        fileSize: calcSize,
      }));

      setUploadSuccess(`Advertisement document "${file.name}" uploaded successfully.`);
      setTimeout(() => setUploadSuccess(null), 4000);
    } catch (err: any) {
      console.error("Advertisement upload error:", err);
      setErrors((prev) => ({
        ...prev,
        file: err.message || "Failed to upload file to Cloudinary.",
      }));
    } finally {
      setUploadingAdvt(false);
      if (e.target) e.target.value = "";
    }
  };

  // Cloudinary Results List Upload
  const handleResultsUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingResult(true);
      setUploadSuccess(null);

      const asset = await uploadToCloudinary(file, "lonavala/recruitment/results");
      const targetUrl = asset.secure_url || asset.url;

      setFormData((prev) => ({
        ...prev,
        resultsUrl: targetUrl,
        resultsFileName: file.name,
      }));

      setUploadSuccess(`Results PDF "${file.name}" uploaded successfully.`);
      setTimeout(() => setUploadSuccess(null), 4000);
    } catch (err: any) {
      console.error("Results upload error:", err);
      setErrors((prev) => ({
        ...prev,
        resultsFile: err.message || "Failed to upload results PDF.",
      }));
    } finally {
      setUploadingResult(false);
      if (e.target) e.target.value = "";
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.advertisementNo.trim()) newErrors.advertisementNo = "Advertisement number is required.";
    if (!formData.postName.trim()) newErrors.postName = "Post designation name is required.";
    if (!formData.department.trim()) newErrors.department = "Department is required.";
    if (!formData.qualification.trim()) newErrors.qualification = "Essential qualifications are required.";
    if (!formData.lastDate.trim()) newErrors.lastDate = "Application deadline is required.";
    if (formData.vacancies <= 0) newErrors.vacancies = "Must specify at least 1 vacancy.";

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
        await createRecruitment(formData);
      } else if (recruitmentId) {
        await updateRecruitment(recruitmentId, formData);
      }
      setSavedToast(true);
      setTimeout(() => {
        router.push("/admin/recruitment");
      }, 1200);
    } catch (err: any) {
      console.error("Failed to save recruitment:", err);
      setErrors((prev) => ({
        ...prev,
        general: err.message || "Failed to save recruitment record.",
      }));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-gray-500 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
        <p className="text-xs font-semibold">Loading vacancy details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Toast alert */}
      {savedToast && (
        <div className="fixed top-6 right-6 z-50 bg-gray-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-white/10 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Recruitment notice {isNew ? "created" : "updated"} successfully! Redirecting...</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-white p-5 rounded-3xl border border-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/recruitment"
            className="p-2.5 rounded-2xl bg-primary-surface hover:bg-primary-light text-gray-700 hover:text-primary transition-colors border border-border"
            title="Back to Recruitment list"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight">
                {isNew ? "Create Vacancy Advertisement" : `Edit Notice: ${formData.advertisementNo}`}
              </h1>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-primary-light text-primary">
                {isNew ? "New Posting" : "Editing Notice"}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Publish official employment notifications, required qualifications, reservation quotas, and exam dates.
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
            <span>{saving ? "Saving..." : isNew ? "Publish Notice" : "Update Notice"}</span>
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
          {/* Section 1: Post Identification & Department */}
          <div className="bg-white p-6 rounded-3xl border border-border shadow-xs space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-border">
              <Briefcase className="w-4 h-4 text-primary" />
              <h2 className="font-extrabold text-sm text-text-primary">
                1. Advertisement Number & Designation Classification
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Advertisement No */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-gray-700">
                    Advertisement No <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleChange("advertisementNo", generateAdvtNo())}
                    className="text-[10px] font-bold text-primary hover:underline"
                  >
                    Auto-Generate
                  </button>
                </div>
                <input
                  type="text"
                  value={formData.advertisementNo}
                  onChange={(e) => handleChange("advertisementNo", e.target.value)}
                  placeholder="e.g. LMC/EST/01/2025"
                  className={`w-full px-3.5 py-2.5 bg-primary-surface border rounded-xl text-xs font-mono font-bold text-gray-900 focus:bg-white focus:border-primary focus:outline-hidden ${
                    errors.advertisementNo ? "border-red-400 bg-red-50/50" : "border-border"
                  }`}
                />
                {errors.advertisementNo && (
                  <p className="text-[10px] text-red-500 font-semibold mt-1">{errors.advertisementNo}</p>
                )}
              </div>

              {/* Department */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Cadre Department <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => handleChange("department", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-primary-surface border border-border rounded-xl text-xs font-semibold text-gray-800 focus:bg-white focus:border-primary focus:outline-hidden"
                >
                  {RECRUITMENT_DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Grade */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Post Cadre Grade
                </label>
                <select
                  value={formData.grade}
                  onChange={(e) => handleChange("grade", e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-primary-surface border border-border rounded-xl text-xs font-semibold text-gray-800 focus:bg-white focus:border-primary focus:outline-hidden"
                >
                  {RECRUITMENT_GRADES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              {/* Workflow Status */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Recruitment Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange("status", e.target.value as RecruitmentStatus)}
                  className="w-full px-3.5 py-2.5 bg-primary-surface border border-border rounded-xl text-xs font-bold text-gray-800 focus:bg-white focus:border-primary focus:outline-hidden"
                >
                  <option value="Active">Active (Accepting Applications)</option>
                  <option value="Scrutiny">Scrutiny of Applications</option>
                  <option value="Exam / Interview">Exam / Interview Stage</option>
                  <option value="Result Declared">Result Declared (Merit List Out)</option>
                  <option value="Archived">Archived (Recruitment Concluded)</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* Vacancy Count */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Total Vacant Posts <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  value={formData.vacancies}
                  onChange={(e) => handleChange("vacancies", parseInt(e.target.value) || 1)}
                  className="w-full px-3.5 py-2.5 bg-primary-surface border border-border rounded-xl text-xs font-extrabold text-primary focus:bg-white focus:border-primary focus:outline-hidden"
                />
              </div>

              {/* Category Reservation Breakdown */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Reservation Quota Breakdown
                </label>
                <input
                  type="text"
                  value={formData.categoryBreakdown || ""}
                  onChange={(e) => handleChange("categoryBreakdown", e.target.value)}
                  placeholder="e.g. Open: 2, OBC: 1, SC: 1"
                  className="w-full px-3.5 py-2.5 bg-primary-surface border border-border rounded-xl text-xs font-semibold text-gray-800 focus:bg-white focus:border-primary focus:outline-hidden"
                />
              </div>
            </div>

            {/* Post Name (English) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-gray-700">
                  Post Designation (English) <span className="text-red-500">*</span>
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
              <input
                type="text"
                value={formData.postName}
                onChange={(e) => handleChange("postName", e.target.value)}
                placeholder="e.g. Junior Engineer (Civil) - Grade B"
                className={`w-full px-3.5 py-2.5 bg-primary-surface border rounded-xl text-xs font-bold text-gray-900 focus:bg-white focus:border-primary focus:outline-hidden ${
                  errors.postName ? "border-red-400 bg-red-50/50" : "border-border"
                }`}
              />
              {errors.postName && (
                <p className="text-[10px] text-red-500 font-semibold mt-1">{errors.postName}</p>
              )}
            </div>

            {/* Post Name (Marathi) */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Post Designation in Marathi (मराठी पदनाम)
              </label>
              <input
                type="text"
                value={formData.marathiPostName || ""}
                onChange={(e) => handleChange("marathiPostName", e.target.value)}
                placeholder="उदा. कनिष्ठ अभियंता (स्थापत्य) - श्रेणी ब"
                className="w-full px-3.5 py-2.5 bg-primary-surface border border-border rounded-xl text-xs font-semibold text-gray-900 focus:bg-white focus:border-primary focus:outline-hidden"
              />
            </div>
          </div>

          {/* Section 2: Pay Scale & Application Fees */}
          <div className="bg-white p-6 rounded-3xl border border-border shadow-xs space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-border">
              <IndianRupee className="w-4 h-4 text-emerald-600" />
              <h2 className="font-extrabold text-sm text-text-primary">
                2. Salary Pay Scale, Age Criteria & Application Fee
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Pay Scale */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Salary Pay Scale
                </label>
                <select
                  value={formData.payScale}
                  onChange={(e) => handleChange("payScale", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-primary-surface border border-border rounded-xl text-xs font-bold text-gray-800 focus:bg-white focus:border-primary focus:outline-hidden"
                >
                  {RECRUITMENT_PAY_SCALES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {/* Age Limit */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Permissible Age Range
                </label>
                <input
                  type="text"
                  value={formData.ageLimit || ""}
                  onChange={(e) => handleChange("ageLimit", e.target.value)}
                  placeholder="e.g. 18 to 38 years (5 yrs relaxation)"
                  className="w-full px-3.5 py-2.5 bg-primary-surface border border-border rounded-xl text-xs font-semibold text-gray-800 focus:bg-white focus:border-primary focus:outline-hidden"
                />
              </div>

              {/* Application Fee */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Application Processing Fee
                </label>
                <input
                  type="text"
                  value={formData.applicationFee || ""}
                  onChange={(e) => handleChange("applicationFee", e.target.value)}
                  placeholder="e.g. General: ₹500 | Reserved: ₹300"
                  className="w-full px-3.5 py-2.5 bg-primary-surface border border-border rounded-xl text-xs font-semibold text-gray-800 focus:bg-white focus:border-primary focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Key Deadlines & Timelines */}
          <div className="bg-white p-6 rounded-3xl border border-border shadow-xs space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-border">
              <Clock className="w-4 h-4 text-amber-600" />
              <h2 className="font-extrabold text-sm text-text-primary">
                3. Application Schedules & Exam Timelines
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Published Date */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Notice Publication Date
                </label>
                <input
                  type="date"
                  value={formData.publishedDate || ""}
                  onChange={(e) => handleChange("publishedDate", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-primary-surface border border-border rounded-xl text-xs font-semibold text-gray-800 focus:bg-white focus:border-primary focus:outline-hidden"
                />
              </div>

              {/* Last Date */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Application Deadline Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.lastDate}
                  onChange={(e) => handleChange("lastDate", e.target.value)}
                  className={`w-full px-3.5 py-2.5 bg-primary-surface border rounded-xl text-xs font-bold text-gray-900 focus:bg-white focus:border-primary focus:outline-hidden ${
                    errors.lastDate ? "border-red-400 bg-red-50/50" : "border-border"
                  }`}
                />
                {errors.lastDate && (
                  <p className="text-[10px] text-red-500 font-semibold mt-1">{errors.lastDate}</p>
                )}
              </div>

              {/* Exam Date */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Scheduled Exam / Interview Date
                </label>
                <input
                  type="date"
                  value={formData.examDate || ""}
                  onChange={(e) => handleChange("examDate", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-primary-surface border border-border rounded-xl text-xs font-semibold text-gray-800 focus:bg-white focus:border-primary focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Qualifications & Selection Procedure */}
          <div className="bg-white p-6 rounded-3xl border border-border shadow-xs space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-border">
              <GraduationCap className="w-4 h-4 text-primary" />
              <h2 className="font-extrabold text-sm text-text-primary">
                4. Qualifications, Experience & Selection Scheme
              </h2>
            </div>

            {/* Essential Qualification */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Essential Educational Qualifications <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                value={formData.qualification}
                onChange={(e) => handleChange("qualification", e.target.value)}
                placeholder="e.g. Degree / Diploma in Civil Engineering from recognized university. MSCIT certificate is mandatory."
                className={`w-full px-3.5 py-2.5 bg-primary-surface border rounded-xl text-xs font-medium text-gray-900 focus:bg-white focus:border-primary focus:outline-hidden leading-relaxed ${
                  errors.qualification ? "border-red-400 bg-red-50/50" : "border-border"
                }`}
              />
              {errors.qualification && (
                <p className="text-[10px] text-red-500 font-semibold mt-1">{errors.qualification}</p>
              )}
            </div>

            {/* Experience */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Required Experience & Practical Skills
              </label>
              <textarea
                rows={2}
                value={formData.experience || ""}
                onChange={(e) => handleChange("experience", e.target.value)}
                placeholder="e.g. Minimum 2 years field experience in civil construction or municipal works."
                className="w-full px-3.5 py-2.5 bg-primary-surface border border-border rounded-xl text-xs font-medium text-gray-900 focus:bg-white focus:border-primary focus:outline-hidden"
              />
            </div>

            {/* Selection Process */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Selection Procedure / Examination Scheme
              </label>
              <textarea
                rows={2}
                value={formData.selectionProcess || ""}
                onChange={(e) => handleChange("selectionProcess", e.target.value)}
                placeholder="e.g. Computer Based Written Test (100 marks) + Educational Merit & Document Scrutiny"
                className="w-full px-3.5 py-2.5 bg-primary-surface border border-border rounded-xl text-xs font-medium text-gray-900 focus:bg-white focus:border-primary focus:outline-hidden"
              />
            </div>

            {/* Instructions */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Candidate General Instructions
              </label>
              <textarea
                rows={2}
                value={formData.instructions || ""}
                onChange={(e) => handleChange("instructions", e.target.value)}
                placeholder="e.g. Candidates must submit applications online on MahaOnline. Hard copies will not be accepted."
                className="w-full px-3.5 py-2.5 bg-primary-surface border border-border rounded-xl text-xs font-medium text-gray-900 focus:bg-white focus:border-primary focus:outline-hidden"
              />
            </div>
          </div>

          {/* Section 5: Documents & Results */}
          <div className="bg-white p-6 rounded-3xl border border-border shadow-xs space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-border">
              <Upload className="w-4 h-4 text-primary" />
              <h2 className="font-extrabold text-sm text-text-primary">
                5. Official PDF Gazette Attachment & Selection Results
              </h2>
            </div>

            {/* Advertisement PDF Uploader */}
            <div className="p-5 rounded-2xl bg-primary-surface border border-dashed border-border text-center space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx"
                onChange={handleAdvtUpload}
                className="hidden"
              />

              <div className="w-10 h-10 rounded-2xl bg-white mx-auto flex items-center justify-center text-primary shadow-xs border border-border">
                {uploadingAdvt ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Upload className="w-5 h-5" />
                )}
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingAdvt}
                  className="px-4 py-2 rounded-xl bg-white border border-border hover:bg-gray-50 text-gray-800 font-bold text-xs shadow-xs transition-colors cursor-pointer inline-flex items-center gap-2"
                >
                  <span>{uploadingAdvt ? "Uploading Advt PDF..." : "Upload Official Advertisement PDF"}</span>
                </button>
                <p className="text-[11px] text-gray-400 mt-1">Upload syllabus, detailed notification, and job guidelines</p>
              </div>

              {uploadSuccess && (
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold inline-flex items-center gap-1.5 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{uploadSuccess}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Direct Advertisement Download URL
                </label>
                <input
                  type="text"
                  value={formData.downloadUrl}
                  onChange={(e) => handleChange("downloadUrl", e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 bg-primary-surface border border-border rounded-xl text-xs font-mono font-medium text-gray-800 focus:bg-white focus:border-primary focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Online Application URL
                </label>
                <input
                  type="text"
                  value={formData.applyUrl || "https://mahaonline.gov.in"}
                  onChange={(e) => handleChange("applyUrl", e.target.value)}
                  placeholder="https://mahaonline.gov.in"
                  className="w-full px-3.5 py-2.5 bg-primary-surface border border-border rounded-xl text-xs font-mono font-medium text-gray-800 focus:bg-white focus:border-primary focus:outline-hidden"
                />
              </div>
            </div>

            {/* Results Selection Merit List (If Results Declared) */}
            <div className="pt-4 border-t border-border space-y-4">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-xs text-gray-900">
                  Selection Results & Merit List (Optional / Post-Exam)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Selected Candidates Count
                  </label>
                  <input
                    type="number"
                    value={formData.selectedCandidatesCount || ""}
                    onChange={(e) => handleChange("selectedCandidatesCount", parseInt(e.target.value) || undefined)}
                    placeholder="e.g. 3"
                    className="w-full px-3.5 py-2.5 bg-primary-surface border border-border rounded-xl text-xs font-semibold text-gray-800 focus:bg-white focus:border-primary focus:outline-hidden"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Final Results / Merit List PDF URL
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={formData.resultsUrl || ""}
                      onChange={(e) => handleChange("resultsUrl", e.target.value)}
                      placeholder="https://.../merit_list.pdf"
                      className="flex-1 px-3.5 py-2.5 bg-primary-surface border border-border rounded-xl text-xs font-mono font-medium text-gray-800 focus:bg-white focus:border-primary focus:outline-hidden"
                    />
                    <input
                      ref={resultFileInputRef}
                      type="file"
                      accept=".pdf"
                      onChange={handleResultsUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => resultFileInputRef.current?.click()}
                      disabled={uploadingResult}
                      className="px-3 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors shrink-0"
                    >
                      {uploadingResult ? "Uploading..." : "Upload PDF"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 6: Helpdesk & Contacts */}
          <div className="bg-white p-6 rounded-3xl border border-border shadow-xs space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-border">
              <Phone className="w-4 h-4 text-primary" />
              <h2 className="font-extrabold text-sm text-text-primary">
                6. Recruitment Helpdesk & Enquiries
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Helpline Phone Number
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
                  Helpdesk Email Address
                </label>
                <input
                  type="email"
                  value={formData.contactEmail || ""}
                  onChange={(e) => handleChange("contactEmail", e.target.value)}
                  placeholder="e.g. recruitment@lonavalamc.gov.in"
                  className="w-full px-3.5 py-2.5 bg-primary-surface border border-border rounded-xl text-xs font-semibold text-gray-800 focus:bg-white focus:border-primary focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Bottom Save Bar */}
          <div className="p-5 bg-white rounded-3xl border border-border shadow-xs flex items-center justify-between gap-4">
            <Link
              href="/admin/recruitment"
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
              <span>{saving ? "Saving..." : isNew ? "Publish Notice" : "Update Notice"}</span>
            </button>
          </div>
        </form>
      ) : (
        /* Preview Citizen View Tab */
        <div className="space-y-6">
          <div className="bg-primary-light/50 p-4 rounded-2xl border border-border flex items-center justify-between text-xs">
            <span className="font-semibold text-gray-700">
              Citizen Portal Preview: This is how job seekers will see this vacancy card on the public website.
            </span>
            <button
              onClick={() => setActiveTab("form")}
              className="px-3 py-1.5 rounded-lg bg-white border border-border font-bold text-primary hover:bg-gray-50"
            >
              Back to Edit Form
            </button>
          </div>

          {/* Public Style Preview Card */}
          <div className="bg-white rounded-3xl border border-border p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-primary bg-primary-light px-2.5 py-1 rounded-full">
                Advt: {formData.advertisementNo || "LMC/EST/XX/2025"}
              </span>
              <div className="flex items-center gap-2">
                {formData.grade && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">
                    {formData.grade}
                  </span>
                )}
                <span className="text-xs font-bold text-gray-700 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-200">
                  {formData.vacancies} {formData.vacancies === 1 ? "Post" : "Posts"}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-bold text-text-primary leading-snug">
                {formData.postName || "Designation Preview"}
              </h3>
              {formData.marathiPostName && (
                <p className="text-xs text-gray-600 font-medium mt-0.5">{formData.marathiPostName}</p>
              )}
              <div className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-gray-400" />
                <span>Department: {formData.department}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-primary-surface border border-border space-y-1.5 text-xs text-gray-700">
              <div>
                <strong>Qualification:</strong> {formData.qualification || "Educational qualifications not specified"}
              </div>
              {formData.experience && (
                <div>
                  <strong>Experience:</strong> {formData.experience}
                </div>
              )}
              <div>
                <strong>Pay Scale:</strong> {formData.payScale}
              </div>
              <div className="text-red-600 font-semibold">
                <strong>Last Date to Apply:</strong> {formData.lastDate || "Not set"}
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between flex-wrap gap-2 text-xs">
              <a
                href={formData.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-primary hover:underline flex items-center gap-1"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Download Detailed Notification ({formData.fileSize || "PDF"})</span>
              </a>

              <a
                href={formData.applyUrl || "https://mahaonline.gov.in"}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-xs transition-colors"
              >
                Apply Online ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
