import { apiClient } from '../api-client';
import { CourtSession } from '@/types';

const STORAGE_KEY_SESSIONS = 'lmc_court_sessions_v1';

export interface CourtSessionDto {
  id: number;
  sessionTitle: string;
  marathiSessionTitle?: string;
  hearingDate: string;
  time?: string;
  courtForum?: string;
  presidingBench?: string;
  casesListed?: string[];
  sessionAgenda: string;
  marathiSessionAgenda?: string;
  status: string;
  noticePdfUrl?: string;
  sortOrder?: number;
  active?: boolean;
  createdDate?: string;
  updatedDate?: string;
}

export interface CourtSessionQueryParams {
  status?: string;
  search?: string;
  active?: boolean;
}

export interface CreateCourtSessionPayload {
  sessionTitle: string;
  marathiSessionTitle?: string;
  hearingDate: string;
  time?: string;
  courtForum?: string;
  presidingBench?: string;
  casesListed?: string[];
  sessionAgenda: string;
  marathiSessionAgenda?: string;
  status?: string;
  noticePdfUrl?: string;
  sortOrder?: number;
  active?: boolean;
}

export type UpdateCourtSessionPayload = Partial<CreateCourtSessionPayload>;

function mapDtoToSession(dto: CourtSessionDto): CourtSession {
  return {
    id: String(dto.id),
    sessionTitle: dto.sessionTitle,
    marathiSessionTitle: dto.marathiSessionTitle || '',
    hearingDate: dto.hearingDate,
    time: dto.time || '11:00 AM',
    courtForum: dto.courtForum || '',
    presidingBench: dto.presidingBench || '',
    casesListed: Array.isArray(dto.casesListed) ? dto.casesListed : [],
    sessionAgenda: dto.sessionAgenda || '',
    marathiSessionAgenda: dto.marathiSessionAgenda || '',
    status: (dto.status || 'Scheduled') as any,
    noticePdfUrl: dto.noticePdfUrl || '',
  };
}

function getLocalSessions(): CourtSession[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY_SESSIONS);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveLocalSessions(sessions: CourtSession[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
  } catch (e) {
    console.error('Failed to save court sessions to localStorage', e);
  }
}

/**
 * Fetch all Court Sessions & Hearing history from API with localStorage fallback
 */
export async function getAllCourtSessions(
  params?: CourtSessionQueryParams,
): Promise<CourtSession[]> {
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
    const res = await apiClient.get<CourtSessionDto[] | { data: CourtSessionDto[] }>(
      `/court-session${queryString}`,
    );

    let rawList: CourtSessionDto[] = [];
    if (Array.isArray(res.data)) {
      rawList = res.data;
    } else if (res.data && Array.isArray((res.data as any).data)) {
      rawList = (res.data as any).data;
    } else if (Array.isArray(res)) {
      rawList = res as any;
    }

    if (rawList && rawList.length > 0) {
      const mapped = rawList.map(mapDtoToSession);
      saveLocalSessions(mapped);
      return mapped;
    }
  } catch (err) {
    console.warn('Backend API unavailable for court sessions, using cached state:', err);
  }

  // Fallback to local storage
  const local = getLocalSessions();
  if (params?.status && params.status !== 'ALL') {
    return local.filter((s) => s.status === params.status);
  }
  if (params?.search) {
    const s = params.search.toLowerCase();
    return local.filter(
      (session) =>
        session.sessionTitle.toLowerCase().includes(s) ||
        (session.marathiSessionTitle && session.marathiSessionTitle.toLowerCase().includes(s)) ||
        session.sessionAgenda.toLowerCase().includes(s) ||
        session.courtForum.toLowerCase().includes(s) ||
        session.hearingDate.toLowerCase().includes(s),
    );
  }
  return local;
}

/**
 * Fetch next active scheduled court session
 */
export async function getNextCourtSession(): Promise<CourtSession | null> {
  try {
    const res = await apiClient.get<CourtSessionDto | { data: CourtSessionDto }>('/court-session/next');
    let raw: CourtSessionDto | null = null;
    if (res.data && (res.data as any).data) {
      raw = (res.data as any).data;
    } else if (res.data) {
      raw = res.data as CourtSessionDto;
    }

    if (raw && raw.id) {
      return mapDtoToSession(raw);
    }
  } catch (err) {
    console.warn('Could not fetch next session from API:', err);
  }

  const all = await getAllCourtSessions();
  return all.find((s) => s.status === 'Scheduled' || s.status === 'In Progress') || null;
}

/**
 * Get single court session by ID
 */
export async function getCourtSessionById(
  id: string | number,
): Promise<CourtSession | null> {
  const numericId = typeof id === 'string' && !isNaN(Number(id)) ? Number(id) : id;

  if (typeof numericId === 'number') {
    try {
      const res = await apiClient.get<CourtSessionDto>(`/court-session/${numericId}`);
      if (res.data) {
        return mapDtoToSession(res.data);
      }
    } catch (err) {
      console.warn(`Could not fetch court session #${id} from API, falling back to cache:`, err);
    }
  }

  const local = getLocalSessions();
  return local.find((s) => s.id === String(id)) || null;
}

/**
 * Create new court session via API
 */
export async function createCourtSession(
  payload: CreateCourtSessionPayload,
): Promise<CourtSession> {
  let created: CourtSession | null = null;

  try {
    const res = await apiClient.post<CourtSessionDto>('/court-session', payload);
    if (res.data) {
      created = mapDtoToSession(res.data);
    }
  } catch (err) {
    console.warn('Could not create court session via API, saving locally:', err);
  }

  if (!created) {
    created = {
      id: `cs-${Date.now()}`,
      sessionTitle: payload.sessionTitle,
      marathiSessionTitle: payload.marathiSessionTitle || '',
      hearingDate: payload.hearingDate,
      time: payload.time || '11:00 AM',
      courtForum: payload.courtForum || '',
      presidingBench: payload.presidingBench || '',
      casesListed: payload.casesListed || [],
      sessionAgenda: payload.sessionAgenda || '',
      marathiSessionAgenda: payload.marathiSessionAgenda || '',
      status: (payload.status || 'Scheduled') as any,
      noticePdfUrl: payload.noticePdfUrl || '',
    };
  }

  const sessions = getLocalSessions();
  const isUpcoming = created.status === 'Scheduled' || created.status === 'In Progress';
  const updatedSessions = isUpcoming
    ? sessions.map((s) =>
        s.status === 'Scheduled' || s.status === 'In Progress'
          ? { ...s, status: 'Concluded' as const }
          : s,
      )
    : sessions;

  const updated = [created, ...updatedSessions.filter((s) => s.id !== created!.id)];
  saveLocalSessions(updated);
  return created;
}

/**
 * Update court session via API
 */
export async function updateCourtSession(
  id: string | number,
  payload: UpdateCourtSessionPayload,
): Promise<CourtSession | null> {
  let updated: CourtSession | null = null;
  const numericId = typeof id === 'string' && !isNaN(Number(id)) ? Number(id) : id;

  if (typeof numericId === 'number') {
    try {
      const res = await apiClient.put<CourtSessionDto>(`/court-session/${numericId}`, payload);
      if (res.data) {
        updated = mapDtoToSession(res.data);
      }
    } catch (err) {
      console.warn(`Could not update court session #${id} via API, saving locally:`, err);
    }
  }

  const sessions = getLocalSessions();
  const index = sessions.findIndex((s) => s.id === String(id));
  if (index !== -1) {
    const merged: CourtSession = {
      ...sessions[index],
      ...payload,
      casesListed: payload.casesListed ?? sessions[index].casesListed,
      status: (payload.status as any) || sessions[index].status,
    };
    sessions[index] = merged;
    saveLocalSessions(sessions);
    if (!updated) updated = merged;
  }

  return updated;
}

/**
 * Delete court session via API
 */
export async function deleteCourtSession(id: string | number): Promise<boolean> {
  const numericId = typeof id === 'string' && !isNaN(Number(id)) ? Number(id) : id;

  if (typeof numericId === 'number') {
    try {
      await apiClient.delete(`/court-session/${numericId}`);
    } catch (err) {
      console.warn(`Could not delete court session #${id} from API, updating local cache:`, err);
    }
  }

  const sessions = getLocalSessions();
  const updated = sessions.filter((s) => s.id !== String(id));
  saveLocalSessions(updated);
  return true;
}

/**
 * Re-seed court sessions from API defaults
 */
export async function seedCourtSessionsApi(): Promise<boolean> {
  try {
    await apiClient.post('/court-session/seed', {});
    const fresh = await getAllCourtSessions();
    saveLocalSessions(fresh);
    return true;
  } catch (err) {
    console.warn('Could not seed court sessions via API:', err);
    return false;
  }
}
