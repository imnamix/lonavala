"use client";

import { useState, useRef } from "react";
import {
  Save,
  CheckCircle2,
  ExternalLink,
  Plus,
  Trash2,
  Upload,
  FileImage,
  ImageIcon,
  Compass,
  AlertTriangle,
  Info,
  ShieldCheck,
  Camera,
  Clock,
  MapPin,
  Car,
  Sun,
  Droplets,
  Mountain,
  Waves,
  Ban,
  Leaf,
  Sparkles,
  Check,
  ChevronDown,
  ArrowLeft,
  Images,
  Film,
  Video,
  Eye,
  Loader2,
  AlertCircle,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  TourismDestination,
  HighlightPair,
  ImportantPoint,
  GalleryImage,
} from "@/data/tourismData";
import { uploadToCloudinary } from "@/lib/services/cloudinary.service";
import {
  createTourismSpot,
  updateTourismSpot,
  mapDestinationToPayload,
} from "@/lib/services/tourism.service";

const POINT_ICONS: { [key: string]: { name: string; icon: any } } = {
  AlertTriangle: { name: "Alert / Warning", icon: AlertTriangle },
  Info: { name: "Info / Notice", icon: Info },
  ShieldCheck: { name: "Safety / Security", icon: ShieldCheck },
  Camera: { name: "Photography", icon: Camera },
  Clock: { name: "Timing / Hours", icon: Clock },
  MapPin: { name: "Location / Landmark", icon: MapPin },
  Compass: { name: "Trek / Navigation", icon: Compass },
  Car: { name: "Parking / Transit", icon: Car },
  Leaf: { name: "Eco / Plastic-Free", icon: Leaf },
  Waves: { name: "Water / Waterfall", icon: Waves },
  Mountain: { name: "Valley / Cliff", icon: Mountain },
  Sun: { name: "Weather / Sun", icon: Sun },
  Droplets: { name: "Rain / Monsoon", icon: Droplets },
  Ban: { name: "Prohibited / Restriction", icon: Ban },
  Sparkles: { name: "Special Attraction", icon: Sparkles },
};

function PointIconDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selectedObj = POINT_ICONS[value] || POINT_ICONS.Info;
  const SelectedIcon = selectedObj.icon;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs flex items-center justify-between hover:border-primary focus:outline-hidden transition-colors cursor-pointer"
      >
        <span className="flex items-center gap-2 truncate">
          <SelectedIcon className="w-4 h-4 text-primary shrink-0" />
          <span className="font-semibold text-gray-800 truncate">{selectedObj.name}</span>
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0 ml-1" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 right-0 mt-1 max-h-52 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-1 space-y-0.5">
            {Object.keys(POINT_ICONS).map((iconKey) => {
              const item = POINT_ICONS[iconKey];
              const IconComp = item.icon;
              const isSelected = iconKey === value;
              return (
                <button
                  key={iconKey}
                  type="button"
                  onClick={() => {
                    onChange(iconKey);
                    setOpen(false);
                  }}
                  className={`w-full px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${isSelected
                      ? "bg-primary-light text-primary font-bold"
                      : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  <span className="flex items-center gap-2 truncate">
                    <IconComp className="w-4 h-4 shrink-0 text-primary" />
                    <span>{item.name}</span>
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 shrink-0 text-primary" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

interface TourismDestinationFormProps {
  initialData?: TourismDestination | null;
  isNew?: boolean;
}

export function TourismDestinationForm({
  initialData,
  isNew = false,
}: TourismDestinationFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [showCoverModal, setShowCoverModal] = useState(false);
  const [galleryPreviewUrl, setGalleryPreviewUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  const [destination, setDestination] = useState<TourismDestination>(
    initialData || {
      id: `dest-${Date.now()}`,
      name: "",
      label: "",
      distance: "",
      imageUrl:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
      imageFileName: "destination-cover.jpg",
      description: "",
      highlights: [
        { id: `h-${Date.now()}-1`, key: "Best Season", value: "Monsoon & Winter" },
        { id: `h-${Date.now()}-2`, key: "Entry Fee", value: "Free" },
      ],
      importantPoints: [
        {
          id: `ip-${Date.now()}-1`,
          icon: "Info",
          text: "Follow all municipal guidelines and keep the hill station clean.",
        },
      ],
      galleryImages: [],
      active: true,
    }
  );

  const handleUpdate = (field: keyof TourismDestination, value: any) => {
    setDestination({ ...destination, [field]: value });
  };

  const handleFeatureImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setUploadingCover(true);
        setErrorMessage(null);
        const uploaded = await uploadToCloudinary(file, "lonavala/tourism");
        setDestination({
          ...destination,
          imageFileName: file.name,
          imageUrl: uploaded.secure_url || uploaded.url,
        });
      } catch (err: any) {
        console.error("Failed to upload cover image:", err);
        setDestination({
          ...destination,
          imageFileName: file.name,
          imageUrl: URL.createObjectURL(file),
        });
      } finally {
        setUploadingCover(false);
        if (e.target) e.target.value = "";
      }
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isVideo = file.type.startsWith("video/") || /\.(mp4|webm|ogg|mov)$/i.test(file.name);
      try {
        setUploadingGallery(true);
        setErrorMessage(null);
        const uploaded = await uploadToCloudinary(file, "lonavala/tourism");
        const newImg: GalleryImage = {
          id: `gal-${Date.now()}`,
          url: uploaded.secure_url || uploaded.url,
          fileName: file.name,
          mediaType: isVideo ? "video" : "image",
        };
        setDestination({
          ...destination,
          galleryImages: [...(destination.galleryImages || []), newImg],
        });
      } catch (err: any) {
        console.error("Failed to upload gallery media:", err);
        const newImg: GalleryImage = {
          id: `gal-${Date.now()}`,
          url: URL.createObjectURL(file),
          fileName: file.name,
          mediaType: isVideo ? "video" : "image",
        };
        setDestination({
          ...destination,
          galleryImages: [...(destination.galleryImages || []), newImg],
        });
      } finally {
        setUploadingGallery(false);
        if (e.target) e.target.value = "";
      }
    }
  };

  // Highlights Key-Value Pair Handlers
  const handleAddHighlight = () => {
    const newH: HighlightPair = {
      id: `h-${Date.now()}`,
      key: "",
      value: "",
    };
    setDestination({
      ...destination,
      highlights: [...(destination.highlights || []), newH],
    });
  };

  const handleUpdateHighlight = (id: string, field: "key" | "value", val: string) => {
    const updated = (destination.highlights || []).map((h) =>
      h.id === id ? { ...h, [field]: val } : h
    );
    setDestination({ ...destination, highlights: updated });
  };

  const handleDeleteHighlight = (id: string) => {
    const updated = (destination.highlights || []).filter((h) => h.id !== id);
    setDestination({ ...destination, highlights: updated });
  };

  // Important Points Handlers
  const handleAddPoint = () => {
    const newPt: ImportantPoint = {
      id: `ip-${Date.now()}`,
      icon: "Info",
      text: "",
    };
    setDestination({
      ...destination,
      importantPoints: [...(destination.importantPoints || []), newPt],
    });
  };

  const handleUpdatePoint = (id: string, field: "icon" | "text", val: string) => {
    const updated = (destination.importantPoints || []).map((pt) =>
      pt.id === id ? { ...pt, [field]: val } : pt
    );
    setDestination({ ...destination, importantPoints: updated });
  };

  const handleDeletePoint = (id: string) => {
    const updated = (destination.importantPoints || []).filter((pt) => pt.id !== id);
    setDestination({ ...destination, importantPoints: updated });
  };

  const handleDeleteGalleryImage = (id: string) => {
    const updated = (destination.galleryImages || []).filter((g) => g.id !== id);
    setDestination({ ...destination, galleryImages: updated });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.name.trim()) {
      setErrorMessage("Please enter a destination name.");
      return;
    }

    try {
      setSaving(true);
      setErrorMessage(null);
      const payload = mapDestinationToPayload(destination);

      const isRealNew = isNew || destination.id.startsWith("dest-");
      if (isRealNew) {
        await createTourismSpot(payload);
      } else {
        await updateTourismSpot(destination.id, payload);
      }

      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        router.push("/admin/content/tourism");
      }, 1000);
    } catch (err: any) {
      console.error("Failed to save destination:", err);
      setErrorMessage(err.message || "Failed to save destination to API. Please check details and retry.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSave} className="space-y-8">
        {/* Top Banner & Quick Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-border shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <Link
                href="/admin/content/tourism"
                className="px-2 py-0.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold text-xs flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Back to Tourism Table</span>
              </Link>
              <span className="text-xs text-gray-500">• Route: /tourism</span>
            </div>
            <h2 className="text-xl font-extrabold text-text-primary mt-1">
              {isNew ? "Add New Tourism Destination" : `Edit Destination: ${destination.name || "Untitled"}`}
            </h2>
            <p className="text-xs text-gray-500">
              Configure labels, overview description, highlights, proximity distance, advisory points, and gallery photos.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/content/tourism"
              className="px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving || uploadingCover || uploadingGallery}
              className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{saving ? "Saving..." : "Save & Publish"}</span>
            </button>
          </div>
        </div>

        {saved && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 flex items-center gap-3 text-xs font-bold animate-in fade-in duration-300">
            <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
            <span>Destination saved successfully! Returning to table...</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3 text-xs font-semibold animate-in fade-in duration-300">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Main Form Box */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-border shadow-xs space-y-6 text-xs">
          {/* Status Toolbar */}
          <div className="flex items-center justify-between bg-primary-surface p-4 rounded-2xl border border-border">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-primary" />
              <span className="font-bold text-sm text-text-primary">Destination Information</span>
            </div>

            <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-700 bg-white px-3 py-1.5 rounded-xl border border-gray-200">
              <span>Publish Status:</span>
              <input
                type="checkbox"
                checked={destination.active}
                onChange={(e) => handleUpdate("active", e.target.checked)}
                className="w-4 h-4 rounded text-primary focus:ring-primary"
              />
              <span className={destination.active ? "text-primary" : "text-gray-400"}>
                {destination.active ? "Active" : "Inactive"}
              </span>
            </label>
          </div>

          {/* 1. Basic Fields: Name, Label, Distance */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                Destination Name *
              </label>
              <input
                type="text"
                required
                value={destination.name}
                onChange={(e) => handleUpdate("name", e.target.value)}
                placeholder="e.g. Tiger Point (Tiger's Leap)"
                className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl font-bold text-text-primary focus:border-primary focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                Category / Feature Label
              </label>
              <input
                type="text"
                value={destination.label}
                onChange={(e) => handleUpdate("label", e.target.value)}
                placeholder="e.g. Scenic Valley & Waterfall"
                className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl font-semibold focus:border-primary focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                Proximity / Distance
              </label>
              <input
                type="text"
                value={destination.distance}
                onChange={(e) => handleUpdate("distance", e.target.value)}
                placeholder="e.g. 8.5 km from Lonavala Station"
                className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl focus:border-primary focus:outline-hidden"
              />
            </div>
          </div>

          {/* 2. Feature Cover Image Upload with Preview Button and Proper Alignment */}
          <div className="p-5 rounded-2xl bg-primary-surface border border-border space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200/80 pb-3">
              <div>
                <label className="font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2 text-xs">
                  <ImageIcon className="w-4 h-4 text-primary" />
                  <span>Destination Feature Cover Image</span>
                </label>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Main banner photo displayed on homepage cards and destination hero page.
                </p>
              </div>
              <span className="text-[10px] text-emerald-800 bg-emerald-100 font-bold px-2.5 py-1 rounded-lg w-fit">
                Cloudinary CDN Optimized
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
              {/* Visual Photo Preview Thumbnail */}
              <div className="md:col-span-4 relative w-full h-36 rounded-2xl overflow-hidden bg-slate-900 border-2 border-border flex items-center justify-center shrink-0 shadow-2xs group">
                {uploadingCover ? (
                  <div className="flex flex-col items-center justify-center p-3 text-center">
                    <Loader2 className="w-7 h-7 animate-spin text-primary mb-1.5" />
                    <span className="text-[10px] font-bold text-emerald-300">Uploading to Cloudinary...</span>
                  </div>
                ) : destination.imageUrl ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={destination.imageUrl}
                      alt={destination.name || "Cover Image Preview"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Hover Overlay with Preview Icon */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowCoverModal(true)}
                        className="p-2 rounded-xl bg-white/95 text-gray-800 hover:bg-white text-xs font-bold flex items-center gap-1 shadow-md transition-colors cursor-pointer"
                        title="Click to Zoom Preview"
                      >
                        <Eye className="w-3.5 h-3.5 text-primary" />
                        <span className="text-[10px]">Preview</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-3">
                    <Camera className="w-7 h-7 text-gray-400 mx-auto mb-1" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase">No Cover Selected</span>
                  </div>
                )}
              </div>

              {/* Action Buttons & Cloudinary URL Path */}
              <div className="md:col-span-8 space-y-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                    onChange={handleFeatureImageChange}
                    className="hidden"
                  />

                  {/* Upload Button */}
                  <button
                    type="button"
                    disabled={uploadingCover}
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {uploadingCover ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    <span>
                      {uploadingCover
                        ? "Uploading..."
                        : destination.imageUrl
                          ? "Replace Cover Image"
                          : "Upload Cover Image"}
                    </span>
                  </button>

                  {/* Preview Button */}
                  {destination.imageUrl && (
                    <button
                      type="button"
                      onClick={() => setShowCoverModal(true)}
                      className="px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 hover:border-primary hover:bg-primary-light text-gray-700 hover:text-primary font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                      title="Preview full cover photo"
                    >
                      <Eye className="w-4 h-4 text-primary" />
                      <span>Preview</span>
                    </button>
                  )}

                  {/* Direct External Link */}
                  {destination.imageUrl && (
                    <a
                      href={destination.imageUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-2.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      title="Open Image URL in new tab"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Open URL</span>
                    </a>
                  )}

                  {/* Remove Button */}
                  {destination.imageUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        handleUpdate("imageUrl", "");
                        handleUpdate("imageFileName", "");
                      }}
                      className="px-3 py-2.5 rounded-xl bg-white border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      title="Remove cover photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Remove</span>
                    </button>
                  )}
                </div>

                {/* Direct URL Input for Manual Paste / Edit */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={destination.imageUrl}
                      onChange={(e) => handleUpdate("imageUrl", e.target.value)}
                      placeholder="e.g. https://res.cloudinary.com/... or paste image URL"
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl font-mono text-gray-700 text-xs focus:border-primary focus:outline-hidden"
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 font-medium">
                    Supports JPG, PNG, WebP, SVG • High-resolution landscape format (16:9) recommended
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Description */}
          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
              Destination Description & Overview
            </label>
            <textarea
              rows={4}
              value={destination.description}
              onChange={(e) => handleUpdate("description", e.target.value)}
              placeholder="Write detailed tourist information, natural landscape description, historical background..."
              className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl leading-relaxed focus:border-primary focus:outline-hidden text-xs"
            />
          </div>

          {/* 4. Important Points & Visitor Advisories with button BELOW fields */}
          <div className="p-4 rounded-2xl bg-primary-surface border border-border space-y-3">
            <div className="border-b border-gray-200 pb-2">
              <span className="font-bold text-gray-800 uppercase tracking-wider block">
                Important Points & Visitor Advisories (Icon + Text)
              </span>
              <span className="text-[11px] text-gray-500">
                Safety notices, eco-guidelines, parking advice, and visitor precautions.
              </span>
            </div>

            {/* List of Important Points Fields */}
            <div className="space-y-3">
              {(destination.importantPoints || []).map((pt) => (
                <div
                  key={pt.id}
                  className="p-3 bg-white border border-gray-200 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5"
                >
                  <div className="w-full sm:w-56 shrink-0">
                    <PointIconDropdown
                      value={pt.icon}
                      onChange={(val) => handleUpdatePoint(pt.id, "icon", val)}
                    />
                  </div>

                  <input
                    type="text"
                    value={pt.text}
                    onChange={(e) => handleUpdatePoint(pt.id, "text", e.target.value)}
                    placeholder="Advisory text (e.g. Remain behind barricades...)"
                    className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-800 focus:border-primary focus:outline-hidden text-xs"
                  />

                  <button
                    type="button"
                    onClick={() => handleDeletePoint(pt.id)}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors self-end sm:self-center cursor-pointer"
                    title="Remove point"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Important Point Button BELOW fields */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleAddPoint}
                className="w-full py-2.5 rounded-xl bg-white hover:bg-emerald-50 text-primary border-2 border-dashed border-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Important Point</span>
              </button>
            </div>
          </div>

          {/* 5. Key Highlights (Key-Value Pairs) with button BELOW fields */}
          <div className="p-4 rounded-2xl bg-primary-surface border border-border space-y-3">
            <div className="border-b border-gray-200 pb-2">
              <span className="font-bold text-gray-800 uppercase tracking-wider block">
                Key Highlights (Key-Value Pairs)
              </span>
              <span className="text-[11px] text-gray-500">
                Quick tourist facts such as Best Time, Entry Fee, Timings, Altitude, Water Source, etc.
              </span>
            </div>

            {/* List of Key-Value Fields */}
            <div className="space-y-2.5">
              {(destination.highlights || []).map((hl) => (
                <div key={hl.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={hl.key}
                    onChange={(e) => handleUpdateHighlight(hl.id, "key", e.target.value)}
                    placeholder="Key (e.g. Best Season)"
                    className="w-1/3 px-3 py-2 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 focus:border-primary focus:outline-hidden"
                  />
                  <input
                    type="text"
                    value={hl.value}
                    onChange={(e) => handleUpdateHighlight(hl.id, "value", e.target.value)}
                    placeholder="Value (e.g. Monsoon & Winter)"
                    className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-800 focus:border-primary focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteHighlight(hl.id)}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                    title="Remove highlight"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Highlight Pair Button BELOW fields */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleAddHighlight}
                className="w-full py-2.5 rounded-xl bg-white hover:bg-emerald-50 text-primary border-2 border-dashed border-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Highlight Pair</span>
              </button>
            </div>
          </div>

          {/* 6. Gallery Media (Images & Videos) Section */}
          <div className="p-4 rounded-2xl bg-primary-surface border border-border space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <div>
                <span className="font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Images className="w-4 h-4 text-primary" />
                  <span>Destination Gallery Media ({destination.galleryImages?.length || 0})</span>
                </span>
                <span className="text-[11px] text-gray-500">
                  Photos and videos uploaded to Cloudinary showing viewpoints, waterfalls, monuments, and surroundings.
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400 font-semibold hidden sm:inline">
                  Supports JPG, PNG, WebP, MP4, WebM
                </span>
                <input
                  ref={galleryFileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml,image/gif,video/mp4,video/webm,video/ogg,video/quicktime"
                  onChange={handleGalleryUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Gallery Grid Cards */}
            {(destination.galleryImages || []).length === 0 ? (
              <div className="p-6 text-center bg-white rounded-2xl border border-dashed border-gray-300 text-gray-400">
                <div className="flex items-center justify-center gap-2 mb-1 text-gray-300">
                  <Images className="w-7 h-7" />
                  <Video className="w-7 h-7" />
                </div>
                <p className="font-semibold text-gray-600">No gallery photos or videos uploaded yet</p>
                <p className="text-[11px] text-gray-400">Click &quot;Add Gallery Media (Image / Video)&quot; below to upload destination media</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {destination.galleryImages.map((img) => {
                  const isVideo =
                    img.mediaType === "video" ||
                    /\.(mp4|webm|ogg|mov)$/i.test(img.url) ||
                    /\.(mp4|webm|ogg|mov)$/i.test(img.fileName || "");

                  return (
                    <div
                      key={img.id}
                      className="p-1.5 rounded-2xl bg-white border border-gray-200 shadow-2xs relative group overflow-hidden"
                    >
                      <div className="h-32 rounded-xl overflow-hidden bg-gray-900 relative">
                        {isVideo ? (
                          <video
                            src={img.url}
                            className="w-full h-full object-cover"
                            muted
                            playsInline
                            loop
                            onMouseOver={(e) => (e.currentTarget as HTMLVideoElement).play().catch(() => { })}
                            onMouseOut={(e) => (e.currentTarget as HTMLVideoElement).pause()}
                          />
                        ) : (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={img.url}
                            alt="Gallery Photo"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        )}

                        {/* Media Type Badge */}
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-white font-bold text-[9px] flex items-center gap-1 shadow-xs uppercase tracking-wider backdrop-blur-xs">
                          {isVideo ? (
                            <>
                              <Film className="w-2.5 h-2.5 text-purple-300" />
                              <span className="text-purple-200 font-bold">Video</span>
                            </>
                          ) : (
                            <>
                              <ImageIcon className="w-2.5 h-2.5 text-emerald-400" />
                              <span>Photo</span>
                            </>
                          )}
                        </div>

                        {/* Top Right Quick Actions */}
                        <div className="absolute top-2 right-2 flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setGalleryPreviewUrl(img.url)}
                            className="p-1.5 rounded-lg bg-black/60 text-white hover:bg-black transition-colors shadow-xs cursor-pointer backdrop-blur-xs"
                            title="Preview media"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteGalleryImage(img.id)}
                            className="p-1.5 rounded-lg bg-red-600/90 text-white hover:bg-red-700 transition-colors shadow-xs cursor-pointer"
                            title={isVideo ? "Delete this video" : "Delete this photo"}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Add Gallery Media Button BELOW */}
            <div className="pt-2">
              <button
                type="button"
                disabled={uploadingGallery}
                onClick={() => galleryFileInputRef.current?.click()}
                className="w-full py-2.5 rounded-xl bg-white hover:bg-emerald-50 text-primary border-2 border-dashed border-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                {uploadingGallery ? (
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                ) : (
                  <Plus className="w-3.5 h-3.5" />
                )}
                <span>{uploadingGallery ? "Uploading media to Cloudinary..." : "Add Gallery Media (Image / Video)"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sticky Bottom Save Bar */}
        <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-border shadow-lg flex items-center justify-between">
          <div className="text-xs text-gray-500">
            Editing: <span className="font-semibold text-gray-800">{destination.name || "New Destination"}</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/content/tourism"
              className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 text-xs font-bold transition-colors"
            >
              Discard Changes
            </Link>
            <button
              type="submit"
              disabled={saving || uploadingCover || uploadingGallery}
              className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{saving ? "Saving Destination..." : "Save & Publish Destination"}</span>
            </button>
          </div>
        </div>
      </form>

      {/* Cover Image Fullscreen / Zoom Preview Modal */}
      {showCoverModal && destination.imageUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowCoverModal(false)}
        >
          <div
            className="bg-white rounded-3xl overflow-hidden max-w-3xl w-full shadow-2xl space-y-3 p-4 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-primary" />
                <span className="font-bold text-sm text-text-primary">Cover Image Full Preview</span>
              </div>
              <button
                type="button"
                onClick={() => setShowCoverModal(false)}
                className="p-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden bg-slate-950 max-h-[70vh] flex items-center justify-center relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={destination.imageUrl}
                alt="Cover Preview"
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
              <span className="font-mono truncate text-[11px]">{destination.imageUrl}</span>
              <a
                href={destination.imageUrl}
                target="_blank"
                rel="noreferrer"
                className="text-primary font-bold hover:underline flex items-center gap-1 shrink-0 ml-2"
              >
                <span>Open in New Tab</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Media Preview Modal */}
      {galleryPreviewUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setGalleryPreviewUrl(null)}
        >
          <div
            className="bg-white rounded-3xl overflow-hidden max-w-3xl w-full shadow-2xl space-y-3 p-4 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Images className="w-4 h-4 text-primary" />
                <span className="font-bold text-sm text-text-primary">Gallery Media Preview</span>
              </div>
              <button
                type="button"
                onClick={() => setGalleryPreviewUrl(null)}
                className="p-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden bg-slate-950 max-h-[70vh] flex items-center justify-center relative">
              {/\.(mp4|webm|ogg|mov)$/i.test(galleryPreviewUrl) ? (
                <video
                  src={galleryPreviewUrl}
                  controls
                  autoPlay
                  className="max-h-[70vh] w-auto object-contain"
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={galleryPreviewUrl}
                  alt="Gallery Media Preview"
                  className="max-h-[70vh] w-auto object-contain"
                />
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
              <span className="font-mono truncate text-[11px]">{galleryPreviewUrl}</span>
              <a
                href={galleryPreviewUrl}
                target="_blank"
                rel="noreferrer"
                className="text-primary font-bold hover:underline flex items-center gap-1 shrink-0 ml-2"
              >
                <span>Open in New Tab</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
