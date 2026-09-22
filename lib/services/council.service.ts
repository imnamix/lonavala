import { apiClient, ApiResponse } from '../api-client';
import { CouncilMember } from '@/types';

export interface CouncilMemberDto {
  id: number;
  name: string;
  marathiName: string;
  designation: string;
  roleCategory: string;
  ward: string;
  tenure: string;
  committee?: string;
  phone: string;
  email: string;
  address?: string;
  imageUrl: string;
  message?: string;
  sortOrder: number;
  active: boolean;
  createdDate?: string;
  updatedDate?: string;
}

export interface CouncilQueryParams {
  search?: string;
  roleCategory?: string;
  ward?: string;
  active?: boolean;
}

export interface CreateCouncilMemberPayload {
  name: string;
  marathiName?: string;
  designation: string;
  roleCategory?: string;
  ward?: string;
  tenure?: string;
  committee?: string;
  phone?: string;
  email?: string;
  address?: string;
  imageUrl?: string;
  message?: string;
  sortOrder?: number;
  active?: boolean;
}

export type UpdateCouncilMemberPayload = Partial<CreateCouncilMemberPayload>;

function mapDtoToMember(dto: CouncilMemberDto): CouncilMember {
  const roleCategory: CouncilMember['roleCategory'] =
    dto.roleCategory === 'President'
      ? 'President'
      : dto.roleCategory === 'Vice President'
        ? 'Vice President'
        : dto.roleCategory === 'Officer' || dto.roleCategory === 'Commissioner'
          ? 'Officer'
          : dto.roleCategory === 'Nominated'
            ? 'Nominated'
            : 'Corporator';

  return {
    id: String(dto.id),
    name: dto.name,
    marathiName: dto.marathiName || '',
    designation: dto.designation,
    roleCategory,
    ward: dto.ward,
    tenure: dto.tenure || '2024 - 2029',
    committee: dto.committee,
    phone: dto.phone || '',
    email: dto.email || '',
    address: dto.address,
    image: dto.imageUrl || '',
    message: dto.message || '',
    active: dto.active,
  };
}

export async function getCouncilMembers(params?: CouncilQueryParams): Promise<CouncilMember[]> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append('search', params.search);
    if (params?.roleCategory && params.roleCategory !== 'ALL') {
      searchParams.append('roleCategory', params.roleCategory);
    }
    if (params?.ward && params.ward !== 'ALL') {
      searchParams.append('ward', params.ward);
    }
    if (params?.active !== undefined) {
      searchParams.append('active', String(params.active));
    }

    const qs = searchParams.toString();
    const endpoint = `/council${qs ? `?${qs}` : ''}`;
    const res = await apiClient.get<CouncilMemberDto[]>(endpoint, {
      cache: 'no-store',
    });
    const list = Array.isArray(res.data) ? res.data : [];
    return list.map(mapDtoToMember);
  } catch (error) {
    console.warn('Failed to fetch council members from API:', error);
    return [];
  }
}

export async function getCouncilMemberById(id: string | number): Promise<CouncilMember | null> {
  try {
    const numId = typeof id === 'string' ? id.replace(/^cm-/, '') : id;
    const res = await apiClient.get<CouncilMemberDto>(`/council/${numId}`);
    if (res.data) {
      return mapDtoToMember(res.data);
    }
    return null;
  } catch (error) {
    console.warn(`Failed to fetch council member #${id} from API:`, error);
    return null;
  }
}

export async function createCouncilMember(
  payload: CreateCouncilMemberPayload
): Promise<ApiResponse<CouncilMemberDto>> {
  return await apiClient.post<CouncilMemberDto>('/council', payload);
}

export async function updateCouncilMember(
  id: string | number,
  payload: UpdateCouncilMemberPayload
): Promise<ApiResponse<CouncilMemberDto>> {
  const numId = typeof id === 'string' ? id.replace(/^cm-/, '') : id;
  return await apiClient.put<CouncilMemberDto>(`/council/${numId}`, payload);
}

export async function toggleCouncilMemberActive(
  id: string | number
): Promise<ApiResponse<CouncilMemberDto>> {
  const numId = typeof id === 'string' ? id.replace(/^cm-/, '') : id;
  return await apiClient.patch<CouncilMemberDto>(`/council/${numId}/toggle-active`, {});
}

export async function deleteCouncilMember(
  id: string | number
): Promise<ApiResponse<{ success: boolean; message: string }>> {
  const numId = typeof id === 'string' ? id.replace(/^cm-/, '') : id;
  return await apiClient.delete<{ success: boolean; message: string }>(`/council/${numId}`);
}
