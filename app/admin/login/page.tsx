"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Lock, Mail, Shield, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@lonavalamc.gov.in");
  const [password, setPassword] = useState("••••••••");
  const [role, setRole] = useState("Super Admin");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/admin/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E5638] via-[#2E8B57] to-[#1F2937] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-emerald-300/30 space-y-6 animate-in zoom-in-95 duration-200">
          {/* Header & Logo */}
          <div className="text-center space-y-3">
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <Image
                src="/images/logo.png"
                alt="Lonavala Municipal Council"
                width={80}
                height={80}
                className="w-full h-full object-contain drop-shadow-md"
                priority
              />
            </div>
            <h1 className="text-2xl font-extrabold text-[#1F2937]">LMC Administrative Portal</h1>
            <p className="text-xs text-gray-500 font-medium">
              Official Management Console • लोणावळा नगरपरिषद
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                Administrative Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-[#D9E8DD] rounded-xl font-semibold text-gray-800 focus:outline-hidden focus:border-[#2E8B57]"
              >
                <option value="Super Admin">Super Administrator (Chief Officer Desk)</option>
                <option value="Grievance Officer">Grievance Redressal Officer (GRO)</option>
                <option value="Department Officer">Department Head (HOD Engineer)</option>
                <option value="Content Admin">CMS Content Manager</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                Official Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-[#D9E8DD] rounded-xl font-medium text-gray-800 focus:outline-hidden focus:border-[#2E8B57]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                Security Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-[#D9E8DD] rounded-xl font-medium text-gray-800 focus:outline-hidden focus:border-[#2E8B57]"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#2E8B57] shrink-0" />
              <span>Demo mode enabled: Click Sign In to access the admin dashboard.</span>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#2E8B57] hover:bg-[#246E45] text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <span>Authenticate & Enter Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 border-t border-gray-100 text-center">
            <Link href="/" className="text-xs text-gray-500 hover:text-[#2E8B57] font-semibold">
              ← Return to Public Citizen Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
