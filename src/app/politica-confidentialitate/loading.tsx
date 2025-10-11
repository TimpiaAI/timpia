
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container py-16 md:py-24">
       <div className="text-center mb-12 md:mb-16">
        <Skeleton className="h-10 w-3/5 mx-auto mb-4" />
        <Skeleton className="h-6 w-4/5 mx-auto" />
      </div>
       <div className="max-w-4xl mx-auto space-y-8">
         <Skeleton className="h-6 w-1/3 mb-4" /> {/* Card Header Skeleton */}
         <Skeleton className="h-4 w-1/4 mb-8" /> {/* Last updated Skeleton */}

         {[...Array(5)].map((_, i) => ( // Simulate multiple sections
           <div key={i} className="space-y-4">
             <Skeleton className="h-6 w-1/3" /> {/* Section Title Skeleton */}
             <Skeleton className="h-4 w-full" />
             <Skeleton className="h-4 w-11/12" />
             <Skeleton className="h-4 w-4/5" />
             {/* Simulate list items */}
             <div className="pl-6 space-y-2">
               <Skeleton className="h-4 w-10/12" />
               <Skeleton className="h-4 w-9/12" />
             </div>
           </div>
         ))}

        <Skeleton className="h-6 w-1/3 mt-8" /> {/* Contact Section Skeleton */}
         <Skeleton className="h-4 w-full" />
         <Skeleton className="h-4 w-11/12" />
      </div>
    </div>
  );
}
