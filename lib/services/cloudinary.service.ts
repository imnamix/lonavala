import { apiClient, ApiResponse } from '../api-client';

export interface CloudinaryAsset {
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  resource_type: string;
  bytes: number;
  width?: number;
  height?: number;
  original_filename?: string;
  created_at?: string;
}

/**
 * Upload a single file (image, video, PDF, document) to Cloudinary via backend API
 * @param file The browser File object to upload
 * @param folder The destination folder in Cloudinary (e.g. 'lonavala/homepage')
 */
export async function uploadToCloudinary(
  file: File,
  folder = 'lonavala/homepage'
): Promise<CloudinaryAsset> {
  const formData = new FormData();
  formData.append('file', file);

  const query = folder ? `?folder=${encodeURIComponent(folder)}` : '';
  const response = await apiClient.upload<CloudinaryAsset>(
    `/cloudinary/upload${query}`,
    formData
  );

  if (!response.data) {
    throw new Error(response.message || 'Failed to retrieve uploaded file data from Cloudinary');
  }

  return response.data;
}

/**
 * Upload multiple files to Cloudinary in a single batch
 * @param files Array of browser File objects
 * @param folder The destination folder in Cloudinary
 */
export async function uploadMultipleToCloudinary(
  files: File[],
  folder = 'lonavala'
): Promise<CloudinaryAsset[]> {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });

  const query = folder ? `?folder=${encodeURIComponent(folder)}` : '';
  const response = await apiClient.upload<CloudinaryAsset[]>(
    `/cloudinary/upload-multiple${query}`,
    formData
  );

  return response.data || [];
}

/**
 * Delete an asset from Cloudinary by its public ID
 * @param publicId Cloudinary public_id
 * @param resourceType 'image' | 'video' | 'raw'
 */
export async function deleteFromCloudinary(
  publicId: string,
  resourceType: 'image' | 'video' | 'raw' = 'image'
): Promise<ApiResponse<{ result: string }>> {
  const query = resourceType ? `?resourceType=${resourceType}` : '';
  return await apiClient.delete<{ result: string }>(
    `/cloudinary/${encodeURIComponent(publicId)}${query}`
  );
}
