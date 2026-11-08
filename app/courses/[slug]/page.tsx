import { Metadata } from "next";
import { notFound } from "next/navigation";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingCta from "@/components/layout/FloatingCta";
import CourseHero from "@/components/course/CourseHero";
import CourseFigmaOverview from "@/components/course/CourseFigmaOverview";
import CourseFigmaHighlights from "@/components/course/CourseFigmaHighlights";
import CourseFigmaWeekAccordion from "@/components/course/CourseFigmaWeekAccordion";
import CourseFigmaInstructor from "@/components/course/CourseFigmaInstructor";
import CourseFigmaStickySidebar from "@/components/course/CourseFigmaStickySidebar";
import CourseMethodologyFlow from "@/components/course/CourseMethodologyFlow";
import CourseOutcomes from "@/components/course/CourseOutcomes";
import CourseComboUpsell from "@/components/course/CourseComboUpsell";
import CourseFaq from "@/components/course/CourseFaq";
import { CourseService } from "@/lib/services/course.service";
import { ContentFetcher } from "@/lib/cms/content-fetcher";

// ISR Revalidation every 5 minutes (300s)
export const revalidate = 300;

/**
 * Pre-render static pages for active courses & PRD M02 aliases
 */
export async function generateStaticParams() {
  const slugs = await CourseService.getAllActiveSlugs();
  return slugs.map((slug) => ({ slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Dynamic SEO & OpenGraph Metadata
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = await CourseService.getCourseBySlug(slug);

  if (!course) {
    return {
      title: "Không tìm thấy khóa học | DataWithLy",
      description: "Khóa học bạn tìm kiếm hiện không tồn tại hoặc đã tạm dừng tuyển sinh.",
    };
  }

  const title = `${course.title} | DataWithLy - Đào Tạo Data Analytics Thực Chiến`;
  const description =
    course.description ||
    course.tagline ||
    "Khóa học Data Analytics thực chiến theo phương pháp giải quyết bài toán kinh doanh cùng Mentor Hứa Thảo Ly.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: course.coverImageUrl || "/assets/figma/00d85e9072dd2031d3c61249ae87330dd98d7556.png",
          width: 1200,
          height: 630,
          alt: course.title,
        },
      ],
      type: "website",
    },
  };
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const course = await CourseService.getCourseBySlug(slug);

  // Trigger 404 if slug doesn't match an active course
  if (!course || !course.isActive) {
    notFound();
  }

  // Concurrent fetch for curriculum and student projects
  const [modules, studentProjects] = await Promise.all([
    CourseService.getCurriculumByCourseId(course.id).catch(() => []),
    ContentFetcher.getStudentProjects().catch(() => []),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-white selection:bg-[#AF445A]/20 selection:text-[#AF445A]">
      {/* Top Notification Bar */}
      <AnnouncementBar />

      {/* Sticky Main Navigation */}
      <Navbar />

      {/* Main Course Content — Figma Node 12:1277 Architecture */}
      <main className="flex-1">
        {/* 1. Hero Banner */}
        <CourseHero course={course} />

        {/* 2. Main 2-Column Container (1200px max width) */}
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12">
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            {/* CỘT TRÁI (792px): Khóa học, Điểm nổi bật, Lộ trình tuần, Giảng viên */}
            <div className="w-full lg:w-[792px] shrink-0">
              {/* 1. Chi tiết khóa học */}
              <CourseFigmaOverview course={course} />

              {/* 2. Điểm nổi bật */}
              <CourseFigmaHighlights />

              {/* 3. Chương trình giảng dạy theo tuần (Date badges TH10 03) */}
              <CourseFigmaWeekAccordion modules={modules} courseTitle={course.title} />

              {/* 4. Giảng viên của bạn (Hứa Thảo Ly, MoMo, Tiki, ACB) */}
              <CourseFigmaInstructor />

              {/* 5. Phương pháp học 5 bước */}
              <CourseMethodologyFlow />

              {/* 6. Dự án học viên tiêu biểu */}
              <CourseOutcomes projects={studentProjects} />

              {/* 7. Câu hỏi thường gặp */}
              <CourseFaq courseId={course.id} courseTitle={course.title} />
            </div>

            {/* CỘT PHẢI STICKY (384px): Học phí, Rating 4.8, CTA, Khóa học bao gồm, Zoom */}
            <CourseFigmaStickySidebar course={course} />
          </div>
        </div>

        {/* 3. Combo Upsell Banner (Trọn bộ End-to-End) */}
        <CourseComboUpsell course={course} />
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Floating Fast CTAs */}
      <FloatingCta />
    </div>
  );
}
