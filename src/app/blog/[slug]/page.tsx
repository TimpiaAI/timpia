
// src/app/blog/[slug]/page.tsx
import { getPostData, getAllPostSlugs, getSortedPostsData } from '@/lib/blog';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw'; // Import rehype-raw
import { Button } from '@/components/ui/button';
import { ArrowLeft, CalendarDays, UserCircle, Tag, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { Metadata, ResolvingMetadata } from 'next';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';
import { MotionDiv } from '@/components/motion-div'; // Custom client component for motion
import BlogCard from '@/components/blog-card'; // Import the BlogCard component
import type { Article, WithContext } from 'schema-dts';

// For client-side animations on elements
const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const itemVariants = (delay: number) => ({
  hidden: { opacity: 0, y: 15, filter: "blur(2px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, delay, ease: 'easeOut' } },
});

type Props = {
  params: { slug: string }; // params contain only slug
};

export async function generateMetadata(
  { params }: Props, // Explicitly { slug: string }
  parent: ResolvingMetadata
): Promise<Metadata> {
  const post = await getPostData(params.slug);

  if (!post) {
    return {
      title: 'Articol Negăsit | Timpia AI Blog',
      description: 'Acest articol de blog nu a fost găsit.',
    };
  }

  const parentKeywords = (await parent).keywords || [];
  const postKeywords = post.tags || ['AI', 'Timpia', 'Blog'];

  return {
    title: `${post.title || 'Articol Blog'} | Timpia AI`,
    description: post.summary || 'Citește acest articol interesant de pe blogul Timpia AI.',
    authors: [{ name: post.author || 'Echipa Timpia AI' }],
    keywords: [...new Set([...postKeywords, ...parentKeywords])],
    openGraph: {
      title: post.title || 'Articol Blog Timpia AI',
      description: post.summary || 'Informații și noutăți de la Timpia AI.',
      type: 'article',
      publishedTime: post.date ? new Date(post.date).toISOString() : new Date().toISOString(),
      authors: [post.author || 'Echipa Timpia AI'],
      url: `https://timpia.ro/blog/${post.slug}`, // Static URL, no locale
      images: [
        {
          url: post.coverImage || 'https://placehold.co/1200x630.png',
          width: 1200,
          height: 630,
          alt: post.title || 'Imagine Articol Blog',
        },
      ],
    },
  };
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const paths = getAllPostSlugs(); // getAllPostSlugs returns { slug: string }[]
  return paths.map(path => ({
    slug: path.slug,
  }));
}

// Helper function to format date, can be moved to a utils file
const formatDate = (dateString: string | undefined) => {
  if (!dateString) {
    return 'Dată publicare necunoscută';
  }
  try {
    const parsedDate = new Date(dateString);
    if (isNaN(parsedDate.getTime())) {
      return dateString; // Return original if not a valid date
    }
    return format(parsedDate, 'd MMMM yyyy', { locale: ro });
  } catch (error) {
    console.warn(`Error formatting date: ${dateString}`, error);
    return dateString; // fallback
  }
};

export default async function BlogPostPage({ params }: Props) { // params is { slug: string }
  const post = await getPostData(params.slug);

  if (!post) {
    notFound();
  }
  
  const articleSchema: WithContext<Article> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://timpia.ro/blog/${post.slug}`,
    },
    headline: post.title,
    description: post.summary,
    image: post.coverImage,
    author: {
      '@type': 'Organization',
      name: post.author,
      url: 'https://timpia.ro',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Timpia AI',
      logo: {
        '@type': 'ImageObject',
        url: 'https://timpia.ro/android-chrome-512x512.png',
      },
    },
    datePublished: post.date,
    dateModified: post.date,
  };


  // Fetch all posts to find related ones
  const allPosts = getSortedPostsData();
  const relatedPosts = allPosts.filter(p => {
    // Ensure tags exist before comparing
    if (!post.tags || !p.tags || post.tags.length === 0 || p.tags.length === 0) return false;
    // Exclude the current post from the list
    if (p.slug === post.slug) return false;
    // Find posts that share at least one tag
    return post.tags.some(tag => p.tags.includes(tag));
  }).slice(0, 3); // Limit to 3 related posts

  // Ensure contentMarkdown is treated as a string, even if it's undefined/null from parsing
  const markdownToRender = typeof post.contentMarkdown === 'string' ? post.contentMarkdown : "";
  const htmlToRender = typeof post.contentHtml === 'string' ? post.contentHtml : "";

  return (
    <div className="bg-gradient-to-b from-background via-card/30 to-background dark:from-background dark:via-black/20 dark:to-background section-divider">
       <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      <article className="container py-16 md:py-24">
        {/* Back to Blog Button */}
        <MotionDiv variants={itemVariants(0.1)} initial="hidden" animate="visible" className="mb-8">
          <Button variant="outline" asChild className="group hover:bg-primary/5 hover:border-primary/50 hover:text-primary shadow-sm">
            <Link href="/blog"> {/* Static link, no locale */}
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Înapoi la Blog
            </Link>
          </Button>
        </MotionDiv>

        {/* Post Header */}
        <MotionDiv variants={sectionVariants} initial="hidden" animate="visible">
          <header className="mb-10 md:mb-12 text-center">
            <MotionDiv variants={itemVariants(0.2)}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-accent">
                {post.title || 'Titlu Articol'}
              </h1>
            </MotionDiv>
            <MotionDiv variants={itemVariants(0.3)} className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" />
                <time dateTime={post.date}>{formatDate(post.date)}</time>
              </div>
              <span className="hidden sm:inline">•</span>
              <div className="flex items-center gap-1.5">
                <UserCircle className="h-4 w-4" />
                <span>De: {post.author || 'Echipa Timpia AI'}</span>
              </div>
            </MotionDiv>
             {post.tags && post.tags.length > 0 && (
              <MotionDiv variants={itemVariants(0.35)} className="flex flex-wrap justify-center items-center gap-2 mt-3">
                <Tag className="h-4 w-4 text-muted-foreground" />
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs font-medium">
                    {tag}
                  </Badge>
                ))}
              </MotionDiv>
            )}
          </header>
        </MotionDiv>

        {/* Cover Image */}
        <MotionDiv variants={itemVariants(0.4)} className="mb-10 md:mb-12 rounded-xl overflow-hidden shadow-2xl border border-border/20">
          <Image
            src={post.coverImage || `https://placehold.co/1200x600.png?text=${encodeURIComponent(post.title || 'Imagine Articol')}`}
            alt={post.title || 'Imagine Articol'}
            width={1200}
            height={600}
            className="w-full h-auto object-cover aspect-[2/1]"
            priority // Prioritize loading for LCP
            data-ai-hint={post.coverImageHint || "blog illustration"}
          />
        </MotionDiv>

        <Separator className="my-8 md:my-12 bg-border/50" />

        {/* Post Content */}
        <MotionDiv
          variants={itemVariants(0.5)}
          className="prose prose-lg dark:prose-invert max-w-3xl mx-auto 
                     prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground 
                     prose-h1:text-3xl prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-3 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-2
                     prose-p:leading-relaxed prose-p:text-foreground/90
                     prose-a:text-primary prose-a:font-medium hover:prose-a:underline
                     prose-strong:text-primary prose-strong:font-semibold
                     prose-blockquote:border-l-primary/70 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground
                     prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-1
                     prose-ol:list-decimal prose-ol:pl-6 prose-ol:space-y-1
                     prose-li:text-foreground/90
                     prose-img:rounded-lg prose-img:shadow-md prose-img:border prose-img:border-border/15
                     prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-mono prose-code:text-sm prose-code:text-primary/90
                     prose-pre:bg-muted/70 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto prose-pre:shadow-inner
                     prose-table:border prose-table:border-border prose-th:border prose-th:border-border prose-th:p-2 prose-td:border prose-td:border-border prose-td:p-2
                     dark:prose-headings:text-primary-foreground dark:prose-p:text-primary-foreground/80 dark:prose-li:text-primary-foreground/80
                     dark:prose-code:bg-primary/10 dark:prose-code:text-primary/90
                     dark:prose-pre:bg-black/30
                     "
        >
           {markdownToRender ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
              {markdownToRender}
            </ReactMarkdown>
          ) : ( htmlToRender ? (
            <div dangerouslySetInnerHTML={{ __html: htmlToRender }} />
            ) : (
            <p>Conținutul acestui articol nu este disponibil momentan.</p>
            )
          )}
        </MotionDiv>

        {/* Related Posts Section */}
        {relatedPosts.length > 0 && (
            <>
                <Separator className="my-10 md:my-16 bg-border/50" />
                <MotionDiv variants={itemVariants(0.6)} className="max-w-5xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-10 text-foreground/90">Articole Similare</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {relatedPosts.map((relatedPost, index) => (
                            <BlogCard key={relatedPost.slug} post={relatedPost} index={index} />
                        ))}
                    </div>
                </MotionDiv>
            </>
        )}

        <Separator className="my-10 md:my-16 bg-border/50" />

        {/* Call to Action */}
        <MotionDiv variants={itemVariants(relatedPosts.length > 0 ? 0.7 : 0.6)} className="text-center">
          <h3 className="text-2xl font-semibold mb-4">Ți-a plăcut articolul?</h3>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Descoperă cum îți putem transforma afacerea cu ajutorul angajaților AI.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button asChild size="lg" className="group bg-gradient-to-r from-primary to-purple-600 text-primary-foreground hover:shadow-lg transform hover:-translate-y-0.5 transition-all">
              <Link href="/"> {/* Changed link to main page */}
                Vezi Angajații AI <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="group hover:bg-primary/5 hover:border-primary/50 hover:text-primary transition-all">
              <Link href="/#solutii-section"> {/* Changed link to solutions section on main page */}
                Descoperă Soluțiile
              </Link>
            </Button>
          </div>
        </MotionDiv>
      </article>
    </div>
  );
}
