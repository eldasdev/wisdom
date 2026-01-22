'use client';

import { useState, useRef, useCallback } from 'react';
import { ArrowUpTrayIcon, DocumentIcon, XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface PdfUploaderProps {
  onUploadComplete: (url: string, fileName: string) => void;
  onUploadError?: (error: string) => void;
  currentPdfUrl?: string | null;
  currentPdfFileName?: string | null;
  disabled?: boolean;
}

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export function PdfUploader({
  onUploadComplete,
  onUploadError,
  currentPdfUrl,
  currentPdfFileName,
  disabled = false,
}: PdfUploaderProps) {
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return 'Only PDF files are allowed';
    }
    
    if (file.type !== 'application/pdf') {
      return 'Invalid file type. Only PDF files are allowed';
    }
    
    if (file.size > MAX_SIZE) {
      return `File size exceeds maximum of 10MB`;
    }
    
    return null;
  };

  const uploadFile = async (file: File) => {
    // Validate
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setStatus('error');
      onUploadError?.(validationError);
      return;
    }

    setStatus('uploading');
    setProgress(0);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Simulate progress (since fetch doesn't support progress natively)
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Upload failed');
      }

      const result = await response.json();
      
      setProgress(100);
      setStatus('success');
      onUploadComplete(result.url, result.fileName);

      // Reset status after a delay
      setTimeout(() => {
        setStatus('idle');
        setProgress(0);
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      setStatus('error');
      setProgress(0);
      onUploadError?.(errorMessage);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      uploadFile(files[0]);
    }
  }, [disabled]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      uploadFile(files[0]);
    }
  };

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  const handleRemove = () => {
    onUploadComplete('', '');
    setStatus('idle');
    setProgress(0);
    setError(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        PDF Document
      </label>

      {/* Current PDF Display */}
      {currentPdfUrl && status !== 'uploading' && (
        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-3">
            <DocumentIcon className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-900">
                {currentPdfFileName || 'PDF uploaded'}
              </p>
              <a
                href={currentPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-green-600 hover:underline"
              >
                View current PDF
              </a>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="p-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded"
            title="Remove PDF"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          transition-colors duration-200
          ${disabled ? 'bg-gray-50 border-gray-200 cursor-not-allowed' : ''}
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${status === 'error' ? 'border-red-300 bg-red-50' : ''}
          ${status === 'success' ? 'border-green-300 bg-green-50' : ''}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleChange}
          className="hidden"
          disabled={disabled}
        />

        {status === 'uploading' ? (
          <div className="space-y-3">
            <div className="w-12 h-12 mx-auto">
              <svg className="animate-spin w-full h-full text-blue-600" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600">Uploading... {progress}%</p>
          </div>
        ) : status === 'success' ? (
          <div className="space-y-2">
            <CheckCircleIcon className="w-12 h-12 mx-auto text-green-600" />
            <p className="text-sm font-medium text-green-600">Upload successful!</p>
          </div>
        ) : (
          <>
            <ArrowUpTrayIcon className="w-12 h-12 mx-auto text-gray-400" />
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700">
                {currentPdfUrl ? 'Replace PDF' : 'Upload PDF'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Drag and drop or click to select
              </p>
              <p className="text-xs text-gray-400 mt-1">
                PDF only, max 10MB
              </p>
            </div>
          </>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
