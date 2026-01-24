'use client';

import { useState, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon,
  ArrowsPointingOutIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';

// Import CSS for react-pdf
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up PDF.js worker - use local copy for reliability
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface PdfViewerProps {
  pdfUrl: string;
  fileName?: string;
  className?: string;
  showOpenInNewTab?: boolean;
}

/**
 * Convert a static PDF URL to use the API route for better compatibility
 * This ensures proper CORS headers and guest user access
 */
function getPdfApiUrl(url: string): string {
  // If the URL starts with /uploads/, use the API route
  if (url.startsWith('/uploads/')) {
    // Convert /uploads/pdfs/file.pdf to /api/pdf/pdfs/file.pdf
    return `/api/pdf${url.replace('/uploads', '')}`;
  }
  return url;
}

export function PdfViewer({ 
  pdfUrl, 
  fileName, 
  className = '',
  showOpenInNewTab = true,
}: PdfViewerProps) {
  // Use the API route for better compatibility
  const apiUrl = useMemo(() => getPdfApiUrl(pdfUrl), [pdfUrl]);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  };

  const onDocumentLoadError = (err: Error) => {
    console.error('PDF load error:', err);
    setError('Failed to load PDF document');
    setLoading(false);
  };

  const goToPrevPage = () => {
    setPageNumber(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber(prev => Math.min(prev + 1, numPages));
  };

  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 3));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5));
  };

  const resetZoom = () => {
    setScale(1.0);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = apiUrl;
    link.download = fileName || 'document.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenInNewTab = () => {
    window.open(apiUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`bg-gray-100 rounded-lg overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          {/* Page Navigation */}
          <button
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded disabled:opacity-40 disabled:cursor-not-allowed"
            title="Previous page"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          
          <span className="text-sm text-gray-600 min-w-[100px] text-center">
            Page {pageNumber} of {numPages || '...'}
          </span>
          
          <button
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded disabled:opacity-40 disabled:cursor-not-allowed"
            title="Next page"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <button
            onClick={zoomOut}
            disabled={scale <= 0.5}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded disabled:opacity-40 disabled:cursor-not-allowed"
            title="Zoom out"
          >
            <MagnifyingGlassMinusIcon className="w-5 h-5" />
          </button>
          
          <span className="text-sm text-gray-600 min-w-[60px] text-center">
            {Math.round(scale * 100)}%
          </span>
          
          <button
            onClick={zoomIn}
            disabled={scale >= 3}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded disabled:opacity-40 disabled:cursor-not-allowed"
            title="Zoom in"
          >
            <MagnifyingGlassPlusIcon className="w-5 h-5" />
          </button>

          <button
            onClick={resetZoom}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
            title="Reset zoom"
          >
            <ArrowsPointingOutIcon className="w-5 h-5" />
          </button>

          <div className="h-6 w-px bg-gray-300 mx-1" />

          {/* Open in New Tab */}
          {showOpenInNewTab && (
            <button
              onClick={handleOpenInNewTab}
              className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 text-sm rounded transition-colors"
              title="Open in new tab"
            >
              <ArrowTopRightOnSquareIcon className="w-4 h-4" />
              <span className="hidden sm:inline">View</span>
            </button>
          )}

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
          >
            <ArrowDownTrayIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Download</span>
          </button>
        </div>
      </div>

      {/* PDF Document */}
      <div className="overflow-auto min-h-[600px] max-h-[900px] flex justify-center p-4">
        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center w-full">
            {/* Fallback to iframe when react-pdf fails */}
            <iframe
              src={apiUrl}
              className="w-full h-[800px] border-0 rounded-lg"
              title="PDF Document"
            />
            <div className="mt-4 flex gap-3">
              <button
                onClick={handleOpenInNewTab}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
              >
                <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                Open in browser
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <ArrowDownTrayIcon className="w-4 h-4" />
                Download PDF
              </button>
            </div>
          </div>
        )}

        <Document
          file={apiUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={null}
          error={null}
          className={loading || error ? 'hidden' : ''}
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            className="shadow-lg"
          />
        </Document>
      </div>

      {/* Page Input */}
      {numPages > 1 && (
        <div className="bg-white border-t border-gray-200 px-4 py-2 flex items-center justify-center gap-2">
          <span className="text-sm text-gray-600">Go to page:</span>
          <input
            type="number"
            min={1}
            max={numPages}
            value={pageNumber}
            onChange={(e) => {
              const page = parseInt(e.target.value);
              if (page >= 1 && page <= numPages) {
                setPageNumber(page);
              }
            }}
            className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm"
          />
        </div>
      )}
    </div>
  );
}
