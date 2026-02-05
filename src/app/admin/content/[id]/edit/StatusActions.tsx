'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { StatusModal } from '@/components/admin/StatusModal';

interface StatusActionsProps {
  contentId: string;
  currentStatus: string;
}

export function StatusActions({ contentId, currentStatus }: StatusActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [modal, setModal] = useState<{
    isOpen: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
    doi?: string | null;
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
  });

  const handleStatusUpdate = async (status: string) => {
    if (isLoading) return;

    const confirmMessage = status === 'PUBLISHED' 
      ? 'Are you sure you want to publish this content? It will be visible to all users.'
      : status === 'ARCHIVED'
      ? 'Are you sure you want to archive this content?'
      : status === 'DRAFT' && currentStatus === 'PUBLISHED'
      ? 'Are you sure you want to unpublish this content?'
      : null;

    if (confirmMessage && !confirm(confirmMessage)) {
      return;
    }

    setIsLoading(status);

    try {
      const formData = new FormData();
      formData.append('status', status);

      const response = await fetch(`/api/admin/content/${contentId}/status`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update status');
      }

      // Show success modal
      setModal({
        isOpen: true,
        type: 'success',
        title: 'Success',
        message: data.message || 'Status updated successfully',
        doi: data.doi || null,
      });

      // Refresh the page to show updated status
      router.refresh();
    } catch (error) {
      setModal({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to update status',
      });
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-4">
        {currentStatus === 'DRAFT' && (
          <button
            onClick={() => handleStatusUpdate('REVIEW')}
            disabled={isLoading !== null}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading === 'REVIEW' ? 'Sending...' : 'Send to Review'}
          </button>
        )}

        {currentStatus === 'REVIEW' && (
          <>
            <button
              onClick={() => handleStatusUpdate('PUBLISHED')}
              disabled={isLoading !== null}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading === 'PUBLISHED' ? 'Publishing...' : 'Publish Now'}
            </button>
            <button
              onClick={() => handleStatusUpdate('DRAFT')}
              disabled={isLoading !== null}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading === 'DRAFT' ? 'Moving...' : 'Move to Draft'}
            </button>
          </>
        )}

        {currentStatus === 'PUBLISHED' && (
          <button
            onClick={() => handleStatusUpdate('ARCHIVED')}
            disabled={isLoading !== null}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading === 'ARCHIVED' ? 'Archiving...' : 'Archive'}
          </button>
        )}

        {currentStatus === 'ARCHIVED' && (
          <button
            onClick={() => handleStatusUpdate('PUBLISHED')}
            disabled={isLoading !== null}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading === 'PUBLISHED' ? 'Publishing...' : 'Restore & Publish'}
          </button>
        )}
      </div>

      <StatusModal
        isOpen={modal.isOpen}
        onClose={() => setModal(prev => ({ ...prev, isOpen: false }))}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        doi={modal.doi}
      />
    </>
  );
}
