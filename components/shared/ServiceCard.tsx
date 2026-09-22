"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Receipt,
  Droplets,
  Baby,
  FileHeart,
  Building2,
  Briefcase,
  FileCheck,
  CreditCard,
  ArrowUpRight,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { CitizenService } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { useAutoTranslate, CATEGORY_TRANSLATIONS } from "@/hooks/useAutoTranslation";

const iconMap: Record<string, React.ReactNode> = {
  Receipt: <Receipt className="w-7 h-7 text-emerald-700 group-hover:text-white transition-colors" />,
  Droplets: <Droplets className="w-7 h-7 text-teal-700 group-hover:text-white transition-colors" />,
  Baby: <Baby className="w-7 h-7 text-emerald-700 group-hover:text-white transition-colors" />,
  FileHeart: <FileHeart className="w-7 h-7 text-rose-600 group-hover:text-white transition-colors" />,
  Building2: <Building2 className="w-7 h-7 text-emerald-700 group-hover:text-white transition-colors" />,
  Briefcase: <Briefcase className="w-7 h-7 text-amber-700 group-hover:text-white transition-colors" />,
  FileCheck: <FileCheck className="w-7 h-7 text-teal-700 group-hover:text-white transition-colors" />,
  CreditCard: <CreditCard className="w-7 h-7 text-emerald-700 group-hover:text-white transition-colors" />,
};

const serviceKeyMap: Record<
  string,
  | "propertyTax"
  | "waterBill"
  | "birthCert"
  | "deathCert"
  | "buildingPermit"
  | "tradeLicense"
  | "noc"
  | "onlinePay"
> = {
  "srv-property-tax": "propertyTax",
  "srv-water-bill": "waterBill",
  "srv-birth-cert": "birthCert",
  "srv-death-cert": "deathCert",
  "srv-building-permission": "buildingPermit",
  "srv-trade-license": "tradeLicense",
  "srv-noc": "noc",
  "srv-online-payment": "onlinePay",
};

const SUB_SERVICES_MAP: Record<string, { en: string[]; mr: string[]; hi: string[] }> = {
  "srv-property-tax": {
    en: [
      "Online Tax Payment & BBPS",
      "Rateable Property Valuation",
      "5% Early-Bird Rebate Calculation",
      "Property Mutation & Transfer",
      "Download Assessment Receipts",
    ],
    mr: [
      "ऑनलाईन मालमत्ता कर भरणा",
      "मालमत्ता वार्षिक मूल्यांकन",
      "५% आगाऊ कर सवलत गणना",
      "मालमत्ता फेरफार व नाव नोंदणी",
      "कर भरणा पावती डाऊनलोड",
    ],
    hi: [
      "ऑनलाइन संपत्ति कर भुगतान",
      "वार्षिक संपत्ति मूल्यांकन",
      "५% अग्रिम कर छूट गणना",
      "संपत्ति नामांतरण एवं म्यूटेशन",
      "कर भुगतान रसीद डाउनलोड",
    ],
  },
  "srv-water-bill": {
    en: [
      "Instant Water Bill Payment",
      "New Metered Tap Connection",
      "Meter Complaint & Inspection",
      "Municipal Water Tanker Request",
      "No Due Certificate (NDC)",
    ],
    mr: [
      "पाणीपट्टी ऑनलाईन भरणा",
      "नवीन नळ जोडणी अर्ज",
      "मीटर दुरुस्ती व तपासणी तक्रार",
      "नगरपालिका पाणी टँकर मागणी",
      "पाणीपट्टी थकबाकी दाखला (NDC)",
    ],
    hi: [
      "जल शुल्क ऑनलाइन भुगतान",
      "नया नल कनेक्शन आवेदन",
      "मीटर शिकायत एवं जांच",
      "नगर परिषद पानी टैंकर अनुरोध",
      "अदेयता प्रमाण पत्र (NDC)",
    ],
  },
  "srv-birth-cert": {
    en: [
      "Digital Birth Certificate Download",
      "Child Name Inclusion in Record",
      "Late Birth Registration (Form 1)",
      "Additional Certified QR Copies",
      "Hospital Birth Report Verification",
    ],
    mr: [
      "डिजिटल जन्म दाखला डाऊनलोड",
      "जन्म नोंदवहीत नाव समाविष्ट करणे",
      "विलंबित जन्म नोंदणी (नमुना १)",
      "अतिरिक्त प्रमाणित क्यूआर प्रती",
      "रुग्णालय जन्म अहवाल पडताळणी",
    ],
    hi: [
      "डिजिटल जन्म प्रमाण पत्र डाउनलोड",
      "जन्म रिकॉर्ड में नाम जोड़ना",
      "विलंबित जन्म पंजीकरण (प्रपत्र १)",
      "अतिरिक्त सत्यापित क्यूआर प्रतियां",
      "अस्पताल जन्म रिपोर्ट सत्यापन",
    ],
  },
  "srv-death-cert": {
    en: [
      "Digital Death Certificate",
      "Late Death Registration",
      "Crematorium / Burial NOC",
      "Record Correction Application",
      "Digitally Verified Certificate",
    ],
    mr: [
      "डिजिटल मृत्यू दाखला निर्गमन",
      "विलंबित मृत्यू नोंदणी अर्ज",
      "स्मशानभूमी व दफनभूमी ना-हरकत",
      "मृत्यू नोंदीत दुरुस्ती अर्ज",
      "डिजिटल प्रमाणित दाखला",
    ],
    hi: [
      "डिजिटल मृत्यु प्रमाण पत्र",
      "विलंबित मृत्यु पंजीकरण आवेदन",
      "श्मशान एवं कब्रिस्तान एनओसी",
      "मृत्यु रिकॉर्ड सुधार आवेदन",
      "डिजिटल सत्यापित प्रमाण पत्र",
    ],
  },
  "srv-building-permission": {
    en: [
      "Online Plan Sanction (AutoDCR)",
      "Commencement Certificate (CC)",
      "Occupancy Certificate (OC)",
      "Plinth Verification & NOC",
      "Architect Registration Cell",
    ],
    mr: [
      "इमारत नकाशा मंजुरी (AutoDCR)",
      "काम सुरू दाखला (CC)",
      "भोगवटा प्रमाणपत्र (OC)",
      "जोते तपासणी व ना-हरकत दाखला",
      "वास्तुविशारद नोंदणी कक्ष",
    ],
    hi: [
      "भवन योजना स्वीकृति (AutoDCR)",
      "निर्माण प्रारंभ प्रमाण पत्र (CC)",
      "अधिभोग प्रमाण पत्र (OC)",
      "प्लिंथ सत्यापन एवं एनओसी",
      "वास्तुकार पंजीकरण पोर्टल",
    ],
  },
  "srv-trade-license": {
    en: [
      "New Commercial Trade License",
      "Annual Shop License Renewal",
      "License Ownership Transfer",
      "Hawker & Street Vendor Registration",
      "Trade Modification Application",
    ],
    mr: [
      "नवीन व्यवसाय व दुकान परवाना",
      "वार्षिक परवाना नूतनीकरण",
      "व्यवसाय परवाना हस्तांतरण",
      "फेरीवाला व पथविक्रेता नोंदणी",
      "व्यवसाय संवर्ग बदल अर्ज",
    ],
    hi: [
      "नया व्यापार एवं दुकान लाइसेंस",
      "वार्षिक लाइसेंस नवीनीकरण",
      "लाइसेंस हस्तांतरण आवेदन",
      "फेरीवाला एवं स्ट्रीट वेंडर पंजीकरण",
      "व्यापार संवर्ग संशोधन",
    ],
  },
  "srv-noc": {
    en: [
      "Fire Safety & Prevention NOC",
      "Tree Trimming & Cutting Clearance",
      "Road Digging & Utility Trenching",
      "Drainage Line Connection NOC",
      "Commercial Hoarding Clearance",
    ],
    mr: [
      "अग्निशमन सुरक्षा ना-हरकत दाखला",
      "वृक्ष छाटणी व तोड परवानगी",
      "रस्ता खोदाई व युटिलिटी परवानगी",
      "भूमिगत गटार जोडणी ना-हरकत",
      "जाहिरात फलक / होर्डिंग ना-हरकत",
    ],
    hi: [
      "अग्निशमन सुरक्षा एनओसी",
      "वृक्ष छंटाई एवं कटाई अनुमति",
      "सड़क खुदाई एवं यूटिलिटी एनओसी",
      "जल निकासी एवं सीवर एनओसी",
      "विज्ञापन होर्डिंग एनओसी",
    ],
  },
  "srv-online-payment": {
    en: [
      "Unified BBPS Civic Gateway",
      "Municipal Shop Rent Payment",
      "Development Scrutiny Fees",
      "Download Payment Receipts",
      "Challan Status Verification",
    ],
    mr: [
      "एकात्मिक BBPS नागरी देयक",
      "नगरपालिका गाळे भाडे भरणा",
      "विकास व छाननी शुल्क भरणा",
      "डिजिटल भरणा पावती डाऊनलोड",
      "चलन स्थिती पडताळणी",
    ],
    hi: [
      "एकीकृत BBPS नागरिक भुगतान",
      "नगर परिषद दुकान किराया भुगतान",
      "विकास एवं संवीक्षा शुल्क",
      "डिजिटल भुगतान रसीद डाउनलोड",
      "चालान सत्यापन स्थिति",
    ],
  },
};

export function ServiceCard({
  service,
  index = 0,
}: {
  service: CitizenService;
  index?: number;
}) {
  const { dict, language } = useLanguage();
  const icon =
    iconMap[service.icon] || (
      <FileCheck className="w-7 h-7 text-emerald-700 group-hover:text-white transition-colors" />
    );

  const serviceKey = serviceKeyMap[service.id];
  const localizedItem = serviceKey ? dict.services.items[serviceKey] : null;
  const autoTitle = useAutoTranslate(service.title, (service as any).titleMr);
  const title = localizedItem?.title || autoTitle;

  const rawCat = service.category.split("&")[0].trim();
  const autoCat = useAutoTranslate(rawCat);
  const displayedCategory =
    language === "mr" && CATEGORY_TRANSLATIONS[rawCat]
      ? CATEGORY_TRANSLATIONS[rawCat]
      : autoCat;

  const subServicesData = SUB_SERVICES_MAP[service.id];
  const subServices = subServicesData
    ? language === "mr"
      ? subServicesData.mr
      : language === "hi"
        ? subServicesData.hi
        : subServicesData.en
    : [
      "Online Application Submission",
      "Document Verification",
      "Payment & Instant Receipt",
      "Status Tracking & Download",
      "Digital Certificate Issuance",
    ];

  // Determine flyout side: Left or Right based on grid column position
  const isRightHalf = index % 4 >= 2;
  const isTabletRight = index % 2 === 1;

  return (
    <div className="relative group/card z-10 hover:z-50">
      {/* 1. Main Service Card */}
      <Link
        href={`/services/${service.slug}`}
        className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs hover:shadow-2xl hover:border-emerald-600/60 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[190px] relative overflow-hidden block group"
      >
        {/* Top Accent Gradient Border */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Top Icon & Arrow Action */}
        <div className="flex items-center justify-between mb-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50/90 border border-emerald-100 flex items-center justify-center group-hover:bg-gradient-to-tr group-hover:from-emerald-700 group-hover:to-teal-600 group-hover:scale-110 shadow-xs transition-all duration-300">
            {icon}
          </div>
          <div className="w-9 h-9 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-emerald-700 group-hover:bg-emerald-50 group-hover:border-emerald-200 transition-all duration-300">
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* Service Name in Big Size */}
        <div className="space-y-1.5">
          <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl group-hover:text-emerald-800 transition-colors leading-snug tracking-tight">
            {title}
          </h3>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {displayedCategory}
          </p>
        </div>
      </Link>

      {/* 2. Sub-Services Cards (Outside the Card Stack as per reference drawing) */}
      <div
        className={`hidden sm:flex flex-col gap-2 w-64 md:w-72 absolute top-0 pointer-events-none group-hover/card:pointer-events-auto opacity-0 scale-95 group-hover/card:opacity-100 group-hover/card:scale-100 transition-all duration-300 ease-out z-50 ${isRightHalf
            ? "right-full mr-3.5 origin-right"
            : "left-full ml-3.5 origin-left"
          }`}
      >
        {/* Invisible Bridge to prevent mouse flickering */}
        <div
          className={`absolute top-0 bottom-0 w-4 ${isRightHalf ? "-right-4" : "-left-4"
            }`}
        />

        {subServices.map((subItem, sIdx) => (
          <Link
            key={sIdx}
            href={`/services/${service.slug}`}
            style={{
              transitionDelay: `${sIdx * 35}ms`,
            }}
            className="bg-white/98 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 px-3.5 border border-slate-200 shadow-xl shadow-slate-900/10 hover:shadow-2xl hover:border-emerald-400 hover:bg-emerald-50/90 text-slate-800 hover:text-emerald-900 transition-all duration-200 flex items-center justify-between gap-2.5 group/subcard"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-2 h-2 rounded-full bg-emerald-600 shrink-0 group-hover/subcard:scale-125 transition-transform" />
              <span className="text-xs font-bold leading-snug truncate">
                {subItem}
              </span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover/subcard:text-emerald-700 group-hover/subcard:translate-x-0.5 shrink-0 transition-transform" />
          </Link>
        ))}
      </div>
    </div>
  );
}
