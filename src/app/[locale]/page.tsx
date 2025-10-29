
// src/app/page.tsx (fostul /angajati)
"use client"; // Adăugat pentru a permite utilizarea componentelor client-side precum framer-motion

export const dynamic = 'force-dynamic';

import Image from 'next/image';
import { motion } from 'framer-motion';
import NewPlaceholderSection from '@/components/new-placeholder-section';
import ExpertiseShowcase from '@/components/expertise-showcase';
import ProcessJourney from '@/components/process-journey';
import { Button } from '@/components/ui/button';
import { Star, Play } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import VideoPlayerModal from '@/components/video-player-modal';
import { useIsMobile } from '@/hooks/use-mobile';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { TrustedBySparkles } from '@/components/ui/trusted-by-sparkles';
import FaqSection from '@/components/faq-section';
import ContactSection from '@/components/contact-section';
import TeamSection from '@/components/team-section';
import HeroLottie from '@/components/hero-lottie';
import type { TeamMember } from '@/components/team-section';
import type { FaqItem } from '@/components/faq-section';
import { useTranslations } from 'next-intl';

import heroImage from '@/early_acces/hero.avif';
import integrareImage from '@/early_acces/integrare.avif';
import integrareMobilImage from '@/early_acces/integrare_mobil.avif'; // Am adăugat noua imagine
import marketmanagerImage from '@/early_acces/marketmanager.avif';
import thumb_mainImage from '@/early_acces/thumb_main.avif';
import vinzicumperiImage from '@/early_acces/vinzicumperi.avif';
import holdImage from '@/early_acces/hold.avif';
import romaniaImage from '@/early_acces/romania.avif';
import MarketingExpertSection from '@/components/marketing-expert-section';
import Stats4 from '@/components/ui/stats-4';
import type { StatsSummaryProps } from '@/components/ui/stats-4';
import { Sparkles } from '@/components/ui/sparkles';
import { InteractiveNebulaShader } from '@/components/ui/liquid-shader';

import mm_autoImage from '@/early_acces/mm_auto.avif';
import vv_autoImage from '@/early_acces/vv_auto.avif';
import ovidiuImage from '@/early_acces/ovidiu.avif';
import maiaImage from '@/early_acces/maia.avif';
import davidImage from '@/early_acces/david.avif';

// --- Testimonial Components for better organization ---

interface TestimonialProps {
  quote: string;
  author: string;
}

const LeftTestimonial = ({
    handlePlayClick,
    quote,
    author,
}: {
    handlePlayClick: (url: string) => void;
    quote: string;
    author: string;
}) => (
    <div className="w-full space-y-8">
        <div className="bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-gray-800 flex flex-col h-full">
            <div className="flex items-center gap-4 mb-4">
                <Image src={marketmanagerImage} alt="Market Manager Logo" width={48} height={48} className="rounded-md bg-white p-1" data-ai-hint="company logo" />
                <div className="flex">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 text-primary fill-primary" />)}
                </div>
            </div>
            <p className="text-sm text-gray-300 mb-4 flex-grow">
                {quote}
            </p>
            <p className="text-xs text-gray-500 mb-6">{author}</p>
            <div className="relative mt-auto aspect-video rounded-lg overflow-hidden group">
                <Image
                    src={mm_autoImage}
                    alt="Market Manager testimonial preview"
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 22vw, 80vw"
                    data-ai-hint="car dealership office"
                />
            </div>
        </div>
    </div>
);

const RightTestimonial = ({ quote, author }: TestimonialProps) => (
     <div className="w-full space-y-8">
        <div className="bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-gray-800 flex flex-col h-full">
            <div className="relative aspect-video rounded-lg overflow-hidden mb-6">
                <Image
                    src={vv_autoImage}
                    alt="Vinzi Cumperi product preview"
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 22vw, 80vw"
                    data-ai-hint="real estate mockup"
                />
            </div>
             <div className="flex items-center gap-4 mb-4">
                <Image src={vinzicumperiImage} alt="Vinzi Cumperi Logo" width={48} height={48} className="rounded-md bg-white p-1" data-ai-hint="company logo checkmark" />
                <div className="flex">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 text-primary fill-primary" />)}
                </div>
            </div>
            <p className="text-sm text-gray-300 mb-4 flex-grow">
                {quote}
            </p>
            <p className="text-xs text-gray-500">{author}</p>
        </div>
    </div>
);

const MiddleVideo = ({
    handlePlayClick,
    title,
    subtitle,
}: {
    handlePlayClick: (url: string) => void;
    title: string;
    subtitle: string;
}) => (
     <div className="flex flex-col items-center justify-center">
        <motion.div 
            className="w-full flex flex-col items-center relative z-10"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
        >
            <div 
                className="relative aspect-[9/16] w-full max-w-[280px] sm:max-w-sm rounded-3xl overflow-hidden cursor-pointer group"
                onClick={() => handlePlayClick('https://www.youtube.com/embed/mZP1ZPfxIFc?feature=share')}
            >
                <div className="bg-black rounded-3xl overflow-hidden">
                    <Image
                        src={thumb_mainImage}
                        alt="Main testimonial video thumbnail"
                        fill
                        className="object-cover transition-all duration-500 group-hover:scale-105"
                        sizes="(min-width: 768px) 18rem, 75vw"
                        data-ai-hint="man talking video"
                    />
                </div>
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-white/20 backdrop-blur-sm border border-white/50 flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:bg-white/30">
                        <Play className="h-8 w-8 md:h-10 md:w-10 text-white/80 transition-all group-hover:text-white" />
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black to-transparent" />
            </div>
            <div className="w-full flex justify-center z-20 -mt-12">
                 <div className="relative">
                     <Image
                        src={holdImage}
                        alt="AI employee illustration holding a digital screen"
                        width={1080}
                        height={1600}
                        className="w-full h-auto object-contain max-w-[280px] sm:max-w-sm opacity-95"
                        data-ai-hint="robot holding screen"
                    />
                    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/80 to-transparent" />
                 </div>
            </div>
            <div className="text-center max-w-md md:max-w-xl mx-auto -mt-16 relative z-30">
                <h2 className="text-xl sm:text-2xl font-semibold leading-tight text-center">
                    {title}
                </h2>
                <p className="mt-2 text-sm text-white/70">
                    {subtitle}
                </p>
            </div>
        </motion.div>
    </div>
);

const DesktopTestimonials = ({
    handlePlayClick,
    leftQuote,
    leftAuthor,
    rightQuote,
    rightAuthor,
    middleTitle,
    middleSubtitle,
}: {
    handlePlayClick: (url: string) => void;
    leftQuote: string;
    leftAuthor: string;
    rightQuote: string;
    rightAuthor: string;
    middleTitle: string;
    middleSubtitle: string;
}) => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <motion.div
             initial={{ opacity: 0, x: -30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true, amount: 0.3 }}
             transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
        >
            <LeftTestimonial
              handlePlayClick={handlePlayClick}
              quote={leftQuote}
              author={leftAuthor}
            />
        </motion.div>
        
        <MiddleVideo
          handlePlayClick={handlePlayClick}
          title={middleTitle}
          subtitle={middleSubtitle}
        />

         <motion.div
             initial={{ opacity: 0, x: 30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true, amount: 0.3 }}
             transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
        >
            <RightTestimonial quote={rightQuote} author={rightAuthor} />
        </motion.div>
    </div>
);

const MobileTestimonialsCarousel = ({
    handlePlayClick,
    leftQuote,
    leftAuthor,
    rightQuote,
    rightAuthor,
    middleTitle,
    middleSubtitle,
}: {
    handlePlayClick: (url: string) => void;
    leftQuote: string;
    leftAuthor: string;
    rightQuote: string;
    rightAuthor: string;
    middleTitle: string;
    middleSubtitle: string;
}) => (
    <div className="w-full">
        <MiddleVideo
          handlePlayClick={handlePlayClick}
          title={middleTitle}
          subtitle={middleSubtitle}
        />
        <Carousel className="w-full max-w-xs sm:max-w-sm mx-auto mt-8"
            opts={{
                align: "start",
                loop: true,
            }}
        >
            <CarouselContent>
                <CarouselItem>
                    <div className="p-1">
                        <LeftTestimonial
                          handlePlayClick={handlePlayClick}
                          quote={leftQuote}
                          author={leftAuthor}
                        />
                    </div>
                </CarouselItem>
                <CarouselItem>
                    <div className="p-1">
                        <RightTestimonial quote={rightQuote} author={rightAuthor} />
                    </div>
                </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="left-[-10px]" />
            <CarouselNext className="right-[-10px]"/>
        </Carousel>
    </div>
);


export default function AngajatiPage() {
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const isMobile = useIsMobile();
    const t = useTranslations('home');

    const heroTitle = (
        <>
            Scalăm afacerile prin{' '}
            <span className="inline-block text-white italic">soluții AI</span>{' '}
            <span className="inline-block text-white italic">end-to-end</span>
        </>
    );
    const heroSubtitle = (
        <>
            Tu vii cu procesele, noi venim cu{' '}
            <span className="inline-block text-white italic">idei inovative</span>{' '}
            pentru sectorul tău de activitate —{' '}
            <span className="font-semibold text-white">platforme web</span>,{' '}
            <span className="font-semibold text-white">aplicații mobile</span>,{' '}
            <span className="font-semibold text-white">SaaS</span> și multe altele.
        </>
    );
    const heroCta = 'Cere o ofertă';

    const marketingHeading = t('marketing.heading');
    const marketingSubtitle = t('marketing.subtitle');
    const marketingItems = [0, 1, 2, 3].map((index) => t(`marketing.items.${index}`));
    const marketingCta = t('marketing.cta');

    const testimonials = {
        title: t('testimonials.title'),
        subtitle: t('testimonials.subtitle'),
        leftQuote: t('testimonials.leftQuote'),
        leftAuthor: t('testimonials.leftAuthor'),
        rightQuote: t('testimonials.rightQuote'),
        rightAuthor: t('testimonials.rightAuthor'),
        middleTitle: t('testimonials.middleTitle'),
        middleSubtitle: t('testimonials.middleSubtitle'),
    };

    const integration = {
        title: t('integration.title'),
        subtitle: t('integration.subtitle'),
    };

    const stats: StatsSummaryProps = {
        lead: {
            label: t('stats.leadLabel'),
            value: t('stats.leadValue'),
            change: t('stats.leadChange'),
        },
        efficiency: {
            label: t('stats.efficiencyLabel'),
            value: t('stats.efficiencyValue'),
            change: t('stats.efficiencyChange'),
        },
        conversion: {
            label: t('stats.conversionLabel'),
            value: t('stats.conversionValue'),
            change: t('stats.conversionChange'),
        },
    };

    const teamMembers: TeamMember[] = [
        {
            name: t('team.members.0.name'),
            role: t('team.members.0.role'),
            imageUrl: ovidiuImage,
            imageHint: t('team.members.0.hint'),
            position: 'top-center',
        },
        {
            name: t('team.members.1.name'),
            role: t('team.members.1.role'),
            imageUrl: maiaImage,
            imageHint: t('team.members.1.hint'),
            position: 'bottom-left',
        },
        {
            name: t('team.members.2.name'),
            role: t('team.members.2.role'),
            imageUrl: davidImage,
            imageHint: t('team.members.2.hint'),
            position: 'bottom-right',
        },
    ];

    const teamSection = {
        heading: t('team.heading'),
        subtitle: t('team.subtitle'),
        closing: t('team.closing'),
    };

    const faqItems: FaqItem[] = [0, 1, 2, 3, 4].map((index) => ({
        question: t(`faq.items.${index}.question`),
        answer: t(`faq.items.${index}.answer`),
    }));

    const faqSection = {
        heading: t('faq.heading'),
        subtitle: t('faq.subtitle'),
    };

    const contactHeading = t('contact.cta');

    const handlePlayClick = (url: string) => {
        setVideoUrl(url);
    };

    const handleCloseModal = () => {
        setVideoUrl(null);
    };


  return (
    // Container principal cu fundal întunecat și care ocupă tot ecranul
    <div className="text-white w-full overflow-x-hidden relative">
        {videoUrl && <VideoPlayerModal videoUrl={videoUrl} onClose={handleCloseModal} />}
        <div id="hero-section" className="relative isolate">
            <InteractiveNebulaShader position="absolute" className="-z-40 opacity-90" />
            <div className="absolute inset-0 -z-20 pointer-events-none">
                 <Sparkles
                    background="transparent"
                    minSize={0.4}
                    maxSize={1.2}
                    particleDensity={15}
                    className="w-full h-full"
                    particleColor="#FFFFFF"
                    opacity={0.8}
                    speed={0.2}
                />
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center pt-24 px-4">
                <motion.div
                    className="text-center max-w-4xl mx-auto"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white">
                    {heroTitle}
                    </h1>
                    <p className="mt-4 text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
                    {heroSubtitle}
                    </p>
                    {/* Butonul CTA și săgeata de scroll */}
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="#contact-section" passHref>
                            <Button size="lg" className="group bg-gradient-to-r from-primary to-purple-600 text-white font-bold px-8 py-7 text-lg rounded-full shadow-lg hover:shadow-primary/40 transition-all duration-300 transform hover:-translate-y-0.5 relative animate-button-glow">
                                <span className="relative z-10 flex items-center">{heroCta}</span>
                            </Button>
                        </Link>
                    </div>
                </motion.div>

                {/* Container pentru imagine cu efect de fade */}
                <motion.div
                    className="relative mt-10 md:mt-16 w-full max-w-full md:max-w-6xl mx-auto" // Adjusted for mobile
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                >
                    <Image
                        src={heroImage}
                        alt="Three friendly Timpia AI employees ready to work"
                        width={1920}
                        height={1080}
                        className="h-auto w-full rounded-xl"
                        data-ai-hint="three friendly robots"
                        priority
                        fetchPriority="high"
                        sizes="(min-width: 1536px) 60vw, (min-width: 1280px) 62vw, (min-width: 768px) 90vw, 100vw"
                    />

                    {/* Efect de fade jos */}
                    <div className="pointer-events-none absolute left-1/2 bottom-0 -translate-x-1/2 w-screen h-16 md:h-24 bg-gradient-to-t from-black via-black/70 to-transparent z-10" />
                </motion.div>
                
                <div className="w-full"><TrustedBySparkles /></div>
            </div>
        </div>

        <div className="bg-black">

            <section className="w-full pb-6 md:pb-12">
              <div className="relative left-1/2 w-screen -translate-x-1/2">
                <HeroLottie />
              </div>
            </section>

            <ExpertiseShowcase />

            <ProcessJourney />

            <MarketingExpertSection
              heading={marketingHeading}
              subtitle={marketingSubtitle}
              items={marketingItems}
              ctaLabel={marketingCta}
            />

            {/* Integration Section */}
            <section className="pt-12 text-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
            >
                <h2 className="text-3xl md:text-4xl font-bold">{integration.title}</h2>
                <p className="text-lg text-white/90 mt-2 max-w-2xl mx-auto">
                    {integration.subtitle}
                </p>
            </motion.div>
             <motion.div
                className="relative mt-10 max-w-5xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
            >
                <Image
                    src={isMobile ? integrareMobilImage : integrareImage}
                    alt="Integration diagram showing AI employee connected to company platforms"
                    width={isMobile ? 1080 : 1200}
                    height={isMobile ? 1920 : 600}
                    className="h-auto w-full rounded-xl"
                    sizes="(min-width: 1024px) 60vw, 90vw"
                    data-ai-hint="integration diagram robot"
                />
                 <div className="absolute bottom-0 left-0 w-full h-24 md:h-32 bg-gradient-to-t from-black to-transparent z-10" />
            </motion.div>
        </section>
        
            {/* Testimonials Section */}
            <section className="bg-black text-white">
                <motion.div
                    className="container mx-auto px-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                >
                    <div className="text-center mb-8">
                        <h2 className="text-3xl md:text-4xl font-bold">{testimonials.title}</h2>
                        <p className="text-lg text-white/70 mt-2">{testimonials.subtitle}</p>
                    </div>
                    
                     {isMobile ? (
                        <MobileTestimonialsCarousel
                          handlePlayClick={handlePlayClick}
                          leftQuote={testimonials.leftQuote}
                          leftAuthor={testimonials.leftAuthor}
                          rightQuote={testimonials.rightQuote}
                          rightAuthor={testimonials.rightAuthor}
                          middleTitle={testimonials.middleTitle}
                          middleSubtitle={testimonials.middleSubtitle}
                        />
                    ) : (
                        <DesktopTestimonials
                          handlePlayClick={handlePlayClick}
                          leftQuote={testimonials.leftQuote}
                          leftAuthor={testimonials.leftAuthor}
                          rightQuote={testimonials.rightQuote}
                          rightAuthor={testimonials.rightAuthor}
                          middleTitle={testimonials.middleTitle}
                          middleSubtitle={testimonials.middleSubtitle}
                        />
                    )}
                </motion.div>
            </section>
            
            <NewPlaceholderSection />

            <Stats4 stats={stats} />

            <TeamSection
              heading={teamSection.heading}
              subtitle={teamSection.subtitle}
              closing={teamSection.closing}
              members={teamMembers}
            />
            <ContactSection heading={contactHeading} />
            <section id="faq-section">
                <FaqSection heading={faqSection.heading} subtitle={faqSection.subtitle} items={faqItems} />
            </section>

            {/* Secțiunea nou adăugată cu robot și text */}
            <section className="py-12 md:py-20 flex flex-col items-center justify-center px-4 bg-black">
                <motion.div
                    className="relative w-full max-w-lg md:max-w-xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    {/* Efect de fade sus */}
                    <div className="absolute top-0 left-0 w-full h-24 md:h-32 bg-gradient-to-b from-black to-transparent z-10" />

                    <Image
                        src={romaniaImage}
                        alt="Timpia AI robot illustration"
                        width={1024}
                        height={768}
                        className="rounded-xl"
                        data-ai-hint="friendly robot mascot"
                    />

                    {/* Efect de fade jos */}
                    <div className="absolute bottom-0 left-0 w-full h-24 md:h-32 bg-gradient-to-t from-black to-transparent z-10" />
                </motion.div>

                <motion.div
                    className="text-center max-w-md md:max-w-xl mx-auto -mt-16 md:-mt-24 relative z-20"
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                >
                     <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold leading-tight">
                         {teamSection.closing}
                    </h2>
                </motion.div>
            </section>

        </div>
    </div>
  );
}
