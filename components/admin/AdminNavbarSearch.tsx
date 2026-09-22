"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  LayoutDashboard,
  AlertCircle,
  Landmark,
  Layers,
  Home,
  Info,
  Phone,
  Compass,
  HelpCircle,
  Building2,
  HardHat,
  FileSpreadsheet,
  Briefcase,
  Bell,
  Users,
  BarChart3,
  Settings,
  ArrowRight,
  Sparkles,
  Scale,
  Calendar,
} from "lucide-react";

export interface SearchableModule {
  id: string;
  name: string;
  category: string;
  href: string;
  icon: any;
  keywords: string[];
  badge?: string;
  description?: string;
}

const MODULES_LIST: SearchableModule[] = [
  {
    id: "dashboard",
    name: "Dashboard",
    category: "Overview",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    keywords: ["dashboard", "home", "analytics", "overview", "stats", "metrics"],
    description: "Main administrative overview and portal summary",
  },
  {
    id: "grievances",
    name: "Grievances & Complaints",
    category: "Citizen Services",
    href: "/admin/grievances",
    icon: AlertCircle,
    badge: "3 New",
    keywords: ["grievance", "complaint", "issue", "citizen", "redressal", "ticket"],
    description: "Manage citizen complaints and redressal statuses",
  },
  {
    id: "council",
    name: "Councils & Members",
    category: "Governance",
    href: "/admin/council",
    icon: Landmark,
    keywords: ["council", "member", "corporator", "mayor", "committee", "ward", "elected"],
    description: "Manage city council members, wards, and leadership directory",
  },
  {
    id: "standing-committees",
    name: "Committees",
    category: "Governance",
    href: "/admin/committees",
    icon: Layers,
    keywords: ["standing committee", "committee", "committees", "chairman", "members", "council members", "statutory", "samiti"],
    description: "Manage statutory committees, appointed chairpersons, and member rosters",
  },
  {
    id: "court-committee",
    name: "Court Committee Hub",
    category: "Governance",
    href: "/admin/court",
    icon: Scale,
    keywords: ["court", "high court", "legal", "proceedings", "committee", "advocates", "law", "orders", "विधी", "न्यायालय", "न्यायालयीन"],
    description: "Manage Hon. High Court committee members, legal officers, and judicial proceedings",
  },
  {
    id: "court-members",
    name: "Court Committee Members",
    category: "Governance",
    href: "/admin/court/members",
    icon: Users,
    keywords: ["court members", "legal committee", "advocates", "chairman", "corporators", "विधी समिती सदस्य"],
    description: "Manage committee leadership, appointed corporators, and legal staff",
  },
  {
    id: "court-proceedings",
    name: "Court Proceedings & Orders",
    category: "Governance",
    href: "/admin/court/proceedings",
    icon: Scale,
    keywords: ["court proceedings", "court orders", "high court", "ngt", "lok adalat", "minutes", "न्यायालयीन कामकाज", "आदेश"],
    description: "Manage High Court petitions, green tribunal matters, and proceeding minutes",
  },
  {
    id: "court-sessions",
    name: "Next Session",
    category: "Governance",
    href: "/admin/court/sessions",
    icon: Calendar,
    keywords: ["court session", "hearing schedule", "next hearing", "cause list", "bench", "सुनावणी", "वेळापत्रक"],
    description: "Schedule and manage upcoming court hearings and previous sessions history",
  },
  {
    id: "council-resolutions",
    name: "Council Resolutions",
    category: "Governance",
    href: "/admin/resolutions",
    icon: FileSpreadsheet,
    keywords: ["resolution", "resolutions", "council", "meeting", "gazette", "minutes", "general body", "ठराव"],
    description: "Manage official council resolutions, meeting minutes, and gazettes",
  },
  {
    id: "content-hub",
    name: "Content Management Hub",
    category: "Content",
    href: "/admin/content",
    icon: Layers,
    keywords: ["content", "cms", "website", "pages", "media", "manage"],
    description: "Central manager for all public portal content",
  },
  {
    id: "content-homepage",
    name: "Homepage Content",
    category: "Content",
    href: "/admin/content/homepage",
    icon: Home,
    keywords: ["homepage", "hero", "slider", "banner", "welcome", "quick links", "stats"],
    description: "Edit hero banners, quick statistics, and homepage notices",
  },
  {
    id: "content-about",
    name: "About Us Page",
    category: "Content",
    href: "/admin/content/about",
    icon: Info,
    keywords: ["about", "history", "city profile", "vision", "mission", "lonavala info"],
    description: "Edit city history, administration profile, and mission",
  },
  {
    id: "content-contacts",
    name: "Emergency & Office Contacts",
    category: "Content",
    href: "/admin/content/contacts",
    icon: Phone,
    keywords: ["contact", "emergency", "phone", "email", "helpline", "fire", "police", "hospital"],
    description: "Update department phone numbers and emergency helplines",
  },
  {
    id: "content-tourism",
    name: "Tourism Destinations",
    category: "Content",
    href: "/admin/content/tourism",
    icon: Compass,
    keywords: ["tourism", "destinations", "places", "attractions", "travel", "points", "spots"],
    description: "Manage tourist attractions, galleries, and visiting guides",
  },
  {
    id: "content-faq",
    name: "FAQs & Help",
    category: "Content",
    href: "/admin/content/faq",
    icon: HelpCircle,
    keywords: ["faq", "frequently asked questions", "help", "questions", "answers"],
    description: "Manage citizen questions and answers",
  },
  {
    id: "departments",
    name: "Departments",
    category: "Administration",
    href: "/admin/departments",
    icon: Building2,
    keywords: ["department", "water", "sanitation", "engineering", "tax", "health", "admin"],
    description: "Manage municipal departments and head officers",
  },
  {
    id: "projects",
    name: "Projects & Works",
    category: "Operations",
    href: "/admin/projects",
    icon: HardHat,
    keywords: ["project", "work", "development", "infrastructure", "smart city", "roads", "civic"],
    description: "Track and publish municipal infrastructure projects",
  },
  {
    id: "tenders",
    name: "Tenders & Contracts",
    category: "Procurement",
    href: "/admin/tenders",
    icon: FileSpreadsheet,
    keywords: ["tender", "contract", "e-tender", "procurement", "bid", "quotation", "notice"],
    description: "Publish and manage tender notices and downloadable documents",
  },
  {
    id: "recruitment",
    name: "Recruitment & Careers",
    category: "Human Resources",
    href: "/admin/recruitment",
    icon: Briefcase,
    keywords: ["recruitment", "job", "career", "vacancy", "post", "application", "hiring"],
    description: "Manage job openings, circulars, and recruitment drives",
  },
  {
    id: "notices",
    name: "Notices",
    category: "Publications",
    href: "/admin/notices",
    icon: Bell,
    keywords: ["notice", "gazette", "circular", "announcement", "press release", "news", "orders"],
    description: "Publish official notices, gazette publications, and circulars",
  },
  {
    id: "users",
    name: "Users & Roles",
    category: "System",
    href: "/admin/users",
    icon: Users,
    keywords: ["user", "role", "admin", "permission", "staff", "account", "access"],
    description: "Manage admin console users and system permissions",
  },
  {
    id: "reports",
    name: "Reports & Analytics",
    category: "Analytics",
    href: "/admin/reports",
    icon: BarChart3,
    keywords: ["report", "analytics", "statistics", "data", "audit", "downloads", "export"],
    description: "View department performance, grievance statistics, and reports",
  },
  {
    id: "settings",
    name: "Portal Settings",
    category: "System",
    href: "/admin/settings",
    icon: Settings,
    keywords: ["setting", "portal", "config", "system", "general", "preferences", "maintenance"],
    description: "Configure system preferences and portal-wide settings",
  },
];

export default function AdminNavbarSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter modules based on query
  const filteredModules = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      // Return top/popular modules when search is empty
      return MODULES_LIST;
    }

    return MODULES_LIST.filter((mod) => {
      const matchName = mod.name.toLowerCase().includes(q);
      const matchCategory = mod.category.toLowerCase().includes(q);
      const matchDesc = mod.description?.toLowerCase().includes(q);
      const matchKeywords = mod.keywords.some((k) => k.toLowerCase().includes(q));
      return matchName || matchCategory || matchDesc || matchKeywords;
    }).sort((a, b) => {
      // Prioritize direct name match startsWith
      const aStarts = a.name.toLowerCase().startsWith(q);
      const bStarts = b.name.toLowerCase().startsWith(q);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return 0;
    });
  }, [query]);

  // Reset selected index when filtered list changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredModules]);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcut (Cmd+K / Ctrl+K) to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelect = (module: SearchableModule) => {
    setIsOpen(false);
    setQuery("");
    inputRef.current?.blur();
    router.push(module.href);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && (e.key === "ArrowDown" || e.key === "Enter")) {
      setIsOpen(true);
      return;
    }

    if (!isOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredModules.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredModules.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredModules[selectedIndex]) {
        handleSelect(filteredModules[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
      {/* Search Input Bar */}
      <div className="relative flex items-center">
        <div className="absolute left-3.5 text-gray-400 pointer-events-none flex items-center">
          <Search className="w-4 h-4 text-gray-400" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search modules & pages... (e.g. Tenders, Council, FAQ)"
          className="w-full pl-9 pr-16 py-2 bg-gray-50 hover:bg-gray-100/80 focus:bg-white text-xs sm:text-sm text-text-primary rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-hidden transition-all placeholder:text-gray-400 shadow-2xs font-medium"
        />

        <div className="absolute right-2.5 flex items-center gap-1.5">
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-200/60 transition-colors"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold text-gray-400 bg-white border border-gray-200 rounded shadow-2xs">
              <span className="text-[11px]">⌘</span>K
            </kbd>
          )}
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-border shadow-xl overflow-hidden z-50 animate-in fade-in-0 zoom-in-95 duration-150">
          <div className="p-2 border-b border-border/60 bg-gray-50/70 flex items-center justify-between text-[11px] text-gray-500 font-semibold px-3">
            <span className="flex items-center gap-1.5 text-primary">
              <Sparkles className="w-3.5 h-3.5" />
              {query ? `Search Results (${filteredModules.length})` : "Quick Navigation / Modules"}
            </span>
            <span className="text-[10px] text-gray-400">Use ↑↓ keys & Enter</span>
          </div>

          <div className="max-h-72 overflow-y-auto p-1.5 space-y-1">
            {filteredModules.length === 0 ? (
              <div className="py-8 px-4 text-center">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2 text-gray-400">
                  <Search className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-gray-700">No matching modules found</p>
                <p className="text-[11px] text-gray-500 mt-1">
                  Try searching for <span className="font-semibold text-primary">Tenders</span>,{" "}
                  <span className="font-semibold text-primary">Council</span>, or{" "}
                  <span className="font-semibold text-primary">Grievances</span>
                </p>
              </div>
            ) : (
              filteredModules.map((item, index) => {
                const Icon = item.icon;
                const isSelected = index === selectedIndex;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                      isSelected
                        ? "bg-primary-light text-primary font-medium shadow-2xs"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? "bg-primary text-white shadow-xs"
                          : "bg-gray-100 text-gray-600 group-hover:bg-primary/10 group-hover:text-primary"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold truncate text-text-primary">
                          {item.name}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-500 font-medium shrink-0">
                          {item.category}
                        </span>
                        {item.badge && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-red-100 text-red-600 shrink-0">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-[11px] text-gray-500 truncate mt-0.5">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <ArrowRight
                      className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                        isSelected ? "text-primary translate-x-0.5" : "text-gray-300 opacity-0"
                      }`}
                    />
                  </button>
                );
              })
            )}
          </div>

          <div className="p-2 border-t border-border bg-gray-50 text-[10px] text-gray-500 flex items-center justify-between px-3">
            <span>
              <kbd className="px-1 py-0.5 bg-white border border-gray-200 rounded text-[9px]">
                ESC
              </kbd>{" "}
              to close
            </span>
            <span>
              Press{" "}
              <kbd className="px-1 py-0.5 bg-white border border-gray-200 rounded text-[9px]">
                ↵
              </kbd>{" "}
              to navigate
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
