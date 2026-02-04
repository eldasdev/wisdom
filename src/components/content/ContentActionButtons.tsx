'use client';

import { useState } from 'react';
import {
  ArrowDownTrayIcon,
  ShareIcon,
  BookmarkIcon,
  PrinterIcon,
  LinkIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';

interface ContentActionButtonsProps {
  title: string;
  description: string;
  pdfUrl?: string | null;
  showDownload?: boolean;
  showPrint?: boolean;
  showBookmark?: boolean;
  showCopyLink?: boolean;
  showShare?: boolean;
  variant?: 'default' | 'compact' | 'minimal';
}

export function ContentActionButtons({
  title,
  description,
  pdfUrl,
  showDownload = true,
  showPrint = true,
  showBookmark = true,
  showCopyLink = true,
  showShare = true,
  variant = 'default',
}: ContentActionButtonsProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or share failed
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // TODO: Save to user's bookmarks via API
  };

  const handlePrint = () => {
    window.print();
  };

  // Convert PDF URL to use the appropriate route
  // Vercel Blob URLs work directly, local paths use the API route
  const getPdfApiUrl = (url: string): string => {
    // If it's already a full URL (Vercel Blob), use it directly
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // If the URL starts with /uploads/, use the API route (legacy local storage)
    if (url.startsWith('/uploads/')) {
      return `/api/pdf${url.replace('/uploads', '')}`;
    }
    
    return url;
  };

  const buttonBase = variant === 'minimal' 
    ? 'p-2 rounded-lg transition-all duration-200'
    : 'flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border transition-all duration-200';

  return (
    <div className={`flex items-center ${variant === 'compact' ? 'gap-1' : 'gap-2'} flex-wrap`}>
      {/* Download PDF */}
      {showDownload && pdfUrl && (
        <a
          href={getPdfApiUrl(pdfUrl)}
          download
          className={`${buttonBase} text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-200`}
          title="Download PDF"
        >
          <ArrowDownTrayIcon className="w-4 h-4" />
          {variant !== 'minimal' && <span className="hidden sm:inline">Download</span>}
        </a>
      )}
      
      {/* Print */}
      {showPrint && (
        <button
          onClick={handlePrint}
          className={`${buttonBase} text-gray-600 bg-gray-50 hover:bg-gray-100 border-gray-200`}
          title="Print"
        >
          <PrinterIcon className="w-4 h-4" />
          {variant !== 'minimal' && <span className="hidden sm:inline">Print</span>}
        </button>
      )}
      
      {/* Bookmark */}
      {showBookmark && (
        <button
          onClick={handleBookmark}
          className={`${buttonBase} ${
            isBookmarked 
              ? 'text-amber-700 bg-amber-100 border-amber-300' 
              : 'text-amber-600 bg-amber-50 hover:bg-amber-100 border-amber-200'
          }`}
          title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
        >
          {isBookmarked ? (
            <BookmarkSolidIcon className="w-4 h-4" />
          ) : (
            <BookmarkIcon className="w-4 h-4" />
          )}
          {variant !== 'minimal' && <span className="hidden sm:inline">{isBookmarked ? 'Saved' : 'Save'}</span>}
        </button>
      )}
      
      {/* Copy Link */}
      {showCopyLink && (
        <button
          onClick={handleCopyLink}
          className={`${buttonBase} ${
            linkCopied 
              ? 'text-green-700 bg-green-100 border-green-300' 
              : 'text-blue-600 bg-blue-50 hover:bg-blue-100 border-blue-200'
          }`}
          title={linkCopied ? 'Copied!' : 'Copy link'}
        >
          {linkCopied ? (
            <CheckIcon className="w-4 h-4" />
          ) : (
            <LinkIcon className="w-4 h-4" />
          )}
          {variant !== 'minimal' && <span className="hidden sm:inline">{linkCopied ? 'Copied!' : 'Link'}</span>}
        </button>
      )}
      
      {/* Share */}
      {showShare && (
        <button
          onClick={handleShare}
          className={`${buttonBase} text-purple-600 bg-purple-50 hover:bg-purple-100 border-purple-200`}
          title="Share"
        >
          <ShareIcon className="w-4 h-4" />
          {variant !== 'minimal' && <span className="hidden sm:inline">Share</span>}
        </button>
      )}
    </div>
  );
}
