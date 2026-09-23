"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Lock, Mail, Shield, ArrowRight, AlertCircle, Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: authLoading } = useAdminAuth();

  const [email, setEmail] = useState("admin@lonavalamc.gov.in");
  const [password, setPassword] = useState("Admin@12345");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push("/admin/dashboard");
    }
  }, [authLoading, isAuthenticated, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        router.push("/admin/dashboard");
      } else {
        setError(result.message || "Invalid email or password.");
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred during authentication.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillSuperadminCredentials = () => {
    setEmail("admin@lonavalamc.gov.in");
    setPassword("Admin@12345");
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        {/* Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-emerald-300/30 space-y-6 animate-in zoom-in-95 duration-200">
          {/* Header & Logo */}
          <div className="text-center space-y-3">
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center bg-slate-50 rounded-2xl p-2 border border-slate-100 shadow-xs">
              <Image
                src="/images/logo.png"
                alt="Lonavala Municipal Council"
                width={80}
                height={80}
                className="w-full h-full object-contain drop-shadow-md"
                priority
              />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">LMC Administrative Portal</h1>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Official Staff Management Console • लोणावळा नगरपरिषद
              </p>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{error}</div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Official Email ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@lonavalamc.gov.in"
                  className="w-full pl-10 pr-3.5 py-3 bg-slate-50/50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-hidden focus:border-emerald-600 focus:bg-white transition-all text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Security Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-3 bg-slate-50/50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-hidden focus:border-emerald-600 focus:bg-white transition-all text-xs"
                />
              </div>
            </div>

            {/* Quick Demo Credentials Pill */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-[11px] text-emerald-900 font-medium">
                <Shield className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Superadmin Seeded Account</span>
              </div>
              <button
                type="button"
                onClick={fillSuperadminCredentials}
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 bg-white px-2.5 py-1 rounded-lg border border-emerald-300 shadow-2xs hover:bg-emerald-100/50 transition-colors flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>Auto Fill</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 disabled:opacity-70 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Authenticate & Enter Console</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 border-t border-slate-100 text-center">
            <Link
              href="/"
              className="text-xs text-slate-500 hover:text-emerald-700 font-semibold transition-colors"
            >
              ← Return to Public Citizen Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
