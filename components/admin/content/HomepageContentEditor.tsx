"use client";

import { useState, useEffect, useRef } from "react";
import {
  Save,
  CheckCircle2,
  ExternalLink,
  Video,
  Upload,
  FileVideo,
  FileImage,
  Plus,
  Trash2,
  AlertTriangle,
  AlertCircle,
  DollarSign,
  FileText,
  PhoneCall,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  Sparkles,
  Building2,
  MapPin,
  Tag as TagIcon,
  Leaf,
  TreePine,
  Mountain,
  Droplets,
  Zap,
  Sun,
  Award,
  FileCheck,
  Waves,
  Landmark,
  Compass,
  Hammer,
  LayoutGrid,
  Check,
  ChevronDown,
  Sliders,
  Film,
  Image as ImageIcon,
  Bell,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Loader2,
  RefreshCw,
  Eye,
  X,
  Copy,
  Languages,
} from "lucide-react";
import Link from "next/link";
import {
  getHomepageData,
  updateHomepageData,
  HeroSlide,
  HeroButton,
  HeroTag,
} from "@/lib/services/homepage.service";
import { uploadToCloudinary } from "@/lib/services/cloudinary.service";
import { translateToMarathi } from "@/lib/services/translate.service";

const AVAILABLE_ICONS: { [key: string]: { name: string; icon: any } } = {
  AlertCircle: { name: "Alert Circle", icon: AlertCircle },
  DollarSign: { name: "Dollar / Tax", icon: DollarSign },
  FileText: { name: "File / Document", icon: FileText },
  PhoneCall: { name: "Phone / Call", icon: PhoneCall },
  ArrowRight: { name: "Arrow Right", icon: ArrowRight },
  ExternalLink: { name: "External Link", icon: ExternalLink },
  ShieldCheck: { name: "Shield Check", icon: ShieldCheck },
  HelpCircle: { name: "Help / FAQ", icon: HelpCircle },
  Sparkles: { name: "Sparkles", icon: Sparkles },
  Building2: { name: "Building / Dept", icon: Building2 },
  MapPin: { name: "Map / Location", icon: MapPin },
  TagIcon: { name: "Tag / Badge", icon: TagIcon },
  Leaf: { name: "Leaf / Eco", icon: Leaf },
  TreePine: { name: "Tree / Forest", icon: TreePine },
  Mountain: { name: "Mountain / Valley", icon: Mountain },
  Droplets: { name: "Water / Rain", icon: Droplets },
  Zap: { name: "Electricity / Speed", icon: Zap },
  Sun: { name: "Sun / Tourism", icon: Sun },
  Award: { name: "Award / Quality", icon: Award },
  FileCheck: { name: "File Check", icon: FileCheck },
  Waves: { name: "Waves / Dam", icon: Waves },
  Landmark: { name: "Landmark / Caves", icon: Landmark },
  Compass: { name: "Compass / Tour", icon: Compass },
  Hammer: { name: "Hammer / Projects", icon: Hammer },
  LayoutGrid: { name: "Grid / Services", icon: LayoutGrid },
};

const COLOR_VARIANTS: {
  [key: string]: { label: string; bg: string; text: string; dot: string; border?: string };
} = {
  Emerald: {
    label: "Emerald (Primary)",
    bg: "bg-emerald-600 hover:bg-emerald-700",
    text: "text-white",
    dot: "bg-emerald-600",
  },
  primary: {
    label: "Emerald (Primary)",
    bg: "bg-emerald-600 hover:bg-emerald-700",
    text: "text-white",
    dot: "bg-emerald-600",
  },
  Teal: {
    label: "Teal (Green)",
    bg: "bg-teal-600 hover:bg-teal-700",
    text: "text-white",
    dot: "bg-teal-600",
  },
  secondary: {
    label: "Teal (Secondary)",
    bg: "bg-teal-600 hover:bg-teal-700",
    text: "text-white",
    dot: "bg-teal-600",
  },
  Blue: {
    label: "Blue (Civic)",
    bg: "bg-blue-600 hover:bg-blue-700",
    text: "text-white",
    dot: "bg-blue-600",
  },
  White: {
    label: "White (Light)",
    bg: "bg-white hover:bg-gray-100",
    text: "text-gray-800",
    dot: "bg-white border border-gray-400",
    border: "border border-gray-300 shadow-xs",
  },
  Amber: {
    label: "Amber (Warning)",
    bg: "bg-amber-600 hover:bg-amber-700",
    text: "text-white",
    dot: "bg-amber-600",
  },
  Red: {
    label: "Red (Urgent)",
    bg: "bg-red-600 hover:bg-red-700",
    text: "text-white",
    dot: "bg-red-600",
  },
  Indigo: {
    label: "Indigo (Royal)",
    bg: "bg-indigo-600 hover:bg-indigo-700",
    text: "text-white",
    dot: "bg-indigo-600",
  },
  Dark: {
    label: "Dark Slate",
    bg: "bg-slate-900 hover:bg-slate-800",
    text: "text-white",
    dot: "bg-slate-900",
  },
};

// Custom Icon Select Component with Visual Icons
function IconSelectDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selectedObj = AVAILABLE_ICONS[value] || AVAILABLE_ICONS.ArrowRight;
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
            {Object.keys(AVAILABLE_ICONS).map((iconKey) => {
              const item = AVAILABLE_ICONS[iconKey];
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
                    <IconComp className="w-4 h-4 shrink-0" />
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

// Custom Color Select Component with Visual Color Dots/Swatches
function ColorSelectDropdown({
  value,
  onChange,
  colorMap,
}: {
  value: string;
  onChange: (val: string) => void;
  colorMap: any;
}) {
  const [open, setOpen] = useState(false);
  const selectedObj = colorMap[value] || colorMap.Emerald || Object.values(colorMap)[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs flex items-center justify-between hover:border-primary focus:outline-hidden transition-colors cursor-pointer"
      >
        <span className="flex items-center gap-2 truncate">
          <span className={`w-3.5 h-3.5 rounded-full ${selectedObj.dot} shrink-0`} />
          <span className="font-semibold text-gray-800 truncate">{selectedObj.label}</span>
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0 ml-1" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 right-0 mt-1 max-h-52 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-1 space-y-0.5">
            {Object.keys(colorMap).map((colorKey) => {
              const item = colorMap[colorKey];
              const isSelected = colorKey === value;
              return (
                <button
                  key={colorKey}
                  type="button"
                  onClick={() => {
                    onChange(colorKey);
                    setOpen(false);
                  }}
                  className={`w-full px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${isSelected
                      ? "bg-primary-light text-primary font-bold"
                      : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  <span className="flex items-center gap-2 truncate">
                    <span className={`w-3.5 h-3.5 rounded-full ${item.dot} shrink-0`} />
                    <span>{item.label}</span>
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

// Custom Alignment Select Component
const ALIGNMENT_OPTIONS = [
  { value: "left", label: "Left", icon: AlignLeft, desc: "Align slide text to the left" },
  { value: "center", label: "Center", icon: AlignCenter, desc: "Center slide text and content" },
  { value: "right", label: "Right", icon: AlignRight, desc: "Align slide text to the right" },
];

function AlignmentDropdown({
  value,
  onChange,
}: {
  value: "left" | "center" | "right";
  onChange: (val: "left" | "center" | "right") => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = ALIGNMENT_OPTIONS.find((o) => o.value === value) || ALIGNMENT_OPTIONS[0];
  const SelectedIcon = selected.icon;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl text-xs font-bold text-gray-800 flex items-center justify-between hover:border-primary focus:outline-hidden transition-colors cursor-pointer"
      >
        <span className="flex items-center gap-2">
          <SelectedIcon className="w-4 h-4 text-primary shrink-0" />
          <span>{selected.label}</span>
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0 ml-1" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-1 space-y-0.5">
            {ALIGNMENT_OPTIONS.map((opt) => {
              const IconComp = opt.icon;
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value as "left" | "center" | "right");
                    setOpen(false);
                  }}
                  className={`w-full px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${isSelected
                      ? "bg-primary-light text-primary font-bold"
                      : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  <span className="flex items-center gap-2.5">
                    <IconComp className="w-4 h-4 shrink-0 text-primary" />
                    <span className="font-semibold">{opt.label}</span>
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

const createEmptySlide = (index: number): HeroSlide => ({
  id: `slide-temp-${Date.now()}`,
  slideTitle: `Slide ${index + 1}`,
  alignment: "left",
  badgeEn: "",
  badgeMr: "",
  headlineEn: "",
  headlineMr: "",
  taglineEn: "",
  taglineMr: "",
  mediaUrl: "",
  showButtons: true,
  showTags: true,
  active: true,
  sortOrder: index + 1,
  buttons: [],
  tags: [],
});

export function HomepageContentEditor() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadingSlideMedia, setUploadingSlideMedia] = useState(false);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null);
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // Translation States
  const [translatingField, setTranslatingField] = useState<string | null>(null);
  const [translatedSuccessField, setTranslatedSuccessField] = useState<string | null>(null);
  const [translationError, setTranslationError] = useState<string | null>(null);

  // Global Announcement Settings
  const [globalSettings, setGlobalSettings] = useState({
    emergencyTicker: "",
    emergencyTickerActive: false,
  });

  const slideFileInputRef = useRef<HTMLInputElement>(null);

  // Fetch Homepage Data from API on Mount
  const loadData = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const data = await getHomepageData(true);

      setGlobalSettings({
        emergencyTicker: data.announcement || "",
        emergencyTickerActive: data.announcementActive || false,
      });

      if (data.slides && data.slides.length > 0) {
        setSlides(data.slides);
      } else {
        // If backend has no slides configured yet, provide one clean blank slide to begin
        setSlides([createEmptySlide(0)]);
      }
      setActiveSlideIndex(0);
    } catch (err: any) {
      console.error("Failed to load homepage content:", err);
      setErrorMessage(err.message || "Failed to load live homepage data from API.");
      // Fallback to one empty slide if request fails
      setSlides([createEmptySlide(0)]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const currentSlide = slides[activeSlideIndex] || slides[0];

  const handleSlideUpdate = (field: keyof HeroSlide, value: any) => {
    const updated = [...slides];
    if (updated[activeSlideIndex]) {
      updated[activeSlideIndex] = { ...updated[activeSlideIndex], [field]: value };
      setSlides(updated);
    }
  };

  const handleSlideMediaChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingSlideMedia(true);
      setErrorMessage(null);
      setUploadSuccessMessage(null);

      // Upload to Cloudinary under folder 'lonavala/homepage'
      const asset = await uploadToCloudinary(file, "lonavala/homepage");

      const targetUrl = asset.secure_url || asset.url;
      const updated = [...slides];
      if (updated[activeSlideIndex]) {
        updated[activeSlideIndex] = {
          ...updated[activeSlideIndex],
          mediaUrl: targetUrl,
        };
        setSlides(updated);
      }
      setUploadSuccessMessage(`Media uploaded to Cloudinary: ${asset.original_filename || file.name}`);
      setTimeout(() => setUploadSuccessMessage(null), 5000);
    } catch (err: any) {
      console.error("Failed to upload media to Cloudinary:", err);
      setErrorMessage(
        err?.message || "Failed to upload file to Cloudinary. Please check backend connection."
      );
    } finally {
      setUploadingSlideMedia(false);
      if (e.target) {
        e.target.value = "";
      }
    }
  };

  const handleAddSlide = () => {
    const newSlide = createEmptySlide(slides.length);
    setSlides([...slides, newSlide]);
    setActiveSlideIndex(slides.length);
  };

  const handleDeleteSlide = (index: number) => {
    if (slides.length <= 1) {
      alert("At least one slide must remain configured.");
      return;
    }
    const updated = slides.filter((_, idx) => idx !== index);
    setSlides(updated);
    setActiveSlideIndex(Math.max(0, index - 1));
  };

  // Button actions for active slide
  const handleAddButton = () => {
    if (!currentSlide) return;
    const currentButtons = currentSlide.buttons || [];
    const newBtn: HeroButton = {
      id: `btn-${Date.now()}`,
      name: "New Action Button",
      url: "/services",
      icon: "ArrowRight",
      color: "Emerald",
      active: true,
      sortOrder: currentButtons.length + 1,
    };
    handleSlideUpdate("buttons", [...currentButtons, newBtn]);
  };

  const handleUpdateButton = (btnIndex: number, field: keyof HeroButton, value: any) => {
    if (!currentSlide || !currentSlide.buttons) return;
    const updatedButtons = currentSlide.buttons.map((btn, idx) =>
      idx === btnIndex ? { ...btn, [field]: value } : btn
    );
    handleSlideUpdate("buttons", updatedButtons);
  };

  const handleDeleteButton = (btnIndex: number) => {
    if (!currentSlide || !currentSlide.buttons) return;
    const updatedButtons = currentSlide.buttons.filter((_, idx) => idx !== btnIndex);
    handleSlideUpdate("buttons", updatedButtons);
  };

  // Tag actions for active slide
  const handleAddTag = () => {
    if (!currentSlide) return;
    const currentTags = currentSlide.tags || [];
    const newTag: HeroTag = {
      id: `tag-${Date.now()}`,
      name: "New Highlight Tag",
      icon: "TagIcon",
      active: true,
      sortOrder: currentTags.length + 1,
    };
    handleSlideUpdate("tags", [...currentTags, newTag]);
  };

  const handleUpdateTag = (tagIndex: number, field: keyof HeroTag, value: any) => {
    if (!currentSlide || !currentSlide.tags) return;
    const updatedTags = currentSlide.tags.map((tag, idx) =>
      idx === tagIndex ? { ...tag, [field]: value } : tag
    );
    handleSlideUpdate("tags", updatedTags);
  };

  const handleDeleteTag = (tagIndex: number) => {
    if (!currentSlide || !currentSlide.tags) return;
    const updatedTags = currentSlide.tags.filter((_, idx) => idx !== tagIndex);
    handleSlideUpdate("tags", updatedTags);
  };

  // Translate a single field in the active slide
  const handleTranslateField = async (
    sourceKey: "badgeEn" | "headlineEn" | "taglineEn",
    targetKey: "badgeMr" | "headlineMr" | "taglineMr",
    fieldId: string
  ) => {
    if (!currentSlide) return;
    const sourceText = (currentSlide[sourceKey] || "").trim();
    if (!sourceText) {
      const label =
        sourceKey === "badgeEn"
          ? "Portal Badge (English)"
          : sourceKey === "headlineEn"
          ? "Main Headline (English)"
          : "Tagline / Subtitle (English)";
      setTranslationError(`Please enter text in ${label} before converting to Marathi.`);
      setTimeout(() => setTranslationError(null), 4000);
      return;
    }

    setTranslatingField(fieldId);
    setTranslationError(null);

    try {
      const translated = await translateToMarathi(sourceText);
      if (translated) {
        handleSlideUpdate(targetKey, translated);
        setTranslatedSuccessField(fieldId);
        setTimeout(() => setTranslatedSuccessField(null), 3000);
      }
    } catch (err: any) {
      console.error("Translation error:", err);
      setTranslationError(err?.message || "Failed to translate to Marathi. Please try again.");
      setTimeout(() => setTranslationError(null), 4000);
    } finally {
      setTranslatingField(null);
    }
  };

  // Translate all English fields in current slide to Marathi
  const handleTranslateAllFieldsInSlide = async () => {
    if (!currentSlide) return;
    const hasAnyText =
      (currentSlide.badgeEn && currentSlide.badgeEn.trim()) ||
      (currentSlide.headlineEn && currentSlide.headlineEn.trim()) ||
      (currentSlide.taglineEn && currentSlide.taglineEn.trim());

    if (!hasAnyText) {
      setTranslationError("Please enter English text in at least one field first.");
      setTimeout(() => setTranslationError(null), 4000);
      return;
    }

    setTranslatingField("all");
    setTranslationError(null);

    try {
      const updates: Partial<HeroSlide> = {};

      if (currentSlide.badgeEn && currentSlide.badgeEn.trim()) {
        updates.badgeMr = await translateToMarathi(currentSlide.badgeEn.trim());
      }
      if (currentSlide.headlineEn && currentSlide.headlineEn.trim()) {
        updates.headlineMr = await translateToMarathi(currentSlide.headlineEn.trim());
      }
      if (currentSlide.taglineEn && currentSlide.taglineEn.trim()) {
        updates.taglineMr = await translateToMarathi(currentSlide.taglineEn.trim());
      }

      setSlides((prev) =>
        prev.map((s, idx) => (idx === activeSlideIndex ? { ...s, ...updates } : s))
      );
      setTranslatedSuccessField("all");
      setTimeout(() => setTranslatedSuccessField(null), 3000);
    } catch (err: any) {
      console.error("Translate all error:", err);
      setTranslationError(err?.message || "Failed to translate all fields.");
      setTimeout(() => setTranslationError(null), 4000);
    } finally {
      setTranslatingField(null);
    }
  };

  // Save to API
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage(null);
    setSavedSuccess(false);

    try {
      const payload = {
        announcement: globalSettings.emergencyTicker,
        announcementActive: globalSettings.emergencyTickerActive,
        slides: slides.map((s, index) => ({
          slideTitle: s.slideTitle || `Slide ${index + 1}`,
          alignment: s.alignment || "left",
          badgeEn: s.badgeEn || "",
          badgeMr: s.badgeMr || "",
          headlineEn: s.headlineEn || "",
          headlineMr: s.headlineMr || "",
          taglineEn: s.taglineEn || "",
          taglineMr: s.taglineMr || "",
          mediaUrl: s.mediaUrl || "",
          showButtons: s.showButtons ?? true,
          showTags: s.showTags ?? true,
          active: s.active ?? true,
          sortOrder: index + 1,
          buttons: (s.buttons || []).map((b, bIdx) => ({
            name: b.name,
            url: b.url,
            icon: b.icon || "ArrowRight",
            color: b.color || "Emerald",
            active: b.active ?? true,
            sortOrder: bIdx + 1,
          })),
          tags: (s.tags || []).map((t, tIdx) => ({
            name: t.name,
            icon: t.icon || "TagIcon",
            active: t.active ?? true,
            sortOrder: tIdx + 1,
          })),
        })),
      };

      const res = await updateHomepageData(payload);
      if (res.success) {
        setSavedSuccess(true);
        if (res.data?.homepage?.slides) {
          setSlides(res.data.homepage.slides);
        }
        setTimeout(() => setSavedSuccess(false), 4000);
      } else {
        throw new Error(res.message || "Failed to save homepage content.");
      }
    } catch (err: any) {
      console.error("Save error:", err);
      setErrorMessage(err.message || "Error saving homepage data to server.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-12 rounded-3xl border border-border shadow-xs flex flex-col items-center justify-center space-y-4 min-h-[400px]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm font-bold text-gray-700">Loading Homepage Content from API...</p>
        <p className="text-xs text-gray-400">Fetching live hero carousel and announcements</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-border shadow-xs">
        <div>
          {/* <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-primary-light text-primary font-bold text-xs">
              Live API Section Editor
            </span>
            <span className="text-xs text-gray-500">• Route: / (Homepage)</span>
          </div> */}
          <h2 className="text-xl font-extrabold text-text-primary mt-1">
            Homepage Content & Hero Carousel
          </h2>
          <p className="text-xs text-gray-500">
            Manage live hero slides, media URLs, action buttons, tags, and emergency announcement ticker via API.
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
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <Link
            href="/"
            target="_blank"
            className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
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
                <span>Publishing...</span>
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

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 flex items-center gap-3 text-xs font-bold animate-in fade-in duration-300">
          <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
          <span>Homepage hero content and announcements saved and published successfully to the API!</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-300 text-red-800 flex items-center justify-between gap-3 text-xs font-bold animate-in fade-in duration-300">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={loadData}
            className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg text-xs font-semibold cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* SECTION 1: HERO MULTI-SLIDE CAROUSEL */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h3 className="font-bold text-base text-text-primary">Hero Carousel Slides</h3>
              <p className="text-xs text-gray-500">
                Manage hero slides ({slides.length} slides configured). Click on any slide card to edit its content.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddSlide}
            className="px-4 py-2.5 rounded-xl bg-primary text-white hover:bg-primary-hover font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shrink-0 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Slide</span>
          </button>
        </div>

        {/* Slide Selection Grid Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {slides.map((slide, index) => {
            const isCurrent = index === activeSlideIndex;
            const isVideo =
              slide.mediaUrl?.includes("/video/") ||
              slide.mediaUrl?.endsWith(".mp4") ||
              slide.mediaUrl?.endsWith(".webm") ||
              slide.mediaUrl?.endsWith(".ogg");
            return (
              <button
                key={slide.id || index}
                type="button"
                onClick={() => setActiveSlideIndex(index)}
                className={`p-2.5 rounded-xl text-left border transition-all relative flex items-center justify-between gap-2 cursor-pointer ${isCurrent
                    ? "bg-primary-light border-primary ring-1 ring-primary shadow-xs"
                    : "bg-primary-surface border-border hover:bg-white hover:border-emerald-300"
                  }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-black shrink-0 ${isCurrent
                        ? "bg-primary text-white"
                        : "bg-white border border-gray-300 text-gray-700"
                      }`}
                  >
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="font-bold text-[11px] text-text-primary truncate">
                      {slide.slideTitle || `Slide ${index + 1}`}
                    </div>
                    <div className="text-[9px] text-gray-500 font-medium capitalize flex items-center gap-1">
                      {isVideo ? (
                        <Film className="w-2.5 h-2.5 text-purple-600" />
                      ) : (
                        <ImageIcon className="w-2.5 h-2.5 text-blue-600" />
                      )}
                      <span>{isVideo ? "video" : "image"}</span>
                    </div>
                  </div>
                </div>

                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md shrink-0 ${slide.active
                      ? isCurrent
                        ? "bg-primary text-white"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-gray-100 text-gray-400 border border-gray-200"
                    }`}
                >
                  {slide.active ? "Active" : "Inactive"}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Slide Form Editor */}
        {currentSlide && (
          <div className="p-6 sm:p-7 rounded-3xl bg-primary-surface border-2 border-border space-y-6 text-xs">
            {/* Slide Header Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
              <div className="flex-1 space-y-1">
                <div className="text-[11px] font-bold text-primary uppercase tracking-wider">
                  Active Slide Editor
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-base text-text-primary">
                    Editing Slide #{activeSlideIndex + 1}:
                  </span>
                  <span className="font-extrabold text-base text-primary">
                    {currentSlide.slideTitle}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* <button
                  type="button"
                  onClick={handleTranslateAllFieldsInSlide}
                  disabled={translatingField !== null}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  title="Translate all English fields in this slide to Marathi"
                >
                  {translatingField === "all" ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-700" />
                      <span>Translating All...</span>
                    </>
                  ) : translatedSuccessField === "all" ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>All Translated!</span>
                    </>
                  ) : (
                    <>
                      <Languages className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Translate All to Marathi</span>
                    </>
                  )}
                </button> */}

                <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-700 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200">
                  <span>Slide Active:</span>
                  <input
                    type="checkbox"
                    checked={currentSlide.active}
                    onChange={(e) => handleSlideUpdate("active", e.target.checked)}
                    className="w-4 h-4 rounded text-primary focus:ring-primary"
                  />
                </label>

                {slides.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleDeleteSlide(activeSlideIndex)}
                    className="px-3 py-1.5 rounded-xl text-red-600 hover:bg-red-50 border border-red-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Delete this slide"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Slide</span>
                  </button>
                )}
              </div>
            </div>

            {/* Translation Error Banner */}
            {translationError && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{translationError}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setTranslationError(null)}
                  className="text-amber-600 hover:text-amber-800 p-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Slide Title & Alignment */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Slide Internal Title / Label
                </label>
                <input
                  type="text"
                  value={currentSlide.slideTitle}
                  onChange={(e) => handleSlideUpdate("slideTitle", e.target.value)}
                  placeholder="e.g. Gateway to Hill Station Governance"
                  className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl font-bold text-sm text-text-primary focus:border-primary focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Slide Content Alignment
                </label>
                <AlignmentDropdown
                  value={currentSlide.alignment || "left"}
                  onChange={(val) => handleSlideUpdate("alignment", val)}
                />
              </div>
            </div>

            {/* Badges */}
            <div className="p-4 rounded-2xl bg-white border border-gray-200 space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Portal Badge (English)
                  </label>
                  <input
                    type="text"
                    value={currentSlide.badgeEn || ""}
                    onChange={(e) => handleSlideUpdate("badgeEn", e.target.value)}
                    placeholder="Official Government Portal"
                    className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl focus:border-primary focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Portal Badge (Marathi)
                  </label>
                  <input
                    type="text"
                    value={currentSlide.badgeMr || ""}
                    onChange={(e) => handleSlideUpdate("badgeMr", e.target.value)}
                    placeholder="अधिकृत शासकीय संकेतस्थळ"
                    className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl focus:border-primary focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Checkbox: Convert to Marathi */}
              <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                <label className="inline-flex items-center gap-2 text-xs font-semibold text-gray-700 hover:text-primary cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={translatingField === "badge" || translatedSuccessField === "badge"}
                    disabled={translatingField === "badge"}
                    onChange={() => handleTranslateField("badgeEn", "badgeMr", "badge")}
                    className="w-4 h-4 rounded text-primary border-gray-300 focus:ring-primary cursor-pointer"
                  />
                  <span className="flex items-center gap-1.5">
                    {translatingField === "badge" ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                        <span className="text-primary font-bold">Translating to Marathi...</span>
                      </>
                    ) : translatedSuccessField === "badge" ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">Converted & pre-filled in Marathi!</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>Convert to Marathi</span>
                      </>
                    )}
                  </span>
                </label>
                <span className="text-[11px] text-gray-400">
                  {currentSlide.badgeEn ? "Click checkbox to translate" : "Enter English text to convert"}
                </span>
              </div>
            </div>

            {/* Main Headlines */}
            <div className="p-4 rounded-2xl bg-white border border-gray-200 space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Main Headline (English)
                  </label>
                  <input
                    type="text"
                    value={currentSlide.headlineEn || ""}
                    onChange={(e) => handleSlideUpdate("headlineEn", e.target.value)}
                    placeholder="Welcome to Lonavala Municipal Council"
                    className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl font-bold text-sm text-text-primary focus:border-primary focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Main Headline (Marathi)
                  </label>
                  <input
                    type="text"
                    value={currentSlide.headlineMr || ""}
                    onChange={(e) => handleSlideUpdate("headlineMr", e.target.value)}
                    placeholder="लोणावळा नगरपरिषद आपले सहर्ष स्वागत करत आहे"
                    className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl font-bold text-sm text-text-primary focus:border-primary focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Checkbox: Convert to Marathi */}
              <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                <label className="inline-flex items-center gap-2 text-xs font-semibold text-gray-700 hover:text-primary cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={translatingField === "headline" || translatedSuccessField === "headline"}
                    disabled={translatingField === "headline"}
                    onChange={() => handleTranslateField("headlineEn", "headlineMr", "headline")}
                    className="w-4 h-4 rounded text-primary border-gray-300 focus:ring-primary cursor-pointer"
                  />
                  <span className="flex items-center gap-1.5">
                    {translatingField === "headline" ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                        <span className="text-primary font-bold">Translating to Marathi...</span>
                      </>
                    ) : translatedSuccessField === "headline" ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">Converted & pre-filled in Marathi!</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>Convert to Marathi</span>
                      </>
                    )}
                  </span>
                </label>
                <span className="text-[11px] text-gray-400">
                  {currentSlide.headlineEn ? "Click checkbox to translate" : "Enter English text to convert"}
                </span>
              </div>
            </div>

            {/* Subtitles / Taglines */}
            <div className="p-4 rounded-2xl bg-white border border-gray-200 space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Tagline / Subtitle (English)
                  </label>
                  <textarea
                    rows={3}
                    value={currentSlide.taglineEn || ""}
                    onChange={(e) => handleSlideUpdate("taglineEn", e.target.value)}
                    placeholder="Serving the Jewel of Sahyadri with sustainable eco-governance..."
                    className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl focus:border-primary focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Tagline / Subtitle (Marathi)
                  </label>
                  <textarea
                    rows={3}
                    value={currentSlide.taglineMr || ""}
                    onChange={(e) => handleSlideUpdate("taglineMr", e.target.value)}
                    placeholder="सह्याद्रीच्या कुशीतील लोणावळा शहराचे शाश्वत पर्यावरण संवर्धन..."
                    className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl focus:border-primary focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Checkbox: Convert to Marathi */}
              <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                <label className="inline-flex items-center gap-2 text-xs font-semibold text-gray-700 hover:text-primary cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={translatingField === "tagline" || translatedSuccessField === "tagline"}
                    disabled={translatingField === "tagline"}
                    onChange={() => handleTranslateField("taglineEn", "taglineMr", "tagline")}
                    className="w-4 h-4 rounded text-primary border-gray-300 focus:ring-primary cursor-pointer"
                  />
                  <span className="flex items-center gap-1.5">
                    {translatingField === "tagline" ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                        <span className="text-primary font-bold">Translating to Marathi...</span>
                      </>
                    ) : translatedSuccessField === "tagline" ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">Converted & pre-filled in Marathi!</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>Convert to Marathi</span>
                      </>
                    )}
                  </span>
                </label>
                <span className="text-[11px] text-gray-400">
                  {currentSlide.taglineEn ? "Click checkbox to translate" : "Enter English text to convert"}
                </span>
              </div>
            </div>

            {/* Slide Background Media */}
            <div className="p-5 rounded-2xl bg-white border border-gray-200 space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                  <Video className="w-4 h-4 text-primary" />
                  <span>
                    Slide #{activeSlideIndex + 1} Background Media URL / Video
                  </span>
                </label>
                <span className="text-[11px] text-gray-500 font-semibold">
                  Supports MP4, WebM & Unsplash/Image URLs
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <input
                  ref={slideFileInputRef}
                  type="file"
                  accept="video/mp4,video/webm,video/ogg,image/png,image/jpeg,image/jpg,image/webp,image/svg+xml,image/gif"
                  onChange={handleSlideMediaChange}
                  className="hidden"
                />

                <button
                  type="button"
                  disabled={uploadingSlideMedia}
                  onClick={() => slideFileInputRef.current?.click()}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white border-2 border-dashed border-primary text-primary hover:bg-primary-light font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0 disabled:opacity-60 disabled:cursor-not-allowed shadow-2xs"
                >
                  {uploadingSlideMedia ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span>Uploading to Cloudinary...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 text-primary" />
                      <span>Upload to Cloudinary</span>
                    </>
                  )}
                </button>

                <div className="flex-1 w-full flex items-center gap-2">
                  <input
                    type="text"
                    value={currentSlide.mediaUrl || ""}
                    onChange={(e) => handleSlideUpdate("mediaUrl", e.target.value)}
                    placeholder="e.g. https://res.cloudinary.com/... or paste image/video URL"
                    className="w-full px-3.5 py-2.5 bg-primary-surface border border-gray-200 rounded-xl text-xs font-mono text-gray-700 focus:border-primary focus:outline-hidden"
                  />

                  {currentSlide.mediaUrl && (
                    <button
                      type="button"
                      onClick={() => setMediaPreviewUrl(currentSlide.mediaUrl)}
                      title="Preview Media in Popup"
                      className="px-3.5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-xs"
                    >
                      <Eye className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Preview</span>
                    </button>
                  )}
                </div>
              </div>

              {uploadSuccessMessage && (
                <div className="flex items-center justify-between text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3.5 py-2.5 rounded-xl">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{uploadSuccessMessage}</span>
                  </div>
                  {currentSlide.mediaUrl && (
                    <button
                      type="button"
                      onClick={() => setMediaPreviewUrl(currentSlide.mediaUrl)}
                      className="text-xs font-bold text-emerald-800 hover:text-emerald-950 underline flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Open Preview</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Slide Action Buttons */}
            <div className="p-5 rounded-2xl bg-white border border-gray-200 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-primary" />
                  <span className="font-bold text-sm text-text-primary">
                    Slide #{activeSlideIndex + 1} Action Buttons
                  </span>
                  <span className="text-[11px] text-gray-500">
                    ({(currentSlide.buttons || []).length} configured)
                  </span>
                </div>

                {/* Show buttons toggle */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-xs font-bold text-gray-700">Display Buttons:</span>
                  <input
                    type="checkbox"
                    checked={currentSlide.showButtons ?? true}
                    onChange={(e) => handleSlideUpdate("showButtons", e.target.checked)}
                    className="w-4 h-4 rounded text-primary focus:ring-primary"
                  />
                </label>
              </div>

              {(currentSlide.showButtons ?? true) ? (
                <div className="space-y-3">
                  {(currentSlide.buttons || []).map((btn, bIndex) => {
                    const IconComponent =
                      (AVAILABLE_ICONS[btn.icon] && AVAILABLE_ICONS[btn.icon].icon) || ArrowRight;
                    const colorConfig = COLOR_VARIANTS[btn.color] || COLOR_VARIANTS.Emerald;

                    return (
                      <div
                        key={btn.id || bIndex}
                        className="p-4 rounded-xl bg-primary-surface border border-gray-200 space-y-3 relative group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-primary-light text-primary text-[10px] font-bold flex items-center justify-center">
                              {bIndex + 1}
                            </span>
                            <span className="font-bold text-xs text-text-primary">
                              Button: {btn.name || "Untitled"}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-semibold text-gray-600">
                              <span>Enabled:</span>
                              <input
                                type="checkbox"
                                checked={btn.active}
                                onChange={(e) =>
                                  handleUpdateButton(bIndex, "active", e.target.checked)
                                }
                                className="rounded text-primary focus:ring-primary"
                              />
                            </label>

                            <button
                              type="button"
                              onClick={() => handleDeleteButton(bIndex)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Delete button"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                          {/* Button Name */}
                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                              Button Label
                            </label>
                            <input
                              type="text"
                              value={btn.name}
                              onChange={(e) => handleUpdateButton(bIndex, "name", e.target.value)}
                              placeholder="e.g. Report Grievance"
                              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold focus:border-primary focus:outline-hidden"
                            />
                          </div>

                          {/* Target Route / Link */}
                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                              Target Route / URL
                            </label>
                            <input
                              type="text"
                              value={btn.url}
                              onChange={(e) => handleUpdateButton(bIndex, "url", e.target.value)}
                              placeholder="/services"
                              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-mono focus:border-primary focus:outline-hidden"
                            />
                          </div>

                          {/* Icon Dropdown */}
                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                              Icon
                            </label>
                            <IconSelectDropdown
                              value={btn.icon}
                              onChange={(val) => handleUpdateButton(bIndex, "icon", val)}
                            />
                          </div>

                          {/* Color Dropdown */}
                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                              Button Color / Theme
                            </label>
                            <ColorSelectDropdown
                              value={btn.color}
                              onChange={(val) => handleUpdateButton(bIndex, "color", val)}
                              colorMap={COLOR_VARIANTS}
                            />
                          </div>
                        </div>

                        {/* Live Button Preview Chip */}
                        <div className="pt-1 flex items-center gap-2">
                          <span className="text-[10px] font-bold text-gray-400 uppercase">
                            Live Preview:
                          </span>
                          <div
                            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${colorConfig.bg
                              } ${colorConfig.text} ${colorConfig.border || ""}`}
                          >
                            <IconComponent className="w-3.5 h-3.5" />
                            <span>{btn.name || "Button Text"}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <button
                    type="button"
                    onClick={handleAddButton}
                    className="w-full py-2.5 rounded-xl border-2 border-dashed border-primary text-primary hover:bg-primary-light font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Action Button to Slide {activeSlideIndex + 1}</span>
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-gray-50 text-gray-500 text-xs text-center">
                  Action buttons are currently toggled off on Slide #{activeSlideIndex + 1}.
                </div>
              )}
            </div>

            {/* Slide Feature Tags */}
            <div className="p-5 rounded-2xl bg-white border border-gray-200 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <TagIcon className="w-4 h-4 text-primary" />
                  <span className="font-bold text-sm text-text-primary">
                    Slide #{activeSlideIndex + 1} Feature Tags / Highlights
                  </span>
                  <span className="text-[11px] text-gray-500">
                    ({(currentSlide.tags || []).length} tags)
                  </span>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-xs font-bold text-gray-700">Display Tags:</span>
                  <input
                    type="checkbox"
                    checked={currentSlide.showTags ?? true}
                    onChange={(e) => handleSlideUpdate("showTags", e.target.checked)}
                    className="w-4 h-4 rounded text-primary focus:ring-primary"
                  />
                </label>
              </div>

              {(currentSlide.showTags ?? true) ? (
                <div className="space-y-3">
                  {(currentSlide.tags || []).map((tag, tIndex) => {
                    const TagIconComp =
                      (AVAILABLE_ICONS[tag.icon] && AVAILABLE_ICONS[tag.icon].icon) || TagIcon;

                    return (
                      <div
                        key={tag.id || tIndex}
                        className="p-4 rounded-xl bg-primary-surface border border-gray-200 space-y-3 relative group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-primary-light text-primary text-[10px] font-bold flex items-center justify-center">
                              {tIndex + 1}
                            </span>
                            <span className="font-bold text-xs text-text-primary">
                              Tag: {tag.name || "Untitled Tag"}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-semibold text-gray-600">
                              <span>Enabled:</span>
                              <input
                                type="checkbox"
                                checked={tag.active}
                                onChange={(e) =>
                                  handleUpdateTag(tIndex, "active", e.target.checked)
                                }
                                className="rounded text-primary focus:ring-primary"
                              />
                            </label>

                            <button
                              type="button"
                              onClick={() => handleDeleteTag(tIndex)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Delete tag"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                              Tag Name / Text
                            </label>
                            <input
                              type="text"
                              value={tag.name}
                              onChange={(e) => handleUpdateTag(tIndex, "name", e.target.value)}
                              placeholder="e.g. Eco-Tourism Hill Station"
                              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold focus:border-primary focus:outline-hidden"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                              Tag Icon
                            </label>
                            <IconSelectDropdown
                              value={tag.icon}
                              onChange={(val) => handleUpdateTag(tIndex, "icon", val)}
                            />
                          </div>
                        </div>

                        <div className="pt-1 flex items-center gap-2">
                          <span className="text-[10px] font-bold text-gray-400 uppercase">
                            Live Preview:
                          </span>
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary-light text-primary border border-border">
                            <TagIconComp className="w-3.5 h-3.5" />
                            <span>{tag.name || "Tag Text"}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="w-full py-2.5 rounded-xl border-2 border-dashed border-primary text-primary hover:bg-primary-light font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Highlight Tag to Slide {activeSlideIndex + 1}</span>
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-gray-50 text-gray-500 text-xs text-center">
                  Hero highlight tags are currently toggled off on Slide #{activeSlideIndex + 1}.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: LIVE EMERGENCY ANNOUNCEMENT TICKER */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-amber-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Bell className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h3 className="font-bold text-base text-text-primary">
                Live Emergency Announcement Ticker & Public Alert
              </h3>
              <p className="text-xs text-gray-500">
                Broadcast breaking alerts, monsoon ghat closures, and emergency helplines across the portal.
              </p>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer bg-amber-50 px-3.5 py-1.5 rounded-xl border border-amber-200">
            <span className="text-xs font-bold text-amber-900">Banner Active:</span>
            <input
              type="checkbox"
              checked={globalSettings.emergencyTickerActive}
              onChange={(e) =>
                setGlobalSettings({
                  ...globalSettings,
                  emergencyTickerActive: e.target.checked,
                })
              }
              className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
            />
          </label>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Announcement Ticker Marquee Text</span>
            </label>
            <input
              type="text"
              value={globalSettings.emergencyTicker}
              onChange={(e) =>
                setGlobalSettings({ ...globalSettings, emergencyTicker: e.target.value })
              }
              placeholder="e.g. Monsoon Ghat Helpline: 1800-233-0101 | Fire: 101 | Police: 112 | Disaster Mgmt: +91 2114 273999"
              className="w-full px-4 py-3 bg-accent-gold-surface border border-amber-300 rounded-xl text-xs font-semibold text-gray-800 focus:border-amber-500 focus:outline-hidden"
            />
          </div>

          {/* Quick preset templates */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] font-bold text-gray-500">Quick Templates:</span>
            <button
              type="button"
              onClick={() =>
                setGlobalSettings({
                  ...globalSettings,
                  emergencyTicker:
                    "Monsoon Ghat Helpline: 1800-233-0101 | Fire: 101 | Police: 112 | Disaster Mgmt: +91 2114 273999",
                  emergencyTickerActive: true,
                })
              }
              className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold text-[11px] transition-colors cursor-pointer"
            >
              Default Emergency Helplines
            </button>
            <button
              type="button"
              onClick={() =>
                setGlobalSettings({
                  ...globalSettings,
                  emergencyTicker:
                    "Heavy Rainfall Alert: Ghat road traffic under caution. For immediate rescue contact 1800-233-0101.",
                  emergencyTickerActive: true,
                })
              }
              className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold text-[11px] transition-colors cursor-pointer"
            >
              Monsoon Advisory
            </button>
            <button
              type="button"
              onClick={() =>
                setGlobalSettings({
                  ...globalSettings,
                  emergencyTicker:
                    "Civic Notice: 24x7 Control Room active at Lonavala Municipal Council headquarters.",
                  emergencyTickerActive: true,
                })
              }
              className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold text-[11px] transition-colors cursor-pointer"
            >
              24x7 Control Room
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Save Bar */}
      <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-border shadow-lg flex items-center justify-between">
        <div className="text-xs text-gray-500">
          Status: <span className="font-semibold text-gray-800">{slides.length} slides configured</span>
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
                <span>Save & Publish Homepage</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Media Preview Popup Modal */}
      {mediaPreviewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="fixed inset-0"
            onClick={() => setMediaPreviewUrl(null)}
          />

          <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-3xl w-full overflow-hidden flex flex-col max-h-[90vh] z-10 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary-light flex items-center justify-center text-primary font-bold">
                  {mediaPreviewUrl.includes("/video/") ||
                  mediaPreviewUrl.endsWith(".mp4") ||
                  mediaPreviewUrl.endsWith(".webm") ||
                  mediaPreviewUrl.endsWith(".ogg") ? (
                    <Video className="w-4 h-4" />
                  ) : (
                    <ImageIcon className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <h3 className="font-black text-sm text-text-primary">
                    Slide #{activeSlideIndex + 1} Media Preview
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-slate-200/80 text-slate-700">
                      {mediaPreviewUrl.includes("/video/") ||
                      mediaPreviewUrl.endsWith(".mp4") ||
                      mediaPreviewUrl.endsWith(".webm") ||
                      mediaPreviewUrl.endsWith(".ogg")
                        ? "Video"
                        : "Image"}
                    </span>
                    {mediaPreviewUrl.includes("cloudinary.com") && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-200">
                        Cloudinary CDN
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMediaPreviewUrl(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Media Player / Image Display Body */}
            <div className="p-6 bg-slate-950 flex items-center justify-center overflow-auto min-h-[300px] max-h-[60vh]">
              {mediaPreviewUrl.includes("/video/") ||
              mediaPreviewUrl.endsWith(".mp4") ||
              mediaPreviewUrl.endsWith(".webm") ||
              mediaPreviewUrl.endsWith(".ogg") ? (
                <video
                  src={mediaPreviewUrl}
                  controls
                  autoPlay
                  loop
                  className="max-h-[55vh] max-w-full rounded-xl shadow-2xl object-contain"
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={mediaPreviewUrl}
                  alt="Slide Media Preview"
                  className="max-h-[55vh] max-w-full rounded-xl shadow-2xl object-contain"
                />
              )}
            </div>

            {/* Modal Footer / URL Actions */}
            <div className="px-6 py-4 bg-white border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex-1 w-full min-w-0 bg-slate-50 px-3 py-2 rounded-xl border border-gray-200 text-[11px] font-mono text-gray-600 truncate">
                {mediaPreviewUrl}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(mediaPreviewUrl);
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
                  href={mediaPreviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-700 flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
                  <span>Open Full</span>
                </a>

                <button
                  type="button"
                  onClick={() => setMediaPreviewUrl(null)}
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
