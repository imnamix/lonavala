"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import AdminNavbarSearch from "@/components/admin/AdminNavbarSearch";
import { AdminAuthProvider, useAdminAuth } from "@/context/AdminAuthContext";
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
  Scale,
  Calendar,
  LogOut,
  Loader2,
  ShieldCheck,
  UserCheck,
  Megaphone,
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
  { name: "Important Updates", href: "/admin/updates", icon: Megaphone },
  { name: "Grievances", href: "/admin/grievances", icon: AlertCircle },
  { name: "Citizens", href: "/admin/citizens", icon: UserCheck },
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
  { name: "Notices", href: "/admin/notices", icon: Bell },
  { name: "Users & Roles", href: "/admin/users", icon: Users },
  { name: "Reports & Analytics", href: "/admin/reports", icon: BarChart3 },
];

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAdminAuth();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  // Dropdowns closed by default
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  // Auth redirect hook
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isLoginPage) {
      router.push("/admin/login");
    }
  }, [isLoading, isAuthenticated, isLoginPage, router]);

  // Close user menu on route change
  useEffect(() => {
    setUserMenuOpen(false);
  }, [pathname]);

  // Close user menu on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('#admin-user-menu-wrapper')) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) {
      document.addEventListener('click', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [userMenuOpen]);

  // Early returns AFTER all hooks are called
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-slate-50 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-emerald-700 animate-spin" />
        <div className="text-xs font-semibold text-slate-600 tracking-wide">
          Verifying administrative credentials...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const toggleSubMenu = (menuName: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setExpandedMenus((prev) => {
      const isCurrentlyExpanded = Boolean(prev[menuName]);
      return {
        ...prev,
        [menuName]: !isCurrentlyExpanded,
      };
    });
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

  const initials =
    user?.firstName && user?.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
      : user?.firstName
      ? user.firstName.substring(0, 2).toUpperCase()
      : "AD";

  const displayName =
    user?.firstName || user?.lastName
      ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
      : user?.email || "Super Administrator";

  const displayRole = user?.roles ? user.roles.replace(/_/g, " ") : "Super Admin";

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
            const isExpanded = Boolean(expandedMenus[item.name]);
            const Icon = item.icon;

            return (
              <div key={item.name} className="space-y-1">
                {hasChildren ? (
                  <button
                    type="button"
                    onClick={(e) => toggleSubMenu(item.name, e)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-left ${
                      isChildActive
                        ? "bg-emerald-50 text-emerald-900 font-bold border border-emerald-200/80"
                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 shrink-0 ${isChildActive ? "text-emerald-700" : "text-slate-500"}`} />
                      <span>{item.name}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.badge && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-red-100 text-red-600 animate-pulse">
                          {item.badge}
                        </span>
                      )}
                      <div className={`p-0.5 rounded-md transition-transform ${isChildActive ? "text-emerald-700" : "text-slate-400"}`}>
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5" />
                        )}
                      </div>
                    </div>
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isDirectActive
                        ? "bg-emerald-700 text-white shadow-sm ring-1 ring-emerald-800"
                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 shrink-0 ${isDirectActive ? "text-white" : "text-slate-500"}`} />
                      <span>{item.name}</span>
                    </div>

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
                  </Link>
                )}

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

          {/* User Profile Menu Dropdown */}
          <div className="relative" id="admin-user-menu-wrapper">
            <button
              type="button"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-3 p-1.5 -mr-1.5 rounded-2xl hover:bg-slate-100 transition-colors text-left cursor-pointer group"
            >
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {displayName}
                </div>
                <div className="text-[10px] text-emerald-700 font-semibold flex items-center justify-end gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>{displayRole}</span>
                </div>
              </div>
              <div className="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-emerald-100 group-hover:ring-emerald-300 transition-all">
                {initials}
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 hidden sm:block ${
                  userMenuOpen ? "rotate-180 text-emerald-700" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu Modal */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                {/* User Summary Header */}
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                  <p className="text-xs font-extrabold text-slate-900 truncate">{displayName}</p>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{user?.email}</p>
                  <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800">
                    <ShieldCheck className="w-3 h-3" />
                    <span>{displayRole}</span>
                  </div>
                </div>

                {/* Menu Actions */}
                <div className="p-1 space-y-0.5 text-xs">
                  <Link
                    href="/admin/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 font-semibold transition-colors"
                  >
                    <Settings className="w-4 h-4 text-emerald-600" />
                    <span>My Profile & Password</span>
                  </Link>
                </div>

                {/* Divider & Logout */}
                <div className="pt-1 mt-1 border-t border-slate-100 p-1">
                  <button
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 font-bold transition-colors text-xs text-left cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-red-600" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Dynamic Admin Body */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminAuthProvider>
  );
}
