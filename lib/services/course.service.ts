/**
 * Course Domain Service
 * Manages courses, alias mappings, and curriculum query operations
 */

import { Course, CurriculumModule } from "@/lib/cms/types";
import { SheetsClient } from "@/lib/cms/sheets-client";

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
   * For the combo course `end-to-end-analytics`, if dedicated modules are insufficient (< 10),
   * automatically merges the complete curriculum of both SQL and Dashboard courses.
   */
  public static async getCurriculumByCourseId(courseId: string): Promise<CurriculumModule[]> {
    const report = await SheetsClient.getLiveSyncReport();
    const allModules = report.curriculum || [];
    const normalized = courseId.trim().toLowerCase();
    const targetKey = this.SLUG_ALIASES[normalized] || normalized;

    // Check if querying the End-to-End Combo course
    if (targetKey === "end-to-end-analytics") {
      const existingCombo = allModules.filter(
        (m) => m.courseId.toLowerCase() === "end-to-end-analytics"
      );

      // If combo already has full 20+ modules, return directly
      if (existingCombo.length >= 10) {
        return existingCombo.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
      }

      // Otherwise, synthesize complete journey: SQL modules (Part 1) + Dashboard modules (Part 2)
      const sqlModules = allModules
        .filter((m) => m.courseId.toLowerCase() === "sql-for-data-analytics")
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

      const thinkModules = allModules
        .filter((m) => m.courseId.toLowerCase() === "data-analytical-thinking")
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

      let sessionCounter = 1;
      const merged: CurriculumModule[] = [];

      for (const sql of sqlModules) {
        merged.push({
          ...sql,
          id: `combo-sql-${sql.moduleNumber}`,
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
          id: `combo-think-${think.moduleNumber}`,
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
    return allModules
      .filter((m) => m.courseId.toLowerCase() === targetKey || m.courseId.toLowerCase() === normalized)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
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
