import { apiClient, ApiResponse } from '../api-client';
import { CouncilResolution } from '@/types';

export interface ResolutionDto {
  id: number;
  resolutionNumber?: string;
  title: string;
  marathiTitle?: string;
  meetingType: string;
  resolutionDate?: string;
  durationFrom?: string;
  durationTo?: string;
  description?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  isActive: boolean;
  displayOrder: number;
  createdDate?: string;
  updatedDate?: string;
}

export interface ResolutionQueryParams {
  search?: string;
  meetingType?: string;
  isActive?: boolean;
}

export interface CreateResolutionPayload {
  resolutionNumber?: string;
  title: string;
  marathiTitle?: string;
  meetingType?: string;
  resolutionDate?: string;
  durationFrom?: string;
  durationTo?: string;
  description?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  isActive?: boolean;
  displayOrder?: number;
}

export type UpdateResolutionPayload = Partial<CreateResolutionPayload>;

function mapDtoToResolution(dto: ResolutionDto): CouncilResolution {
  return {
    id: dto.id,
    resolutionNumber: dto.resolutionNumber || '',
    title: dto.title,
    marathiTitle: dto.marathiTitle || '',
    meetingType: dto.meetingType || 'General Body Meeting',
    resolutionDate: dto.resolutionDate || '',
    durationFrom: dto.durationFrom || '',
    durationTo: dto.durationTo || '',
    description: dto.description || '',
    fileUrl: dto.fileUrl || '',
    fileName: dto.fileName || '',
    fileSize: dto.fileSize || '',
    isActive: dto.isActive !== false,
    displayOrder: dto.displayOrder || 0,
    createdDate: dto.createdDate,
    updatedDate: dto.updatedDate,
  };
}

export async function getResolutions(params?: ResolutionQueryParams): Promise<CouncilResolution[]> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append('search', params.search);
    if (params?.meetingType && params.meetingType !== 'ALL') {
      searchParams.append('meetingType', params.meetingType);
    }
    if (params?.isActive !== undefined) {
      searchParams.append('isActive', String(params.isActive));
    }

    const qs = searchParams.toString();
    const endpoint = `/resolution${qs ? `?${qs}` : ''}`;
    const res = await apiClient.get<ResolutionDto[]>(endpoint, {
      cache: 'no-store',
    });
    const list = Array.isArray(res.data) ? res.data : [];
    return list.map(mapDtoToResolution);
  } catch (error) {
    console.warn('Failed to fetch council resolutions from API:', error);
    return [];
  }
}

export async function getResolutionById(id: string | number): Promise<CouncilResolution | null> {
  try {
    const numId = typeof id === 'string' ? id.replace(/^res-/, '') : id;
    const res = await apiClient.get<ResolutionDto>(`/resolution/${numId}`);
    if (res.data) {
      return mapDtoToResolution(res.data);
    }
    return null;
  } catch (error) {
    console.warn(`Failed to fetch council resolution #${id} from API:`, error);
    return null;
  }
}

export async function createResolution(
  payload: CreateResolutionPayload,
): Promise<ApiResponse<ResolutionDto>> {
  return await apiClient.post<ResolutionDto>('/resolution', payload);
}

export async function updateResolution(
  id: string | number,
  payload: UpdateResolutionPayload,
): Promise<ApiResponse<ResolutionDto>> {
  const numId = typeof id === 'string' ? id.replace(/^res-/, '') : id;
  return await apiClient.put<ResolutionDto>(`/resolution/${numId}`, payload);
}

export async function toggleResolutionActive(
  id: string | number,
): Promise<ApiResponse<ResolutionDto>> {
  const numId = typeof id === 'string' ? id.replace(/^res-/, '') : id;
  return await apiClient.patch<ResolutionDto>(`/resolution/${numId}/toggle-active`, {});
}

export async function deleteResolution(
  id: string | number,
): Promise<ApiResponse<{ success: boolean; message: string }>> {
  const numId = typeof id === 'string' ? id.replace(/^res-/, '') : id;
  return await apiClient.delete<{ success: boolean; message: string }>(`/resolution/${numId}`);
}
