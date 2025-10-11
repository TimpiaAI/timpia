
// src/components/blog-card.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, CalendarDays, UserCircle } from 'lucide-react';
import type { PostData } from '@/lib/blog';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';

type BlogCardProps = {
  post: Omit<PostData, 'contentHtml' | 'contentMarkdown'>;
  index: number;
  className?: string;
};

export default function BlogCard({ post, index, className }: BlogCardProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95, filter: "blur(2px)" }, // Added filter
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)", // Added filter
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 16,
        duration: 0.7,
        delay: index * 0.1, // Stagger animation
      },
    },
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) {
      return 'Dată necunoscută';
    }
    try {
      const parsedDate = new Date(dateString);
      if (isNaN(parsedDate.getTime())) {
        return dateString; 
      }
      return format(parsedDate, 'd MMMM yyyy', { locale: ro });
    } catch (error) {
      console.warn(`Error formatting date: ${dateString}`, error);
      return dateString; 
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      className={cn("h-full", className)}
      whileHover={{ y: -5, scale: 1.02, boxShadow: "0 10px 25px -5px hsla(var(--primary)/0.15), 0 8px 10px -6px hsla(var(--primary)/0.1)" }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
    >
      <Card className="h-full flex flex-col overflow-hidden rounded-xl border border-border/30 shadow-lg hover:shadow-primary/10 transition-all duration-300 bg-card/90 backdrop-blur-md group">
        <Link href={`/blog/${post.slug}`} className="flex flex-col h-full">
          <CardHeader className="p-0 relative">
            <div className="aspect-[16/9] overflow-hidden">
              <Image
                src={post.coverImage || `https://placehold.co/800x450.png?text=${encodeURIComponent(post.title || 'Imagine Articol')}`}
                alt={post.title || 'Imagine articol blog'}
                width={800}
                height={450}
                className="object-cover w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-105"
                data-ai-hint={post.coverImageHint || "blog abstract"}
              />
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-3 left-4 right-4">
               {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-1.5">
                  {post.tags.slice(0, 3).map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs backdrop-blur-sm bg-black/30 text-white border-white/20 group-hover:bg-primary/70 group-hover:border-primary/50 transition-colors"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-5 flex-grow">
            <CardTitle className="text-xl font-bold leading-tight mb-2 group-hover:text-[hsl(var(--chart-2)/0.8)] transition-colors line-clamp-2 text-[hsl(var(--chart-2))]">
                {post.title || 'Articol Nou'}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground line-clamp-3 mb-3">
              {post.summary || 'Citește mai mult pentru a descoperi conținutul acestui articol.'}
            </CardDescription>
            <div className="flex items-center text-xs text-muted-foreground space-x-3 mt-auto">
              <div className="flex items-center gap-1">
                <CalendarDays className="h-3.5 w-3.5" />
                <span>{formatDate(post.date)}</span>
              </div>
              <div className="flex items-center gap-1">
                <UserCircle className="h-3.5 w-3.5" />
                <span>{post.author || 'Autor Necunoscut'}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-5 pt-0 border-t border-transparent group-hover:border-primary/10 transition-colors duration-300 mt-auto">
            <span className="text-sm font-medium text-primary group-hover:underline flex items-center">
              Citește Articolul
              <ArrowRight className="ml-1.5 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </CardFooter>
        </Link>
      </Card>
    </motion.div>
  );
}
