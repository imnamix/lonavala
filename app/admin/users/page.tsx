"use client";

import { useState, useEffect } from "react";
import {
  Users,
  ShieldCheck,
  Check,
  X,
  Plus,
  UserPlus,
  Trash2,
  RefreshCw,
  Loader2,
  AlertCircle,
  Mail,
  Phone,
  Shield,
  Lock,
  Edit3,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useAdminAuth } from "@/context/AdminAuthContext";

export interface ModulePermission {
  module: string;
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

export interface RoleItem {
  id: string;
  name: string;
  code: string;
  badgeColor?: string;
  isSystem?: boolean;
  permissions: ModulePermission[];
}

interface StaffUser {
  id: number;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  email: string;
  phone?: string;
  gender?: string;
  roles?: any;
  roleId?: string | number;
  roleName?: string;
  isVerified?: boolean;
  permissions?: string[];
  createdDate?: string;
}

const SYSTEM_MODULES = [
  { key: "dashboard", label: "Dashboard & Analytics" },
  { key: "grievances", label: "Grievance Redressal Desk" },
  { key: "citizens", label: "Citizen Management" },
  { key: "council", label: "Councils & Committees" },
  { key: "court", label: "Court Proceedings & Sessions" },
  { key: "content", label: "CMS Website Content" },
  { key: "departments", label: "Departments & Wings" },
  { key: "projects", label: "Public Works & Projects" },
  { key: "tenders", label: "Tenders & E-Procurement" },
  { key: "notices", label: "Notices & Circulars" },
  { key: "reports", label: "Reports & Financial Audit" },
  { key: "users", label: "User & Role Security" },
];

export default function AdminUsersPage() {
  const { user: currentUser } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<"users" | "roles">("users");

  // Users State
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dynamic Roles State (Zero static hardcoded roles)
  const [roles, setRoles] = useState<RoleItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("lmc_admin_custom_roles");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return parsed;
        } catch (e) {
          console.error("Failed to parse dynamic roles", e);
        }
      }
    }
    return [];
  });

  // User Role Mapping by ID/Email (Persists role ID assignment)
  const [userRoleMap, setUserRoleMap] = useState<Record<string, string>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("lmc_user_role_map");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (typeof parsed === "object" && parsed !== null) return parsed;
        } catch (e) {
          console.error("Failed to parse user role map", e);
        }
      }
    }
    return {};
  });

  // User Modal State (Create / Edit)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [userModalSubmitting, setUserModalSubmitting] = useState(false);
  const [userModalError, setUserModalError] = useState<string | null>(null);

  // User Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [status, setStatus] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");

  // Role Modal State (Create / Edit)
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [roleName, setRoleName] = useState("");
  const [rolePermissions, setRolePermissions] = useState<ModulePermission[]>([]);
  const [roleModalError, setRoleModalError] = useState<string | null>(null);

  // Save roles to localStorage
  const saveRoles = (newRoles: RoleItem[]) => {
    setRoles(newRoles);
    if (typeof window !== "undefined") {
      localStorage.setItem("lmc_admin_custom_roles", JSON.stringify(newRoles));
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<any>("/user");
      const userList = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
        ? response.data
        : [];
      setUsers(userList);
    } catch (err: any) {
      console.error("Failed to fetch users:", err);
      setError("Unable to load staff users from backend. Showing local records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Open Add User Modal
  const openAddUserModal = () => {
    setEditingUserId(null);
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setShowPassword(false);
    setSelectedRoleId(roles[0]?.id || "");
    setStatus("ACTIVE");
    setUserModalError(null);
    setIsUserModalOpen(true);
  };

  // Helper to get formatted Role Name for display & editing (populates dynamic role name by role ID)
  const getUserRoleName = (u: StaffUser): string => {
    // 1. Check userRoleMap by user ID or email
    const mappedRoleId =
      userRoleMap[String(u.id)] ||
      (u.email ? userRoleMap[u.email.toLowerCase()] : null);
    if (mappedRoleId) {
      const matchedRole = roles.find(
        (r) =>
          r.id === mappedRoleId ||
          r.code === mappedRoleId ||
          r.name === mappedRoleId
      );
      if (matchedRole) return matchedRole.name;
    }

    // 2. Check roleId from user object
    if (u.roleId) {
      const matchedRole = roles.find(
        (r) => r.id === String(u.roleId) || r.id === (u.roleId as any)
      );
      if (matchedRole) return matchedRole.name;
    }

    // 3. Check roleName or roles string against dynamic roles
    let rawRole: any = u.roleName || u.roles;
    if (typeof rawRole === "object" && rawRole !== null) {
      rawRole = rawRole.role || rawRole.name || "";
    }
    if (typeof rawRole === "string" && rawRole.trim().length > 0) {
      const trimmed = rawRole.trim();
      const matchedRole = roles.find(
        (r) =>
          r.name.toLowerCase() === trimmed.toLowerCase() ||
          r.code.toLowerCase() === trimmed.toLowerCase() ||
          r.id === trimmed
      );
      if (matchedRole) return matchedRole.name;

      // 4. System role friendly mappings
      const SYSTEM_ROLE_MAP: Record<string, string> = {
        SUPER_ADMIN: "Super Administrator",
        ADMIN: "Administrator",
        DEPARTMENT_ADMIN: "Department Administrator",
        GRIEVANCE_OFFICER: "Grievance Redressal Officer",
        CONTENT_ADMIN: "Content Administrator",
        CONTENT_EDITOR: "Content Editor",
        DEPARTMENT_OFFICER: "Department Officer",
        REPORTING_USER: "Reporting User",
        USER: "Standard User",
      };

      if (SYSTEM_ROLE_MAP[trimmed.toUpperCase()]) {
        return SYSTEM_ROLE_MAP[trimmed.toUpperCase()];
      }

      return trimmed.replace(/_/g, " ");
    }

    return "Standard User";
  };

  // Open Edit User Modal
  const openEditUserModal = (u: StaffUser) => {
    setEditingUserId(u.id);
    setFirstName(u.firstName || "");
    setLastName(u.lastName || "");
    setEmail(u.email || "");
    setPhone(u.phone || "");
    setPassword(""); // Keep blank to retain existing
    setShowPassword(false);

    // Find assigned role ID
    const assignedRoleId =
      userRoleMap[String(u.id)] ||
      (u.email ? userRoleMap[u.email.toLowerCase()] : null) ||
      (u.roleId ? String(u.roleId) : "") ||
      roles.find(
        (r) =>
          r.name.toLowerCase() === String(u.roles || "").toLowerCase() ||
          r.id === u.roles
      )?.id ||
      roles[0]?.id ||
      "";

    setSelectedRoleId(assignedRoleId);
    setStatus(u.isVerified !== false ? "ACTIVE" : "INACTIVE");
    setUserModalError(null);
    setIsUserModalOpen(true);
  };

  // Create or Update User Submission
  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoleId) {
      setUserModalError("Please select a role. If no roles exist, create a dynamic role first.");
      return;
    }

    if (!editingUserId && !password.trim()) {
      setUserModalError("Password is required when creating a new user account.");
      return;
    }

    setUserModalError(null);
    setUserModalSubmitting(true);

    const isVerifiedValue = status === "ACTIVE";
    const matchedRole = roles.find(
      (r) => r.id === selectedRoleId || r.name === selectedRoleId
    );
    const roleIdValue = matchedRole?.id || selectedRoleId;
    const roleNameValue = matchedRole?.name || selectedRoleId;

    try {
      if (editingUserId) {
        // Edit existing user
        const updatePayload: any = {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          role: roleNameValue,
          roleId: roleIdValue,
          isVerified: isVerifiedValue,
        };
        if (password.trim()) {
          updatePayload.password = password.trim();
        }

        const res: any = await apiClient.put(`/user/${editingUserId}`, updatePayload);
        const updatedId = res?.data?.id || editingUserId;

        // Persist role id mapping
        const newMap = {
          ...userRoleMap,
          [String(updatedId)]: roleIdValue,
          [email.trim().toLowerCase()]: roleIdValue,
        };
        setUserRoleMap(newMap);
        if (typeof window !== "undefined") {
          localStorage.setItem("lmc_user_role_map", JSON.stringify(newMap));
        }
      } else {
        // Create new user
        const res: any = await apiClient.post("/user", {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          password: password.trim(),
          role: roleNameValue,
          roleId: roleIdValue,
          isVerified: isVerifiedValue,
        });

        const createdId = res?.data?.id || res?.id;
        if (createdId) {
          const newMap = {
            ...userRoleMap,
            [String(createdId)]: roleIdValue,
            [email.trim().toLowerCase()]: roleIdValue,
          };
          setUserRoleMap(newMap);
          if (typeof window !== "undefined") {
            localStorage.setItem("lmc_user_role_map", JSON.stringify(newMap));
          }
        }
      }

      setIsUserModalOpen(false);
      await fetchUsers();
    } catch (err: any) {
      setUserModalError(
        err?.data?.message ||
          err?.message ||
          "Failed to save user account. Please check your inputs."
      );
    } finally {
      setUserModalSubmitting(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (id === currentUser?.id) {
      alert("You cannot delete your own logged-in account.");
      return;
    }

    if (!confirm("Are you sure you want to permanently delete this user account?")) {
      return;
    }

    try {
      await apiClient.delete(`/user/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err: any) {
      alert(err?.message || "Failed to delete user");
    }
  };

  // ── Role Management Handlers ──
  const openAddRoleModal = () => {
    setEditingRoleId(null);
    setRoleName("");
    setRolePermissions(
      SYSTEM_MODULES.map((m) => ({
        module: m.label,
        create: false,
        read: true,
        update: false,
        delete: false,
      }))
    );
    setRoleModalError(null);
    setIsRoleModalOpen(true);
  };

  const openEditRoleModal = (role: RoleItem) => {
    setEditingRoleId(role.id);
    setRoleName(role.name);
    setRolePermissions(
      SYSTEM_MODULES.map((m) => {
        const existing = role.permissions.find((p) => p.module === m.label);
        return (
          existing || {
            module: m.label,
            create: false,
            read: true,
            update: false,
            delete: false,
          }
        );
      })
    );
    setRoleModalError(null);
    setIsRoleModalOpen(true);
  };

  const handleToggleModuleAction = (
    moduleName: string,
    action: "create" | "read" | "update" | "delete"
  ) => {
    setRolePermissions((prev) =>
      prev.map((p) =>
        p.module === moduleName ? { ...p, [action]: !p[action] } : p
      )
    );
  };

  // Row select all toggle
  const handleToggleRowAll = (moduleName: string) => {
    setRolePermissions((prev) =>
      prev.map((p) => {
        if (p.module !== moduleName) return p;
        const allChecked = p.create && p.read && p.update && p.delete;
        return {
          ...p,
          create: !allChecked,
          read: !allChecked,
          update: !allChecked,
          delete: !allChecked,
        };
      })
    );
  };

  // Column select all on click of column header
  const handleToggleColumnAll = (action: "create" | "read" | "update" | "delete") => {
    setRolePermissions((prev) => {
      const allChecked = prev.every((p) => p[action]);
      return prev.map((p) => ({
        ...p,
        [action]: !allChecked,
      }));
    });
  };

  const handleSetGlobalPermissions = (type: "all" | "read_only" | "clear") => {
    setRolePermissions((prev) =>
      prev.map((p) => ({
        ...p,
        create: type === "all",
        read: type === "all" || type === "read_only",
        update: type === "all",
        delete: type === "all",
      }))
    );
  };

  const handleSaveRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName.trim()) {
      setRoleModalError("Please enter a valid role name.");
      return;
    }

    const generatedCode = roleName
      .trim()
      .toUpperCase()
      .replace(/\s+/g, "_")
      .replace(/[^A-Z0-9_]/g, "");

    if (editingRoleId) {
      // Update existing
      const updated = roles.map((r) =>
        r.id === editingRoleId
          ? {
              ...r,
              name: roleName.trim(),
              code: generatedCode,
              permissions: rolePermissions,
            }
          : r
      );
      saveRoles(updated);
    } else {
      // Create new
      const newRole: RoleItem = {
        id: `role_${Date.now()}`,
        name: roleName.trim(),
        code: generatedCode,
        badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
        permissions: rolePermissions,
      };
      saveRoles([...roles, newRole]);
    }

    setIsRoleModalOpen(false);
  };

  const handleDeleteRole = (id: string) => {
    const role = roles.find((r) => r.id === id);
    if (confirm(`Are you sure you want to delete the role "${role?.name}"?`)) {
      saveRoles(roles.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Top Header with Action Buttons ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Users & Roles Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage administrative staff credentials, active status, dynamic role definitions, and module permissions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
            title="Refresh Users"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-emerald-700" : ""}`} />
          </button>

          {/* Left of Add Admin / Staff User: Add Role button */}
          <button
            onClick={openAddRoleModal}
            className="px-4 py-2.5 bg-white hover:bg-emerald-50 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-300 shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Shield className="w-4 h-4 text-emerald-700" />
            <span>Add Role</span>
          </button>

          {/* Add Admin / Staff User button */}
          <button
            onClick={openAddUserModal}
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Admin / Staff User</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ── Full Width Tabs ── */}
      <div className="w-full bg-slate-100 p-1.5 rounded-2xl flex items-center gap-2 border border-slate-200/80">
        <button
          onClick={() => setActiveTab("users")}
          className={`flex-1 flex items-center justify-center gap-2.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "users"
              ? "bg-white text-emerald-800 shadow-xs border border-slate-200/60"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Staff & Admin Users</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === "users" ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"
            }`}
          >
            {users.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("roles")}
          className={`flex-1 flex items-center justify-center gap-2.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "roles"
              ? "bg-white text-emerald-800 shadow-xs border border-slate-200/60"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Roles & Module Permissions</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === "roles" ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"
            }`}
          >
            {roles.length}
          </span>
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* TAB 1: USERS TABLE */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {activeTab === "users" && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-700" />
              <h2 className="font-bold text-sm text-slate-900">Active Staff & Admin Directory</h2>
            </div>
            {/* Add User button */}
            <button
              onClick={openAddUserModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add User</span>
            </button>
          </div>

          {loading ? (
            <div className="p-12 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-emerald-700 animate-spin" />
              <span className="text-xs text-slate-500 font-medium">Loading user accounts...</span>
            </div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500 space-y-3">
              <p>No administrative staff accounts found.</p>
              <button
                onClick={openAddUserModal}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add User</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50/40">
                    <th className="py-3.5 px-6">Name & Email</th>
                    <th className="py-3.5 px-6">Assigned Role</th>
                    <th className="py-3.5 px-6">Phone Number</th>
                    <th className="py-3.5 px-6 text-center">Status</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {users.map((u) => {
                    const fullName =
                      u.firstName || u.lastName
                        ? `${u.firstName || ""} ${u.lastName || ""}`.trim()
                        : "Staff User";
                    const roleName = getUserRoleName(u);
                    const isSuperAdmin =
                      roleName === "Super Administrator" ||
                      u.roles === "SUPER_ADMIN" ||
                      u.roles === "Super Administrator";
                    const isActive = u.isVerified !== false;

                    return (
                      <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-6">
                          <div className="font-bold text-slate-900 flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[11px]">
                              {fullName.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span>{fullName}</span>
                                {isSuperAdmin && (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                                    Master
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-6 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                              isSuperAdmin
                                ? "bg-purple-50 text-purple-700 border-purple-200"
                                : "bg-emerald-50 text-emerald-700 border-emerald-200"
                            }`}
                          >
                            {roleName}
                          </span>
                        </td>
                        <td className="py-3.5 px-6 text-slate-600 font-mono text-[11px]">
                          {u.phone || "—"}
                        </td>
                        <td className="py-3.5 px-6 text-center whitespace-nowrap">
                          {isActive ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Active</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                              <AlertCircle className="w-3 h-3 text-slate-400" />
                              <span>Inactive</span>
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-6 text-right whitespace-nowrap space-x-1.5">
                          {/* Edit User Action Button */}
                          <button
                            onClick={() => openEditUserModal(u)}
                            title="Edit User Details & Status"
                            className="p-1.5 text-slate-500 hover:text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {u.id !== currentUser?.id && (
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              title="Delete user account"
                              className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* TAB 2: ROLES & PERMISSIONS TABLE */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {activeTab === "roles" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Configured Dynamic Roles</span>
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Create and manage dynamic roles with module permissions.
                </p>
              </div>
              <button
                onClick={openAddRoleModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Role</span>
              </button>
            </div>

            {roles.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500 space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <p className="font-semibold text-slate-700">No roles configured yet.</p>
                <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                  Click &ldquo;Add Role&rdquo; to create a dynamic role with customized module permissions.
                </p>
                <button
                  onClick={openAddRoleModal}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add First Role</span>
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50/40">
                      <th className="py-3.5 px-6">Role Name</th>
                      <th className="py-3.5 px-6">Module Permissions Overview</th>
                      <th className="py-3.5 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                    {roles.map((r) => {
                      const totalModules = r.permissions.length;
                      const fullCrudCount = r.permissions.filter(
                        (p) => p.create && p.read && p.update && p.delete
                      ).length;
                      const readCount = r.permissions.filter((p) => p.read).length;

                      return (
                        <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-4 px-6">
                            <div className="font-bold text-slate-900 text-sm">{r.name}</div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-800 text-[11px]">
                                  {fullCrudCount === totalModules
                                    ? "Full Access (All Modules)"
                                    : `${fullCrudCount} Full Access / ${readCount} Readable Modules`}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-1.5 text-[10px] font-bold">
                                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  Create: {r.permissions.filter((p) => p.create).length}
                                </span>
                                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                                  Read: {readCount}
                                </span>
                                <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                                  Update: {r.permissions.filter((p) => p.update).length}
                                </span>
                                <span className="px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
                                  Delete: {r.permissions.filter((p) => p.delete).length}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-right whitespace-nowrap space-x-2">
                            <button
                              onClick={() => openEditRoleModal(r)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 font-bold text-xs rounded-lg transition-colors cursor-pointer border border-slate-200"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit Permissions</span>
                            </button>
                            <button
                              onClick={() => handleDeleteRole(r.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                              title="Delete Role"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* MODAL 1: ADD / EDIT ROLE WITH MODULE CRUD MATRIX */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {isRoleModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-700" />
                  <span>{editingRoleId ? "Edit Role Permissions" : "Create New Role"}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure Create, Read, Update, and Delete permissions for each module. Click column headers to toggle all.
                </p>
              </div>
              <button
                onClick={() => setIsRoleModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {roleModalError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium">{roleModalError}</div>
              </div>
            )}

            <form onSubmit={handleSaveRole} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Role Name *
                </label>
                <input
                  type="text"
                  required
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  placeholder="e.g. Water Supply Engineer"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-hidden focus:border-emerald-600 focus:bg-white text-sm"
                />
              </div>

              {/* Module CRUD Matrix Section */}
              <div className="space-y-2 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                  <label className="block font-bold text-slate-800 uppercase tracking-wider">
                    Module Permissions
                  </label>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <button
                      type="button"
                      onClick={() => handleSetGlobalPermissions("all")}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 rounded-lg font-bold text-slate-600 transition-colors cursor-pointer"
                    >
                      Grant Full Access
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSetGlobalPermissions("read_only")}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-blue-100 hover:text-blue-800 rounded-lg font-bold text-slate-600 transition-colors cursor-pointer"
                    >
                      Read-Only All
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSetGlobalPermissions("clear")}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-red-100 hover:text-red-800 rounded-lg font-bold text-slate-600 transition-colors cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                        <th className="py-2.5 px-4">System Module</th>
                        
                        {/* Interactive Column Headers: click to select/toggle all */}
                        <th className="py-2.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleColumnAll("create")}
                            className="font-bold text-slate-700 hover:text-emerald-700 hover:bg-slate-200/80 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                            title="Click to select / toggle all Create permissions"
                          >
                            Create
                          </button>
                        </th>
                        
                        <th className="py-2.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleColumnAll("read")}
                            className="font-bold text-slate-700 hover:text-blue-700 hover:bg-slate-200/80 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                            title="Click to select / toggle all Read permissions"
                          >
                            Read
                          </button>
                        </th>
                        
                        <th className="py-2.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleColumnAll("update")}
                            className="font-bold text-slate-700 hover:text-amber-700 hover:bg-slate-200/80 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                            title="Click to select / toggle all Update permissions"
                          >
                            Update
                          </button>
                        </th>
                        
                        <th className="py-2.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleColumnAll("delete")}
                            className="font-bold text-slate-700 hover:text-red-700 hover:bg-slate-200/80 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                            title="Click to select / toggle all Delete permissions"
                          >
                            Delete
                          </button>
                        </th>
                        
                        <th className="py-2.5 px-3 text-center">Select All</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {rolePermissions.map((perm) => {
                        const isAll = perm.create && perm.read && perm.update && perm.delete;
                        return (
                          <tr key={perm.module} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-2 px-4 font-semibold text-slate-800">
                              {perm.module}
                            </td>
                            <td className="py-2 px-3 text-center">
                              <input
                                type="checkbox"
                                checked={perm.create}
                                onChange={() => handleToggleModuleAction(perm.module, "create")}
                                className="h-4 w-4 rounded text-emerald-700 focus:ring-emerald-600 cursor-pointer"
                              />
                            </td>
                            <td className="py-2 px-3 text-center">
                              <input
                                type="checkbox"
                                checked={perm.read}
                                onChange={() => handleToggleModuleAction(perm.module, "read")}
                                className="h-4 w-4 rounded text-blue-700 focus:ring-blue-600 cursor-pointer"
                              />
                            </td>
                            <td className="py-2 px-3 text-center">
                              <input
                                type="checkbox"
                                checked={perm.update}
                                onChange={() => handleToggleModuleAction(perm.module, "update")}
                                className="h-4 w-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                              />
                            </td>
                            <td className="py-2 px-3 text-center">
                              <input
                                type="checkbox"
                                checked={perm.delete}
                                onChange={() => handleToggleModuleAction(perm.module, "delete")}
                                className="h-4 w-4 rounded text-red-600 focus:ring-red-500 cursor-pointer"
                              />
                            </td>
                            <td className="py-2 px-3 text-center">
                              <button
                                type="button"
                                onClick={() => handleToggleRowAll(perm.module)}
                                className={`text-[10px] font-bold px-2.5 py-1 rounded-lg cursor-pointer transition-colors border ${
                                  isAll
                                    ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200"
                                }`}
                              >
                                Select All
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRoleModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingRoleId ? "Save Changes" : "Create Role"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* MODAL 2: ADD / EDIT STAFF OR ADMIN USER */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {isUserModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-emerald-700" />
                  <span>{editingUserId ? "Edit Administrative User" : "Add New Administrative User"}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {editingUserId
                    ? "Update account credentials, dynamic role, and active status."
                    : "Create staff account with role assignment and active status."}
                </p>
              </div>
              <button
                onClick={() => setIsUserModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {userModalError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium">{userModalError}</div>
              </div>
            )}

            {roles.length === 0 && !editingUserId && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 space-y-2">
                <div className="flex items-center gap-2 font-bold">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>No dynamic roles configured yet</span>
                </div>
                <p className="text-[11px] text-amber-700">
                  Please create a dynamic role first in the Roles tab before adding a staff account.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsUserModalOpen(false);
                    openAddRoleModal();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white font-bold text-[11px] rounded-lg shadow-2xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Role Now</span>
                </button>
              </div>
            )}

            <form onSubmit={handleSaveUser} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Ramesh"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-hidden focus:border-emerald-600 focus:bg-white text-sm"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Kale"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-hidden focus:border-emerald-600 focus:bg-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Official Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="officer@lonavalamc.gov.in"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-hidden focus:border-emerald-600 focus:bg-white text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="9876543210"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-hidden focus:border-emerald-600 focus:bg-white text-sm"
                    />
                  </div>
                </div>

                {/* Password Field with Eye Toggle */}
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {editingUserId ? "New Password (Optional)" : "Password *"}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required={!editingUserId}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={editingUserId ? "Leave blank to keep current" : "••••••••"}
                      className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-hidden focus:border-emerald-600 focus:bg-white text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-2.5 p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Dynamic Roles Dropdown */}
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Role *
                  </label>
                  <select
                    value={selectedRoleId}
                    onChange={(e) => setSelectedRoleId(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-hidden focus:border-emerald-600 focus:bg-white text-sm"
                  >
                    {selectedRoleId && !roles.some((r) => r.id === selectedRoleId) && (
                      <option value={selectedRoleId}>
                        {roles.find((r) => r.name === selectedRoleId)?.name || selectedRoleId}
                      </option>
                    )}
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                    {roles.length === 0 && !selectedRoleId && (
                      <option value="" disabled>
                        No dynamic roles available (Please create a role first)
                      </option>
                    )}
                  </select>
                </div>

                {/* Status Dropdown (Active / Inactive) */}
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Account Status *
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as "ACTIVE" | "INACTIVE")}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-hidden focus:border-emerald-600 focus:bg-white text-sm"
                  >
                    <option value="ACTIVE">Active (Verified)</option>
                    <option value="INACTIVE">Inactive (Disabled)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={userModalSubmitting || (roles.length === 0 && !editingUserId)}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {userModalSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{editingUserId ? "Saving Changes..." : "Creating Account..."}</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{editingUserId ? "Save Changes" : "Create Staff Account"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
