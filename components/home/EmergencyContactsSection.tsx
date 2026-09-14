"use client";

import { PhoneCall, ShieldAlert, Flame, Ambulance, Siren } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export function EmergencyContactsSection() {
  const { dict } = useLanguage();

  const contacts = [
    {
      title: dict.emergencyContacts.cards.controlRoom.title,
      number: "1800-233-0101",
      tel: "18002330101",
      badge: dict.emergencyContacts.cards.controlRoom.badge,
      desc: dict.emergencyContacts.cards.controlRoom.desc,
      icon: <ShieldAlert className="w-5 h-5 text-red-600" />,
      bg: "bg-red-50/70",
      border: "border-red-200/80",
    },
    {
      title: dict.emergencyContacts.cards.fire.title,
      number: "101 / 02114-273101",
      tel: "101",
      badge: dict.emergencyContacts.cards.fire.badge,
      desc: dict.emergencyContacts.cards.fire.desc,
      icon: <Flame className="w-5 h-5 text-orange-600" />,
      bg: "bg-orange-50/70",
      border: "border-orange-200/80",
    },
    {
      title: dict.emergencyContacts.cards.police.title,
      number: "112 / 02114-273033",
      tel: "112",
      badge: dict.emergencyContacts.cards.police.badge,
      desc: dict.emergencyContacts.cards.police.desc,
      icon: <Siren className="w-5 h-5 text-blue-600" />,
      bg: "bg-blue-50/70",
      border: "border-blue-200/80",
    },
    {
      title: dict.emergencyContacts.cards.hospital.title,
      number: "108 / 02114-273111",
      tel: "108",
      badge: dict.emergencyContacts.cards.hospital.badge,
      desc: dict.emergencyContacts.cards.hospital.desc,
      icon: <Ambulance className="w-5 h-5 text-emerald-600" />,
      bg: "bg-emerald-50/70",
      border: "border-emerald-200/80",
    },
  ];

  return (
    <section className="py-16 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200">
            {dict.emergencyContacts.badge}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {dict.emergencyContacts.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {dict.emergencyContacts.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contacts.map((item, idx) => (
            <div
              key={idx}
              className={`rounded-2xl border ${item.border} ${item.bg} p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-xs border border-white">
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-white px-2.5 py-0.5 rounded-full border border-slate-200/70 text-slate-700">
                    {item.badge}
                  </span>
                </div>

                <h3 className="font-bold text-sm sm:text-base text-slate-900 mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">{item.desc}</p>
              </div>

              <a
                href={`tel:${item.tel}`}
                className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-slate-900 hover:text-white text-slate-900 font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors border border-slate-200"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{dict.emergencyContacts.callPrefix} {item.number}</span>
              </a>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-700 hover:underline"
          >
            <span>{dict.emergencyContacts.viewAllExtensions}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
