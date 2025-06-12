import { Skeleton } from '@gocrm/components/ui/skeleton'

export const DetailPageSkeleton = () => (
  <div className="space-y-6">
    <Skeleton className="h-10 w-3/4" />
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-48 w-full" />
    </div>
    <Skeleton className="h-8 w-1/4" />
    <Skeleton className="h-32 w-full" />
  </div>
)
