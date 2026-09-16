"use client";

import { useState, useRef } from "react";
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
  Droplets,
  Zap,
  Check,
  ChevronDown,
  Sliders,
  TreePine,
  Mountain,
  Sun,
  Award,
  Layers,
  Film,
  Image as ImageIcon,
  Bell,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import Link from "next/link";

interface HeroSlide {
  id: string;
  slideTitle: string;
  alignment: "left" | "center" | "right";
  badge: string;
  badgeMr: string;
  headline: string;
  headlineMr: string;
  tagline: string;
  taglineMr: string;
  mediaUrl: string;
  mediaFileName: string;
  mediaType: "video" | "image";
  active: boolean;
}

interface HeroButton {
  id: string;
  name: string;
  url: string;
  icon: string;
  color: string;
  active: boolean;
}

interface HeroTag {
  id: string;
  name: string;
  icon: string;
  active: boolean;
}

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
  Teal: {
    label: "Teal (Green)",
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
        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs flex items-center justify-between hover:border-[#2E8B57] focus:outline-hidden transition-colors cursor-pointer"
      >
        <span className="flex items-center gap-2 truncate">
          <SelectedIcon className="w-4 h-4 text-[#2E8B57] shrink-0" />
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
                  className={`w-full px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-[#E8F5E9] text-[#2E8B57] font-bold"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="flex items-center gap-2 truncate">
                    <IconComp className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 shrink-0 text-[#2E8B57]" />}
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
        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs flex items-center justify-between hover:border-[#2E8B57] focus:outline-hidden transition-colors cursor-pointer"
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
                  className={`w-full px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-[#E8F5E9] text-[#2E8B57] font-bold"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="flex items-center gap-2 truncate">
                    <span className={`w-3.5 h-3.5 rounded-full ${item.dot} shrink-0`} />
                    <span>{item.label}</span>
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 shrink-0 text-[#2E8B57]" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// Custom Alignment Select Component with Visual Alignment Icons
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
  const selected = ALIGNMENT_OPTIONS.find((o) => o.value === value) || ALIGNMENT_OPTIONS[1];
  const SelectedIcon = selected.icon;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-3.5 py-2.5 bg-white border border-[#D9E8DD] rounded-xl text-xs font-bold text-gray-800 flex items-center justify-between hover:border-[#2E8B57] focus:outline-hidden transition-colors cursor-pointer"
      >
        <span className="flex items-center gap-2">
          <SelectedIcon className="w-4 h-4 text-[#2E8B57] shrink-0" />
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
                  className={`w-full px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-[#E8F5E9] text-[#2E8B57] font-bold"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <IconComp className="w-4 h-4 shrink-0 text-[#2E8B57]" />
                    <span className="font-semibold">{opt.label}</span>
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 shrink-0 text-[#2E8B57]" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export function HomepageContentEditor() {
  const [saved, setSaved] = useState(false);
  const slideFileInputRef = useRef<HTMLInputElement>(null);

  // Multi-Slide State
  const [slides, setSlides] = useState<HeroSlide[]>([
    {
      id: "slide-1",
      slideTitle: "Main Welcome & Eco-Governance",
      alignment: "center",
      badge: "Official Government Portal | Maharashtra Nagar Parishad",
      badgeMr: "अधिकृत शासकीय संकेतस्थळ | महाराष्ट्र नगरपरिषद",
      headline: "Welcome to Lonavala Municipal Council",
      headlineMr: "लोणावळा नगरपरिषद आपले सहर्ष स्वागत करत आहे",
      tagline:
        "Serving the Jewel of Sahyadri with sustainable eco-governance, digital public amenities, and prompt citizen redressal.",
      taglineMr:
        "सह्याद्रीच्या कुशीतील लोणावळा शहराचे शाश्वत पर्यावरण संवर्धन, गतिमान नागरी सुविधा आणि पारदर्शक ई-प्रशासनासह जतन.",
      mediaUrl: "/intro.mp4",
      mediaFileName: "intro.mp4",
      mediaType: "video",
      active: true,
    },
    {
      id: "slide-2",
      slideTitle: "Sahyadri Heritage & Eco-Tourism",
      alignment: "left",
      badge: "Clean & Green Hill Station Initiative",
      badgeMr: "स्वच्छ व सुंदर पर्यटन नगरी उपक्रम",
      headline: "Preserving the Historic Hill Retreat of Maharashtra",
      headlineMr: "महाराष्ट्रातील ऐतिहासिक गिरीस्थानाचे पर्यावरणपूरक संवर्धन",
      tagline:
        "Discover pristine waterfalls, ancient rock-cut caves, and evergreen Sahyadri botanical reserves with plastic-free municipal tourism.",
      taglineMr:
        "नयनरम्य धबधबे, प्राचीन लेणी आणि हरित वनराईचे प्लास्टिकमुक्त पर्यावरण संवर्धन.",
      mediaUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
      mediaFileName: "sahyadri-heritage.jpg",
      mediaType: "image",
      active: true,
    },
    {
      id: "slide-3",
      slideTitle: "24x7 Digital Citizen Services",
      alignment: "center",
      badge: "Citizen-First Digital Governance",
      badgeMr: "पारदर्शक व गतिमान ई-प्रशासन",
      headline: "Prompt e-Governance & Doorstep Civic Amenities",
      headlineMr: "नागरिक-केंद्रित डिजिटल सेवा आणि जलद तक्रार निवारण",
      tagline:
        "Track grievances in real-time, pay property tax online with early-bird rebates, and access municipal certifications seamlessly.",
      taglineMr:
        "ऑनलाइन कर भरणा, जन्म-मृत्यू दाखले आणि २४x७ तक्रार निवारण प्रणाली.",
      mediaUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
      mediaFileName: "digital-governance.jpg",
      mediaType: "image",
      active: true,
    },
    {
      id: "slide-4",
      slideTitle: "Special Initiative: Clean Lonavala Mission",
      alignment: "right",
      badge: "Swachh Lonavala Abhiyan 2025",
      badgeMr: "स्वच्छ लोणावळा अभियान २०२५",
      headline: "100% Door-to-Door Segregated Waste Processing",
      headlineMr: "शतप्रतिशत ओला व सुका कचरा विलगीकरण",
      tagline:
        "Join our community drive for zero plastic pollution and certified organic composting in the Sahyadri mountains.",
      taglineMr:
        "सह्याद्रीच्या डोंगररांगांमध्ये प्लास्टिकमुक्त शहर आणि सेंद्रिय खत निर्मिती.",
      mediaUrl: "/intro.mp4",
      mediaFileName: "intro.mp4",
      mediaType: "video",
      active: true,
    },
  ]);

  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // Global Settings
  const [globalSettings, setGlobalSettings] = useState({
    showButtons: true,
    showTags: true,
    emergencyTicker: "24x7 Control Room: 1800-233-0101 | Monsoon Ghat Advisory Active",
    emergencyTickerActive: true,
  });

  // Dynamic Action Buttons State
  const [buttons, setButtons] = useState<HeroButton[]>([
    {
      id: "btn-1",
      name: "Report Grievance",
      url: "/grievance/register",
      icon: "AlertCircle",
      color: "Emerald",
      active: true,
    },
    {
      id: "btn-2",
      name: "Pay Property Tax",
      url: "/services/property-tax",
      icon: "DollarSign",
      color: "Teal",
      active: true,
    },
    {
      id: "btn-3",
      name: "Citizen Services",
      url: "/services",
      icon: "FileText",
      color: "White",
      active: true,
    },
  ]);

  // Dynamic Tags State
  const [tags, setTags] = useState<HeroTag[]>([
    {
      id: "tag-1",
      name: "Eco-Tourism Hill Station",
      icon: "Leaf",
      active: true,
    },
    {
      id: "tag-2",
      name: "100% Waste Segregated",
      icon: "ShieldCheck",
      active: true,
    },
    {
      id: "tag-3",
      name: "24x7 Citizen Digital Portal",
      icon: "Zap",
      active: true,
    },
    {
      id: "tag-4",
      name: "Sahyadri Heritage Reserve",
      icon: "Mountain",
      active: true,
    },
  ]);

  const currentSlide = slides[activeSlideIndex] || slides[0];

  const handleSlideUpdate = (field: keyof HeroSlide, value: any) => {
    const updated = [...slides];
    updated[activeSlideIndex] = { ...updated[activeSlideIndex], [field]: value };
    setSlides(updated);
  };

  const handleSlideMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isImg = file.type.startsWith("image/");
      const updated = [...slides];
      updated[activeSlideIndex] = {
        ...updated[activeSlideIndex],
        mediaFileName: file.name,
        mediaUrl: URL.createObjectURL(file),
        mediaType: isImg ? "image" : "video",
      };
      setSlides(updated);
    }
  };

  const handleAddSlide = () => {
    const newSlideNumber = slides.length + 1;
    const newSlide: HeroSlide = {
      id: `slide-${Date.now()}`,
      slideTitle: `Slide ${newSlideNumber}: Special Initiative`,
      alignment: "center",
      badge: "LMC Special Announcement",
      badgeMr: "लोणावळा नगरपरिषद विशेष सूचना",
      headline: "Advancing Clean & Green Hill-Station Infrastructure",
      headlineMr: "शाश्वत पर्यावरण आणि समृद्ध लोणावळा",
      tagline:
        "Building resilient municipal public facilities, solar-powered lighting, and eco-parks across all 5 wards.",
      taglineMr:
        "सर्व ५ प्रभागांमध्ये अत्याधुनिक नागरी सुविधा आणि पर्यावरणपूरक प्रकल्प.",
      mediaUrl: "/intro.mp4",
      mediaFileName: "intro.mp4",
      mediaType: "video",
      active: true,
    };

    setSlides([...slides, newSlide]);
    setActiveSlideIndex(slides.length);
  };

  const handleDeleteSlide = (index: number) => {
    if (slides.length <= 1) {
      alert("At least one slide must remain in the hero carousel.");
      return;
    }
    const updated = slides.filter((_, idx) => idx !== index);
    setSlides(updated);
    setActiveSlideIndex(Math.max(0, index - 1));
  };

  const handleAddButton = () => {
    const newId = `btn-${Date.now()}`;
    setButtons([
      ...buttons,
      {
        id: newId,
        name: "New Action Button",
        url: "/services",
        icon: "ArrowRight",
        color: "Emerald",
        active: true,
      },
    ]);
  };

  const handleUpdateButton = (id: string, field: keyof HeroButton, value: any) => {
    setButtons(buttons.map((b) => (b.id === id ? { ...b, [field]: value } : b)));
  };

  const handleDeleteButton = (id: string) => {
    setButtons(buttons.filter((b) => b.id !== id));
  };

  const handleAddTag = () => {
    const newId = `tag-${Date.now()}`;
    setTags([
      ...tags,
      {
        id: newId,
        name: "New Highlight Tag",
        icon: "TagIcon",
        active: true,
      },
    ]);
  };

  const handleUpdateTag = (id: string, field: keyof HeroTag, value: any) => {
    setTags(tags.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
  };

  const handleDeleteTag = (id: string) => {
    setTags(tags.filter((t) => t.id !== id));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3500);
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#D9E8DD] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-[#E8F5E9] text-[#2E8B57] font-bold text-xs">
              Live Section Editor
            </span>
            <span className="text-xs text-gray-500">• Route: / (Homepage)</span>
          </div>
          <h2 className="text-xl font-extrabold text-[#1F2937] mt-1">
            Homepage Content & Hero Carousel
          </h2>
          <p className="text-xs text-gray-500">
            Manage multiple hero slides, video/image media uploads, action buttons, tags, and citizen alert banner.
          </p>
        </div>

        <div className="flex items-center gap-3">
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
            className="px-5 py-2.5 rounded-xl bg-[#2E8B57] hover:bg-[#246E45] text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Publish Changes</span>
          </button>
        </div>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 flex items-center gap-3 text-xs font-bold animate-in fade-in duration-300">
          <CheckCircle2 className="w-5 h-5 text-[#2E8B57] shrink-0" />
          <span>Homepage hero content saved and published successfully!</span>
        </div>
      )}

      {/* SECTION 1: HERO MULTI-SLIDE CAROUSEL */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#D9E8DD] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] text-[#2E8B57] flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h3 className="font-bold text-base text-[#1F2937]">Hero Carousel Slides</h3>
              <p className="text-xs text-gray-500">
                Manage hero slides ({slides.length} slides configured). Click on any slide card to edit its content.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddSlide}
            className="px-4 py-2.5 rounded-xl bg-[#2E8B57] text-white hover:bg-[#246E45] font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shrink-0 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Slide</span>
          </button>
        </div>

        {/* Slide Selection Grid Cards (Compact) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {slides.map((slide, index) => {
            const isCurrent = index === activeSlideIndex;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => setActiveSlideIndex(index)}
                className={`p-2.5 rounded-xl text-left border transition-all relative flex items-center justify-between gap-2 cursor-pointer ${
                  isCurrent
                    ? "bg-[#E8F5E9] border-[#2E8B57] ring-1 ring-[#2E8B57] shadow-xs"
                    : "bg-[#F8FCF9] border-[#D9E8DD] hover:bg-white hover:border-emerald-300"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-black shrink-0 ${
                      isCurrent
                        ? "bg-[#2E8B57] text-white"
                        : "bg-white border border-gray-300 text-gray-700"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="font-bold text-[11px] text-[#1F2937] truncate">
                      {slide.slideTitle || `Slide ${index + 1}`}
                    </div>
                    <div className="text-[9px] text-gray-500 font-medium capitalize flex items-center gap-1">
                      {slide.mediaType === "video" ? (
                        <Film className="w-2.5 h-2.5 text-purple-600" />
                      ) : (
                        <ImageIcon className="w-2.5 h-2.5 text-blue-600" />
                      )}
                      <span>{slide.mediaType}</span>
                    </div>
                  </div>
                </div>

                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md shrink-0 ${
                    slide.active
                      ? isCurrent
                        ? "bg-[#2E8B57] text-white"
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
          <div className="p-6 sm:p-7 rounded-3xl bg-[#F8FCF9] border-2 border-[#D9E8DD] space-y-6 text-xs">
            {/* Slide Header Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
              <div className="flex-1 space-y-1">
                <div className="text-[11px] font-bold text-[#2E8B57] uppercase tracking-wider">
                  Active Slide Editor
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-base text-[#1F2937]">
                    Editing Slide #{activeSlideIndex + 1}:
                  </span>
                  <span className="font-extrabold text-base text-[#2E8B57]">
                    {currentSlide.slideTitle}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-700 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200">
                  <span>Slide Active:</span>
                  <input
                    type="checkbox"
                    checked={currentSlide.active}
                    onChange={(e) => handleSlideUpdate("active", e.target.checked)}
                    className="w-4 h-4 rounded text-[#2E8B57] focus:ring-[#2E8B57]"
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
                  placeholder="e.g. Main Welcome & Eco-Governance"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D9E8DD] rounded-xl font-bold text-sm text-[#1F2937] focus:border-[#2E8B57] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Slide Content Alignment
                </label>
                <AlignmentDropdown
                  value={currentSlide.alignment || "center"}
                  onChange={(val) => handleSlideUpdate("alignment", val)}
                />
              </div>
            </div>

            {/* Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Portal Badge (English)
                </label>
                <input
                  type="text"
                  value={currentSlide.badge}
                  onChange={(e) => handleSlideUpdate("badge", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D9E8DD] rounded-xl focus:border-[#2E8B57] focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Portal Badge (Marathi)
                </label>
                <input
                  type="text"
                  value={currentSlide.badgeMr}
                  onChange={(e) => handleSlideUpdate("badgeMr", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D9E8DD] rounded-xl focus:border-[#2E8B57] focus:outline-hidden"
                />
              </div>
            </div>

            {/* Main Headlines */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Main Headline (English)
                </label>
                <input
                  type="text"
                  value={currentSlide.headline}
                  onChange={(e) => handleSlideUpdate("headline", e.target.value)}
                  placeholder="Welcome to Lonavala Municipal Council"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D9E8DD] rounded-xl font-bold text-sm text-[#1F2937] focus:border-[#2E8B57] focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Main Headline (Marathi)
                </label>
                <input
                  type="text"
                  value={currentSlide.headlineMr}
                  onChange={(e) => handleSlideUpdate("headlineMr", e.target.value)}
                  placeholder="लोणावळा नगरपरिषद आपले सहर्ष स्वागत करत आहे"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D9E8DD] rounded-xl font-bold text-sm text-[#1F2937] focus:border-[#2E8B57] focus:outline-hidden"
                />
              </div>
            </div>

            {/* Subtitles / Taglines */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Tagline / Subtitle (English)
                </label>
                <textarea
                  rows={3}
                  value={currentSlide.tagline}
                  onChange={(e) => handleSlideUpdate("tagline", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D9E8DD] rounded-xl focus:border-[#2E8B57] focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Tagline / Subtitle (Marathi)
                </label>
                <textarea
                  rows={3}
                  value={currentSlide.taglineMr}
                  onChange={(e) => handleSlideUpdate("taglineMr", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D9E8DD] rounded-xl focus:border-[#2E8B57] focus:outline-hidden"
                />
              </div>
            </div>

            {/* Slide Background Media Upload */}
            <div className="p-5 rounded-2xl bg-white border border-gray-200 space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                  <Video className="w-4 h-4 text-[#2E8B57]" />
                  <span>
                    Slide #{activeSlideIndex + 1} Background Media (Video / Image Upload)
                  </span>
                </label>
                <span className="text-[11px] text-gray-500 font-semibold">
                  Supports MP4, WebM, OGG & JPG, PNG, WebP
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
                  onClick={() => slideFileInputRef.current?.click()}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white border-2 border-dashed border-[#2E8B57] text-[#2E8B57] hover:bg-[#E8F5E9] font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Media for Slide {activeSlideIndex + 1}</span>
                </button>

                <div className="flex-1 w-full bg-[#F8FCF9] px-3.5 py-2 rounded-xl border border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-2 overflow-hidden">
                    {currentSlide.mediaType === "image" ? (
                      <FileImage className="w-4 h-4 text-[#2E8B57] shrink-0" />
                    ) : (
                      <FileVideo className="w-4 h-4 text-[#2E8B57] shrink-0" />
                    )}
                    <span className="font-mono text-gray-700 truncate text-[11px]">
                      {currentSlide.mediaFileName || currentSlide.mediaUrl}
                    </span>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full shrink-0 uppercase">
                    {currentSlide.mediaType}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons Section */}
        <div className="p-5 rounded-2xl bg-[#F8FCF9] border border-[#D9E8DD] space-y-4">
          <div className="flex items-center justify-between border-b border-gray-200/60 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#2E8B57]" />
              <span className="font-bold text-sm text-[#1F2937]">Hero Action Buttons</span>
              <span className="text-[11px] text-gray-500">({buttons.length} configured)</span>
            </div>

            {/* Master Toggle */}
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-xs font-bold text-gray-700">Display Buttons:</span>
              <input
                type="checkbox"
                checked={globalSettings.showButtons}
                onChange={(e) =>
                  setGlobalSettings({ ...globalSettings, showButtons: e.target.checked })
                }
                className="w-4 h-4 rounded text-[#2E8B57] focus:ring-[#2E8B57]"
              />
            </label>
          </div>

          {globalSettings.showButtons ? (
            <div className="space-y-3">
              {buttons.map((btn, index) => {
                const IconComponent =
                  (AVAILABLE_ICONS[btn.icon] && AVAILABLE_ICONS[btn.icon].icon) || ArrowRight;
                const colorConfig = COLOR_VARIANTS[btn.color] || COLOR_VARIANTS.Emerald;

                return (
                  <div
                    key={btn.id}
                    className="p-4 rounded-xl bg-white border border-gray-200 space-y-3 relative group shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#E8F5E9] text-[#2E8B57] text-[10px] font-bold flex items-center justify-center">
                          {index + 1}
                        </span>
                        <span className="font-bold text-xs text-[#1F2937]">
                          Button: {btn.name || "Untitled"}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-semibold text-gray-600">
                          <span>Enabled:</span>
                          <input
                            type="checkbox"
                            checked={btn.active}
                            onChange={(e) => handleUpdateButton(btn.id, "active", e.target.checked)}
                            className="rounded text-[#2E8B57] focus:ring-[#2E8B57]"
                          />
                        </label>

                        <button
                          type="button"
                          onClick={() => handleDeleteButton(btn.id)}
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
                          onChange={(e) => handleUpdateButton(btn.id, "name", e.target.value)}
                          placeholder="e.g. Report Grievance"
                          className="w-full px-3 py-2 bg-[#F8FCF9] border border-gray-200 rounded-xl text-xs font-semibold focus:border-[#2E8B57] focus:outline-hidden"
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
                          onChange={(e) => handleUpdateButton(btn.id, "url", e.target.value)}
                          placeholder="/services"
                          className="w-full px-3 py-2 bg-[#F8FCF9] border border-gray-200 rounded-xl text-xs font-mono focus:border-[#2E8B57] focus:outline-hidden"
                        />
                      </div>

                      {/* Icon Dropdown with Visual Icons */}
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                          Icon
                        </label>
                        <IconSelectDropdown
                          value={btn.icon}
                          onChange={(val) => handleUpdateButton(btn.id, "icon", val)}
                        />
                      </div>

                      {/* Color Dropdown with Visual Color Dots */}
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                          Button Color / Theme
                        </label>
                        <ColorSelectDropdown
                          value={btn.color}
                          onChange={(val) => handleUpdateButton(btn.id, "color", val)}
                          colorMap={COLOR_VARIANTS}
                        />
                      </div>
                    </div>

                    {/* Live Button Preview Chip */}
                    <div className="pt-1 flex items-center gap-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Live Preview:</span>
                      <div
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          colorConfig.bg
                        } ${colorConfig.text} ${colorConfig.border || ""}`}
                      >
                        <IconComponent className="w-3.5 h-3.5" />
                        <span>{btn.name || "Button Text"}</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Add More Buttons Trigger */}
              <button
                type="button"
                onClick={handleAddButton}
                className="w-full py-2.5 rounded-xl border-2 border-dashed border-[#2E8B57] text-[#2E8B57] hover:bg-[#E8F5E9] font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add More Buttons</span>
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-gray-50 text-gray-500 text-xs text-center">
              Action buttons are currently toggled off on the homepage hero banner.
            </div>
          )}
        </div>

        {/* Hero Tags / Feature Highlights Section */}
        <div className="p-5 rounded-2xl bg-[#F8FCF9] border border-[#D9E8DD] space-y-4">
          <div className="flex items-center justify-between border-b border-gray-200/60 pb-3">
            <div className="flex items-center gap-2">
              <TagIcon className="w-4 h-4 text-[#2E8B57]" />
              <span className="font-bold text-sm text-[#1F2937]">Hero Tags / Feature Highlights</span>
              <span className="text-[11px] text-gray-500">({tags.length} tags)</span>
            </div>

            {/* Master Toggle for Tags */}
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-xs font-bold text-gray-700">Display Tags:</span>
              <input
                type="checkbox"
                checked={globalSettings.showTags}
                onChange={(e) =>
                  setGlobalSettings({ ...globalSettings, showTags: e.target.checked })
                }
                className="w-4 h-4 rounded text-[#2E8B57] focus:ring-[#2E8B57]"
              />
            </label>
          </div>

          {globalSettings.showTags ? (
            <div className="space-y-3">
              {tags.map((tag, index) => {
                const TagIconComp =
                  (AVAILABLE_ICONS[tag.icon] && AVAILABLE_ICONS[tag.icon].icon) || TagIcon;

                return (
                  <div
                    key={tag.id}
                    className="p-4 rounded-xl bg-white border border-gray-200 space-y-3 relative group shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#E8F5E9] text-[#2E8B57] text-[10px] font-bold flex items-center justify-center">
                          {index + 1}
                        </span>
                        <span className="font-bold text-xs text-[#1F2937]">
                          Tag: {tag.name || "Untitled Tag"}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-semibold text-gray-600">
                          <span>Enabled:</span>
                          <input
                            type="checkbox"
                            checked={tag.active}
                            onChange={(e) => handleUpdateTag(tag.id, "active", e.target.checked)}
                            className="rounded text-[#2E8B57] focus:ring-[#2E8B57]"
                          />
                        </label>

                        <button
                          type="button"
                          onClick={() => handleDeleteTag(tag.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete tag"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Tag Name */}
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                          Tag Name / Text
                        </label>
                        <input
                          type="text"
                          value={tag.name}
                          onChange={(e) => handleUpdateTag(tag.id, "name", e.target.value)}
                          placeholder="e.g. Eco-Tourism Hill Station"
                          className="w-full px-3 py-2 bg-[#F8FCF9] border border-gray-200 rounded-xl text-xs font-semibold focus:border-[#2E8B57] focus:outline-hidden"
                        />
                      </div>

                      {/* Tag Icon */}
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                          Tag Icon
                        </label>
                        <IconSelectDropdown
                          value={tag.icon}
                          onChange={(val) => handleUpdateTag(tag.id, "icon", val)}
                        />
                      </div>
                    </div>

                    {/* Live Tag Preview Chip */}
                    <div className="pt-1 flex items-center gap-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Live Preview:</span>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#E8F5E9] text-[#2E8B57] border border-[#D9E8DD]">
                        <TagIconComp className="w-3.5 h-3.5" />
                        <span>{tag.name || "Tag Text"}</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Add More Tags Trigger */}
              <button
                type="button"
                onClick={handleAddTag}
                className="w-full py-2.5 rounded-xl border-2 border-dashed border-[#2E8B57] text-[#2E8B57] hover:bg-[#E8F5E9] font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add More Tags</span>
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-gray-50 text-gray-500 text-xs text-center">
              Hero tags and feature highlights are currently toggled off.
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: STANDALONE EMERGENCY ANNOUNCEMENT TICKER (OUT OF SLIDES) */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-amber-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Bell className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#1F2937]">
                Live Emergency Announcement Ticker & Public Alert
              </h3>
              <p className="text-xs text-gray-500">
                Broadcast breaking alerts, monsoon ghat closures, and emergency helplines at the top of the portal.
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
              placeholder="e.g. 24x7 Control Room: 1800-233-0101 | Monsoon Advisory Active"
              className="w-full px-4 py-3 bg-[#FFFDF5] border border-amber-300 rounded-xl text-xs font-semibold text-gray-800 focus:border-amber-500 focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Sticky Bottom Save Bar */}
      <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-[#D9E8DD] shadow-lg flex items-center justify-between">
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
            className="px-6 py-2.5 rounded-xl bg-[#2E8B57] hover:bg-[#246E45] text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save & Publish Homepage</span>
          </button>
        </div>
      </div>
    </form>
  );
}
