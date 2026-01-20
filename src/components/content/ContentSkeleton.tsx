interface ContentSkeletonProps {
  count?: number;
  compact?: boolean;
}

export function ContentSkeleton({ count = 6, compact = false }: ContentSkeletonProps) {
  const skeletonItem = (key: number) => {
    if (compact) {
      return (
        <div key={key} className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
          <div className="flex items-start justify-between mb-2">
            <div className="h-5 w-16 bg-gray-200 rounded"></div>
            <div className="h-5 w-14 bg-gray-200 rounded"></div>
          </div>
          <div className="h-5 w-full bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-3/4 bg-gray-200 rounded mb-3"></div>
          <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
        </div>
      );
    }

    return (
      <div key={key} className="bg-white border border-gray-200 rounded-lg overflow-hidden animate-pulse">
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
            <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
          </div>

          <div className="h-6 w-full bg-gray-200 rounded mb-2"></div>
          <div className="h-6 w-4/5 bg-gray-200 rounded mb-4"></div>

          <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-3/4 bg-gray-200 rounded mb-4"></div>

          <div className="flex items-center justify-between">
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
            <div className="h-4 w-20 bg-gray-200 rounded"></div>
          </div>

          <div className="mt-4 flex gap-2">
            <div className="h-6 w-16 bg-gray-200 rounded"></div>
            <div className="h-6 w-14 bg-gray-200 rounded"></div>
            <div className="h-6 w-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }, (_, i) => skeletonItem(i))}
    </div>
  );
}