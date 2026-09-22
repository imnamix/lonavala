import { apiClient, ApiResponse } from '../api-client';

export interface GlanceItemDto {
  id: number;
  title: string;
  value: string;
  tag: string;
  icon: string;
  sortOrder: number;
  active: boolean;
  createdDate?: string;
  updatedDate?: string;
}

export interface GlanceQueryParams {
  search?: string;
  active?: boolean;
}

export interface CreateGlancePayload {
  title: string;
  value: string;
  tag?: string;
  icon?: string;
  sortOrder?: number;
  active?: boolean;
}

export interface UpdateGlancePayload extends Partial<CreateGlancePayload> { }

export async function getGlanceItems(params?: GlanceQueryParams): Promise<GlanceItemDto[]> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append('search', params.search);
    if (params?.active !== undefined) {
      searchParams.append('active', String(params.active));
    }

    const qs = searchParams.toString();
    const endpoint = `/glance${qs ? `?${qs}` : ''}`;
    const res = await apiClient.get<GlanceItemDto[]>(endpoint);
    return Array.isArray(res.data) ? res.data : [];
  } catch (error) {
    console.warn('Failed to fetch Glance items from API:', error);
    return [];
  }
}

export async function getGlanceItemById(id: string | number): Promise<GlanceItemDto | null> {
  try {
    const numId = typeof id === 'string' ? id.replace(/^glance-/, '') : id;
    const res = await apiClient.get<GlanceItemDto>(`/glance/${numId}`);
    return res.data || null;
  } catch (error) {
    console.warn(`Failed to fetch Glance item #${id} from API:`, error);
    return null;
  }
}

export async function createGlanceItem(
  payload: CreateGlancePayload
): Promise<ApiResponse<GlanceItemDto>> {
  return await apiClient.post<GlanceItemDto>('/glance', payload);
}

export async function updateGlanceItem(
  id: string | number,
  payload: UpdateGlancePayload
): Promise<ApiResponse<GlanceItemDto>> {
  const numId = typeof id === 'string' ? id.replace(/^glance-/, '') : id;
  return await apiClient.put<GlanceItemDto>(`/glance/${numId}`, payload);
}

export async function toggleGlanceActive(
  id: string | number
): Promise<ApiResponse<GlanceItemDto>> {
  const numId = typeof id === 'string' ? id.replace(/^glance-/, '') : id;
  return await apiClient.patch<GlanceItemDto>(`/glance/${numId}/toggle-active`, {});
}

export async function reorderGlanceItems(
  items: { id: number; sortOrder: number }[]
): Promise<ApiResponse<GlanceItemDto[]>> {
  return await apiClient.patch<GlanceItemDto[]>('/glance/reorder', { items });
}

export async function bulkSaveGlanceItems(
  items: Array<{
    id?: number | string;
    title: string;
    value: string;
    tag?: string;
    icon?: string;
    sortOrder?: number;
    active?: boolean;
  }>
): Promise<ApiResponse<GlanceItemDto[]>> {
  return await apiClient.put<GlanceItemDto[]>('/glance/bulk', { items });
}

export async function deleteGlanceItem(
  id: string | number
): Promise<ApiResponse<{ success: boolean; message: string }>> {
  const numId = typeof id === 'string' ? id.replace(/^glance-/, '') : id;
  return await apiClient.delete<{ success: boolean; message: string }>(`/glance/${numId}`);
}
