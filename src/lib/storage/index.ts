/**
 * Storage abstraction layer for file uploads
 * Supports local storage (dev) and AWS S3 (production)
 */

import { writeFile, mkdir, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// Storage provider type
export type StorageProvider = 'local' | 's3';

// Upload result interface
export interface UploadResult {
  url: string;
  fileName: string;
  size: number;
  mimeType: string;
}

// Storage configuration
const config = {
  provider: (process.env.STORAGE_PROVIDER || 'local') as StorageProvider,
  // Local storage config
  localUploadDir: process.env.LOCAL_UPLOAD_DIR || 'public/uploads',
  // S3 config
  s3Bucket: process.env.S3_BUCKET || '',
  s3Region: process.env.S3_REGION || 'us-east-1',
  s3AccessKey: process.env.AWS_ACCESS_KEY_ID || '',
  s3SecretKey: process.env.AWS_SECRET_ACCESS_KEY || '',
};

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
async function uploadToLocal(buffer: Buffer, fileName: string, subDir: string = 'pdfs'): Promise<UploadResult> {
  const uploadDir = path.join(process.cwd(), config.localUploadDir, subDir);
  
  // Create directory if it doesn't exist
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }

  const uniqueFileName = generateUniqueFileName(fileName);
  const filePath = path.join(uploadDir, uniqueFileName);
  
  await writeFile(filePath, buffer);

  // Return public URL
  const url = `/${config.localUploadDir}/${subDir}/${uniqueFileName}`.replace('public/', '');

  return {
    url,
    fileName: uniqueFileName,
    size: buffer.length,
    mimeType: 'application/pdf',
  };
}

/**
 * Upload file to AWS S3
 */
async function uploadToS3(buffer: Buffer, fileName: string, subDir: string = 'pdfs'): Promise<UploadResult> {
  // Dynamic import to avoid loading AWS SDK when not needed
  const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3');

  const client = new S3Client({
    region: config.s3Region,
    credentials: {
      accessKeyId: config.s3AccessKey,
      secretAccessKey: config.s3SecretKey,
    },
  });

  const uniqueFileName = generateUniqueFileName(fileName);
  const key = `${subDir}/${uniqueFileName}`;

  const command = new PutObjectCommand({
    Bucket: config.s3Bucket,
    Key: key,
    Body: buffer,
    ContentType: 'application/pdf',
    // Public read access for academic content
    ACL: 'public-read',
  });

  await client.send(command);

  // Construct public URL
  const url = `https://${config.s3Bucket}.s3.${config.s3Region}.amazonaws.com/${key}`;

  return {
    url,
    fileName: uniqueFileName,
    size: buffer.length,
    mimeType: 'application/pdf',
  };
}

/**
 * Upload file using configured provider
 */
export async function uploadFile(
  buffer: Buffer,
  fileName: string,
  subDir: string = 'pdfs'
): Promise<UploadResult> {
  if (config.provider === 's3' && config.s3Bucket) {
    return uploadToS3(buffer, fileName, subDir);
  }
  return uploadToLocal(buffer, fileName, subDir);
}

/**
 * Delete file from storage
 */
export async function deleteFile(fileUrl: string): Promise<boolean> {
  try {
    if (config.provider === 's3' && config.s3Bucket) {
      const { S3Client, DeleteObjectCommand } = await import('@aws-sdk/client-s3');
      
      const client = new S3Client({
        region: config.s3Region,
        credentials: {
          accessKeyId: config.s3AccessKey,
          secretAccessKey: config.s3SecretKey,
        },
      });

      // Extract key from URL
      const urlParts = fileUrl.split('.amazonaws.com/');
      if (urlParts.length < 2) return false;
      
      const key = urlParts[1];
      const command = new DeleteObjectCommand({
        Bucket: config.s3Bucket,
        Key: key,
      });

      await client.send(command);
      return true;
    } else {
      // Local deletion
      const filePath = path.join(process.cwd(), 'public', fileUrl);
      if (existsSync(filePath)) {
        await unlink(filePath);
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
}
