"use client";

import { useEffect, useState } from "react";
import { X, MessageCircle } from "lucide-react";
import { getContactsData } from "@/lib/services/contacts.service";

export function WhatsAppVisitor() {
  const [whatsappNumber, setWhatsappNumber] = useState("");
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

  if (!whatsappNumber.trim()) return null;

  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, "");

  const chatUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
    "Hello Lonavala Municipal Council, I have an inquiry regarding citizen services."
  )}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end select-none">
      {/* Tooltip */}
    

      {/* Floating WhatsApp Button */}
      <a
        href={chatUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Chat with Lonavala Municipal Council on WhatsApp (${whatsappNumber})`}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-[#20bd5a] hover:shadow-2xl active:scale-95"
      >
  

        {/* Lucide Icon */}
        <MessageCircle className="relative z-10 h-7 w-7" strokeWidth={2.5} />
      </a>
    </div>
  );
}