
// src/lib/blog.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';

const postsDirectory = path.join(process.cwd(), 'src/content/blog');

export interface PostData {
  slug: string;
  title: string;
  date: string;
  author: string;
  summary: string;
  coverImage: string;
  coverImageHint: string;
  tags: string[];
  contentHtml?: string; // For individual post page
  contentMarkdown?: string; // For individual post page
}

export function getSortedPostsData(): Omit<PostData, 'contentHtml' | 'contentMarkdown'>[] {
  // Get file names under /src/content/blog
  let fileNames: string[];
  try {
    fileNames = fs.readdirSync(postsDirectory);
  } catch (err) {
    console.warn('Blog directory not found, returning empty list.');
    return [];
  }

  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.md') || fileName.endsWith('.mdx'))
    .map((fileName) => {
      // Remove ".md" or ".mdx" from file name to get id
      const slug = fileName.replace(/\.(md|mdx)$/, '');

      // Read markdown file as string
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents);

      // Combine the data with the id
      return {
        slug,
        title: matterResult.data.title || 'Untitled Post',
        date: matterResult.data.date || new Date().toISOString().split('T')[0],
        author: matterResult.data.author || 'Timpia AI Team',
        summary: matterResult.data.summary || '',
        coverImage: matterResult.data.coverImage || `https://placehold.co/800x400.png?text=${encodeURIComponent(matterResult.data.title || 'Blog Post')}`,
        coverImageHint: matterResult.data.coverImageHint || 'abstract technology',
        tags: matterResult.data.tags || [],
      };
    });

  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export async function getPostData(slug: string): Promise<PostData | null> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  let fileContents;
  try {
    fileContents = fs.readFileSync(fullPath, 'utf8');
  } catch (err) {
    // If the .md file doesn't exist, try .mdx
    const mdxFullPath = path.join(postsDirectory, `${slug}.mdx`);
    try {
        fileContents = fs.readFileSync(mdxFullPath, 'utf8');
    } catch (mdxErr) {
        console.error(`Error reading blog post file for slug "${slug}":`, mdxErr);
        return null;
    }
  }

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);
  const markdownContent = matterResult.content; // Explicitly get the content part

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(remarkGfm)
    .use(html)
    .process(markdownContent); // Process the potentially cleaned markdownContent
  const contentHtml = processedContent.toString();

  // Combine the data with the slug and contentHtml
  return {
    slug,
    title: matterResult.data.title || 'Untitled Post',
    date: matterResult.data.date || new Date().toISOString().split('T')[0],
    author: matterResult.data.author || 'Timpia AI Team',
    summary: matterResult.data.summary || '',
    coverImage: matterResult.data.coverImage || `https://placehold.co/1200x600.png?text=${encodeURIComponent(matterResult.data.title || 'Blog Post')}`,
    coverImageHint: matterResult.data.coverImageHint || 'article illustration',
    tags: matterResult.data.tags || [],
    contentHtml,
    contentMarkdown: markdownContent, // Use the potentially cleaned markdownContent
  };
}

export function getAllPostSlugs() {
  let fileNames: string[];
  try {
    fileNames = fs.readdirSync(postsDirectory);
  } catch (err) {
    return [];
  }

  return fileNames
    .filter((fileName) => fileName.endsWith('.md') || fileName.endsWith('.mdx'))
    .map((fileName) => {
      return {
        slug: fileName.replace(/\.(md|mdx)$/, ''),
      };
    });
}
