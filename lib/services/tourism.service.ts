import { apiClient, ApiResponse } from '../api-client';
import {
  TourismDestination,
  HighlightPair,
  ImportantPoint,
  GalleryImage,
  INITIAL_TOURISM_DESTINATIONS,
} from '@/data/tourismData';

export interface BackendImportantPointDto {
  id?: number;
  icon: string;
  text: string;
  sortOrder?: number;
}

export interface BackendHighlightDto {
  id?: number;
  key: string;
  value: string;
  sortOrder?: number;
}

export interface BackendGalleryMediaDto {
  id?: number;
  mediaUrl: string;
  mediaType?: string;
  sortOrder?: number;
}

export interface TourismSpotDto {
  id: number;
  name: string;
  label: string;
  distance: string;
  mediaUrl: string;
  description: string;
  sortOrder: number;
  active: boolean;
  importantPoints: BackendImportantPointDto[];
  highlights: BackendHighlightDto[];
  galleryMedia: BackendGalleryMediaDto[];
  createdDate?: string;
  updatedDate?: string;
}

export interface TourismQueryParams {
  search?: string;
  active?: boolean;
}

export interface CreateTourismSpotPayload {
  name: string;
  label?: string;
  distance?: string;
  mediaUrl?: string;
  description?: string;
  sortOrder?: number;
  active?: boolean;
  importantPoints?: { icon?: string; text: string; sortOrder?: number }[];
  highlights?: { key: string; value: string; sortOrder?: number }[];
  galleryMedia?: { mediaUrl: string; mediaType?: string; sortOrder?: number }[];
}

export interface UpdateTourismSpotPayload extends Partial<CreateTourismSpotPayload> { }

export function mapDtoToDestination(dto: TourismSpotDto): TourismDestination {
  return {
    id: String(dto.id),
    name: dto.name,
    label: dto.label || '',
    distance: dto.distance || '',
    imageUrl: dto.mediaUrl || '',
    imageFileName: dto.mediaUrl ? dto.mediaUrl.split('/').pop() || 'cover.jpg' : '',
    description: dto.description || '',
    highlights: (dto.highlights || []).map((h, i) => ({
      id: h.id ? String(h.id) : `h-${dto.id}-${i}`,
      key: h.key,
      value: h.value,
    })),
    importantPoints: (dto.importantPoints || []).map((p, i) => ({
      id: p.id ? String(p.id) : `ip-${dto.id}-${i}`,
      icon: p.icon || 'Info',
      text: p.text,
    })),
    galleryImages: (dto.galleryMedia || []).map((g, i) => ({
      id: g.id ? String(g.id) : `gal-${dto.id}-${i}`,
      url: g.mediaUrl,
      fileName: g.mediaUrl ? g.mediaUrl.split('/').pop() || 'gallery.jpg' : 'gallery.jpg',
      mediaType: g.mediaType === 'video' ? 'video' : 'image',
    })),
    active: dto.active,
  };
}

export function mapDestinationToPayload(dest: Partial<TourismDestination>): CreateTourismSpotPayload {
  return {
    name: dest.name || '',
    label: dest.label || '',
    distance: dest.distance || '',
    mediaUrl: dest.imageUrl || '',
    description: dest.description || '',
    active: dest.active !== undefined ? dest.active : true,
    highlights: (dest.highlights || [])
      .filter((h) => h.key?.trim() || h.value?.trim())
      .map((h, i) => ({
        key: h.key.trim(),
        value: h.value.trim(),
        sortOrder: i + 1,
      })),
    importantPoints: (dest.importantPoints || [])
      .filter((p) => p.text?.trim())
      .map((p, i) => ({
        icon: p.icon || 'Info',
        text: p.text.trim(),
        sortOrder: i + 1,
      })),
    galleryMedia: (dest.galleryImages || [])
      .filter((g) => g.url?.trim())
      .map((g, i) => ({
        mediaUrl: g.url.trim(),
        mediaType: g.mediaType || 'image',
        sortOrder: i + 1,
      })),
  };
}

export async function getTourismSpots(params?: TourismQueryParams): Promise<TourismDestination[]> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append('search', params.search);
    if (params?.active !== undefined) {
      searchParams.append('active', String(params.active));
    }

    const qs = searchParams.toString();
    const endpoint = `/tourism${qs ? `?${qs}` : ''}`;
    const res = await apiClient.get<TourismSpotDto[] | { tourism: TourismSpotDto[] }>(endpoint);

    let list: TourismSpotDto[] = [];
    if (Array.isArray(res.data)) {
      list = res.data;
    } else if (res.data && Array.isArray((res.data as any).tourism)) {
      list = (res.data as any).tourism;
    }

    if (list.length > 0) {
      return list.map(mapDtoToDestination);
    }

    // Fallback to initial destinations if DB empty
    return INITIAL_TOURISM_DESTINATIONS;
  } catch (error) {
    console.warn('Failed to fetch tourism spots from API, falling back to mock data:', error);
    return INITIAL_TOURISM_DESTINATIONS;
  }
}

export async function getTourismSpotById(id: string | number): Promise<TourismDestination | null> {
  try {
    const numId = typeof id === 'string' ? id.replace(/^dest-/, '') : id;
    if (isNaN(Number(numId))) {
      const fallback = INITIAL_TOURISM_DESTINATIONS.find((d) => d.id === String(id));
      return fallback || null;
    }

    const res = await apiClient.get<TourismSpotDto>(`/tourism/${numId}`);
    if (res.data) {
      return mapDtoToDestination(res.data);
    }

    const fallback = INITIAL_TOURISM_DESTINATIONS.find((d) => d.id === String(id));
    return fallback || null;
  } catch (error) {
    console.warn(`Failed to fetch tourism spot #${id} from API:`, error);
    const fallback = INITIAL_TOURISM_DESTINATIONS.find((d) => d.id === String(id));
    return fallback || null;
  }
}

export async function createTourismSpot(
  payload: CreateTourismSpotPayload
): Promise<ApiResponse<TourismSpotDto>> {
  return await apiClient.post<TourismSpotDto>('/tourism', payload);
}

export async function updateTourismSpot(
  id: string | number,
  payload: UpdateTourismSpotPayload
): Promise<ApiResponse<TourismSpotDto>> {
  const numId = typeof id === 'string' ? id.replace(/^dest-/, '') : id;
  return await apiClient.put<TourismSpotDto>(`/tourism/${numId}`, payload);
}

export async function toggleTourismSpotActive(
  id: string | number
): Promise<ApiResponse<TourismSpotDto>> {
  const numId = typeof id === 'string' ? id.replace(/^dest-/, '') : id;
  return await apiClient.patch<TourismSpotDto>(`/tourism/${numId}/toggle-active`, {});
}

export async function deleteTourismSpot(
  id: string | number
): Promise<ApiResponse<{ success: boolean; message: string }>> {
  const numId = typeof id === 'string' ? id.replace(/^dest-/, '') : id;
  return await apiClient.delete<{ success: boolean; message: string }>(`/tourism/${numId}`);
}
