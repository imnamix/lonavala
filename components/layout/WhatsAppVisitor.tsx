"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { getContactsData } from "@/lib/services/contacts.service";

export function WhatsAppVisitor() {
  const [whatsappNumber, setWhatsappNumber] = useState<string>("");
  const [showTooltip, setShowTooltip] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchWhatsApp() {
      try {
        const data = await getContactsData();
        if (isMounted && data.whatsappHelpline) {
          setWhatsappNumber(data.whatsappHelpline);
        }
      } catch (err) {
        console.error("Failed to load WhatsApp contact:", err);
      }
    }
    fetchWhatsApp();
    return () => {
      isMounted = false;
    };
  }, []);

  if (!whatsappNumber || !whatsappNumber.trim()) {
    return null;
  }

  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, "");
  const chatUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
    "Hello Lonavala Municipal Council, I have an inquiry regarding citizen services."
  )}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end group select-none">
      {/* Tooltip / Popup Badge */}
      {showTooltip && (
        <div className="mb-2 relative bg-white text-gray-800 text-xs py-2 px-3.5 rounded-2xl shadow-xl border border-emerald-100 flex items-center gap-2 animate-bounce-short">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-gray-700">Need help? Chat with us on WhatsApp</span>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="text-gray-400 hover:text-gray-600 p-0.5 rounded-full hover:bg-gray-100 transition-colors"
            title="Dismiss"
            aria-label="Dismiss tooltip"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          {/* Tooltip Arrow */}
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white border-r border-b border-emerald-100 rotate-45" />
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={chatUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Chat with Lonavala Municipal Council on WhatsApp (${whatsappNumber})`}
        className="relative flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 group focus:outline-hidden"
      >
        {/* Glowing pulse ring */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/40 animate-ping opacity-75 pointer-events-none" />

        {/* WhatsApp Official SVG Logo */}
        <svg
          className="w-7 h-7 fill-current relative z-10"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c4.54 0 8.24 3.7 8.24 8.24 0 2.2-.86 4.28-2.42 5.83a8.17 8.17 0 0 1-5.82 2.41c-1.47 0-2.92-.39-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.21 8.21 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.07-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43l-.47-.01c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.78.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.17-.48-.29z" />
        </svg>
      </a>
    </div>
  );
}
