"use client";

import { useState, useEffect } from "react";
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
  Loader2,
  RefreshCw,
  X,
} from "lucide-react";
import Link from "next/link";
import {
  getContactsData,
  updateContactsData,
  EmergencyContact,
  MunicipalHq,
} from "@/lib/services/contacts.service";

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
                  className={`w-full px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${isSelected
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 1. WhatsApp Helpline
  const [whatsappHelpline, setWhatsappHelpline] = useState("");

  // 2. Dynamic Emergency Numbers & Hotlines
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);

  // 3. Municipal Headquarters & Timings & Google Maps
  const [hq, setHq] = useState<MunicipalHq>({
    complexName: "",
    addressLine1: "",
    addressLine2: "",
    pinCode: "",
    epabxPhones: "",
    officialEmail: "",
    coEmail: "",
    workingHours: "",
    workingHoursNote: "",
    mapEmbedUrl: "",
  });

  // Load live data from API
  const loadData = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const data = await getContactsData();

      setWhatsappHelpline(data.whatsappHelpline || "");
      setEmergencyContacts(data.emergencyContacts || []);
      setHq(
        data.hq || {
          complexName: "",
          addressLine1: "",
          addressLine2: "",
          pinCode: "",
          epabxPhones: "",
          officialEmail: "",
          coEmail: "",
          workingHours: "",
          workingHoursNote: "",
          mapEmbedUrl: "",
        }
      );
    } catch (err: any) {
      console.error("Failed to load contacts data:", err);
      setErrorMessage(err.message || "Failed to load contacts data from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddEmergencyContact = () => {
    const newId = `em-${Date.now()}`;
    setEmergencyContacts([
      ...emergencyContacts,
      {
        id: newId,
        name: "",
        number: "",
        icon: "Phone",
        active: true,
      },
    ]);
  };

  const handleUpdateEmergencyContact = (
    id: string | number,
    field: keyof EmergencyContact,
    value: any
  ) => {
    setEmergencyContacts(
      emergencyContacts.map((c) => (String(c.id) === String(id) ? { ...c, [field]: value } : c))
    );
  };

  const handleDeleteEmergencyContact = (id: string | number) => {
    setEmergencyContacts(emergencyContacts.filter((c) => String(c.id) !== String(id)));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setErrorMessage(null);

      const payload = {
        whatsappHelpline,
        emergencyContacts,
        hq,
      };

      const res = await updateContactsData(payload);

      if (res.data?.contacts) {
        setWhatsappHelpline(res.data.contacts.whatsappHelpline || "");
        if (res.data.contacts.emergencyContacts) {
          setEmergencyContacts(res.data.contacts.emergencyContacts);
        }
        if (res.data.contacts.hq) {
          setHq(res.data.contacts.hq);
        }
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    } catch (err: any) {
      console.error("Failed to save contacts:", err);
      setErrorMessage(err.message || "Failed to save contacts and helpdesk data.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-border shadow-xs space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
        <p className="text-sm font-bold text-gray-700">Loading Contacts & Helpdesk Content from API...</p>
        <p className="text-xs text-gray-500">Fetching emergency hotlines, WhatsApp lines, and municipal office info.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-border shadow-xs">
        <div>
          {/* <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-primary-light text-primary font-bold text-xs">
              Live Section Editor
            </span>
            <span className="text-xs text-gray-500">• Route: /contact (Contacts & Helpdesk)</span>
          </div> */}
          <h2 className="text-xl font-extrabold text-text-primary mt-1">Contacts & Helpdesk Content</h2>
          <p className="text-xs text-gray-500">
            Manage 24×7 emergency contacts, WhatsApp helpline, office details, timings, and Google Maps.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadData}
            title="Reload from API"
            className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
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
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Publish Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Alert Message */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 flex items-center justify-between text-xs font-semibold animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadData}
              className="text-xs font-bold underline hover:no-underline text-red-800 cursor-pointer"
            >
              Retry
            </button>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="p-1 hover:bg-red-100 rounded-lg cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 flex items-center gap-3 text-xs font-bold animate-in fade-in duration-300">
          <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
          <span>Contact details and emergency helplines saved and published successfully!</span>
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
                Configure WhatsApp helpline and dynamic emergency hotline numbers ({emergencyContacts.length} numbers configured).
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

          {emergencyContacts.length === 0 ? (
            <div className="p-8 text-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl space-y-2">
              <Phone className="w-8 h-8 text-gray-400 mx-auto" />
              <p className="text-xs font-bold text-gray-700">No emergency contacts configured yet.</p>
              <p className="text-[11px] text-gray-500">
                Click the &quot;Add Emergency Contact&quot; button above to create dynamic 24x7 helpline numbers.
              </p>
            </div>
          ) : (
            emergencyContacts.map((contact, index) => (
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

                    <button
                      type="button"
                      onClick={() => handleDeleteEmergencyContact(contact.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete this helpline"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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
            ))
          )}

          {/* Add More Emergency Contacts Option Button */}
          <button
            type="button"
            onClick={handleAddEmergencyContact}
            className="w-full py-3 rounded-2xl border-2 border-dashed border-primary/50 hover:border-primary bg-primary-light/40 hover:bg-primary-light text-primary font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Emergency Contact</span>
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
                placeholder="e.g. Administrative Complex"
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
                placeholder="e.g. Old Mumbai-Pune Highway, Near Kumar Resort"
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
                placeholder="e.g. Lonavala, Dist. Pune, Maharashtra"
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
                placeholder="e.g. 410401"
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
                placeholder="e.g. +91 2114 273030 / 273031"
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
                placeholder="e.g. contact@lonavalamc.gov.in"
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
                placeholder="e.g. co@lonavalamc.gov.in"
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
                placeholder="e.g. Monday to Saturday: 09:45 AM – 05:45 PM"
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
                placeholder="e.g. (Closed on 2nd & 4th Saturdays and Public Holidays)"
                className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl focus:border-primary focus:outline-hidden"
              />
            </div>
          </div>

          {/* Google Maps Embed URL or iframe code */}
          <div className="space-y-2">
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span>Google Maps Embed URL or Iframe Code</span>
              </span>
              <span className="text-[10px] text-gray-400 font-normal normal-case">
                Paste either direct link or full &lt;iframe src=&quot;...&quot;&gt;&lt;/iframe&gt; code
              </span>
            </label>
            <textarea
              rows={2}
              value={hq.mapEmbedUrl}
              onChange={(e) => {
                const raw = e.target.value;
                const match = raw.match(/src=["']([^"']+)["']/i);
                if (match && match[1]) {
                  setHq({ ...hq, mapEmbedUrl: match[1] });
                } else {
                  setHq({ ...hq, mapEmbedUrl: raw });
                }
              }}
              placeholder='https://www.google.com/maps/embed?pb=... or <iframe src="https://www.google.com/maps/embed?pb=..." ...></iframe>'
              className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl font-mono text-[11px] text-gray-700 focus:border-primary focus:outline-hidden"
            />

            {/* Live Map Preview in Admin Editor */}
            {/* {hq.mapEmbedUrl && (
              <div className="mt-3 rounded-2xl overflow-hidden border border-border bg-slate-100">
                <div className="px-3 py-1.5 bg-gray-50 border-b border-border text-[11px] font-bold text-gray-600 flex items-center justify-between">
                  <span>Live Map Preview</span>
                  <span className="text-emerald-600 font-semibold">✓ Valid Embed URL</span>
                </div>
                <div className="relative h-44 w-full">
                  <iframe
                    src={
                      hq.mapEmbedUrl.match(/src=["']([^"']+)["']/i)?.[1] ||
                      (hq.mapEmbedUrl.startsWith("http")
                        ? hq.mapEmbedUrl
                        : `https://maps.google.com/maps?q=${encodeURIComponent(
                            hq.mapEmbedUrl
                          )}&t=&z=16&ie=UTF8&iwloc=&output=embed`)
                    }
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    title="Admin Google Map Preview"
                  />
                </div>
              </div>
            )} */}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Save Bar */}
      <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-border shadow-lg flex items-center justify-between">
        <div className="text-xs text-gray-500">
          Status: <span className="font-semibold text-gray-800">Connected to API</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadData}
            disabled={saving}
            className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
          >
            Discard Changes
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Contacts...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save & Publish Contacts</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
