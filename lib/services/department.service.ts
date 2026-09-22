import { apiClient } from "../api-client";
import { Department } from "@/types";

export interface DepartmentDto {
  id: number;
  code?: string;
  name: string;
  marathiName?: string;
  slug: string;
  icon?: string;
  headOfficer?: string;
  headOfficerImage?: string;
  designation?: string;
  email?: string;
  phone?: string;
  location?: string;
  overview?: string;
  responsibilities?: string[];
  services?: { title: string; link?: string }[] | string[];
  documents?: { title: string; fileUrl: string; url?: string; fileName?: string; size?: string; type?: string }[];
  stats?: { label: string; value: string }[];
  additionalInfo?: { title: string; description: string }[];
  clerkName?: string;
  clerkPhone?: string;
  clerkEmail?: string;
  isActive?: boolean;
  displayOrder?: number;
  createdDate?: string;
  updatedDate?: string;
}

export type CreateDepartmentDto = Omit<DepartmentDto, "id" | "createdDate" | "updatedDate">;
export type UpdateDepartmentDto = Partial<CreateDepartmentDto>;

const STORAGE_KEY = "lmc_admin_departments_data_v2";

export function getStoredDepartments(): Department[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Failed to load departments from storage:", err);
  }
  return [];
}

export function saveStoredDepartments(departments: Department[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(departments));
  } catch (err) {
    console.error("Failed to save departments to storage:", err);
  }
}

export function mapDtoToDepartment(dto: DepartmentDto): Department {
  return {
    id: String(dto.id),
    code: dto.code || `dept-${dto.slug}`,
    name: dto.name || "",
    marathiName: dto.marathiName || "",
    slug: dto.slug || "",
    icon: dto.icon || "Building2",
    headOfficer: dto.headOfficer || "",
    headOfficerImage: dto.headOfficerImage || "",
    designation: dto.designation || "",
    email: dto.email || "",
    phone: dto.phone || "",
    location: dto.location || "",
    overview: dto.overview || "",
    responsibilities: Array.isArray(dto.responsibilities) ? dto.responsibilities : [],
    services: Array.isArray(dto.services)
      ? dto.services.map((s: any) =>
          typeof s === "string"
            ? { title: s, link: "" }
            : { title: s?.title || "", link: s?.link || "" }
        )
      : [],
    documents: Array.isArray(dto.documents)
      ? dto.documents.map((d: any) => ({
          title: d.title || "",
          fileUrl: d.fileUrl || d.url || (d as any).path || "",
          url: d.fileUrl || d.url || (d as any).path || "",
          fileName: d.fileName || (d as any).filename || "",
          size: d.size || "",
          type: d.type || "PDF",
        }))
      : [],
    stats: Array.isArray(dto.stats)
      ? dto.stats.map((s) => ({
          label: s.label || "",
          value: s.value || "",
        }))
      : [],
    additionalInfo: Array.isArray(dto.additionalInfo)
      ? dto.additionalInfo
          .filter(
            (a: any) =>
              a &&
              ((typeof a.title === "string" && a.title.trim().length > 0) ||
                (typeof a.description === "string" && a.description.trim().length > 0))
          )
          .map((a: any) => ({
            title: a.title || "",
            description: a.description || "",
          }))
      : [],
    clerkName: dto.clerkName || "",
    clerkPhone: dto.clerkPhone || "",
    clerkMobile: dto.clerkPhone || "",
    clerkEmail: dto.clerkEmail || "",
    isActive: dto.isActive !== undefined ? dto.isActive : true,
    displayOrder: dto.displayOrder ?? 0,
  };
}

export function mapDepartmentToDto(
  dept: Partial<Department>
): UpdateDepartmentDto {
  const dto: UpdateDepartmentDto = {};
  if (dept.name !== undefined) dto.name = dept.name;
  if (dept.marathiName !== undefined) dto.marathiName = dept.marathiName;
  if (dept.slug !== undefined) dto.slug = dept.slug;
  if (dept.code !== undefined) dto.code = dept.code;
  if (dept.icon !== undefined) dto.icon = dept.icon;
  if (dept.headOfficer !== undefined) dto.headOfficer = dept.headOfficer;
  if (dept.headOfficerImage !== undefined) dto.headOfficerImage = dept.headOfficerImage;
  if (dept.designation !== undefined) dto.designation = dept.designation;
  if (dept.email !== undefined) dto.email = dept.email;
  if (dept.phone !== undefined) dto.phone = dept.phone;
  if (dept.location !== undefined) dto.location = dept.location;
  if (dept.overview !== undefined) dto.overview = dept.overview;
  if (dept.responsibilities !== undefined) dto.responsibilities = dept.responsibilities;
  if (dept.services !== undefined) {
    dto.services = (dept.services || [])
      .map((s: any) =>
        typeof s === "string"
          ? { title: s.trim(), link: "" }
          : { title: s?.title?.trim() || "", link: s?.link?.trim() || "" }
      )
      .filter((s: any) => s.title.length > 0);
  }
  if (dept.documents !== undefined) {
    dto.documents = (dept.documents || [])
      .filter(
        (d: any) =>
          d &&
          ((typeof d.fileUrl === "string" && d.fileUrl.trim().length > 0) ||
            (typeof d.url === "string" && d.url.trim().length > 0) ||
            (typeof d.title === "string" && d.title.trim().length > 0))
      )
      .map((d: any) => ({
        title: d.title?.trim() || "Document",
        fileUrl: d.fileUrl || d.url || "",
        url: d.fileUrl || d.url || "",
      }));
  }
  if (dept.stats !== undefined) dto.stats = dept.stats;
  if (dept.additionalInfo !== undefined) {
    dto.additionalInfo = (dept.additionalInfo || [])
      .filter(
        (a: any) =>
          a &&
          ((typeof a.title === "string" && a.title.trim().length > 0) ||
            (typeof a.description === "string" && a.description.trim().length > 0))
      )
      .map((a: any) => ({
        title: a.title?.trim() || "",
        description: a.description || "",
      }));
  }
  if (dept.clerkName !== undefined) dto.clerkName = dept.clerkName;
  if (dept.clerkPhone !== undefined || dept.clerkMobile !== undefined) {
    dto.clerkPhone = dept.clerkPhone || dept.clerkMobile;
  }
  if (dept.clerkEmail !== undefined) dto.clerkEmail = dept.clerkEmail;
  if (dept.isActive !== undefined) dto.isActive = dept.isActive;
  if (dept.displayOrder !== undefined) dto.displayOrder = dept.displayOrder;
  return dto;
}

export async function getAllDepartments(query?: {
  search?: string;
  isActive?: boolean;
}): Promise<Department[]> {
  try {
    const params = new URLSearchParams();
    if (query?.search) params.append("search", query.search);
    if (query?.isActive !== undefined) params.append("isActive", String(query.isActive));

    const url = `/department${params.toString() ? `?${params.toString()}` : ""}`;
    const res = await apiClient.get<DepartmentDto[]>(url, { cache: "no-store" });

    if (res && Array.isArray(res.data)) {
      const mapped = res.data.map(mapDtoToDepartment);
      saveStoredDepartments(mapped);
      return mapped;
    }
  } catch (error) {
    console.warn("API getAllDepartments failed, falling back to storage:", error);
  }

  let list = getStoredDepartments();
  if (query?.isActive !== undefined) {
    list = list.filter((d) => (d.isActive !== undefined ? d.isActive === query.isActive : true));
  }
  if (query?.search && query.search.trim()) {
    const s = query.search.toLowerCase();
    list = list.filter(
      (d) =>
        d.name.toLowerCase().includes(s) ||
        d.marathiName.toLowerCase().includes(s) ||
        d.headOfficer.toLowerCase().includes(s) ||
        (d.clerkName && d.clerkName.toLowerCase().includes(s)) ||
        d.location.toLowerCase().includes(s)
    );
  }
  return list;
}

export async function getDepartmentById(
  idOrSlug: string | number
): Promise<Department | null> {
  const cleanId = String(idOrSlug).replace(/^dept-/, "");
  try {
    const res = await apiClient.get<DepartmentDto>(`/department/${idOrSlug}`, {
      cache: "no-store",
    });
    if (res && res.data) {
      return mapDtoToDepartment(res.data);
    }
  } catch (error) {
    console.warn(`API getDepartmentById(${idOrSlug}) failed:`, error);
  }

  const list = getStoredDepartments();
  const found = list.find(
    (d) =>
      d.id === String(idOrSlug) ||
      d.id === cleanId ||
      d.slug === String(idOrSlug) ||
      d.code === String(idOrSlug)
  );

  return found || null;
}

export async function createDepartment(
  payload: Omit<Department, "id">
): Promise<Department> {
  const createDto = mapDepartmentToDto(payload) as CreateDepartmentDto;
  try {
    const res = await apiClient.post<DepartmentDto>("/department", createDto);
    if (res && res.data) {
      const created = mapDtoToDepartment(res.data);
      const current = getStoredDepartments();
      saveStoredDepartments([...current, created]);
      return created;
    }
  } catch (error) {
    console.warn("API createDepartment failed, saving locally:", error);
  }

  const current = getStoredDepartments();
  const fallbackDept: Department = {
    ...payload,
    id: `dept-${Date.now()}`,
    isActive: payload.isActive ?? true,
    displayOrder: payload.displayOrder ?? current.length + 1,
  };
  saveStoredDepartments([...current, fallbackDept]);
  return fallbackDept;
}

export async function updateDepartment(
  idOrSlug: string | number,
  payload: Partial<Department>
): Promise<Department> {
  const updateDto = mapDepartmentToDto(payload);
  const targetId = payload.id && !isNaN(Number(payload.id)) ? payload.id : idOrSlug;

  try {
    const res = await apiClient.put<DepartmentDto>(
      `/department/${encodeURIComponent(String(targetId))}`,
      updateDto
    );
    if (res && res.data) {
      const updated = mapDtoToDepartment(res.data);
      const current = getStoredDepartments();
      const idx = current.findIndex(
        (d) =>
          d.id === String(idOrSlug) ||
          d.id === String(targetId) ||
          d.slug === String(idOrSlug) ||
          d.slug === payload.slug
      );
      if (idx !== -1) {
        current[idx] = updated;
      } else {
        current.push(updated);
      }
      saveStoredDepartments(current);
      return updated;
    }
  } catch (error) {
    console.warn(`API updateDepartment(${idOrSlug}) failed:`, error);
  }

  const current = getStoredDepartments();
  const index = current.findIndex(
    (d) =>
      d.id === String(idOrSlug) ||
      d.id === String(targetId) ||
      d.slug === String(idOrSlug) ||
      d.slug === payload.slug
  );
  if (index === -1) {
    const fallback: Department = {
      id: String(idOrSlug),
      name: payload.name || "",
      marathiName: payload.marathiName || "",
      slug: payload.slug || String(idOrSlug),
      icon: payload.icon || "Building2",
      headOfficer: payload.headOfficer || "",
      headOfficerImage: payload.headOfficerImage || "",
      designation: payload.designation || "",
      email: payload.email || "",
      phone: payload.phone || "",
      location: payload.location || "",
      overview: payload.overview || "",
      responsibilities: payload.responsibilities || [],
      services: payload.services || [],
      documents: payload.documents || [],
      stats: payload.stats || [],
      clerkName: payload.clerkName || "",
      clerkPhone: payload.clerkPhone || payload.clerkMobile || "",
      clerkMobile: payload.clerkPhone || payload.clerkMobile || "",
      clerkEmail: payload.clerkEmail || "",
      isActive: payload.isActive !== undefined ? payload.isActive : true,
    };
    current.push(fallback);
    saveStoredDepartments(current);
    return fallback;
  }

  const merged: Department = {
    ...current[index],
    ...payload,
  };
  current[index] = merged;
  saveStoredDepartments(current);
  return merged;
}

export async function toggleDepartmentActive(
  idOrSlug: string | number
): Promise<Department> {
  try {
    const res = await apiClient.patch<DepartmentDto>(
      `/department/${encodeURIComponent(String(idOrSlug))}/toggle-active`
    );
    if (res && res.data) {
      const updated = mapDtoToDepartment(res.data);
      const current = getStoredDepartments();
      const idx = current.findIndex(
        (d) => d.id === String(idOrSlug) || d.slug === String(idOrSlug)
      );
      if (idx !== -1) current[idx] = updated;
      saveStoredDepartments(current);
      return updated;
    }
  } catch (error) {
    console.warn(`API toggleDepartmentActive(${idOrSlug}) failed:`, error);
  }

  const current = getStoredDepartments();
  const index = current.findIndex(
    (d) => d.id === String(idOrSlug) || d.slug === String(idOrSlug)
  );
  if (index === -1) throw new Error("Department not found");

  current[index].isActive = !current[index].isActive;
  saveStoredDepartments(current);
  return current[index];
}

export async function deleteDepartment(
  idOrSlug: string | number
): Promise<boolean> {
  try {
    await apiClient.delete(`/department/${encodeURIComponent(String(idOrSlug))}`);
  } catch (error) {
    console.warn(`API deleteDepartment(${idOrSlug}) failed:`, error);
  }

  const current = getStoredDepartments();
  const filtered = current.filter(
    (d) =>
      d.id !== String(idOrSlug) &&
      d.slug !== String(idOrSlug)
  );
  saveStoredDepartments(filtered);
  return true;
}
