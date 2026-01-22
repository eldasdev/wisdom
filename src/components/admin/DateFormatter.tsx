'use client';

// Consistent date formatting to prevent hydration mismatches
export function formatDate(date: Date | string | null | undefined) {
  if (!date) return 'Date not available';

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }

    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
}

interface DateFormatterProps {
  date: Date | string | null | undefined;
  className?: string;
}

export function DateFormatter({ date, className = '' }: DateFormatterProps) {
  return (
    <span className={className}>
      {formatDate(date)}
    </span>
  );
}