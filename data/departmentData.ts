import { Department } from "@/types";
import { DEPARTMENTS } from "@/data/mockData";

export const INITIAL_DEPARTMENTS: Department[] = DEPARTMENTS;

const STORAGE_KEY = "lmc_departments_data";

export function getDepartments(): Department[] {
  if (typeof window === "undefined") {
    return INITIAL_DEPARTMENTS;
  }
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Failed to load departments from localStorage", err);
  }
  return INITIAL_DEPARTMENTS;
}

export function saveDepartments(departments: Department[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(departments));
  } catch (err) {
    console.error("Failed to save departments to localStorage", err);
  }
}

export function getDepartmentById(idOrSlug: string): Department | undefined {
  const departments = getDepartments();
  return departments.find((d) => d.id === idOrSlug || d.slug === idOrSlug);
}

export function saveOrUpdateDepartment(dept: Department): Department[] {
  const departments = getDepartments();
  const index = departments.findIndex((d) => d.id === dept.id || d.slug === dept.slug);
  let updated: Department[];
  if (index >= 0) {
    updated = [...departments];
    updated[index] = dept;
  } else {
    updated = [...departments, dept];
  }
  saveDepartments(updated);
  return updated;
}

export function deleteDepartmentById(id: string): Department[] {
  const departments = getDepartments();
  const updated = departments.filter((d) => d.id !== id);
  saveDepartments(updated);
  return updated;
}

export function resetDepartmentsData(): Department[] {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
  return INITIAL_DEPARTMENTS;
}
