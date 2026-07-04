import { cn } from '../../lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-lg bg-gradient-to-r from-secondary via-secondary/60 to-secondary bg-[length:200%_100%] animate-shimmer',
        className,
      )}
    />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-border/40 bg-card p-3.5 space-y-3 shadow-card">
      <div className="flex items-center justify-between">
        <Skeleton className="h-2.5 w-16 rounded-full" />
        <Skeleton className="h-3 w-3 rounded-full" />
      </div>
      <Skeleton className="h-7 w-20 rounded-md" />
      <Skeleton className="h-1.5 w-full rounded-full" />
    </div>
  );
}
