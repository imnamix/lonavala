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
 * Compresses a raster image in the browser and converts it to WebP format.
 * Non-image files (PDFs, docs) and vector files (SVGs) are returned untouched.
 * @param file The browser File object
 * @param quality Compression quality from 0.1 to 1.0 (default: 0.82)
 * @param maxWidth Maximum width in pixels (default: 1920)
 * @param maxHeight Maximum height in pixels (default: 1920)
 */
export async function compressImageToWebp(
  file: File,
  quality = 0.82,
  maxWidth = 1920,
  maxHeight = 1920
): Promise<File> {
  // If not in browser environment or not a raster image, return original
  if (typeof window === 'undefined') return file;

  const isRasterImage =
    file.type.startsWith('image/') &&
    file.type !== 'image/svg+xml' &&
    !file.name.toLowerCase().endsWith('.svg');

  if (!isRasterImage) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        // Downscale proportionally if larger than maximum boundary
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(file); // Fallback to original
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return resolve(file); // Fallback to original
            }
            const cleanName = file.name.replace(/\.[^/.]+$/, '');
            const webpFile = new File([blob], `${cleanName}.webp`, {
              type: 'image/webp',
              lastModified: Date.now(),
            });
            resolve(webpFile);
          },
          'image/webp',
          quality
        );
      };
      img.onerror = () => resolve(file);
      img.src = event.target?.result as string;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}

/**
 * Upload a single file (image, video, PDF, document) to Cloudinary via backend API
 * Automatically compresses raster images into WebP before uploading.
 * @param file The browser File object to upload
 * @param folder The destination folder in Cloudinary (e.g. 'lonavala/homepage')
 */
export async function uploadToCloudinary(
  file: File,
  folder = 'lonavala/homepage'
): Promise<CloudinaryAsset> {
  const processedFile = await compressImageToWebp(file);
  const formData = new FormData();
  formData.append('file', processedFile);

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
 * Automatically compresses raster images into WebP before uploading.
 * @param files Array of browser File objects
 * @param folder The destination folder in Cloudinary
 */
export async function uploadMultipleToCloudinary(
  files: File[],
  folder = 'lonavala'
): Promise<CloudinaryAsset[]> {
  const processedFiles = await Promise.all(
    files.map((file) => compressImageToWebp(file))
  );

  const formData = new FormData();
  processedFiles.forEach((file) => {
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
