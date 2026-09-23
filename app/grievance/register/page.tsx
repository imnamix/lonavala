"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  AlertCircle,
  Upload,
  MapPin,
  ShieldCheck,
  Download,
  ArrowRight,
  ArrowLeft,
  Smartphone,
  Check,
  Loader2,
  Droplets,
  Lightbulb,
  Trash2,
  Car,
  Waves,
  Building,
  FileText,
  Dog,
  Trees,
  CloudRain,
  HelpCircle,
  X,
  UserCheck,
  Building2,
  Clock,
  Sparkles,
} from "lucide-react";
import {
  createGrievance,
  verifyCitizenOtp,
  saveCitizenSession,
  getCitizenToken,
  getCitizenData,
  isCitizenLoggedIn,
  CitizenProfile,
} from "@/lib/services/citizen.service";
import { uploadToCloudinary } from "@/lib/services/cloudinary.service";
import { useLanguage } from "@/context/LanguageContext";

interface CategoryOption {
  id: string;
  category: string;
  marathi: string;
  departmentEn: string;
  departmentMr: string;
  icon: any;
  enumValue: string;
  descEn: string;
  descMr: string;
}

const CATEGORIES_WITH_DEPTS: CategoryOption[] = [
  {
    id: "water",
    category: "Water Supply & Leakage",
    marathi: "पाणी पुरवठा व गळती",
    departmentEn: "Water Supply & Drainage",
    departmentMr: "पाणी पुरवठा व सांडपाणी विभाग",
    icon: Droplets,
    enumValue: "WATER",
    descEn: "Pipeline bursts, low pressure, contaminated water supply",
    descMr: "मुख्य जलवाहिनी गळती, कमी दाबाने पाणी येणे, दूषित किंवा अस्वच्छ पाणी पुरवठा",
  },
  {
    id: "streetlight",
    category: "Streetlight & Electric Poles",
    marathi: "पथदिवे व विद्युत खांब",
    departmentEn: "Electrical & Public Lighting",
    departmentMr: "विद्युत व प्रकाश विभाग",
    icon: Lightbulb,
    enumValue: "STREET_LIGHT",
    descEn: "Non-functional lights, dangling wires, tilted electric poles",
    descMr: "बंद पथदिवे, लटकणाऱ्या धोकादायक विद्युत तारा, वाकलेले किंवा तुटलेले विजेचे खांब",
  },
  {
    id: "garbage",
    category: "Garbage Dumping & Sanitation",
    marathi: "कचरा व सार्वजनिक स्वच्छता",
    departmentEn: "Health & Sanitation",
    departmentMr: "आरोग्य व स्वच्छता विभाग",
    icon: Trash2,
    enumValue: "GARBAGE",
    descEn: "Uncleaned garbage bins, illegal dumping, public littering",
    descMr: "वेळेवर न उचललेला कचरा, उघड्यावर कचरा टाकणे, सार्वजनिक अस्वच्छता",
  },
  {
    id: "roads",
    category: "Road Potholes & Footpaths",
    marathi: "रस्त्यावरील खड्डे व पदपथ",
    departmentEn: "Public Works Department (PWD)",
    departmentMr: "बांधकाम विभाग",
    icon: Car,
    enumValue: "ROAD",
    descEn: "Potholes, broken pavers, damaged footpaths, speed breakers",
    descMr: "रस्त्यांवरील खड्डे, उखडलेले पेव्हर ब्लॉक, तुटलेले पदपथ, धोकादायक गतिरोधक",
  },
  {
    id: "drainage",
    category: "Drainage Choke & Sewage",
    marathi: "सांडपाणी व गटारे तुंबणे",
    departmentEn: "Water Supply & Drainage",
    departmentMr: "सांडपाणी व निचरा विभाग",
    icon: Waves,
    enumValue: "DRAINAGE",
    descEn: "Choked gutters, open chambers, overflow onto roads",
    descMr: "तुंबलेली गटारे, उघडे चेंबर, रस्त्यावर वाहणारे सांडपाणी व दुर्गंधी",
  },
  {
    id: "construction",
    category: "Illegal Construction",
    marathi: "अनधिकृत बांधकाम व अतिक्रमण",
    departmentEn: "Town Planning & Building Permissions",
    departmentMr: "नगररचना विभाग",
    icon: Building,
    enumValue: "BUILDING",
    descEn: "Unauthorized structures, hill cutting, road encroachments",
    descMr: "विनापरवाना अनधिकृत बांधकामे, डोंगर पोखरणी, रस्त्यावरील दुकानांचे अतिक्रमण",
  },
  {
    id: "tax",
    category: "Property Tax Query",
    marathi: "घरपट्टी व मालमत्ता कर",
    departmentEn: "Revenue & Property Tax",
    departmentMr: "कर संकलन विभाग",
    icon: FileText,
    enumValue: "OTHER",
    descEn: "Assessment discrepancies, bill corrections, rebate issues",
    descMr: "मालमत्ता कर आकारणी त्रुटी, कर देयक दुरुस्ती, सवलत व पावती समस्या",
  },
  {
    id: "animals",
    category: "Stray Animals Menace",
    marathi: "भटके कुत्रे व जनावरे",
    departmentEn: "Health & Sanitation",
    departmentMr: "आरोग्य विभाग",
    icon: Dog,
    enumValue: "GARBAGE",
    descEn: "Stray dog sterilization, cattle nuisance on main streets",
    descMr: "भटक्या कुत्र्यांचा उपद्रव, रस्त्यावरील मोकाट जनावरे, नसबंदी मोहीम",
  },
  {
    id: "garden",
    category: "Public Parks & Trees",
    marathi: "उद्याने व झाडे छाटणी",
    departmentEn: "Public Works (PWD) - Garden Wing",
    departmentMr: "उद्यान विभाग",
    icon: Trees,
    enumValue: "ROAD",
    descEn: "Overgrown dangerous branches, dried trees, park upkeep",
    descMr: "धोकादायक वाढलेल्या फांद्या, वाळलेली झाडे, सार्वजनिक उद्यानांची निगा",
  },
  {
    id: "disaster",
    category: "Monsoon / Disaster Alert",
    marathi: "आपत्कालीन / पूर / झाड पडणे",
    departmentEn: "Disaster Management Cell",
    departmentMr: "आपत्ती व्यवस्थापन कक्ष",
    icon: CloudRain,
    enumValue: "OTHER",
    descEn: "Water logging, wall collapse risk, landslide vulnerability",
    descMr: "पाणी साचणे, भिंत कोसळण्याचा धोका, दरड कोसळण्याची शक्यता",
  },
  {
    id: "other",
    category: "Others / Civic Grievance",
    marathi: "इतर नागरी तक्रार",
    departmentEn: "Citizen Facilitation Center (CFC)",
    departmentMr: "नागरी सुविधा केंद्र",
    icon: HelpCircle,
    enumValue: "OTHER",
    descEn: "General municipal complaints not listed in above categories",
    descMr: "वरील प्रवर्गात न येणाऱ्या इतर सर्व प्रकारच्या नागरी व पालिका तक्रारी",
  },
];

const WARDS = [
  { id: 1, en: "Ward 1 - Bangarwadi & Railway Station", mr: "प्रभाग १ - भांगरवाडी व रेल्वे स्टेशन परिसर" },
  { id: 2, en: "Ward 2 - Ryewood & Main Bazaar", mr: "प्रभाग २ - रायवूड व मुख्य बाजारपेठ" },
  { id: 3, en: "Ward 3 - Khandala Ridge & Nagpal Estate", mr: "प्रभाग ३ - खंडाळा रिज व नागपाल इस्टेट" },
  { id: 4, en: "Ward 4 - Valvan & Varsoli Road", mr: "प्रभाग ४ - वलवण व वरसोली रोड" },
  { id: 5, en: "Ward 5 - Tungarli & Gold Valley", mr: "प्रभाग ५ - तुंगार्ली व गोल्ड व्हॅली" },
];

const parseWardNumber = (w: string): number => {
  const match = w.match(/\d+/);
  return match ? parseInt(match[0], 10) : 1;
};

export default function GrievanceRegisterPage() {
  const { language } = useLanguage();
  const isMr = language === "mr";
  const router = useRouter();

  // Citizen Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<CitizenProfile | null>(null);

  // Wizard Step
  const [step, setStep] = useState(1);

  // Form State
  const [selectedCategory, setSelectedCategory] = useState<CategoryOption>(CATEGORIES_WITH_DEPTS[0]);
  const [otherCategoryDetail, setOtherCategoryDetail] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [ward, setWard] = useState<string>(WARDS[0].en);
  const [landmark, setLandmark] = useState("");
  const [citizenName, setCitizenName] = useState("");
  const [citizenMobile, setCitizenMobile] = useState("");
  const [citizenEmail, setCitizenEmail] = useState("");

  // OTP Verification State for Guest Users
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Completed Grievance Result
  const [registeredRef, setRegisteredRef] = useState("GRV-2026-000001");
  const [receiptDownloaded, setReceiptDownloaded] = useState(false);

  // Check login on load
  useEffect(() => {
    const loggedIn = isCitizenLoggedIn();
    setIsLoggedIn(loggedIn);
    if (loggedIn) {
      const data = getCitizenData();
      if (data) {
        setCurrentUser(data);
        setCitizenName(data.name || "");
        setCitizenMobile(data.phone.replace(/\D/g, "").slice(-10));
        setCitizenEmail(data.email || "");
        if (data.address) setLandmark(data.address);
      }
    }
  }, []);

  // Handle Image File Upload to Cloudinary
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > 5) {
      setUploadError(
        isMr
          ? "एका तक्रारीसाठी कमाल ५ फोटो जोडण्याची परवानगी आहे."
          : "Maximum 5 photographs allowed per grievance."
      );
      return;
    }

    setUploadError("");
    setIsUploading(true);

    try {
      const uploadPromises = Array.from(files).map((file) =>
        uploadToCloudinary(file, "lonavala/grievances")
      );
      const results = await Promise.all(uploadPromises);
      const newUrls = results.map((r) => r.secure_url);
      setImages((prev) => [...prev, ...newUrls]);
    } catch (err: any) {
      setUploadError(
        err?.message ||
          (isMr
            ? "फोटो अपलोड करण्यात अडचण आली. कृपया पुन्हा प्रयत्न करा."
            : "Failed to upload image. Please try again.")
      );
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Submit Grievance (Authenticated Citizen directly from Step 4)
  const handleDirectSubmitForLoggedInUser = async () => {
    setSubmitting(true);
    setOtpError("");
    try {
      const finalTitle =
        selectedCategory.id === "other" && otherCategoryDetail.trim()
          ? `${otherCategoryDetail.trim()}: ${title}`
          : title;

      const res = await createGrievance({
        title: finalTitle || `Complaint: ${selectedCategory.category}`,
        description: description || "Reported civic issue requiring municipal attention.",
        category: selectedCategory.enumValue,
        address: `${landmark ? landmark + ", " : ""}${ward}`,
        wardNumber: parseWardNumber(ward),
        assignedDepartment: isMr ? selectedCategory.departmentMr : selectedCategory.departmentEn,
        attachmentUrls: images.length > 0 ? images : undefined,
      });

      const ticket =
        (res as any)?.ticketNumber ||
        (res as any)?.grievance?.ticketNumber ||
        (res as any)?.data?.ticketNumber ||
        "GRV-2026-000001";

      setRegisteredRef(ticket);
      setStep(6); // Success Step
    } catch (err: any) {
      setOtpError(
        err?.message ||
          (isMr ? "तक्रार दाखल करता आली नाही. कृपया पुन्हा प्रयत्न करा." : "Failed to submit grievance. Please try again.")
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Submit & Verify Flow for Guest Citizen (Step 5)
  const handleGuestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError("");

    if (!citizenName.trim()) {
      setOtpError(isMr ? "कृपया तुमचे पूर्ण नाव प्रविष्ट करा." : "Please enter your Full Name.");
      return;
    }
    const cleanMobile = citizenMobile.replace(/\D/g, "").slice(-10);
    if (!cleanMobile || cleanMobile.length !== 10) {
      setOtpError(
        isMr
          ? "कृपया वैध १० अंकी मोबाईल क्रमांक प्रविष्ट करा."
          : "Please enter a valid 10-digit mobile number."
      );
      return;
    }

    // If OTP input is not yet revealed, reveal it
    if (!showOtpInput) {
      setShowOtpInput(true);
      return;
    }

    // If OTP input is open, verify OTP
    if (!enteredOtp || enteredOtp.length !== 6) {
      setOtpError(
        isMr
          ? "कृपया ६ अंकी ओटीपी टाका (चाचणीसाठी 123456 वापरा)."
          : "Please enter the 6-digit OTP (use 123456 for testing)."
      );
      return;
    }

    setSubmitting(true);

    try {
      // 1. Verify OTP with backend → registers if new or logs in if existing
      const authRes = await verifyCitizenOtp({
        phone: cleanMobile,
        otp: enteredOtp,
        name: citizenName.trim(),
        email: citizenEmail.trim() || undefined,
        address: `${landmark ? landmark + ", " : ""}${ward}`,
      });

      // 2. Save logged-in session in browser
      if (authRes?.data?.accessToken && authRes?.data?.citizen) {
        saveCitizenSession(authRes.data.accessToken, authRes.data.citizen);
        setIsLoggedIn(true);
        setCurrentUser(authRes.data.citizen);
      }

      // 3. Create the grievance linked to this citizen
      const finalTitle =
        selectedCategory.id === "other" && otherCategoryDetail.trim()
          ? `${otherCategoryDetail.trim()}: ${title}`
          : title;

      const res = await createGrievance({
        title: finalTitle || `Complaint: ${selectedCategory.category}`,
        description: description || "Reported civic issue requiring municipal attention.",
        category: selectedCategory.enumValue,
        address: `${landmark ? landmark + ", " : ""}${ward}`,
        wardNumber: parseWardNumber(ward),
        citizenMobile: cleanMobile,
        citizenName: citizenName.trim(),
        citizenEmail: citizenEmail.trim() || undefined,
        assignedDepartment: isMr ? selectedCategory.departmentMr : selectedCategory.departmentEn,
        attachmentUrls: images.length > 0 ? images : undefined,
      });

      const ticket =
        (res as any)?.ticketNumber ||
        (res as any)?.grievance?.ticketNumber ||
        (res as any)?.data?.ticketNumber ||
        "GRV-2026-000001";

      setRegisteredRef(ticket);
      setStep(6); // Success Step
    } catch (err: any) {
      setOtpError(
        err?.message ||
          (isMr ? "पडताळणी अयशस्वी झाली. कृपया ओटीपी तपासून पुन्हा प्रयत्न करा." : "Verification failed. Please check the OTP and try again.")
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadReceipt = () => {
    setReceiptDownloaded(true);
    const content = isMr
      ? `========================================================
लोणावळा नगरपरिषद (LMC)
तक्रार निवारण अधिकृत पोहोच पावती
========================================================
तक्रार संदर्भ टोकन क्रमांक: ${registeredRef}
नोंदणी दिनांक व वेळ: ${new Date().toLocaleString("en-IN")}
तक्रारदार नागरिकाचे नाव: ${citizenName || currentUser?.name || "नोंदणीकृत नागरिक"}
मोबाईल क्रमांक: +91 ${citizenMobile || currentUser?.phone || ""}
ई-मेल: ${citizenEmail || currentUser?.email || "लागू नाही"}

संबंधित पालिका विभाग: ${selectedCategory.departmentMr}
तक्रारीचा प्रवर्ग: ${selectedCategory.marathi} (${selectedCategory.category})
प्रभाग: ${ward}
तपशीलवार ठिकाण: ${landmark || "लोणावळा पालिका कार्यक्षेत्र"}

तक्रारीचा विषय: ${title}
सविस्तर तक्रार: ${description}
जोडलेली छायाचित्रे: ${images.length}

अपेक्षित निराकरण कालावधी: २४ ते ७२ तास (कामाच्या स्वरूपानुसार)
थेट सद्यस्थिती तपासा: https://lonavalamc.gov.in/grievance/track?ref=${registeredRef}
पालिका तक्रार निवारण कक्ष: १८००-२३३-०१०१ / ०२११४-२७३०२४
========================================================
सदर पावती महाराष्ट्र लोकसेवा हक्क अधिनियमांतर्गत संगणकीकृत तयार करण्यात आलेली आहे.`
      : `========================================================
LONAVALA MUNICIPAL COUNCIL (LMC)
OFFICIAL GRIEVANCE REDRESSAL ACKNOWLEDGEMENT RECEIPT
========================================================
Reference Ticket Number: ${registeredRef}
Date & Time: ${new Date().toLocaleString("en-IN")}
Citizen Name: ${citizenName || currentUser?.name || "Registered Citizen"}
Mobile: +91 ${citizenMobile || currentUser?.phone || ""}
Email: ${citizenEmail || currentUser?.email || "N/A"}

Assigned Department: ${selectedCategory.departmentEn}
Grievance Category: ${selectedCategory.category}
Municipal Ward: ${ward}
Specific Location: ${landmark || "Lonavala Municipal Area"}

Complaint Title: ${title}
Description: ${description}
Photos Attached: ${images.length}

Expected SLA Redressal: 24 to 72 Hours
Track Online: https://lonavalamc.gov.in/grievance/track?ref=${registeredRef}
Municipal Helpline: 1800-233-0101 / 02114-273024
========================================================
This is a computer-generated receipt under the Maharashtra Right to Public Services Act.`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `LMC_Receipt_${registeredRef}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalSteps = isLoggedIn ? 4 : 5;
  const stepLabels = isLoggedIn
    ? isMr
      ? ["१. प्रवर्ग", "२. तपशील", "३. पुरावे/फोटो", "४. ठिकाण व सादर"]
      : ["1. Category", "2. Details", "3. Photos", "4. Location & Submit"]
    : isMr
    ? ["१. प्रवर्ग", "२. तपशील", "३. पुरावे/फोटो", "४. ठिकाण", "५. पडताळणी"]
    : ["1. Category", "2. Details", "3. Photos", "4. Location", "5. Verification"];

  return (
    <div className="py-10 bg-slate-50/60 min-h-screen">
      {/* Header Banner */}
      <div className="bg-gradient-to-b from-primary-light/80 to-white border-b border-border py-10 mb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white px-3.5 py-1 rounded-full border border-primary/20 text-xs font-bold text-primary shadow-2xs mb-3">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>{isMr ? "लोणावळा नगरपरिषद नागरी तक्रार निवारण कक्ष" : "Public Civic Redressal Portal"}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {isMr ? "नागरी तक्रार नोंदणी पोर्टल" : "Register Public Grievance"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl mx-auto">
            {isMr
              ? "स्वच्छता, पाणी पुरवठा, रस्त्यांवरील खड्डे, पथदिवे व इतर नागरी समस्यांची तक्रार थेट जबाबदार पालिका अधिकाऱ्यांकडे नोंदवा."
              : "Report municipal sanitation, roads, water supply, or electrical complaints directly to responsible municipal executive officers."}
          </p>

          {isLoggedIn && (
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-semibold">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>
                {isMr ? "सत्यापित नागरिक:" : "Logged in as:"} <strong>{currentUser?.name || (isMr ? "नागरिक" : "Citizen")}</strong> ({currentUser?.phone})
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Step Progress Header */}
        {step <= totalSteps && (
          <div className="mb-8 overflow-x-auto no-scrollbar py-2 px-1">
            <div className="min-w-[360px] sm:min-w-full flex items-start">
              {stepLabels.map((lbl, idx) => {
                const s = idx + 1;
                const isPassed = s < step;
                const isCurrent = s === step;
                const isLast = idx === stepLabels.length - 1;

                return (
                  <div key={s} className="relative flex-1 flex flex-col items-center">
                    {/* Connecting Segment Line (Centered exactly from this circle to next circle) */}
                    {!isLast && (
                      <div className="absolute top-4 sm:top-[18px] left-1/2 w-full h-1 -translate-y-1/2 bg-slate-200 z-0">
                        <div
                          className={`h-full bg-primary transition-all duration-300 ${
                            s < step ? "w-full" : "w-0"
                          }`}
                        />
                      </div>
                    )}

                    {/* Step Node: Circle */}
                    <div
                      className={`relative z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-200 ${
                        isPassed
                          ? "bg-primary text-white shadow-xs"
                          : isCurrent
                          ? "bg-white border-2 border-primary text-primary shadow-md ring-4 ring-primary-light scale-105"
                          : "bg-white text-slate-400 border border-slate-300"
                      }`}
                    >
                      {isPassed ? <Check className="w-4 h-4 stroke-[3]" /> : s}
                    </div>

                    {/* Step Label: Single line */}
                    <span
                      className={`mt-2 text-[11px] sm:text-xs font-semibold whitespace-nowrap text-center ${
                        isCurrent
                          ? "text-primary font-bold"
                          : isPassed
                          ? "text-slate-800 font-semibold"
                          : "text-slate-400"
                      }`}
                    >
                      {lbl}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Wizard Card Body */}
        <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-sm">
          {/* ══════════════════════════════════════════════════════════ */}
          {/* STEP 1: CATEGORY SELECTION */}
          {/* ══════════════════════════════════════════════════════════ */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary-light px-2.5 py-0.5 rounded-md">
                  {isMr ? `पायरी १ / एकूण ${totalSteps}` : `Step 1 of ${totalSteps}`}
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-2">
                  {isMr ? "तक्रार प्रवर्ग निवडा" : "Select Grievance Category"}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isMr
                    ? "खालीलपैकी समस्येचा योग्य प्रकार निवडा. त्यानुसार संबंधित पालिका विभाग आपोआप नेमला जाईल."
                    : "Select the issue type below. The responsible municipal department is automatically assigned."}
                </p>
              </div>

              {/* Grid of Categories */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {CATEGORIES_WITH_DEPTS.map((item) => {
                  const Icon = item.icon;
                  const isSelected = selectedCategory.id === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedCategory(item)}
                      className={`p-3.5 rounded-2xl border text-left transition-all relative flex items-start gap-3 cursor-pointer group ${
                        isSelected
                          ? "border-primary bg-primary-light/40 shadow-xs ring-2 ring-primary/20"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/70"
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? "bg-primary text-white shadow-xs"
                            : "bg-slate-100 text-slate-600 group-hover:bg-primary-light group-hover:text-primary"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className={`text-xs font-bold truncate ${isSelected ? "text-primary" : "text-slate-900"}`}>
                            {isMr ? item.marathi : item.category}
                          </span>
                          {isSelected && (
                            <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                          {isMr ? item.category : item.marathi}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                          {isMr ? item.descMr : item.descEn}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Custom Input for "Other" Category */}
              {selectedCategory.id === "other" && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 animate-in fade-in duration-200 space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {isMr ? "इतर तक्रारीचा नेमका विषय नमूद करा (ऐच्छिक)" : "Specify Grievance Topic (Optional)"}
                  </label>
                  <input
                    type="text"
                    value={otherCategoryDetail}
                    onChange={(e) => setOtherCategoryDetail(e.target.value)}
                    placeholder={
                      isMr
                        ? "उदा. बस स्टॉपवरील तुटलेले बाकडी, धोकादायक उघडा ट्रान्सफॉर्मर, ध्वनी प्रदूषण..."
                        : "e.g. Broken bench at bus stop, open transformer box, noise complaint..."
                    }
                    className="w-full h-10 px-3.5 text-xs bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              )}

              {/* Assigned Department Highlight Card */}
              <div className="bg-primary-surface p-4 rounded-2xl border border-border flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                      {isMr ? "संबंधित पालिका विभाग" : "Assigned Municipal Wing"}
                    </div>
                    <div className="text-xs font-bold text-slate-900 mt-0.5">
                      {isMr ? selectedCategory.departmentMr : selectedCategory.departmentEn}
                    </div>
                  </div>
                </div>

                <div className="text-right hidden sm:block">
                  <div className="text-[10px] text-slate-500">{isMr ? "अपेक्षित निराकरण कालावधी" : "Expected SLA Redressal"}</div>
                  <div className="text-xs font-bold text-emerald-700">{isMr ? "२४ ते ७२ तास" : "24 - 72 Hours"}</div>
                </div>
              </div>

              {/* Step 1 Actions */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <span>{isMr ? "पुढील पायरीवर जा (तपशील)" : "Proceed to Details"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════ */}
          {/* STEP 2: TITLE & DESCRIPTION */}
          {/* ══════════════════════════════════════════════════════════ */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary-light px-2.5 py-0.5 rounded-md">
                  {isMr ? `पायरी २ / एकूण ${totalSteps}` : `Step 2 of ${totalSteps}`}
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-2">
                  {isMr ? "तक्रारीचा सविस्तर तपशील" : "Complaint Details"}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isMr
                    ? "तक्रारीचे स्पष्ट वर्णन करा जेणेकरून पालिका निरीक्षकांना तातडीने प्रत्यक्ष कारवाई करणे सोपे होईल."
                    : "Describe the issue clearly so maintenance inspectors can act promptly."}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {isMr ? "तक्रारीचा विषय" : "Complaint Subject / Title"} <span className="text-red-500 font-bold ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={
                      isMr
                        ? "उदा. शिवाजी चौकाजवळ मुख्य जलवाहिनीची मोठी गळती व रस्ता खचणे"
                        : "e.g. Major drinking water pipeline leak near Shivaji Chowk"
                    }
                    className="w-full h-11 px-3.5 text-xs sm:text-sm bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {isMr ? "तक्रारीचे सविस्तर वर्णन" : "Detailed Grievance Description"} <span className="text-red-500 font-bold ml-0.5">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={
                      isMr
                        ? "नेमके ठिकाण, समस्येचा कालावधी (किती दिवसांपासून), नागरिकांना होणारा त्रास व संभाव्य धोके नमूद करा..."
                        : "Describe the exact location, duration of the issue, severity, and any hazards..."
                    }
                    className="w-full p-3.5 text-xs sm:text-sm bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs flex items-center gap-1.5 hover:bg-slate-50 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{isMr ? "मागे जा" : "Back"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!title.trim() || !description.trim()}
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <span>{isMr ? "पुढील पायरीवर जा (फोटो जोडा)" : "Proceed to Photos"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════ */}
          {/* STEP 3: CLOUDINARY MEDIA UPLOAD */}
          {/* ══════════════════════════════════════════════════════════ */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary-light px-2.5 py-0.5 rounded-md">
                  {isMr ? `पायरी ३ / एकूण ${totalSteps}` : `Step 3 of ${totalSteps}`}
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-2">
                  {isMr ? "घटनास्थळाची छायाचित्रे जोडा" : "Upload Supporting Photographs"}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isMr
                    ? "खड्डे, कचरा, किंवा पाणी गळतीचे थेट फोटो जोडा (Cloudinary द्वारे सुरक्षितपणे साठवले जातात)."
                    : "Attach site photos of the pothole, overflow, or defect (Uploaded securely via Cloudinary)."}
                </p>
              </div>

              {/* Hidden File Input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                multiple
                className="hidden"
              />

              {/* Drag and Drop / Select Box */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-primary rounded-2xl p-6 text-center bg-slate-50 hover:bg-primary-light/30 transition-all cursor-pointer group"
              >
                {isUploading ? (
                  <div className="py-4 space-y-2">
                    <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
                    <div className="text-xs font-bold text-slate-700">
                      {isMr ? "फोटो सुरक्षितपणे अपलोड व ऑप्टिमाइझ होत आहेत..." : "Uploading to Cloudinary & optimizing WebP..."}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-2xs border border-slate-200 flex items-center justify-center mx-auto text-primary group-hover:scale-105 transition-transform">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div className="text-xs font-bold text-slate-800">
                      {isMr ? "फोटो निवडण्यासाठी येथे क्लिक करा किंवा ड्रॅग करा" : "Click to choose or drop site photos"}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {isMr ? "JPG, PNG, WebP (प्रत्येकी कमाल ५ MB, जास्तीत जास्त ५ फोटो)" : "JPG, PNG, WebP up to 5MB each (Max 5 photos)"}
                    </div>
                  </div>
                )}
              </div>

              {uploadError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Uploaded Thumbnails Preview */}
              {images.length > 0 && (
                <div>
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>{isMr ? `जोडलेले फोटो पुरावे (${images.length})` : `Uploaded Photo Evidence (${images.length})`}</span>
                    <span className="text-[10px] text-emerald-700 font-semibold">
                      {isMr ? "क्लाउडवर सुरक्षित ✓" : "Cloudinary Hosted ✓"}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                    {images.map((img, idx) => (
                      <div
                        key={idx}
                        className="aspect-square rounded-xl overflow-hidden border border-slate-200 relative bg-slate-100 group shadow-2xs"
                      >
                        <img
                          src={img}
                          alt="Grievance Evidence"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 bg-black/70 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          title={isMr ? "फोटो काढा" : "Remove photo"}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1 rounded">
                          #{idx + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs flex items-center gap-1.5 hover:bg-slate-50 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{isMr ? "मागे जा" : "Back"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  disabled={isUploading}
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <span>{isMr ? "पुढील पायरीवर जा (ठिकाण व प्रभाग)" : "Proceed to Location"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════ */}
          {/* STEP 4: LOCATION & WARD (+ DIRECT SUBMIT IF LOGGED IN) */}
          {/* ══════════════════════════════════════════════════════════ */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary-light px-2.5 py-0.5 rounded-md">
                  {isMr ? `पायरी ४ / एकूण ${totalSteps}` : `Step 4 of ${totalSteps}`}
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-2">
                  {isMr ? "प्रभाग व ठिकाण" : "Location & Municipal Ward"}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isMr
                    ? "घटनास्थळाच्या प्रत्यक्ष पाहणीसाठी प्रभाग क्रमांक आणि परिसराची खूण (Landmark) नमूद करा."
                    : "Specify the municipal ward and exact street landmark for on-site field inspection."}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {isMr ? "प्रभाग क्रमांक" : "Municipal Ward"} <span className="text-red-500 font-bold ml-0.5">*</span>
                  </label>
                  <select
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    className="w-full h-11 px-3.5 text-xs sm:text-sm bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800"
                  >
                    {WARDS.map((w) => (
                      <option key={w.id} value={w.en}>
                        {isMr ? w.mr : w.en}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {isMr ? "रस्ता किंवा परिसराची खूण" : "Street Address / Nearby Landmark"} <span className="text-red-500 font-bold ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder={
                      isMr
                        ? "उदा. सेंट जोसेफ कॉन्व्हेंट गेट समोर, जुना खंडाळा रोड"
                        : "e.g. Opposite St. Joseph Convent Gate, Old Khandala Road"
                    }
                    className="w-full h-11 px-3.5 text-xs sm:text-sm bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                {isLoggedIn && (
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>{isMr ? "प्रमाणित नागरिक थेट नोंदणी" : "Authenticated Citizen Submission"}</span>
                    </div>
                    <div className="text-[11px] text-emerald-700">
                      {isMr
                        ? `तुमच्या सत्यापित खात्याद्वारे (${currentUser?.name}, ${currentUser?.phone}) ही तक्रार तात्काळ दाखल केली जाईल.`
                        : `Grievance will be registered and tracked under your verified citizen account (${currentUser?.name}, ${currentUser?.phone}).`}
                    </div>
                  </div>
                )}

                {otpError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{otpError}</span>
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs flex items-center gap-1.5 hover:bg-slate-50 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{isMr ? "मागे जा" : "Back"}</span>
                </button>

                {isLoggedIn ? (
                  /* If logged in: DIRECT SUBMIT BUTTON ON STEP 4 */
                  <button
                    type="button"
                    onClick={handleDirectSubmitForLoggedInUser}
                    disabled={submitting || !landmark.trim()}
                    className="px-8 py-2.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-colors cursor-pointer"
                  >
                    {submitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ShieldCheck className="w-4 h-4" />
                    )}
                    <span>
                      {submitting
                        ? isMr
                          ? "तक्रार दाखल होत आहे..."
                          : "Submitting Grievance..."
                        : isMr
                        ? "तक्रार दाखल करा"
                        : "Submit Grievance"}
                    </span>
                  </button>
                ) : (
                  /* If not logged in: PROCEED TO STEP 5 */
                  <button
                    type="button"
                    onClick={() => setStep(5)}
                    disabled={!landmark.trim()}
                    className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <span>{isMr ? "पडताळणीसाठी पुढे जा" : "Proceed to Verification"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════ */}
          {/* STEP 5: CONTACT & OTP VERIFICATION (GUESTS ONLY) */}
          {/* ══════════════════════════════════════════════════════════ */}
          {!isLoggedIn && step === 5 && (
            <form onSubmit={handleGuestSubmit} className="space-y-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary-light px-2.5 py-0.5 rounded-md">
                  {isMr ? `पायरी ५ / एकूण ५` : `Step 5 of 5`}
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-2">
                  {isMr ? "नागरिक संपर्क व पडताळणी" : "Citizen Contact & Verification"}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isMr
                    ? "एसएमएसद्वारे थेट तक्रार स्थिती आणि निवारणाचे संदेश मिळवण्यासाठी तुमचा संपर्क तपशील भरा."
                    : "Enter your contact information for receiving live SMS tracking alerts and resolution updates."}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {isMr ? "नागरिकाचे पूर्ण नाव" : "Full Legal Name"} <span className="text-red-500 font-bold ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={citizenName}
                    onChange={(e) => setCitizenName(e.target.value)}
                    placeholder={isMr ? "उदा. रमेश पाटील" : "e.g. Ramesh Patil"}
                    className="w-full h-11 px-3.5 text-xs sm:text-sm bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      {isMr ? "१० अंकी मोबाईल क्रमांक" : "Mobile Number (10 digits)"} <span className="text-red-500 font-bold ml-0.5">*</span>
                    </label>
                    <div className="flex items-center h-11 border border-border rounded-xl bg-white focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary px-3">
                      <span className="text-xs font-bold text-slate-500 pr-2 border-r border-slate-200">
                        +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        required
                        value={citizenMobile}
                        onChange={(e) => setCitizenMobile(e.target.value)}
                        placeholder="9876543210"
                        className="w-full pl-2 text-xs sm:text-sm bg-transparent focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      {isMr ? "ई-मेल आयडी (ऐच्छिक)" : "Email Address (Optional)"}
                    </label>
                    <input
                      type="email"
                      value={citizenEmail}
                      onChange={(e) => setCitizenEmail(e.target.value)}
                      placeholder="citizen@example.com"
                      className="w-full h-11 px-3.5 text-xs sm:text-sm bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                </div>

                {/* OTP Input Field shown when user clicks Verify & Submit */}
                {showOtpInput && (
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2 animate-in fade-in duration-200">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                      <Smartphone className="w-4 h-4 text-emerald-600" />
                      <span>{isMr ? "६ अंकी पडताळणी ओटीपी टाका (चाचणीसाठी: 123456)" : "Enter 6-digit OTP (For testing, enter: 123456)"}</span>
                    </div>
                    <input
                      type="text"
                      maxLength={6}
                      autoFocus
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value)}
                      placeholder={isMr ? "६ अंकी OTP टाका (123456)" : "Enter 6-digit OTP (123456)"}
                      className="w-full max-w-xs h-11 px-3.5 text-sm bg-white border border-emerald-300 rounded-xl text-center tracking-widest font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                )}

                {otpError && (
                  <p className="text-xs font-semibold text-red-600 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{otpError}</span>
                  </p>
                )}
              </div>

              <div className="pt-2 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs flex items-center gap-1.5 hover:bg-slate-50 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{isMr ? "मागे जा" : "Back"}</span>
                </button>
                <button
                  type="submit"
                  disabled={submitting || !citizenName.trim() || !citizenMobile.trim()}
                  className="px-8 py-2.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-colors cursor-pointer"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ShieldCheck className="w-4 h-4" />
                  )}
                  <span>
                    {submitting
                      ? isMr
                        ? "पडताळणी व नोंदणी होत आहे..."
                        : "Verifying & Lodging Grievance..."
                      : showOtpInput
                      ? isMr
                        ? "ओटीपी निश्चित करा व तक्रार नोंदवा"
                        : "Confirm OTP & Lodge Grievance"
                      : isMr
                      ? "ओटीपी पाठवा व तक्रार दाखल करा"
                      : "Verify OTP & Submit Grievance"}
                  </span>
                </button>
              </div>
            </form>
          )}

          {/* ══════════════════════════════════════════════════════════ */}
          {/* STEP 6: SUCCESS ACKNOWLEDGEMENT */}
          {/* ══════════════════════════════════════════════════════════ */}
          {step === 6 && (
            <div className="text-center py-6 space-y-6 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                  {isMr ? "नोंदणी यशस्वी" : "Registration Successful"}
                </span>
                <h2 className="text-2xl font-black text-slate-900 mt-3">
                  {isMr ? "तक्रार यशस्वीरित्या नोंदवली गेली!" : "Grievance Lodged Successfully"}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
                  {isMr
                    ? `तुमची तक्रार ${selectedCategory.departmentMr} कडे वर्ग करण्यात आली आहे. तक्रारीच्या प्रगतीचे एसएमएस तुम्हाला पाठवले जातील.`
                    : `Your complaint has been forwarded to ${selectedCategory.departmentEn}. You will receive SMS alerts on progress.`}
                </p>
              </div>

              {/* Reference Number Box */}
              <div className="bg-primary-surface border-2 border-dashed border-primary rounded-2xl p-5 max-w-md mx-auto">
                <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                  {isMr ? "अधिकृत तक्रार संदर्भ टोकन क्रमांक" : "Official Grievance Reference Number"}
                </div>
                <div className="text-2xl font-mono font-black text-primary tracking-wider mt-1">
                  {registeredRef}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  {isMr
                    ? "थेट स्थिती तपासण्यासाठी व चौकशीसाठी हा संदर्भ क्रमांक जतन करून ठेवा."
                    : "Please save this number for live tracking and helpline inquiries."}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={handleDownloadReceipt}
                  className="px-6 py-3 rounded-xl bg-white border border-primary text-primary hover:bg-primary-light font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>
                    {receiptDownloaded
                      ? isMr
                        ? "पावती डाउनलोड झाली ✓"
                        : "Receipt Downloaded ✓"
                      : isMr
                      ? "अधिकृत पावती डाउनलोड करा"
                      : "Download Official Receipt"}
                  </span>
                </button>

                <Link
                  href={`/grievance/track?ref=${registeredRef}`}
                  className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-colors cursor-pointer"
                >
                  <span>{isMr ? "थेट स्थिती तपासा" : "Track Live Status"}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
