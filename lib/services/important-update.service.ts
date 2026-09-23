import { apiClient } from '../api-client';

export type UpdateActionType =
  | 'DOWNLOAD_FILE'
  | 'EXTERNAL_LINK'
  | 'INTERNAL_ROUTE'
  | 'CUSTOM_PAGE';

export interface UpdateAttachment {
  id?: string;
  name: string;
  url: string;
  type?: string;
  size?: string;
}

export interface ImportantUpdateRecord {
  id: number;
  title: string;
  tag: string;
  tagBgColor?: string;
  tagTextColor?: string;
  actionType: UpdateActionType;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  fileType?: string;
  externalUrl?: string;
  openInNewTab: boolean;
  internalRoute?: string;
  slug?: string;
  summary?: string;
  description?: string;
  featuredImage?: string;
  attachments: UpdateAttachment[];
  images: string[];
  isActive: boolean;
  isPinned: boolean;
  priority: number;
  startDate?: string;
  endDate?: string;
  viewsCount: number;
  createdDate: string;
  updatedDate: string;
}

export interface QueryImportantUpdateParams {
  search?: string;
  actionType?: UpdateActionType;
  tag?: string;
  isActive?: boolean;
  isPinned?: boolean;
  page?: number;
  limit?: number;
}

export interface CreateImportantUpdatePayload {
  title: string;
  tag?: string;
  tagBgColor?: string;
  tagTextColor?: string;
  actionType: UpdateActionType;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  fileType?: string;
  externalUrl?: string;
  openInNewTab?: boolean;
  internalRoute?: string;
  slug?: string;
  summary?: string;
  description?: string;
  featuredImage?: string;
  attachments?: UpdateAttachment[];
  images?: string[];
  isActive?: boolean;
  isPinned?: boolean;
  priority?: number;
  startDate?: string;
  endDate?: string;
}

export type UpdateImportantUpdatePayload = Partial<CreateImportantUpdatePayload>;

export interface PaginatedUpdatesResponse {
  items: ImportantUpdateRecord[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Fetch all important updates with pagination and filters
 */
export async function getAllImportantUpdates(
  params?: QueryImportantUpdateParams
): Promise<PaginatedUpdatesResponse> {
  const queryParts: string[] = [];
  if (params?.search) queryParts.push(`search=${encodeURIComponent(params.search)}`);
  if (params?.actionType) queryParts.push(`actionType=${encodeURIComponent(params.actionType)}`);
  if (params?.tag) queryParts.push(`tag=${encodeURIComponent(params.tag)}`);
  if (params?.isActive !== undefined) queryParts.push(`isActive=${params.isActive}`);
  if (params?.isPinned !== undefined) queryParts.push(`isPinned=${params.isPinned}`);
  if (params?.page) queryParts.push(`page=${params.page}`);
  if (params?.limit) queryParts.push(`limit=${params.limit}`);

  const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
  const response = await apiClient.get<PaginatedUpdatesResponse>(
    `/important-updates${queryString}`
  );
  return response.data || { items: [], pagination: { total: 0, page: 1, limit: 20, totalPages: 0 } };
}

/**
 * Fetch active important updates for homepage tag ticker/badges
 */
export async function getActiveImportantUpdates(limit = 10): Promise<ImportantUpdateRecord[]> {
  const response = await apiClient.get<ImportantUpdateRecord[]>(
    `/important-updates/active?limit=${limit}`
  );
  return response.data || [];
}

/**
 * Fetch a single important update by ID or Slug
 */
export async function getImportantUpdateByIdOrSlug(
  idOrSlug: string | number,
  trackView = false
): Promise<ImportantUpdateRecord> {
  const query = trackView ? '?trackView=true' : '';
  const response = await apiClient.get<ImportantUpdateRecord>(
    `/important-updates/${idOrSlug}${query}`
  );
  if (!response.data) {
    throw new Error(response.message || 'Important update not found');
  }
  return response.data;
}

/**
 * Create a new important update
 */
export async function createImportantUpdate(
  payload: CreateImportantUpdatePayload
): Promise<ImportantUpdateRecord> {
  const response = await apiClient.post<ImportantUpdateRecord>(
    '/important-updates',
    payload
  );
  if (!response.data) {
    throw new Error(response.message || 'Failed to create important update');
  }
  return response.data;
}

/**
 * Update an existing important update
 */
export async function updateImportantUpdate(
  id: number | string,
  payload: UpdateImportantUpdatePayload
): Promise<ImportantUpdateRecord> {
  const response = await apiClient.put<ImportantUpdateRecord>(
    `/important-updates/${id}`,
    payload
  );
  if (!response.data) {
    throw new Error(response.message || 'Failed to update important update');
  }
  return response.data;
}

/**
 * Quick toggle active status
 */
export async function toggleImportantUpdateActive(
  id: number | string
): Promise<ImportantUpdateRecord> {
  const response = await apiClient.patch<ImportantUpdateRecord>(
    `/important-updates/${id}/toggle-active`
  );
  if (!response.data) {
    throw new Error(response.message || 'Failed to toggle active status');
  }
  return response.data;
}

/**
 * Quick toggle pinned status
 */
export async function toggleImportantUpdatePin(
  id: number | string
): Promise<ImportantUpdateRecord> {
  const response = await apiClient.patch<ImportantUpdateRecord>(
    `/important-updates/${id}/toggle-pin`
  );
  if (!response.data) {
    throw new Error(response.message || 'Failed to toggle pinned status');
  }
  return response.data;
}

/**
 * Delete an important update
 */
export async function deleteImportantUpdate(
  id: number | string
): Promise<{ message: string }> {
  const response = await apiClient.delete<{ message: string }>(
    `/important-updates/${id}`
  );
  return { message: response.message || 'Update deleted successfully' };
}
