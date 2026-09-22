import { apiClient, ApiResponse } from "../api-client";
import { Project } from "@/types";

export interface ProjectHighlightDto {
  key: string;
  value: string;
}

export interface ProjectGalleryItemDto {
  id?: string;
  url: string;
  title: string;
}

export interface ProjectDto {
  id: number;
  title: string;
  marathiTitle?: string;
  projectCode?: string;
  category?: string;
  status?: string;
  departmentId?: string;
  location?: string;
  contractorName?: string;
  sanctionedBudget?: string;
  startDate?: string;
  targetCompletionDate?: string;
  physicalProgress?: number;
  financialProgress?: number;
  description?: string;
  highlights?: ProjectHighlightDto[];
  gallery?: ProjectGalleryItemDto[];
  coverImageUrl?: string;
  attachmentUrl?: string;
  createdDate?: string;
  updatedDate?: string;
}

export interface CreateProjectDto {
  title: string;
  marathiTitle?: string;
  projectCode?: string;
  category?: string;
  status?: string;
  departmentId?: string;
  location?: string;
  contractorName?: string;
  sanctionedBudget?: string;
  startDate?: string;
  targetCompletionDate?: string;
  physicalProgress?: number;
  financialProgress?: number;
  description?: string;
  highlights?: ProjectHighlightDto[];
  gallery?: ProjectGalleryItemDto[];
  coverImageUrl?: string;
  attachmentUrl?: string;
}

export type UpdateProjectDto = Partial<CreateProjectDto>;

const STORAGE_KEY = "lmc_admin_projects_records_v1";

const INITIAL_PROJECTS: Project[] = [];

function getStoredProjects(): Project[] {
  if (typeof window === "undefined") return INITIAL_PROJECTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PROJECTS));
      return INITIAL_PROJECTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Error reading projects from storage:", e);
    return INITIAL_PROJECTS;
  }
}

function saveStoredProjects(projects: Project[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (e) {
    console.error("Error saving projects to storage:", e);
  }
}

function mapStatusToBackend(status?: string): string {
  switch (status) {
    case "Ongoing":
      return "IN_PROGRESS";
    case "Completed":
      return "COMPLETED";
    case "Upcoming":
      return "PLANNED";
    default:
      return status || "PLANNED";
  }
}

function mapStatusToFrontend(status?: string): "Ongoing" | "Completed" | "Upcoming" {
  switch (status?.toUpperCase()) {
    case "IN_PROGRESS":
    case "ONGOING":
      return "Ongoing";
    case "COMPLETED":
      return "Completed";
    case "PLANNED":
    case "UPCOMING":
    default:
      return "Upcoming";
  }
}

export function mapDtoToProject(dto: ProjectDto): Project {
  let timeline = "";
  if (dto.startDate || dto.targetCompletionDate) {
    const start = dto.startDate
      ? new Date(dto.startDate).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
      : "";
    const end = dto.targetCompletionDate
      ? new Date(dto.targetCompletionDate).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
      : "";
    timeline = start && end ? `${start} - ${end}` : start || end;
  }

  const highlights: string[] = Array.isArray(dto.highlights)
    ? dto.highlights.map((h) =>
      h.key && !h.key.startsWith("Highlight") && !h.key.startsWith("Point")
        ? `${h.key}: ${h.value}`
        : h.value || ""
    )
    : [];

  const gallery = Array.isArray(dto.gallery)
    ? dto.gallery.map((g, idx) => ({
      id: g.id || `gal-${idx + 1}`,
      url: g.url || "",
      title: g.title || "",
    }))
    : [];

  return {
    id: String(dto.id),
    title: dto.title || "",
    category: dto.category || "Sanitation & Environment",
    status: mapStatusToFrontend(dto.status),
    progress:
      typeof dto.physicalProgress === "number" ? dto.physicalProgress : 0,
    budget: dto.sanctionedBudget || "₹ 0.00",
    timeline: timeline || "2024 - 2026",
    department: dto.departmentId || "Public Works Department (PWD)",
    location: dto.location || "Lonavala Municipal Jurisdiction",
    contractor: dto.contractorName || "LMC Engineering Wing",
    description: dto.description || "",
    image: dto.coverImageUrl || "",
    highlights: highlights.length > 0 ? highlights : [],
    gallery: gallery.length > 0 ? gallery : [],
  };
}

export function mapProjectToDto(
  project: Partial<Project>
): Partial<CreateProjectDto> {
  const dto: Partial<CreateProjectDto> = {};
  if (project.title !== undefined) dto.title = project.title;
  if (project.category !== undefined) dto.category = project.category;
  if (project.status !== undefined) {
    dto.status = mapStatusToBackend(project.status);
  }
  if (project.progress !== undefined) dto.physicalProgress = project.progress;
  if (project.budget !== undefined) dto.sanctionedBudget = project.budget;
  if (project.department !== undefined) dto.departmentId = project.department;
  if (project.location !== undefined) dto.location = project.location;
  if (project.contractor !== undefined) dto.contractorName = project.contractor;
  if (project.description !== undefined) dto.description = project.description;
  if (project.image !== undefined) dto.coverImageUrl = project.image;
  if (project.highlights !== undefined) {
    dto.highlights = project.highlights.map((h, i) => ({
      key: `Highlight ${i + 1}`,
      value: h,
    }));
  }
  if (project.gallery !== undefined) {
    dto.gallery = project.gallery.map((g) => ({
      id: g.id,
      url: g.url,
      title: g.title,
    }));
  }
  return dto;
}

export async function getAllProjects(): Promise<Project[]> {
  try {
    const res = await apiClient.get<ProjectDto[]>("/project", {
      cache: "no-store",
    });
    if (res && Array.isArray(res.data)) {
      const mapped = res.data.map(mapDtoToProject);
      saveStoredProjects(mapped);
      return mapped;
    }
  } catch (error) {
    console.warn(
      "Failed to fetch projects from API, falling back to local store:",
      error
    );
  }
  return getStoredProjects();
}

export async function getProjectById(
  id: string | number
): Promise<Project | null> {
  const strId = String(id);
  const cleanId = strId.replace(/^proj-/, "");
  const numericId = parseInt(cleanId, 10);

  // 1. Try fetching specific item by numeric ID from API
  if (!isNaN(numericId)) {
    try {
      const res = await apiClient.get<ProjectDto>(`/project/${numericId}`, {
        cache: "no-store",
      });
      if (res && res.data) {
        return mapDtoToProject(res.data);
      }
    } catch (error) {
      console.warn(`Failed to fetch project #${id} from API:`, error);
    }
  }

  // 2. Try matching in stored projects
  const projects = getStoredProjects();
  let found = projects.find(
    (p) =>
      String(p.id) === strId ||
      String(p.id) === cleanId ||
      String(p.id).replace(/^proj-/, "") === cleanId
  );
  if (found) return found;

  // 3. Fallback: fetch all from API and search
  try {
    const all = await getAllProjects();
    found = all.find(
      (p) =>
        String(p.id) === strId ||
        String(p.id) === cleanId ||
        String(p.id).replace(/^proj-/, "") === cleanId
    );
    if (found) return found;
  } catch (err) {
    console.warn("Fallback project fetch failed:", err);
  }

  return null;
}

export async function createProject(
  payload: Omit<Project, "id">
): Promise<Project> {
  const createDto = mapProjectToDto(payload) as CreateProjectDto;
  try {
    const res = await apiClient.post<ProjectDto>("/project", createDto);
    if (res && res.data) {
      const record = mapDtoToProject(res.data);
      const local = getStoredProjects();
      saveStoredProjects([record, ...local]);
      return record;
    }
  } catch (error) {
    console.warn("API createProject failed, saving locally:", error);
    const projects = getStoredProjects();
    const newProject: Project = {
      ...payload,
      id: `proj-${Date.now()}`,
    };
    saveStoredProjects([newProject, ...projects]);
    return newProject;
  }
  throw new Error("Failed to create project");
}

export async function updateProject(
  id: string | number,
  payload: Partial<Project>
): Promise<Project> {
  const cleanId = String(id).replace(/^proj-/, "");
  const numericId = parseInt(cleanId, 10);
  const updateDto = mapProjectToDto(payload);

  if (!isNaN(numericId)) {
    try {
      const res = await apiClient.put<ProjectDto>(
        `/project/${numericId}`,
        updateDto
      );
      if (res && res.data) {
        const record = mapDtoToProject(res.data);
        const local = getStoredProjects();
        const idx = local.findIndex(
          (p) => p.id === String(id) || p.id === cleanId
        );
        if (idx !== -1) {
          local[idx] = record;
        } else {
          local.unshift(record);
        }
        saveStoredProjects(local);
        return record;
      }
    } catch (error) {
      console.warn(`API updateProject #${id} failed, saving locally:`, error);
    }
  }

  const projects = getStoredProjects();
  const index = projects.findIndex(
    (p) => p.id === String(id) || p.id === cleanId
  );
  if (index === -1) {
    throw new Error(`Project with ID ${id} not found.`);
  }
  const updatedProject: Project = {
    ...projects[index],
    ...payload,
  };
  projects[index] = updatedProject;
  saveStoredProjects(projects);
  return updatedProject;
}

export async function deleteProject(id: string | number): Promise<boolean> {
  const cleanId = String(id).replace(/^proj-/, "");
  const numericId = parseInt(cleanId, 10);
  if (!isNaN(numericId)) {
    try {
      await apiClient.delete(`/project/${numericId}`);
    } catch (error) {
      console.warn(`API deleteProject #${id} failed:`, error);
    }
  }

  const projects = getStoredProjects();
  const filtered = projects.filter(
    (p) => p.id !== String(id) && p.id !== cleanId
  );
  saveStoredProjects(filtered);
  return true;
}
