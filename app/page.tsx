import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import CoursesSection from "@/components/home/CoursesSection";
import WhyChooseUsSection from "@/components/home/WhyChooseUsSection";
import AlumniCompaniesSection from "@/components/home/AlumniCompaniesSection";
import ComboPricingSection from "@/components/home/ComboPricingSection";
import StudentProjectsSection from "@/components/home/StudentProjectsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import BlogSection from "@/components/home/BlogSection";
import Footer from "@/components/layout/Footer";
import FloatingCta from "@/components/layout/FloatingCta";
import { ContentFetcher } from "@/lib/cms/content-fetcher";

// Revalidate page data every 5 minutes (ISR)
export const revalidate = 300;

export default async function Home() {
  // Fetch real-time data from 12-tab Google Sheets CMS with in-memory caching and fallback
  const [courses, packages, studentProjects, testimonials, blogPosts] = await Promise.all([
    ContentFetcher.getCourses().catch(() => []),
    ContentFetcher.getPackages().catch(() => []),
    ContentFetcher.getStudentProjects().catch(() => []),
    ContentFetcher.getTestimonials().catch(() => []),
    ContentFetcher.getBlogPosts().catch(() => []),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-white selection:bg-[#AF445A]/20 selection:text-[#AF445A]">
      {/* Top Announcement Bar */}
      <AnnouncementBar />

      {/* Main Sticky Navbar */}
      <Navbar />

      {/* Main Page Flow matching Figma Desktop Design (Node 12:682) */}
      <main className="flex-1">
        {/* 1. Hero Section (Online Data Analytics Course) */}
        <HeroSection />

        {/* 2. Featured Courses Interactive Slider */}
        <CoursesSection courses={courses} />

        {/* 3. Tại sao nên học Data Analyst tại LYDATA? */}
        <WhyChooseUsSection />

        {/* 4. Học viên đã trúng tuyển tại các công ty */}
        <AlumniCompaniesSection />

        {/* 5. Đầu tư thông minh cho sự nghiệp (Combo vs Đăng ký riêng lẻ) */}
        <ComboPricingSection packages={packages} />

        {/* 6. Dự án của học viên qua các khóa học tại Lydata */}
        <StudentProjectsSection projects={studentProjects} />

        {/* 7. Đánh giá của học viên */}
        <TestimonialsSection testimonials={testimonials} />

        {/* 8. Blogs về Data Analytics - Chia sẻ miễn phí */}
        <BlogSection blogs={blogPosts} />
      </main>

      {/* Modern 4-Column Footer */}
      <Footer />

      {/* Floating Support CTAs (Phone, Messenger, Zalo) */}
      <FloatingCta />
    </div>
  );
}
