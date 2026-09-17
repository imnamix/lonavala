import { apiClient, ApiResponse } from '../api-client';

export interface CommuniqueData {
  officerName: string;
  designation: string;
  phone: string;
  email: string;
  mediaUrl: string;
  title: string;
  subtitle: string;
  messageBody: string;
  signOff: string;
}

export interface AboutUsData {
  title: string;
  establishedYear: string;
  yearsOfService: string;
  elevation: string;
  mediaUrl: string;
  description: string;
  vision: string;
  mission: string[];
  communique: CommuniqueData;
}

export interface UpdateAboutUsPayload {
  title?: string;
  establishedYear?: string;
  yearsOfService?: string;
  elevation?: string;
  mediaUrl?: string;
  description?: string;
  vision?: string;
  mission?: string[];
  communique?: Partial<CommuniqueData>;
}

export async function getAboutUsData(): Promise<AboutUsData> {
  const res = await apiClient.get<{ aboutUs: AboutUsData }>('/about-us');
  return (
    res.data?.aboutUs || {
      title: 'Lonavala Municipal Council',
      establishedYear: '1877',
      yearsOfService: '148+ Years',
      elevation: '624 meters in the Sahyadri Western Ghats',
      mediaUrl: '',
      description: '',
      vision: '',
      mission: [],
      communique: {
        officerName: '',
        designation: '',
        phone: '',
        email: '',
        mediaUrl: '',
        title: '',
        subtitle: '',
        messageBody: '',
        signOff: '',
      },
    }
  );
}

export async function updateAboutUsData(
  payload: UpdateAboutUsPayload
): Promise<ApiResponse<{ aboutUs: AboutUsData }>> {
  return await apiClient.put<{ aboutUs: AboutUsData }>('/about-us', payload);
}
