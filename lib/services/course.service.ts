/**
 * Course Domain Service
 * Manages courses, alias mappings, and curriculum query operations
 */

import { Course, CurriculumModule } from "@/lib/cms/types";
import { SheetsClient } from "@/lib/cms/sheets-client";
import { seedCurriculum } from "@/data/seed-data";

export class CourseService {
  /**
   * Slug alias mapping dictionary
   */
  private static readonly SLUG_ALIASES: Record<string, string> = {
    "analytical-thinking-dashboard-design": "data-analytical-thinking",
    "analytics-thinking": "data-analytical-thinking",
    "combo-end-to-end-analytics": "end-to-end-analytics",
    "end-to-end-analytics-sql-dashboard": "end-to-end-analytics",
  };

  /**
   * Fetch all active courses for public display
   */
  public static async getCourses(): Promise<Course[]> {
    const report = await SheetsClient.getLiveSyncReport();
    return report.courses.filter((c) => c.isActive);
  }

  /**
   * Fetch single course by SEO slug (supports aliases and course ID fallback)
   */
  public static async getCourseBySlug(slug: string): Promise<Course | null> {
    const courses = await this.getCourses();
    const normalized = slug.trim().toLowerCase();
    const targetKey = this.SLUG_ALIASES[normalized] || normalized;

    // First try exact match on target key (either slug or id)
    let course = courses.find(
      (c) =>
        c.slug.toLowerCase() === targetKey ||
        c.id.toLowerCase() === targetKey ||
        c.slug.toLowerCase() === normalized ||
        c.id.toLowerCase() === normalized
    );

    if (!course) {
      // Secondary check for inverse alias mapping
      for (const [alias, realId] of Object.entries(this.SLUG_ALIASES)) {
        if (realId === normalized) {
          course = courses.find((c) => c.slug.toLowerCase() === alias || c.id.toLowerCase() === alias);
          if (course) break;
        }
      }
    }

    return course || null;
  }

  /**
   * Fetch curriculum modules for a specific course
   * Accepts both primary identifier (id) and secondary identifier (slug)
   * Resolves aliases and fallbacks seamlessly without modifying Google Sheets
   * For the combo course `end-to-end-analytics`, automatically combines SQL and Dashboard journeys.
   */
  public static async getCurriculumByCourseId(
    courseId: string,
    secondaryIdentifier?: string
  ): Promise<CurriculumModule[]> {
    const report = await SheetsClient.getLiveSyncReport();
    const liveModules = report.curriculum || [];
    const normalized = courseId.trim().toLowerCase();
    const targetKey = this.SLUG_ALIASES[normalized] || normalized;

    const normalizedSec = secondaryIdentifier ? secondaryIdentifier.trim().toLowerCase() : undefined;
    const secTargetKey = normalizedSec ? (this.SLUG_ALIASES[normalizedSec] || normalizedSec) : undefined;

    const validKeys = new Set(
      [targetKey, normalized, secTargetKey, normalizedSec].filter((k): k is string => Boolean(k))
    );

    // Check if querying the End-to-End Combo course
    if (validKeys.has("end-to-end-analytics")) {
      const existingCombo = liveModules.filter(
        (m) => validKeys.has(m.courseId.toLowerCase())
      );

      // If combo already has full 10+ modules, return directly
      if (existingCombo.length >= 10) {
        return existingCombo.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
      }

      // Otherwise, synthesize complete journey: SQL modules (Part 1) + Dashboard modules (Part 2)
      let sqlModules = liveModules.filter(
        (m) => m.courseId.toLowerCase() === "sql-for-data-analytics"
      );
      if (sqlModules.length === 0) {
        sqlModules = seedCurriculum.filter(
          (m) => m.courseId.toLowerCase() === "sql-for-data-analytics"
        );
      }
      sqlModules.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

      let thinkModules = liveModules.filter(
        (m) =>
          m.courseId.toLowerCase() === "data-analytical-thinking" ||
          m.courseId.toLowerCase() === "analytical-thinking-dashboard-design"
      );
      if (thinkModules.length === 0) {
        thinkModules = seedCurriculum.filter(
          (m) =>
            m.courseId.toLowerCase() === "data-analytical-thinking" ||
            m.courseId.toLowerCase() === "analytical-thinking-dashboard-design"
        );
      }
      thinkModules.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

      let sessionCounter = 1;
      const merged: CurriculumModule[] = [];

      for (const sql of sqlModules) {
        merged.push({
          ...sql,
          id: `combo-sql-${sessionCounter}`,
          courseId: "end-to-end-analytics",
          courseName: "End-to-End Analytics with SQL & Dashboard",
          moduleNumber: sessionCounter,
          sortOrder: sessionCounter,
          title: `[Phần 1: SQL] ${sql.title.replace(/^Buổi\s*\d+:\s*/i, "")}`,
        });
        sessionCounter++;
      }

      for (const think of thinkModules) {
        merged.push({
          ...think,
          id: `combo-think-${sessionCounter}`,
          courseId: "end-to-end-analytics",
          courseName: "End-to-End Analytics with SQL & Dashboard",
          moduleNumber: sessionCounter,
          sortOrder: sessionCounter,
          title: `[Phần 2: Tư Duy & Dashboard] ${think.title.replace(/^Buổi\s*\d+:\s*/i, "")}`,
        });
        sessionCounter++;
      }

      return merged;
    }

    // Standard single course modules lookup
    let matchedModules = liveModules
      .filter((m) => validKeys.has(m.courseId.toLowerCase()))
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

    // Robust Fallback: If 0 modules in live report, look up from authoritative seedCurriculum
    if (matchedModules.length === 0) {
      matchedModules = seedCurriculum
        .filter((m) => validKeys.has(m.courseId.toLowerCase()))
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    }

    return matchedModules;
  }

  /**
   * Fetch all curriculum modules
   */
  public static async getAllCurriculum(): Promise<CurriculumModule[]> {
    const report = await SheetsClient.getLiveSyncReport();
    return report.curriculum || [];
  }

  /**
   * Get all active slugs including aliases for static pre-rendering (generateStaticParams)
   */
  public static async getAllActiveSlugs(): Promise<string[]> {
    const courses = await this.getCourses();
    const slugSet = new Set<string>();

    for (const c of courses) {
      if (c.slug) slugSet.add(c.slug.toLowerCase());
      if (c.id) slugSet.add(c.id.toLowerCase());
    }

    // Ensure PRD M02 required routes are strictly included
    slugSet.add("sql-for-data-analytics");
    slugSet.add("analytical-thinking-dashboard-design");
    slugSet.add("data-analytical-thinking");
    slugSet.add("end-to-end-analytics");

    return Array.from(slugSet);
  }
}
