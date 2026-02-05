'use client';

import { useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'error';
  title: string;
  message: string;
  doi?: string | null;
}

export function StatusModal({ isOpen, onClose, type, title, message, doi }: StatusModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-md animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`px-6 py-4 rounded-t-lg ${
          type === 'success' ? 'bg-green-50' : 'bg-red-50'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {type === 'success' ? (
                <CheckCircleIcon className="w-8 h-8 text-green-600" />
              ) : (
                <XCircleIcon className="w-8 h-8 text-red-600" />
              )}
              <h2 className={`text-lg font-bold ${
                type === 'success' ? 'text-green-900' : 'text-red-900'
              }`}>
                {title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className={`p-1 rounded-full hover:bg-white/50 transition-colors ${
                type === 'success' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          <p className={`text-sm ${
            type === 'success' ? 'text-green-800' : 'text-red-800'
          }`}>
            {message}
          </p>
          {doi && (
            <div className="mt-3 p-3 bg-gray-50 rounded-md">
              <p className="text-xs text-gray-600 font-medium mb-1">DOI Registered:</p>
              <p className="text-sm text-gray-900 font-mono">{doi}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              type === 'success'
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
