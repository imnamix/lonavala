"use client";

import { useState } from "react";
import {
  Phone,
  Save,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  Flame,
  Siren,
  Ambulance,
  MapPin,
  Mail,
  Clock,
  Building2,
  Plus,
  Trash2,
  PhoneCall,
  AlertCircle,
  AlertTriangle,
  Zap,
  HelpCircle,
  Sparkles,
  Check,
  ChevronDown,
  MessageSquare,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";

interface EmergencyContact {
  id: string;
  name: string;
  number: string;
  icon: string;
  active: boolean;
}

const EMERGENCY_ICONS: { [key: string]: { name: string; icon: any } } = {
  ShieldAlert: { name: "Shield Alert / Control", icon: ShieldAlert },
  Flame: { name: "Flame / Fire Brigade", icon: Flame },
  Siren: { name: "Siren / Police", icon: Siren },
  Ambulance: { name: "Ambulance / Medical", icon: Ambulance },
  Phone: { name: "Phone / Helpline", icon: Phone },
  PhoneCall: { name: "Phone Call / Direct", icon: PhoneCall },
  MessageCircle: { name: "WhatsApp / Chat", icon: MessageCircle },
  MessageSquare: { name: "Message / SMS", icon: MessageSquare },
  AlertCircle: { name: "Alert Circle", icon: AlertCircle },
  AlertTriangle: { name: "Alert Triangle", icon: AlertTriangle },
  Zap: { name: "Electricity / Power", icon: Zap },
  Building2: { name: "Municipal HQ / Office", icon: Building2 },
  HelpCircle: { name: "Help / Information", icon: HelpCircle },
  Sparkles: { name: "Special Helpline", icon: Sparkles },
};

function EmergencyIconDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selectedObj = EMERGENCY_ICONS[value] || EMERGENCY_ICONS.Phone;
  const SelectedIcon = selectedObj.icon;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs flex items-center justify-between hover:border-primary focus:outline-hidden transition-colors cursor-pointer"
      >
        <span className="flex items-center gap-2 truncate">
          <SelectedIcon className="w-4 h-4 text-primary shrink-0" />
          <span className="font-semibold text-gray-800 truncate">{selectedObj.name}</span>
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0 ml-1" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 right-0 mt-1 max-h-52 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-1 space-y-0.5">
            {Object.keys(EMERGENCY_ICONS).map((iconKey) => {
              const item = EMERGENCY_ICONS[iconKey];
              const IconComp = item.icon;
              const isSelected = iconKey === value;
              return (
                <button
                  key={iconKey}
                  type="button"
                  onClick={() => {
                    onChange(iconKey);
                    setOpen(false);
                  }}
                  className={`w-full px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-primary-light text-primary font-bold"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="flex items-center gap-2 truncate">
                    <IconComp className="w-4 h-4 shrink-0 text-primary" />
                    <span>{item.name}</span>
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 shrink-0 text-primary" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export function ContactsContentEditor() {
  const [saved, setSaved] = useState(false);

  // 1. WhatsApp Helpline
  const [whatsappHelpline, setWhatsappHelpline] = useState("+91 94235 88990");

  // 2. Dynamic Emergency Numbers & Hotlines
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    {
      id: "em-1",
      name: "24x7 Control Room",
      number: "1800-233-0101",
      icon: "ShieldAlert",
      active: true,
    },
    {
      id: "em-2",
      name: "Fire Brigade Hotline",
      number: "101 / 02114-273101",
      icon: "Flame",
      active: true,
    },
    {
      id: "em-3",
      name: "Police Station",
      number: "112 / 02114-273033",
      icon: "Siren",
      active: true,
    },
    {
      id: "em-4",
      name: "Ambulance Emergency (108)",
      number: "108 / 02114-273111",
      icon: "Ambulance",
      active: true,
    },
  ]);

  // 3. Municipal Headquarters & Timings & Google Maps
  const [hq, setHq] = useState({
    complexName: "Administrative Complex",
    addressLine1: "Old Mumbai-Pune Highway, Near Kumar Resort",
    addressLine2: "Lonavala, Dist. Pune, Maharashtra",
    pinCode: "410401",
    epabxPhones: "+91 2114 273030 / 273031 / 273032",
    officialEmail: "contact@lonavalamc.gov.in",
    coEmail: "co@lonavalamc.gov.in",
    workingHours: "Monday to Saturday: 09:45 AM – 05:45 PM",
    workingHoursNote: "(Closed on 2nd & 4th Saturdays and Public Holidays)",
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Lonavala+Municipal+Council&t=&z=15&ie=UTF8&iwloc=&output=embed",
  });

  const handleAddEmergencyContact = () => {
    const newId = `em-${Date.now()}`;
    setEmergencyContacts([
      ...emergencyContacts,
      {
        id: newId,
        name: "New Emergency Contact",
        number: "02114-XXXXXX",
        icon: "Phone",
        active: true,
      },
    ]);
  };

  const handleUpdateEmergencyContact = (
    id: string,
    field: keyof EmergencyContact,
    value: any
  ) => {
    setEmergencyContacts(
      emergencyContacts.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const handleDeleteEmergencyContact = (id: string) => {
    if (emergencyContacts.length <= 1) {
      alert("At least one emergency contact must remain configured.");
      return;
    }
    setEmergencyContacts(emergencyContacts.filter((c) => c.id !== id));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3500);
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-border shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-primary-light text-primary font-bold text-xs">
              Live Section Editor
            </span>
            <span className="text-xs text-gray-500">• Route: /contact (Contacts)</span>
          </div>
          <h2 className="text-xl font-extrabold text-text-primary mt-1">Contacts & Helpdesk Content</h2>
          <p className="text-xs text-gray-500">
            Manage dynamic 24x7 emergency contacts, WhatsApp helpline, municipal headquarters address, EPABX phone lines, office timings, and Google Maps embed.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            target="_blank"
            className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Live Page</span>
          </Link>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Publish Changes</span>
          </button>
        </div>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 flex items-center gap-3 text-xs font-bold animate-in fade-in duration-300">
          <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
          <span>Contact details and emergency helplines saved successfully!</span>
        </div>
      )}

      {/* SECTION 1: Dynamic Emergency 24x7 Helplines & WhatsApp */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h3 className="font-bold text-base text-text-primary">24x7 Emergency Numbers & Helplines</h3>
              <p className="text-xs text-gray-500">
                Configure WhatsApp helpline and dynamic emergency hotline numbers ({emergencyContacts.length} numbers active).
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddEmergencyContact}
            className="px-4 py-2.5 rounded-xl bg-primary text-white hover:bg-primary-hover font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shrink-0 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Emergency Contact</span>
          </button>
        </div>

        {/* WhatsApp Dedicated Helpline Field */}
        <div className="p-4 rounded-2xl bg-primary-light/60 border border-emerald-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 shadow-xs">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <label className="block font-bold text-gray-900 text-xs">
                Official WhatsApp Helpline Number
              </label>
              <span className="text-[11px] text-gray-500">
                Direct WhatsApp contact for citizen assistance and disaster alerts.
              </span>
            </div>
          </div>

          <div className="w-full sm:w-72">
            <input
              type="text"
              value={whatsappHelpline}
              onChange={(e) => setWhatsappHelpline(e.target.value)}
              placeholder="e.g. +91 94235 88990"
              className="w-full px-3.5 py-2.5 bg-white border border-primary rounded-xl font-bold font-mono text-primary text-xs focus:ring-2 focus:ring-primary/20 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Dynamic Emergency Contacts List */}
        <div className="space-y-3">
          <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
            Department Emergency Numbers ({emergencyContacts.length})
          </div>

          {emergencyContacts.map((contact, index) => (
            <div
              key={contact.id}
              className="p-4 rounded-2xl bg-primary-surface border border-border hover:border-emerald-300 transition-colors space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-primary">
                  Emergency Helpline #{index + 1}
                </span>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-gray-700">
                    <span>Active:</span>
                    <input
                      type="checkbox"
                      checked={contact.active}
                      onChange={(e) =>
                        handleUpdateEmergencyContact(contact.id, "active", e.target.checked)
                      }
                      className="w-4 h-4 rounded text-primary focus:ring-primary"
                    />
                  </label>

                  {emergencyContacts.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteEmergencyContact(contact.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete this helpline"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
                {/* Visual Icon Dropdown */}
                <div className="sm:col-span-4">
                  <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                    Contact Icon
                  </label>
                  <EmergencyIconDropdown
                    value={contact.icon}
                    onChange={(val) => handleUpdateEmergencyContact(contact.id, "icon", val)}
                  />
                </div>

                {/* Contact Name */}
                <div className="sm:col-span-4">
                  <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                    Contact Title / Name
                  </label>
                  <input
                    type="text"
                    value={contact.name}
                    onChange={(e) =>
                      handleUpdateEmergencyContact(contact.id, "name", e.target.value)
                    }
                    placeholder="e.g. 24x7 Control Room"
                    className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-xl font-bold text-gray-800 focus:border-primary focus:outline-hidden"
                  />
                </div>

                {/* Contact Number */}
                <div className="sm:col-span-4">
                  <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                    Helpline Number / Phone
                  </label>
                  <input
                    type="text"
                    value={contact.number}
                    onChange={(e) =>
                      handleUpdateEmergencyContact(contact.id, "number", e.target.value)
                    }
                    placeholder="e.g. 1800-233-0101"
                    className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-xl font-bold font-mono text-emerald-800 focus:border-primary focus:outline-hidden"
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Add More Emergency Contacts Option Button */}
          <button
            type="button"
            onClick={handleAddEmergencyContact}
            className="w-full py-3 rounded-2xl border-2 border-dashed border-primary/50 hover:border-primary bg-primary-light/40 hover:bg-primary-light text-primary font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add More Emergency Contacts</span>
          </button>
        </div>
      </div>

      {/* SECTION 2: Municipal Headquarters Details & Google Maps */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border shadow-xs space-y-6">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center font-bold">
            2
          </div>
          <div>
            <h3 className="font-bold text-base text-text-primary">Municipal Headquarters & Office Timings</h3>
            <p className="text-xs text-gray-500">
              Official address, EPABX phone lines, official emails, office timings, and Google Maps embed URL.
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-primary" />
                <span>Complex Name</span>
              </label>
              <input
                type="text"
                value={hq.complexName}
                onChange={(e) => setHq({ ...hq, complexName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl font-bold focus:border-primary focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span>Street Address</span>
              </label>
              <input
                type="text"
                value={hq.addressLine1}
                onChange={(e) => setHq({ ...hq, addressLine1: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl focus:border-primary focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                City / District / State
              </label>
              <input
                type="text"
                value={hq.addressLine2}
                onChange={(e) => setHq({ ...hq, addressLine2: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl focus:border-primary focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                Postal PIN Code
              </label>
              <input
                type="text"
                value={hq.pinCode}
                onChange={(e) => setHq({ ...hq, pinCode: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl font-mono focus:border-primary focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-primary" />
                <span>EPABX Exchange Numbers</span>
              </label>
              <input
                type="text"
                value={hq.epabxPhones}
                onChange={(e) => setHq({ ...hq, epabxPhones: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl font-mono focus:border-primary focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-primary" />
                <span>Official Inquiries Email</span>
              </label>
              <input
                type="email"
                value={hq.officialEmail}
                onChange={(e) => setHq({ ...hq, officialEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl font-mono focus:border-primary focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-primary" />
                <span>Chief Officer Email</span>
              </label>
              <input
                type="email"
                value={hq.coEmail}
                onChange={(e) => setHq({ ...hq, coEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl font-mono focus:border-primary focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span>Office Working Hours</span>
              </label>
              <input
                type="text"
                value={hq.workingHours}
                onChange={(e) => setHq({ ...hq, workingHours: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl focus:border-primary focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                Weekend / Holidays Note
              </label>
              <input
                type="text"
                value={hq.workingHoursNote}
                onChange={(e) => setHq({ ...hq, workingHoursNote: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl focus:border-primary focus:outline-hidden"
              />
            </div>
          </div>

          {/* Google Maps Embed URL */}
          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span>Google Maps Embed URL</span>
            </label>
            <input
              type="text"
              value={hq.mapEmbedUrl}
              onChange={(e) => setHq({ ...hq, mapEmbedUrl: e.target.value })}
              placeholder="https://maps.google.com/maps?q=..."
              className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl font-mono text-[11px] text-gray-700 focus:border-primary focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Sticky Bottom Save Bar */}
      <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-border shadow-lg flex items-center justify-between">
        <div className="text-xs text-gray-500">
          Last updated: <span className="font-semibold text-gray-800">Just now</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 text-xs font-bold transition-colors cursor-pointer"
          >
            Discard Changes
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save & Publish Contacts</span>
          </button>
        </div>
      </div>
    </form>
  );
}
