'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon,
  ArrowsPointingOutIcon,
  ArrowTopRightOnSquareIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

// Import CSS for react-pdf
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up PDF.js worker - use CDN version that matches react-pdf's internal PDF.js version
// react-pdf 10.3.0 uses PDF.js 5.4.296, so we need to match that version
if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.296/pdf.worker.min.mjs`;
}

interface PdfViewerProps {
  pdfUrl: string;
  fileName?: string;
  className?: string;
  showOpenInNewTab?: boolean;
}

/**
 * Convert a PDF URL to use the appropriate route
 * Vercel Blob URLs work directly, local paths use the API route
 */
function getPdfApiUrl(url: string): string {
  // If it's already a full URL (Vercel Blob), use it directly
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If the URL starts with /uploads/, use the API route (legacy local storage)
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
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);

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

  const fitToWidth = () => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth - 32; // padding
      // Assuming standard PDF width of 612 points (8.5 inches at 72 DPI)
      const pdfWidth = 612;
      const calculatedScale = (containerWidth / pdfWidth) * 0.9; // 90% of container
      setScale(Math.max(0.5, Math.min(calculatedScale, 3)));
    }
  };

  const handleFullscreen = async () => {
    if (!containerRef.current) return;

    try {
      if (!isFullscreen) {
        if (containerRef.current.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        } else if ((containerRef.current as any).webkitRequestFullscreen) {
          await (containerRef.current as any).webkitRequestFullscreen();
        } else if ((containerRef.current as any).msRequestFullscreen) {
          await (containerRef.current as any).msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).msFullscreenElement
      ));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

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

  const handleSearch = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchTerm('');
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`bg-gray-100 rounded-lg overflow-hidden ${className} ${isFullscreen ? 'fixed inset-0 z-50 m-0 rounded-none' : ''}`}
    >
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          {/* Page Navigation */}
          <button
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Previous page"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          
          <span className="text-sm text-gray-600 min-w-[100px] text-center font-medium">
            Page {pageNumber} of {numPages || '...'}
          </span>
          
          <button
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Next page"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Search Button */}
          <button
            onClick={handleSearch}
            className={`p-2 rounded transition-colors ${
              showSearch 
                ? 'bg-blue-100 text-blue-600' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
            title="Search in document"
          >
            <MagnifyingGlassIcon className="w-5 h-5" />
          </button>

          {/* Search Input */}
          {showSearch && (
            <div className="flex items-center gap-2 px-2 py-1 bg-gray-50 rounded border border-gray-300">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="text-sm outline-none bg-transparent w-32"
                autoFocus
              />
              <button
                onClick={() => {
                  setShowSearch(false);
                  setSearchTerm('');
                }}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="h-6 w-px bg-gray-300 mx-1" />

          {/* Zoom Controls */}
          <button
            onClick={zoomOut}
            disabled={scale <= 0.5}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Zoom out"
          >
            <MagnifyingGlassMinusIcon className="w-5 h-5" />
          </button>
          
          <button
            onClick={fitToWidth}
            className="px-2 py-1 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors font-medium"
            title="Fit to width"
          >
            {Math.round(scale * 100)}%
          </button>
          
          <button
            onClick={zoomIn}
            disabled={scale >= 3}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Zoom in"
          >
            <MagnifyingGlassPlusIcon className="w-5 h-5" />
          </button>

          <button
            onClick={resetZoom}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
            title="Reset zoom to 100%"
          >
            <span className="text-xs font-medium">100%</span>
          </button>

          <div className="h-6 w-px bg-gray-300 mx-1" />

          {/* Fullscreen Button */}
          <button
            onClick={handleFullscreen}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
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
            title="Download PDF"
          >
            <ArrowDownTrayIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Download</span>
          </button>
        </div>
      </div>

      {/* PDF Document */}
      <div className={`overflow-auto flex justify-center p-4 ${
        isFullscreen ? 'h-[calc(100vh-60px)]' : 'min-h-[600px] max-h-[900px]'
      }`}>
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
