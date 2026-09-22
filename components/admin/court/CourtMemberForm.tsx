"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Upload,
  User,
  CheckCircle2,
  Trash2,
  Camera,
  Loader2,
  ExternalLink,
  ImageIcon,
} from "lucide-react";
import { CourtCommitteeMember } from "@/types";
import { createMember, updateMember } from "@/lib/services/court.service";
import { uploadToCloudinary } from "@/lib/services/cloudinary.service";

interface CourtMemberFormProps {
  initialData?: CourtCommitteeMember;
  isEdit?: boolean;
}

export function CourtMemberForm({ initialData, isEdit = false }: CourtMemberFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profileImage, setProfileImage] = useState<string>(initialData?.image || "");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("Image file size should be less than 10MB");
      return;
    }

    try {
      setUploadingPhoto(true);
      setError(null);
      setUploadSuccess(null);

      // Upload to Cloudinary folder: lonavala/court
      const asset = await uploadToCloudinary(file, "lonavala/court");
      const targetUrl = asset.secure_url || asset.url;

      setProfileImage(targetUrl);
      setUploadSuccess(`Photo uploaded to Cloudinary: ${asset.original_filename || file.name}`);
      setTimeout(() => setUploadSuccess(null), 5000);
    } catch (err: any) {
      console.error("Court member Cloudinary upload error:", err);
      setError(err?.message || "Failed to upload photo to Cloudinary.");
    } finally {
      setUploadingPhoto(false);
      if (e.target) e.target.value = "";
    }
  };

  const handleRemovePhoto = () => {
    setProfileImage("");
    setUploadSuccess(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      const responsibilitiesRaw = (formData.get("responsibilities") as string) || "";
      const responsibilities = responsibilitiesRaw
        .split("\n")
        .map((r) => r.trim())
        .filter(Boolean);

      const memberPayload: Omit<CourtCommitteeMember, "id"> = {
        name: (formData.get("name") as string)?.trim() || "",
        marathiName: (formData.get("marathiName") as string)?.trim() || "",
        designation: (formData.get("designation") as string)?.trim() || "",
        role: (formData.get("role") as string)?.trim() || "Member",
        category: ((formData.get("category") as string) || "Committee Member") as any,
        phone: (formData.get("phone") as string)?.trim() || "",
        email: (formData.get("email") as string)?.trim() || "",
        ward: (formData.get("ward") as string)?.trim() || "",
        experience: (formData.get("experience") as string)?.trim() || "",
        image: profileImage,
        responsibilities: responsibilities.length > 0 ? responsibilities : ["Municipal Legal Coordination & Representation"],
      };

      if (!memberPayload.name) {
        setError("Member full name is required.");
        setSubmitting(false);
        return;
      }

      if (isEdit && initialData) {
        await updateMember(initialData.id, memberPayload);
      } else {
        await createMember(memberPayload);
      }

      setToastMessage(isEdit ? "Member profile updated successfully!" : "New member created successfully!");
      setTimeout(() => {
        router.push("/admin/court/members");
      }, 1000);
    } catch (err) {
      console.error(err);
      setError("Failed to save member profile.");
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-primary text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-border shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/court/members"
            className="p-2.5 rounded-2xl bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors border border-border"
            title="Back to Members List"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-text-primary">
              {isEdit ? "Edit Committee Member" : "Add New Committee Member"}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {isEdit
                ? `Update details and profile photo for ${initialData?.name}`
                : "Fill in member details, responsibilities, and upload profile photo to Cloudinary."}
            </p>
          </div>
        </div>
      </div>

      {/* Main Form Card */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-border shadow-xs space-y-6">
        {error && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Profile Photo Cloudinary Upload Section */}
        <div className="p-5 rounded-2xl bg-gray-50/75 border border-gray-100 flex flex-col sm:flex-row items-center gap-5">
          <div className="relative group shrink-0">
            {profileImage ? (
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-primary/30 shadow-xs relative bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profileImage}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                />
                {uploadingPhoto && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  </div>
                )}
              </div>
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-gray-200 text-gray-400 flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
                {uploadingPhoto ? (
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                ) : (
                  <>
                    <User className="w-8 h-8 mb-1" />
                    <span className="text-[10px] font-bold">No Photo</span>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2 text-center sm:text-left flex-1 min-w-0">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h3 className="text-sm font-bold text-text-primary">Profile Photo (Cloudinary CDN)</h3>
              {profileImage && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Cloudinary Hosted
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">
              Upload member photo directly to Cloudinary (<code className="text-primary font-mono text-[10px]">lonavala/court</code>). Auto-converted to optimized WebP.
            </p>

            {uploadSuccess && (
              <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1 justify-center sm:justify-start">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{uploadSuccess}</span>
              </p>
            )}

            <div className="pt-1 flex flex-wrap items-center gap-2.5 justify-center sm:justify-start">
              <button
                type="button"
                disabled={uploadingPhoto}
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-border text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer shadow-xs transition-colors disabled:opacity-60"
              >
                {uploadingPhoto ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
                    <span>Uploading to Cloudinary...</span>
                  </>
                ) : (
                  <>
                    <Camera className="w-3.5 h-3.5 text-primary" />
                    <span>{profileImage ? "Change Photo" : "Upload to Cloudinary"}</span>
                  </>
                )}
              </button>

              {profileImage && !uploadingPhoto && (
                <>
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="px-3 py-2 rounded-xl bg-white border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    title="Remove Photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>

                  <a
                    href={profileImage}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 rounded-xl bg-white border border-border text-gray-600 hover:text-primary text-xs font-semibold flex items-center gap-1 transition-colors"
                    title="Preview full image"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </a>
                </>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/jpg"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
              Full Name (English) *
            </label>
            <input
              type="text"
              name="name"
              required
              defaultValue={initialData?.name || ""}
              placeholder="e.g., Adv. Rajesh V. Deshmukh"
              className="w-full px-4 py-2.5 text-xs rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
              पूर्ण नाव (मराठी)
            </label>
            <input
              type="text"
              name="marathiName"
              defaultValue={initialData?.marathiName || ""}
              placeholder="उदा. अ‍ॅड. राजेश वि. देशमुख"
              className="w-full px-4 py-2.5 text-xs rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-marathi"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
              Committee Role *
            </label>
            <input
              type="text"
              name="role"
              required
              defaultValue={initialData?.role || "Elected Member"}
              placeholder="e.g., Chairman / Vice Chairperson / Member"
              className="w-full px-4 py-2.5 text-xs rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
              Category *
            </label>
            <select
              name="category"
              defaultValue={initialData?.category || "Committee Member"}
              className="w-full px-4 py-2.5 text-xs rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
            >
              <option value="Leadership">Leadership</option>
              <option value="Committee Member">Committee Member</option>
              <option value="Legal Officer">Legal Officer</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
            Full Designation / पदनाम
          </label>
          <input
            type="text"
            name="designation"
            defaultValue={initialData?.designation || ""}
            placeholder="e.g., Chairman, Legal & Law Committee (सभापती, विधी व न्याय समिती)"
            className="w-full px-4 py-2.5 text-xs rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
              Ward / Division
            </label>
            <input
              type="text"
              name="ward"
              defaultValue={initialData?.ward || ""}
              placeholder="e.g., Ward 04 - Ryewood"
              className="w-full px-4 py-2.5 text-xs rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
              Phone Number
            </label>
            <input
              type="text"
              name="phone"
              defaultValue={initialData?.phone || ""}
              placeholder="e.g., +91 2114 273201"
              className="w-full px-4 py-2.5 text-xs rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              defaultValue={initialData?.email || ""}
              placeholder="e.g., legal.chair@lonavalacouncil.gov.in"
              className="w-full px-4 py-2.5 text-xs rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
            Experience & Tenure Background
          </label>
          <input
            type="text"
            name="experience"
            defaultValue={initialData?.experience || ""}
            placeholder="e.g., 18+ years in Municipal Law & Civil Jurisprudence"
            className="w-full px-4 py-2.5 text-xs rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
            Key Responsibilities (One per line)
          </label>
          <textarea
            name="responsibilities"
            rows={4}
            defaultValue={initialData?.responsibilities?.join("\n") || ""}
            placeholder="Presiding over municipal legal review meetings&#10;Evaluating High Court writ petitions and appeals&#10;Supervising Lok Adalat revenue settlements"
            className="w-full px-4 py-2.5 text-xs rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-sans leading-relaxed"
          ></textarea>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <Link
            href="/admin/court/members"
            className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting || uploadingPhoto}
            className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs transition-colors shadow-xs disabled:opacity-60 flex items-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : isEdit ? (
              "Update Member"
            ) : (
              "Create Member"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
