import { apiClient, ApiResponse } from '../api-client';

export interface HeroButton {
  id?: string | number;
  name: string;
  url: string;
  icon: string;
  color: string;
  active: boolean;
  sortOrder?: number;
}

export interface HeroTag {
  id?: string | number;
  name: string;
  icon: string;
  active: boolean;
  sortOrder?: number;
}

export interface HeroSlide {
  id?: string | number;
  slideTitle: string;
  alignment: 'left' | 'center' | 'right';
  badgeEn?: string;
  badgeMr?: string;
  headlineEn: string;
  headlineMr?: string;
  taglineEn?: string;
  taglineMr?: string;
  mediaUrl: string;
  showButtons?: boolean;
  showTags?: boolean;
  active: boolean;
  sortOrder?: number;
  buttons?: HeroButton[];
  tags?: HeroTag[];
}

export interface HomepageData {
  announcement: string;
  announcementActive: boolean;
  slides: HeroSlide[];
}

export interface UpdateHomepagePayload {
  announcement?: string;
  announcementActive?: boolean;
  slides?: {
    id?: number;
    slideTitle: string;
    alignment: string;
    badgeEn?: string;
    badgeMr?: string;
    headlineEn: string;
    headlineMr?: string;
    taglineEn?: string;
    taglineMr?: string;
    mediaUrl: string;
    showButtons?: boolean;
    showTags?: boolean;
    active?: boolean;
    sortOrder?: number;
    buttons?: {
      name: string;
      url: string;
      icon: string;
      color: string;
      active: boolean;
      sortOrder?: number;
    }[];
    tags?: {
      name: string;
      icon: string;
      active: boolean;
      sortOrder?: number;
    }[];
  }[];
}

export async function getHomepageData(all = true): Promise<HomepageData> {
  const query = all ? '?all=true' : '';
  const res = await apiClient.get<{ homepage: HomepageData }>(`/homepage${query}`);
  return (
    res.data?.homepage || {
      announcement: '',
      announcementActive: false,
      slides: [],
    }
  );
}

export async function updateHomepageData(
  payload: UpdateHomepagePayload
): Promise<ApiResponse<{ homepage: HomepageData }>> {
  return await apiClient.put<{ homepage: HomepageData }>('/homepage', payload);
}
