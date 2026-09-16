import { CouncilMember } from "@/types";

export const INITIAL_COUNCIL_MEMBERS: CouncilMember[] = [
  {
    id: "cm-1",
    name: "Smt. Surekha Nitin Jadhav",
    marathiName: "श्रीमती सुरेखा नितीन जाधव",
    designation: "President (नगराध्यक्ष)",
    phone: "+91 2114 273030",
    email: "president@lonavalamc.gov.in",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    tenure: "2022 - 2027",
    committee: "Standing Committee Chairperson",
    message:
      "Welcome to the digital gateway of Lonavala Municipal Council. Our mission is to ensure sustainable hill-station infrastructure, transparent administration, and doorstep civic services for every citizen and tourist.",
    active: true,
    roleCategory: "President",
  },
  {
    id: "cm-2",
    name: "Shri. Rajesh Madhavrao Shinde",
    marathiName: "श्री. राजेश माधवराव शिंदे",
    designation: "Vice President (उपनगराध्यक्ष)",
    phone: "+91 2114 273031",
    email: "vicepresident@lonavalamc.gov.in",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80",
    tenure: "2022 - 2027",
    committee: "Public Works Committee",
    message:
      "Committed to world-class public infrastructure, water conservation, and eco-friendly municipal governance.",
    active: true,
    roleCategory: "Vice President",
  },
  {
    id: "cm-3",
    name: "Shri. Pandit Patil (IAS/State Cadre)",
    marathiName: "श्री. पंडित पाटील",
    designation: "Chief Officer / Commissioner (मुख्याधिकारी)",
    phone: "+91 2114 273032",
    email: "co@lonavalamc.gov.in",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    tenure: "Cadre Posting",
    committee: "Chief Administrative Officer",
    message:
      "Harnessing e-governance to deliver prompt, accountable, and transparent civic amenities in Lonavala.",
    active: true,
    roleCategory: "Officer",
  },
  {
    id: "cm-4",
    name: "Shri. Amit Vilas Gaikwad",
    marathiName: "श्री. अमित विलास गायकवाड",
    designation: "Corporator - Ward 1 (Bangarwadi)",
    ward: "Ward 1 - Bangarwadi & Railway Station",
    phone: "+91 98220 11221",
    email: "ward1@lonavalamc.gov.in",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    tenure: "2022 - 2027",
    committee: "Sanitation & Water Works",
    message: "Dedicated to rapid civic grievance redressal and clean tap water access for all residents of Ward 1.",
    active: true,
    roleCategory: "Corporator",
  },
  {
    id: "cm-5",
    name: "Smt. Priyanka Sagar Kadam",
    marathiName: "श्रीमती प्रियांका सागर कदम",
    designation: "Corporator - Ward 2 (Ryewood & Bazaar)",
    ward: "Ward 2 - Ryewood & Main Bazaar",
    phone: "+91 98220 33442",
    email: "ward2@lonavalamc.gov.in",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80",
    tenure: "2022 - 2027",
    committee: "Education & Health",
    message: "Promoting smart municipal schools, community wellness camps, and heritage market upkeep.",
    active: true,
    roleCategory: "Corporator",
  },
  {
    id: "cm-6",
    name: "Shri. Sunil Tukaram Bhosale",
    marathiName: "श्री. सुनील तुकाराम भोसले",
    designation: "Corporator - Ward 3 (Khandala Side)",
    ward: "Ward 3 - Khandala Ridge & Nagpal Estate",
    phone: "+91 98220 55663",
    email: "ward3@lonavalamc.gov.in",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80",
    tenure: "2022 - 2027",
    committee: "Town Planning Committee",
    message: "Advancing planned residential development, storm drainage management, and road resurfacing.",
    active: true,
    roleCategory: "Corporator",
  },
  {
    id: "cm-7",
    name: "Smt. Kavita Anil Sonawane",
    marathiName: "श्रीमती कविता अनिल सोनवणे",
    designation: "Corporator - Ward 4 (Valvan & Tata Lake)",
    ward: "Ward 4 - Valvan & Varsoli Road",
    phone: "+91 98220 77884",
    email: "ward4@lonavalamc.gov.in",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    tenure: "2022 - 2027",
    committee: "Women & Child Welfare",
    message: "Empowering women through microfinance self-help groups and upgrading Anganwadi facilities.",
    active: true,
    roleCategory: "Corporator",
  },
  {
    id: "cm-8",
    name: "Shri. Deepak Ramesh Pawar",
    marathiName: "श्री. दीपक रमेश पवार",
    designation: "Corporator - Ward 5 (Tungarli)",
    ward: "Ward 5 - Tungarli & Gold Valley",
    phone: "+91 98220 99005",
    email: "ward5@lonavalamc.gov.in",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80",
    tenure: "2022 - 2027",
    committee: "Law & Disaster Management",
    message: "Ensuring monsoon preparedness, landslide mitigation barriers, and round-the-clock safety.",
    active: true,
    roleCategory: "Corporator",
  },
];

const STORAGE_KEY = "lmc_council_members_data";

export function getCouncilMembers(): CouncilMember[] {
  if (typeof window === "undefined") {
    return INITIAL_COUNCIL_MEMBERS;
  }
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Failed to load council members from localStorage", err);
  }
  return INITIAL_COUNCIL_MEMBERS;
}

export function saveCouncilMembers(members: CouncilMember[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
  } catch (err) {
    console.error("Failed to save council members to localStorage", err);
  }
}

export function getCouncilMemberById(id: string): CouncilMember | undefined {
  const members = getCouncilMembers();
  return members.find((m) => m.id === id);
}

export function saveOrUpdateCouncilMember(member: CouncilMember): CouncilMember[] {
  const members = getCouncilMembers();
  const index = members.findIndex((m) => m.id === member.id);
  let updated: CouncilMember[];
  if (index >= 0) {
    updated = [...members];
    updated[index] = member;
  } else {
    updated = [member, ...members];
  }
  saveCouncilMembers(updated);
  return updated;
}

export function deleteCouncilMemberById(id: string): CouncilMember[] {
  const members = getCouncilMembers();
  const updated = members.filter((m) => m.id !== id);
  saveCouncilMembers(updated);
  return updated;
}

export function toggleCouncilMemberActive(id: string): CouncilMember[] {
  const members = getCouncilMembers();
  const updated = members.map((m) =>
    m.id === id ? { ...m, active: m.active === false ? true : false } : m
  );
  saveCouncilMembers(updated);
  return updated;
}

export function resetCouncilMembersData(): CouncilMember[] {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
  return INITIAL_COUNCIL_MEMBERS;
}
