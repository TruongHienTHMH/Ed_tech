/**
 * Blog Domain Service
 * Manages blog articles, category filters, and article retrieval
 */

import { BlogPost } from "@/lib/cms/types";
import { SheetsClient } from "@/lib/cms/sheets-client";
import { seedBlogPosts } from "@/data/seed-data";

export class BlogService {
  /**
   * Fetch all active blog posts
   */
  public static async getBlogPosts(): Promise<BlogPost[]> {
    const report = await SheetsClient.getLiveSyncReport();
    const posts = (report.blogPosts || []).filter((b) => b.isActive);
    if (posts.length === 0 && seedBlogPosts && seedBlogPosts.length > 0) {
      return seedBlogPosts.filter((b) => b.isActive);
    }
    return posts;
  }

  /**
   * Fetch single blog post by SEO slug
   */
  public static async getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    const posts = await this.getBlogPosts();
    const normalized = slug.trim().toLowerCase();
    let post = posts.find((p) => p.slug.toLowerCase() === normalized || p.id.toLowerCase() === normalized);
    if (!post && seedBlogPosts) {
      post = seedBlogPosts.find((p) => p.slug.toLowerCase() === normalized || p.id.toLowerCase() === normalized);
    }
    return post || null;
  }

  /**
   * Fetch all unique blog categories
   */
  public static async getCategories(): Promise<string[]> {
    const posts = await this.getBlogPosts();
    const categories = new Set(posts.map((p) => p.category).filter(Boolean));
    return Array.from(categories);
  }

  /**
   * Fetch related posts in the same category
   */
  public static async getRelatedPosts(category: string, currentSlug: string, limit = 3): Promise<BlogPost[]> {
    const posts = await this.getBlogPosts();
    const normalizedSlug = currentSlug.trim().toLowerCase();
    return posts
      .filter((p) => p.slug.toLowerCase() !== normalizedSlug && p.category.toLowerCase() === category.toLowerCase())
      .slice(0, limit);
  }
}

