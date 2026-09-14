"use client";

import { Grievance, GrievanceStatus } from "@/types";
import { INITIAL_GRIEVANCES } from "./mockData";

const STORAGE_KEY = "lmc_grievances_v1";

export function getStoredGrievances(): Grievance[] {
  if (typeof window === "undefined") {
    return INITIAL_GRIEVANCES;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_GRIEVANCES));
      return INITIAL_GRIEVANCES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_GRIEVANCES;
  }
}

export function saveGrievances(list: Grievance[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.error("Failed to save grievances to localStorage", err);
  }
}

export function addGrievance(data: {
  title: string;
  description: string;
  category: string;
  department: string;
  citizenName: string;
  citizenMobile: string;
  citizenEmail: string;
  ward: string;
  landmark: string;
  images?: string[];
}): Grievance {
  const current = getStoredGrievances();
  const nextNum = 1245 + current.length;
  const refNumber = `GRV202600${nextNum}`;
  const nowStr = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());

  const newGrievance: Grievance = {
    id: `grv-${Date.now()}`,
    refNumber,
    title: data.title,
    description: data.description,
    category: data.category,
    department: data.department,
    priority: "Medium",
    status: "Submitted",
    citizenName: data.citizenName,
    citizenMobile: data.citizenMobile,
    citizenEmail: data.citizenEmail,
    ward: data.ward,
    landmark: data.landmark,
    images: data.images && data.images.length > 0 ? data.images : [
      "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f6?auto=format&fit=crop&w=600&q=80"
    ],
    timeline: [
      {
        status: "Submitted",
        date: nowStr,
        note: "Grievance successfully registered via Web Portal",
        actor: `Citizen (${data.citizenName})`,
      },
      {
        status: "Acknowledged",
        date: nowStr,
        note: "Automated ticket generated and sent to department queue",
        actor: "System Control",
      }
    ],
    officerRemarks: "Ticket received by Central Grievance Monitoring Cell. Scrutiny in progress.",
    assignedOfficer: "Pending Department Assignment",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const updated = [newGrievance, ...current];
  saveGrievances(updated);
  return newGrievance;
}

export function findGrievanceByRefOrMobile(query: string): Grievance | undefined {
  const q = query.trim().toUpperCase();
  const list = getStoredGrievances();
  return list.find(
    (g) => g.refNumber.toUpperCase() === q || g.citizenMobile.includes(q)
  );
}

export function updateGrievanceStatus(
  id: string,
  newStatus: GrievanceStatus,
  remarks?: string,
  assignedOfficer?: string
): Grievance | undefined {
  const list = getStoredGrievances();
  const index = list.findIndex((g) => g.id === id);
  if (index === -1) return undefined;

  const g = list[index];
  const nowStr = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());

  const newTimeline = [...g.timeline];
  newTimeline.push({
    status: newStatus,
    date: nowStr,
    note: remarks || `Status updated to ${newStatus}`,
    actor: assignedOfficer || g.assignedOfficer || "Admin Officer",
  });

  const updated: Grievance = {
    ...g,
    status: newStatus,
    officerRemarks: remarks || g.officerRemarks,
    assignedOfficer: assignedOfficer || g.assignedOfficer,
    timeline: newTimeline,
    updatedAt: new Date().toISOString(),
  };

  list[index] = updated;
  saveGrievances(list);
  return updated;
}
