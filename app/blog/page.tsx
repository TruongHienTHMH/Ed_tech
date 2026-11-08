import type { Metadata } from "next";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingCta from "@/components/layout/FloatingCta";
import BlogListContainer from "@/components/blog/BlogListContainer";
import { BlogService } from "@/lib/services/blog.service";

export const metadata: Metadata = {
  title: "Góc Chia Sẻ Kiến Thức Data Analytics | DataWithLy",
  description:
    "Tổng hợp các bài viết, case study và mẹo SQL, Dashboard, Lộ trình nghề nghiệp từ Mentor Hứa Thảo Ly.",
  openGraph: {
    title: "Góc Chia Sẻ Kiến Thức Data Analytics | DataWithLy",
    description:
      "Tổng hợp các bài viết, case study và mẹo SQL, Dashboard, Lộ trình nghề nghiệp từ Mentor Hứa Thảo Ly.",
    type: "website",
    locale: "vi_VN",
  },
};

export const revalidate = 300; // ISR 5 minutes

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([
    BlogService.getBlogPosts().catch(() => []),
    BlogService.getCategories().catch(() => []),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-white selection:bg-[#AF445A]/20 selection:text-[#AF445A]">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1">
        {/* Blog Hero Header */}
        <section className="relative w-full bg-gradient-to-b from-[#FAF7F8] via-white to-white py-12 lg:py-16 border-b border-neutral-100 overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br from-[#8B1D2C]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 text-center">
            <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#8B1D2C]/10 text-[#8B1D2C] mb-3">
              Góc Chia Sẻ Kiến Thức
            </span>
            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-[44px] text-neutral-900 leading-tight mb-4">
              Kiến Thức &amp; Case Study{" "}
              <span className="text-brand-gradient">Data Analytics Thực Chiến</span>
            </h1>
            <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
              Tổng hợp những kinh nghiệm đúc kết từ 7+ năm làm việc thực tế tại các doanh nghiệp hàng đầu cùng các bài hướng dẫn chi tiết dành cho người chuyển ngành.
            </p>
          </div>
        </section>

        {/* Blog Posts Listing Area */}
        <section className="py-12 lg:py-16">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
            <BlogListContainer
              initialPosts={posts}
              categories={categories.length > 0 ? categories : ["SQL", "Dashboard", "Career"]}
            />
          </div>
        </section>
      </main>

      <Footer />
      <FloatingCta />
    </div>
  );
}

