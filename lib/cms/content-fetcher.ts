/**
 * Multi-Tier CMS Content Fetcher (Unified Facade Adapter)
 * Architectural Pattern: Facade Pattern
 * 
 * Provides a single, unified entrypoint for the presentation layer (Next.js components & API routes)
 * while delegating domain-specific logic to specialized services:
 * - CourseService: Courses & Curriculum
 * - BlogService: Blog posts & categories
 * - MarketingService: Packages, Testimonials, Mentors, FAQs, Projects, Settings, Promotions
 * - SheetsClient: Live sync engine & Raw data mappers
 * - LRUCacheManager: Bounded memory caching & on-demand invalidation
 */

import {
  Course,
  CurriculumModule,
  PackagePricing,
  StudentProject,
  Promotion,
  Mentor,
  Testimonial,
  FAQ,
  TrustMetric,
  SystemSettings,
  BlogPost,
} from "./types";
import { SheetsClient, GoogleSheetsSyncReport } from "./sheets-client";
import { LRUCacheManager } from "./cache";
import { CourseService } from "@/lib/services/course.service";
import { BlogService } from "@/lib/services/blog.service";
import { MarketingService } from "@/lib/services/marketing.service";

export type { GoogleSheetsSyncReport };

export class ContentFetcher {
  /**
   * Helper: Parse multiline text (Alt+Enter in Google Sheets) into clean bullet points
   */
  public static parseMultilineText(rawText: unknown): string[] {
    return SheetsClient.parseMultilineText(rawText);
  }

  /**
   * Invalidate memory cache on demand (Triggered by Webhook POST /api/revalidate)
   */
  public static invalidateCache(keyPattern?: string): void {
    LRUCacheManager.invalidate(keyPattern);
  }

  /**
   * Fetch Live Data from Google Sheets or serve Fallback Snapshot
   */
  public static async getLiveSyncReport(forceRefresh = false): Promise<GoogleSheetsSyncReport> {
    return SheetsClient.getLiveSyncReport(forceRefresh);
  }

  // ==========================================
  // COURSE & CURRICULUM DOMAIN (CourseService)
  // ==========================================

  public static async getCourses(): Promise<Course[]> {
    return CourseService.getCourses();
  }

  public static async getCourseBySlug(slug: string): Promise<Course | null> {
    return CourseService.getCourseBySlug(slug);
  }

  public static async getCurriculumByCourseId(courseId: string): Promise<CurriculumModule[]> {
    return CourseService.getCurriculumByCourseId(courseId);
  }

  // ==========================================
  // BLOG DOMAIN (BlogService)
  // ==========================================

  public static async getBlogPosts(): Promise<BlogPost[]> {
    return BlogService.getBlogPosts();
  }

  public static async getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    return BlogService.getBlogPostBySlug(slug);
  }

  // ==========================================
  // MARKETING & PACKAGES DOMAIN (MarketingService)
  // ==========================================

  public static async getPackages(): Promise<PackagePricing[]> {
    return MarketingService.getPackages();
  }

  public static async getMentor(): Promise<Mentor> {
    return MarketingService.getMentor();
  }

  public static async getMentors(): Promise<Mentor[]> {
    return MarketingService.getMentors();
  }

  public static async getTestimonials(): Promise<Testimonial[]> {
    return MarketingService.getTestimonials();
  }

  public static async getFaqs(category?: string): Promise<FAQ[]> {
    return MarketingService.getFaqs(category);
  }

  public static async getTrustMetrics(): Promise<TrustMetric[]> {
    return MarketingService.getTrustMetrics();
  }

  public static async getSettings(): Promise<SystemSettings> {
    return MarketingService.getSettings();
  }

  public static async getPromotions(): Promise<Promotion[]> {
    return MarketingService.getPromotions();
  }

  public static async getStudentProjects(): Promise<StudentProject[]> {
    return MarketingService.getStudentProjects();
  }
}

export default ContentFetcher;
