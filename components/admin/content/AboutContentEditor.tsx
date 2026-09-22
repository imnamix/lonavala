"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import {
  Save,
  CheckCircle2,
  ExternalLink,
  Eye,
  Target,
  Plus,
  Trash2,
  Upload,
  FileImage,
  ImageIcon,
  Loader2,
  RefreshCw,
  X,
  Copy,
  Check,
  AlertCircle,
  Video,
} from "lucide-react";
import Link from "next/link";
import "react-quill-new/dist/quill.snow.css";
import {
  getAboutUsData,
  updateAboutUsData,
  AboutUsData,
} from "@/lib/services/about.service";
import { uploadToCloudinary } from "@/lib/services/cloudinary.service";

// Dynamic import for ReactQuill to disable SSR
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="h-44 bg-gray-50 rounded-xl border border-gray-200 animate-pulse flex items-center justify-center text-xs text-gray-400">
      Loading Rich Text Editor...
    </div>
  ),
});

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "link"],
    ["clean"],
  ],
};

export function AboutContentEditor() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Upload States
  const [uploadingHeritageImage, setUploadingHeritageImage] = useState(false);
  const [uploadingPortraitImage, setUploadingPortraitImage] = useState(false);
  const [heritageUploadSuccess, setHeritageUploadSuccess] = useState<string | null>(null);
  const [portraitUploadSuccess, setPortraitUploadSuccess] = useState<string | null>(null);

  // Preview Modal
  const [previewModalUrl, setPreviewModalUrl] = useState<string | null>(null);
  const [previewModalTitle, setPreviewModalTitle] = useState<string>("Media Preview");
  const [copiedLink, setCopiedLink] = useState(false);

  const heritageFileInputRef = useRef<HTMLInputElement>(null);
  const portraitFileInputRef = useRef<HTMLInputElement>(null);

  // 1. Historical Legacy
  const [history, setHistory] = useState({
    sectionTitle: "Over a Century of Hill-Station Stewardship",
    establishedYear: "1877",
    yearsOfService: "148+ Years of Civic Service",
    elevation: "624 meters in the Sahyadri Western Ghats",
    imageUrl: "",
    description: "",
  });

  // 2. Vision & Mission
  const [visionMission, setVisionMission] = useState({
    visionText: "",
    missionPoints: [] as string[],
  });

  // 3. Commissioner Communiqué
  const [communique, setCommunique] = useState({
    officerName: "",
    designation: "",
    phone: "",
    email: "",
    imageUrl: "",
    title: "",
    subtitle: "",
    messageBody: "",
    signOff: "",
  });

  // Load Data from API on Mount
  const loadData = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const data: AboutUsData = await getAboutUsData();

      setHistory({
        sectionTitle: data.title || "Over a Century of Hill-Station Stewardship",
        establishedYear: data.establishedYear || "1877",
        yearsOfService: data.yearsOfService || "148+ Years of Civic Service",
        elevation: data.elevation || "624 meters in the Sahyadri Western Ghats",
        imageUrl: data.mediaUrl || "",
        description: data.description || "",
      });

      setVisionMission({
        visionText: data.vision || "",
        missionPoints:
          data.mission && data.mission.length > 0
            ? data.mission
            : [
              "Deliver 100% door-to-door segregated waste processing and plastic-free tourism.",
              "Provide 24x7 treated potable water supply and eco-conscious underground sewerage.",
              "Enforce zero-tolerance transparency through time-bound online grievance redressal.",
              "Promote green building regulations and protect Sahyadri forest watersheds.",
            ],
      });

      setCommunique({
        officerName: data.communique?.officerName || "",
        designation: data.communique?.designation || "",
        phone: data.communique?.phone || "",
        email: data.communique?.email || "",
        imageUrl: data.communique?.mediaUrl || "",
        title: data.communique?.title || "",
        subtitle: data.communique?.subtitle || "",
        messageBody: data.communique?.messageBody || "",
        signOff: data.communique?.signOff || "",
      });
    } catch (err: any) {
      console.error("Failed to load About Us content:", err);
      setErrorMessage(err.message || "Failed to load About Us data from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Upload Heritage Image to Cloudinary
  const handleHeritageImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingHeritageImage(true);
      setErrorMessage(null);
      setHeritageUploadSuccess(null);

      const asset = await uploadToCloudinary(file, "lonavala/about");
      const targetUrl = asset.secure_url || asset.url;

      setHistory((prev) => ({
        ...prev,
        imageUrl: targetUrl,
      }));

      setHeritageUploadSuccess(`Heritage image uploaded: ${asset.original_filename || file.name}`);
      setTimeout(() => setHeritageUploadSuccess(null), 5000);
    } catch (err: any) {
      console.error("Heritage image upload error:", err);
      setErrorMessage(err.message || "Failed to upload heritage image to Cloudinary.");
    } finally {
      setUploadingHeritageImage(false);
      if (e.target) e.target.value = "";
    }
  };

  // Upload Portrait Image to Cloudinary
  const handlePortraitImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingPortraitImage(true);
      setErrorMessage(null);
      setPortraitUploadSuccess(null);

      const asset = await uploadToCloudinary(file, "lonavala/about");
      const targetUrl = asset.secure_url || asset.url;

      setCommunique((prev) => ({
        ...prev,
        imageUrl: targetUrl,
      }));

      setPortraitUploadSuccess(`Portrait uploaded: ${asset.original_filename || file.name}`);
      setTimeout(() => setPortraitUploadSuccess(null), 5000);
    } catch (err: any) {
      console.error("Portrait image upload error:", err);
      setErrorMessage(err.message || "Failed to upload portrait image to Cloudinary.");
    } finally {
      setUploadingPortraitImage(false);
      if (e.target) e.target.value = "";
    }
  };

  // Save to Backend API
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setErrorMessage(null);

      const payload = {
        title: history.sectionTitle,
        establishedYear: history.establishedYear,
        yearsOfService: history.yearsOfService,
        elevation: history.elevation,
        mediaUrl: history.imageUrl,
        description: history.description,
        vision: visionMission.visionText,
        mission: visionMission.missionPoints.filter((p) => p.trim() !== ""),
        communique: {
          officerName: communique.officerName,
          designation: communique.designation,
          phone: communique.phone,
          email: communique.email,
          mediaUrl: communique.imageUrl,
          title: communique.title,
          subtitle: communique.subtitle,
          messageBody: communique.messageBody,
          signOff: communique.signOff,
        },
      };

      await updateAboutUsData(payload);
      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    } catch (err: any) {
      console.error("Failed to save About Us content:", err);
      setErrorMessage(err.message || "Failed to save About Us changes to API.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-12 rounded-3xl border border-border shadow-xs flex flex-col items-center justify-center space-y-4 min-h-[400px]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm font-bold text-gray-700">Loading About Us Content from API...</p>
        <p className="text-xs text-gray-400">Fetching history, vision, mission, and commissioner communiqué</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-border shadow-xs">
        <div>
          <h2 className="text-xl font-extrabold text-text-primary mt-1">About Us Page Content</h2>
          <p className="text-xs text-gray-500">
            Manage history, vision & mission, commissioner message, and media via live API.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadData}
            title="Reload live data from server"
            className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reload</span>
          </button>

          <Link
            href="/about"
            target="_blank"
            className="px-3.5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Live Page</span>
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Publish Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3 text-xs font-semibold animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <span className="flex-1">{errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-red-500 hover:text-red-700 text-xs font-bold underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Success Notification */}
      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 flex items-center gap-3 text-xs font-bold animate-in fade-in duration-300">
          <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
          <span>About Us content saved and published successfully to database!</span>
        </div>
      )}

      {/* SECTION 1: Historical Legacy & Rich Text Description */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border shadow-xs space-y-6">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center font-bold">
            1
          </div>
          <div>
            <h3 className="font-bold text-base text-text-primary">Historical Legacy & Description</h3>
            <p className="text-xs text-gray-500">
              Heritage milestones, Cloudinary image upload, and rich-text description.
            </p>
          </div>
        </div>

        <div className="space-y-5 text-xs">
          {/* Key Milestone Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                Section Heading
              </label>
              <input
                type="text"
                value={history.sectionTitle}
                onChange={(e) => setHistory({ ...history, sectionTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl font-bold focus:border-primary focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                Establishment Year Badge
              </label>
              <input
                type="text"
                value={history.establishedYear}
                onChange={(e) => setHistory({ ...history, establishedYear: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl font-bold text-primary focus:border-primary focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                Years of Service Tag
              </label>
              <input
                type="text"
                value={history.yearsOfService}
                onChange={(e) => setHistory({ ...history, yearsOfService: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl focus:border-primary focus:outline-hidden"
              />
            </div>
          </div>

          {/* Elevation */}
          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
              Geographic Elevation & Location Tag
            </label>
            <input
              type="text"
              value={history.elevation}
              onChange={(e) => setHistory({ ...history, elevation: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl focus:border-primary focus:outline-hidden"
            />
          </div>

          {/* Heritage Feature Image File Upload */}
          <div className="p-4 rounded-2xl bg-primary-surface border border-border space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-primary" />
                <span>Heritage Feature Image (Cloudinary)</span>
              </label>
              <span className="text-[11px] text-gray-500 font-semibold">Supports JPG, PNG, WebP, SVG</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <input
                ref={heritageFileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                onChange={handleHeritageImageUpload}
                className="hidden"
              />

              <button
                type="button"
                disabled={uploadingHeritageImage}
                onClick={() => heritageFileInputRef.current?.click()}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white border-2 border-dashed border-primary text-primary hover:bg-primary-light font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0 disabled:opacity-60 disabled:cursor-not-allowed shadow-2xs"
              >
                {uploadingHeritageImage ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span>Uploading to Cloudinary...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 text-primary" />
                    <span>Upload Heritage Image</span>
                  </>
                )}
              </button>

              <div className="flex-1 w-full flex items-center gap-2">
                <input
                  type="text"
                  value={history.imageUrl}
                  onChange={(e) => setHistory({ ...history, imageUrl: e.target.value })}
                  placeholder="e.g. https://res.cloudinary.com/... or paste image URL"
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl font-mono text-gray-700 text-xs focus:border-primary focus:outline-hidden"
                />

                {history.imageUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewModalUrl(history.imageUrl);
                      setPreviewModalTitle("Heritage Feature Image Preview");
                    }}
                    title="Preview Image"
                    className="px-3.5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-xs"
                  >
                    <Eye className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Preview</span>
                  </button>
                )}
              </div>
            </div>

            {heritageUploadSuccess && (
              <div className="flex items-center justify-between text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{heritageUploadSuccess}</span>
                </div>
                {history.imageUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewModalUrl(history.imageUrl);
                      setPreviewModalTitle("Heritage Feature Image Preview");
                    }}
                    className="text-xs font-bold text-emerald-800 hover:text-emerald-950 underline flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Open Preview</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Rich Text Description with ReactQuill */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block font-bold text-gray-700 uppercase tracking-wider">
                Historical Origins & Governance Description (Rich Text)
              </label>
            </div>

            <div className="bg-white rounded-2xl border border-border overflow-hidden focus-within:border-primary transition-colors">
              <ReactQuill
                theme="snow"
                value={history.description}
                onChange={(val: string) => setHistory({ ...history, description: val })}
                modules={quillModules}
                placeholder="Write detailed historical legacy, origin stories, and modern municipal administration..."
                className="quill-editor"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Vision & Mission */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border shadow-xs space-y-6">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center font-bold">
            2
          </div>
          <div>
            <h3 className="font-bold text-base text-text-primary">Vision & Mission Statements</h3>
            <p className="text-xs text-gray-500">Core civic principles and key strategic focus areas.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          {/* Vision */}
          <div className="p-4 rounded-2xl bg-primary-surface border border-border space-y-3">
            <div className="font-bold text-sm text-text-primary flex items-center gap-2">
              <Eye className="w-4 h-4 text-primary" />
              <span>Vision Statement</span>
            </div>
            <textarea
              rows={5}
              value={visionMission.visionText}
              onChange={(e) => setVisionMission({ ...visionMission, visionText: e.target.value })}
              placeholder="Enter council vision statement..."
              className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl leading-relaxed focus:border-primary focus:outline-hidden"
            />
          </div>

          {/* Mission */}
          <div className="p-4 rounded-2xl bg-primary-surface border border-border space-y-3">
            <div className="font-bold text-sm text-text-primary flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              <span>Mission Key Objectives ({visionMission.missionPoints.length})</span>
            </div>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {visionMission.missionPoints.map((point, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary-light text-primary text-[10px] flex items-center justify-center font-bold shrink-0">
                    {index + 1}
                  </span>
                  <input
                    type="text"
                    value={point}
                    onChange={(e) => {
                      const updated = [...visionMission.missionPoints];
                      updated[index] = e.target.value;
                      setVisionMission({ ...visionMission, missionPoints: updated });
                    }}
                    placeholder="Enter mission objective..."
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = visionMission.missionPoints.filter((_, i) => i !== index);
                      setVisionMission({ ...visionMission, missionPoints: updated });
                    }}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-xl hover:bg-red-50 cursor-pointer shrink-0"
                    title="Remove point"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setVisionMission({
                    ...visionMission,
                    missionPoints: [...visionMission.missionPoints, ""],
                  })
                }
                className="mt-2 text-xs text-primary font-bold flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Mission Point</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: Chief Officer's Communiqué */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border shadow-xs space-y-6">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center font-bold">
            3
          </div>
          <div>
            <h3 className="font-bold text-base text-text-primary">Chief Officer&apos;s Communiqué</h3>
            <p className="text-xs text-gray-500">Official statement, portrait upload, and administrative address.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-xs">
          {/* Officer Details & Portrait Upload */}
          <div className="md:col-span-5 p-5 rounded-2xl bg-primary-surface border border-border space-y-3.5">
            <div>
              <label className="block font-bold text-gray-600 text-[11px] mb-1">Officer Name</label>
              <input
                type="text"
                value={communique.officerName}
                onChange={(e) => setCommunique({ ...communique, officerName: e.target.value })}
                placeholder="e.g. Shri. Pandit Patil (IAS/State Cadre)"
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-600 text-[11px] mb-1">Designation</label>
              <input
                type="text"
                value={communique.designation}
                onChange={(e) => setCommunique({ ...communique, designation: e.target.value })}
                placeholder="e.g. Chief Officer  (मुख्याधिकारी)"
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-gray-600 text-[11px] mb-1">Officer Phone</label>
                <input
                  type="text"
                  value={communique.phone}
                  onChange={(e) => setCommunique({ ...communique, phone: e.target.value })}
                  placeholder="+91 2114 273032"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl font-mono text-[11px]"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-600 text-[11px] mb-1">Officer Email</label>
                <input
                  type="email"
                  value={communique.email}
                  onChange={(e) => setCommunique({ ...communique, email: e.target.value })}
                  placeholder="co@lonavalamc.gov.in"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl font-mono text-[11px]"
                />
              </div>
            </div>

            {/* Portrait Image File Upload */}
            <div className="pt-2 border-t border-gray-200/80 space-y-2">
              <label className="block font-bold text-gray-700 text-[11px] uppercase tracking-wider">
                Portrait Image (Cloudinary)
              </label>

              <input
                ref={portraitFileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                onChange={handlePortraitImageUpload}
                className="hidden"
              />

              <div className="space-y-2">
                <button
                  type="button"
                  disabled={uploadingPortraitImage}
                  onClick={() => portraitFileInputRef.current?.click()}
                  className="w-full px-3 py-2.5 rounded-xl bg-white border-2 border-dashed border-primary text-primary hover:bg-primary-light font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-2xs"
                >
                  {uploadingPortraitImage ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span>Uploading to Cloudinary...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 text-primary" />
                      <span>Upload Portrait Photo</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={communique.imageUrl}
                    onChange={(e) => setCommunique({ ...communique, imageUrl: e.target.value })}
                    placeholder="e.g. https://res.cloudinary.com/... or paste image URL"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl font-mono text-gray-700 text-[11px] focus:border-primary focus:outline-hidden"
                  />

                  {communique.imageUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewModalUrl(communique.imageUrl);
                        setPreviewModalTitle("Chief Officer Portrait Preview");
                      }}
                      title="Preview Portrait"
                      className="px-3 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer shrink-0 shadow-xs"
                    >
                      <Eye className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Preview</span>
                    </button>
                  )}
                </div>

                {portraitUploadSuccess && (
                  <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{portraitUploadSuccess}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Communiqué Text Content */}
          <div className="md:col-span-7 space-y-4">
            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                Communiqué Title
              </label>
              <input
                type="text"
                value={communique.title}
                onChange={(e) => setCommunique({ ...communique, title: e.target.value })}
                placeholder="e.g. Advancing Citizen-Centric e-Governance"
                className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl font-bold focus:border-primary focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                Subtitle / Communiqué Header
              </label>
              <input
                type="text"
                value={communique.subtitle}
                onChange={(e) => setCommunique({ ...communique, subtitle: e.target.value })}
                placeholder="e.g. Chief Officer's Communiqué"
                className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl focus:border-primary focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                Full Statement Body Text
              </label>
              <textarea
                rows={5}
                value={communique.messageBody}
                onChange={(e) => setCommunique({ ...communique, messageBody: e.target.value })}
                placeholder="Write official administrative message..."
                className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl leading-relaxed focus:border-primary focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                Signature / Office Attribution
              </label>
              <input
                type="text"
                value={communique.signOff}
                onChange={(e) => setCommunique({ ...communique, signOff: e.target.value })}
                placeholder="e.g. — Office of the Chief Officer, LMC Lonavala"
                className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl focus:border-primary focus:outline-hidden"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Save Bar */}
      <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-border shadow-lg flex items-center justify-between">
        <div className="text-xs text-gray-500">
          Status: <span className="font-semibold text-gray-800">Connected to Live API</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadData}
            className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 text-xs font-bold transition-colors cursor-pointer"
          >
            Discard Changes
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save & Publish About Us</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Media Preview Popup Modal */}
      {previewModalUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="fixed inset-0"
            onClick={() => setPreviewModalUrl(null)}
          />

          <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-3xl w-full overflow-hidden flex flex-col max-h-[90vh] z-10 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary-light flex items-center justify-center text-primary font-bold">
                  {previewModalUrl.includes("/video/") ||
                    previewModalUrl.endsWith(".mp4") ||
                    previewModalUrl.endsWith(".webm") ? (
                    <Video className="w-4 h-4" />
                  ) : (
                    <ImageIcon className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <h3 className="font-black text-sm text-text-primary">
                    {previewModalTitle}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-slate-200/80 text-slate-700">
                      Image
                    </span>
                    {previewModalUrl.includes("cloudinary.com") && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-200">
                        Cloudinary CDN
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPreviewModalUrl(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Image Preview Body */}
            <div className="p-6 bg-slate-950 flex items-center justify-center overflow-auto min-h-[300px] max-h-[60vh]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewModalUrl}
                alt="About Media Preview"
                className="max-h-[55vh] max-w-full rounded-xl shadow-2xl object-contain"
              />
            </div>

            {/* Modal Footer / URL Actions */}
            <div className="px-6 py-4 bg-white border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex-1 w-full min-w-0 bg-slate-50 px-3 py-2 rounded-xl border border-gray-200 text-[11px] font-mono text-gray-600 truncate">
                {previewModalUrl}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(previewModalUrl);
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 2500);
                  }}
                  className="px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-gray-500" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>

                <a
                  href={previewModalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-700 flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
                  <span>Open Full</span>
                </a>

                <button
                  type="button"
                  onClick={() => setPreviewModalUrl(null)}
                  className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
