/**
 * Storage abstraction layer for file uploads
 * Currently supports local storage for development
 * Can be extended to support cloud storage (Vercel Blob, Uploadthing, etc.)
 */

import { writeFile, mkdir, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// Upload result interface
export interface UploadResult {
  url: string;
  fileName: string;
  size: number;
  mimeType: string;
}

// Configuration
const LOCAL_UPLOAD_DIR = process.env.LOCAL_UPLOAD_DIR || 'public/uploads';

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
 * Upload file to local storage
 */
export async function uploadFile(
  buffer: Buffer,
  fileName: string,
  subDir: string = 'pdfs'
): Promise<UploadResult> {
  const uploadDir = path.join(process.cwd(), LOCAL_UPLOAD_DIR, subDir);
  
  // Create directory if it doesn't exist
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }

  const uniqueFileName = generateUniqueFileName(fileName);
  const filePath = path.join(uploadDir, uniqueFileName);
  
  await writeFile(filePath, buffer);

  // Return public URL
  const url = `/${LOCAL_UPLOAD_DIR}/${subDir}/${uniqueFileName}`.replace('public/', '');

  return {
    url,
    fileName: uniqueFileName,
    size: buffer.length,
    mimeType: 'application/pdf',
  };
}

/**
 * Delete file from storage
 */
export async function deleteFile(fileUrl: string): Promise<boolean> {
  try {
    const filePath = path.join(process.cwd(), 'public', fileUrl);
    if (existsSync(filePath)) {
      await unlink(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
}

/**
 * Check if a file exists
 */
export function fileExists(fileUrl: string): boolean {
  const filePath = path.join(process.cwd(), 'public', fileUrl);
  return existsSync(filePath);
}
