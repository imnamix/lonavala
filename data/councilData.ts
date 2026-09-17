import { CouncilMember } from "@/types";

export const INITIAL_COUNCIL_MEMBERS: CouncilMember[] = [];

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
