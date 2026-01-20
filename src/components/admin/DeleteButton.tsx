'use client';

import { useState } from 'react';

interface DeleteButtonProps {
  action: string;
  itemName: string;
  className?: string;
}

export function DeleteButton({ action, itemName, className = '' }: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete this ${itemName}? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(action, {
        method: 'POST',
      });

      if (response.ok) {
        // Refresh the page to show updated content
        window.location.reload();
      } else {
        alert('Failed to delete item');
      }
    } catch (error) {
      alert('An error occurred while deleting');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className={`disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isDeleting ? 'Deleting...' : 'Delete'}
    </button>
  );
}