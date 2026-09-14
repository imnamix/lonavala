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

export interface Department {
  id: string;
  name: string;
  marathiName: string;
  slug: string;
  icon: string;
  headOfficer: string;
  designation: string;
  email: string;
  phone: string;
  location: string;
  responsibilities: string[];
  services: string[];
  documents: { title: string; size: string; type: string }[];
  overview: string;
  stats: { label: string; value: string }[];
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
  image: string;
  tenure: string;
  committee?: string;
  message?: string;
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

export interface TenderItem {
  id: string;
  tenderId: string;
  title: string;
  department: string;
  deadline: string;
  estimatedCost: string;
  status: "Live" | "Under Evaluation" | "Awarded" | "Closed";
  downloadUrl: string;
  fileSize: string;
  publishedDate: string;
}

export interface RecruitmentVacancy {
  id: string;
  advertisementNo: string;
  postName: string;
  department: string;
  vacancies: number;
  qualification: string;
  lastDate: string;
  status: "Active" | "Scrutiny" | "Result Declared" | "Archived";
  downloadUrl: string;
  payScale: string;
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
