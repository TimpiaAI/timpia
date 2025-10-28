// src/components/employee-carousel.tsx
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Image, { type StaticImageData } from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

import ecaterinaImage from "@/early_acces/ecaterina.avif";
import auroraImage from "@/early_acces/aurora.avif";
import domusImage from "@/early_acces/domus.avif";

const employeeImages: StaticImageData[] = [ecaterinaImage, auroraImage, domusImage];

type EmployeeEntry = {
  name: string;
  title: string;
  description: string;
  hint?: string;
  category?: string;
};

interface EmployeeCarouselProps {
  entries?: EmployeeEntry[];
}

export function EmployeeCarousel({ entries = [] }: EmployeeCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const employees = React.useMemo(
    () =>
      entries.map((entry, index) => ({
        ...entry,
        imageSrc: employeeImages[index] ?? employeeImages[employeeImages.length - 1],
      })),
    [entries],
  );

  return (
    <div className="relative w-full max-w-7xl mx-auto px-0">
        <Carousel
            setApi={setApi}
            opts={{
                align: "center",
                loop: true,
            }}
            className="w-full"
        >
            <CarouselContent className="-ml-4 md:-ml-4">
            {employees.map((employee, index) => (
                <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <motion.div 
                        className="p-1 h-full flex"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
                    >
                         <div className="bg-black/20 p-4 rounded-xl h-full flex flex-col w-full text-center md:text-left">
                            <div className="relative w-full max-w-[240px] md:max-w-xs mx-auto md:mx-0 mb-4">
                                <Image
                                    src={employee.imageSrc}
                                    alt={`Robot angajat AI - ${employee.name}`}
                                    width={1080}
                                    height={1920}
                                    className="rounded-xl w-full h-auto aspect-[9/16] object-cover" 
                                    sizes="(min-width: 1280px) 20vw, (min-width: 768px) 33vw, 70vw"
                                    data-ai-hint={employee.hint}
                                />
                                <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-black to-transparent z-10" />
                            </div>
                            <div className="flex flex-col items-center md:items-start px-2">
                                {employee.category && (
                                  <p className="text-xs uppercase tracking-widest text-white/60 mb-2">
                                    {employee.category}
                                  </p>
                                )}
                                <h3 className="text-2xl font-bold text-white mb-1">{employee.name}</h3>
                                <p className="text-base font-semibold text-primary mb-3">{employee.title}</p>
                                <p className="text-sm md:text-base text-gray-400 max-w-xs">{employee.description}</p>
                            </div>
                        </div>
                    </motion.div>
                </CarouselItem>
            ))}
            </CarouselContent>
            
            <div className="absolute inset-y-0 left-0 -translate-x-4 md:-translate-x-12 flex md:hidden items-center">
                <CarouselPrevious className="static h-12 w-12 bg-black/50 border-gray-700 hover:bg-primary/80 hover:border-primary text-white" />
            </div>
            <div className="absolute inset-y-0 right-0 translate-x-4 md:translate-x-12 flex md:hidden items-center">
                <CarouselNext className="static h-12 w-12 bg-black/50 border-gray-700 hover:bg-primary/80 hover:border-primary text-white" />
            </div>

            {/* Fades for sides on mobile */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-24 bg-gradient-to-r from-black to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-24 bg-gradient-to-l from-black to-transparent" />
        </Carousel>

        {/* Carousel Dots */}
        <div className="mt-6 flex justify-center gap-3 md:hidden">
            {employees.map((_, index) => (
                <button
                    key={index}
                    onClick={() => api?.scrollTo(index)}
                    className={cn(
                        "h-6 w-6 rounded-full border border-white/40 bg-white/30 transition-transform duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                        current === index ? "scale-110 bg-primary text-background" : "hover:bg-white/60"
                    )}
                    aria-label={`Go to slide ${index + 1}`}
                />
            ))}
        </div>
    </div>
  )
}
