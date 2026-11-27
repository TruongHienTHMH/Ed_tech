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
   * ⚡ Single-Flight Pattern: Giữ Promise đang thực thi trên đường truyền.
   * Khi nhiều component/service gọi getLiveSyncReport() đồng thời (ví dụ Promise.all ở trang chủ),
   * tất cả sẽ dùng chung 1 kết nối HTTP duy nhất, triệt tiêu 100% việc gọi trùng lặp lên Google Apps Script.
   */
  private static inFlightPromise: Promise<GoogleSheetsSyncReport> | null = null;

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
    const isDev = process.env.NODE_ENV === "development";

    // 0. Bỏ qua hoàn toàn in-memory cache nếu đang ở local dev hoặc forceRefresh
    if (!forceRefresh && !isDev) {
      const cached = LRUCacheManager.get<GoogleSheetsSyncReport>(this.CACHE_KEY);
      if (cached) return cached;
    }

    // 1. Tái sử dụng request đang chạy trên đường truyền nếu có
    if (this.inFlightPromise) {
      return this.inFlightPromise;
    }

    // 2. Khởi tạo Promise thực thi mạng duy nhất
    this.inFlightPromise = this.fetchFromAppsScript(forceRefresh, isDev).finally(() => {
      this.inFlightPromise = null;
    });

    return this.inFlightPromise;
  }

  /**
   * Thực hiện gọi HTTP tới Google Apps Script Web App và bóc tách dữ liệu
   */
  private static async fetchFromAppsScript(
    forceRefresh: boolean,
    isDev: boolean
  ): Promise<GoogleSheetsSyncReport> {
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
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      // Khi ở môi trường dev hoặc có cờ forceRefresh, gửi force_refresh=true để Apps Script quét bảng tính trực tiếp không qua CacheService
      const shouldBypass = forceRefresh || isDev;
      const requestUrl = `${appsScriptUrl}?action=get_all&secret=${encodeURIComponent(secret)}${shouldBypass ? "&force_refresh=true" : ""}`;

      const res = await fetch(requestUrl, {
        method: "GET",
        signal: controller.signal,
        redirect: "follow",
        ...(shouldBypass
          ? { cache: "no-store" }
          : { next: { tags: ["cms", "sheets"], revalidate: 300 } }),
      });

      clearTimeout(timeoutId);
      const latencyMs = Date.now() - startTime;

      if (!res.ok) {
        throw new Error(`Google Apps Script trả về HTTP status ${res.status}`);
      }

      const json = await res.json();

      if (json && json.ok && json.tabs) {
        const report = this.parseRawTabs(json.tabs, latencyMs);
        // Event-Driven Cache: Giữ dữ liệu trong RAM (24h), chỉ bị xóa khi Webhook /api/revalidate từ Google Sheets gọi sang
        const cacheTtlMs = 24 * 60 * 60 * 1000;
        LRUCacheManager.set(this.CACHE_KEY, report, cacheTtlMs);

        // Debug tay ở môi trường local: console.log dữ liệu nhận được với tiền tố "Script update new"
        console.log("Script update new:", {
          fetchedAt: json.fetchedAt || new Date().toISOString(),
          fromCache: Boolean(json.fromCache),
          latencyMs,
          summary: {
            courses: report.courses.length,
            packages: report.packages?.length || 0,
            projects: report.studentProjects?.length || 0,
            blogs: report.blogPosts?.length || 0,
            testimonials: report.testimonials?.length || 0,
            faqs: report.faqs?.length || 0,
          },
          data: json.tabs,
        });

        if (process.env.NODE_ENV === "development") {
          console.info(
            `[SheetsClient] ✅ Đã nạp Google Sheets CMS (${latencyMs}ms${json.fromCache ? ", fromCache" : ""}): ` +
            `${report.courses.length} khóa học, ${report.packages?.length || 0} gói, ${report.studentProjects?.length || 0} dự án, ${report.blogPosts?.length || 0} bài viết`
          );
        }
        return report;
      }

      throw new Error(json.error?.message || "Cấu trúc phản hồi từ Google Sheets không hợp lệ.");
    } catch (err: unknown) {
      const latencyMs = Date.now() - startTime;
      const errorObj = err as Record<string, unknown>;
      const cause = errorObj?.cause as Record<string, unknown> | undefined;
      const causeCode = (cause?.code as string) || "";
      const causeMessage = (cause?.message as string) || "";

      let diagnosticDetail = (errorObj?.message as string) || "Lỗi fetch không xác định";
      if (causeCode) {
        diagnosticDetail += ` [Nguyên nhân: ${causeCode}${causeMessage ? " - " + causeMessage : ""}]`;
      }
      if (latencyMs >= 14500) {
        diagnosticDetail += " (Quá hạn 15s - Có thể Google Apps Script đang gặp Cold Start)";
      }

      console.warn(`[SheetsClient] ⚠️ Không thể kết nối Google Sheets sau ${latencyMs}ms:`, {
        url: appsScriptUrl ? `${appsScriptUrl.substring(0, 60)}...` : "Chưa cấu hình URL",
        error: errorObj?.message,
        causeCode: causeCode || undefined,
        causeMessage: causeMessage || undefined,
        diagnostic: diagnosticDetail,
      });

      const report = this.buildFallbackReport(
        latencyMs,
        `Không thể kết nối Google Sheets: ${diagnosticDetail}. Đang phục vụ dữ liệu dự phòng cục bộ (Zero White Screen).`,
        "fallback_snapshot"
      );

      // Khi gặp sự cố mạng, giữ dữ liệu fallback 60 giây để tránh nghẽn mạng retry dồn dập
      const errorTtlMs = 60 * 1000;
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

      // Parse total_sessions với fallback thông minh
      const rawTotal = row.total_sessions || row.totalsessions || row.so_buoi_hoc || row.so_buoi;
      let totalSessions = rawTotal ? Number(rawTotal) : 0;
      if (!totalSessions || isNaN(totalSessions)) {
        const matched = String(row.duration || "").match(/\d+/);
        totalSessions = matched ? parseInt(matched[0], 10) : (slug === "end-to-end-analytics" || id === "end-to-end-analytics" ? 25 : slug === "sql-for-data-analytics" ? 12 : 16);
      }
      const practiceCount = Number(row.practice_count || row.pratice_count || row.practicecount || (slug === "sql-for-data-analytics" ? 4 : slug === "data-analytical-thinking" ? 3 : 6));
      const capstoneCount = Number(row.capstone_count || row.capstonecount || (slug === "sql-for-data-analytics" ? 1 : 2));

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

      // Parse 'study-style' (e.g. "Live Class", "Video", "Kèm 1:1")
      const studyStyle = String(row["study-style"] || row.study_style || "Live Class").trim();

      // Parse 'student_enrollment' (e.g. 250, 320)
      const studentEnrollment = Number(row["student_enrollment"] || row.student_enrollment) || (250 + idx * 50);

      // Parse 3 trường nội dung chi tiết khóa học
      const whoIsFor = this.parseMultilineText(
        row.who_is_for || row.whoisfor || row.danh_cho || ""
      );
      const outcomes = this.parseMultilineText(
        row.outcomes || row.outcome || row.ket_qua || ""
      );
      const inputRequirement = row.input_requirement
        ? String(row.input_requirement).trim()
        : undefined;

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
        totalSessions: (courseCurriculum.length > 0 && totalSessions === 0) ? courseCurriculum.length : totalSessions,
        practiceCount,
        capstoneCount,
        level,
        coverImageUrl,
        isActive,
        isFeatured,
        sortOrder,
        courseKind,
        studyStyle,
        studentEnrollment,
        whoIsFor: whoIsFor.length > 0 ? whoIsFor : undefined,
        outcomes: outcomes.length > 0 ? outcomes : undefined,
        inputRequirement: inputRequirement || undefined,
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
          (p.image_url || p.cover_image || p.image || p.thumbnail) as string | undefined,
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
        name: String(m.name || "Hứa Thảo Lý"),
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
        linkedinUrl: (() => {
          const rawLinkedin = String(m.linkedin_url || m.linkedin || m.linkedinUrl || "").trim();
          const isPlaceholderOrInvalid =
            !rawLinkedin ||
            !rawLinkedin.includes("linkedin.com") ||
            rawLinkedin.includes("lyhuadata") ||
            rawLinkedin.includes("huathaoly");
          return isPlaceholderOrInvalid ? "https://www.linkedin.com/in/thao-ly-hua/" : rawLinkedin;
        })(),
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

    // Parse Settings with Multi-format & Fuzzy Key Matching Support
    const settingsMap: Record<string, string> = {};

    rawSettings.forEach((item) => {
      if (!item || typeof item !== "object") return;
      const record = item as Record<string, unknown>;

      // Format 1: Row-based Key-Value (e.g. { key: "facebook_url", value: "..." } or { setting: "...", val: "..." })
      const keyCandidates = [record.key, record.k, record.setting, record.setting_key, record.name, record.ma_cai_dat, record["0"]];
      const valCandidates = [record.value, record.val, record.gia_tri, record.content, record["1"]];

      const foundKey = keyCandidates.find((k) => typeof k === "string" && (k as string).trim());
      const foundVal = valCandidates.find((v) => v !== undefined && v !== null);

      if (foundKey && foundVal !== undefined) {
        const cleanKey = String(foundKey).trim().toLowerCase().replace(/[\s-]+/g, "_");
        settingsMap[cleanKey] = String(foundVal).trim();
      }

      // Format 2: Column-based (e.g. { facebook_url: "...", zalo_url: "...", hotline: "..." })
      Object.entries(record).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "") {
          const cleanK = k.trim().toLowerCase().replace(/[\s-]+/g, "_");
          if (!["key", "value", "description", "k", "val", "desc"].includes(cleanK)) {
            settingsMap[cleanK] = String(v).trim();
          }
        }
      });
    });

    // Helper: Tìm giá trị linh hoạt từ settingsMap với nhiều biến thể key
    const getSettingVal = (patterns: string[], fallback: string): string => {
      for (const p of patterns) {
        if (settingsMap[p] && settingsMap[p].trim()) {
          return settingsMap[p].trim();
        }
      }
      const matchedKey = Object.keys(settingsMap).find((k) =>
        patterns.some((p) => k.includes(p) || p.includes(k))
      );
      if (matchedKey && settingsMap[matchedKey]?.trim()) {
        return settingsMap[matchedKey].trim();
      }
      return fallback;
    };

    const parsedSettings: SystemSettings = {
      hotline: getSettingVal(["hotline", "phone", "sdt", "so_dien_thoai"], "(+84) 769 361 960"),
      zaloUrl: getSettingVal(["zalo_url", "zalo", "link_zalo", "zalourl"], "https://zalo.me/0769361960"),
      contactEmail: getSettingVal(["contact_email", "email", "mail"], "lyhuathithao@gmail.com"),
      announcementBar: getSettingVal(["announcement_bar", "announcement", "thong_bao"], ""),
      revalidationUrl: getSettingVal(["revalidation_url", "revalidate_url", "webhook_url"], ""),
      tiktokUrl: getSettingVal(["tiktok_url", "tiktok", "link_tiktok"], "https://www.tiktok.com/@datawithly"),
      facebookUrl: getSettingVal(["facebook_url", "facebook", "fb", "fb_url", "link_facebook"], "https://www.facebook.com/datawithly.official1"),
      instagramUrl: getSettingVal(["instagram_url", "instagram", "insta", "link_instagram"], "https://www.instagram.com/datawithly/"),
      threadsUrl: getSettingVal(["threads_url", "threads", "link_threads"], "https://www.threads.com/@datawithly"),
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
      authorName: String(b.author_name || b.authorName || "Hứa Thảo Lý"),
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

  /**
   * Diagnostic test suite for 5-stage health check and latency profiling
   */
  public static async diagnoseConnection() {
    const appsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_CMS_URL || process.env.GOOGLE_APPS_SCRIPT_URL;
    const secret = process.env.GOOGLE_APPS_SCRIPT_CMS_SECRET || process.env.GOOGLE_APPS_SCRIPT_SECRET || "";
    const recommendations: string[] = [];

    const envCheck = {
      appsScriptUrlConfigured: Boolean(appsScriptUrl),
      appsScriptUrlPreview: appsScriptUrl ? `${appsScriptUrl.substring(0, 50)}...` : "CHƯA CẤU HÌNH",
      secretConfigured: Boolean(secret),
      nodeEnv: process.env.NODE_ENV || "development",
    };

    if (!envCheck.appsScriptUrlConfigured) {
      recommendations.push("Chưa cài đặt GOOGLE_APPS_SCRIPT_CMS_URL trong file .env.local.");
    }
    if (!envCheck.secretConfigured) {
      recommendations.push("Chưa cài đặt GOOGLE_APPS_SCRIPT_CMS_SECRET trong file .env.local.");
    }

    // Stage 1: Ping (Network & Cold Start check)
    const pingStep: { ok: boolean; status?: number; latencyMs: number; response?: unknown; error?: string } = {
      ok: false,
      latencyMs: 0,
    };

    if (appsScriptUrl) {
      const pingStart = Date.now();
      try {
        const pingCtrl = new AbortController();
        const pTimeout = setTimeout(() => pingCtrl.abort(), 10000);
        const pRes = await fetch(`${appsScriptUrl}?action=ping`, {
          method: "GET",
          signal: pingCtrl.signal,
          redirect: "follow",
          cache: "no-store",
        });
        clearTimeout(pTimeout);
        pingStep.latencyMs = Date.now() - pingStart;
        pingStep.status = pRes.status;
        pingStep.ok = pRes.ok;
        pingStep.response = await pRes.json();
      } catch (e) {
        pingStep.latencyMs = Date.now() - pingStart;
        const err = e as Record<string, unknown>;
        const cause = err?.cause as Record<string, unknown> | undefined;
        pingStep.error = `${(err?.message as string) || "Ping thất bại"}${cause?.code ? ` (${cause.code})` : ""}`;
        if (pingStep.latencyMs >= 9500) {
          recommendations.push("Ping timeout sau 10s. Google Apps Script có thể đang khởi động nguội (Cold Start) hoặc URL bị chặn.");
        }
      }
    }

    // Stage 2: Auth Handshake Check
    const authStep: { ok: boolean; status?: number; latencyMs: number; error?: string } = {
      ok: false,
      latencyMs: 0,
    };

    if (appsScriptUrl && secret) {
      const authStart = Date.now();
      try {
        const authCtrl = new AbortController();
        const aTimeout = setTimeout(() => authCtrl.abort(), 10000);
        const aRes = await fetch(`${appsScriptUrl}?action=get_all&secret=${encodeURIComponent(secret)}`, {
          method: "GET",
          signal: authCtrl.signal,
          redirect: "follow",
          cache: "no-store",
        });
        clearTimeout(aTimeout);
        authStep.latencyMs = Date.now() - authStart;
        authStep.status = aRes.status;
        authStep.ok = aRes.ok;

        const aJson = await aRes.json();
        if (!aJson.ok && aJson.error?.code === "UNAUTHORIZED") {
          authStep.ok = false;
          authStep.error = "Secret không khớp với SHARED_SECRET trong Google Apps Script (Lỗi 401 Unauthorized).";
          recommendations.push("Mã GOOGLE_APPS_SCRIPT_CMS_SECRET trong .env.local không khớp với SHARED_SECRET trong Script Properties.");
        }
      } catch (e) {
        authStep.latencyMs = Date.now() - authStart;
        const err = e as Record<string, unknown>;
        const cause = err?.cause as Record<string, unknown> | undefined;
        authStep.error = `${(err?.message as string) || "Auth thất bại"}${cause?.code ? ` (${cause.code})` : ""}`;
      }
    }

    // Stage 3: Full Data Report
    const dataFetchStep: {
      ok: boolean;
      latencyMs: number;
      fromCache?: boolean;
      tabCounts?: Record<string, number>;
      error?: string;
    } = { ok: false, latencyMs: 0 };

    try {
      const dataStart = Date.now();
      const report = await this.getLiveSyncReport(true);
      dataFetchStep.latencyMs = Date.now() - dataStart;
      dataFetchStep.ok = report.ok;
      dataFetchStep.fromCache = report.source === "fallback_snapshot" || report.source === "mock";
      dataFetchStep.tabCounts = {
        courses: report.totalCourses || 0,
        packages: report.totalPackages || 0,
        projects: report.totalStudentProjects || 0,
        testimonials: report.totalTestimonials || 0,
        blogs: report.totalBlogPosts || 0,
        faqs: report.totalFaqs || 0,
      };
      if (!report.ok) {
        dataFetchStep.error = report.message;
      }
    } catch (e) {
      dataFetchStep.error = (e as Error)?.message;
    }

    let overallHealth: "healthy" | "degraded" | "down" = "healthy";
    if (!dataFetchStep.ok || !pingStep.ok) {
      overallHealth = dataFetchStep.tabCounts?.courses ? "degraded" : "down";
    }

    if (overallHealth === "healthy") {
      recommendations.push("Kết nối Google Sheets CMS hoàn toàn thông suốt!");
    }

    return {
      timestamp: new Date().toISOString(),
      overallHealth,
      environment: envCheck,
      pingStep,
      authStep,
      dataFetchStep,
      recommendations,
    };
  }
}

