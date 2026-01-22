import { SerializableContent } from '@/lib/types';
import { ContentCard } from './ContentCard';

interface ContentGridProps {
  content: SerializableContent[];
  compact?: boolean;
  columns?: 1 | 2 | 3 | 4;
  showExcerpt?: boolean;
}

export function ContentGrid({
  content,
  compact = false,
  columns = 3,
  showExcerpt = true
}: ContentGridProps) {
  const getGridCols = () => {
    switch (columns) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-1 md:grid-cols-2';
      case 3:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 4:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    }
  };

  if (content.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No content found.</p>
      </div>
    );
  }

  return (
    <div className={`grid ${getGridCols()} gap-6`}>
      {content.map((item) => (
        <ContentCard
          key={item.id}
          content={item}
          compact={compact}
          showExcerpt={showExcerpt}
        />
      ))}
    </div>
  );
}