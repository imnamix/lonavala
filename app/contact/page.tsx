"use client";

import { useState } from "react";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  ShieldAlert,
  Flame,
  Ambulance,
  Siren,
} from "lucide-react";
import { DEPARTMENTS } from "@/data/mockData";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: DEPARTMENTS[0].name,
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-10">
      {/* Header */}
      <div className="bg-[#E8F5E9]/60 border-y border-[#D9E8DD] py-12 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2E8B57] bg-white px-3 py-1 rounded-full border border-[#D9E8DD]">
              Civic Helpdesk
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] mt-3">
              Contact Lonavala Municipal Council
            </h1>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              Reach out to our executive officers, municipal control room, ward inspectors, or visit our Citizen Facilitation Center (CFC).
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Emergency Numbers Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-red-600 shrink-0" />
            <div>
              <div className="text-[10px] uppercase font-bold text-red-600">24x7 Control Room</div>
              <a href="tel:18002330101" className="text-sm font-bold text-gray-900 hover:underline">
                1800-233-0101
              </a>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 flex items-center gap-3">
            <Flame className="w-8 h-8 text-orange-600 shrink-0" />
            <div>
              <div className="text-[10px] uppercase font-bold text-orange-600">Fire Brigade</div>
              <a href="tel:101" className="text-sm font-bold text-gray-900 hover:underline">
                101 / 02114-273101
              </a>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-center gap-3">
            <Siren className="w-8 h-8 text-blue-600 shrink-0" />
            <div>
              <div className="text-[10px] uppercase font-bold text-blue-600">Police Station</div>
              <a href="tel:112" className="text-sm font-bold text-gray-900 hover:underline">
                112 / 02114-273033
              </a>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
            <Ambulance className="w-8 h-8 text-emerald-600 shrink-0" />
            <div>
              <div className="text-[10px] uppercase font-bold text-emerald-600">Ambulance (108)</div>
              <a href="tel:108" className="text-sm font-bold text-gray-900 hover:underline">
                108 / 02114-273111
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form & Main Office Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Contact Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-[#D9E8DD] shadow-xs">
            <h2 className="text-xl font-bold text-[#1F2937] mb-2">Send an Inquiry / Feedback</h2>
            <p className="text-xs text-gray-500 mb-6">
              For official complaints with tracking reference, please use our &quot;Report Grievance&quot; portal.
            </p>

            {submitted ? (
              <div className="bg-[#E8F5E9] p-6 rounded-2xl border border-[#2E8B57] text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#2E8B57] mx-auto" />
                <h3 className="text-base font-bold text-[#1F2937]">Message Received</h3>
                <p className="text-xs text-gray-600">
                  Thank you for contacting Lonavala Municipal Council. Our citizen helpdesk officer will respond via email or phone within 1 working day.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 bg-[#2E8B57] text-white text-xs font-bold rounded-xl"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Aniket Sharma"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#D9E8DD] rounded-xl focus:outline-hidden focus:border-[#2E8B57]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="9876543210"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#D9E8DD] rounded-xl focus:outline-hidden focus:border-[#2E8B57]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="aniket@example.com"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#D9E8DD] rounded-xl focus:outline-hidden focus:border-[#2E8B57]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Concerned Department
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#D9E8DD] rounded-xl focus:outline-hidden focus:border-[#2E8B57]"
                    >
                      {DEPARTMENTS.map((d) => (
                        <option key={d.id} value={d.name}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Your Message / Inquiry *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Write your detailed inquiry..."
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D9E8DD] rounded-xl focus:outline-hidden focus:border-[#2E8B57]"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-[#2E8B57] hover:bg-[#246E45] text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Inquiry</span>
                </button>
              </form>
            )}
          </div>

          {/* Office Address & Timings */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#D9E8DD] shadow-xs space-y-4">
              <h3 className="font-bold text-base text-[#1F2937] border-b border-gray-100 pb-2">
                Municipal Headquarters
              </h3>

              <div className="space-y-3 text-xs text-gray-600">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#2E8B57] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-gray-900">Administrative Complex</div>
                    <div>Old Mumbai-Pune Highway, Near Kumar Resort,</div>
                    <div>Lonavala, Dist. Pune, Maharashtra - 410401</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#2E8B57] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-gray-900">Exchange EPABX</div>
                    <div>+91 2114 273030 / 273031 / 273032</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#2E8B57] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-gray-900">Official Inquiries</div>
                    <div>contact@lonavalamc.gov.in / co@lonavalamc.gov.in</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#2E8B57] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-gray-900">Office Working Hours</div>
                    <div>Monday to Saturday: 09:45 AM – 05:45 PM</div>
                    <div className="text-gray-400 text-[11px]">
                      (Closed on 2nd & 4th Saturdays and Public Holidays)
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Embedded Map Placeholder */}
            <div className="bg-white rounded-3xl border border-[#D9E8DD] overflow-hidden shadow-xs">
              <div className="p-4 bg-[#F8FCF9] border-b border-[#D9E8DD] text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#2E8B57]" />
                <span>LMC Administrative Complex Location</span>
              </div>
              <div className="relative h-48 bg-emerald-50 flex items-center justify-center p-6 text-center">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-full bg-[#2E8B57] text-white flex items-center justify-center mx-auto shadow-md">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div className="font-bold text-xs text-gray-900">
                    Lonavala Municipal Council Main Complex
                  </div>
                  <div className="text-[11px] text-gray-500">
                    Geo: 18.7548° N, 73.4062° E • 1.2 km from Lonavala Railway Station
                  </div>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-xs font-bold text-[#2E8B57] hover:underline pt-1"
                  >
                    Open in Google Maps ↗
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Department Extensions Directory */}
        <div className="bg-white rounded-3xl border border-[#D9E8DD] p-6 sm:p-8 shadow-xs space-y-4">
          <h3 className="text-lg font-bold text-[#1F2937]">Departmental Telephone Extensions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {DEPARTMENTS.map((dept) => (
              <div key={dept.id} className="p-3.5 rounded-xl bg-[#F8FCF9] border border-[#D9E8DD] space-y-1">
                <div className="font-bold text-xs text-[#1F2937] truncate">{dept.name}</div>
                <div className="text-[11px] text-[#2E8B57] font-semibold">{dept.phone}</div>
                <div className="text-[10px] text-gray-500 truncate">{dept.headOfficer}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
