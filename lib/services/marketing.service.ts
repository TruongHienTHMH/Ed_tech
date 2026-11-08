/**
 * Marketing Domain Service
 * Manages Packages, Promotions, Testimonials, Mentors, Student Projects, FAQs, Trust Metrics, and Settings
 */

import {
  PackagePricing,
  Promotion,
  StudentProject,
  Testimonial,
  Mentor,
  FAQ,
  TrustMetric,
  SystemSettings,
} from "@/lib/cms/types";
import { SheetsClient } from "@/lib/cms/sheets-client";
import { seedMentor, seedSettings } from "@/data/seed-data";

export class MarketingService {
  /**
   * Fetch active pricing packages
   */
  public static async getPackages(): Promise<PackagePricing[]> {
    const report = await SheetsClient.getLiveSyncReport();
    return (report.packages || []).filter((p) => p.isActive);
  }

  /**
   * Fetch lead mentor or all mentors
   */
  public static async getMentor(): Promise<Mentor> {
    const report = await SheetsClient.getLiveSyncReport();
    if (report.mentors && report.mentors.length > 0) {
      return report.mentors[0];
    }
    return seedMentor;
  }

  public static async getMentors(): Promise<Mentor[]> {
    const report = await SheetsClient.getLiveSyncReport();
    return (report.mentors || []).filter((m) => m.isActive !== false);
  }

  /**
   * Fetch student testimonials
   */
  public static async getTestimonials(): Promise<Testimonial[]> {
    const report = await SheetsClient.getLiveSyncReport();
    return (report.testimonials || []).filter((t) => t.isActive !== false);
  }

  /**
   * Fetch FAQs, optionally filtered by category
   */
  public static async getFaqs(category?: string): Promise<FAQ[]> {
    const report = await SheetsClient.getLiveSyncReport();
    const list = (report.faqs || []).filter((f) => f.isActive);
    if (!category || category === "ALL") return list;
    return list.filter((f) => f.category.toUpperCase() === category.toUpperCase());
  }

  /**
   * Fetch Trust Metrics (Social Proof)
   */
  public static async getTrustMetrics(): Promise<TrustMetric[]> {
    const report = await SheetsClient.getLiveSyncReport();
    return (report.trustMetrics || []).filter((tm) => tm.isActive);
  }

  /**
   * Fetch System Settings (Hotline, Email, Zalo, Banner)
   */
  public static async getSettings(): Promise<SystemSettings> {
    const report = await SheetsClient.getLiveSyncReport();
    return report.settings || seedSettings;
  }

  /**
   * Fetch active promotions & discount coupon codes
   */
  public static async getPromotions(): Promise<Promotion[]> {
    const report = await SheetsClient.getLiveSyncReport();
    return (report.promotions || []).filter((p) => p.isActive);
  }

  /**
   * Fetch showcase student projects
   */
  public static async getStudentProjects(): Promise<StudentProject[]> {
    const report = await SheetsClient.getLiveSyncReport();
    return (report.studentProjects || []).filter((p) => p.isActive);
  }
}

