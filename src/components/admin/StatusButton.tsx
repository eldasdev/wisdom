'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface StatusButtonProps {
  contentId: string;
  targetStatus: 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED';
  label: string;
  className?: string;
}

export function StatusButton({ contentId, targetStatus, label, className }: StatusButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    if (isLoading) return;

    const confirmMessage = targetStatus === 'PUBLISHED' 
      ? 'Are you sure you want to publish this content? It will be visible to all users.'
      : targetStatus === 'ARCHIVED'
      ? 'Are you sure you want to archive this content?'
      : targetStatus === 'DRAFT'
      ? 'Are you sure you want to move this back to draft?'
      : null;

    if (confirmMessage && !confirm(confirmMessage)) {
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('status', targetStatus);

      const response = await fetch(`/api/admin/content/${contentId}/status`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update status');
      }

      // Show success message
      if (data.doiRegistration?.success) {
        alert(`${data.message}\nDOI: ${data.doi}`);
      }

      // Refresh the page to show updated status
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to update status');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`${className} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {isLoading ? 'Updating...' : label}
    </button>
  );
}
