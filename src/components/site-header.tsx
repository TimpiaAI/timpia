// src/components/site-header.tsx
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { MobileNav } from './mobile-nav';
import { Calendar } from 'lucide-react';
import Logo from '@/components/logo';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { locales } from '@/i18n';

type NavItemKey = 'home' | 'employees' | 'team' | 'contact' | 'faq' | 'blog';

interface NavItem {
  key: NavItemKey;
  hash?: string;
  path?: string;
}

const NAV_CONFIG: NavItem[] = [
  { key: 'home', hash: 'hero-section' },
  { key: 'employees', hash: 'solutii-section' },
  { key: 'team', hash: 'team-section' },
  { key: 'contact', hash: 'contact-section' },
  { key: 'faq', hash: 'faq-section' },
  { key: 'blog', path: '/blog' },
];

interface TranslatedNavItem {
  title: string;
  href: string;
  hash?: string;
  path?: string;
}

export default function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isClientRendered, setIsClientRendered] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const layoutTranslations = useTranslations('layout');
  const headerTranslations = useTranslations('layout.header');

  const basePath = useMemo(() => `/${locale}`, [locale]);

  const normalizedPath = useMemo(() => {
    if (!pathname) return '/';
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 0) return '/';
    const [first, ...rest] = segments;
    if (locales.includes(first as (typeof locales)[number])) {
      return `/${rest.join('/')}`;
    }
    return pathname.startsWith('/') ? pathname : `/${pathname}`;
  }, [pathname]);

  const isOnHomePage = normalizedPath === '/' || normalizedPath === '';

  const navItems = useMemo<TranslatedNavItem[]>(
    () =>
      NAV_CONFIG.map((item) => {
        const href =
          item.hash != null
            ? `${basePath}#${item.hash}`
            : item.path
              ? `${basePath}${item.path}`
              : basePath;
        return {
          title: headerTranslations(`nav.${item.key}`),
          href,
          hash: item.hash,
          path: item.path,
        };
      }),
    [basePath, headerTranslations],
  );

  useEffect(() => {
    setIsClientRendered(true);
  }, []);

  useEffect(() => {
    if (!isClientRendered) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); 

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isClientRendered]);
  
  const scrollToHash = useCallback((hash: string) => {
    const targetElement = document.getElementById(hash);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleLinkClick = useCallback(
    (item: TranslatedNavItem, event: React.MouseEvent<HTMLAnchorElement>) => {
      if (item.hash) {
        event.preventDefault();
        const targetHash = item.hash;
        if (isOnHomePage && typeof window !== 'undefined') {
          scrollToHash(targetHash);
        } else {
          router.push(`${basePath}#${targetHash}`);
        }
        return;
      }

      if (item.path) {
        event.preventDefault();
        router.push(`${basePath}${item.path}`);
        return;
      }
    },
    [basePath, isOnHomePage, router, scrollToHash],
  );

  const navItemVariants = {
    hidden: { y: -25, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: { delay: 0.35 + i * 0.09, type: "spring", stiffness: 140, damping: 16 },
    }),
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out"
      style={{ willChange: 'transform, opacity' }}
    >
      <div className="container py-4">
        <AnimatePresence>
        {isClientRendered && isScrolled && (
            <motion.div
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -40, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                className={cn(
                    "flex items-center justify-between mx-auto max-w-4xl px-4 py-4 md:py-5 rounded-full",
                    "shadow-lg bg-black/85 backdrop-blur-xl border border-white/10"
                )}
            >
                <Link
                  href={basePath}
                  className="mr-3 sm:mr-4 flex items-center space-x-2.5 flex-shrink-0"
                >
                    <Logo width={28} height={28} />
                    <span className="font-bold text-lg sm:text-xl tracking-tight">
                      {layoutTranslations('brand')}
                    </span>
                </Link>

                <nav className="hidden md:flex items-center gap-1 text-sm flex-grow justify-center">
                {navItems.map((item, i) => (
                    <motion.div key={item.title} custom={i} variants={navItemVariants} initial="hidden" animate="visible">
                        <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="text-white/90 hover:text-white hover:bg-white/10 px-3.5 py-2 rounded-md transition-all focus-visible:ring-2 focus-visible:ring-ring font-semibold text-base"
                        >
                          <Link
                            href={item.href}
                            onClick={(event) => handleLinkClick(item, event)}
                          >
                              {item.title}
                          </Link>
                        </Button>
                    </motion.div>
                ))}
                </nav>

                <div className="flex items-center gap-1.5 sm:gap-2 ml-auto md:ml-0">
                <Button
                    asChild
                    size="sm"
                    className={cn(
                    "hidden md:inline-flex shadow-md hover:shadow-primary/30 transition-all duration-300 text-primary-foreground transform hover:-translate-y-0.5 px-3.5 py-2 text-xs sm:text-sm rounded-full font-semibold",
                    "bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 focus-visible:ring-2 focus-visible:ring-ring"
                    )}
                >
                    <Link
                      href={`${basePath}#contact-section`}
                      onClick={(event) =>
                        handleLinkClick(
                          {
                            ...navItems.find((item) => item.hash === 'contact-section')!,
                            href: `${basePath}#contact-section`,
                          },
                          event,
                        )
                      }
                    >
                    {headerTranslations('demoCta')}
                    <Calendar className="ml-1.5 h-4 w-4" />
                    </Link>
                </Button>
                <div className="md:hidden">
                    <MobileNav
                      navItems={navItems}
                      localeBasePath={basePath}
                      onLinkClick={(item, event) => handleLinkClick(item, event)}
                    />
                </div>
                </div>
            </motion.div>
        )}
        </AnimatePresence>
      </div>
    </header>
  );
}
