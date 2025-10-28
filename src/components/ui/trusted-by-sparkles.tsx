
"use client";

import { useTheme } from "next-themes";
import { type SVGProps } from "react";
import AutoScroll from "embla-carousel-auto-scroll";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Image from 'next/image';

import emagLogo from '@/images/logo_clienti/emag.png';
import snpadLogo from '@/images/logo_clienti/snpad.png';
import evomagLogo from '@/images/logo_clienti/evomag.png';
import samsungLogo from '@/images/logo_clienti/samsung.png';
import jaLogo from '@/images/logo_clienti/ja.png';

const clientLogos = [
  { image: emagLogo, alt: 'eMAG Logo', hint: 'eMAG logo' },
  { image: snpadLogo, alt: 'SNPAD Logo', hint: 'SNPAD logo' },
  { image: evomagLogo, alt: 'evoMAG Logo', hint: 'evoMAG logo' },
  { image: samsungLogo, alt: 'Samsung Logo', hint: 'Samsung logo' },
  { image: jaLogo, alt: 'JA Romania Logo', hint: 'JA Romania logo' },
];


export function TrustedBySparkles() {
  const { theme } = useTheme();

  return (
    <div className="w-full py-12 bg-black/20">
      <div className="container mx-auto">
        {/* The title has been removed from here */}

        <Carousel
          opts={{ loop: true, align: "start" }}
          plugins={[AutoScroll({ playOnInit: true, speed: 1, stopOnInteraction: false, stopOnMouseEnter: true })]}
          className="w-full"
        >
          <CarouselContent className="-ml-4 md:-ml-6">
            {[...clientLogos, ...clientLogos].map((logo, index) => ( // Duplicate for smooth looping
              <CarouselItem
                key={index}
                className="basis-1/3 md:basis-1/4 lg:basis-1/5 pl-4 md:pl-6 flex items-center justify-center"
              >
                <div className="mx-auto h-12 flex items-center justify-center">
                  <Image
                    src={logo.image}
                    alt={logo.alt}
                    width={150}
                    height={48}
                    sizes="150px"
                    data-ai-hint={logo.hint}
                    className="h-12 w-auto object-contain grayscale opacity-60 transition-all duration-300 hover:opacity-100 hover:grayscale-0 dark:invert dark:hover:invert-0"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}
