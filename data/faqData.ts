import { FAQItem } from "@/types";

export const INITIAL_FAQS: FAQItem[] = [
  {
    id: "faq-1",
    question: "How can I pay my Property Tax online and claim the early rebate?",
    answer:
      "Visit the Citizen Services page, select 'Property Tax', enter your Assessment ID or Ward number, review arrears, and pay via Net Banking, UPI, or Credit Card. Payments completed before June 30 receive an automatic 5% rebate.",
    active: true,
  },
  {
    id: "faq-2",
    question: "What is the procedure for registering a civic grievance?",
    answer:
      "Citizens can register grievances via the 5-step Grievance portal or Maha-Lonavala 311 app. Upload a photo, select your ward and category, and submit. You will receive an SMS with a tracking token and guaranteed resolution within 3 to 7 days.",
    active: true,
  },
  {
    id: "faq-3",
    question: "What are the timings and entry rules for Bhushi Dam and Tiger Point?",
    answer:
      "Bhushi Dam is accessible daily from 09:00 AM to 05:00 PM during the monsoon season. Tiger Point remains open until 06:30 PM. Swimming beyond demarcated safety barriers is strictly prohibited by order of the Sub-Divisional Magistrate.",
    active: true,
  },
  {
    id: "faq-4",
    question: "How can I obtain a digitised QR-coded Birth or Death certificate?",
    answer:
      "Search by date of event and parent/deceased name in the Health Department portal. Verified certificates can be downloaded instantly with a state government digital signature without visiting the municipal council office.",
    active: true,
  },
  {
    id: "faq-5",
    question: "How do I apply for a new municipal drinking water pipeline connection?",
    answer:
      "Submit an online application through the Water Supply Department section with your property 7/12 extract, tax receipt, and site plan. An engineer will conduct site inspection within 7 working days.",
    active: true,
  },
  {
    id: "faq-6",
    question: "What documents are required for Trade License renewal?",
    answer:
      "For annual trade license renewal, you require previous license copy, updated shop property tax receipt, fire safety NOC (for commercial establishments), and applicant photo ID.",
    active: true,
  },
  {
    id: "faq-7",
    question: "Where can I report illegal construction or tree felling in hill station limits?",
    answer:
      "Immediate reports can be lodged 24x7 via the Emergency Control Room at 02114-273030 or logged under the 'Town Planning & Anti-Encroachment' category on the civic portal.",
    active: true,
  },
];

const STORAGE_KEY = "lonavala_cms_faqs";

export function getFAQs(): FAQItem[] {
  if (typeof window === "undefined") {
    return INITIAL_FAQS;
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_FAQS));
      return INITIAL_FAQS;
    }
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_FAQS;
  } catch (e) {
    console.error("Error reading FAQs from localStorage:", e);
    return INITIAL_FAQS;
  }
}

export function saveFAQs(faqs: FAQItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(faqs));
  } catch (e) {
    console.error("Error saving FAQs to localStorage:", e);
  }
}

export function getFAQById(id: string): FAQItem | undefined {
  const faqs = getFAQs();
  return faqs.find((f) => f.id === id);
}

export function saveOrUpdateFAQ(faq: FAQItem): FAQItem[] {
  const faqs = getFAQs();
  const index = faqs.findIndex((f) => f.id === faq.id);
  let updated: FAQItem[];

  if (index >= 0) {
    updated = [...faqs];
    updated[index] = faq;
  } else {
    updated = [faq, ...faqs];
  }
  saveFAQs(updated);
  return updated;
}

export function deleteFAQById(id: string): FAQItem[] {
  const faqs = getFAQs();
  const updated = faqs.filter((f) => f.id !== id);
  saveFAQs(updated);
  return updated;
}

export function toggleFAQActive(id: string): FAQItem[] {
  const faqs = getFAQs();
  const updated = faqs.map((f) =>
    f.id === id ? { ...f, active: f.active === false ? true : false } : f
  );
  saveFAQs(updated);
  return updated;
}

export function resetFAQsData(): FAQItem[] {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
  return INITIAL_FAQS;
}
