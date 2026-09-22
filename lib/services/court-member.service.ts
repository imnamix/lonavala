import { apiClient, ApiResponse } from '../api-client';
import { CourtCommitteeMember } from '@/types';

const STORAGE_KEY_MEMBERS = 'lmc_court_committee_members_v1';

export interface CourtMemberDto {
  id: number;
  name: string;
  marathiName: string;
  designation: string;
  role: string;
  category: string;
  phone: string;
  email: string;
  ward?: string;
  experience?: string;
  image?: string;
  responsibilities: string[];
  sortOrder: number;
  active: boolean;
  createdDate?: string;
  updatedDate?: string;
}

export interface CourtMemberQueryParams {
  category?: string;
  search?: string;
  active?: boolean;
}

export interface CreateCourtMemberPayload {
  name: string;
  marathiName?: string;
  designation?: string;
  role?: string;
  category?: string;
  phone?: string;
  email?: string;
  ward?: string;
  experience?: string;
  image?: string;
  responsibilities?: string[];
  sortOrder?: number;
  active?: boolean;
}

export type UpdateCourtMemberPayload = Partial<CreateCourtMemberPayload>;

function mapDtoToMember(dto: CourtMemberDto): CourtCommitteeMember {
  return {
    id: String(dto.id),
    name: dto.name,
    marathiName: dto.marathiName || '',
    designation: dto.designation || '',
    role: dto.role || 'Member',
    category: (dto.category || 'Committee Member') as any,
    phone: dto.phone || '',
    email: dto.email || '',
    ward: dto.ward || '',
    experience: dto.experience || '',
    image: dto.image || '',
    responsibilities: Array.isArray(dto.responsibilities) ? dto.responsibilities : [],
  };
}

function getLocalMembers(): CourtCommitteeMember[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY_MEMBERS);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveLocalMembers(members: CourtCommitteeMember[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_MEMBERS, JSON.stringify(members));
  } catch (e) {
    console.error('Failed to save members to localStorage', e);
  }
}

/**
 * Fetch all Court Committee Members from backend API with localStorage fallback
 */
export async function getAllCourtMembers(
  params?: CourtMemberQueryParams,
): Promise<CourtCommitteeMember[]> {
  try {
    const queryParts: string[] = [];
    if (params?.category && params.category !== 'ALL') {
      queryParts.push(`category=${encodeURIComponent(params.category)}`);
    }
    if (params?.search) {
      queryParts.push(`search=${encodeURIComponent(params.search)}`);
    }
    if (params?.active !== undefined) {
      queryParts.push(`active=${params.active}`);
    }

    const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
    const res = await apiClient.get<CourtMemberDto[] | { data: CourtMemberDto[] }>(
      `/court-member${queryString}`,
    );

    let rawList: CourtMemberDto[] = [];
    if (Array.isArray(res.data)) {
      rawList = res.data;
    } else if (res.data && Array.isArray((res.data as any).data)) {
      rawList = (res.data as any).data;
    } else if (Array.isArray(res)) {
      rawList = res as any;
    }

    if (rawList && rawList.length > 0) {
      const mapped = rawList.map(mapDtoToMember);
      saveLocalMembers(mapped);
      return mapped;
    }
  } catch (err) {
    console.warn('Backend API unavailable for court members, using cached state:', err);
  }

  // Fallback to local storage
  const local = getLocalMembers();
  if (params?.category && params.category !== 'ALL') {
    return local.filter((m) => m.category === params.category);
  }
  if (params?.search) {
    const s = params.search.toLowerCase();
    return local.filter(
      (m) =>
        m.name.toLowerCase().includes(s) ||
        m.marathiName.toLowerCase().includes(s) ||
        m.role.toLowerCase().includes(s),
    );
  }
  return local;
}

/**
 * Get single member by ID
 */
export async function getCourtMemberById(
  id: string | number,
): Promise<CourtCommitteeMember | null> {
  const numericId = typeof id === 'string' && !isNaN(Number(id)) ? Number(id) : id;

  if (typeof numericId === 'number') {
    try {
      const res = await apiClient.get<CourtMemberDto>(`/court-member/${numericId}`);
      if (res.data) {
        return mapDtoToMember(res.data);
      }
    } catch (err) {
      console.warn(`Could not fetch court member #${id} from API, falling back to cache:`, err);
    }
  }

  const local = getLocalMembers();
  return local.find((m) => m.id === String(id)) || null;
}

/**
 * Create new court member via API
 */
export async function createCourtMember(
  payload: CreateCourtMemberPayload,
): Promise<CourtCommitteeMember> {
  let created: CourtCommitteeMember | null = null;

  try {
    const res = await apiClient.post<CourtMemberDto>('/court-member', payload);
    if (res.data) {
      created = mapDtoToMember(res.data);
    }
  } catch (err) {
    console.warn('Could not create court member via API, saving locally:', err);
  }

  if (!created) {
    created = {
      id: `cm-${Date.now()}`,
      name: payload.name,
      marathiName: payload.marathiName || '',
      designation: payload.designation || '',
      role: payload.role || 'Member',
      category: (payload.category || 'Committee Member') as any,
      phone: payload.phone || '',
      email: payload.email || '',
      ward: payload.ward || '',
      experience: payload.experience || '',
      image: payload.image || '',
      responsibilities: payload.responsibilities || [],
    };
  }

  const members = getLocalMembers();
  const updated = [created, ...members.filter((m) => m.id !== created!.id)];
  saveLocalMembers(updated);
  return created;
}

/**
 * Update court member via API
 */
export async function updateCourtMember(
  id: string | number,
  payload: UpdateCourtMemberPayload,
): Promise<CourtCommitteeMember | null> {
  let updated: CourtCommitteeMember | null = null;
  const numericId = typeof id === 'string' && !isNaN(Number(id)) ? Number(id) : id;

  if (typeof numericId === 'number') {
    try {
      const res = await apiClient.put<CourtMemberDto>(`/court-member/${numericId}`, payload);
      if (res.data) {
        updated = mapDtoToMember(res.data);
      }
    } catch (err) {
      console.warn(`Could not update court member #${id} via API, saving locally:`, err);
    }
  }

  const members = getLocalMembers();
  const index = members.findIndex((m) => m.id === String(id));
  if (index !== -1) {
    const merged: CourtCommitteeMember = {
      ...members[index],
      ...payload,
      category: (payload.category as any) || members[index].category,
    };
    members[index] = merged;
    saveLocalMembers(members);
    if (!updated) updated = merged;
  }

  return updated;
}

/**
 * Delete court member via API
 */
export async function deleteCourtMember(id: string | number): Promise<boolean> {
  const numericId = typeof id === 'string' && !isNaN(Number(id)) ? Number(id) : id;

  if (typeof numericId === 'number') {
    try {
      await apiClient.delete(`/court-member/${numericId}`);
    } catch (err) {
      console.warn(`Could not delete court member #${id} from API, updating local cache:`, err);
    }
  }

  const members = getLocalMembers();
  const updated = members.filter((m) => m.id !== String(id));
  saveLocalMembers(updated);
  return true;
}
