import { TenderItem, TenderStatus } from "@/types";

const STORAGE_KEY = "lmc_admin_tenders_records_v1";

export const INITIAL_TENDERS: TenderItem[] = [
  {
    id: "tnd-1",
    tenderId: "LMC/PWD/2025/T-014",
    title: "Supply, Installation & Maintenance of 25 High Mast LED Floodlights at Tourist Junctions",
    marathiTitle: "पर्यटन चौकांमध्ये २५ हाय मास्ट एलईडी फ्लडलाइट्सचा पुरवठा, उभारणी आणि देखभाल",
    department: "Public Works (PWD)",
    category: "Electrical Works",
    deadline: "2025-05-28 17:00",
    openingDate: "2025-05-30 11:00",
    publishedDate: "2025-05-05",
    estimatedCost: "₹1,45,00,000",
    earnestMoneyDeposit: "₹1,45,000",
    tenderFee: "₹5,000",
    status: "Live",
    downloadUrl: "https://mahatenders.gov.in",
    fileName: "LMC_Tender_LED_HighMast_2025.pdf",
    fileSize: "3.4 MB",
    externalPortalUrl: "https://mahatenders.gov.in",
    description:
      "Comprehensive turnkey contract for design, foundation engineering, erection of 16m/20m polygonal steel high-mast poles with energy-efficient IP66 rated LED luminaire clusters, automated astronomical timer panels, and 5-year comprehensive operation & maintenance across key traffic junctions including Kumar Resort Chowk, Khandala Viewpoint, and Ryewood Park.",
    eligibilityCriteria: [
      "Class-A Electrical Contractor licensed by PWD Govt of Maharashtra",
      "Minimum 5 years prior experience in executing municipal high-mast illumination projects",
      "Average annual financial turnover not less than ₹3.00 Crores in preceding 3 financial years",
      "Valid GSTIN registration and ISO 9001:2015 certification for lighting fixtures",
    ],
    contactPerson: "Executive Engineer (Electrical)",
    contactPhone: "+91 2114 273200",
    contactEmail: "pwd.electrical@lonavalamc.gov.in",
    completionPeriod: "90 Days from Work Order",
    isNew: true,
  },
  {
    id: "tnd-2",
    tenderId: "LMC/WTR/2025/T-011",
    title: "Annual Operation & Maintenance of 24 MLD Water Treatment Plant at Tungarli Dam",
    marathiTitle: "तुंगार्ली धरण येथील २४ एमएलडी जलशुद्धीकरण केंद्राचे वार्षिक संचालन व देखभाल",
    department: "Water Supply & Sewerage",
    category: "Water Supply",
    deadline: "2025-05-24 15:00",
    openingDate: "2025-05-26 12:00",
    publishedDate: "2025-05-02",
    estimatedCost: "₹2,10,00,000",
    earnestMoneyDeposit: "₹2,10,000",
    tenderFee: "₹10,000",
    status: "Live",
    downloadUrl: "https://mahatenders.gov.in",
    fileName: "WTP_Tungarli_OandM_Tender_2025.pdf",
    fileSize: "4.1 MB",
    externalPortalUrl: "https://mahatenders.gov.in",
    description:
      "24x7 operation, continuous chemical dosing (PAC/Chlorine), filter backwashing, SCADA telemetry monitoring, raw water pumping station upkeep, sludge drying beds management, and daily potable water quality testing meeting IS 10500 standards for Tungarli reservoir drinking water grid.",
    eligibilityCriteria: [
      "Specialized Water Works Contractor with experience in operating ≥15 MLD rapid gravity filtration systems",
      "Must deploy qualified Environmental/Chemical Engineer and licensed pump operators",
      "Valid NABL accredited lab testing partnership for secondary chemical assay verification",
    ],
    contactPerson: "Water Supply Superintendent",
    contactPhone: "+91 2114 273204",
    contactEmail: "watersupply@lonavalamc.gov.in",
    completionPeriod: "365 Days (1 Year)",
    isNew: true,
  },
  {
    id: "tnd-3",
    tenderId: "LMC/HLT/2025/T-009",
    title: "Lease of Hydraulic Waste Compactor Trucks (6 Nos) for Solid Waste Door-to-Door Collection",
    marathiTitle: "घनकचरा घरोघरी गोळा करण्यासाठी हायड्रॉलिक कॉम्पॅक्टर ट्रक (६ नग) भाडेतत्त्वावर घेणे",
    department: "Health & Sanitation",
    category: "Sanitation & Waste",
    deadline: "2025-05-18 16:00",
    openingDate: "2025-05-20 11:30",
    publishedDate: "2025-04-20",
    estimatedCost: "₹95,00,000",
    earnestMoneyDeposit: "₹95,000",
    tenderFee: "₹3,500",
    status: "Under Evaluation",
    downloadUrl: "https://mahatenders.gov.in",
    fileName: "Compactor_Trucks_Sanitation_Tender.pdf",
    fileSize: "2.8 MB",
    externalPortalUrl: "https://mahatenders.gov.in",
    description:
      "Hiring of 6 units BS-VI compliant 6-cubic-meter hydraulic refuse compactor vehicles with integrated bin-lifters, GPS live tracking transponders, driver-crew provisioning, and daily route execution across all 5 municipal administrative zones.",
    eligibilityCriteria: [
      "Fleet operators owning minimum 10 commercial utility vehicles with commercial permits",
      "Zero environmental non-compliance penalty record under SWM Rules 2016",
    ],
    contactPerson: "Chief Sanitary Inspector",
    contactPhone: "+91 2114 273208",
    contactEmail: "sanitation@lonavalamc.gov.in",
    completionPeriod: "24 Months Contract",
    isNew: false,
  },
  {
    id: "tnd-4",
    tenderId: "LMC/IT/2025/T-004",
    title: "Design, Implementation & 5-Year Maintenance of Centralized GIS Property Tax Portal",
    marathiTitle: "केंद्रीकृत जीआयएस मालमत्ता कर पोर्टलचे डिझाइन, अंमलबजावणी आणि ५ वर्षांची देखभाल",
    department: "IT & e-Governance",
    category: "IT & Services",
    deadline: "2025-04-30 18:00",
    openingDate: "2025-05-02 15:00",
    publishedDate: "2025-04-01",
    estimatedCost: "₹78,00,000",
    earnestMoneyDeposit: "₹80,000",
    tenderFee: "₹5,000",
    status: "Awarded",
    downloadUrl: "https://mahatenders.gov.in",
    fileName: "GIS_PropertyTax_System_RFP.pdf",
    fileSize: "5.2 MB",
    externalPortalUrl: "https://mahatenders.gov.in",
    description:
      "Full stack drone ortho-imagery mapping, 3D property footprint digitization, citizen self-assessment tax calculator, integrated payment gateway with BBPS support, and mobile surveyor auditing app for LMC revenue department.",
    eligibilityCriteria: [
      "CMMI Level 3 / ISO 27001 certified technology solution company",
      "Experience in executing GIS property taxation software for at least two ULBs in Maharashtra",
    ],
    awardedTo: "GeoInfra Tech Solutions Pvt Ltd",
    awardedAmount: "₹74,50,000",
    awardDate: "2025-05-06",
    contactPerson: "IT Nodal Officer",
    contactPhone: "+91 2114 273215",
    contactEmail: "it@lonavalamc.gov.in",
    completionPeriod: "6 Months Development + 5 Yrs SLA",
    isNew: false,
  },
  {
    id: "tnd-5",
    tenderId: "LMC/GARDEN/2025/T-003",
    title: "Beautification and Landscaping of Shivaji Maharaj Statue Circle & Fountain Promenade",
    marathiTitle: "शिवाजी महाराज पुतळा चौक आणि कारंजे परिसराचे सुशोभीकरण व लँडस्केपिंग",
    department: "Public Works (PWD)",
    category: "Civil Works",
    deadline: "2025-04-15 14:00",
    openingDate: "2025-04-16 11:00",
    publishedDate: "2025-03-20",
    estimatedCost: "₹48,00,000",
    earnestMoneyDeposit: "₹50,000",
    tenderFee: "₹2,500",
    status: "Closed",
    downloadUrl: "https://mahatenders.gov.in",
    fileName: "Statue_Circle_Beautification_Works.pdf",
    fileSize: "1.9 MB",
    externalPortalUrl: "https://mahatenders.gov.in",
    description:
      "Civil granite tiling, installation of decorative brass railings, architectural RGB fountain lighting, endemic horticultural shrub plantations, drip irrigation installation, and paved walking promenade.",
    awardedTo: "Sahyadri Landscape & Constructions",
    awardedAmount: "₹46,20,000",
    awardDate: "2025-04-22",
    contactPerson: "Garden Superintendent",
    contactPhone: "+91 2114 273200",
    contactEmail: "gardens@lonavalamc.gov.in",
    completionPeriod: "60 Days",
    isNew: false,
  },
];

function getStoredTenders(): TenderItem[] {
  if (typeof window === "undefined") return INITIAL_TENDERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TENDERS));
      return INITIAL_TENDERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Error reading tenders from storage:", e);
    return INITIAL_TENDERS;
  }
}

function saveStoredTenders(tenders: TenderItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tenders));
  } catch (e) {
    console.error("Error saving tenders to storage:", e);
  }
}

export interface TenderQueryParams {
  search?: string;
  department?: string;
  category?: string;
  status?: string;
  sortBy?: "deadline" | "publishedDate" | "cost" | "tenderId";
  sortOrder?: "asc" | "desc";
}

export async function getAllTenders(params?: TenderQueryParams): Promise<TenderItem[]> {
  const tenders = getStoredTenders();
  if (!params) return tenders;

  let result = [...tenders];

  if (params.search && params.search.trim()) {
    const q = params.search.toLowerCase().trim();
    result = result.filter(
      (t) =>
        t.tenderId.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        (t.marathiTitle && t.marathiTitle.toLowerCase().includes(q)) ||
        t.department.toLowerCase().includes(q) ||
        (t.category && t.category.toLowerCase().includes(q)) ||
        (t.awardedTo && t.awardedTo.toLowerCase().includes(q))
    );
  }

  if (params.department && params.department !== "All") {
    result = result.filter((t) => t.department === params.department);
  }

  if (params.category && params.category !== "All") {
    result = result.filter((t) => t.category === params.category);
  }

  if (params.status && params.status !== "All") {
    result = result.filter((t) => t.status === params.status);
  }

  if (params.sortBy) {
    result.sort((a, b) => {
      let comparison = 0;
      if (params.sortBy === "deadline") {
        comparison = new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      } else if (params.sortBy === "publishedDate") {
        comparison = new Date(a.publishedDate).getTime() - new Date(b.publishedDate).getTime();
      } else if (params.sortBy === "tenderId") {
        comparison = a.tenderId.localeCompare(b.tenderId);
      } else if (params.sortBy === "cost") {
        const costA = parseFloat(a.estimatedCost.replace(/[^0-9.]/g, "")) || 0;
        const costB = parseFloat(b.estimatedCost.replace(/[^0-9.]/g, "")) || 0;
        comparison = costA - costB;
      }
      return params.sortOrder === "desc" ? -comparison : comparison;
    });
  }

  return result;
}

export async function getTenderById(id: string): Promise<TenderItem | null> {
  const tenders = getStoredTenders();
  return tenders.find((t) => t.id === id || t.tenderId === id) || null;
}

export async function createTender(payload: Omit<TenderItem, "id">): Promise<TenderItem> {
  const tenders = getStoredTenders();
  const newTender: TenderItem = {
    ...payload,
    id: `tnd-${Date.now()}`,
    isNew: true,
  };
  const updated = [newTender, ...tenders];
  saveStoredTenders(updated);
  return newTender;
}

export async function updateTender(
  id: string,
  payload: Partial<TenderItem>
): Promise<TenderItem> {
  const tenders = getStoredTenders();
  const index = tenders.findIndex((t) => t.id === id || t.tenderId === id);
  if (index === -1) {
    throw new Error(`Tender with ID ${id} not found.`);
  }
  const updatedTender: TenderItem = {
    ...tenders[index],
    ...payload,
    id: tenders[index].id, // Ensure id is preserved
  };
  tenders[index] = updatedTender;
  saveStoredTenders(tenders);
  return updatedTender;
}

export async function deleteTender(id: string): Promise<boolean> {
  const tenders = getStoredTenders();
  const filtered = tenders.filter((t) => t.id !== id && t.tenderId !== id);
  saveStoredTenders(filtered);
  return true;
}

export async function toggleTenderStatus(
  id: string,
  status: TenderStatus
): Promise<TenderItem> {
  return updateTender(id, { status });
}

export async function duplicateTender(id: string): Promise<TenderItem> {
  const tender = await getTenderById(id);
  if (!tender) {
    throw new Error(`Tender not found with ID ${id}`);
  }

  const deptCode = tender.department.split(" ")[0].toUpperCase().slice(0, 3) || "GEN";
  const randomNum = Math.floor(100 + Math.random() * 900);
  const newTenderId = `LMC/${deptCode}/${new Date().getFullYear()}/T-${randomNum}`;

  const duplicated: Omit<TenderItem, "id"> = {
    ...tender,
    tenderId: newTenderId,
    title: `Copy of ${tender.title}`,
    status: "Live",
    publishedDate: new Date().toISOString().split("T")[0],
    isNew: true,
  };

  return createTender(duplicated);
}

export const TENDER_DEPARTMENTS = [
  "Public Works (PWD)",
  "Water Supply & Sewerage",
  "Health & Sanitation",
  "Town Planning & Building Permissions",
  "Garden & Tree Authority",
  "IT & e-Governance",
  "Electrical & Street Lighting",
  "Disaster Management Cell",
  "Fire & Emergency Services",
  "Revenue & Property Tax",
  "General Administration",
];

export const TENDER_CATEGORIES = [
  "Civil Works",
  "Electrical Works",
  "Water Supply",
  "Sanitation & Waste",
  "IT & Services",
  "Procurement & Supply",
  "Consultancy & Planning",
  "Security & Manpower",
  "Facility Maintenance",
];
