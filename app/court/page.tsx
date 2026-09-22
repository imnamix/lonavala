"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Scale,
  Gavel,
  Users,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Briefcase,
  Award,
  Calendar,
  Clock,
  Download,
  FileText,
  FileCheck,
  MapPin,
  Sparkles,
  X,
  PhoneCall,
  MailCheck,
  Eye,
  Building,
  ExternalLink,
  CalendarClock,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { CourtCommitteeMember, AdalatUpdate, CourtSession } from "@/types";
import { getAllCourtMembers } from "@/lib/services/court-member.service";
import { getAllCourtProceedings } from "@/lib/services/court-proceeding.service";
import { getNextCourtSession } from "@/lib/services/court-session.service";
import { getInlineFileUrl } from "@/lib/utils";
import {
  translateBatchToMarathi,
  getCachedMarathi,
} from "@/lib/services/translate.service";

function getInitials(name: string) {
  const cleaned = name
    .replace(/^(Adv\.|Shri\.|Smt\.|Dr\.)\s+/i, "")
    .replace(/\(.*?\)/g, "")
    .trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "LM";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// -------------------------------------------------------------
// Comprehensive Marathi Translation Dictionaries & Helpers
// -------------------------------------------------------------
const DESIGNATION_MAP: Record<string, string> = {
  "Chairman, Legal & Law Committee": "सभापती, विधी व न्याय समिती",
  "Vice Chairperson & Corporator": "उपसभापती व नगरसेविका",
  "Chief Legal Advisor & Former District Judge": "मुख्य कायदेशीर सल्लागार (माजी जिल्हा न्यायाधीश)",
  "Chief Legal Advisor": "मुख्य कायदेशीर सल्लागार",
  "Committee Member & Corporator": "समिती सदस्य व नगरसेवक / नगरसेविका",
  "Chief Legal Officer & Secretary": "मुख्य विधी अधिकारी व सचिव",
  "Legal Consultant - Environmental Law": "पर्यावरण विधी सल्लागार",
  "Assistant Law Officer": "सहाय्यक विधी अधिकारी",
  "Senior Conciliator - Lok Adalat Panel": "ज्येष्ठ पॅनेल तडजोडकार (लोक अदालत)",
  "Legal Aid Counselor - Public Redressal": "विधी सहाय्य सल्लागार (नागरी निवारण)",
  "Member": "समिती सदस्य",
  "Elected Member": "समिती सदस्य",
};

const EXPERIENCE_MAP: Record<string, string> = {
  "18+ years in Municipal Law & Civil Jurisprudence": "१८+ वर्षे नगरपालिका कायदा व दिवाणी विधी क्षेत्रातील अनुभव",
  "10+ years public service & consumer arbitration": "१०+ वर्षे सार्वजनिक सेवा व ग्राहक लवाद अनुभव",
  "28+ years judicial & legal consulting experience": "२८+ वर्षे न्यायिक व कायदेशीर सल्लागार अनुभव",
  "8 years municipal governance": "८ वर्षे स्थानिक स्वराज्य संस्था प्रशासन अनुभव",
  "6 years civic governance": "६ वर्षे नागरी प्रशासन व समाजकार्य अनुभव",
  "9 years public representation": "९ वर्षे जनहित व नागरी प्रतिनिधित्व अनुभव",
  "5 years civic administration": "५ वर्षे नागरी प्रशासन अनुभव",
  "7 years local governance": "७ वर्षे स्थानिक प्रशासन अनुभव",
  "11 years public leadership": "११ वर्षे सार्वजनिक नेतृत्व व समाजसेवा अनुभव",
  "LL.M. (Constitutional Law), 14 years judicial liaison experience": "एलएल.एम. (घटनात्मक कायदा), १४ वर्षे न्यायिक समन्वय अनुभव",
  "12 years in Environmental Law & NGT Western Zone matters": "१२ वर्षे पर्यावरण कायदा व हरित लवाद कामकाज अनुभव",
  "B.S.L., LL.B., 7 years municipal law practice": "बी.एस.एल., एलएल.बी., ७ वर्षे नगरपालिका विधी सराव",
  "22 years civil mediation & arbitration": "२२ वर्षे दिवाणी मध्यस्थी व लवाद अनुभव",
  "13 years family & civic legal counseling": "१३ वर्षे कौटुंबिक व नागरी कायदेशीर समुपदेशन",
};

const RESPONSIBILITY_MAP: Record<string, string> = {
  "Presiding over municipal legal review meetings and statutory policy framing":
    "नगरपरिषद विधी आढावा बैठकांचे अध्यक्षस्थान व वैधानिक धोरण निश्चिती",
  "Evaluating legal claims, writ petitions, and high-value contractual disputes":
    "न्यायालयीन दावे, रिट याचिका व कंत्राटी विवादांचे कायदेशीर मूल्यांकन",
  "Sanctioning appeals and revisions before the Hon'ble High Court of Bombay":
    "मा. मुंबई उच्च न्यायालयात अपील व पुनर्निरीक्षण याचिका दाखल करण्यास मंजुरी",
  "Supervising Lok Adalat compromise settlements for public revenue":
    "सार्वजनिक महसूल वसुलीसाठी लोक अदालत तडजोड प्रक्रियेचे पर्यवेक्षण",
  "Review of public grievances under statutory municipal provisions":
    "वैधानिक नगरपरिषद तरतुदींनुसार नागरी तक्रारींचा विधी आढावा",
  "Coordination with Women & Child cell on legal aid and awareness":
    "महिला व बाल कल्याण कक्षासोबत विधी साहाय्य व जनजागृती समन्वय",
  "Monitoring municipal encroachment dispute resolutions":
    "नगरपरिषद अतिक्रमण विवाद निवारण प्रक्रियेचे नियंत्रण",
  "Senior counsel to President & Chief Officer on constitutional matters":
    "नगराध्यक्ष व मुख्य अधिकारी यांना घटनात्मक व कायदेशीर बाबींवर वरिष्ठ सल्ला",
  "Review of town planning bylaws and development control regulations":
    "नगररचना उपविधी व विकास नियंत्रण नियमावलीचा विधी आढावा",
  "Guidance on high-stakes arbitration and infrastructure contract litigations":
    "पायाभूत सुविधा करार व लवाद दाव्यांमध्ये कायदेशीर मार्गदर्शन",
  "Review of town planning and building permission litigations":
    "नगररचना व बांधकाम परवानगी न्यायालयीन प्रकरणांचा आढावा",
  "Public property boundary demarcation and title verification oversight":
    "सार्वजनिक मालमत्ता सीमांकन व मालकी हक्क पडताळणी देखरेख",
  "Ward-level public dispute conciliation and grievance coordination":
    "प्रभाग पातळीवरील वाद तडजोड व तक्रार निवारण समन्वय",
  "Monitoring municipal property lease agreements and rent recovery cases":
    "नगरपरिषद मालमत्ता भाडेपट्टा करार व भाडे वसुली दाव्यांवर देखरेख",
  "Oversight of public works contractual disputes and tender compliance":
    "सार्वजनिक बांधकाम कंत्राटी विवाद व निविदा कायदेशीर पूर्तता देखरेख",
  "Liaison with Khandala ward citizens for Lok Adalat camps":
    "खंडाळा प्रभागातील नागरिकांशी लोक अदालत शिबिरांसाठी संपर्क",
  "Civic amenity dispute redressal and slum regularization legal reviews":
    "नागरी सुविधा विवाद निवारण व झोपडपट्टी नियमितीकरण विधी आढावा",
  "Coordination of citizen legal awareness camps in rural/fringe wards":
    "सीमावर्ती प्रभागांत नागरी कायदेशीर जनजागृती शिबिरांचे आयोजन",
  "Water pipeline corridor right-of-way and road widening litigation review":
    "पाणीपुरवठा पाईपलाईन मार्ग व रस्ता रुंदीकरण भूसंपादन दाव्यांचा आढावा",
  "Scrutiny of commercial hoarding violations and compounding appeals":
    "व्यावसायिक जाहिरात फलक उल्लंघन व तडजोड अपीलांची छाननी",
  "Solid waste management compliance under Environmental Protection Act":
    "पर्यावरण संरक्षण कायद्यांतर्गत घनकचरा व्यवस्थापन पूर्तता देखरेख",
  "Public health bylaw enforcement litigations oversight":
    "सार्वजनिक आरोग्य उपविधी अंमलबजावणी न्यायालयीन प्रकरणांवर देखरेख",
  "Scrutinizing statutory notices under Sec. 304 of MMC Act 1965":
    "महाराष्ट्र नगरपरिषद अधिनियम १९६५ च्या कलम ३०४ अंतर्गत वैधानिक नोटिसांची छाननी",
  "Drafting written statements, counter affidavits, and caveat petitions":
    "लेखी जबाब, प्रतिज्ञापत्रे व कॅव्हीत याचिका मसुदा तयार करणे",
  "Liaison with empanelled advocates across High Court & Sub-Divisional courts":
    "उच्च न्यायालय व उपविभागीय न्यायालयांतील पॅनेल विधीज्ञांशी समन्वय",
  "Supervision of the Council's Law Branch records & digital cause lists":
    "नगरपरिषद विधी शाखा अभिलेख व डिजिटल दैनिक कामकाज यादी नियंत्रण",
  "Guiding council on National Green Tribunal and eco-sensitive zone compliances":
    "राष्ट्रीय हरित लवाद व पर्यावरण संवेदनशील क्षेत्र नियमांवर मार्गदर्शन",
  "Assisting in drafting town planning bylaws and civic standard operating procedures":
    "नगररचना उपविधी व प्रमाणित कार्यपद्धती मसुदा तयार करण्यात साहाय्य",
  "Managing court hearing dates, brief preparations, and evidence documents":
    "सुनावणी तारखांचे नियोजन, केस ब्रीफ व पुरावा कागदपत्रे संकलन",
  "Coordination with town planning engineers for site panchnama and stay reports":
    "स्थळ पंचनामा व स्थगिती आदेश अहवालासाठी नगररचना अभियंत्यांशी समन्वय",
  "Drafting RTI second appeal responses before State Information Commission":
    "राज्य माहिती आयोगासमोरील द्वितीय अपील उत्तरांचा मसुदा तयार करणे",
  "Presiding as municipal panel mediator for property tax compromise cases":
    "मालमत्ता कर तडजोड प्रकरणांसाठी पॅनेल मध्यस्थ म्हणून कामकाज",
  "Evaluating compounding fine reductions under state government schemes":
    "शासन निर्णयानुसार तडजोड दंड कपातीचे मूल्यांकन",
  "Providing free initial legal guidance to senior citizens and low-income residents":
    "ज्येष्ठ नागरिक व अल्प उत्पन्न घटकांना मोफत प्राथमिक विधी मार्गदर्शन",
  "Assisting citizens in drafting Lok Adalat compromise applications":
    "नागरिकांना लोक अदालत तडजोड अर्ज तयार करण्यात साहाय्य",
};

function translateRole(role?: string, isMr?: boolean) {
  if (!role || !isMr) return role || "Member";
  if (role === "Chairman") return "समिती सभापती";
  if (role === "Vice Chairperson") return "समिती उपसभापती";
  if (role === "Chief Legal Advisor") return "मुख्य कायदेशीर सल्लागार";
  if (role === "Chief Legal Officer") return "मुख्य विधी अधिकारी";
  if (role === "Assistant Law Officer") return "सहाय्यक विधी अधिकारी";
  if (role === "Special Invitee Consultant") return "विशेष निमंत्रित विधी सल्लागार";
  if (role === "Panel Conciliator") return "पॅनेल तडजोडकार";
  if (role === "Legal Aid Counselor") return "विधी सहाय्य सल्लागार";
  if (role === "Member" || role === "Elected Member") return "समिती सदस्य";
  return role;
}

function translateCategory(category?: string, isMr?: boolean) {
  if (!category || !isMr) return category || "Committee Member";
  if (category === "Leadership") return "समिती नेतृत्व";
  if (category === "Legal Officer") return "विधी अधिकारी";
  return "समिती सदस्य";
}

function translateDesignation(designation?: string, isMr?: boolean) {
  if (!designation || !isMr) return designation || "";
  const match = designation.match(/\(([^)]+[\u0900-\u097F]+[^)]*)\)/);
  if (match && match[1]) {
    return match[1].trim();
  }
  const cleanKey = designation.replace(/\(.*?\)/g, "").trim();
  if (DESIGNATION_MAP[cleanKey]) {
    return DESIGNATION_MAP[cleanKey];
  }
  if (DESIGNATION_MAP[designation]) {
    return DESIGNATION_MAP[designation];
  }
  return designation;
}

function translateExperience(experience?: string, isMr?: boolean) {
  if (!experience || !isMr) return experience || "";
  if (EXPERIENCE_MAP[experience]) {
    return EXPERIENCE_MAP[experience];
  }
  // Try pattern matching for generic experiences
  const match = experience.match(/(\d+)\+?\s*years(?:\s+in|\s+of)?\s*(.*)/i);
  if (match) {
    const years = match[1];
    const field = match[2].trim();
    if (EXPERIENCE_MAP[field]) return `${years}+ वर्षे ${EXPERIENCE_MAP[field]}`;
    return `${years}+ वर्षे विधी व प्रशासकीय अनुभव`;
  }
  return experience;
}

function translateResponsibility(responsibility?: string, isMr?: boolean) {
  if (!responsibility || !isMr) return responsibility || "";
  if (RESPONSIBILITY_MAP[responsibility]) {
    return RESPONSIBILITY_MAP[responsibility];
  }
  // Search partial matches
  for (const [en, mr] of Object.entries(RESPONSIBILITY_MAP)) {
    if (responsibility.toLowerCase().includes(en.toLowerCase())) {
      return mr;
    }
  }
  return responsibility;
}

function translateStatus(status?: string, isMr?: boolean) {
  if (!status || !isMr) return status || "Scheduled";
  switch (status) {
    case "Minutes Published":
      return "इतिवृत्त प्रसिद्ध";
    case "Completed":
    case "Concluded":
      return "पूर्ण झाले";
    case "Order Passed":
      return "आदेश पारित";
    case "In Progress":
      return "सुनावणी सुरू";
    case "Scheduled":
    case "Upcoming":
      return "आगामी सुनावणी";
    case "Adjourned":
      return "स्थगित";
    default:
      return status;
  }
}

function translateForum(forum?: string, isMr?: boolean) {
  if (!forum || !isMr) return forum || "";
  if (forum.includes("Bombay High Court") || forum.includes("High Court of Bombay")) {
    if (forum.includes("Court Room 14") || forum.includes("Annexe")) {
      return "मा. मुंबई उच्च न्यायालय (न्यायालय कक्ष १४, फोर्ट, मुंबई)";
    }
    return "मा. मुंबई उच्च न्यायालय (प्रधान खंडपीठ, मुंबई)";
  }
  if (forum.includes("National Green Tribunal") || forum.includes("NGT")) {
    return "मा. राष्ट्रीय हरित लवाद (पश्चिम विभाग खंडपीठ, पुणे)";
  }
  if (forum.includes("Lok Adalat") || forum.includes("LMC Main") || forum.includes("Main Conference")) {
    return "राष्ट्रीय महा लोक अदालत (लोणावळा नगरपरिषद सभागृह)";
  }
  if (forum.includes("Vadgaon Maval") || forum.includes("Civil Court") || forum.includes("Taluka Court")) {
    return "दिवाणी न्यायालय संकुल, वडगाव मावळ, पुणे";
  }
  if (forum.includes("Consumer")) {
    return "जिल्हा ग्राहक तक्रार निवारण आयोग संकुल, पुणे";
  }
  return forum;
}

function translateBench(bench?: string, isMr?: boolean) {
  if (!bench || !isMr) return bench || "";
  if (bench.includes("Division Bench")) {
    if (bench.includes("03") || bench.includes("3")) return "मा. खंडपीठ (न्यायालय कक्ष ०३, मुंबई)";
    return "मा. खंडपीठ (न्यायालय कक्ष १४)";
  }
  if (bench.includes("Judicial & Expert") || bench.includes("NGT")) return "मा. न्यायिक व तज्ज्ञ सदस्य (न्यायालय कक्ष १)";
  if (bench.includes("Rajesh Deshmukh")) return "मा. दिवाणी न्यायाधीश (वडगाव मावळ) व अ‍ॅड. राजेश देशमुख";
  if (bench.includes("Civil Judge")) return "मा. दिवाणी न्यायाधीश वरिष्ठ स्तर व पॅनेल तडजोडकार";
  if (bench.includes("Consumer Commission")) return "मा. अध्यक्ष व सदस्य, जिल्हा ग्राहक आयोग पुणे";
  return bench;
}

function translateWard(ward?: string, isMr?: boolean) {
  if (!ward || !isMr) return ward || "";
  return ward
    .replace(/Ward\s*0?1\s*-\s*/i, "प्रभाग ०१ - ")
    .replace(/Ward\s*0?2\s*-\s*Khandala/i, "प्रभाग ०२ - खंडाळा")
    .replace(/Ward\s*0?4\s*-\s*Ryewood/i, "प्रभाग ०४ - रायवूड")
    .replace(/Ward\s*0?5\s*-\s*Thombrewadi/i, "प्रभाग ०५ - ठोंबरेवाडी")
    .replace(/Ward\s*0?7\s*-\s*Gavthan/i, "प्रभाग ०७ - गावठाण")
    .replace(/Ward\s*0?9\s*-\s*Bhangarwadi/i, "प्रभाग ०९ - भांगरवाडी")
    .replace(/Ward\s*11\s*-\s*Varsoli/i, "प्रभाग ११ - वरसोली")
    .replace(/Ward\s*12\s*-\s*Valvan/i, "प्रभाग १२ - वळवण")
    .replace(/Ward\s*15\s*-\s*Nangargaon/i, "प्रभाग १५ - नांगरगाव")
    .replace(/Ward\s+(\d+)\s*-\s*/i, "प्रभाग $1 - ")
    .replace(/LMC Administrative Headquarters/i, "लो.न.प. प्रशासकीय मुख्यालय")
    .replace(/Administrative Headquarters/i, "प्रशासकीय मुख्यालय")
    .replace(/Appointed Judicial Expert/i, "नियुक्त न्यायिक तज्ज्ञ")
    .replace(/Empanelled Expert/i, "मान्यताप्राप्त विधी तज्ज्ञ")
    .replace(/Legal Department,\s*2nd Floor/i, "विधी विभाग, दुसरा मजला")
    .replace(/Lok Adalat Bench Room/i, "लोक अदालत कक्ष")
    .replace(/Citizen Facilitation Center/i, "नागरी सुविधा केंद्र");
}

function formatMarathiDate(dateStr?: string, isMr?: boolean) {
  if (!dateStr || !isMr) return dateStr || "";
  const monthMap: Record<string, string> = {
    January: "जानेवारी",
    February: "फेब्रुवारी",
    March: "मार्च",
    April: "एप्रिल",
    May: "मे",
    June: "जून",
    July: "जुलै",
    August: "ऑगस्ट",
    September: "सप्टेंबर",
    October: "ऑक्टोबर",
    November: "नोव्हेंबर",
    December: "डिसेंबर",
  };
  let result = dateStr;
  for (const [en, mr] of Object.entries(monthMap)) {
    result = result.replace(new RegExp(en, "gi"), mr);
  }
  return result;
}

function formatMarathiTime(timeStr?: string, isMr?: boolean) {
  if (!timeStr || !isMr) return timeStr || "";
  return timeStr
    .replace(/AM/gi, "सकाळी")
    .replace(/PM/gi, "दुपारी")
    .replace(/(\d+):(\d+)/g, "$1:$2 वा.");
}

function MemberAvatar({
  name,
  image,
  sizeClass = "w-16 h-16",
  bgGradient = "from-slate-800 to-slate-900",
  textClass = "text-lg font-bold",
}: {
  name: string;
  image?: string;
  sizeClass?: string;
  bgGradient?: string;
  textClass?: string;
}) {
  const [imgError, setImgError] = useState(false);

  if (image && !imgError) {
    return (
      <div
        className={`relative ${sizeClass} rounded-2xl overflow-hidden shadow-xs border border-white ring-1 ring-slate-200 shrink-0 bg-slate-100`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-2xl bg-gradient-to-br ${bgGradient} text-white flex items-center justify-center ${textClass} shrink-0 shadow-xs border border-white ring-1 ring-slate-200`}
    >
      {getInitials(name)}
    </div>
  );
}

function CourtMemberDialog({
  member,
  onClose,
  isMr,
}: {
  member: CourtCommitteeMember;
  onClose: () => void;
  isMr: boolean;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose]);

  const displayName = isMr && member.marathiName ? member.marathiName : member.name;
  const secondaryName = isMr && member.marathiName ? member.name : member.marathiName;
  const displayDesignation = translateDesignation(member.designation, isMr);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="court-member-modal-title"
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-2xl border border-white/20 flex flex-col sm:flex-row animate-in zoom-in-95 duration-200">
        {/* Floating Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label={isMr ? "माहिती बंद करा" : "Close member details"}
          className="absolute right-4 top-4 z-30 rounded-full bg-white/90 p-2 text-slate-600 shadow-md backdrop-blur-xs transition-all hover:bg-red-50 hover:text-red-600 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Left Column: Member Photo / Avatar */}
        <div className="relative w-full sm:w-72 bg-gradient-to-b from-slate-50 to-emerald-50/40 border-b sm:border-b-0 sm:border-r border-slate-100 shrink-0 flex flex-col items-center justify-center p-6 sm:p-8">
          <div className="relative w-40 h-48 sm:w-52 sm:h-64 rounded-2xl overflow-hidden shadow-lg border-4 border-white ring-1 ring-emerald-200/80 bg-white">
            <MemberAvatar
              name={member.name}
              image={member.image}
              sizeClass="w-full h-full"
              bgGradient={
                member.role === "Chairman"
                  ? "from-emerald-700 to-teal-800"
                  : member.category === "Legal Officer"
                    ? "from-slate-800 to-slate-900"
                    : "from-emerald-700 to-teal-800"
              }
              textClass="text-4xl font-extrabold"
            />
          </div>

          <div className="mt-3.5 flex flex-wrap gap-1.5 justify-center">
            <span
              className={`inline-flex items-center gap-1 rounded-full text-xs font-bold px-3 py-1 border shadow-2xs ${
                member.role === "Chairman"
                  ? "bg-emerald-700 text-white border-emerald-600"
                  : member.category === "Legal Officer"
                    ? "bg-purple-100 text-purple-900 border-purple-200"
                    : "bg-emerald-100 text-emerald-900 border-emerald-200"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{translateRole(member.role, isMr)}</span>
            </span>
          </div>
        </div>

        {/* Right Column: Member Details Content */}
        <div className="flex-1 p-6 sm:p-8 overflow-y-auto max-h-[60vh] sm:max-h-[85vh] space-y-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-0.5 text-xs font-bold text-emerald-800">
                <Scale className="w-3 h-3" />
                <span>{translateCategory(member.category, isMr)}</span>
              </span>

              {member.ward && (
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-0.5 text-xs font-semibold text-slate-700">
                  <MapPin className="w-3 h-3 text-emerald-600" />
                  <span>{translateWard(member.ward, isMr)}</span>
                </span>
              )}
            </div>

            <h3
              id="court-member-modal-title"
              className="text-2xl font-black text-slate-900 tracking-tight"
            >
              {displayName}
            </h3>

            {secondaryName && (
              <p className="text-sm font-semibold text-emerald-700 mt-0.5">
                {secondaryName}
              </p>
            )}

            <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{displayDesignation}</span>
            </p>
          </div>

          {/* Details list */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            {member.experience && (
              <div className="flex items-start gap-2.5 p-2.5 rounded-2xl bg-emerald-50/50 border border-emerald-100/80 text-xs text-slate-700">
                <Award className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    {isMr ? "अनुभव / पात्रता" : "Experience & Standing"}
                  </span>
                  <span className="font-semibold text-emerald-950">
                    {translateExperience(member.experience, isMr)}
                  </span>
                </div>
              </div>
            )}

            {/* Direct Contact Links */}
            {member.phone && (
              <a
                href={`tel:${member.phone}`}
                className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 hover:bg-emerald-50/80 border border-slate-100 hover:border-emerald-200 text-xs text-slate-700 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white shadow-2xs shrink-0 transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                      {isMr ? "अधिकृत दूरध्वनी" : "Official Phone"}
                    </span>
                    <span className="font-bold text-slate-900 group-hover:text-emerald-800">
                      {member.phone}
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px] group-hover:bg-emerald-700 transition-colors flex items-center gap-1 shrink-0">
                  <PhoneCall className="w-3 h-3" />
                  {isMr ? "कॉल करा" : "Call"}
                </span>
              </a>
            )}

            {member.email && (
              <a
                href={`mailto:${member.email}`}
                className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 hover:bg-emerald-50/80 border border-slate-100 hover:border-emerald-200 text-xs text-slate-700 transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white shadow-2xs shrink-0 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                      {isMr ? "ईमेल संपर्क" : "Email Address"}
                    </span>
                    <span className="font-bold text-slate-900 group-hover:text-emerald-800 truncate block">
                      {member.email}
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-slate-200 text-slate-700 font-bold text-[11px] group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0 flex items-center gap-1">
                  <MailCheck className="w-3 h-3" />
                  {isMr ? "ईमेल पाठवा" : "Email"}
                </span>
              </a>
            )}
          </div>

          {/* Responsibilities list */}
          {member.responsibilities && member.responsibilities.length > 0 && (
            <div className="pt-3 border-t border-slate-100">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-800 mb-2">
                {isMr
                  ? "समिती कार्यकक्षा व जबाबदाऱ्या:"
                  : "Core Committee Responsibilities:"}
              </h4>
              <div className="space-y-1.5">
                {member.responsibilities.map((resp, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50/80 p-2 rounded-xl border border-slate-100"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{translateResponsibility(resp, isMr)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CourtProceedingDialog({
  proceeding,
  onClose,
  isMr,
  autoTranslations = {},
}: {
  proceeding: AdalatUpdate;
  onClose: () => void;
  isMr: boolean;
  autoTranslations?: Record<string, string>;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose]);

  const translatedSubject =
    proceeding.marathiSubject ||
    autoTranslations[proceeding.subject] ||
    getCachedMarathi(proceeding.subject) ||
    proceeding.subject;

  const translatedDescription =
    proceeding.marathiDescription ||
    autoTranslations[proceeding.description] ||
    getCachedMarathi(proceeding.description) ||
    proceeding.description;

  const translatedMinutes =
    proceeding.marathiMinutes ||
    autoTranslations[proceeding.minutes] ||
    getCachedMarathi(proceeding.minutes) ||
    proceeding.minutes;

  const displaySubject = isMr ? translatedSubject : proceeding.subject;
  const secondarySubject = isMr
    ? proceeding.subject
    : proceeding.marathiSubject ||
      autoTranslations[proceeding.subject] ||
      getCachedMarathi(proceeding.subject);

  const displayDescription = isMr ? translatedDescription : proceeding.description;
  const displayMinutes = isMr ? translatedMinutes : proceeding.minutes;
  const displayBench = translateBench(proceeding.benchOfficers, isMr);
  const displayVenue = translateForum(proceeding.venue, isMr);

  const getStatusBadgeClass = (status?: string) => {
    switch (status) {
      case "Minutes Published":
        return "bg-emerald-100 text-emerald-900 border-emerald-200";
      case "Completed":
      case "Concluded":
        return "bg-blue-100 text-blue-900 border-blue-200";
      case "Order Passed":
        return "bg-teal-100 text-teal-900 border-teal-200";
      case "In Progress":
        return "bg-purple-100 text-purple-900 border-purple-200";
      default:
        return "bg-amber-100 text-amber-900 border-amber-200";
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="court-proceeding-modal-title"
    >
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-2xl border border-white/20 flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="relative p-6 sm:p-7 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-emerald-50/40 flex items-start justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border ${getStatusBadgeClass(
                  proceeding.status
                )}`}
              >
                {translateStatus(proceeding.status, isMr)}
              </span>

              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-2xs">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>{formatMarathiDate(proceeding.date, isMr)}</span>
              </span>

              {proceeding.fileSize && (
                <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                  PDF • {proceeding.fileSize}
                </span>
              )}
            </div>

            <h3
              id="court-proceeding-modal-title"
              className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug"
            >
              {displaySubject}
            </h3>

            {secondarySubject && (
              <p className="text-xs sm:text-sm font-semibold text-emerald-700">
                {secondarySubject}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={isMr ? "माहिती बंद करा" : "Close case details"}
            className="rounded-full bg-white p-2 text-slate-600 shadow-md transition-all hover:bg-red-50 hover:text-red-600 hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 sm:p-7 overflow-y-auto max-h-[65vh] space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
          {/* Bench & Venue Info Cards */}
          {(proceeding.benchOfficers || proceeding.venue) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {proceeding.benchOfficers && (
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100/70 text-emerald-800 flex items-center justify-center shrink-0">
                    <Gavel className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      {isMr ? "मा. न्यायपीठ / अधिकारी" : "Presiding Bench / Officers"}
                    </span>
                    <span className="font-bold text-slate-900 leading-snug block mt-0.5">
                      {displayBench}
                    </span>
                  </div>
                </div>
              )}

              {proceeding.venue && (
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="w-8 h-8 rounded-xl bg-teal-100/70 text-teal-800 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      {isMr ? "सुनावणी ठिकाण / न्यायालय" : "Hearing Venue / Court Hall"}
                    </span>
                    <span className="font-bold text-slate-900 leading-snug block mt-0.5">
                      {displayVenue}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Description / Case Fact Overview */}
          {displayDescription && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-700" />
                <span>{isMr ? "प्रकरणाचा संक्षिप्त तपशील व पार्श्वभूमी" : "Case Matter & Fact Background"}</span>
              </h4>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-slate-800 leading-relaxed font-normal">
                {displayDescription}
              </div>
            </div>
          )}

          {/* Minutes & Directions */}
          {displayMinutes && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-emerald-700" />
                <span>{isMr ? "सुनावणी कार्यवृत्त व न्यायालयीन निर्देश" : "Hearing Minutes & Bench Directions"}</span>
              </h4>
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100/90 text-emerald-950 font-medium leading-relaxed">
                {displayMinutes}
              </div>
            </div>
          )}
        </div>

        {/* Footer Bar: Actions */}
        <div className="p-5 sm:p-6 border-t border-slate-100 bg-slate-50/75 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500 font-mono">
            {proceeding.fileSize
              ? `${isMr ? "अधिकृत विधी नोंद" : "Official Record"} (${proceeding.fileSize})`
              : isMr
                ? "लोणावळा नगरपरिषद अधिकृत विधी नोंद"
                : "LMC Legal Record"}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              {isMr ? "बंद करा" : "Close"}
            </button>

            {proceeding.pdfUrl && (
              <a
                href={getInlineFileUrl(proceeding.pdfUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-transform hover:scale-102 active:scale-95 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{isMr ? "अधिकृत आदेश उघडा (PDF)" : "Open Certified Order"}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CourtMembersSkeleton() {
  return (
    <div className="space-y-12 animate-pulse">
      {/* 1. Leadership Section Skeleton */}
      <div className="space-y-6">
        <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-7 w-64 bg-slate-200 rounded-lg" />
            <div className="h-4 w-96 bg-slate-100 rounded-md" />
          </div>
          <div className="h-6 w-20 bg-slate-100 rounded-full" />
        </div>

        {/* Chairman Spotlight Card Skeleton */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex gap-2">
              <div className="h-6 w-36 bg-emerald-100/70 rounded-full" />
              <div className="h-6 w-24 bg-slate-100 rounded-full" />
            </div>
            <div className="h-6 w-28 bg-slate-100 rounded-full" />
          </div>

          <div className="flex flex-col sm:flex-row gap-6 items-center">
            <div className="w-28 h-28 sm:w-36 sm:h-36 bg-slate-200 rounded-2xl shrink-0" />
            <div className="space-y-3 flex-1 w-full">
              <div className="h-7 w-56 bg-slate-200 rounded-lg" />
              <div className="h-4 w-40 bg-emerald-100/60 rounded-md" />
              <div className="h-4 w-48 bg-slate-100 rounded-md" />
              <div className="h-6 w-32 bg-slate-100 rounded-lg" />
              <div className="flex gap-3 pt-2">
                <div className="h-8 w-28 bg-slate-100 rounded-xl" />
                <div className="h-8 w-36 bg-slate-100 rounded-xl" />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="h-10 bg-slate-50 rounded-xl border border-slate-100" />
            <div className="h-10 bg-slate-50 rounded-xl border border-slate-100" />
          </div>
        </div>

        {/* Other Leadership Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
              <div className="flex justify-between pb-3 border-b border-slate-100">
                <div className="h-5 w-24 bg-slate-100 rounded-full" />
                <div className="h-5 w-16 bg-slate-100 rounded-full" />
              </div>
              <div className="flex gap-4 items-center">
                <div className="w-20 h-20 bg-slate-200 rounded-2xl shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-5 w-36 bg-slate-200 rounded-lg" />
                  <div className="h-3.5 w-28 bg-emerald-100/60 rounded-md" />
                  <div className="h-3.5 w-32 bg-slate-100 rounded-md" />
                </div>
              </div>
              <div className="h-8 bg-slate-50 rounded-xl" />
              <div className="pt-3 border-t border-slate-100 flex justify-between">
                <div className="h-4 w-24 bg-slate-100 rounded-md" />
                <div className="h-4 w-16 bg-slate-100 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Committee Members Grid Skeleton */}
      <div className="space-y-6">
        <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-7 w-52 bg-slate-200 rounded-lg" />
            <div className="h-4 w-80 bg-slate-100 rounded-md" />
          </div>
          <div className="h-6 w-20 bg-slate-100 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
              <div className="flex justify-between">
                <div className="h-5 w-20 bg-slate-100 rounded-full" />
                <div className="h-5 w-16 bg-slate-100 rounded-full" />
              </div>
              <div className="flex gap-3.5 items-center">
                <div className="w-16 h-16 bg-slate-200 rounded-2xl shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-32 bg-slate-200 rounded-md" />
                  <div className="h-3 w-24 bg-slate-100 rounded-md" />
                  <div className="h-3 w-28 bg-slate-100 rounded-md" />
                </div>
              </div>
              <div className="h-6 bg-slate-50 rounded-md" />
              <div className="pt-3 border-t border-slate-100 flex justify-between">
                <div className="h-4 w-20 bg-slate-100 rounded-md" />
                <div className="h-4 w-12 bg-slate-100 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProceedingsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4"
        >
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
            <div className="h-5 w-24 bg-slate-200 rounded-full" />
            <div className="h-5 w-28 bg-slate-100 rounded-full" />
          </div>
          <div className="space-y-2">
            <div className="h-5 w-3/4 bg-slate-200 rounded-md" />
            <div className="h-4 w-full bg-slate-100 rounded-md" />
            <div className="h-4 w-5/6 bg-slate-100 rounded-md" />
          </div>
          <div className="h-16 bg-slate-50 rounded-xl border border-slate-100 p-3" />
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="h-4 w-20 bg-slate-100 rounded-md" />
            <div className="h-8 w-28 bg-slate-200 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CourtPage() {
  const { language } = useLanguage();
  const isMr = language === "mr";
  const isHi = language === "hi";

  const [activeTab, setActiveTab] = useState<"members" | "proceedings">("members");
  const [members, setMembers] = useState<CourtCommitteeMember[]>([]);
  const [proceedings, setProceedings] = useState<AdalatUpdate[]>([]);
  const [nextSession, setNextSession] = useState<CourtSession | null>(null);
  const [selectedMember, setSelectedMember] = useState<CourtCommitteeMember | null>(null);
  const [selectedProceeding, setSelectedProceeding] = useState<AdalatUpdate | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingProceedings, setLoadingProceedings] = useState(true);
  const [autoTranslations, setAutoTranslations] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadData() {
      try {
        const [membersData, proceedingsData, sessionData] = await Promise.all([
          getAllCourtMembers(),
          getAllCourtProceedings(),
          getNextCourtSession(),
        ]);
        if (membersData && membersData.length > 0) {
          setMembers(membersData);
        }
        if (proceedingsData && proceedingsData.length > 0) {
          setProceedings(proceedingsData);
        }
        if (sessionData) {
          setNextSession(sessionData);
        }
      } catch (err) {
        console.error("Failed to load court page data:", err);
      } finally {
        setLoading(false);
        setLoadingProceedings(false);
      }
    }
    loadData();
  }, []);

  // Auto-translate proceedings & next session to Marathi when marathi translation is not provided
  useEffect(() => {
    if (!isMr) return;

    const textsToTranslate: string[] = [];

    proceedings.forEach((p) => {
      if (!p.marathiSubject && p.subject && !getCachedMarathi(p.subject)) {
        textsToTranslate.push(p.subject);
      }
      if (!p.marathiDescription && p.description && !getCachedMarathi(p.description)) {
        textsToTranslate.push(p.description);
      }
      if (!p.marathiMinutes && p.minutes && !getCachedMarathi(p.minutes)) {
        textsToTranslate.push(p.minutes);
      }
    });

    if (nextSession) {
      if (
        !nextSession.marathiSessionTitle &&
        nextSession.sessionTitle &&
        !getCachedMarathi(nextSession.sessionTitle)
      ) {
        textsToTranslate.push(nextSession.sessionTitle);
      }
      if (
        !nextSession.marathiSessionAgenda &&
        nextSession.sessionAgenda &&
        !getCachedMarathi(nextSession.sessionAgenda)
      ) {
        textsToTranslate.push(nextSession.sessionAgenda);
      }
    }

    if (textsToTranslate.length === 0) return;

    const uniqueTexts = Array.from(new Set(textsToTranslate));

    translateBatchToMarathi(uniqueTexts)
      .then((translatedList) => {
        if (Array.isArray(translatedList)) {
          const newMap: Record<string, string> = {};
          uniqueTexts.forEach((orig, idx) => {
            if (translatedList[idx]) {
              newMap[orig] = translatedList[idx];
            }
          });
          setAutoTranslations((prev) => ({ ...prev, ...newMap }));
        }
      })
      .catch((err) => {
        console.warn("Failed to auto-translate court data to Marathi:", err);
      });
  }, [proceedings, nextSession, isMr]);

  const chairman = members.find((m) => m.role === "Chairman");
  const otherLeadership = members.filter(
    (m) => m.category === "Leadership" && m.role !== "Chairman"
  );
  const committeeMembers = members.filter(
    (m) => m.id !== chairman?.id && !otherLeadership.some((ol) => ol.id === m.id)
  );

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Header Banner */}
      <div className="relative bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white border-b border-emerald-800/40 overflow-hidden">
        {/* Decorative Background Glows */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          {/* Left Column: Heading & Description */}
          <div className="max-w-2xl space-y-3">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-300/80 mb-4">
              <Link href="/" className="hover:text-white transition-colors">
                {isMr ? "मुख्यपृष्ठ" : isHi ? "मुख्यपृष्ठ" : "Home"}
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/council" className="hover:text-white transition-colors">
                {isMr ? "नगरपरिषद" : isHi ? "नगरपरिषद" : "Council"}
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-white font-semibold">
                {isMr
                  ? "मा. उच्च न्यायालय समिती"
                  : isHi
                    ? "मा. उच्च न्यायालय समिति"
                    : "Hon. High Court Committee"}
              </span>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-bold tracking-wide">
              <Scale className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {isMr
                  ? "विधी व न्यायालयीन विभाग • लोणावळा नगरपरिषद"
                  : isHi
                    ? "विधि एवं न्यायिक प्रभाग • लोनावला नगरपरिषद"
                    : "Legal Affairs & Judicial Cell • Lonavala Municipal Council"}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              {isMr
                ? "मा. उच्च न्यायालय समिती"
                : isHi
                  ? "मा. उच्च न्यायालय समिति"
                  : "Hon. High Court Committee"}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light">
              {isMr
                ? "लोणावळा नगरपरिषदेच्या वतीने मा. उच्च न्यायालय व विविध न्यायालयांतील दावे, वैधानिक विधी कामकाज, सल्लागार व तडजोड प्रक्रियेचे नियोजन करणारी समिती."
                : isHi
                  ? "लोनावला नगरपरिषद की ओर से मा. उच्च न्यायालय और विभिन्न न्यायालयों में न्यायिक कार्य, वैधानिक कानूनी सलाहकार एवं विवाद निवारण समिति।"
                  : "Statutory municipal oversight of judicial litigations, Hon. High Court proceedings, legal governance, civic dispute conciliation, and advisory for Lonavala Municipal Council."}
            </p>
          </div>

          {/* Right Column (Bottom Right): Next Hearing Session Card */}
          {nextSession && (
            <div className="w-full lg:w-96 shrink-0 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 sm:p-6 text-white shadow-2xl space-y-4 ring-1 ring-white/15 animate-in fade-in slide-in-from-bottom-3 duration-300">
              <div className="flex items-center justify-between pb-3 border-b border-white/15">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-500/25 text-emerald-300 border border-emerald-400/30">
                    <CalendarClock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 block">
                      {isMr ? "पुढील सुनावणी / सत्र" : "Next Hearing Session"}
                    </span>
                    <span className="text-xs font-bold text-white block">
                      {isMr ? "न्यायालयीन कामकाज वेळापत्रक" : "Court Schedule"}
                    </span>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>
                    {translateStatus(nextSession.status, isMr)}
                  </span>
                </span>
              </div>

              {/* Session Title */}
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-white leading-snug line-clamp-2">
                  {isMr && nextSession.marathiSessionTitle
                    ? nextSession.marathiSessionTitle
                    : isMr
                      ? (autoTranslations[nextSession.sessionTitle] ||
                          getCachedMarathi(nextSession.sessionTitle) ||
                          nextSession.sessionTitle)
                      : nextSession.sessionTitle}
                </h3>
                {nextSession.courtForum && (
                  <p className="text-[11px] font-medium text-emerald-200/90 truncate mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{translateForum(nextSession.courtForum, isMr)}</span>
                  </p>
                )}
              </div>

              {/* Date and Time Info Grid */}
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-black/25 border border-white/10">
                  <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-slate-300 uppercase block tracking-wider">
                      {isMr ? "तारीख" : "Date"}
                    </span>
                    <span className="font-extrabold text-white text-xs truncate block mt-0.5">
                      {formatMarathiDate(nextSession.hearingDate, isMr)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-black/25 border border-white/10">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-slate-300 uppercase block tracking-wider">
                      {isMr ? "वेळ" : "Time"}
                    </span>
                    <span className="font-extrabold text-white text-xs truncate block mt-0.5">
                      {formatMarathiTime(nextSession.time || "11:00 AM", isMr)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Optional Notice Doc Link */}
              {nextSession.noticePdfUrl && (
                <a
                  href={getInlineFileUrl(nextSession.noticePdfUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl bg-emerald-600/80 hover:bg-emerald-600 text-white font-bold text-[11px] shadow-sm transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isMr ? "सत्र सूचना पत्र उघडा (PDF)" : "View Hearing Notice"}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 space-y-10">
        {/* Navigation Tabs (Above Committee Leadership & Advisory) */}
        <div className="flex items-center gap-2 sm:gap-3 border-b border-slate-200 pb-4 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab("members")}
            className={`inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
              activeTab === "members"
                ? "bg-emerald-700 text-white shadow-md shadow-emerald-700/25 ring-2 ring-emerald-700/20"
                : "bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/90 shadow-2xs"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>
              {isMr
                ? "समिती सदस्य"
                : "Court Committee Members (समिती सदस्य)"}
            </span>
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full font-mono font-bold ${
                activeTab === "members"
                  ? "bg-white/20 text-white"
                  : "bg-slate-100 text-slate-600 border border-slate-200"
              }`}
            >
              {members.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("proceedings")}
            className={`inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
              activeTab === "proceedings"
                ? "bg-emerald-700 text-white shadow-md shadow-emerald-700/25 ring-2 ring-emerald-700/20"
                : "bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/90 shadow-2xs"
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>
              {isMr
                ? "न्यायालयीन कामकाज व आदेश"
                : "Court Proceedings & Orders (न्यायालयीन कामकाज)"}
            </span>
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full font-mono font-bold ${
                activeTab === "proceedings"
                  ? "bg-white/20 text-white"
                  : "bg-slate-100 text-slate-600 border border-slate-200"
              }`}
            >
              {proceedings.length}
            </span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: COURT COMMITTEE MEMBERS */}
        {/* ========================================================= */}
        {activeTab === "members" && (
          <div className="space-y-14 animate-in fade-in duration-200">
            {loading && members.length === 0 ? (
              <CourtMembersSkeleton />
            ) : members.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3 text-center">
                <Users className="w-12 h-12 text-slate-300" />
                <h3 className="text-lg font-bold text-slate-700">
                  {isMr ? "कोणतेही सदस्य आढळले नाहीत" : "No committee members found"}
                </h3>
                <p className="text-xs text-slate-500 max-w-sm">
                  {isMr
                    ? "सध्या विधी समिती सदस्य उपलब्ध नाहीत."
                    : "No committee members are currently published."}
                </p>
              </div>
            ) : (
              <>
                {/* 1. COMMITTEE CHAIRMAN & LEADERSHIP */}
                <section className="space-y-6">
                  <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                        {isMr
                          ? "समिती नेतृत्व व सल्लागार"
                          : "Committee Leadership & Advisory"}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                        {isMr
                          ? "विधी समितीचे सभापती, उपसभापती व मुख्य कायदेशीर सल्लागार"
                          : "Designated leadership heading municipal legal affairs and statutory counsel"}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      {isMr ? "समिती नेतृत्व" : "Leadership"}
                    </span>
                  </div>

                  {/* Chairman Spotlight Card */}
                  {chairman && (
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedMember(chairman)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelectedMember(chairman);
                        }
                      }}
                      className="bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/40 rounded-3xl border-2 border-emerald-600/50 p-5 sm:p-7 shadow-sm hover:shadow-xl hover:border-emerald-600 transition-all duration-300 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
                      aria-label={`View details for ${chairman.name}`}
                    >
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-4 mb-4 border-b border-emerald-100/90">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-700 text-white text-xs font-bold shadow-2xs">
                            <Award className="w-3.5 h-3.5" />
                            <span>
                              {translateRole(chairman.role, isMr)}
                            </span>
                          </span>
                          {chairman.ward && (
                            <span className="text-xs font-semibold text-emerald-900 bg-emerald-100/90 px-3 py-1 rounded-full border border-emerald-200">
                              {translateWard(chairman.ward, isMr)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-500 bg-white/90 px-3 py-1 rounded-full border border-slate-200">
                            {isMr ? "कालावधी २०२४ - २०२९" : "Tenure 2024 - 2029"}
                          </span>
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-100/60 px-2.5 py-1 rounded-full border border-emerald-200/80 group-hover:bg-emerald-600 group-hover:text-white transition-colors flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            <span>{isMr ? "तपशील" : "View"}</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-5 sm:gap-7 items-start sm:items-center">
                        <div className="shrink-0">
                          <MemberAvatar
                            name={chairman.name}
                            image={chairman.image}
                            sizeClass="w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40"
                            bgGradient="from-emerald-700 to-teal-800"
                            textClass="font-black text-3xl sm:text-4xl ring-4 ring-emerald-200"
                          />
                        </div>
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight group-hover:text-emerald-800 transition-colors">
                            {isMr && chairman.marathiName ? chairman.marathiName : chairman.name}
                          </h3>
                          {chairman.marathiName && !isMr && (
                            <p className="text-sm sm:text-base font-bold text-emerald-700">
                              {chairman.marathiName}
                            </p>
                          )}
                          <p className="text-xs sm:text-sm text-slate-600 font-medium">
                            {translateDesignation(chairman.designation, isMr)}
                          </p>
                          {chairman.experience && (
                            <div className="pt-1">
                              <span className="text-xs font-semibold text-emerald-950 bg-emerald-100/80 inline-block px-3 py-1 rounded-lg border border-emerald-200/70">
                                {translateExperience(chairman.experience, isMr)}
                              </span>
                            </div>
                          )}

                          <div className="flex flex-wrap gap-2.5 pt-2 text-xs">
                            {chairman.phone && (
                              <a
                                href={`tel:${chairman.phone}`}
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 font-semibold text-slate-700 hover:text-emerald-700 hover:border-emerald-300 transition-colors shadow-2xs text-xs"
                              >
                                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                                <span>{chairman.phone}</span>
                              </a>
                            )}
                            {chairman.email && (
                              <a
                                href={`mailto:${chairman.email}`}
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 font-medium text-slate-600 hover:text-emerald-700 hover:border-emerald-300 transition-colors shadow-2xs text-xs"
                              >
                                <Mail className="w-3.5 h-3.5 text-emerald-600" />
                                <span>{chairman.email}</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                      {chairman.responsibilities && chairman.responsibilities.length > 0 && (
                        <div className="mt-4 pt-3.5 border-t border-emerald-100/90">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-[11px] font-bold uppercase tracking-wider text-emerald-900">
                              {isMr
                                ? "मुख्य जबाबदाऱ्या व कार्यक्षेत्र:"
                                : "Core Committee Mandates & Portfolio:"}
                            </h4>
                            <span className="text-[11px] font-bold text-emerald-700 group-hover:underline">
                              {isMr ? "सर्व तपशील पहा →" : "Click to view full profile →"}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {chairman.responsibilities.slice(0, 4).map((resp, idx) => (
                              <div
                                key={idx}
                                className="flex items-start gap-2 text-xs text-slate-700 bg-white/95 p-2 rounded-lg border border-emerald-100/80 shadow-2xs leading-snug"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span>{translateResponsibility(resp, isMr)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Other Leadership Cards (Vice Chairperson & Chief Legal Advisor) */}
                  {otherLeadership.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {otherLeadership.map((member) => (
                        <div
                          key={member.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => setSelectedMember(member)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setSelectedMember(member);
                            }
                          }}
                          className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs hover:border-emerald-600 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
                          aria-label={`View details for ${member.name}`}
                        >
                          <div className="space-y-4">
                            <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
                              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                                {translateRole(member.role, isMr)}
                              </span>
                              {member.ward && (
                                <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                                  {translateWard(member.ward, isMr)}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-4">
                              <MemberAvatar
                                name={member.name}
                                image={member.image}
                                sizeClass="w-20 h-20 sm:w-24 sm:h-24"
                                bgGradient="from-slate-800 to-slate-900"
                                textClass="font-bold text-xl ring-2 ring-slate-200"
                              />
                              <div className="min-w-0 flex-1">
                                <h4 className="text-lg font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                                  {isMr && member.marathiName ? member.marathiName : member.name}
                                </h4>
                                {member.marathiName && !isMr && (
                                  <p className="text-xs font-semibold text-emerald-700 mt-0.5">
                                    {member.marathiName}
                                  </p>
                                )}
                                <p className="text-xs text-slate-500 font-medium mt-1">
                                  {translateDesignation(member.designation, isMr)}
                                </p>
                              </div>
                            </div>

                            {member.experience && (
                              <div className="text-[11px] font-semibold text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                {translateExperience(member.experience, isMr)}
                              </div>
                            )}

                            {member.responsibilities && (
                              <div className="space-y-1.5 pt-1">
                                {member.responsibilities.slice(0, 3).map((r, rIdx) => (
                                  <div
                                    key={rIdx}
                                    className="flex items-start gap-2 text-xs text-slate-600"
                                  >
                                    <span className="text-emerald-600 font-bold mt-0.5">•</span>
                                    <span className="line-clamp-2">{translateResponsibility(r, isMr)}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-3">
                              {member.phone && (
                                <a
                                  href={`tel:${member.phone}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="inline-flex items-center gap-1.5 font-semibold text-slate-700 hover:text-emerald-700 transition-colors"
                                >
                                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>{member.phone}</span>
                                </a>
                              )}
                              {member.email && (
                                <a
                                  href={`mailto:${member.email}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="inline-flex items-center gap-1.5 text-slate-500 hover:text-emerald-700 transition-colors truncate max-w-[140px]"
                                >
                                  <Mail className="w-3.5 h-3.5 text-emerald-600" />
                                  <span className="truncate">{member.email}</span>
                                </a>
                              )}
                            </div>

                            <span className="text-[11px] font-bold text-emerald-700 group-hover:translate-x-0.5 transition-transform">
                              {isMr ? "तपशील →" : "Details →"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                {/* 2. COMMITTEE MEMBERS */}
                {committeeMembers.length > 0 && (
                  <section className="space-y-6">
                    <div className="border-b border-slate-200 pb-3 flex items-center justify-between gap-4">
                      <div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                          {isMr
                            ? "समिती सदस्य"
                            : "Committee Members"}
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                          {isMr
                            ? "विधी व न्यायालयीन कामकाजाशी संबंधित समिती सदस्य व विधी अधिकारी"
                            : "Appointed committee members, legal officers, and municipal representatives"}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                        {committeeMembers.length} {isMr ? "सदस्य" : "Members"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {committeeMembers.map((member) => (
                        <div
                          key={member.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => setSelectedMember(member)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setSelectedMember(member);
                            }
                          }}
                          className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-emerald-600 hover:shadow-xl transition-all flex flex-col justify-between group cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
                          aria-label={`View details for ${member.name}`}
                        >
                          <div className="space-y-3.5">
                            <div className="flex items-center justify-between gap-2">
                              <span
                                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                                  member.category === "Legal Officer"
                                    ? "text-purple-800 bg-purple-50 border-purple-200"
                                    : "text-emerald-800 bg-emerald-50 border-emerald-200"
                                }`}
                              >
                                {translateRole(member.role, isMr)}
                              </span>
                              {member.ward && (
                                <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full truncate max-w-[160px]">
                                  {translateWard(member.ward, isMr)}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-3.5">
                              <MemberAvatar
                                name={member.name}
                                image={member.image}
                                sizeClass="w-16 h-16 sm:w-20 sm:h-20"
                                bgGradient={
                                  member.category === "Legal Officer"
                                    ? "from-slate-800 to-slate-900"
                                    : "from-emerald-700 to-teal-800"
                                }
                                textClass="font-bold text-base sm:text-lg"
                              />
                              <div className="min-w-0 flex-1">
                                <h4 className="font-bold text-base text-slate-900 group-hover:text-emerald-800 transition-colors leading-snug">
                                  {isMr && member.marathiName ? member.marathiName : member.name}
                                </h4>
                                {member.marathiName && !isMr && (
                                  <p className="text-xs font-semibold text-emerald-700 mt-0.5">
                                    {member.marathiName}
                                  </p>
                                )}
                                <p className="text-[11px] text-slate-500 font-medium line-clamp-1 mt-0.5">
                                  {translateDesignation(member.designation, isMr)}
                                </p>
                              </div>
                            </div>

                            {member.experience && (
                              <div className="text-[10px] font-semibold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                                {translateExperience(member.experience, isMr)}
                              </div>
                            )}

                            {member.responsibilities && member.responsibilities.length > 0 && (
                              <div className="space-y-1 pt-1">
                                {member.responsibilities.slice(0, 2).map((r, rIdx) => (
                                  <div
                                    key={rIdx}
                                    className="text-[11px] text-slate-600 flex items-start gap-1.5"
                                  >
                                    <span className="text-emerald-600 font-bold">•</span>
                                    <span className="line-clamp-2">{translateResponsibility(r, isMr)}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              {member.phone && (
                                <a
                                  href={`tel:${member.phone}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="inline-flex items-center gap-1 font-semibold text-slate-700 hover:text-emerald-700 text-[11px] transition-colors"
                                >
                                  <Phone className="w-3 h-3 text-emerald-600" />
                                  <span>{member.phone}</span>
                                </a>
                              )}
                              {member.email && (
                                <a
                                  href={`mailto:${member.email}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="inline-flex items-center gap-1 text-slate-500 hover:text-emerald-700 text-[11px] truncate max-w-[120px] transition-colors"
                                >
                                  <Mail className="w-3 h-3 text-emerald-600" />
                                  <span className="truncate">{member.email}</span>
                                </a>
                              )}
                            </div>

                            <span className="text-[11px] font-bold text-emerald-700 group-hover:translate-x-0.5 transition-transform">
                              {isMr ? "तपशील →" : "Details →"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: COURT PROCEEDINGS & ORDERS */}
        {/* ========================================================= */}
        {activeTab === "proceedings" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {isMr
                    ? "न्यायालयीन कामकाज, सुनावणी व अधिकृत आदेश"
                    : "Judicial Proceedings, Hearings & Court Orders"}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  {isMr
                    ? "मा. उच्च न्यायालय, हरित लवाद व दिवाणी न्यायालयीन दावे, सुनावणी कार्यवृत्त (इतिवृत्त) व अधिकृत आदेश (PDF)"
                    : "High Court litigations, NGT matters, hearing proceedings, minutes, and official downloadable court orders (PDF)"}
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200 w-fit">
                {proceedings.length} {isMr ? "प्रकरणे" : "Proceedings"}
              </span>
            </div>

            {loadingProceedings && proceedings.length === 0 ? (
              <ProceedingsSkeleton />
            ) : proceedings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3 text-center">
                <Scale className="w-12 h-12 text-slate-300" />
                <h3 className="text-lg font-bold text-slate-700">
                  {isMr ? "कोणतेही न्यायालयीन कामकाज उपलब्ध नाही" : "No Court Proceedings Available"}
                </h3>
                <p className="text-xs text-slate-500 max-w-md">
                  {isMr
                    ? "सध्या सक्रिय न्यायालयीन सुनावणी किंवा आदेश उपलब्ध नाहीत."
                    : "There are currently no active court proceedings or orders listed."}
                </p>
              </div>
            ) : (
              /* Court Proceedings: 2 Cards per row */
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {proceedings.map((update) => (
                  <div
                    key={update.id}
                    onClick={() => setSelectedProceeding(update)}
                    className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:border-emerald-600/50 hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-4 group cursor-pointer"
                  >
                    <div className="space-y-3">
                      {/* Top Bar: Status & Date */}
                      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                            update.status === "Minutes Published"
                              ? "bg-emerald-100 text-emerald-900 border border-emerald-200"
                              : update.status === "Completed"
                                ? "bg-blue-100 text-blue-900 border border-blue-200"
                                : update.status === "Order Passed"
                                  ? "bg-teal-100 text-teal-900 border border-teal-200"
                                  : update.status === "In Progress"
                                    ? "bg-purple-100 text-purple-900 border border-purple-200"
                                    : "bg-amber-100 text-amber-900 border border-amber-200"
                          }`}
                        >
                          {translateStatus(update.status, isMr)}
                        </span>

                        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-700 bg-slate-50 px-2.5 py-0.5 rounded-full border border-slate-200">
                          <Calendar className="w-3 h-3 text-emerald-600" />
                          <span>{formatMarathiDate(update.date, isMr)}</span>
                        </div>
                      </div>

                      {/* 1. SUBJECT */}
                      <div>
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-800 transition-colors leading-snug line-clamp-2">
                          {isMr && update.marathiSubject
                            ? update.marathiSubject
                            : isMr
                              ? (autoTranslations[update.subject] ||
                                  getCachedMarathi(update.subject) ||
                                  update.subject)
                              : update.subject}
                        </h3>
                        {update.marathiSubject && !isMr && (
                          <p className="text-xs font-semibold text-emerald-700 truncate mt-0.5">
                            {update.marathiSubject}
                          </p>
                        )}
                      </div>

                      {/* 2. DESCRIPTION */}
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                        {isMr && update.marathiDescription
                          ? update.marathiDescription
                          : isMr
                            ? (autoTranslations[update.description] ||
                                getCachedMarathi(update.description) ||
                                update.description)
                            : update.description}
                      </p>

                      {/* 3. MINUTES */}
                      <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/80 space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-bold text-emerald-900">
                          <span className="flex items-center gap-1">
                            <FileCheck className="w-3.5 h-3.5 text-emerald-700" />
                            {isMr ? "सुनावणी इतिवृत्त:" : "Minutes Summary:"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed">
                          {isMr && update.marathiMinutes
                            ? update.marathiMinutes
                            : isMr
                              ? (autoTranslations[update.minutes] ||
                                  getCachedMarathi(update.minutes) ||
                                  update.minutes)
                              : update.minutes}
                        </p>
                      </div>

                      {/* Venue / Location */}
                      {update.venue && (
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 truncate pt-0.5">
                          <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="truncate">{translateForum(update.venue, isMr)}</span>
                        </div>
                      )}
                    </div>

                    {/* 4. PDF DOWNLOAD & ACTIONS */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-400 font-mono">
                        {update.fileSize ? `PDF • ${update.fileSize}` : isMr ? "अधिकृत विधी नोंद" : "Official Record"}
                      </span>

                      {update.pdfUrl ? (
                        <a
                          href={getInlineFileUrl(update.pdfUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors shadow-2xs hover:scale-102 active:scale-95 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>{isMr ? "PDF आदेश" : "Download PDF"}</span>
                        </a>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">
                          {isMr ? "प्रतीक्षेत" : "Pending"}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Member Detail Dialog / Popup */}
      {selectedMember && (
        <CourtMemberDialog
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
          isMr={isMr}
        />
      )}

      {/* Proceeding Detail Dialog / Popup */}
      {selectedProceeding && (
        <CourtProceedingDialog
          proceeding={selectedProceeding}
          onClose={() => setSelectedProceeding(null)}
          isMr={isMr}
          autoTranslations={autoTranslations}
        />
      )}
    </div>
  );
}
