// src/components/team-section.tsx
"use client";

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';
import { useIsMobile } from '@/hooks/use-is-mobile';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";

import ovidiuImage from '@/early_acces/ovidiu.avif';
import maiaImage from '@/early_acces/maia.avif';
import davidImage from '@/early_acces/david.avif';
import timpiaLogo from '@/early_acces/timpia_logo.avif';

const teamMembers = [
  {
    name: "Pică Ovidiu",
    role: "CEO & Fondator",
    imageUrl: ovidiuImage,
    imageHint: "male portrait ceo",
    position: "top-center",
  },
  {
    name: "Jardan Maia",
    role: "Marketing Specialist",
    imageUrl: maiaImage,
    imageHint: "female portrait marketing",
    position: "bottom-left", 
  },
  {
    name: "Bobeica David",
    role: "Autonomous AI Engineer",
    imageUrl: davidImage,
    imageHint: "male portrait engineer",
    position: "bottom-right",
  },
];

const floatingLogoVariants = {
    initial: { y: 0 },
    animate: {
        y: [-4, 4, -4],
        transition: {
            duration: 9,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "mirror"
        }
    }
}

const TeamMemberCard = ({ member }: { member: typeof teamMembers[0] }) => (
    <div className="flex flex-col items-center text-center p-1">
        <div className={cn(
            "relative rounded-xl overflow-hidden shadow-2xl w-full",
            member.position.startsWith('top') ? "h-80 w-64 shadow-primary/20" : "h-72 w-56 shadow-lg"
        )}>
            <div className="w-full h-full">
                <Image
                    src={member.imageUrl}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 18rem, 70vw"
                    data-ai-hint={member.imageHint}
                />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
             <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-black to-transparent pointer-events-none z-10" />
        </div>
        <h3 className="text-xl font-bold text-white mt-4">{member.name}</h3>
        <p className="text-primary font-semibold text-sm">{member.role}</p>
    </div>
);

export default function TeamSection() {
    const sectionRef = useRef(null);
    const isMobile = useIsMobile();
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const scale = useTransform(scrollYProgress, [0.1, 0.4], [1, 1.25]);
    const xLeft = useTransform(scrollYProgress, [0.1, 0.5], [0, -100]);
    const xRight = useTransform(scrollYProgress, [0.1, 0.5], [0, 100]);
    
    // Animații pentru logo
    const logoScale = useTransform(scrollYProgress, [0.4, 0.7], [0.7, 1]);
    const logoY = useTransform(scrollYProgress, [0.4, 0.7], [20, 0]);
    const logoOpacity = useTransform(scrollYProgress, [0.4, 0.6], [0.3, 1]);


    const DesktopView = () => (
         <div className="relative flex flex-col items-center justify-center space-y-8 md:space-y-0 h-[500px]">
           <div className="absolute top-0 flex justify-center z-10">
            {teamMembers.filter(m => m.position.startsWith('top')).map((member, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center text-center"
                style={{ scale }}
              >
                <div className="relative w-56 h-72 rounded-xl overflow-hidden shadow-2xl shadow-primary/20">
                   <div className="w-full h-full">
                     <Image
                      src={member.imageUrl}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 16rem, 60vw"
                      data-ai-hint={member.imageHint}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                   <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-black to-transparent pointer-events-none z-10" />
                </div>
                <h3 className="text-xl font-bold text-white mt-4">{member.name}</h3>
                <p className="text-primary font-semibold text-sm">{member.role}</p>
              </motion.div>
            ))}
          </div>
          
          <div className="absolute bottom-0 w-full flex flex-col sm:flex-row gap-16 md:gap-48 justify-center z-10">
            {teamMembers.filter(m => m.position.startsWith('bottom')).map((member, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center text-center"
                style={{ x: member.position === 'bottom-left' ? xLeft : xRight }}
              >
                <div className="relative w-48 h-64 rounded-xl overflow-hidden shadow-lg">
                    <div className="w-full h-full">
                        <Image
                            src={member.imageUrl}
                            alt={member.name}
                            fill
                            className="object-cover"
                            sizes="(min-width: 1024px) 16rem, 60vw"
                            data-ai-hint={member.imageHint}
                        />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                     <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-black to-transparent pointer-events-none z-10" />
                </div>
                <h3 className="text-xl font-bold text-white mt-4">{member.name}</h3>
                <p className="text-primary font-semibold text-sm">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
    );
    
    const MobileView = () => (
        <Carousel
            className="w-full max-w-xs mx-auto"
            opts={{
                align: "center",
                loop: true,
            }}
             plugins={[
                Autoplay({
                  delay: 3000,
                  stopOnInteraction: true,
                }),
            ]}
        >
            <CarouselContent>
                {teamMembers.map((member, index) => (
                    <CarouselItem key={index}>
                        <TeamMemberCard member={member} />
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="left-[-16px] bg-black/50 border-gray-700 hover:bg-primary/80" />
            <CarouselNext className="right-[-16px] bg-black/50 border-gray-700 hover:bg-primary/80"/>
        </Carousel>
    );

    return (
        <section 
            id="team-section" 
            ref={sectionRef} 
            className="relative bg-black text-white overflow-hidden pt-20 pb-0"
        >
            <div className="flex flex-col items-center text-center">
                <motion.div className="container mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold mb-2">
                        Cu cine o să lucrezi?
                    </h2>
                    <p className="text-lg text-white/70 mb-10">
                        O echipă dedicată proiectelor tale.
                    </p>
                    {isMobile ? <MobileView /> : <DesktopView />}
                </motion.div>

                {/* Logo section */}
                <motion.div 
                    className="mt-12 flex flex-col items-center"
                    style={{ 
                        scale: logoScale, 
                        y: logoY,
                        opacity: logoOpacity
                    }}
                >
                    <motion.div
                        className="relative"
                        variants={floatingLogoVariants}
                        initial="initial"
                        animate="animate"
                    >
                        <Image 
                            src={timpiaLogo} 
                            alt="Timpia AI Logo" 
                            width={250} 
                            height={250} 
                            className="rounded-2xl shadow-2xl shadow-primary/20"
                            data-ai-hint="company logo abstract"
                        />
                         <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black to-transparent pointer-events-none z-10" />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
