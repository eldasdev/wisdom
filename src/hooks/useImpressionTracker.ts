'use client';

import { useEffect, useRef } from 'react';

interface UseImpressionTrackerOptions {
  slug: string;
  enabled?: boolean;
  debounceMs?: number;
}

/**
 * Hook to track content impressions/views
 * Tracks a single impression per page load with debouncing to prevent duplicate counts
 */
export function useImpressionTracker({
  slug,
  enabled = true,
  debounceMs = 1000
}: UseImpressionTrackerOptions) {
  const hasTracked = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Don't track if disabled or already tracked
    if (!enabled || hasTracked.current || !slug) {
      return;
    }

    // Debounce to prevent rapid duplicate tracking
    timeoutRef.current = setTimeout(async () => {
      try {
        // Check if we've already tracked this content in this session
        const sessionKey = `impression_tracked_${slug}`;
        const alreadyTracked = sessionStorage.getItem(sessionKey);
        
        if (alreadyTracked) {
          hasTracked.current = true;
          return;
        }

        // Track the impression
        const response = await fetch(`/api/content/${encodeURIComponent(slug)}/impression`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          hasTracked.current = true;
          // Mark as tracked in session storage to prevent duplicate tracking on navigation
          sessionStorage.setItem(sessionKey, 'true');
        }
      } catch (error) {
        // Silently fail - don't disrupt user experience for analytics
        console.error('Failed to track impression:', error);
      }
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [slug, enabled, debounceMs]);

  return { hasTracked: hasTracked.current };
}

/**
 * Hook variant that tracks impressions only when content is visible in viewport
 */
export function useVisibilityImpressionTracker({
  slug,
  enabled = true,
  threshold = 0.5, // 50% visible
  minViewTime = 2000 // 2 seconds minimum view time
}: UseImpressionTrackerOptions & { threshold?: number; minViewTime?: number }) {
  const hasTracked = useRef(false);
  const elementRef = useRef<HTMLElement | null>(null);
  const viewStartTime = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled || hasTracked.current || !slug) {
      return;
    }

    const trackImpression = async () => {
      try {
        const sessionKey = `impression_tracked_${slug}`;
        const alreadyTracked = sessionStorage.getItem(sessionKey);
        
        if (alreadyTracked) {
          hasTracked.current = true;
          return;
        }

        const response = await fetch(`/api/content/${encodeURIComponent(slug)}/impression`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          hasTracked.current = true;
          sessionStorage.setItem(sessionKey, 'true');
        }
      } catch (error) {
        console.error('Failed to track impression:', error);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Start timing when content becomes visible
            if (!viewStartTime.current) {
              viewStartTime.current = Date.now();
            }

            // Check if minimum view time has been met
            timeoutRef.current = setTimeout(() => {
              if (!hasTracked.current && viewStartTime.current) {
                const viewDuration = Date.now() - viewStartTime.current;
                if (viewDuration >= minViewTime) {
                  trackImpression();
                }
              }
            }, minViewTime);
          } else {
            // Content left viewport - clear timing
            viewStartTime.current = null;
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }
          }
        });
      },
      { threshold }
    );

    // Observe the document body as fallback
    const element = elementRef.current || document.body;
    observer.observe(element);

    return () => {
      observer.disconnect();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [slug, enabled, threshold, minViewTime]);

  return { 
    hasTracked: hasTracked.current,
    ref: elementRef 
  };
}
