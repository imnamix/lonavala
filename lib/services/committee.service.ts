import { apiClient, ApiResponse } from '../api-client';
import { StandingCommittee, CouncilMember } from '@/types';

export interface CommitteeDto {
  id: number;
  name: string;
  marathiName: string;
  description: string;
  chairmanId: number | null;
  chairman?: any;
  memberIds: number[];
  members?: any[];
  isActive: boolean;
  displayOrder: number;
  createdDate?: string;
  updatedDate?: string;
}

export interface CommitteeQueryParams {
  search?: string;
  isActive?: boolean;
}

export interface CreateCommitteePayload {
  name: string;
  marathiName?: string;
  description?: string;
  chairmanId?: number | null;
  memberIds?: number[];
  isActive?: boolean;
  displayOrder?: number;
}

export type UpdateCommitteePayload = Partial<CreateCommitteePayload>;

function mapDtoToCommittee(dto: CommitteeDto): StandingCommittee {
  let mappedChairman: CouncilMember | null = null;
  if (dto.chairman) {
    mappedChairman = {
      id: String(dto.chairman.id),
      name: dto.chairman.name,
      marathiName: dto.chairman.marathiName || '',
      designation: dto.chairman.designation,
      roleCategory: dto.chairman.roleCategory || 'Corporator',
      ward: dto.chairman.ward || '',
      tenure: dto.chairman.tenure || '2024 - 2029',
      committee: dto.chairman.committee || '',
      phone: dto.chairman.phone || '',
      email: dto.chairman.email || '',
      address: dto.chairman.address,
      image: dto.chairman.imageUrl || '',
      message: dto.chairman.message || '',
      active: dto.chairman.active !== false,
    };
  }

  const mappedMembers: CouncilMember[] = Array.isArray(dto.members)
    ? dto.members.map((m: any) => ({
        id: String(m.id),
        name: m.name,
        marathiName: m.marathiName || '',
        designation: m.designation,
        roleCategory: m.roleCategory || 'Corporator',
        ward: m.ward || '',
        tenure: m.tenure || '2024 - 2029',
        committee: m.committee || '',
        phone: m.phone || '',
        email: m.email || '',
        address: m.address,
        image: m.imageUrl || '',
        message: m.message || '',
        active: m.active !== false,
      }))
    : [];

  return {
    id: dto.id,
    name: dto.name,
    marathiName: dto.marathiName || '',
    description: dto.description || '',
    chairmanId: dto.chairmanId,
    chairman: mappedChairman,
    memberIds: Array.isArray(dto.memberIds) ? dto.memberIds : [],
    members: mappedMembers,
    isActive: dto.isActive !== false,
    displayOrder: dto.displayOrder || 0,
    createdDate: dto.createdDate,
    updatedDate: dto.updatedDate,
  };
}

export async function getCommittees(params?: CommitteeQueryParams): Promise<StandingCommittee[]> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append('search', params.search);
    if (params?.isActive !== undefined) {
      searchParams.append('isActive', String(params.isActive));
    }

    const qs = searchParams.toString();
    const endpoint = `/committee${qs ? `?${qs}` : ''}`;
    const res = await apiClient.get<CommitteeDto[]>(endpoint, {
      cache: 'no-store',
    });
    const list = Array.isArray(res.data) ? res.data : [];
    return list.map(mapDtoToCommittee);
  } catch (error) {
    console.warn('Failed to fetch standing committees from API:', error);
    return [];
  }
}

export async function getCommitteeById(id: string | number): Promise<StandingCommittee | null> {
  try {
    const numId = typeof id === 'string' ? id.replace(/^comm-/, '') : id;
    const res = await apiClient.get<CommitteeDto>(`/committee/${numId}`);
    if (res.data) {
      return mapDtoToCommittee(res.data);
    }
    return null;
  } catch (error) {
    console.warn(`Failed to fetch standing committee #${id} from API:`, error);
    return null;
  }
}

export async function createCommittee(
  payload: CreateCommitteePayload,
): Promise<ApiResponse<CommitteeDto>> {
  return await apiClient.post<CommitteeDto>('/committee', payload);
}

export async function updateCommittee(
  id: string | number,
  payload: UpdateCommitteePayload,
): Promise<ApiResponse<CommitteeDto>> {
  const numId = typeof id === 'string' ? id.replace(/^comm-/, '') : id;
  return await apiClient.put<CommitteeDto>(`/committee/${numId}`, payload);
}

export async function toggleCommitteeActive(
  id: string | number,
): Promise<ApiResponse<CommitteeDto>> {
  const numId = typeof id === 'string' ? id.replace(/^comm-/, '') : id;
  return await apiClient.patch<CommitteeDto>(`/committee/${numId}/toggle-active`, {});
}

export async function deleteCommittee(
  id: string | number,
): Promise<ApiResponse<{ success: boolean; message: string }>> {
  const numId = typeof id === 'string' ? id.replace(/^comm-/, '') : id;
  return await apiClient.delete<{ success: boolean; message: string }>(`/committee/${numId}`);
}
