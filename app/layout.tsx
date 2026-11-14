import type { Metadata } from "next";
import "./globals.css";
import GoogleTagManager from "@/components/analytics/GoogleTagManager";
import AttributionTracker from "@/components/analytics/AttributionTracker";
import LeadModalManager from "@/components/forms/LeadModalManager";
import QueryProvider from "@/components/providers/QueryProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://datawithly.com"),
  title: "DataWithLy - Học Data Analytics từ tư duy đến thực hành",
  description:
    "Đồng hành cùng mentor có hơn 5 năm kinh nghiệm tại MoMo, Tiki, từ kiến thức nền tảng đến thực hành giải quyết bài toán dữ liệu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-white text-[#252525] selection:bg-[#AF445A]/20 selection:text-[#AF445A]">
        <QueryProvider>
          <GoogleTagManager />
          <AttributionTracker />
          {children}
          <LeadModalManager />
        </QueryProvider>
      </body>
    </html>
  );
}
