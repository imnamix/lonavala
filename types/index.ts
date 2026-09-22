export type GrievanceStatus =
  | "Submitted"
  | "Acknowledged"
  | "Assigned"
  | "In Progress"
  | "Resolved"
  | "Closed";

export interface GrievanceTimelineEvent {
  status: GrievanceStatus;
  date: string;
  note: string;
  actor: string;
}

export interface Grievance {
  id: string;
  refNumber: string;
  title: string;
  description: string;
  category: string;
  department: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  status: GrievanceStatus;
  citizenName: string;
  citizenMobile: string;
  citizenEmail: string;
  ward: string;
  landmark: string;
  images: string[];
  timeline: GrievanceTimelineEvent[];
  officerRemarks?: string;
  assignedOfficer?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentServiceItem {
  title: string;
  link?: string;
}

export interface DepartmentAdditionalInfo {
  title: string;
  description: string;
}

export interface Department {
  id: string;
  code?: string;
  name: string;
  marathiName: string;
  slug: string;
  icon: string;
  headOfficer: string;
  headOfficerImage?: string;
  designation: string;
  email: string;
  phone: string;
  location: string;
  responsibilities: string[];
  services: (DepartmentServiceItem | string)[];
  documents: { title: string; fileUrl: string; url?: string; fileName?: string; size?: string; type?: string }[];
  overview: string;
  stats: { label: string; value: string }[];
  additionalInfo?: DepartmentAdditionalInfo[];
  clerkName?: string;
  clerkPhone?: string;
  clerkMobile?: string;
  clerkEmail?: string;
  isActive?: boolean;
  displayOrder?: number;
}

export interface CitizenService {
  id: string;
  title: string;
  category: string;
  slug: string;
  icon: string;
  description: string;
  eligibility: string[];
  requiredDocuments: string[];
  timeline: string;
  fees: string;
  department: string;
  departmentId: string;
  onlinePortalUrl: string;
  steps: string[];
  contactPerson: string;
}

export interface TourismSpot {
  id: string;
  name: string;
  category: "Attractions" | "Forts" | "Lakes" | "Waterfalls" | "Parks" | "Caves";
  image: string;
  description: string;
  bestTimeToVisit: string;
  timings: string;
  entryFee: string;
  distanceFromStation: string;
  highlights: string[];
  rating: number;
}

export interface CouncilMember {
  id: string;
  name: string;
  designation: string;
  marathiName: string;
  ward?: string;
  phone: string;
  email: string;
  address?: string;
  image: string;
  tenure: string;
  committee?: string;
  message?: string;
  active?: boolean;
  roleCategory?: "President" | "Vice President" | "Corporator" | "Officer" | "Nominated";
}

export interface ProjectGalleryItem {
  id?: string;
  url: string;
  title: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  status: "Ongoing" | "Completed" | "Upcoming";
  progress: number;
  budget: string;
  timeline: string;
  department: string;
  location: string;
  contractor: string;
  description: string;
  image: string;
  highlights: string[];
  gallery?: ProjectGalleryItem[];
}

export interface NoticeItem {
  id: string;
  title: string;
  category: "Notices" | "Circulars" | "Orders" | "News" | "Events";
  date: string;
  department: string;
  refNo: string;
  isNew?: boolean;
  downloadSize?: string;
  description: string;
}

export type TenderStatus = "Live" | "Under Evaluation" | "Awarded" | "Closed" | "Cancelled";

export interface TenderItem {
  id: string;
  tenderId: string;
  title: string;
  marathiTitle?: string;
  department: string;
  category?: string;
  deadline: string;
  openingDate?: string;
  publishedDate: string;
  estimatedCost: string;
  earnestMoneyDeposit?: string;
  tenderFee?: string;
  status: "Live" | "Under Evaluation" | "Awarded" | "Closed" | "Cancelled";
  downloadUrl: string;
  fileName?: string;
  fileSize: string;
  externalPortalUrl?: string;
  description?: string;
  eligibilityCriteria?: string[];
  awardedTo?: string;
  awardedAmount?: string;
  awardDate?: string;
  completionPeriod?: string;
  contactPerson?: string;
  contactPhone?: string;
  contactEmail?: string;
  isNew?: boolean;
}

export type RecruitmentStatus = "Active" | "Scrutiny" | "Exam / Interview" | "Result Declared" | "Archived" | "Cancelled";

export interface RecruitmentVacancy {
  id: string;
  advertisementNo: string;
  postName: string;
  marathiPostName?: string;
  department: string;
  grade?: "Grade A" | "Grade B" | "Grade C" | "Grade D";
  vacancies: number;
  categoryBreakdown?: string;
  qualification: string;
  experience?: string;
  ageLimit?: string;
  lastDate: string;
  publishedDate?: string;
  examDate?: string;
  status: "Active" | "Scrutiny" | "Exam / Interview" | "Result Declared" | "Archived" | "Cancelled";
  downloadUrl: string;
  fileName?: string;
  fileSize?: string;
  payScale: string;
  applicationFee?: string;
  applyUrl?: string;
  selectionProcess?: string;
  instructions?: string;
  resultsUrl?: string;
  resultsFileName?: string;
  selectedCandidatesCount?: number;
  contactEmail?: string;
  contactPhone?: string;
  isNew?: boolean;
}

export interface DownloadDocument {
  id: string;
  title: string;
  category: "Forms" | "Reports" | "Circulars" | "Orders" | "Tender" | "Recruitment";
  fileType: "PDF" | "DOCX" | "XLSX";
  fileSize: string;
  date: string;
  department: string;
  downloadCount: number;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  active?: boolean;
}

export interface CourtCommitteeMember {
  id: string;
  name: string;
  marathiName: string;
  designation: string;
  role: string;
  category?: "Leadership" | "Elected Corporator" | "Legal Officer" | "Legal Aid & Conciliation";
  phone: string;
  email: string;
  ward?: string;
  experience?: string;
  image?: string;
  responsibilities: string[];
}

export interface PanelAdvocate {
  id: string;
  name: string;
  marathiName: string;
  designation: string;
  courtForum: string;
  barRegNo: string;
  specialization: string;
  phone: string;
  email: string;
  officeAddress: string;
  experience: string;
}

export interface CourtCaseItem {
  id: string;
  caseNumber: string;
  cnrNumber: string;
  title: string;
  marathiTitle?: string;
  court: string;
  caseType: string;
  petitioner: string;
  respondent: string;
  subject: string;
  status: "Scheduled for Hearing" | "Interim Stay Vacated" | "In Progress" | "Disposed in Favor of LMC" | "Under Scrutiny";
  nextHearingDate: string;
  advocateAssigned: string;
  summary: string;
}

export interface LokAdalatEvent {
  id: string;
  title: string;
  marathiTitle: string;
  date: string;
  venue: string;
  benchOfficers: string;
  eligibleMatters: string[];
  documentsRequired: string[];
  contactPerson: string;
  status: "Upcoming" | "Completed" | "Registration Open";
}

export interface LegalDocument {
  id: string;
  title: string;
  marathiTitle: string;
  category: "Acts & Rules" | "Forms & Petitions" | "Standing Orders" | "Cause List";
  fileType: "PDF" | "DOCX";
  fileSize: string;
  date: string;
  department: string;
  description: string;
}

export interface StandingCommittee {
  id: string | number;
  name: string;
  marathiName?: string;
  description?: string;
  chairmanId?: number | null;
  chairman?: CouncilMember | null;
  memberIds: number[];
  members?: CouncilMember[];
  isActive?: boolean;
  displayOrder?: number;
  createdDate?: string;
  updatedDate?: string;
}

export interface CouncilResolution {
  id: string | number;
  resolutionNumber?: string;
  title: string;
  marathiTitle?: string;
  meetingType: string;
  resolutionDate?: string;
  durationFrom?: string;
  durationTo?: string;
  description?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  isActive?: boolean;
  displayOrder?: number;
  createdDate?: string;
  updatedDate?: string;
}

