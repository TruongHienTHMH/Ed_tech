import { Metadata } from "next";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingCta from "@/components/layout/FloatingCta";
import AboutHero from "@/components/about/AboutHero";
import AboutStats from "@/components/about/AboutStats";
import AboutFounder from "@/components/about/AboutFounder";
import AboutCoreValues from "@/components/about/AboutCoreValues";
import AboutJourney from "@/components/about/AboutJourney";
import AboutCta from "@/components/about/AboutCta";
import { ContentFetcher } from "@/lib/cms/content-fetcher";

export const metadata: Metadata = {
  title: "Giới thiệu & Founder Hứa Thảo Ly | Đào Tạo Data Analyst Thực Chiến",
  description:
    "Tìm hiểu Giới thiệu và Founder Hứa Thảo Ly (Cựu Lead Data Analyst MoMo, Tiki, ACB). Phương pháp đào tạo Data Analyst dựa trên tư duy kinh doanh và dữ liệu Production thật.",
  openGraph: {
    title: "Giới thiệu & Founder Hứa Thảo Ly | Học Data Analyst Thực Chiến",
    description:
      "LyData giúp bạn trở thành Data Analyst thực chiến thông qua tư duy bản chất, dữ liệu thật và kèm cặp 1-on-1 sát sao.",
    url: "https://lydata.vn/about",
    siteName: "LyData",
    images: [
      {
        url: "/assets/mentor/ly.png",
        width: 800,
        height: 1000,
        alt: "Founder Hứa Thảo Ly - LyData",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
};

export const revalidate = 300;

export default async function AboutPage() {
  const courses = await ContentFetcher.getCourses().catch(() => []);

  return (
    <div className="min-h-screen flex flex-col bg-white selection:bg-[#AF445A]/20 selection:text-[#AF445A]">
      {/* Top Announcement Bar */}
      <AnnouncementBar />

      {/* Main Navigation (Light variant for crisp reading) */}
      <Navbar variant="light" courses={courses} />

      <main className="flex-1">
        {/* 1. Hero Introduction */}
        <AboutHero />

        {/* 2. Key Metrics & Impact */}
        <AboutStats />

        {/* 3. Founder Story & Career Milestones */}
        <AboutFounder />

        {/* 4. Core Education Pillars */}
        <AboutCoreValues />

        {/* 5. 4-Stage Learning Journey */}
        <AboutJourney />

        {/* 6. High-Conversion CTA Banner */}
        <AboutCta />
      </main>

      {/* Floating CTA & Footer */}
      <FloatingCta />
      <Footer />
    </div>
  );
}
