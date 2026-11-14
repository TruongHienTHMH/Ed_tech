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
import { resolveImageUrl } from "@/lib/constants/image-fallbacks";

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

    const appsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_CMS_URL || process.env.GOOGLE_APPS_SCRIPT_URL;
    const secret = process.env.GOOGLE_APPS_SCRIPT_CMS_SECRET || process.env.GOOGLE_APPS_SCRIPT_SECRET || "";
    const startTime = Date.now();

    // 1. If no URL configured, return typed mock report from seed
    if (!appsScriptUrl) {
      return this.buildFallbackReport(0, "Chưa cấu hình GOOGLE_APPS_SCRIPT_CMS_URL (hoặc GOOGLE_APPS_SCRIPT_URL), đang hiển thị dữ liệu mẫu cục bộ.", "mock");
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
        next: {
          tags: ["cms", "sheets"],
          revalidate: 300,
        },
      });

      clearTimeout(timeoutId);
      const latencyMs = Date.now() - startTime;

      if (!res.ok) {
        throw new Error(`Google Apps Script trả về HTTP status ${res.status}`);
      }

      const json = await res.json();

      if (json && json.ok && json.tabs) {
        const report = this.parseRawTabs(json.tabs, latencyMs);
        const ttlMs = process.env.NODE_ENV === "development" ? 5 * 1000 : undefined;
        LRUCacheManager.set(this.CACHE_KEY, report, ttlMs);
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

      const errorTtlMs = process.env.NODE_ENV === "development" ? 5 * 1000 : 30 * 1000;
      LRUCacheManager.set(this.CACHE_KEY, report, errorTtlMs);
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
    const rawBlogs =
      (tabs.blog_posts as Record<string, unknown>[]) ||
      (tabs.blogs as Record<string, unknown>[]) ||
      (tabs.blog as Record<string, unknown>[]) ||
      (tabs.posts as Record<string, unknown>[]) ||
      [];

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
      const rawCover = (row.cover_image_url || row.cover_image || row.image_url || row.thumbnail || row["ảnh_bìa"] || row["anh_bia"]) as string | undefined;
      const coverImageUrl = resolveImageUrl(rawCover, "course", slug || id);
      const isActive = row.is_active === true || String(row.is_active).toUpperCase() === "TRUE";
      const isFeatured = row.is_featured === true || String(row.is_featured).toUpperCase() === "TRUE";
      const sortOrder = Number(row.sort_order || idx + 1);

      // Parse course_kind from Google Sheets with intelligent semantic fallback
      const rawKind = row.course_kind || row.kind || row.course_type || row.type || row.badge || row.huy_hieu;
      const courseKind = rawKind
        ? String(rawKind).trim()
        : (slug === "end-to-end-analytics" || id === "end-to-end-analytics"
          ? "Khóa học nổi bật"
          : slug === "sql-for-data-analytics"
            ? "Khóa học nền tảng"
            : "Khóa học chuyên sâu");

      // Find matching curriculum modules directly from Google Sheets
      const courseCurriculum: CurriculumModule[] = rawCurriculum
        .filter((m) => {
          const rawCId = String(m.course_id || m.courseId || m.course_slug || m.slug || "").trim().toLowerCase();
          return rawCId === id.toLowerCase() || rawCId === slug.toLowerCase();
        })
        .map((m, mIdx) => {
          const modId = String(m.id || `${id}-d${mIdx + 1}`);

          // 1. Buổi học (Day / Session Number)
          let day = Number(m.day || m.module_number || m.buoi);
          if (isNaN(day) || day <= 0) {
            day = mIdx + 1;
          }

          // 2. Tuần học (Week)
          const weekVal = m.week || m.tuan || m.week_number;
          let weekNumber = Number(weekVal);
          if (isNaN(weekNumber) || weekNumber <= 0) {
            weekNumber = Math.ceil(day / 2);
          }
          const weekLabel = typeof weekVal === "string" && isNaN(Number(weekVal))
            ? weekVal
            : `Tuần ${weekNumber}`;

          // 3. Ngày của buổi học (Date - ví dụ: TH10 03 hoặc 03/10)
          const date = String(m.date || m.session_date || m.ngay || m.session_date_badge || `TH10 0${day}`).trim();

          // 4. Nội dung của từng buổi (Session Title)
          let sessionTitle = String(m.session_title || m.noi_dung || m.week_title || m.module_title || m.title || "").trim();
          if (!sessionTitle || sessionTitle === String(day)) {
            sessionTitle = `Buổi ${day}: Nền tảng & Thực hành chuyên sâu`;
          }

          // 5. Miêu tả nội dung buổi học (Session Description / Content)
          const sessionDesc = String(m.session_desc || m.mieu_ta || m.content || m.summary || sessionTitle).trim();

          // 6. Sub Content (Chi tiết buổi học - dot list khi bấm dropdown)
          const rawSubContent = m.sub_content || m.subcontent || m.chi_tiet || m.topics_bullets || m.bullets || "";
          let subContent = this.parseMultilineText(rawSubContent);
          if (!subContent || subContent.length === 0) {
            subContent = [
              "Nắm vững tư duy và kiến thức nền tảng thực chiến",
              "Thực hành giải quyết bài toán kinh doanh thực tế",
              "Ứng dụng công cụ chuyên sâu theo quy chuẩn doanh nghiệp",
            ];
          }

          // 7. Thời lượng & Thứ tự
          const duration = String(m.duration || "3 giờ").trim();
          const durationHours = parseFloat(duration) || 3;
          const sortOrder = Number(m.sort_order || day);
          const courseName = String(m.course_name || title);

          const startDate = m.start_date ? String(m.start_date).trim() : undefined;
          const endDate = m.end_date ? String(m.end_date).trim() : undefined;

          return {
            id: modId,
            courseId: id,
            courseName,
            week: weekNumber,
            day,
            date,
            sessionTitle,
            sessionDesc,
            subContent,
            duration,
            sortOrder,
            startDate,
            endDate,
            // Tương thích ngược:
            moduleNumber: day,
            title: sessionTitle,
            summary: sessionDesc,
            bulletPoints: subContent,
            durationHours,
            lessonsCount: subContent.length,
            weekNumber,
            weekLabel,
            sessionDateBadge: date,
            isMilestone: day % 4 === 0,
            milestoneBadge: day % 4 === 0 ? "Thực hành" : undefined,
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
        courseKind,
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
        imageUrl: resolveImageUrl(
          (p.image_url || p.cover_image || p.image || p.thumbnail || p["ảnh_dự_án"] || p["anh_du_an"]) as string | undefined,
          "project",
          idx
        ),
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
      avatarUrl: resolveImageUrl(
        (t.avatar_url || t.avatar || t.photo_url || t.image || t["avatar"] || t["ảnh_đại_diện"] || t["anh_dai_dien"]) as string | undefined,
        "avatar",
        idx
      ),
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
        avatarUrl: resolveImageUrl(
          (m.avatar_url || m.avatar || m.photo_url || m.image || m["ảnh_chân_dung"] || m["anh_chan_dung"]) as string | undefined,
          "mentor",
          "hua-thao-ly"
        ),
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
      excerpt: String(b.excerpt || b.description || ""),
      description: b.description ? String(b.description) : (b.excerpt ? String(b.excerpt) : undefined),
      contentMarkdown: b.content_markdown
        ? String(b.content_markdown)
        : b.contentMarkdown
          ? String(b.contentMarkdown)
          : undefined,
      authorName: String(b.author_name || b.authorName || "Hứa Thảo Ly"),
      publishedAt: String(b.published_at || b.publishedAt || new Date().toISOString().split("T")[0]),
      coverImageUrl: resolveImageUrl(
        (b.cover_image_url || b.cover_image || b.thumbnail || b.image_url || b.coverImageUrl) as string | undefined,
        "blog",
        String(b.slug || b.id || idx)
      ),
      readTimeMinutes: Number(b.read_time_minutes || b.readTimeMinutes || 5),
      isActive:
        b.is_active === undefined
          ? true
          : b.is_active === true ||
          String(b.is_active).toUpperCase() === "TRUE" ||
          b.is_active === "1" ||
          b.is_active === 1,
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

