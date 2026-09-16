"use client";

import { useState } from "react";
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
  FileCheck,
  Smartphone,
  Check,
} from "lucide-react";
import { addGrievance } from "@/data/grievanceStore";

const CATEGORIES_WITH_DEPTS = [
  { category: "Water Supply & Leakage", department: "Water Supply & Drainage" },
  { category: "Streetlight Outage & Electric Poles", department: "Public Works (PWD)" },
  { category: "Garbage Dumping & Sanitation", department: "Health & Sanitation" },
  { category: "Road Potholes & Footpaths", department: "Public Works (PWD)" },
  { category: "Drainage Choke & Sewage Overflow", department: "Water Supply & Drainage" },
  { category: "Illegal Construction & Hill Cutting", department: "Town Planning & Building Permissions" },
  { category: "Property Tax Assessment Query", department: "Revenue & Property Tax" },
  { category: "Stray Dogs & Animal Menace", department: "Health & Sanitation" },
  { category: "Public Garden & Park Maintenance", department: "Public Works (PWD)" },
  { category: "Disaster / Monsoon Tree Fall", department: "Disaster Management Cell" },
];

const WARDS = [
  "Ward 1 - Bangarwadi & Railway Station",
  "Ward 2 - Ryewood & Main Bazaar",
  "Ward 3 - Khandala Ridge & Nagpal Estate",
  "Ward 4 - Valvan & Varsoli Road",
  "Ward 5 - Tungarli & Gold Valley",
];

export default function GrievanceRegisterPage() {
  const router = useRouter();

  // Wizard Step (1 to 5, and 6 is Success)
  const [step, setStep] = useState(1);

  // Form State
  const [category, setCategory] = useState(CATEGORIES_WITH_DEPTS[0].category);
  const [department, setDepartment] = useState(CATEGORIES_WITH_DEPTS[0].department);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f6?auto=format&fit=crop&w=600&q=80",
  ]);
  const [ward, setWard] = useState(WARDS[0]);
  const [landmark, setLandmark] = useState("");
  const [citizenName, setCitizenName] = useState("");
  const [citizenMobile, setCitizenMobile] = useState("");
  const [citizenEmail, setCitizenEmail] = useState("");

  // OTP Simulation State
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  // Completed Grievance Result
  const [registeredRef, setRegisteredRef] = useState("GRV2026001245");
  const [receiptDownloaded, setReceiptDownloaded] = useState(false);

  // Handle Category Select
  const handleCategoryChange = (catName: string) => {
    setCategory(catName);
    const found = CATEGORIES_WITH_DEPTS.find((c) => c.category === catName);
    if (found) setDepartment(found.department);
  };

  // Step 5: Send OTP
  const handleSendOtp = () => {
    if (!citizenMobile || citizenMobile.length < 10) {
      setOtpError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setOtpError("");
    setOtpSent(true);
  };

  // Step 5: Verify OTP & Submit
  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredOtp !== "123456" && enteredOtp.length !== 6) {
      setOtpError("Invalid OTP. Enter '123456' for verification.");
      return;
    }

    // Add grievance to mock store
    const created = addGrievance({
      title: title || "Civic Complaint regarding " + category,
      description: description || "Reported civic issue requiring immediate municipal attention.",
      category,
      department,
      citizenName: citizenName || "Citizen",
      citizenMobile,
      citizenEmail: citizenEmail || "citizen@example.com",
      ward,
      landmark: landmark || "Lonavala Municipal Area",
      images,
    });

    setRegisteredRef(created.refNumber);
    setStep(6); // Success Step
  };

  const handleDownloadReceipt = () => {
    setReceiptDownloaded(true);
    const content = `========================================================
LONAVALA MUNICIPAL COUNCIL (LMC)
OFFICIAL GRIEVANCE REDRESSAL ACKNOWLEDGEMENT RECEIPT
========================================================
Reference Number: ${registeredRef}
Date & Time: ${new Date().toLocaleString()}
Citizen Name: ${citizenName}
Mobile: ${citizenMobile}
Email: ${citizenEmail}

Department: ${department}
Category: ${category}
Ward: ${ward}
Location / Landmark: ${landmark}

Title: ${title}
Description: ${description}

Expected SLA Redressal: 48 to 72 Hours
Track Online: https://lonavalamc.gov.in/grievance/track?ref=${registeredRef}
Toll-Free Control Room: 1800-233-0101
========================================================
This is a computer-generated receipt. No physical signature is required.`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `LMC_Receipt_${registeredRef}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const stepLabels = [
    "Category",
    "Complaint Details",
    "Upload Media",
    "Ward Location",
    "OTP Verify",
  ];

  return (
    <div className="py-10">
      {/* Header */}
      <div className="bg-primary-light/60 border-y border-border py-10 mb-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-primary bg-white px-3 py-1 rounded-full border border-border">
            5-Step Public Redressal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary mt-3">
            Register Public Grievance
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Report municipal sanitation, roads, water supply, or streetlight complaints directly to executive officers.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Step Progress Header (Steps 1 to 5) */}
        {step <= 5 && (
          <div className="mb-8">
            <div className="flex items-center justify-between relative mb-2">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0" />
              <div
                className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 transition-all duration-300"
                style={{ width: `${((step - 1) / 4) * 100}%` }}
              />

              {[1, 2, 3, 4, 5].map((s) => (
                <div
                  key={s}
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs relative z-10 transition-all ${
                    s < step
                      ? "bg-primary text-white shadow-xs"
                      : s === step
                      ? "bg-white border-2 border-primary text-primary shadow-md ring-4 ring-primary-light"
                      : "bg-gray-100 text-gray-400 border border-gray-300"
                  }`}
                >
                  {s < step ? <Check className="w-4 h-4" /> : s}
                </div>
              ))}
            </div>

            <div className="flex justify-between text-[11px] font-semibold text-gray-500 px-1">
              {stepLabels.map((lbl, idx) => (
                <span
                  key={idx}
                  className={idx + 1 === step ? "text-primary font-bold" : ""}
                >
                  {lbl}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Wizard Step Forms */}
        <div className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-xs">
          {/* STEP 1: Category + Department */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-text-primary">
                  Step 1: Select Grievance Category & Department
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Choose the issue category. The competent municipal department is mapped automatically.
                </p>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                  Select Complaint Category
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {CATEGORIES_WITH_DEPTS.map((item) => (
                    <button
                      key={item.category}
                      type="button"
                      onClick={() => handleCategoryChange(item.category)}
                      className={`p-3 rounded-xl border text-left text-xs transition-all ${
                        category === item.category
                          ? "border-primary bg-primary-light font-bold text-primary shadow-xs"
                          : "border-gray-200 hover:border-gray-300 text-gray-700"
                      }`}
                    >
                      <div className="font-semibold">{item.category}</div>
                      <div className="text-[10px] text-gray-500 mt-0.5">
                        Dept: {item.department}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-primary-surface p-4 rounded-xl border border-border text-xs">
                <span className="font-bold text-gray-700">Assigned Department: </span>
                <span className="text-primary font-bold">{department}</span>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <span>Proceed to Step 2</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Title + Description */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-text-primary">
                  Step 2: Complaint Title & Detailed Description
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Describe the civic grievance clearly so field inspectors can address it swiftly.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Complaint Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Continuous drinking water leakage on Old Khandala Road"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-border rounded-xl focus:outline-hidden focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Detailed Grievance Description *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Explain exact issue, since how many days, impact on traffic or residents..."
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-border rounded-xl focus:outline-hidden focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold text-xs flex items-center gap-1.5 hover:bg-gray-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!title.trim()}
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <span>Proceed to Step 3</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Upload Images */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-text-primary">
                  Step 3: Upload Supporting Photographs
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Upload clear photos of the defect, garbage pile, or water leak (Max 3 photos).
                </p>
              </div>

              <div className="border-2 border-dashed border-border rounded-2xl p-6 text-center bg-primary-surface hover:bg-primary-light/50 transition-colors">
                <Upload className="w-10 h-10 text-primary mx-auto mb-2" />
                <div className="text-xs font-bold text-gray-800">
                  Drag and drop site photos or browse from device
                </div>
                <div className="text-[11px] text-gray-500 mt-1">
                  JPG, PNG up to 5MB each (Geo-tagged photos preferred)
                </div>
                <button
                  type="button"
                  className="mt-3 px-4 py-2 bg-white border border-border text-xs font-bold text-primary rounded-xl hover:bg-gray-50 shadow-xs"
                >
                  Select Photos
                </button>
              </div>

              {/* Uploaded Thumbnails Preview */}
              <div>
                <div className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Attached Photo Evidence ({images.length})
                </div>
                <div className="flex gap-3">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className="w-24 h-24 rounded-xl overflow-hidden border border-border relative bg-gray-100 shadow-xs"
                    >
                      <img
                        src={img}
                        alt="Evidence"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1 rounded">
                        Photo {idx + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold text-xs flex items-center gap-1.5 hover:bg-gray-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <span>Proceed to Step 4</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Location */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-text-primary">
                  Step 4: Location & Municipal Ward
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Specify the municipal ward and nearby landmark for the maintenance team.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Municipal Ward *
                  </label>
                  <select
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-border rounded-xl focus:outline-hidden focus:border-primary"
                  >
                    {WARDS.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Specific Street Address / Landmark *
                  </label>
                  <input
                    type="text"
                    required
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="e.g. Opposite St. Joseph Convent Gate, Old Khandala Road"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-border rounded-xl focus:outline-hidden focus:border-primary"
                  />
                </div>

                <div className="bg-primary-surface p-4 rounded-xl border border-border flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary shrink-0" />
                  <div className="text-xs text-gray-600">
                    <span className="font-semibold text-gray-900">Geo-coordinates captured: </span>
                    18.7548° N, 73.4062° E (Lonavala, MH)
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold text-xs flex items-center gap-1.5 hover:bg-gray-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(5)}
                  disabled={!landmark.trim()}
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <span>Proceed to Step 5</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: OTP Verification */}
          {step === 5 && (
            <form onSubmit={handleFinalSubmit} className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-text-primary">
                  Step 5: Citizen Contact & OTP Verification
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  We verify your mobile number to send real-time SMS status tracking updates.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={citizenName}
                    onChange={(e) => setCitizenName(e.target.value)}
                    placeholder="Aniket Sharma"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-border rounded-xl focus:outline-hidden focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Mobile Number (10 digits) *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="tel"
                        maxLength={10}
                        required
                        value={citizenMobile}
                        onChange={(e) => setCitizenMobile(e.target.value)}
                        placeholder="9876543210"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-border rounded-xl focus:outline-hidden focus:border-primary"
                      />
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="px-3 py-2 bg-primary-light hover:bg-primary hover:text-white text-primary rounded-xl text-xs font-bold transition-colors shrink-0"
                      >
                        {otpSent ? "Resend" : "Send OTP"}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={citizenEmail}
                      onChange={(e) => setCitizenEmail(e.target.value)}
                      placeholder="citizen@example.com"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-border rounded-xl focus:outline-hidden focus:border-primary"
                    />
                  </div>
                </div>

                {otpSent && (
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2 animate-in fade-in duration-200">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                      <Smartphone className="w-4 h-4 text-primary" />
                      <span>OTP sent to +91 {citizenMobile}. (For testing, enter: 123456)</span>
                    </div>
                    <input
                      type="text"
                      maxLength={6}
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value)}
                      placeholder="Enter 6-digit OTP (123456)"
                      className="w-full max-w-xs px-3.5 py-2 text-sm bg-white border border-emerald-300 rounded-lg text-center tracking-widest font-bold focus:outline-hidden focus:ring-2 focus:ring-primary"
                    />
                  </div>
                )}

                {otpError && (
                  <p className="text-xs font-semibold text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{otpError}</span>
                  </p>
                )}
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold text-xs flex items-center gap-1.5 hover:bg-gray-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  className="px-8 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-colors"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify OTP & Submit Grievance</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 6: Success Acknowledgement Page */}
          {step === 6 && (
            <div className="text-center py-6 space-y-6 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 bg-primary-light text-primary rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary-light px-3 py-1 rounded-full">
                  Registration Successful
                </span>
                <h2 className="text-2xl font-extrabold text-text-primary mt-3">
                  Grievance Lodged Successfully
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-md mx-auto">
                  Your complaint has been forwarded to the <strong>{department}</strong>. You will receive SMS alerts on progress.
                </p>
              </div>

              {/* Prompt Requirement: Success page displays Reference Number GRV2026001245 */}
              <div className="bg-primary-surface border-2 border-dashed border-primary rounded-2xl p-5 max-w-md mx-auto">
                <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                  Official Grievance Reference Number
                </div>
                <div className="text-2xl font-mono font-extrabold text-primary tracking-wider mt-1">
                  {registeredRef}
                </div>
                <div className="text-[11px] text-gray-500 mt-1">
                  Please save this number for live tracking and helpline inquiries.
                </div>
              </div>

              {/* Action Buttons: Download Receipt & Track Status */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={handleDownloadReceipt}
                  className="px-6 py-3 rounded-xl bg-white border border-primary text-primary hover:bg-primary-light font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>{receiptDownloaded ? "Receipt Downloaded ✓" : "Download Receipt"}</span>
                </button>

                <Link
                  href={`/grievance/track?ref=${registeredRef}`}
                  className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-colors"
                >
                  <span>Track Status</span>
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
