
// src/app/blog/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container py-16 md:py-24">
      <div className="text-center mb-12 md:mb-20">
        <Skeleton className="h-12 w-3/5 mx-auto mb-4" />
        <Skeleton className="h-7 w-4/5 mx-auto" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-xl border bg-card shadow-lg overflow-hidden">
            <Skeleton className="aspect-[16/9] w-full" />
            <div className="p-5 space-y-3">
              <div className="flex flex-wrap gap-1.5 mb-1.5">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <Skeleton className="h-6 w-3/4" /> {/* Title */}
              <Skeleton className="h-4 w-full" /> {/* Summary line 1 */}
              <Skeleton className="h-4 w-5/6" /> {/* Summary line 2 */}
              <div className="flex items-center text-xs space-x-3 pt-2">
                <Skeleton className="h-4 w-24" /> {/* Date */}
                <Skeleton className="h-4 w-20" /> {/* Author */}
              </div>
            </div>
            <div className="p-5 pt-0 border-t border-transparent mt-auto">
                <Skeleton className="h-5 w-32" /> {/* Read more */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
