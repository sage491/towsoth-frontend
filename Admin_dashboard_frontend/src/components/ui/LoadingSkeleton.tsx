interface LoadingSkeletonProps {
  rows?: number;
  className?: string;
}

export function LoadingSkeleton({ rows = 3, className }: LoadingSkeletonProps) {
  return (
    <div className={`animate-pulse space-y-3 ${className ?? ''}`}>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="h-12 w-full border border-[#f3f4f6] bg-[#f9fafb]" />
      ))}
    </div>
  );
}
