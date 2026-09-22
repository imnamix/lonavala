import { apiClient } from '../api-client';
import { AdalatUpdate } from '@/types';

const STORAGE_KEY_PROCEEDINGS = 'lmc_court_proceedings_v1';

export interface CourtProceedingDto {
  id: number;
  subject: string;
  marathiSubject: string;
  description: string;
  marathiDescription: string;
  date: string;
  minutes: string;
  marathiMinutes: string;
  pdfUrl?: string;
  fileSize?: string;
  benchOfficers?: string;
  venue?: string;
  status: string;
  sortOrder: number;
  active: boolean;
  createdDate?: string;
  updatedDate?: string;
}

export interface CourtProceedingQueryParams {
  status?: string;
  search?: string;
  active?: boolean;
}

export interface CreateCourtProceedingPayload {
  subject: string;
  marathiSubject?: string;
  description?: string;
  marathiDescription?: string;
  date: string;
  minutes?: string;
  marathiMinutes?: string;
  pdfUrl?: string;
  fileSize?: string;
  benchOfficers?: string;
  venue?: string;
  status?: string;
  sortOrder?: number;
  active?: boolean;
}

export type UpdateCourtProceedingPayload = Partial<CreateCourtProceedingPayload>;

function mapDtoToProceeding(dto: CourtProceedingDto): AdalatUpdate {
  return {
    id: String(dto.id),
    subject: dto.subject,
    marathiSubject: dto.marathiSubject || '',
    description: dto.description || '',
    marathiDescription: dto.marathiDescription || '',
    date: dto.date,
    minutes: dto.minutes || '',
    marathiMinutes: dto.marathiMinutes || '',
    pdfUrl: dto.pdfUrl || '',
    fileSize: dto.fileSize || '',
    benchOfficers: dto.benchOfficers || '',
    venue: dto.venue || '',
    status: (dto.status || 'Upcoming') as any,
  };
}

function getLocalProceedings(): AdalatUpdate[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY_PROCEEDINGS);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveLocalProceedings(proceedings: AdalatUpdate[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_PROCEEDINGS, JSON.stringify(proceedings));
  } catch (e) {
    console.error('Failed to save proceedings to localStorage', e);
  }
}

/**
 * Fetch all Court Proceedings from backend API with localStorage fallback
 */
export async function getAllCourtProceedings(
  params?: CourtProceedingQueryParams,
): Promise<AdalatUpdate[]> {
  try {
    const queryParts: string[] = [];
    if (params?.status && params.status !== 'ALL') {
      queryParts.push(`status=${encodeURIComponent(params.status)}`);
    }
    if (params?.search) {
      queryParts.push(`search=${encodeURIComponent(params.search)}`);
    }
    if (params?.active !== undefined) {
      queryParts.push(`active=${params.active}`);
    }

    const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
    const res = await apiClient.get<CourtProceedingDto[] | { data: CourtProceedingDto[] }>(
      `/court-proceeding${queryString}`,
    );

    let rawList: CourtProceedingDto[] = [];
    if (Array.isArray(res.data)) {
      rawList = res.data;
    } else if (res.data && Array.isArray((res.data as any).data)) {
      rawList = (res.data as any).data;
    } else if (Array.isArray(res)) {
      rawList = res as any;
    }

    if (rawList && rawList.length > 0) {
      const mapped = rawList.map(mapDtoToProceeding);
      saveLocalProceedings(mapped);
      return mapped;
    }
  } catch (err) {
    console.warn('Backend API unavailable for court proceedings, using cached state:', err);
  }

  // Fallback to local storage
  const local = getLocalProceedings();
  if (params?.status && params.status !== 'ALL') {
    return local.filter((p) => p.status === params.status);
  }
  if (params?.search) {
    const s = params.search.toLowerCase();
    return local.filter(
      (p) =>
        p.subject.toLowerCase().includes(s) ||
        (p.marathiSubject && p.marathiSubject.toLowerCase().includes(s)) ||
        p.description.toLowerCase().includes(s) ||
        (p.minutes && p.minutes.toLowerCase().includes(s)),
    );
  }
  return local;
}

/**
 * Get single court proceeding by ID
 */
export async function getCourtProceedingById(
  id: string | number,
): Promise<AdalatUpdate | null> {
  const numericId = typeof id === 'string' && !isNaN(Number(id)) ? Number(id) : id;

  if (typeof numericId === 'number') {
    try {
      const res = await apiClient.get<CourtProceedingDto>(`/court-proceeding/${numericId}`);
      if (res.data) {
        return mapDtoToProceeding(res.data);
      }
    } catch (err) {
      console.warn(`Could not fetch court proceeding #${id} from API, falling back to cache:`, err);
    }
  }

  const local = getLocalProceedings();
  return local.find((p) => p.id === String(id)) || null;
}

/**
 * Create new court proceeding via API
 */
export async function createCourtProceeding(
  payload: CreateCourtProceedingPayload,
): Promise<AdalatUpdate> {
  let created: AdalatUpdate | null = null;

  try {
    const res = await apiClient.post<CourtProceedingDto>('/court-proceeding', payload);
    if (res.data) {
      created = mapDtoToProceeding(res.data);
    }
  } catch (err) {
    console.warn('Could not create court proceeding via API, saving locally:', err);
  }

  if (!created) {
    created = {
      id: `cp-${Date.now()}`,
      subject: payload.subject,
      marathiSubject: payload.marathiSubject || '',
      description: payload.description || '',
      marathiDescription: payload.marathiDescription || '',
      date: payload.date,
      minutes: payload.minutes || '',
      marathiMinutes: payload.marathiMinutes || '',
      pdfUrl: payload.pdfUrl || '',
      fileSize: payload.fileSize || '',
      benchOfficers: payload.benchOfficers || '',
      venue: payload.venue || '',
      status: (payload.status || 'Upcoming') as any,
    };
  }

  const proceedings = getLocalProceedings();
  const updated = [created, ...proceedings.filter((p) => p.id !== created!.id)];
  saveLocalProceedings(updated);
  return created;
}

/**
 * Update court proceeding via API
 */
export async function updateCourtProceeding(
  id: string | number,
  payload: UpdateCourtProceedingPayload,
): Promise<AdalatUpdate | null> {
  let updated: AdalatUpdate | null = null;
  const numericId = typeof id === 'string' && !isNaN(Number(id)) ? Number(id) : id;

  if (typeof numericId === 'number') {
    try {
      const res = await apiClient.put<CourtProceedingDto>(`/court-proceeding/${numericId}`, payload);
      if (res.data) {
        updated = mapDtoToProceeding(res.data);
      }
    } catch (err) {
      console.warn(`Could not update court proceeding #${id} via API, saving locally:`, err);
    }
  }

  const proceedings = getLocalProceedings();
  const index = proceedings.findIndex((p) => p.id === String(id));
  if (index !== -1) {
    const merged: AdalatUpdate = {
      ...proceedings[index],
      ...payload,
      status: (payload.status as any) || proceedings[index].status,
    };
    proceedings[index] = merged;
    saveLocalProceedings(proceedings);
    if (!updated) updated = merged;
  }

  return updated;
}

/**
 * Delete court proceeding via API
 */
export async function deleteCourtProceeding(id: string | number): Promise<boolean> {
  const numericId = typeof id === 'string' && !isNaN(Number(id)) ? Number(id) : id;

  if (typeof numericId === 'number') {
    try {
      await apiClient.delete(`/court-proceeding/${numericId}`);
    } catch (err) {
      console.warn(`Could not delete court proceeding #${id} from API, updating local cache:`, err);
    }
  }

  const proceedings = getLocalProceedings();
  const updated = proceedings.filter((p) => p.id !== String(id));
  saveLocalProceedings(updated);
  return true;
}

/**
 * Re-seed court proceedings from API defaults
 */
export async function seedCourtProceedingsApi(): Promise<boolean> {
  try {
    await apiClient.post('/court-proceeding/seed', {});
    const fresh = await getAllCourtProceedings();
    saveLocalProceedings(fresh);
    return true;
  } catch (err) {
    console.warn('Could not seed court proceedings via API:', err);
    return false;
  }
}
