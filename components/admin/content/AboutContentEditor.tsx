"use client";

import { useState, useRef } from "react";
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
} from "lucide-react";
import Link from "next/link";
import "react-quill-new/dist/quill.snow.css";

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
  const [saved, setSaved] = useState(false);

  const heritageFileInputRef = useRef<HTMLInputElement>(null);
  const portraitFileInputRef = useRef<HTMLInputElement>(null);

  // 1. Historical Legacy
  const [history, setHistory] = useState({
    sectionTitle: "Over a Century of Hill-Station Stewardship",
    establishedYear: "Est. 1877",
    yearsOfService: "148+ Years of Civic Service",
    elevation: "624 meters in the Sahyadri Western Ghats",
    imageUrl:
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80",
    imageFileName: "historical-stewardship.jpg",
    description: `<h3>Historical Origins</h3><p>Lonavala was discovered as a hill retreat in 1871 by Sir Mountstuart Elphinstone and formally constituted as a Municipal Municipality in 1877. Perched at an elevation of 624 meters in the Sahyadri mountains of the Western Ghats, Lonavala serves as a vital ecological and recreational gateway between Mumbai and Pune.</p><br/><h3>Modern Civic Governance</h3><p>Today, Lonavala Municipal Council (LMC) oversees 5 municipal wards, governing over 68,000 permanent residents and catering to more than 3.5 million domestic and international tourists annually. Under the Maharashtra Municipal Councils, Nagar Panchayats and Industrial Townships Act, 1965, the council upholds the highest standards of environmental conservation, sustainable water supply, and municipal hygiene.</p>`,
  });

  // 2. Vision & Mission
  const [visionMission, setVisionMission] = useState({
    visionTitle: "Our Vision",
    visionText:
      "To transform Lonavala into India's leading carbon-neutral, clean, and digitally advanced eco-tourism hill station, while preserving its pristine Sahyadri biodiversity and ensuring dignified civic amenities for every resident.",
    missionTitle: "Our Mission",
    missionPoints: [
      "Deliver 100% door-to-door segregated waste processing and plastic-free tourism.",
      "Provide 24x7 treated potable water supply and eco-conscious underground sewerage.",
      "Enforce zero-tolerance transparency through time-bound online grievance redressal.",
      "Promote green building regulations and protect Sahyadri forest watersheds.",
    ],
  });

  // 3. Commissioner Communiqué
  const [communique, setCommunique] = useState({
    officerName: "Shri. Pandit Patil (IAS/State Cadre)",
    designation: "Chief Officer / Commissioner",
    phone: "+91 2114 273032",
    email: "co@lonavalamc.gov.in",
    imageUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    imageFileName: "chief-officer-portrait.jpg",
    title: "Advancing Citizen-Centric e-Governance",
    subtitle: "Chief Officer's Communiqué",
    messageBody:
      "It gives me immense pride to welcome you to the official digital portal of Lonavala Municipal Council. As our hill-station welcomes millions of visitors every season, our administrative team is dedicated to balancing rapid urban amenities with strict ecological conservation. Through this portal, citizens can now track grievances in real-time, pay municipal taxes seamlessly, and verify development sanctions with complete transparency.",
    signOff: "— Office of the Chief Officer, LMC Lonavala",
  });

  const handleHeritageImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setHistory({
        ...history,
        imageFileName: file.name,
        imageUrl: URL.createObjectURL(file),
      });
    }
  };

  const handlePortraitImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCommunique({
        ...communique,
        imageFileName: file.name,
        imageUrl: URL.createObjectURL(file),
      });
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3500);
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-border shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-primary-light text-primary font-bold text-xs">
              Live Section Editor
            </span>
            <span className="text-xs text-gray-500">• Route: /about (About Us)</span>
          </div>
          <h2 className="text-xl font-extrabold text-text-primary mt-1">About Us Page Content</h2>
          <p className="text-xs text-gray-500">
           Manage history, vision & mission, commissioner message, and media.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/about"
            target="_blank"
            className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Live Page</span>
          </Link>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Publish Changes</span>
          </button>
        </div>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 flex items-center gap-3 text-xs font-bold animate-in fade-in duration-300">
          <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
          <span>About Us content saved and published successfully!</span>
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
              Heritage milestones, image upload, and rich-text description with Formated.
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
                <span>Heritage Feature Image (Upload / Replace)</span>
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
                onClick={() => heritageFileInputRef.current?.click()}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white border-2 border-dashed border-primary text-primary hover:bg-primary-light font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Heritage Image</span>
              </button>

              <div className="flex-1 w-full bg-white px-3.5 py-2 rounded-xl border border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2 overflow-hidden">
                  <FileImage className="w-4 h-4 text-primary shrink-0" />
                  <span className="font-mono text-gray-700 truncate text-[11px]">
                    {history.imageFileName || history.imageUrl}
                  </span>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full shrink-0 uppercase">
                  Image
                </span>
              </div>
            </div>
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
              rows={4}
              value={visionMission.visionText}
              onChange={(e) => setVisionMission({ ...visionMission, visionText: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-primary focus:outline-hidden"
            />
          </div>

          {/* Mission */}
          <div className="p-4 rounded-2xl bg-primary-surface border border-border space-y-3">
            <div className="font-bold text-sm text-text-primary flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              <span>Mission Key Objectives</span>
            </div>
            <div className="space-y-2">
              {visionMission.missionPoints.map((point, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={point}
                    onChange={(e) => {
                      const updated = [...visionMission.missionPoints];
                      updated[index] = e.target.value;
                      setVisionMission({ ...visionMission, missionPoints: updated });
                    }}
                    className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = visionMission.missionPoints.filter((_, i) => i !== index);
                      setVisionMission({ ...visionMission, missionPoints: updated });
                    }}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 cursor-pointer"
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
                    missionPoints: [...visionMission.missionPoints, "New strategic civic objective"],
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
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-600 text-[11px] mb-1">Designation</label>
              <input
                type="text"
                value={communique.designation}
                onChange={(e) => setCommunique({ ...communique, designation: e.target.value })}
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
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl font-mono text-[11px]"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-600 text-[11px] mb-1">Officer Email</label>
                <input
                  type="email"
                  value={communique.email}
                  onChange={(e) => setCommunique({ ...communique, email: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl font-mono text-[11px]"
                />
              </div>
            </div>

            {/* Portrait Image File Upload */}
            <div className="pt-2 border-t border-gray-200/80 space-y-2">
              <label className="block font-bold text-gray-700 text-[11px] uppercase tracking-wider">
                Portrait Image (Upload / Replace)
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
                  onClick={() => portraitFileInputRef.current?.click()}
                  className="w-full px-3 py-2 rounded-xl bg-white border-2 border-dashed border-primary text-primary hover:bg-primary-light font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Portrait Photo</span>
                </button>

                <div className="bg-white px-3 py-1.5 rounded-xl border border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <FileImage className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="font-mono text-gray-700 truncate text-[10px]">
                      {communique.imageFileName || communique.imageUrl}
                    </span>
                  </div>
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-md shrink-0 uppercase">
                    Photo
                  </span>
                </div>
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
                className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl focus:border-primary focus:outline-hidden"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Save Bar */}
      <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-border shadow-lg flex items-center justify-between">
        <div className="text-xs text-gray-500">
          Last updated: <span className="font-semibold text-gray-800">Just now</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 text-xs font-bold transition-colors cursor-pointer"
          >
            Discard Changes
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save & Publish About Us</span>
          </button>
        </div>
      </div>
    </form>
  );
}
