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
  Edit2,
  Eye,
  Images,
  Film,
  Video,
  ArrowUpDown,
  Search,
} from "lucide-react";
import Link from "next/link";

interface HighlightPair {
  id: string;
  key: string;
  value: string;
}

interface ImportantPoint {
  id: string;
  icon: string;
  text: string;
}

interface GalleryImage {
  id: string;
  url: string;
  fileName: string;
  mediaType?: "image" | "video";
  caption?: string;
}

export interface TourismDestination {
  id: string;
  label: string;
  name: string;
  description: string;
  highlights: HighlightPair[];
  distance: string;
  importantPoints: ImportantPoint[];
  imageUrl: string;
  imageFileName: string;
  galleryImages: GalleryImage[];
  active: boolean;
}

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

export function TourismContentEditor() {
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  const [searchQuery, setSearchQuery] = useState("");

  const [destinations, setDestinations] = useState<TourismDestination[]>([
    {
      id: "dest-1",
      name: "Tiger Point (Tiger's Leap)",
      label: "Scenic Valley & Waterfall",
      distance: "8.5 km from Lonavala Railway Station (via INS Shivaji Road)",
      imageUrl:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
      imageFileName: "tiger-point-cliff.jpg",
      description:
        "Perched at a sheer drop of over 650 meters, Tiger Point provides a magnificent panorama of the Western Ghats ravines, roaring monsoon waterfalls, and undulating Sahyadri clouds. A quintessential Lonavala cliff landmark popular for morning sunrise views and roasted corn stalls.",
      highlights: [
        { id: "h-1", key: "Best Time to Visit", value: "Monsoon & Winter (July to February)" },
        { id: "h-2", key: "Altitude", value: "650 meters above sea level" },
        { id: "h-3", key: "Entry Fee", value: "Free (Municipal Parking: ₹50)" },
        { id: "h-4", key: "Visiting Hours", value: "06:00 AM – 06:30 PM (Daily)" },
      ],
      importantPoints: [
        {
          id: "ip-1",
          icon: "AlertTriangle",
          text: "Steep valley precipice — strictly avoid crossing safety barricades for selfies.",
        },
        {
          id: "ip-2",
          icon: "Leaf",
          text: "Plastic-free eco-sensitive zone: littering or glass disposal carries a strict municipal penalty.",
        },
        {
          id: "ip-3",
          icon: "Car",
          text: "Designated municipal parking available with token entry during peak monsoon weekends.",
        },
      ],
      galleryImages: [
        {
          id: "g-1",
          url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
          fileName: "tiger-leap-dawn.jpg",
          caption: "Sunrise mist over Borghat Valley",
        },
        {
          id: "g-2",
          url: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=600&q=80",
          fileName: "waterfall-cascade.jpg",
          caption: "Monsoon seasonal cascades near cliff edge",
        },
      ],
      active: true,
    },
    {
      id: "dest-2",
      name: "Bhushi Dam & Water Cascade",
      label: "Monsoon Water Reservoir",
      distance: "6.0 km from LMC Municipal Complex",
      imageUrl:
        "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800&q=80",
      imageFileName: "bhushi-dam-overflow.jpg",
      description:
        "Built on the Indrayani River, Bhushi Dam is world-renowned for its overflowing steps during peak monsoon rains. Tourists from Mumbai and Pune flock to experience cascading mountain water and fresh Sahyadri breezes in a vibrant festive hill environment.",
      highlights: [
        { id: "h-21", key: "Best Season", value: "Peak Monsoon (July to September)" },
        { id: "h-22", key: "Entry Fee", value: "Free entry" },
        { id: "h-23", key: "Operating Hours", value: "09:00 AM – 05:00 PM" },
        { id: "h-24", key: "Water Source", value: "Indrayani River Watershed" },
      ],
      importantPoints: [
        {
          id: "ip-21",
          icon: "ShieldCheck",
          text: "Lifeguards and municipal safety marshals are deployed on-site during heavy discharge periods.",
        },
        {
          id: "ip-22",
          icon: "Ban",
          text: "Swimming in unbarricaded deep reservoir waters is strictly prohibited under Sec 144.",
        },
      ],
      galleryImages: [
        {
          id: "g-21",
          url: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=600&q=80",
          fileName: "bhushi-steps.jpg",
          caption: "Overflowing stone steps during July rains",
        },
      ],
      active: true,
    },
    {
      id: "dest-3",
      name: "Karla Ancient Rock-Cut Caves",
      label: "Buddhist Heritage & Architecture",
      distance: "11.0 km from Lonavala Town Center",
      imageUrl:
        "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80",
      imageFileName: "karla-caves-chaitya.jpg",
      description:
        "Dating back to the 2nd Century BCE, Karla Caves house India's largest and most pristine rock-cut Chaitya hall, complete with intricate teak wood umbrella architecture, monolithic Ashokan pillars, and historical Brahmi script inscriptions.",
      highlights: [
        { id: "h-31", key: "Heritage Era", value: "2nd Century BCE (Satavahana Dynasty)" },
        { id: "h-32", key: "ASI Entry Fee", value: "₹25 (Indian Citizens), ₹300 (Foreign Nationals)" },
        { id: "h-33", key: "Climb Steps", value: "Approx. 350 stone steps" },
        { id: "h-34", key: "Temple Shrine", value: "Ekvira Aai Temple located adjacent" },
      ],
      importantPoints: [
        {
          id: "ip-31",
          icon: "Camera",
          text: "Non-commercial photography permitted; tripod usage requires ASI permission.",
        },
        {
          id: "ip-32",
          icon: "Clock",
          text: "Ticket counter closes at 05:00 PM. Plan arrival at least 90 minutes before sunset.",
        },
      ],
      galleryImages: [
        {
          id: "g-31",
          url: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80",
          fileName: "karla-great-chaitya.jpg",
          caption: "Grand Great Chaitya Hall with teak ribbing",
        },
      ],
      active: true,
    },
  ]);

  const [selectedDestId, setSelectedDestId] = useState<string>("dest-1");
  const activeIndex = destinations.findIndex((d) => d.id === selectedDestId);
  const currentDest = destinations[activeIndex >= 0 ? activeIndex : 0] || destinations[0];

  const handleUpdateCurrent = (field: keyof TourismDestination, value: any) => {
    setDestinations(
      destinations.map((d) => (d.id === currentDest.id ? { ...d, [field]: value } : d))
    );
  };

  const handleToggleActive = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDestinations(
      destinations.map((d) => (d.id === id ? { ...d, active: !d.active } : d))
    );
  };

  const handleFeatureImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpdateCurrent("imageFileName", file.name);
      handleUpdateCurrent("imageUrl", URL.createObjectURL(file));
    }
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isVideo = file.type.startsWith("video/") || /\.(mp4|webm|ogg|mov)$/i.test(file.name);
      const newImg: GalleryImage = {
        id: `gal-${Date.now()}`,
        url: URL.createObjectURL(file),
        fileName: file.name,
        mediaType: isVideo ? "video" : "image",
      };
      handleUpdateCurrent("galleryImages", [...(currentDest.galleryImages || []), newImg]);
      e.target.value = "";
    }
  };

  const handleAddDestination = () => {
    const newId = `dest-${Date.now()}`;
    const newDest: TourismDestination = {
      id: newId,
      name: "New Tourism Destination",
      label: "Scenic Viewpoint",
      distance: "5.0 km from Town Center",
      imageUrl:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
      imageFileName: "new-destination.jpg",
      description:
        "Write a detailed description highlighting the historical context, natural beauty, and visitor attractions...",
      highlights: [
        { id: `h-${Date.now()}-1`, key: "Best Time to Visit", value: "Monsoon & Winter" },
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
    };

    setDestinations([...destinations, newDest]);
    setSelectedDestId(newId);
  };

  const handleDeleteDestination = (id: string) => {
    if (destinations.length <= 1) {
      alert("At least one tourism destination must remain configured.");
      return;
    }
    const updated = destinations.filter((d) => d.id !== id);
    setDestinations(updated);
    if (selectedDestId === id) {
      setSelectedDestId(updated[0].id);
    }
  };

  // Highlights Key-Value Pair Handlers
  const handleAddHighlight = () => {
    const newH: HighlightPair = {
      id: `h-${Date.now()}`,
      key: "New Key",
      value: "Value description",
    };
    handleUpdateCurrent("highlights", [...(currentDest.highlights || []), newH]);
  };

  const handleUpdateHighlight = (id: string, field: "key" | "value", val: string) => {
    const updated = (currentDest.highlights || []).map((h) =>
      h.id === id ? { ...h, [field]: val } : h
    );
    handleUpdateCurrent("highlights", updated);
  };

  const handleDeleteHighlight = (id: string) => {
    const updated = (currentDest.highlights || []).filter((h) => h.id !== id);
    handleUpdateCurrent("highlights", updated);
  };

  // Important Points Handlers
  const handleAddPoint = () => {
    const newPt: ImportantPoint = {
      id: `ip-${Date.now()}`,
      icon: "Info",
      text: "New important advisory or visitor point.",
    };
    handleUpdateCurrent("importantPoints", [...(currentDest.importantPoints || []), newPt]);
  };

  const handleUpdatePoint = (id: string, field: "icon" | "text", val: string) => {
    const updated = (currentDest.importantPoints || []).map((pt) =>
      pt.id === id ? { ...pt, [field]: val } : pt
    );
    handleUpdateCurrent("importantPoints", updated);
  };

  const handleDeletePoint = (id: string) => {
    const updated = (currentDest.importantPoints || []).filter((pt) => pt.id !== id);
    handleUpdateCurrent("importantPoints", updated);
  };

  // Gallery Images Handlers
  const handleUpdateGalleryCaption = (id: string, caption: string) => {
    const updated = (currentDest.galleryImages || []).map((g) =>
      g.id === id ? { ...g, caption } : g
    );
    handleUpdateCurrent("galleryImages", updated);
  };

  const handleDeleteGalleryImage = (id: string) => {
    const updated = (currentDest.galleryImages || []).filter((g) => g.id !== id);
    handleUpdateCurrent("galleryImages", updated);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3500);
  };

  const filteredDestinations = destinations.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.distance.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-border shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-primary-light text-primary font-bold text-xs">
              Live Section Editor
            </span>
            <span className="text-xs text-gray-500">• Route: /tourism (Tourism & Landmarks)</span>
          </div>
          <h2 className="text-xl font-extrabold text-text-primary mt-1">Tourism & Attractions Content</h2>
          <p className="text-xs text-gray-500">
            Manage tourist landmarks, labels, descriptions, key-value highlights, proximity distance, gallery images, and advisory points.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/tourism"
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
          <span>Tourism destinations and attraction points saved successfully!</span>
        </div>
      )}

      {/* SECTION 1: Tourism Destinations in Table Format */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-text-primary">Tourism Destinations Table</h3>
              <p className="text-xs text-gray-500">
                Manage destination records ({destinations.length} configured). Click edit to update details below.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search destinations..."
                className="pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs w-48 sm:w-60 focus:bg-white focus:border-primary focus:outline-hidden"
              />
            </div>

            <button
              type="button"
              onClick={handleAddDestination}
              className="px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary-hover font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Destination</span>
            </button>
          </div>
        </div>

        {/* Table Format */}
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-primary-surface border-b border-border text-gray-700 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4"># / Photo</th>
                <th className="py-3 px-4">Destination Name & Label</th>
                <th className="py-3 px-4">Distance / Location</th>
                <th className="py-3 px-3 text-center">Highlights</th>
                <th className="py-3 px-3 text-center">Advisories</th>
                <th className="py-3 px-3 text-center">Gallery</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredDestinations.map((dest, index) => {
                const isSelected = dest.id === currentDest?.id;
                return (
                  <tr
                    key={dest.id}
                    onClick={() => setSelectedDestId(dest.id)}
                    className={`transition-colors cursor-pointer ${isSelected
                        ? "bg-primary-light/60 font-semibold"
                        : "hover:bg-gray-50/80"
                      }`}
                  >
                    {/* Index & Thumbnail */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-white border border-gray-200 text-gray-600 flex items-center justify-center text-[10px] font-bold">
                          {index + 1}
                        </span>
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0 relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={dest.imageUrl}
                            alt={dest.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </td>

                    {/* Name & Label */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-text-primary text-xs leading-tight">
                        {dest.name}
                      </div>
                      <div className="text-[10px] text-primary font-semibold mt-0.5">
                        {dest.label || "Attraction"}
                      </div>
                    </td>

                    {/* Distance */}
                    <td className="py-3 px-4 text-gray-600 text-[11px] max-w-xs truncate">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-primary shrink-0" />
                        <span className="truncate">{dest.distance}</span>
                      </span>
                    </td>

                    {/* Highlights Count */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold text-[10px] border border-emerald-200">
                        {dest.highlights?.length || 0} specs
                      </span>
                    </td>

                    {/* Advisories Count */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 font-bold text-[10px] border border-amber-200">
                        {dest.importantPoints?.length || 0} points
                      </span>
                    </td>

                    {/* Gallery Count */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 font-bold text-[10px] border border-blue-200 flex items-center justify-center gap-1 mx-auto w-fit">
                        <Images className="w-2.5 h-2.5 text-blue-600" />
                        <span>{dest.galleryImages?.length || 0}</span>
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => handleToggleActive(dest.id, e)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-colors ${dest.active
                            ? "bg-primary text-white hover:bg-primary-hover"
                            : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                          }`}
                      >
                        {dest.active ? "● Active" : "○ Inactive"}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => setSelectedDestId(dest.id)}
                          className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${isSelected
                              ? "bg-primary text-white border-primary"
                              : "bg-white border-gray-200 text-gray-700 hover:bg-gray-100"
                            }`}
                          title="Edit destination details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span className="text-[10px]">Edit</span>
                        </button>

                        {destinations.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleDeleteDestination(dest.id)}
                            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 border border-red-200 transition-colors cursor-pointer"
                            title="Delete destination"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: Form Editor for Selected Destination */}
      {currentDest && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-border shadow-xs space-y-6 text-xs">
          {/* Header Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-primary-surface p-4 rounded-2xl border border-border">
            <div className="flex-1 space-y-1">
              <div className="text-[11px] font-bold text-primary uppercase tracking-wider">
                Destination Detailed Editor
              </div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base text-text-primary">
                  Editing:
                </span>
                <span className="font-extrabold text-base text-primary">
                  {currentDest.name}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-700 bg-white px-3 py-1.5 rounded-xl border border-gray-200">
                <span>Destination Active:</span>
                <input
                  type="checkbox"
                  checked={currentDest.active}
                  onChange={(e) => handleUpdateCurrent("active", e.target.checked)}
                  className="w-4 h-4 rounded text-primary focus:ring-primary"
                />
              </label>

              {destinations.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleDeleteDestination(currentDest.id)}
                  className="px-3 py-1.5 rounded-xl text-red-600 hover:bg-red-50 border border-red-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Delete this destination"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Destination</span>
                </button>
              )}
            </div>
          </div>

          {/* Basic Fields: Name, Label, Distance */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                Destination Name
              </label>
              <input
                type="text"
                value={currentDest.name}
                onChange={(e) => handleUpdateCurrent("name", e.target.value)}
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
                value={currentDest.label}
                onChange={(e) => handleUpdateCurrent("label", e.target.value)}
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
                value={currentDest.distance}
                onChange={(e) => handleUpdateCurrent("distance", e.target.value)}
                placeholder="e.g. 8.5 km from Lonavala Station"
                className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl focus:border-primary focus:outline-hidden"
              />
            </div>
          </div>

          {/* Feature Image Upload */}
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
                Supports JPG, PNG, WebP, SVG
              </span>
            </div>

            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-5">
              {/* Visual Photo Preview Thumbnail */}
              <div className="relative w-full md:w-44 h-28 rounded-2xl overflow-hidden bg-slate-900 border-2 border-border flex items-center justify-center shrink-0 shadow-2xs group">
                {currentDest.imageUrl ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={currentDest.imageUrl}
                      alt={currentDest.name || "Cover Image Preview"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <a
                        href={currentDest.imageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-white/95 text-gray-800 hover:bg-white text-xs font-bold flex items-center gap-1 shadow-md transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-primary" />
                        <span className="text-[10px]">Preview</span>
                      </a>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-3">
                    <Camera className="w-7 h-7 text-gray-400 mx-auto mb-1" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase">No Cover Selected</span>
                  </div>
                )}
              </div>

              {/* Action Buttons & URL */}
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                    onChange={handleFeatureImageChange}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{currentDest.imageUrl ? "Replace Cover Image" : "Upload Cover Image"}</span>
                  </button>

                  {currentDest.imageUrl && (
                    <a
                      href={currentDest.imageUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 hover:border-primary hover:bg-primary-light text-gray-700 hover:text-primary font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <Eye className="w-4 h-4 text-primary" />
                      <span>Preview Cover</span>
                    </a>
                  )}

                  {currentDest.imageUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        handleUpdateCurrent("imageUrl", "");
                        handleUpdateCurrent("imageFileName", "");
                      }}
                      className="px-3 py-2.5 rounded-xl bg-white border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Remove</span>
                    </button>
                  )}
                </div>

                <div className="bg-white px-3.5 py-2 rounded-xl border border-gray-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 overflow-hidden min-w-0">
                    <FileImage className="w-4 h-4 text-primary shrink-0" />
                    <span className="font-mono text-gray-700 truncate text-[11px]">
                      {currentDest.imageFileName || currentDest.imageUrl || "No cover image uploaded"}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-semibold shrink-0 ml-2">
                    JPG / PNG / WebP / SVG
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
              Destination Description & Overview
            </label>
            <textarea
              rows={4}
              value={currentDest.description}
              onChange={(e) => handleUpdateCurrent("description", e.target.value)}
              placeholder="Write detailed tourist information, natural landscape description, historical background..."
              className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl leading-relaxed focus:border-primary focus:outline-hidden text-xs"
            />
          </div>

          {/* Important Points (Icon + Text) */}
          <div className="p-4 rounded-2xl bg-primary-surface border border-border space-y-3">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <div>
                <span className="font-bold text-gray-800 uppercase tracking-wider block">
                  Important Points & Visitor Advisories (Icon + Text)
                </span>
                <span className="text-[11px] text-gray-500">
                  Safety notices, eco-guidelines, parking advice, and visitor precautions.
                </span>
              </div>

              <button
                type="button"
                onClick={handleAddPoint}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-primary border border-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Important Point</span>
              </button>
            </div>

            <div className="space-y-3">
              {(currentDest.importantPoints || []).map((pt) => (
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
          </div>


          {/* Key Highlights (Key-Value Pairs) */}
          <div className="p-4 rounded-2xl bg-primary-surface border border-border space-y-3">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <div>
                <span className="font-bold text-gray-800 uppercase tracking-wider block">
                  Key Highlights (Key-Value Pairs)
                </span>
                <span className="text-[11px] text-gray-500">
                  Quick tourist facts such as Best Time, Entry Fee, Timings, Altitude, etc.
                </span>
              </div>

              <button
                type="button"
                onClick={handleAddHighlight}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-primary border border-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Highlight Pair</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {(currentDest.highlights || []).map((hl) => (
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
          </div>


          {/* Gallery Media Section */}
          <div className="p-4 rounded-2xl bg-primary-surface border border-border space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <div>
                <span className="font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Images className="w-4 h-4 text-primary" />
                  <span>Destination Gallery Media ({currentDest.galleryImages?.length || 0})</span>
                </span>
                <span className="text-[11px] text-gray-500">
                  Photos and videos showing viewpoints, waterfalls, monuments, and surroundings.
                </span>
              </div>

              <div>
                <input
                  ref={galleryFileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml,image/gif,video/mp4,video/webm,video/ogg,video/quicktime"
                  onChange={handleGalleryUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => galleryFileInputRef.current?.click()}
                  className="px-3.5 py-1.5 rounded-xl bg-primary text-white hover:bg-primary-hover font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Media (Photo / Video)</span>
                </button>
              </div>
            </div>

            {/* Gallery Grid Cards */}
            {(currentDest.galleryImages || []).length === 0 ? (
              <div className="p-6 text-center bg-white rounded-2xl border border-dashed border-gray-300 text-gray-400">
                <div className="flex items-center justify-center gap-2 mb-1 text-gray-300">
                  <Images className="w-7 h-7" />
                  <Video className="w-7 h-7" />
                </div>
                <p className="font-semibold text-gray-600">No gallery photos or videos uploaded yet</p>
                <p className="text-[11px] text-gray-400">Click &quot;Add Media (Photo / Video)&quot; above to upload destination media</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {currentDest.galleryImages.map((img) => {
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

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => handleDeleteGalleryImage(img.id)}
                          className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-600/90 text-white hover:bg-red-700 transition-colors shadow-xs cursor-pointer"
                          title={isVideo ? "Delete this video" : "Delete this photo"}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

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
            <span>Save & Publish Tourism</span>
          </button>
        </div>
      </div>
    </form>
  );
}
