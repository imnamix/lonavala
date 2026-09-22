"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import AdminNavbarSearch from "@/components/admin/AdminNavbarSearch";
import {
  LayoutDashboard,
  AlertCircle,
  Building2,
  Users,
  Compass,
  HardHat,
  Bell,
  BarChart3,
  Settings,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  Layers,
  Home,
  Info,
  Phone,
  Landmark,
  HelpCircle,
  FileSpreadsheet,
  Briefcase,
  Scale,
  Calendar,
} from "lucide-react";

interface AdminSubMenuItem {
  name: string;
  href: string;
  icon: any;
}

interface AdminMenuItem {
  name: string;
  href: string;
  icon: any;
  badge?: string;
  children?: AdminSubMenuItem[];
}

const ADMIN_MENU: AdminMenuItem[] = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Grievances", href: "/admin/grievances", icon: AlertCircle, badge: "3 New" },
  { name: "Councils", href: "/admin/council", icon: Landmark },
  { name: "Committees", href: "/admin/committees", icon: Layers },
  {
    name: "Court Committee",
    href: "/admin/court",
    icon: Scale,
    children: [
      { name: "Committee Members", href: "/admin/court/members", icon: Users },
      { name: "Court Proceedings", href: "/admin/court/proceedings", icon: Scale },
      { name: "Next Session", href: "/admin/court/sessions", icon: Calendar },
    ],
  },
  { name: "Resolutions", href: "/admin/resolutions", icon: FileSpreadsheet },
  {
    name: "Content",
    href: "/admin/content",
    icon: Layers,
    children: [
      { name: "Homepage", href: "/admin/content/homepage", icon: Home },
      { name: "About Us", href: "/admin/content/about", icon: Info },
      { name: "At a Glance", href: "/admin/content/glance", icon: BarChart3 },
      { name: "Contacts", href: "/admin/content/contacts", icon: Phone },
      { name: "Tourism", href: "/admin/content/tourism", icon: Compass },
      { name: "FAQ", href: "/admin/content/faq", icon: HelpCircle },
    ],
  },
  { name: "Departments", href: "/admin/departments", icon: Building2 },
  { name: "Projects", href: "/admin/projects", icon: HardHat },
  { name: "Tenders", href: "/admin/tenders", icon: FileSpreadsheet },
  { name: "Recruitment", href: "/admin/recruitment", icon: Briefcase },
  { name: "Notices", href: "/admin/notices", icon: Bell },
  { name: "Users & Roles", href: "/admin/users", icon: Users },
  { name: "Reports & Analytics", href: "/admin/reports", icon: BarChart3 },
  { name: "Portal Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    Content: true,
    "Court Committee": true,
  });

  const toggleSubMenu = (menuName: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedMenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };

  const isItemActive = (href: string) => {
    if (href === "/admin/dashboard") {
      return pathname === "/admin/dashboard" || pathname === "/admin";
    }
    if (href === "/admin/council") {
      return (
        pathname === "/admin/council" ||
        pathname.startsWith("/admin/council/") ||
        pathname === "/admin/councils" ||
        pathname.startsWith("/admin/councils/")
      );
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  // If on login page, render children without sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row overflow-hidden">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shrink-0 z-40">
        <div className="flex items-center gap-2">
          <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
            <Image
              src="/images/logo.png"
              alt="LMC Admin"
              width={32}
              height={32}
              className="w-full h-full object-contain"
            />
          </div>
          <span className="font-bold text-sm text-slate-900">LMC Admin</span>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-700"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Backdrop Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar (Desktop + Mobile Drawer) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 transition-transform duration-300 md:static md:h-full md:translate-x-0 ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Admin Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between shrink-0">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
              <Image
                src="/images/logo.png"
                alt="LMC Logo"
                width={40}
                height={40}
                className="w-full h-full object-contain drop-shadow-sm"
              />
            </div>
            <div>
              <div className="font-extrabold text-sm text-slate-900 leading-tight">
                LMC Admin Console
              </div>
              <div className="text-[10px] font-semibold text-emerald-700">Govt of Maharashtra</div>
            </div>
          </Link>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="md:hidden p-1 text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1 overflow-y-auto flex-1">
          <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Navigation
          </div>
          {ADMIN_MENU.map((item) => {
            const hasChildren = Boolean(item.children && item.children.length > 0);
            const isChildActive = hasChildren && Boolean(
              item.children?.some((child) => isItemActive(child.href))
            );
            const isDirectActive = isItemActive(item.href) && !hasChildren;
            const isExpanded = expandedMenus[item.name] ?? isChildActive;
            const Icon = item.icon;

            return (
              <div key={item.name} className="space-y-1">
                <div
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isDirectActive
                      ? "bg-emerald-700 text-white shadow-sm ring-1 ring-emerald-800"
                      : isChildActive
                      ? "bg-emerald-50 text-emerald-900 font-bold border border-emerald-200/80"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMobileSidebarOpen(false)}
                    className="flex items-center gap-3 flex-1"
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isDirectActive ? "text-white" : isChildActive ? "text-emerald-700" : "text-slate-500"}`} />
                    <span>{item.name}</span>
                  </Link>

                  {item.badge && (
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                        isDirectActive
                          ? "bg-white text-emerald-800"
                          : "bg-red-100 text-red-600 animate-pulse"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {hasChildren && (
                    <button
                      type="button"
                      onClick={(e) => toggleSubMenu(item.name, e)}
                      className={`p-1 rounded-md transition-transform ${
                        isChildActive
                          ? "text-emerald-700 hover:bg-emerald-100"
                          : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                      }`}
                      title="Toggle section"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>

                {/* Submenu Accordion */}
                {hasChildren && isExpanded && (
                  <div className="pl-3 pr-1 py-1 space-y-1 border-l-2 border-emerald-200 ml-4 my-1">
                    {item.children!.map((child) => {
                      const ChildIcon = child.icon;
                      const isSubActive = isItemActive(child.href);
                      return (
                        <Link
                          key={child.name}
                          href={child.href}
                          onClick={() => setMobileSidebarOpen(false)}
                          className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                            isSubActive
                              ? "bg-emerald-700 text-white font-bold shadow-xs"
                              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <ChildIcon className={`w-3.5 h-3.5 shrink-0 ${isSubActive ? "text-white" : "text-slate-400"}`} />
                            <span>{child.name}</span>
                          </div>
                          {isSubActive && <div className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
        {/* Top Navbar */}
        <header className="bg-white border-b border-border px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-xs shrink-0 gap-4">
          <AdminNavbarSearch />

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-text-primary">Shri. Pandit Patil (IAS)</div>
              <div className="text-[10px] text-gray-500">Chief Officer & Commissioner</div>
            </div>
            <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shadow-sm">
              CO
            </div>
          </div>
        </header>

        {/* Dynamic Admin Body */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
