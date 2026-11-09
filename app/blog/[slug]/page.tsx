import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingCta from "@/components/layout/FloatingCta";
import SafeImage from "@/components/common/SafeImage";
import { Clock } from "@/components/common/Icons";
import ReadingProgressBar from "@/components/blog/ReadingProgressBar";
import TableOfContents from "@/components/blog/TableOfContents";
import BlogMarkdownRenderer from "@/components/blog/BlogMarkdownRenderer";
import BlogAuthorBox from "@/components/blog/BlogAuthorBox";
import BlogRelatedCourseBanner from "@/components/blog/BlogRelatedCourseBanner";
import BlogSidebarMiniCard from "@/components/blog/BlogSidebarMiniCard";
import BlogPostCard from "@/components/blog/BlogPostCard";
import { BlogService } from "@/lib/services/blog.service";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 300; // ISR 5 minutes

export async function generateStaticParams() {
  const posts = await BlogService.getBlogPosts().catch(() => []);
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await BlogService.getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Bài viết không tồn tại | DataWithLy",
      description: "Không tìm thấy nội dung bài viết yêu cầu.",
    };
  }

  return {
    title: `${post.title} | DataWithLy Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.coverImageUrl ? [{ url: post.coverImageUrl }] : [],
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.authorName || "Hứa Thảo Ly"],
      locale: "vi_VN",
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await BlogService.getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await BlogService.getRelatedPosts(
    post.category,
    post.slug,
    3
  ).catch(() => []);

  const formattedDate = (() => {
    try {
      const d = new Date(post.publishedAt);
      if (isNaN(d.getTime())) return post.publishedAt;
      return d.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return post.publishedAt;
    }
  })();

  const readTime = post.readTimeMinutes || 5;

  return (
    <div className="min-h-screen flex flex-col bg-white selection:bg-[#AF445A]/20 selection:text-[#AF445A]">
      {/* 1. Sticky Top Reading Progress Bar */}
      <ReadingProgressBar />

      {/* 2. Top Navigation */}
      <AnnouncementBar />
      <Navbar variant="light" />

      <main className="flex-1">
        {/* Breadcrumb Header */}
        <div className="bg-[#FAF7F8] border-b border-neutral-100 py-4">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-neutral-500 overflow-x-auto scrollbar-none">
              <Link href="/" className="hover:text-neutral-900 transition-colors shrink-0">
                Trang chủ
              </Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-neutral-900 transition-colors shrink-0">
                Blog
              </Link>
              <span>/</span>
              <span className="text-neutral-800 font-semibold truncate max-w-xs sm:max-w-md">
                {post.title}
              </span>
            </nav>
          </div>
        </div>

        {/* Article Container (2-Column Desktop Layout) */}
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Primary Reading Column (8 cols) */}
            <div className="lg:col-span-8 space-y-8">
              {/* Header Meta */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#8B1D2C]/10 text-[#8B1D2C] border border-[#8B1D2C]/20">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
                    <Clock className="w-3.5 h-3.5 text-[#8B1D2C]" />
                    <span>{readTime} phút đọc</span>
                  </div>
                  <span className="text-xs text-neutral-400">•</span>
                  <span className="text-xs text-neutral-500">{formattedDate}</span>
                </div>

                {/* H1 Title */}
                <h1 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-[40px] text-neutral-900 leading-tight">
                  {post.title}
                </h1>

                {/* Lead Excerpt */}
                <p className="text-base sm:text-lg text-neutral-600 leading-relaxed font-normal italic border-l-3 border-[#8B1D2C]/50 pl-4 py-1">
                  {post.excerpt}
                </p>
              </div>

              {/* Cover Image 16:9 */}
              <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-lg border border-neutral-100 bg-neutral-100">
                <SafeImage
                  src={
                    post.coverImageUrl ||
                    "/assets/figma/71218f0038c8a9ce02ba0e6f6b102fbf63b6953b.png"
                  }
                  alt={post.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 800px"
                  className="object-cover"
                  containerClassName="w-full h-full"
                />
              </div>

              {/* Markdown Content */}
              <div className="pt-2">
                <BlogMarkdownRenderer
                  content={post.contentMarkdown || post.excerpt}
                />
              </div>

              {/* Author Box */}
              <div className="pt-6 border-t border-neutral-200">
                <BlogAuthorBox
                  name={post.authorName || "Hứa Thảo Ly"}
                  avatarUrl={post.authorAvatarUrl}
                />
              </div>

              {/* Related Course CTA Banner */}
              <div className="pt-4">
                <BlogRelatedCourseBanner category={post.category} />
              </div>
            </div>

            {/* Sidebar Sticky Column (4 cols) */}
            <aside className="lg:col-span-4 space-y-6">
              <div className="sticky top-24 space-y-6">
                {/* Table of Contents */}
                <TableOfContents />

                {/* Quick Consultation Mini Card */}
                <BlogSidebarMiniCard courseId="sql-for-data-analytics" />
              </div>
            </aside>
          </div>
        </div>

        {/* Related Posts Section */}
        {relatedPosts.length > 0 && (
          <section className="bg-[#FAF7F8] border-t border-neutral-200/80 py-12 lg:py-16">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-heading font-bold text-2xl text-neutral-900">
                    Bài Viết Cùng Chủ Đề
                  </h2>
                  <p className="text-sm text-neutral-500 mt-1">
                    Khám phá thêm các kiến thức thực chiến hữu ích khác
                  </p>
                </div>
                <Link
                  href="/blog"
                  className="text-xs sm:text-sm font-semibold text-[#8B1D2C] hover:text-[#AF445A] transition-colors"
                >
                  Xem tất cả bài viết &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                {relatedPosts.map((rPost) => (
                  <BlogPostCard key={rPost.id} post={rPost} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
      <FloatingCta />
    </div>
  );
}
