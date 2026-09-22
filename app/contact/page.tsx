"use client";

import { useState, useEffect } from "react";
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
  PhoneCall,
  AlertCircle,
  AlertTriangle,
  Zap,
  HelpCircle,
  Sparkles,
  MessageCircle,
  MessageSquare,
  Loader2,
} from "lucide-react";
import {
  getContactsData,
  EmergencyContact,
  MunicipalHq,
} from "@/lib/services/contacts.service";
import { getAllDepartments } from "@/lib/services/department.service";
import { Department } from "@/types";

const ICON_MAP: { [key: string]: any } = {
  ShieldAlert,
  Flame,
  Siren,
  Ambulance,
  Phone,
  PhoneCall,
  MessageCircle,
  MessageSquare,
  AlertCircle,
  AlertTriangle,
  Zap,
  Building2,
  HelpCircle,
  Sparkles,
};

function parseGoogleMapEmbedUrl(input?: string): string {
  if (!input || !input.trim()) {
    return "https://maps.google.com/maps?q=Lonavala%20Municipal%20Council%20Office%2C%20Old%20Mumbai%20Pune%20Highway%2C%20Lonavala&t=&z=16&ie=UTF8&iwloc=&output=embed";
  }
  const str = input.trim();
  // 1. If user pasted iframe HTML: <iframe src="https://..." ...>
  const srcMatch = str.match(/src=["']([^"']+)["']/i);
  if (srcMatch && srcMatch[1]) {
    return srcMatch[1];
  }
  // 2. If it's a direct URL
  if (str.startsWith("http://") || str.startsWith("https://")) {
    return str;
  }
  // 3. Fallback search query
  return `https://maps.google.com/maps?q=${encodeURIComponent(str)}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
}

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [contactsList, setContactsList] = useState<EmergencyContact[]>([]);
  const [whatsappHelpline, setWhatsappHelpline] = useState<string>("");
  const [hq, setHq] = useState<MunicipalHq>({
    complexName: "Administrative Complex",
    addressLine1: "Old Mumbai-Pune Highway, Near Kumar Resort",
    addressLine2: "Lonavala, Dist. Pune, Maharashtra",
    pinCode: "410401",
    epabxPhones: "+91 2114 273030 / 273031 / 273032",
    officialEmail: "contact@lonavalamc.gov.in",
    coEmail: "co@lonavalamc.gov.in",
    workingHours: "Monday to Saturday: 09:45 AM – 05:45 PM",
    workingHoursNote: "(Closed on 2nd & 4th Saturdays and Public Holidays)",
    mapEmbedUrl: "",
  });

  const [departmentsList, setDepartmentsList] = useState<Department[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "General Administration",
    message: "",
  });

  useEffect(() => {
    async function loadContacts() {
      try {
        setLoading(true);
        const data = await getContactsData();
        if (data.emergencyContacts && data.emergencyContacts.length > 0) {
          setContactsList(data.emergencyContacts.filter((c) => c.active));
        }
        if (data.whatsappHelpline) {
          setWhatsappHelpline(data.whatsappHelpline);
        }
        if (data.hq && data.hq.complexName) {
          setHq(data.hq);
        }
      } catch (err) {
        console.error("Failed to load contacts for public page:", err);
      } finally {
        setLoading(false);
      }
    }

    async function loadDepts() {
      try {
        const depts = await getAllDepartments({ isActive: true });
        if (depts && depts.length > 0) {
          setDepartmentsList(depts);
          setFormData((prev) => ({
            ...prev,
            department: prev.department === "General Administration" ? depts[0].name : prev.department,
          }));
        }
      } catch (err) {
        console.warn("Could not load departments for contact dropdown:", err);
      }
    }

    loadContacts();
    loadDepts();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-10">
      {/* Header */}
      <div className="bg-primary-light/60 border-y border-border py-12 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-white px-3 py-1 rounded-full border border-border">
              Civic Helpdesk
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary mt-3">
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
        {contactsList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {contactsList.map((contact, idx) => {
              const IconComp = ICON_MAP[contact.icon] || Phone;
              const cleanTel = contact.number.replace(/[^0-9+]/g, "").split("/")[0].trim();
              return (
                <div
                  key={contact.id || idx}
                  className="p-4 rounded-2xl bg-white border border-border shadow-xs flex items-center gap-3 hover:border-primary transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center shrink-0">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] uppercase font-bold text-gray-500 truncate">
                      {contact.name}
                    </div>
                    <a
                      href={`tel:${cleanTel}`}
                      className="text-sm font-bold text-gray-900 hover:text-primary hover:underline font-mono truncate block"
                    >
                      {contact.number}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        ) : loading ? (
          <div className="p-6 rounded-2xl bg-white border border-border flex items-center justify-center gap-2 text-xs text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
            <span>Loading emergency helpline numbers...</span>
          </div>
        ) : null}

        {/* WhatsApp Helpline Highlight (if configured) */}
        {whatsappHelpline && (
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 shadow-xs">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900">Official Municipal WhatsApp Helpdesk</h3>
                <p className="text-xs text-gray-600">
                  Instant grievance updates, citizen assistance, and disaster advisories.
                </p>
              </div>
            </div>
            <a
              href={`https://wa.me/${whatsappHelpline.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shrink-0 shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp ({whatsappHelpline})</span>
            </a>
          </div>
        )}

        {/* Contact Form & Main Office Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Contact Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-border shadow-xs">
            <h2 className="text-xl font-bold text-text-primary mb-2">Send an Inquiry / Feedback</h2>
            <p className="text-xs text-gray-500 mb-6">
              For official complaints with tracking reference, please use our &quot;Report Grievance&quot; portal.
            </p>

            {submitted ? (
              <div className="bg-primary-light p-6 rounded-2xl border border-primary text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-primary mx-auto" />
                <h3 className="text-base font-bold text-text-primary">Message Received</h3>
                <p className="text-xs text-gray-600">
                  Thank you for contacting Lonavala Municipal Council. Our citizen helpdesk officer will respond via email or phone within 1 working day.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl cursor-pointer"
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
                      className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl focus:outline-hidden focus:border-primary"
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
                      className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl focus:outline-hidden focus:border-primary"
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
                      className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl focus:outline-hidden focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Concerned Department
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl focus:outline-hidden focus:border-primary"
                    >
                      {departmentsList.length > 0 ? (
                        departmentsList.map((d) => (
                          <option key={d.id} value={d.name}>
                            {d.name}
                          </option>
                        ))
                      ) : (
                        <option value="General Administration">General Administration</option>
                      )}
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
                    className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl focus:outline-hidden focus:border-primary"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Inquiry</span>
                </button>
              </form>
            )}
          </div>

          {/* Office Address & Timings */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border shadow-xs space-y-4">
              <h3 className="font-bold text-base text-text-primary border-b border-gray-100 pb-2">
                Municipal Headquarters
              </h3>

              <div className="space-y-3 text-xs text-gray-600">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-gray-900">{hq.complexName || "Administrative Complex"}</div>
                    {hq.addressLine1 && <div>{hq.addressLine1}</div>}
                    <div>
                      {hq.addressLine2 || "Lonavala, Dist. Pune, Maharashtra"}{" "}
                      {hq.pinCode ? `- ${hq.pinCode}` : ""}
                    </div>
                  </div>
                </div>

                {hq.epabxPhones && (
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-gray-900">Exchange EPABX</div>
                      <div className="font-mono">{hq.epabxPhones}</div>
                    </div>
                  </div>
                )}

                {(hq.officialEmail || hq.coEmail) && (
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-gray-900">Official Inquiries</div>
                      <div className="font-mono break-all">
                        {[hq.officialEmail, hq.coEmail].filter(Boolean).join(" / ")}
                      </div>
                    </div>
                  </div>
                )}

                {(hq.workingHours || hq.workingHoursNote) && (
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-gray-900">Office Working Hours</div>
                      <div>{hq.workingHours || "Monday to Saturday: 09:45 AM – 05:45 PM"}</div>
                      {hq.workingHoursNote && (
                        <div className="text-gray-400 text-[11px]">{hq.workingHoursNote}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Municipal Headquarters & Google Map Location */}
        <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-primary-light text-primary">
                  <MapPin className="w-5 h-5" />
                </span>
                <h3 className="text-xl font-bold text-text-primary">
                  Find Us on Google Maps
                </h3>
              </div>
              <p className="text-xs text-gray-500">
                {hq.complexName || "Lonavala Municipal Council Main Complex"}, {hq.addressLine1 || "Old Mumbai-Pune Highway, Near Kumar Resort"}, {hq.addressLine2 || "Lonavala, Dist. Pune"} {hq.pinCode ? `- ${hq.pinCode}` : ""}
              </p>
            </div>

            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(
                `${hq.complexName || "Lonavala Municipal Council"}, ${hq.addressLine1 || "Old Mumbai Pune Highway, Lonavala"}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shrink-0 shadow-xs"
            >
              <span>Get Directions</span>
              <span className="text-sm">↗</span>
            </a>
          </div>

          {/* Interactive Google Map Embed */}
          <div className="relative w-full h-[400px] sm:h-[450px] rounded-2xl overflow-hidden border border-border bg-slate-100 shadow-inner">
            <iframe
              src={parseGoogleMapEmbedUrl(hq.mapEmbedUrl)}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lonavala Municipal Council Google Map Location"
              className="w-full h-full"
            />
          </div>

          {/* Location Quick Information */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-primary-surface border border-border">
              <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Landmark</div>
              <div className="text-xs font-semibold text-text-primary mt-1">Near Kumar Resort, Old Mumbai-Pune Highway</div>
            </div>
            <div className="p-4 rounded-xl bg-primary-surface border border-border">
              <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Citizen Facilitation Center</div>
              <div className="text-xs font-semibold text-text-primary mt-1">Ground Floor, Administrative Building</div>
            </div>
            <div className="p-4 rounded-xl bg-primary-surface border border-border">
              <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Public Transport</div>
              <div className="text-xs font-semibold text-text-primary mt-1">1.2 km from Lonavala Railway Station</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
