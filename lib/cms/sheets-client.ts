/**
 * Google Sheets Live Sync Client & Raw Data Mappers
 * Connects to Google Apps Script Web App (12 Tab CMS),
 * maps raw rows into typed domain entities, and serves
 * Fallback Snapshot on connectivity failure (Zero White Screen).
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
import {
  seedCourses,
  seedCurriculum,
  seedPackages,
  seedStudentProjects,
  seedMentor,
  seedTestimonials,
  seedFaqs,
  seedTrustMetrics,
  seedSettings,
  seedBlogPosts,
  seedPromotions,
} from "@/data/seed-data";
import { LRUCacheManager } from "./cache";

export interface GoogleSheetsSyncReport {
  ok: boolean;
  source: "google_sheets_live" | "fallback_snapshot" | "mock";
  latencyMs: number;
  fetchedAt: string;
  totalCourses: number;
  activeCourses: number;
  archivedCourses: number;
  totalCurriculumModules: number;
  totalPromotions?: number;
  totalPackages?: number;
  totalStudentProjects?: number;
  totalTestimonials?: number;
  totalFaqs?: number;
  totalBlogPosts?: number;
  courses: Course[];
  curriculum?: CurriculumModule[];
  packages?: PackagePricing[];
  studentProjects?: StudentProject[];
  testimonials?: Testimonial[];
  mentors?: Mentor[];
  faqs?: FAQ[];
  trustMetrics?: TrustMetric[];
  settings?: SystemSettings;
  blogPosts?: BlogPost[];
  promotions?: Promotion[];
  rawCourses: Record<string, unknown>[];
  rawCurriculum: Record<string, unknown>[];
  rawPromotions?: Record<string, unknown>[];
  rawStudentProjects?: Record<string, unknown>[];
  rawTabs?: Record<string, unknown[]>;
  message: string;
}

export class SheetsClient {
  private static readonly CACHE_KEY = "cms:sheets:sync_report";

  /**
   * Helper: Parse multiline text (Alt+Enter in Google Sheets) into clean bullet points
   */
  public static parseMultilineText(rawText: unknown): string[] {
    if (typeof rawText !== "string" || !rawText.trim()) {
      return [];
    }

    return rawText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => line.replace(/^[-*•]\s*/, ""));
  }

  /**
   * Fetch Live Data from Google Sheets or serve Fallback Snapshot
   */
  public static async getLiveSyncReport(forceRefresh = false): Promise<GoogleSheetsSyncReport> {
    if (!forceRefresh) {
      const cached = LRUCacheManager.get<GoogleSheetsSyncReport>(this.CACHE_KEY);
      if (cached) return cached;
    }

    const appsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
    const secret = process.env.GOOGLE_APPS_SCRIPT_SECRET || "";
    const startTime = Date.now();

    // 1. If no URL configured, return typed mock report from seed
    if (!appsScriptUrl) {
      return this.buildFallbackReport(0, "Chưa cấu hình GOOGLE_APPS_SCRIPT_URL, đang hiển thị dữ liệu mẫu cục bộ.", "mock");
    }

    // 2. Fetch live data from Apps Script Web App
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const requestUrl = `${appsScriptUrl}?action=get_all&secret=${encodeURIComponent(secret)}`;
      const res = await fetch(requestUrl, {
        method: "GET",
        signal: controller.signal,
        redirect: "follow",
      });

      clearTimeout(timeoutId);
      const latencyMs = Date.now() - startTime;

      if (!res.ok) {
        throw new Error(`Google Apps Script trả về HTTP status ${res.status}`);
      }

      const json = await res.json();

      if (json && json.ok && json.tabs) {
        const report = this.parseRawTabs(json.tabs, latencyMs);
        LRUCacheManager.set(this.CACHE_KEY, report);
        return report;
      }

      throw new Error(json.error?.message || "Cấu trúc phản hồi từ Google Sheets không hợp lệ.");
    } catch (err: unknown) {
      const latencyMs = Date.now() - startTime;
      console.warn("[SheetsClient] Lỗi kết nối Google Sheets, phục vụ Fallback Snapshot:", (err as Error)?.message);

      const report = this.buildFallbackReport(
        latencyMs,
        `Không thể kết nối Google Sheets: ${(err as Error)?.message}. Đang hiển thị bản dự phòng cục bộ (Zero White Screen).`,
        "fallback_snapshot"
      );

      LRUCacheManager.set(this.CACHE_KEY, report, 30 * 1000); // 30s TTL on error
      return report;
    }
  }

  /**
   * Parse 12 raw tabs from Google Sheets response into typed domain entities
   */
  private static parseRawTabs(tabs: Record<string, unknown>, latencyMs: number): GoogleSheetsSyncReport {
    const rawCourses = (tabs.courses as Record<string, unknown>[]) || [];
    const rawCurriculum = (tabs.curriculum as Record<string, unknown>[]) || [];
    const rawPromotions = (tabs.promotions as Record<string, unknown>[]) || [];
    const rawPackages = (tabs.packages_pricing as Record<string, unknown>[]) || [];
    const rawStudentProjects = (tabs.student_projects as Record<string, unknown>[]) || [];
    const rawTestimonials = (tabs.testimonials as Record<string, unknown>[]) || [];
    const rawMentors = (tabs.mentor_profiles as Record<string, unknown>[]) || [];
    const rawFaqs = (tabs.faqs as Record<string, unknown>[]) || [];
    const rawTrust = (tabs.trust_metrics as Record<string, unknown>[]) || [];
    const rawSettings = (tabs.settings as Record<string, unknown>[]) || [];
    const rawBlogs = (tabs.blog_posts as Record<string, unknown>[]) || [];

    // Parse Courses
    const parsedCourses: Course[] = rawCourses.map((row, idx) => {
      const id = String(row.id || row.course_id || `course-${idx + 1}`);
      const title = String(row.title || row.name || `Khóa học ${idx + 1}`);
      const slug = String(row.slug || id);
      const tag = String(row.tag || "Data Analytics");
      const tagline = String(row.tagline || "");
      const description = String(row.description || "");
      const tuitionVnd = Number(row.tuition_vnd || row.price_discounted || row.price || 3800000);
      const originalTuitionVnd = Number(row.original_tuition_vnd || row.price_original || 4500000);
      const duration = String(row.duration || "8 tuần");
      const level = (String(row.level || "Beginner") as Course["level"]);
      const coverImageUrl = String(row.cover_image_url || row.thumbnail || "/images/courses/default-cover.webp");
      const isActive = row.is_active === true || String(row.is_active).toUpperCase() === "TRUE";
      const isFeatured = row.is_featured === true || String(row.is_featured).toUpperCase() === "TRUE";
      const sortOrder = Number(row.sort_order || idx + 1);

      // Find matching curriculum modules
      const courseCurriculum: CurriculumModule[] = rawCurriculum
        .filter((m) => String(m.course_id || "").toLowerCase() === id.toLowerCase())
        .map((m, mIdx) => {
          const modId = String(m.id || `${id}-mod-${mIdx + 1}`);
          const modNum = Number(m.module_number || mIdx + 1);
          const modTitle = String(m.module_title || m.title || `Buổi ${modNum}`);
          const courseName = String(m.course_name || title);
          const modDuration = String(m.duration || "2 tuần");
          const lessonsCount = Number(m.lessons_count || 6);
          const topicsRaw = m.topics_bullets || m.bullets || m.content || "";
          const modSort = Number(m.sort_order || modNum);

          return {
            id: modId,
            courseId: id,
            courseName,
            moduleNumber: modNum,
            title: modTitle,
            summary: String(m.summary || ""),
            bulletPoints: this.parseMultilineText(topicsRaw),
            durationHours: Number(m.duration_hours || lessonsCount * 2 || 2),
            duration: modDuration,
            lessonsCount,
            sortOrder: modSort,
          };
        });

      return {
        id,
        title,
        slug,
        tag,
        tagline,
        description,
        tuitionVnd,
        originalTuitionVnd,
        duration,
        level,
        coverImageUrl,
        isActive,
        isFeatured,
        sortOrder,
        curriculumModules: courseCurriculum,
      };
    });

    // Parse Promotions
    const parsedPromotions: Promotion[] = rawPromotions.map((p, idx) => ({
      id: String(p.id || `promo-${idx + 1}`),
      code: String(p.code || "").toUpperCase(),
      title: String(p.title || ""),
      discountType: (String(p.discount_type).toUpperCase() === "FIXED_VND" ? "FIXED_VND" : "PERCENT") as Promotion["discountType"],
      discountValue: Number(p.discount_value || 0),
      startDate: String(p.start_date || ""),
      endDate: String(p.end_date || ""),
      applicableCourses: String(p.applicable_courses || "ALL"),
      badge: p.badge ? String(p.badge) : undefined,
      isActive: p.is_active === true || String(p.is_active).toUpperCase() === "TRUE",
      sortOrder: Number(p.sort_order || idx + 1),
    }));

    // Parse Packages Pricing
    const parsedPackages: PackagePricing[] = rawPackages.map((pkg, idx) => ({
      id: String(pkg.id || `pkg-${idx + 1}`),
      packageId: String(pkg.package_id || pkg.id || `pkg-${idx + 1}`),
      name: String(pkg.name || "Gói Combo"),
      originalPrice: Number(pkg.original_price || 0),
      salePrice: Number(pkg.sale_price || 0),
      badge: pkg.badge ? String(pkg.badge) : undefined,
      featuresList: this.parseMultilineText(pkg.features_list || ""),
      isPopular: pkg.is_popular === true || String(pkg.is_popular).toUpperCase() === "TRUE",
      isActive: pkg.is_active === true || String(pkg.is_active).toUpperCase() === "TRUE",
      sortOrder: Number(pkg.sort_order || idx + 1),
    }));

    // Parse Student Projects
    const parsedStudentProjects: StudentProject[] = rawStudentProjects.map((p, idx) => {
      const id = String(p.project_id || p.id || `project-${idx + 1}`);
      const toolsRaw = String(p.tools || "");
      return {
        id,
        projectId: id,
        title: String(p.title || `Dự án học viên ${idx + 1}`),
        category: String(p.category || "Data Analytics"),
        authorName: String(p.author_name || p.author || "Học viên DataWithLy"),
        tools: toolsRaw ? toolsRaw.split(",").map((t) => t.trim()).filter(Boolean) : [],
        toolsRaw,
        metrics: String(p.metrics || ""),
        imageUrl: String(p.image_url || p.cover_image || "/uploads/projects/default.jpg"),
        sortOrder: Number(p.sort_order || idx + 1),
        isActive: p.is_active === true || String(p.is_active).toUpperCase() === "TRUE",
        demoUrl: p.demo_url ? String(p.demo_url) : undefined,
      };
    });

    // Parse Testimonials
    const parsedTestimonials: Testimonial[] = rawTestimonials.map((t, idx) => ({
      id: String(t.id || `t-${idx + 1}`),
      studentName: String(t.student_name || t.name || `Học viên ${idx + 1}`),
      studentRole: String(t.role || t.student_role || "Học viên"),
      role: String(t.role || t.student_role || "Học viên"),
      company: String(t.company || ""),
      courseId: String(t.course_id || "ALL"),
      rating: Number(t.rating || 5),
      comment: String(t.review_text || t.comment || ""),
      reviewText: String(t.review_text || t.comment || ""),
      avatarUrl: String(t.avatar_url || "/uploads/avatars/default.jpg"),
      isFeatured: t.is_featured === true || String(t.is_featured).toUpperCase() === "TRUE",
      isActive: t.is_active === true || String(t.is_active).toUpperCase() === "TRUE",
    }));

    // Parse Mentors
    const parsedMentors: Mentor[] = rawMentors.map((m, idx) => {
      const rawCompanies = String(m.companies_worked || m.companies || "MoMo, Tiki, ACB Bank");
      const role = String(m.title || m.role || "Lead Mentor");
      return {
        id: String(m.id || `mentor-${idx + 1}`),
        name: String(m.name || "Hứa Thảo Ly"),
        role,
        title: role,
        bio: String(m.bio || ""),
        avatarUrl: String(m.avatar_url || "/uploads/mentors/ly-hua.jpg"),
        companies: rawCompanies.split(",").map((c) => c.trim()).filter(Boolean),
        companiesWorked: rawCompanies,
        linkedinUrl: m.linkedin_url ? String(m.linkedin_url) : undefined,
        experienceYears: 7,
        isActive: m.is_active === true || String(m.is_active).toUpperCase() === "TRUE",
      };
    });

    // Parse FAQs
    const parsedFaqs: FAQ[] = rawFaqs.map((f, idx) => ({
      id: String(f.id || `faq-${idx + 1}`),
      category: String(f.category || "CHUNG"),
      question: String(f.question || ""),
      answer: String(f.answer || ""),
      isActive: f.is_active === true || String(f.is_active).toUpperCase() === "TRUE",
      sortOrder: Number(f.sort_order || idx + 1),
    }));

    // Parse Trust Metrics
    const parsedTrustMetrics: TrustMetric[] = rawTrust.map((tm, idx) => ({
      metricKey: String(tm.metric_key || `metric_${idx + 1}`),
      numberDisplay: String(tm.number_display || "0"),
      label: String(tm.label || ""),
      iconName: String(tm.icon_name || "Star"),
      isActive: tm.is_active === true || String(tm.is_active).toUpperCase() === "TRUE",
      sortOrder: Number(tm.sort_order || idx + 1),
    }));

    // Parse Settings
    const settingsMap: Record<string, string> = {};
    rawSettings.forEach((item) => {
      if (item.key) {
        settingsMap[String(item.key)] = String(item.value || "");
      }
    });

    const parsedSettings: SystemSettings = {
      hotline: settingsMap.hotline || "0934 938 431",
      zaloUrl: settingsMap.zalo_url || "https://zalo.me/0934938431",
      contactEmail: settingsMap.contact_email || "vietds@gmail.com",
      announcementBar: settingsMap.announcement_bar || "",
      revalidationUrl: settingsMap.revalidation_url || "",
      raw: settingsMap,
    };

    // Parse Blogs
    const parsedBlogPosts: BlogPost[] = rawBlogs.map((b, idx) => ({
      id: String(b.id || `blg-${idx + 1}`),
      title: String(b.title || ""),
      slug: String(b.slug || b.id || `blg-${idx + 1}`),
      category: String(b.category || "Sự nghiệp"),
      excerpt: String(b.excerpt || ""),
      contentMarkdown: b.content_markdown
        ? String(b.content_markdown)
        : b.contentMarkdown
        ? String(b.contentMarkdown)
        : undefined,
      authorName: String(b.author_name || b.authorName || "Hứa Thảo Ly"),
      publishedAt: String(b.published_at || b.publishedAt || new Date().toISOString().split("T")[0]),
      coverImageUrl: b.cover_image_url
        ? String(b.cover_image_url)
        : b.coverImageUrl
        ? String(b.coverImageUrl)
        : undefined,
      readTimeMinutes: Number(b.read_time_minutes || b.readTimeMinutes || 5),
      isActive: b.is_active === true || String(b.is_active).toUpperCase() === "TRUE",
    }));

    const activeCount = parsedCourses.filter((c) => c.isActive).length;
    const archivedCount = parsedCourses.filter((c) => !c.isActive).length;

    return {
      ok: true,
      source: "google_sheets_live",
      latencyMs,
      fetchedAt: new Date().toISOString(),
      totalCourses: parsedCourses.length,
      activeCourses: activeCount,
      archivedCourses: archivedCount,
      totalCurriculumModules: rawCurriculum.length,
      totalPromotions: parsedPromotions.length,
      totalPackages: parsedPackages.length,
      totalStudentProjects: parsedStudentProjects.length,
      totalTestimonials: parsedTestimonials.length,
      totalFaqs: parsedFaqs.length,
      totalBlogPosts: parsedBlogPosts.length,
      courses: parsedCourses,
      curriculum: parsedCourses.flatMap((c) => c.curriculumModules || []),
      promotions: parsedPromotions,
      packages: parsedPackages,
      studentProjects: parsedStudentProjects,
      testimonials: parsedTestimonials,
      mentors: parsedMentors,
      faqs: parsedFaqs,
      trustMetrics: parsedTrustMetrics,
      settings: parsedSettings,
      blogPosts: parsedBlogPosts,
      rawCourses,
      rawCurriculum,
      rawPromotions,
      rawStudentProjects,
      rawTabs: tabs as Record<string, unknown[]>,
      message: "Đồng bộ thành công đầy đủ 12 tab dữ liệu thời gian thực từ Google Sheets.",
    };
  }

  /**
   * Build complete fallback snapshot conforming to Figma authoritative seed
   */
  private static buildFallbackReport(
    latencyMs: number,
    message: string,
    source: "mock" | "fallback_snapshot"
  ): GoogleSheetsSyncReport {
    return {
      ok: source === "mock",
      source,
      latencyMs,
      fetchedAt: new Date().toISOString(),
      totalCourses: seedCourses.length,
      activeCourses: seedCourses.filter((c) => c.isActive).length,
      archivedCourses: seedCourses.filter((c) => !c.isActive).length,
      totalCurriculumModules: seedCurriculum.length,
      totalPromotions: seedPromotions.length,
      totalPackages: seedPackages.length,
      totalStudentProjects: seedStudentProjects.length,
      totalTestimonials: seedTestimonials.length,
      totalFaqs: seedFaqs.length,
      totalBlogPosts: seedBlogPosts.length,
      courses: seedCourses,
      curriculum: seedCurriculum,
      promotions: seedPromotions,
      packages: seedPackages,
      studentProjects: seedStudentProjects,
      testimonials: seedTestimonials,
      mentors: [seedMentor],
      faqs: seedFaqs,
      trustMetrics: seedTrustMetrics,
      settings: seedSettings,
      blogPosts: seedBlogPosts,
      rawCourses: seedCourses.map((c) => ({ ...c })),
      rawCurriculum: seedCurriculum.map((m) => ({ ...m })),
      rawPromotions: seedPromotions.map((p) => ({ ...p })),
      rawStudentProjects: seedStudentProjects.map((p) => ({ ...p })),
      message,
    };
  }
}

