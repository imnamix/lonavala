"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Building2,
  Smartphone,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  User,
} from "lucide-react";

export default function CitizenLoginPage() {
  const router = useRouter();
  const [loginMethod, setLoginMethod] = useState<"otp" | "password" | "register">("otp");

  // OTP Login State
  const [mobile, setMobile] = useState("9876543210");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  // Password Login State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Register State
  const [regName, setRegName] = useState("");
  const [regMobile, setRegMobile] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regAadhaar, setRegAadhaar] = useState("");

  // Forgot password toggle
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  const handleSendOtp = () => {
    if (mobile.length >= 10) {
      setOtpSent(true);
    }
  };

  const handleOtpLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <div className="py-14 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Branding Crest */}
        <div className="text-center space-y-2">
          <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
            <Image
              src="/images/logo.png"
              alt="Lonavala Municipal Council"
              width={64}
              height={64}
              className="w-full h-full object-contain drop-shadow-md"
              priority
            />
          </div>
          <h1 className="text-2xl font-extrabold text-[#1F2937]">Citizen Self-Service Portal</h1>
          <p className="text-xs text-gray-500">
            Lonavala Municipal Council • नागरिक सेवा पोर्टल
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-[#D9E8DD] p-6 sm:p-8 shadow-sm">
          {/* Method Switcher Tabs */}
          <div className="flex border-b border-[#D9E8DD] mb-6">
            <button
              onClick={() => {
                setLoginMethod("otp");
                setShowForgot(false);
              }}
              className={`flex-1 py-2.5 text-xs font-bold transition-all border-b-2 ${
                loginMethod === "otp" && !showForgot
                  ? "border-[#2E8B57] text-[#2E8B57]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Mobile OTP Login
            </button>
            <button
              onClick={() => {
                setLoginMethod("password");
                setShowForgot(false);
              }}
              className={`flex-1 py-2.5 text-xs font-bold transition-all border-b-2 ${
                loginMethod === "password" && !showForgot
                  ? "border-[#2E8B57] text-[#2E8B57]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Email & Password
            </button>
            <button
              onClick={() => {
                setLoginMethod("register");
                setShowForgot(false);
              }}
              className={`flex-1 py-2.5 text-xs font-bold transition-all border-b-2 ${
                loginMethod === "register" && !showForgot
                  ? "border-[#2E8B57] text-[#2E8B57]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Register
            </button>
          </div>

          {/* FORGOT PASSWORD MODAL/VIEW */}
          {showForgot ? (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-bold text-[#1F2937]">Reset Password</h3>
              <p className="text-gray-500">
                Enter your registered citizen email address. We will send a secure password reset link.
              </p>

              {forgotSent ? (
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800">
                  Password reset link sent to <strong>{forgotEmail}</strong>. Please check your inbox.
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setForgotSent(true);
                  }}
                  className="space-y-3"
                >
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="Enter registered email..."
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D9E8DD] rounded-xl focus:outline-hidden focus:border-[#2E8B57]"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#2E8B57] hover:bg-[#246E45] text-white font-bold rounded-xl transition-colors"
                  >
                    Send Reset Link
                  </button>
                </form>
              )}

              <button
                onClick={() => setShowForgot(false)}
                className="text-xs font-bold text-[#2E8B57] hover:underline"
              >
                ← Back to Login
              </button>
            </div>
          ) : loginMethod === "otp" ? (
            /* METHOD 1: OTP LOGIN */
            <form onSubmit={handleOtpLogin} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Registered Mobile Number
                </label>
                <div className="flex gap-2">
                  <div className="flex items-center px-3 bg-gray-50 border border-[#D9E8DD] rounded-xl font-bold text-gray-600">
                    +91
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="9876543210"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D9E8DD] rounded-xl focus:outline-hidden focus:border-[#2E8B57]"
                  />
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="px-3.5 py-2 bg-[#E8F5E9] hover:bg-[#2E8B57] hover:text-white text-[#2E8B57] rounded-xl font-bold transition-colors shrink-0"
                  >
                    {otpSent ? "Resend" : "Send OTP"}
                  </button>
                </div>
              </div>

              {otpSent && (
                <div className="space-y-2 p-3.5 bg-emerald-50 rounded-xl border border-emerald-200">
                  <span className="text-[11px] text-emerald-800 font-semibold block">
                    OTP sent to +91 {mobile}. (Testing OTP: 123456)
                  </span>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    className="w-full px-3.5 py-2.5 bg-white border border-emerald-300 rounded-xl text-center text-sm font-bold tracking-widest focus:outline-hidden"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-[#2E8B57] hover:bg-[#246E45] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>Login to Citizen Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : loginMethod === "password" ? (
            /* METHOD 2: EMAIL LOGIN */
            <form onSubmit={handlePasswordLogin} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Email Address / Citizen ID
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="aniket@example.com"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D9E8DD] rounded-xl focus:outline-hidden focus:border-[#2E8B57]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-gray-700 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgot(true)}
                    className="text-[11px] text-[#2E8B57] hover:underline font-semibold"
                  >
                    Forgot Password?
                  </button>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D9E8DD] rounded-xl focus:outline-hidden focus:border-[#2E8B57]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#2E8B57] hover:bg-[#246E45] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* METHOD 3: REGISTER */
            <form onSubmit={handleRegister} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Aniket Sharma"
                  className="w-full px-3 py-2 bg-white border border-[#D9E8DD] rounded-xl focus:outline-hidden focus:border-[#2E8B57]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Mobile
                  </label>
                  <input
                    type="tel"
                    required
                    value={regMobile}
                    onChange={(e) => setRegMobile(e.target.value)}
                    placeholder="9876543210"
                    className="w-full px-3 py-2 bg-white border border-[#D9E8DD] rounded-xl focus:outline-hidden focus:border-[#2E8B57]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="citizen@example.com"
                    className="w-full px-3 py-2 bg-white border border-[#D9E8DD] rounded-xl focus:outline-hidden focus:border-[#2E8B57]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Aadhaar / Property PID (Optional)
                </label>
                <input
                  type="text"
                  value={regAadhaar}
                  onChange={(e) => setRegAadhaar(e.target.value)}
                  placeholder="XXXX-XXXX-XXXX"
                  className="w-full px-3 py-2 bg-white border border-[#D9E8DD] rounded-xl focus:outline-hidden focus:border-[#2E8B57]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#2E8B57] hover:bg-[#246E45] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 mt-2"
              >
                <span>Create Citizen Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-gray-100 text-center text-xs text-gray-500">
            Government official or Council staff?{" "}
            <Link href="/admin/login" className="font-bold text-[#2E8B57] hover:underline">
              Access Admin Panel →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
