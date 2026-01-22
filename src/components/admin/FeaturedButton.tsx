'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

interface FeaturedButtonProps {
  contentId: string;
  isFeatured: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function FeaturedButton({ contentId, isFeatured, size = 'md', showLabel = true }: FeaturedButtonProps) {
  const [featured, setFeatured] = useState(isFeatured);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin/content/${contentId}/featured`, {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update featured status');
      }

      setFeatured(data.content.featured);
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to update featured status');
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`
        inline-flex items-center rounded-lg font-medium transition-all duration-200
        ${sizeClasses[size]}
        ${featured 
          ? 'bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200' 
          : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
        }
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
      title={featured ? 'Remove from featured' : 'Add to featured'}
    >
      {featured ? (
        <StarIconSolid className={`${iconSizes[size]} ${showLabel ? 'mr-1.5' : ''} text-amber-500`} />
      ) : (
        <StarIcon className={`${iconSizes[size]} ${showLabel ? 'mr-1.5' : ''}`} />
      )}
      {showLabel && (
        <span>{isLoading ? 'Updating...' : featured ? 'Featured' : 'Feature'}</span>
      )}
    </button>
  );
}
