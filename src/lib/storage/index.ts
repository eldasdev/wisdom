/**
 * Storage abstraction layer for file uploads
 * Uses Vercel Blob for cloud storage
 */

import { put, del, head } from '@vercel/blob';
import path from 'path';

// Upload result interface
export interface UploadResult {
  url: string;
  fileName: string;
  size: number;
  mimeType: string;
}

/**
 * Validate PDF file
 */
export function validatePdfFile(file: File | Buffer, fileName: string): { valid: boolean; error?: string } {
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = ['application/pdf'];
  
  // Check file extension
  if (!fileName.toLowerCase().endsWith('.pdf')) {
    return { valid: false, error: 'Only PDF files are allowed' };
  }

  // Check file size
  const size = file instanceof File ? file.size : file.length;
  if (size > MAX_SIZE) {
    return { valid: false, error: `File size exceeds maximum of ${MAX_SIZE / 1024 / 1024}MB` };
  }

  // Check mime type if File object
  if (file instanceof File && !ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Only PDF files are allowed' };
  }

  return { valid: true };
}

/**
 * Generate unique filename
 */
export function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const ext = path.extname(originalName);
  const baseName = path.basename(originalName, ext)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .substring(0, 50);
  
  return `${baseName}-${timestamp}-${random}${ext}`;
}

/**
 * Upload file to Vercel Blob storage
 */
export async function uploadFile(
  buffer: Buffer,
  fileName: string,
  subDir: string = 'pdfs'
): Promise<UploadResult> {
  const uniqueFileName = generateUniqueFileName(fileName);
  const blobPath = `${subDir}/${uniqueFileName}`;

  // Upload to Vercel Blob
  const blob = await put(blobPath, buffer, {
    access: 'public',
    contentType: 'application/pdf',
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  return {
    url: blob.url,
    fileName: uniqueFileName,
    size: buffer.length,
    mimeType: 'application/pdf',
  };
}

/**
 * Delete file from Vercel Blob storage
 */
export async function deleteFile(fileUrl: string): Promise<boolean> {
  try {
    // Extract blob URL from the file URL
    // Vercel Blob URLs are full URLs, so we can use them directly
    if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
      await del(fileUrl, {
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      return true;
    }
    
    // If it's an old local path, it doesn't exist in blob storage
    return false;
  } catch (error) {
    console.error('Error deleting file from blob storage:', error);
    return false;
  }
}

/**
 * Check if a file exists in Vercel Blob storage
 */
export async function fileExists(fileUrl: string): Promise<boolean> {
  try {
    // For Vercel Blob URLs, we can check by making a HEAD request
    if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
      const response = await head(fileUrl, {
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      return response !== null;
    }
    
    // Old local paths don't exist in blob storage
    return false;
  } catch (error) {
    return false;
  }
}
