// lib/services/citizen.service.ts
import { apiClient } from '../api-client';

const CITIZEN_TOKEN_KEY = 'citizen_token';
const CITIZEN_DATA_KEY = 'citizen_data';

export interface CitizenProfile {
  id: number;
  phone: string;
  name: string | null;
  email: string | null;
  address: string | null;
  profilePicture?: string | null;
  isActive: boolean;
  createdDate: string;
}

export interface CitizenAuthResponse {
  status: string;
  data: {
    isNewUser: boolean;
    accessToken: string;
    citizen: CitizenProfile;
  };
}

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  address?: string;
  profilePicture?: string;
}

export interface VerifyCitizenOtpPayload {
  idToken?: string;
  phone?: string;
  otp?: string;
  name?: string;
  address?: string;
  email?: string;
  profilePicture?: string;
  isRegistering?: boolean;
}

export interface CheckPhoneResponse {
  status: string;
  data: {
    isRegistered: boolean;
    phone: string;
    name: string | null;
  };
}

/** Check if a phone number is already registered */
export async function checkCitizenPhone(phone: string): Promise<CheckPhoneResponse['data']> {
  const res = await apiClient.post<CheckPhoneResponse>('/citizen/auth/check-phone', {
    phone,
  });
  return (res as any).data;
}

/** Verify Firebase idToken or default OTP with backend → returns citizen JWT */
export async function verifyCitizenOtp(
  payload: string | VerifyCitizenOtpPayload,
): Promise<CitizenAuthResponse> {
  const body = typeof payload === 'string' ? { idToken: payload } : payload;
  const res = await apiClient.post<CitizenAuthResponse>('/citizen/auth/verify-otp', body);
  return res as unknown as CitizenAuthResponse;
}

/** Fetch logged-in citizen profile */
export async function getCitizenProfile(): Promise<CitizenProfile> {
  const token = getCitizenToken();
  const res = await apiClient.get<{ status: string; data: CitizenProfile }>(
    '/citizen/profile',
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return (res as any).data;
}

/** Update citizen profile */
export async function updateCitizenProfile(
  payload: UpdateProfilePayload,
): Promise<CitizenProfile> {
  const token = getCitizenToken();
  const res = await apiClient.patch<{ status: string; data: CitizenProfile }>(
    '/citizen/profile',
    payload,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return (res as any).data;
}

// ─── Grievance API ──────────────────────────────────────────────────────────

export interface GrievanceStatusHistoryItem {
  status: 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'REJECTED';
  note?: string;
  updatedBy?: string;
  updatedAt?: string;
  assignedDepartment?: string;
}

export interface GrievanceItem {
  id: number;
  ticketNumber: string;
  title: string;
  description: string;
  category: string;
  address: string | null;
  wardNumber: number | null;
  attachmentUrls: string[] | null;
  status: 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'REJECTED';
  assignedDepartment: string | null;
  assignedOfficerId: number | null;
  resolutionNotes: string | null;
  statusHistory?: GrievanceStatusHistoryItem[];
  resolvedAt: string | null;
  createdDate: string;
  updatedDate: string;
  citizenId?: number | null;
  citizen?: {
    id?: number;
    name: string | null;
    phone: string | null;
    email?: string | null;
  } | null;
}

export interface CreateGrievancePayload {
  title: string;
  description: string;
  category: string;
  address?: string;
  wardNumber?: number;
  attachmentUrls?: string[];
  citizenMobile?: string;
  citizenName?: string;
  citizenEmail?: string;
  assignedDepartment?: string;
}

export async function createGrievance(payload: CreateGrievancePayload): Promise<{
  message?: string;
  ticketNumber: string;
  grievance: GrievanceItem;
}> {
  const token = getCitizenToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const res = await apiClient.post<{ status: string; data: any }>(
    '/grievance',
    payload,
    { headers },
  );
  return (res as any).data || (res as any);
}

export async function getMyGrievances(params?: {
  status?: string;
  category?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: GrievanceItem[]; total: number; page: number; limit: number; totalPages: number }> {
  const token = getCitizenToken();
  const searchParams = new URLSearchParams();
  if (params?.status && params.status !== 'ALL') searchParams.append('status', params.status);
  if (params?.category) searchParams.append('category', params.category);
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  const queryString = searchParams.toString();
  const url = `/grievance/my${queryString ? `?${queryString}` : ''}`;

  const res = await apiClient.get<any>(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res as any;
}

export async function trackGrievanceByTicket(ticketNumber: string): Promise<GrievanceItem> {
  const res = await apiClient.get<{ status: string; data: GrievanceItem }>(
    `/grievance/track/${ticketNumber.trim()}`,
  );
  return (res as any).data || (res as any);
}

export async function getAllGrievances(params?: {
  status?: string;
  category?: string;
  wardNumber?: number;
  page?: number;
  limit?: number;
}): Promise<{ data: GrievanceItem[]; meta: { total: number; page: number; limit: number; totalPages: number } }> {
  const searchParams = new URLSearchParams();
  if (params?.status && params.status !== 'All' && params.status !== 'ALL') searchParams.append('status', params.status);
  if (params?.category) searchParams.append('category', params.category);
  if (params?.wardNumber) searchParams.append('wardNumber', params.wardNumber.toString());
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  const queryString = searchParams.toString();
  const res = await apiClient.get<any>(`/grievance${queryString ? `?${queryString}` : ''}`);
  return res as any;
}

export async function updateAdminGrievanceStatus(
  id: number,
  payload: {
    status: string;
    assignedDepartment?: string;
    assignedOfficerId?: number;
    resolutionNotes?: string;
    note?: string;
    updatedBy?: string;
  },
): Promise<any> {
  const res = await apiClient.patch<any>(`/grievance/${id}/status`, payload);
  return (res as any).data || res;
}

// ─── Admin Citizen Management ────────────────────────────────────────────────

export interface CitizenListItem extends CitizenProfile {
  grievancesCount?: number;
}

export interface CitizenDetailResponse extends CitizenProfile {
  grievances?: GrievanceItem[];
  grievancesCount?: number;
}

export async function getAllCitizens(params?: {
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: CitizenListItem[]; meta: { total: number; page: number; limit: number; totalPages: number } }> {
  const searchParams = new URLSearchParams();
  if (params?.search) searchParams.append('search', params.search);
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  const queryString = searchParams.toString();
  const res = await apiClient.get<any>(`/citizen${queryString ? `?${queryString}` : ''}`);
  return res as any;
}

export async function getCitizenDetails(id: number): Promise<CitizenDetailResponse> {
  const res = await apiClient.get<{ status: string; data: CitizenDetailResponse }>(`/citizen/${id}`);
  return (res as any).data || res;
}


// ─── Token helpers ────────────────────────────────────────────────────────────

export function saveCitizenSession(token: string, citizen: CitizenProfile) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CITIZEN_TOKEN_KEY, token);
  localStorage.setItem(CITIZEN_DATA_KEY, JSON.stringify(citizen));
  window.dispatchEvent(new Event('citizen-auth-change'));
}

export function getCitizenToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(CITIZEN_TOKEN_KEY);
}

export function getCitizenData(): CitizenProfile | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(CITIZEN_DATA_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function clearCitizenSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CITIZEN_TOKEN_KEY);
  localStorage.removeItem(CITIZEN_DATA_KEY);
  window.dispatchEvent(new Event('citizen-auth-change'));
}

export function isCitizenLoggedIn(): boolean {
  return !!getCitizenToken();
}
