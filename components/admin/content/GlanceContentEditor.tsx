"use client";

import { useState, useEffect } from "react";
import {
  // People & Community
  Users,
  UserCheck,
  UserPlus,
  GraduationCap,
  School,
  Baby,
  // Services, SLA & Governance
  CheckCircle,
  CheckCircle2,
  CheckSquare,
  Clock,
  Timer,
  Hourglass,
  ShieldCheck,
  Shield,
  HelpCircle,
  PhoneCall,
  Headphones,
  Bell,
  MessageSquare,
  Landmark,
  Scale,
  Newspaper,
  // Nature, Tourism & Climate
  Trees,
  TreePine,
  Mountain,
  Sun,
  CloudRain,
  Wind,
  Waves,
  Compass,
  Tent,
  Camera,
  MapPin,
  Navigation,
  Binoculars,
  // Technology & Smart City
  Smartphone,
  Laptop,
  Wifi,
  Globe,
  Server,
  Database,
  QrCode,
  Lightbulb,
  Zap,
  Rocket,
  // Awards & Milestones
  Award,
  Medal,
  Trophy,
  Crown,
  Star,
  Sparkles,
  Flame,
  ThumbsUp,
  BookmarkCheck,
  // Infrastructure & Construction
  Building2,
  Building,
  Home,
  Castle,
  Warehouse,
  Construction,
  HardHat,
  Hammer,
  Wrench,
  // Health, Water & Sanitation
  HeartPulse,
  Heart,
  Activity,
  Stethoscope,
  Trash2,
  Recycle,
  Droplets,
  Droplet,
  Pill,
  // Transport & Mobility
  Bus,
  Car,
  Train,
  Truck,
  Bike,
  Plane,
  Fuel,
  // Finance, Tax & Business
  DollarSign,
  IndianRupee,
  CreditCard,
  Wallet,
  Receipt,
  FileText,
  FileSpreadsheet,
  Briefcase,
  // Analytics & Metrics
  BarChart3,
  BarChart,
  LineChart,
  PieChart,
  TrendingUp,
  Target,
  Gauge,
  Percent,
  Plus,
  Check,
  Save,
  ChevronDown,
  Loader2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import {
  GlanceItemDto,
  getGlanceItems,
  bulkSaveGlanceItems,
} from "@/lib/services/glance.service";

export const GLANCE_ICON_LIST: { key: string; label: string; icon: any; category: string }[] = [
  // Demographics & Citizens
  { key: "Users", label: "Users / Citizens", icon: Users, category: "Citizens" },
  { key: "UserCheck", label: "Verified Citizens", icon: UserCheck, category: "Citizens" },
  { key: "UserPlus", label: "New Enrolments", icon: UserPlus, category: "Citizens" },
  { key: "GraduationCap", label: "Education / Students", icon: GraduationCap, category: "Citizens" },
  { key: "School", label: "Schools / Academia", icon: School, category: "Citizens" },
  { key: "Baby", label: "Births / Maternity", icon: Baby, category: "Citizens" },

  // Services & Governance
  { key: "CheckCircle", label: "Resolution / SLA", icon: CheckCircle, category: "Services" },
  { key: "CheckCircle2", label: "Completed Requests", icon: CheckCircle2, category: "Services" },
  { key: "CheckSquare", label: "Compliance Rate", icon: CheckSquare, category: "Services" },
  { key: "Clock", label: "Response SLA (Hrs/Days)", icon: Clock, category: "Services" },
  { key: "Timer", label: "Turnaround Speed", icon: Timer, category: "Services" },
  { key: "Hourglass", label: "Real-time Tracking", icon: Hourglass, category: "Services" },
  { key: "ShieldCheck", label: "Safety & Eco-Protection", icon: ShieldCheck, category: "Services" },
  { key: "Shield", label: "Disaster / Security", icon: Shield, category: "Services" },
  { key: "HelpCircle", label: "Citizen Helpdesk", icon: HelpCircle, category: "Services" },
  { key: "PhoneCall", label: "24x7 Helplines", icon: PhoneCall, category: "Services" },
  { key: "Headphones", label: "Customer Support", icon: Headphones, category: "Services" },
  { key: "Bell", label: "Alerts & Notifications", icon: Bell, category: "Services" },
  { key: "MessageSquare", label: "Feedback & Grievances", icon: MessageSquare, category: "Services" },
  { key: "Landmark", label: "Municipal Council / Heritage", icon: Landmark, category: "Governance" },
  { key: "Scale", label: "Legal / RTS & RTI", icon: Scale, category: "Governance" },
  { key: "Newspaper", label: "Public Press & Gazettes", icon: Newspaper, category: "Governance" },

  // Nature, Tourism & Environment
  { key: "Trees", label: "Tourism Gateway / Forests", icon: Trees, category: "Environment" },
  { key: "TreePine", label: "Hill Station Pine Woods", icon: TreePine, category: "Environment" },
  { key: "Mountain", label: "Sahyadri Peaks / Ghats", icon: Mountain, category: "Environment" },
  { key: "Sun", label: "Weather / Clean Skies", icon: Sun, category: "Environment" },
  { key: "CloudRain", label: "Monsoon Annual Rainfall", icon: CloudRain, category: "Environment" },
  { key: "Wind", label: "Air Quality Index (AQI)", icon: Wind, category: "Environment" },
  { key: "Waves", label: "Lakes & Bhushi Dam", icon: Waves, category: "Environment" },
  { key: "Compass", label: "Tourist Exploration", icon: Compass, category: "Environment" },
  { key: "Tent", label: "Camping & Adventure", icon: Tent, category: "Environment" },
  { key: "Camera", label: "Scenic Viewpoints", icon: Camera, category: "Environment" },
  { key: "MapPin", label: "Municipal Area / Wards", icon: MapPin, category: "Environment" },
  { key: "Navigation", label: "Wayfinding / Routes", icon: Navigation, category: "Environment" },
  { key: "Binoculars", label: "Wildlife & Birding", icon: Binoculars, category: "Environment" },

  // Technology & Smart City
  { key: "Smartphone", label: "Digital Services (311 App)", icon: Smartphone, category: "Technology" },
  { key: "Laptop", label: "Online Portals / e-Gov", icon: Laptop, category: "Technology" },
  { key: "Wifi", label: "Public Smart Wi-Fi", icon: Wifi, category: "Technology" },
  { key: "Globe", label: "Web Portals & Accessibility", icon: Globe, category: "Technology" },
  { key: "Server", label: "Data Uptime (99.9%)", icon: Server, category: "Technology" },
  { key: "Database", label: "Digitised Citizen Records", icon: Database, category: "Technology" },
  { key: "QrCode", label: "QR Payment & Certificates", icon: QrCode, category: "Technology" },
  { key: "Lightbulb", label: "Smart Innovation / LED", icon: Lightbulb, category: "Technology" },
  { key: "Zap", label: "Fast-Track Services", icon: Zap, category: "Technology" },
  { key: "Rocket", label: "Civic Vision 2030", icon: Rocket, category: "Technology" },

  // Awards, Milestones & Recognition
  { key: "Award", label: "Clean City Rank / Swachh", icon: Award, category: "Awards" },
  { key: "Medal", label: "State Government Medal", icon: Medal, category: "Awards" },
  { key: "Trophy", label: "Civic Excellence Trophy", icon: Trophy, category: "Awards" },
  { key: "Crown", label: "Top Tourism Destination", icon: Crown, category: "Awards" },
  { key: "Star", label: "Citizen Satisfaction Rating", icon: Star, category: "Awards" },
  { key: "Sparkles", label: "Cleanliness Accolades", icon: Sparkles, category: "Awards" },
  { key: "Flame", label: "Fastest Growing Civic Body", icon: Flame, category: "Awards" },
  { key: "ThumbsUp", label: "Positive Civic Reviews", icon: ThumbsUp, category: "Awards" },
  { key: "BookmarkCheck", label: "Certified ISO Standard", icon: BookmarkCheck, category: "Awards" },

  // Infrastructure & Civic Works
  { key: "Building2", label: "Municipal Complex HQ", icon: Building2, category: "Infrastructure" },
  { key: "Building", label: "Commercial Properties", icon: Building, category: "Infrastructure" },
  { key: "Home", label: "Residential Households", icon: Home, category: "Infrastructure" },
  { key: "Castle", label: "Heritage Forts & History", icon: Castle, category: "Infrastructure" },
  { key: "Warehouse", label: "Logistics & Storage", icon: Warehouse, category: "Infrastructure" },
  { key: "Construction", label: "Ongoing Civic Projects", icon: Construction, category: "Infrastructure" },
  { key: "HardHat", label: "Public Works / Civil", icon: HardHat, category: "Infrastructure" },
  { key: "Hammer", label: "Civic Infrastructure", icon: Hammer, category: "Infrastructure" },
  { key: "Wrench", label: "Maintenance & Repairs", icon: Wrench, category: "Infrastructure" },

  // Health, Water & Cleanliness
  { key: "HeartPulse", label: "Health & Dispensaries", icon: HeartPulse, category: "Healthcare" },
  { key: "Heart", label: "Community Welfare", icon: Heart, category: "Healthcare" },
  { key: "Activity", label: "Emergency Readiness", icon: Activity, category: "Healthcare" },
  { key: "Stethoscope", label: "Medical Staff & Doctors", icon: Stethoscope, category: "Healthcare" },
  { key: "Trash2", label: "Solid Waste Cleared Daily", icon: Trash2, category: "Sanitation" },
  { key: "Recycle", label: "100% Waste Segregation", icon: Recycle, category: "Sanitation" },
  { key: "Droplets", label: "Daily Drinking Water Supply", icon: Droplets, category: "Water" },
  { key: "Droplet", label: "Water Quality Testing", icon: Droplet, category: "Water" },
  { key: "Pill", label: "Free Civic Medicine Supply", icon: Pill, category: "Healthcare" },

  // Transport & Connectivity
  { key: "Bus", label: "Public Transit / EV Buses", icon: Bus, category: "Transport" },
  { key: "Car", label: "Tourist Vehicle Parking", icon: Car, category: "Transport" },
  { key: "Train", label: "Expressway / Railway Link", icon: Train, category: "Transport" },
  { key: "Truck", label: "Garbage Compactor Fleet", icon: Truck, category: "Transport" },
  { key: "Bike", label: "Eco-Bicycle Lanes", icon: Bike, category: "Transport" },
  { key: "Plane", label: "Gateway Proximity", icon: Plane, category: "Transport" },
  { key: "Fuel", label: "EV Charging Stations", icon: Fuel, category: "Transport" },

  // Finance, Revenue & Economy
  { key: "DollarSign", label: "Budget / Annual Revenue", icon: DollarSign, category: "Finance" },
  { key: "IndianRupee", label: "Property Tax Collection", icon: IndianRupee, category: "Finance" },
  { key: "CreditCard", label: "Digital Cashless Counter", icon: CreditCard, category: "Finance" },
  { key: "Wallet", label: "Civic Development Funds", icon: Wallet, category: "Finance" },
  { key: "Receipt", label: "Instant Digital Receipts", icon: Receipt, category: "Finance" },
  { key: "FileText", label: "Certificates Issued", icon: FileText, category: "Finance" },
  { key: "FileSpreadsheet", label: "Tenders & Public Audits", icon: FileSpreadsheet, category: "Finance" },
  { key: "Briefcase", label: "Trade Licenses Issued", icon: Briefcase, category: "Finance" },

  // Analytics & Quantitative Growth
  { key: "BarChart3", label: "Key Performance Indicators", icon: BarChart3, category: "Analytics" },
  { key: "BarChart", label: "Annual Civic Metrics", icon: BarChart, category: "Analytics" },
  { key: "LineChart", label: "Growth Trajectory", icon: LineChart, category: "Analytics" },
  { key: "PieChart", label: "Department Resource Split", icon: PieChart, category: "Analytics" },
  { key: "TrendingUp", label: "Year-on-Year Growth", icon: TrendingUp, category: "Analytics" },
  { key: "Target", label: "Target Achievement Rate", icon: Target, category: "Analytics" },
  { key: "Gauge", label: "Civic Operational Speed", icon: Gauge, category: "Analytics" },
  { key: "Percent", label: "Tax Rebate / Discount", icon: Percent, category: "Analytics" },
];

function GlanceIconDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selectedItem =
    GLANCE_ICON_LIST.find(
      (item) => item.key.toLowerCase() === (value || "").toLowerCase()
    ) || GLANCE_ICON_LIST[0];
  const SelectedIcon = selectedItem.icon;

  const filteredIcons = GLANCE_ICON_LIST.filter(
    (item) =>
      item.label.toLowerCase().includes(search.toLowerCase()) ||
      item.key.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs flex items-center justify-between hover:border-primary focus:outline-none transition-colors cursor-pointer"
      >
        <span className="flex items-center gap-2 truncate">
          <SelectedIcon className="w-4 h-4 text-emerald-700 shrink-0" />
          <span className="font-semibold text-slate-800 truncate">
            {selectedItem.key}
          </span>
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-1 max-h-64 overflow-y-auto bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 p-2 space-y-1.5 min-w-[240px]">
            <input
              type="text"
              placeholder="Search from 70+ icons..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 mb-1 focus:outline-none focus:ring-1 focus:ring-primary"
              autoFocus
            />
            <div className="text-[10px] font-bold text-slate-400 px-2 py-0.5">
              Available Icons ({filteredIcons.length})
            </div>
            <div className="grid grid-cols-1 gap-0.5 max-h-48 overflow-y-auto">
              {filteredIcons.map((item) => {
                const IconComp = item.icon;
                const isSelected =
                  item.key.toLowerCase() === (value || "").toLowerCase();
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => {
                      onChange(item.key);
                      setIsOpen(false);
                    }}
                    className={`w-full px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-emerald-50 text-emerald-800 font-bold border border-emerald-200"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <IconComp className="w-4 h-4 shrink-0 text-emerald-700" />
                      <span className="truncate">{item.label}</span>
                    </span>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 shrink-0 text-emerald-700" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

interface FormGlanceItem {
  id?: number | string;
  title: string;
  value: string;
  tag: string;
  icon: string;
  sortOrder: number;
  active: boolean;
}

export function GlanceContentEditor() {
  const [items, setItems] = useState<FormGlanceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getGlanceItems();
      if (data && data.length > 0) {
        setItems(
          data.map((d, index) => ({
            id: d.id,
            title: d.title || "",
            value: d.value || "",
            tag: d.tag || "",
            icon: d.icon || "Users",
            sortOrder: d.sortOrder !== undefined ? d.sortOrder : index + 1,
            active: d.active !== undefined ? d.active : true,
          }))
        );
      } else {
        setItems([]);
      }
    } catch (err) {
      console.error("Failed to load glance items:", err);
      showToast("Could not fetch glance metrics from server", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFieldChange = (
    index: number,
    field: keyof FormGlanceItem,
    val: any
  ) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const handleSortChange = (fromIndex: number, targetSort: number) => {
    setItems((prev) => {
      if (prev.length <= 1) return prev;
      const copy = [...prev];
      const [movedItem] = copy.splice(fromIndex, 1);
      
      const clampedSort = Math.max(1, Math.min(targetSort || 1, prev.length));
      const targetIndex = clampedSort - 1;
      copy.splice(targetIndex, 0, movedItem);

      // Re-index all sort orders to be unique sequential 1..N
      return copy.map((item, idx) => ({
        ...item,
        sortOrder: idx + 1,
      }));
    });
  };

  const handleMoveStep = (index: number, direction: -1 | 1) => {
    const targetSort = index + 1 + direction;
    if (targetSort >= 1 && targetSort <= items.length) {
      handleSortChange(index, targetSort);
    }
  };

  const handleAddMore = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `new-${Date.now()}`,
        title: "",
        value: "",
        tag: "",
        icon: "Users",
        sortOrder: prev.length + 1,
        active: true,
      },
    ]);
  };

  const handleDeleteItem = (index: number) => {
    setItems((prev) => {
      const filtered = prev.filter((_, i) => i !== index);
      // Re-index remaining items so sort orders remain unique sequential 1..N
      return filtered.map((item, idx) => ({
        ...item,
        sortOrder: idx + 1,
      }));
    });
  };

  const handleSaveAll = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Basic validation
    for (let i = 0; i < items.length; i++) {
      if (!items[i].title.trim()) {
        showToast(`Metric #${i + 1} is missing a Title`, "error");
        return;
      }
      if (!items[i].value.trim()) {
        showToast(`Metric #${i + 1} is missing a Value`, "error");
        return;
      }
    }

    setSaving(true);
    try {
      const payload = items.map((item, idx) => ({
        id: item.id,
        title: item.title.trim(),
        value: item.value.trim(),
        tag: item.tag.trim(),
        icon: item.icon || "Users",
        sortOrder: Number(item.sortOrder) || idx + 1,
        active: item.active,
      }));

      const res = await bulkSaveGlanceItems(payload);
      if (res.error) throw new Error(res.error);

      showToast("Lonavala Council at a Glance saved successfully!");
      await loadData();
    } catch (err: any) {
      console.error("Failed to save glance metrics:", err);
      showToast(err.message || "Failed to save changes", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
        <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
        <p className="text-xs font-semibold text-slate-500">
          Loading Glance Content Form...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-xl border backdrop-blur-md flex items-center gap-3 transition-all animate-in fade-in slide-in-from-bottom-5 duration-300 ${
            toastMessage.type === "success"
              ? "bg-emerald-950/90 text-emerald-100 border-emerald-500/40"
              : "bg-red-950/90 text-red-100 border-red-500/40"
          }`}
        >
          {toastMessage.type === "success" ? (
            <Check className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          )}
          <span className="text-xs font-semibold">{toastMessage.text}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Lonavala Municipal Council at a Glance
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage the metric cards shown on Homepage and About Us page (Icon, Title, Value, Tag, and Sort Order).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadData}
            disabled={saving}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <button
            type="button"
            onClick={() => handleSaveAll()}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-md hover:bg-primary/90 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* Form List */}
      <form onSubmit={handleSaveAll} className="space-y-4">
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={item.id || index}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3 sm:gap-4 items-end">
                {/* 1. Icon Dropdown (md: 3 cols) */}
                <div className="md:col-span-3">
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Icon
                  </label>
                  <GlanceIconDropdown
                    value={item.icon}
                    onChange={(newIcon) =>
                      handleFieldChange(index, "icon", newIcon)
                    }
                  />
                </div>

                {/* 2. Title Input (md: 3 cols) */}
                <div className="md:col-span-3">
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Citizens Served"
                    value={item.title}
                    onChange={(e) =>
                      handleFieldChange(index, "title", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
                  />
                </div>

                {/* 3. Value Input (md: 2 cols) */}
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Value <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 75,000+"
                    value={item.value}
                    onChange={(e) =>
                      handleFieldChange(index, "value", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-bold text-slate-900"
                  />
                </div>

                {/* 4. Tag Input (md: 2 cols) */}
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Tag / Sub-text
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Across 5 Wards"
                    value={item.tag}
                    onChange={(e) =>
                      handleFieldChange(index, "tag", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                {/* 5. Sort Order (md: 1 col) */}
                <div className="md:col-span-1">
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Sort
                  </label>
                  <select
                    value={item.sortOrder}
                    onChange={(e) =>
                      handleSortChange(index, parseInt(e.target.value) || 1)
                    }
                    className="w-full px-2 py-2 bg-white border border-slate-200 rounded-xl text-xs text-center font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono cursor-pointer"
                  >
                    {items.map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        #{i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 6. Active Toggle & Delete Action (md: 1 col) */}
                <div className="md:col-span-1 flex items-center justify-end gap-2 pb-0.5">
                  <label
                    title={item.active ? "Visible on site" : "Hidden"}
                    className="relative inline-flex items-center cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={item.active}
                      onChange={(e) =>
                        handleFieldChange(index, "active", e.target.checked)
                      }
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>

                  <button
                    type="button"
                    onClick={() => handleDeleteItem(index)}
                    title="Remove Metric"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Empty State with Add Metric button inside */}
          {items.length === 0 && (
            <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-200 space-y-4">
              <BarChart3 className="w-10 h-10 text-slate-300 mx-auto" />
              <div>
                <h4 className="text-sm font-bold text-slate-800">
                  No metrics added yet
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Click the button below to add your first Council at a Glance metric card.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddMore}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Metric</span>
              </button>
            </div>
          )}
        </div>

        {/* Full-width Add More Metrics Button when items exist */}
        {items.length > 0 && (
          <div className="space-y-4 pt-2">
            <button
              type="button"
              onClick={handleAddMore}
              className="w-full py-3.5 px-4 rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/40 hover:bg-emerald-50 text-emerald-800 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer hover:border-emerald-500 shadow-xs"
            >
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>Add More Metrics</span>
            </button>

            <div className="flex items-center justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3 rounded-xl bg-primary text-white text-xs font-bold shadow-md hover:bg-primary/90 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
