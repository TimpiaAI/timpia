// src/app/blog/blog-listing-client.tsx
"use client";

import type { PostData } from '@/lib/blog';
import BlogCard from '@/components/blog-card';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Rss, Send, Edit3, CalendarDays, UserCircle, Tag, Search, ChevronsUpDown } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import React, { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2, ease: "easeOut" },
  },
};

const itemVariants = (delay: number = 0) => ({
  hidden: { opacity: 0, y: 20, filter: "blur(3px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, delay, ease: "easeOut" } },
});


interface BlogListingClientProps {
  allPosts: Omit<PostData, 'contentHtml' | 'contentMarkdown'>[];
}

const INITIAL_GRID_COUNT = 6;
const LOAD_MORE_COUNT = 6;

export default function BlogListingClient({ allPosts }: BlogListingClientProps) {
  const [postsToShowInGrid, setPostsToShowInGrid] = useState(INITIAL_GRID_COUNT);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');

  const filteredAndSortedPosts = useMemo(() => {
    let posts = allPosts;

    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      posts = posts.filter(post =>
        post.title.toLowerCase().includes(lowerCaseQuery) ||
        post.summary.toLowerCase().includes(lowerCaseQuery) ||
        post.tags?.some(tag => tag.toLowerCase().includes(lowerCaseQuery))
      );
    }

    if (sortOrder === 'oldest') {
      posts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else { // 'newest' is default
      posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    return posts;
  }, [allPosts, searchQuery, sortOrder]);

  const featuredPost = filteredAndSortedPosts.length > 0 ? filteredAndSortedPosts[0] : null;
  const remainingPosts = filteredAndSortedPosts.length > 1 ? filteredAndSortedPosts.slice(1) : [];
  const visibleGridPosts = remainingPosts.slice(0, postsToShowInGrid);

  const handleLoadMore = () => {
    setPostsToShowInGrid(prev => prev + LOAD_MORE_COUNT);
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'Dată necunoscută';
    try {
      const parsedDate = new Date(dateString);
      if (isNaN(parsedDate.getTime())) return dateString;
      return format(parsedDate, 'd MMMM yyyy', { locale: ro });
    } catch (error) {
      console.warn(`Error formatting date: ${dateString}`, error);
      return dateString;
    }
  };

  return (
    <div className="container py-16 md:py-24 bg-gradient-to-b from-background via-secondary/5 to-background section-divider">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-center mb-8"
      >
        <h1 className="mb-4 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-accent">
          Blog
        </h1>
      </motion.div>

      {/* Search and Filter Section */}
       <motion.div 
        className="mb-12 flex flex-col sm:flex-row gap-4 justify-center items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
    >
        <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                placeholder="Caută după titlu, tag, sau cuvânt cheie..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11"
            />
        </div>
        <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-full sm:w-[200px] h-11">
                 <ChevronsUpDown className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Sortează după" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="newest">Cele mai noi</SelectItem>
                <SelectItem value="oldest">Cele mai vechi</SelectItem>
            </SelectContent>
        </Select>
    </motion.div>

      {filteredAndSortedPosts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center py-16"
        >
          <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Niciun rezultat găsit</h2>
          <p className="text-muted-foreground mb-6">Încearcă alți termeni de căutare sau resetează filtrele.</p>
          <Button onClick={() => setSearchQuery('')} variant="outline">
            Resetează căutarea
          </Button>
        </motion.div>
      ) : (
        <>
          {/* Featured Post Section */}
          {featuredPost && (
            <motion.section
              className="mb-16 md:mb-20"
              variants={itemVariants(0.1)}
              initial="hidden"
              animate="visible"
            >
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-center mb-8 text-foreground/90">
                <Edit3 className="inline-block h-7 w-7 mr-2 text-primary/80" /> Articol Recomandat
              </h2>
              <Link href={`/blog/${featuredPost.slug}`} passHref>
                <motion.div
                  className="block group rounded-xl overflow-hidden shadow-2xl hover:shadow-primary/20 border border-border/30 bg-card/95 dark:bg-card/90 backdrop-blur-lg transition-all duration-300 ease-out hover:scale-[1.015]"
                  whileHover={{ y: -5 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 items-center">
                    <div className="relative aspect-[16/9] md:aspect-auto md:h-full min-h-[250px] md:min-h-[350px] overflow-hidden">
                      <Image
                        src={featuredPost.coverImage}
                        alt={featuredPost.title || "Featured post image"}
                        fill
                        className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        data-ai-hint={featuredPost.coverImageHint || "technology blog"}
                      />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent md:bg-gradient-to-r md:from-black/50 md:to-transparent"></div>
                    </div>
                    <div className="p-6 md:p-8 lg:p-10 relative z-10">
                      {featuredPost.tags && featuredPost.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {featuredPost.tags.slice(0, 2).map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20 group-hover:bg-primary/20">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight mb-3 text-[hsl(var(--chart-2))] group-hover:text-[hsl(var(--chart-2)/0.8)] transition-colors">
                        {featuredPost.title || "Titlu Articol Recomandat"}
                      </h3>
                      <p className="text-muted-foreground text-sm md:text-base line-clamp-3 mb-4">
                        {featuredPost.summary || "Sumar pentru articolul recomandat..."}
                      </p>
                      <div className="flex flex-wrap items-center text-xs text-muted-foreground/80 gap-x-3 gap-y-1 mb-5">
                        <div className="flex items-center gap-1">
                          <CalendarDays className="h-3.5 w-3.5" />
                          <span>{formatDate(featuredPost.date)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <UserCircle className="h-3.5 w-3.5" />
                          <span>{featuredPost.author || "Autor Necunoscut"}</span>
                        </div>
                      </div>
                      <span className="inline-flex items-center text-sm font-semibold text-primary group-hover:underline">
                        Citește Articolul <ArrowRight className="ml-1.5 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.section>
          )}

          {/* Grid for other posts */}
          {remainingPosts.length > 0 && (
            <motion.section
              variants={itemVariants(0.2)}
              initial="hidden"
              animate="visible"
            >
              {featuredPost && (
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-center mb-8 md:mb-10 text-foreground/90">
                  Alte Articole
                </h2>
              )}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {visibleGridPosts.map((post, index) => (
                  <BlogCard key={post.slug} post={post} index={index} />
                ))}
              </motion.div>

              {postsToShowInGrid < remainingPosts.length && (
                <motion.div
                  className="text-center mt-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button
                    onClick={handleLoadMore}
                    variant="outline"
                    size="lg"
                    className="group border-primary/40 hover:border-primary/70 hover:bg-primary/10 hover:text-primary transition-all duration-300 shadow-sm hover:shadow-lg"
                  >
                    Încarcă Mai Multe Articole
                    <Send className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </motion.div>
              )}
            </motion.section>
          )}
        </>
      )}
    </div>
  );
}
