
// src/app/blog/[slug]/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, CalendarDays, UserCircle, Tag } from 'lucide-react';

export default function Loading() {
  return (
    <div className="bg-gradient-to-b from-background via-card/30 to-background dark:from-background dark:via-black/20 dark:to-background">
      <article className="container py-16 md:py-24">
        <div className="mb-8">
            <Skeleton className="h-10 w-40 rounded-md" /> {/* Back button */}
        </div>

        <header className="mb-10 md:mb-12 text-center">
          <Skeleton className="h-10 sm:h-12 md:h-14 w-4/5 sm:w-3/4 md:w-2/3 mx-auto mb-4" /> {/* Title */}
          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4 text-muted" />
              <Skeleton className="h-4 w-24" /> {/* Date */}
            </div>
            <span className="hidden sm:inline">•</span>
            <div className="flex items-center gap-1.5">
              <UserCircle className="h-4 w-4 text-muted" />
              <Skeleton className="h-4 w-32" /> {/* Author */}
            </div>
          </div>
           <div className="flex flex-wrap justify-center items-center gap-2 mt-3">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-12 rounded-full" />
          </div>
        </header>

        <Skeleton className="mb-10 md:mb-12 rounded-xl w-full aspect-[2/1] shadow-2xl" /> {/* Cover Image */}

        <Skeleton className="my-8 md:my-12 h-px w-full bg-muted/50" /> {/* Separator */}

        <div className="prose prose-lg dark:prose-invert max-w-3xl mx-auto space-y-5">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-11/12" />
          <Skeleton className="h-6 w-4/5" />
          <br />
          <Skeleton className="h-8 w-3/4" /> {/* Heading */}
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-10/12" />
          <br />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-5/6" />
          <Skeleton className="h-6 w-11/12" />
          <Skeleton className="h-6 w-full" />
        </div>

        <Skeleton className="my-10 md:my-16 h-px w-full bg-muted/50" /> {/* Separator */}

        <div className="text-center">
          <Skeleton className="h-8 w-1/2 mx-auto mb-4" /> {/* CTA Title */}
          <Skeleton className="h-5 w-3/4 mx-auto mb-6" /> {/* CTA Description */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Skeleton className="h-12 w-48 rounded-md" /> {/* Button 1 */}
            <Skeleton className="h-12 w-40 rounded-md" /> {/* Button 2 */}
          </div>
        </div>
      </article>
    </div>
  );
}
