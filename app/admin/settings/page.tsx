"use client";

import { useState } from "react";
import { Settings, Save, ShieldCheck, CheckCircle2, Phone, Mail, Clock } from "lucide-react";

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [tollFree, setTollFree] = useState("1800-233-0101");
  const [exchangePhone, setExchangePhone] = useState("+91 2114 273030");
  const [slaTargetDays, setSlaTargetDays] = useState("3");
  const [taxRebatePercent, setTaxRebatePercent] = useState("5");
  const [weatherStatus, setWeatherStatus] = useState("Ghats Open • High Tourism Rush");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary">Portal Settings & Configuration</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure system helplines, SLA benchmarks, seasonal tourism status, and citizen alert banners.
          </p>
        </div>

        {saved && (
          <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <span>Settings saved successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-xs space-y-6 text-xs">
        <div className="border-b border-gray-100 pb-4">
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-1">
            Emergency & Control Room Hotlines
          </h3>
          <p className="text-gray-500">Numbers displayed on citizen emergency banner and helpline dials.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
              Toll-Free Control Room Number
            </label>
            <input
              type="text"
              value={tollFree}
              onChange={(e) => setTollFree(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl focus:outline-hidden focus:border-primary"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
              EPABX Municipal Exchange
            </label>
            <input
              type="text"
              value={exchangePhone}
              onChange={(e) => setExchangePhone(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl focus:outline-hidden focus:border-primary"
            />
          </div>
        </div>

        <div className="border-b border-gray-100 pb-4 pt-4">
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-1">
            Grievance Redressal & Citizen Charter
          </h3>
          <p className="text-gray-500">Service benchmarks and early payment incentives.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
              Charter SLA Benchmark (Max Days to Resolve)
            </label>
            <input
              type="number"
              value={slaTargetDays}
              onChange={(e) => setSlaTargetDays(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl focus:outline-hidden focus:border-primary"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
              Active Property Tax Rebate (%)
            </label>
            <input
              type="number"
              value={taxRebatePercent}
              onChange={(e) => setTaxRebatePercent(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl focus:outline-hidden focus:border-primary"
            />
          </div>
        </div>

        <div className="border-b border-gray-100 pb-4 pt-4">
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-1">
            Hill Station Tourism Status Banner
          </h3>
          <p className="text-gray-500">Real-time status shown on homepage tourism widget.</p>
        </div>

        <div>
          <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
            Ghat & Tourism Weather Advisory
          </label>
          <input
            type="text"
            value={weatherStatus}
            onChange={(e) => setWeatherStatus(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl focus:outline-hidden focus:border-primary"
          />
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
}
