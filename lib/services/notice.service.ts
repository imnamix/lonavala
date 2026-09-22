import { apiClient } from "../api-client";

export type NoticeCategory =
  | "Notices"
  | "Circulars"
  | "Orders"
  | "Gazettes"
  | "News";

export type NoticeWorkflowStatus = "Draft" | "Review" | "Published";

export interface NoticeDirectiveItem {
  id?: string;
  key: string;
  value: string;
}

export interface NoticeRecord {
  id: string;
  title: string;
  subject: string;
  category: NoticeCategory;
  department: string;
  date: string;
  refNo: string;
  description: string;
  directives: NoticeDirectiveItem[];
  issuedByName: string;
  issuedByDesignation: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  status: NoticeWorkflowStatus;
  isNew?: boolean;
}

export interface NoticeDirectiveDto {
  key: string;
  value: string;
}

export interface NoticeDto {
  id: number;
  title: string;
  subject?: string;
  category?: string;
  gazetteRefNo?: string;
  status?: string;
  issuingDepartmentId?: string;
  publishedDate?: string;
  issuedBy?: string;
  description?: string;
  directives?: NoticeDirectiveDto[];
  attachmentUrl?: string;
  createdDate?: string;
  updatedDate?: string;
}

export interface CreateNoticeDto {
  title: string;
  subject?: string;
  category?: string;
  gazetteRefNo?: string;
  status?: string;
  issuingDepartmentId?: string;
  publishedDate?: string;
  issuedBy?: string;
  description?: string;
  directives?: NoticeDirectiveDto[];
  attachmentUrl?: string;
}

export type UpdateNoticeDto = Partial<CreateNoticeDto>;

const STORAGE_KEY = "lmc_admin_notices_records_v1";

// Default notices collection (empty by default)
const INITIAL_NOTICES: NoticeRecord[] = [];

function getStoredNotices(): NoticeRecord[] {
  if (typeof window === "undefined") return INITIAL_NOTICES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_NOTICES));
      return INITIAL_NOTICES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Error reading notices from storage:", e);
    return INITIAL_NOTICES;
  }
}

function saveStoredNotices(notices: NoticeRecord[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notices));
  } catch (e) {
    console.error("Error saving notices to storage:", e);
  }
}

function mapWorkflowStatusToBackend(status?: NoticeWorkflowStatus): string {
  switch (status) {
    case "Published":
      return "PUBLISHED";
    case "Review":
      return "UNDER_REVIEW";
    case "Draft":
    default:
      return "DRAFT";
  }
}

function mapBackendStatusToWorkflow(status?: string): NoticeWorkflowStatus {
  switch (status) {
    case "PUBLISHED":
      return "Published";
    case "UNDER_REVIEW":
      return "Review";
    case "DRAFT":
    default:
      return "Draft";
  }
}

export function mapDtoToRecord(dto: NoticeDto): NoticeRecord {
  const formattedDate = dto.publishedDate
    ? new Date(dto.publishedDate).toISOString().split("T")[0]
    : dto.createdDate
      ? new Date(dto.createdDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];

  const directives: NoticeDirectiveItem[] = Array.isArray(dto.directives)
    ? dto.directives.map((d, idx) => ({
      id: `d-${idx + 1}`,
      key: d.key || "",
      value: d.value || "",
    }))
    : [];

  let fileName = "";
  if (dto.attachmentUrl) {
    try {
      const parts = dto.attachmentUrl.split("/");
      fileName = decodeURIComponent(
        parts[parts.length - 1]?.split("?")[0] || "Notice_Attachment.pdf"
      );
    } catch {
      fileName = "Notice_Attachment.pdf";
    }
  }

  return {
    id: String(dto.id),
    title: dto.title || "",
    subject: dto.subject || "",
    category: (dto.category as NoticeCategory) || "Notices",
    department: dto.issuingDepartmentId || "Chief Officer Secretariat",
    date: formattedDate,
    refNo: dto.gazetteRefNo || "",
    description: dto.description || "",
    directives,
    issuedByName: dto.issuedBy || "Chief Officer / Commissioner",
    issuedByDesignation: "Lonavala Municipal Council",
    fileUrl: dto.attachmentUrl || "",
    fileName,
    fileSize: "",
    status: mapBackendStatusToWorkflow(dto.status),
    isNew: false,
  };
}

export function mapRecordToDto(
  record: Partial<NoticeRecord>
): Partial<CreateNoticeDto> {
  const dto: Partial<CreateNoticeDto> = {};
  if (record.title !== undefined) dto.title = record.title;
  if (record.subject !== undefined) dto.subject = record.subject;
  if (record.category !== undefined) dto.category = record.category;
  if (record.refNo !== undefined) dto.gazetteRefNo = record.refNo;
  if (record.status !== undefined) {
    dto.status = mapWorkflowStatusToBackend(record.status);
  }
  if (record.department !== undefined) {
    dto.issuingDepartmentId = record.department;
  }
  if (record.date !== undefined) {
    dto.publishedDate = record.date
      ? new Date(record.date).toISOString()
      : new Date().toISOString();
  }
  if (record.issuedByName !== undefined) dto.issuedBy = record.issuedByName;
  if (record.description !== undefined) dto.description = record.description;
  if (record.directives !== undefined) {
    dto.directives = record.directives.map((d) => ({
      key: d.key,
      value: d.value,
    }));
  }
  if (record.fileUrl !== undefined) dto.attachmentUrl = record.fileUrl;
  return dto;
}

export async function getAllNotices(): Promise<NoticeRecord[]> {
  try {
    const res = await apiClient.get<NoticeDto[]>("/notice", {
      cache: "no-store",
    });
    if (res && Array.isArray(res.data)) {
      const mapped = res.data.map(mapDtoToRecord);
      saveStoredNotices(mapped);
      return mapped;
    }
  } catch (error) {
    console.warn("Failed to fetch notices from API, falling back to local store:", error);
  }
  return getStoredNotices();
}

export async function getNoticeById(
  id: string | number
): Promise<NoticeRecord | null> {
  const cleanId = String(id).replace(/^not-/, "");
  const numericId = parseInt(cleanId, 10);
  if (!isNaN(numericId)) {
    try {
      const res = await apiClient.get<NoticeDto>(`/notice/${numericId}`, {
        cache: "no-store",
      });
      if (res && res.data) {
        return mapDtoToRecord(res.data);
      }
    } catch (error) {
      console.warn(`Failed to fetch notice #${id} from API:`, error);
    }
  }

  // Check stored notices in local storage
  const notices = getStoredNotices();
  let found = notices.find((n) => n.id === String(id) || n.id === cleanId);
  if (found) return found;

  // Fallback: fetch all notices from API
  try {
    const all = await getAllNotices();
    found = all.find((n) => n.id === String(id) || n.id === cleanId);
    if (found) return found;
  } catch (err) {
    console.warn("Fallback notice fetch failed:", err);
  }

  return null;
}

export async function createNotice(
  payload: Omit<NoticeRecord, "id">
): Promise<NoticeRecord> {
  const createDto = mapRecordToDto(payload) as CreateNoticeDto;
  try {
    const res = await apiClient.post<NoticeDto>("/notice", createDto);
    if (res && res.data) {
      const record = mapDtoToRecord(res.data);
      const local = getStoredNotices();
      saveStoredNotices([record, ...local]);
      return record;
    }
  } catch (error) {
    console.warn("API createNotice failed, saving locally:", error);
    const notices = getStoredNotices();
    const newNotice: NoticeRecord = {
      ...payload,
      id: `not-${Date.now()}`,
    };
    saveStoredNotices([newNotice, ...notices]);
    return newNotice;
  }
  throw new Error("Failed to create notice");
}

export async function updateNotice(
  id: string | number,
  payload: Partial<NoticeRecord>
): Promise<NoticeRecord> {
  const cleanId = String(id).replace(/^not-/, "");
  const numericId = parseInt(cleanId, 10);
  const updateDto = mapRecordToDto(payload);

  if (!isNaN(numericId)) {
    try {
      const res = await apiClient.put<NoticeDto>(
        `/notice/${numericId}`,
        updateDto
      );
      if (res && res.data) {
        const record = mapDtoToRecord(res.data);
        const local = getStoredNotices();
        const idx = local.findIndex(
          (n) => n.id === String(id) || n.id === cleanId
        );
        if (idx !== -1) {
          local[idx] = record;
        } else {
          local.unshift(record);
        }
        saveStoredNotices(local);
        return record;
      }
    } catch (error) {
      console.warn(`API updateNotice #${id} failed, saving locally:`, error);
    }
  }

  const notices = getStoredNotices();
  const index = notices.findIndex(
    (n) => n.id === String(id) || n.id === cleanId
  );
  if (index === -1) {
    throw new Error(`Notice with ID ${id} not found.`);
  }
  const updatedNotice: NoticeRecord = {
    ...notices[index],
    ...payload,
  };
  notices[index] = updatedNotice;
  saveStoredNotices(notices);
  return updatedNotice;
}

export async function deleteNotice(id: string | number): Promise<boolean> {
  const cleanId = String(id).replace(/^not-/, "");
  const numericId = parseInt(cleanId, 10);
  if (!isNaN(numericId)) {
    try {
      await apiClient.delete(`/notice/${numericId}`);
    } catch (error) {
      console.warn(`API deleteNotice #${id} failed:`, error);
    }
  }

  const notices = getStoredNotices();
  const filtered = notices.filter(
    (n) => n.id !== String(id) && n.id !== cleanId
  );
  saveStoredNotices(filtered);
  return true;
}
