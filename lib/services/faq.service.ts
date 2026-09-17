import { apiClient, ApiResponse } from '../api-client';

export interface FaqItemDto {
  id: number;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
  active: boolean;
  createdDate?: string;
  updatedDate?: string;
}

export interface FaqQueryParams {
  search?: string;
  category?: string;
  active?: boolean;
}

export interface CreateFaqPayload {
  question: string;
  answer: string;
  category?: string;
  sortOrder?: number;
  active?: boolean;
}

export interface UpdateFaqPayload extends Partial<CreateFaqPayload> {}

export async function getFaqs(params?: FaqQueryParams): Promise<FaqItemDto[]> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append('search', params.search);
    if (params?.category && params.category !== 'All') {
      searchParams.append('category', params.category);
    }
    if (params?.active !== undefined) {
      searchParams.append('active', String(params.active));
    }

    const qs = searchParams.toString();
    const endpoint = `/faq${qs ? `?${qs}` : ''}`;
    const res = await apiClient.get<FaqItemDto[]>(endpoint);
    return Array.isArray(res.data) ? res.data : [];
  } catch (error) {
    console.warn('Failed to fetch FAQs from API:', error);
    return [];
  }
}

export async function getFaqById(id: string | number): Promise<FaqItemDto | null> {
  try {
    const numId = typeof id === 'string' ? id.replace(/^faq-/, '') : id;
    const res = await apiClient.get<FaqItemDto>(`/faq/${numId}`);
    return res.data || null;
  } catch (error) {
    console.warn(`Failed to fetch FAQ #${id} from API:`, error);
    return null;
  }
}

export async function createFaq(
  payload: CreateFaqPayload
): Promise<ApiResponse<FaqItemDto>> {
  return await apiClient.post<FaqItemDto>('/faq', payload);
}

export async function updateFaq(
  id: string | number,
  payload: UpdateFaqPayload
): Promise<ApiResponse<FaqItemDto>> {
  const numId = typeof id === 'string' ? id.replace(/^faq-/, '') : id;
  return await apiClient.put<FaqItemDto>(`/faq/${numId}`, payload);
}

export async function toggleFaqActive(
  id: string | number
): Promise<ApiResponse<FaqItemDto>> {
  const numId = typeof id === 'string' ? id.replace(/^faq-/, '') : id;
  return await apiClient.patch<FaqItemDto>(`/faq/${numId}/toggle-active`, {});
}

export async function deleteFaq(
  id: string | number
): Promise<ApiResponse<{ success: boolean; message: string }>> {
  const numId = typeof id === 'string' ? id.replace(/^faq-/, '') : id;
  return await apiClient.delete<{ success: boolean; message: string }>(`/faq/${numId}`);
}
