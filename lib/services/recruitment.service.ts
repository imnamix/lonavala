import { RecruitmentVacancy, RecruitmentStatus } from "@/types";

const STORAGE_KEY = "lmc_admin_recruitment_records_v1";

export const INITIAL_RECRUITMENTS: RecruitmentVacancy[] = [
  {
    id: "rec-1",
    advertisementNo: "LMC/EST/01/2025",
    postName: "Junior Engineer (Civil) - Grade B",
    marathiPostName: "कनिष्ठ अभियंता (स्थापत्य) - श्रेणी ब",
    department: "Public Works (PWD)",
    grade: "Grade B",
    vacancies: 3,
    categoryBreakdown: "Open: 1, OBC: 1, SC: 1",
    qualification: "Degree / Diploma in Civil Engineering from a recognized university or institute",
    experience: "Minimum 2 years field experience in municipal civil or roads infrastructure",
    ageLimit: "18 to 38 years (5 years relaxation for reserved categories)",
    publishedDate: "2025-05-01",
    lastDate: "2025-06-15",
    examDate: "2025-07-10",
    status: "Active",
    downloadUrl: "https://mahaonline.gov.in",
    fileName: "LMC_Advt_JE_Civil_2025.pdf",
    fileSize: "1.8 MB",
    payScale: "S-14: ₹38,600 - ₹1,22,800",
    applicationFee: "General / EWS: ₹500 | Reserved: ₹300",
    applyUrl: "https://mahaonline.gov.in",
    selectionProcess: "Computer Based Written Test (100 marks) + Educational Merit & Document Scrutiny",
    instructions:
      "Candidates must submit applications through MahaOnline portal. MSCIT certificate is mandatory within probationary period. Selected candidates will be on 2 years probation under Maharashtra Municipal Services.",
    contactEmail: "recruitment@lonavalamc.gov.in",
    contactPhone: "+91 2114 273200",
    isNew: true,
  },
  {
    id: "rec-2",
    advertisementNo: "LMC/EST/02/2025",
    postName: "Sanitary Inspector - Grade C",
    marathiPostName: "स्वच्छता निरीक्षक - श्रेणी क",
    department: "Health & Sanitation",
    grade: "Grade C",
    vacancies: 4,
    categoryBreakdown: "Open: 2, OBC: 1, EWS: 1",
    qualification: "Diploma in Sanitary Inspector Course from AIILSG / recognized board + MSCIT",
    experience: "1 year experience in urban local body solid waste management preferred",
    ageLimit: "18 to 38 years",
    publishedDate: "2025-05-01",
    lastDate: "2025-06-15",
    examDate: "2025-07-12",
    status: "Active",
    downloadUrl: "https://mahaonline.gov.in",
    fileName: "LMC_Advt_Sanitary_Inspector_2025.pdf",
    fileSize: "1.4 MB",
    payScale: "S-10: ₹29,200 - ₹92,300",
    applicationFee: "General / OBC: ₹500 | Reserved: ₹300",
    applyUrl: "https://mahaonline.gov.in",
    selectionProcess: "Written Test (Technical Subject 60% + General Studies 40%)",
    instructions:
      "Valid Sanitary Inspector diploma recognized by Maharashtra Directorate of Municipal Administration is mandatory at time of application.",
    contactEmail: "sanitation.recruit@lonavalamc.gov.in",
    contactPhone: "+91 2114 273208",
    isNew: true,
  },
  {
    id: "rec-3",
    advertisementNo: "LMC/EST/04/2024",
    postName: "Fire Operator / Driver - Grade C",
    marathiPostName: "अग्निशामक / चालक - श्रेणी क",
    department: "Fire & Emergency Services",
    grade: "Grade C",
    vacancies: 8,
    categoryBreakdown: "Open: 3, OBC: 2, SC: 1, ST: 1, EWS: 1",
    qualification: "10th Standard Pass + Heavy Motor Vehicle (HMV) Driving License + State Fire Academy Course Certificate",
    experience: "Minimum 1 year heavy emergency vehicle driving experience",
    ageLimit: "18 to 30 years (Physical fitness norms mandatory)",
    publishedDate: "2024-11-10",
    lastDate: "2024-12-30",
    examDate: "2025-01-20",
    status: "Result Declared",
    downloadUrl: "https://mahaonline.gov.in",
    fileName: "Fire_Operator_Final_Selection_List_2024.pdf",
    fileSize: "2.1 MB",
    resultsUrl: "https://mahaonline.gov.in",
    resultsFileName: "LMC_Fire_Operators_Merit_List.pdf",
    selectedCandidatesCount: 8,
    payScale: "S-8: ₹25,500 - ₹81,100",
    applicationFee: "General: ₹400 | Reserved: ₹250",
    applyUrl: "https://mahaonline.gov.in",
    selectionProcess: "Physical Endurance Test (100m sprint, ladder climbing, hose running) + Driving Skill Assessment",
    instructions:
      "Final merit list of 8 selected candidates has been published. Medical fitness verification scheduled at LMC Municipal Hospital.",
    contactEmail: "fire@lonavalamc.gov.in",
    contactPhone: "+91 2114 273201",
    isNew: false,
  },
  {
    id: "rec-4",
    advertisementNo: "LMC/EST/03/2024",
    postName: "Accounts Officer - Grade B",
    marathiPostName: "लेखा अधिकारी - श्रेणी ब",
    department: "Finance & Accounts",
    grade: "Grade B",
    vacancies: 1,
    categoryBreakdown: "Open (Unreserved): 1",
    qualification: "M.Com / Inter CA / MBA (Finance) from recognized university + Tally Prime certification",
    experience: "3+ years experience in Double Entry Accounting / Municipal Finance Systems",
    ageLimit: "21 to 40 years",
    publishedDate: "2024-10-01",
    lastDate: "2024-11-15",
    examDate: "2024-12-05",
    status: "Archived",
    downloadUrl: "https://mahaonline.gov.in",
    fileName: "Accounts_Officer_Advertisement_2024.pdf",
    fileSize: "1.2 MB",
    resultsUrl: "https://mahaonline.gov.in",
    resultsFileName: "Accounts_Officer_Joining_Order.pdf",
    selectedCandidatesCount: 1,
    payScale: "S-15: ₹41,800 - ₹1,32,300",
    applicationFee: "₹600 for all applicants",
    applyUrl: "https://mahaonline.gov.in",
    selectionProcess: "Written Examination + Technical Interview",
    instructions: "Recruitment cycle successfully concluded. Selected candidate appointed.",
    contactEmail: "accounts@lonavalamc.gov.in",
    contactPhone: "+91 2114 273212",
    isNew: false,
  },
];

function getStoredRecruitments(): RecruitmentVacancy[] {
  if (typeof window === "undefined") return INITIAL_RECRUITMENTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_RECRUITMENTS));
      return INITIAL_RECRUITMENTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Error reading recruitments from storage:", e);
    return INITIAL_RECRUITMENTS;
  }
}

function saveStoredRecruitments(recruitments: RecruitmentVacancy[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recruitments));
  } catch (e) {
    console.error("Error saving recruitments to storage:", e);
  }
}

export interface RecruitmentQueryParams {
  search?: string;
  department?: string;
  grade?: string;
  status?: string;
  sortBy?: "lastDate" | "publishedDate" | "vacancies" | "advertisementNo";
  sortOrder?: "asc" | "desc";
}

export async function getAllRecruitments(
  params?: RecruitmentQueryParams
): Promise<RecruitmentVacancy[]> {
  const list = getStoredRecruitments();
  if (!params) return list;

  let result = [...list];

  if (params.search && params.search.trim()) {
    const q = params.search.toLowerCase().trim();
    result = result.filter(
      (r) =>
        r.advertisementNo.toLowerCase().includes(q) ||
        r.postName.toLowerCase().includes(q) ||
        (r.marathiPostName && r.marathiPostName.toLowerCase().includes(q)) ||
        r.department.toLowerCase().includes(q) ||
        r.qualification.toLowerCase().includes(q) ||
        r.payScale.toLowerCase().includes(q)
    );
  }

  if (params.department && params.department !== "All") {
    result = result.filter((r) => r.department === params.department);
  }

  if (params.grade && params.grade !== "All") {
    result = result.filter((r) => r.grade === params.grade);
  }

  if (params.status && params.status !== "All") {
    result = result.filter((r) => r.status === params.status);
  }

  if (params.sortBy) {
    result.sort((a, b) => {
      let comparison = 0;
      if (params.sortBy === "lastDate") {
        comparison = new Date(a.lastDate).getTime() - new Date(b.lastDate).getTime();
      } else if (params.sortBy === "publishedDate") {
        const dateA = a.publishedDate ? new Date(a.publishedDate).getTime() : 0;
        const dateB = b.publishedDate ? new Date(b.publishedDate).getTime() : 0;
        comparison = dateA - dateB;
      } else if (params.sortBy === "vacancies") {
        comparison = a.vacancies - b.vacancies;
      } else if (params.sortBy === "advertisementNo") {
        comparison = a.advertisementNo.localeCompare(b.advertisementNo);
      }
      return params.sortOrder === "desc" ? -comparison : comparison;
    });
  }

  return result;
}

export async function getRecruitmentById(
  id: string
): Promise<RecruitmentVacancy | null> {
  const list = getStoredRecruitments();
  return list.find((r) => r.id === id || r.advertisementNo === id) || null;
}

export async function createRecruitment(
  payload: Omit<RecruitmentVacancy, "id">
): Promise<RecruitmentVacancy> {
  const list = getStoredRecruitments();
  const newRecruitment: RecruitmentVacancy = {
    ...payload,
    id: `rec-${Date.now()}`,
    isNew: true,
  };
  const updated = [newRecruitment, ...list];
  saveStoredRecruitments(updated);
  return newRecruitment;
}

export async function updateRecruitment(
  id: string,
  payload: Partial<RecruitmentVacancy>
): Promise<RecruitmentVacancy> {
  const list = getStoredRecruitments();
  const index = list.findIndex((r) => r.id === id || r.advertisementNo === id);
  if (index === -1) {
    throw new Error(`Recruitment notice with ID ${id} not found.`);
  }
  const updatedRecruitment: RecruitmentVacancy = {
    ...list[index],
    ...payload,
    id: list[index].id,
  };
  list[index] = updatedRecruitment;
  saveStoredRecruitments(list);
  return updatedRecruitment;
}

export async function deleteRecruitment(id: string): Promise<boolean> {
  const list = getStoredRecruitments();
  const filtered = list.filter((r) => r.id !== id && r.advertisementNo !== id);
  saveStoredRecruitments(filtered);
  return true;
}

export async function toggleRecruitmentStatus(
  id: string,
  status: RecruitmentStatus
): Promise<RecruitmentVacancy> {
  return updateRecruitment(id, { status });
}

export async function duplicateRecruitment(id: string): Promise<RecruitmentVacancy> {
  const recruitment = await getRecruitmentById(id);
  if (!recruitment) {
    throw new Error(`Recruitment not found with ID ${id}`);
  }

  const year = new Date().getFullYear();
  const randomNum = Math.floor(10 + Math.random() * 90);
  const newAdvtNo = `LMC/EST/${randomNum}/${year}`;

  const duplicated: Omit<RecruitmentVacancy, "id"> = {
    ...recruitment,
    advertisementNo: newAdvtNo,
    postName: `Copy of ${recruitment.postName}`,
    status: "Active",
    publishedDate: new Date().toISOString().split("T")[0],
    isNew: true,
  };

  return createRecruitment(duplicated);
}

export const RECRUITMENT_DEPARTMENTS = [
  "Public Works (PWD)",
  "Health & Sanitation",
  "Water Supply & Sewerage",
  "Town Planning & Building Permissions",
  "Fire & Emergency Services",
  "Finance & Accounts",
  "General Administration",
  "IT & e-Governance",
  "Revenue & Property Tax",
  "Garden & Tree Authority",
  "Legal Cell",
];

export const RECRUITMENT_GRADES = [
  "Grade A",
  "Grade B",
  "Grade C",
  "Grade D",
];

export const RECRUITMENT_PAY_SCALES = [
  "S-8: ₹25,500 - ₹81,100",
  "S-10: ₹29,200 - ₹92,300",
  "S-13: ₹35,400 - ₹1,12,400",
  "S-14: ₹38,600 - ₹1,22,800",
  "S-15: ₹41,800 - ₹1,32,300",
  "S-20: ₹56,100 - ₹1,77,500",
  "S-23: ₹67,700 - ₹2,08,700",
];
