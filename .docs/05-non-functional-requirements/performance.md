# Tiêu Chuẩn NFR: Hiệu Năng & Tốc Độ Tải Trang (Performance & Core Web Vitals)

- **Mục đích:** Đặc tả các chỉ số hiệu năng định lượng, chuẩn Core Web Vitals khắt khe phục vụ trải nghiệm người dùng siêu tốc và tốc độ xuất bản nội dung tức thì cho quản trị viên.
- **Trạng thái:** Sẵn sàng triển khai (Approved for Implementation)
- **Người quản lý:** TechLead & Performance Engineer
- **Ngày cập nhật:** 2026-11-04
- **Nguồn tham khảo:** 
  - [Biên bản hỏi đáp dự án (project-qa.md)](../references/project-qa.md)
  - [Kiến trúc Caching Đa Tầng & Chống Memory Leak](../07-architecture/caching-and-memory-optimization.md)
  - [Module Nền tảng M00](../03-modules/M00-setup-and-connectivity/README.md)
  - [Google Core Web Vitals Guidelines](https://web.dev/vitals/)

---

## 1. Bảng Tiêu Chuẩn Hiệu Năng Chi Tiết (NFR-PERF-001 đến NFR-PERF-008)

| Mã NFR | Chỉ số hiệu năng | Đối tượng áp dụng | Ngưỡng cam kết (SLA Target) | Công cụ & Phương pháp đo lường | Mức ưu tiên |
|:---:|---|---|---|---|:---:|
| **NFR-PERF-001** | **Largest Contentful Paint (LCP)** | Trang chủ (`/`), Chi tiết khóa học (`/courses/[slug]`) | **LCP < 1.2 giây** (trên mạng 4G tiêu chuẩn và Wifi). Vượt trội so với chuẩn khuyến nghị của Google (< 2.5s). | Google PageSpeed Insights, Lighthouse (với mô phỏng mạng Mobile 4G). | **P0** |
| **NFR-PERF-002** | **Interaction to Next Paint (INP)** | Các tương tác click trên web | **INP < 100 miligiây** (phản hồi thị giác tức thì khi click mở Accordion đề cương, chuyển tab bộ lọc Blog, hoặc bấm mở Lead Modal). | Chrome DevTools Performance Panel, Web Vitals Chrome Extension. | **P0** |
| **NFR-PERF-003** | **Cumulative Layout Shift (CLS)** | Toàn bộ các trang | **CLS < 0.05** (gần như bằng 0). Bố cục cố định tuyệt đối, không có hiện tượng giật khung hình khi ảnh hoặc phông chữ đang tải. | WebPageTest, Lighthouse ("Cumulative Layout Shift" audit). | **P0** |
| **NFR-PERF-004** | **Time to First Byte (TTFB)** | Edge CDN Responses | **TTFB < 50 miligiây** tại các trạm Edge CDN của Vercel/Cloudflare trên toàn cầu đối với toàn bộ các trang nội dung tĩnh/bán tĩnh. | `curl -w "TTFB: %{time_starttransfer}s\n" -o /dev/null -s https://datawithly.edu.vn`. | **P0** |
| **NFR-PERF-005** | **Dung lượng JavaScript Ban đầu** | First Load JS Bundle | **Tổng JS tải lần đầu < 85 KB gzipped**. Loại bỏ hoàn toàn các thư viện nặng nề không cần thiết (dùng Date-fns/Intl thay vì Moment.js, Lucide Icons chọn lọc). | Báo cáo `npm run build` của Next.js (cột "First Load JS shared by all"). | **P1** |
| **NFR-PERF-006** | **Tối ưu Hóa Hình Ảnh Tự Động** | Toàn bộ hình ảnh | 100% hình ảnh hiển thị qua `next/image` và component `SafeImage`, tự động chuyển đổi sang định dạng WebP/AVIF, lazy loading các ảnh dưới màn hình đầu tiên (below the fold). | Kiểm tra định dạng ảnh và Network transfer size trên trình duyệt. | **P1** |
| **NFR-PERF-007** | **Độ Trễ Xuất Bản Nội Dung (Publish SLA)** | Thao tác quản trị CMS | Sau khi Chị Ly bấm *"Đồng Bộ Lên Website"*, toàn bộ Edge CDN toàn cầu nhận diện dữ liệu mới trong vòng **< 1 đến 2 giây** (nhờ Webhook On-Demand ISR Revalidation). | Đo thời gian từ lúc bấm nút trên Sheets đến khi F5 website hiển thị dữ liệu mới. | **P0** |
| **NFR-PERF-008** | **Khả Năng Chịu Tải Đột Biến (Concurrency)** | Chiến dịch quảng cáo | Hệ thống chịu tải mượt mà **>= 1.000 users đồng thời truy cập trong 1 phút** mà không làm tăng thời gian phản hồi trang hay sập Google Sheets (nhờ 99% request được Edge CDN đáp ứng). | K6 / Artillery load testing script mô phỏng 1.000 virtual users. | **P1** |

---

## 2. Chiến Lược Kỹ Thuật Đạt Chuẩn Core Web Vitals < 1.2 Giây

Để biến mục tiêu LCP < 1.2s và CLS < 0.05 thành hiện thực, dự án triển khai bộ giải pháp công nghệ đồng bộ:

```
                  ┌──────────────────────────────────────────────┐
                  │   KIẾN TRÚC TỐI ƯU CORE WEB VITALS DATAWITHLY │
                  └──────────────────────┬───────────────────────┘
                                         │
        ┌────────────────────────────────┼────────────────────────────────┐
        ▼                                ▼                                ▼
┌──────────────────────┐      ┌──────────────────────┐      ┌──────────────────────┐
│  1. TỐC ĐỘ (LCP)     │      │  2. PHẢN HỒI (INP)   │      │ 3. ỔN ĐỊNH (CLS)     │
├──────────────────────┤      ├──────────────────────┤      ├──────────────────────┤
│ • Edge CDN Cache     │      │ • Client Islands     │      │ • SafeImage có tỷ    │
│   (TTFB < 50ms)      │      │ • React 19 Concurrent│      │   lệ khung hình cố   │
│ • Font tiếng Việt    │      │ • Thao tác lọc Blog  │      │   định (aspect-ratio)│
│   ưu tiên tự host    │      │   in-memory 0ms      │      │ • Skeleton loaders   │
│ • Critical CSS Inline│      │ • Code-splitting lười│      │   thay vì spinner    │
└──────────────────────┘      └──────────────────────┘      └──────────────────────┘
```

1. **Tối ưu LCP (Tải khối nội dung lớn nhất):**
   - Khối tiêu đề H1 và ảnh đại diện Hero được Server Component dựng sẵn (Static Pre-rendered).
   - Phông chữ tiếng Việt (`Be Vietnam Pro` / `Inter`) được cấu hình qua `next/font/google` với cơ chế `display: swap` và tự host cục bộ, không phát sinh request chặn render sang máy chủ Google Fonts.
2. **Tối ưu INP (Phản hồi tương tác):**
   - Tách biệt rạch ròi giữa Server Components (dựng giao diện) và Client Components (xử lý tương tác).
   - Tương tác mở Modal Lead Form được lazy-load động (`next/dynamic`), giúp trang chủ ban đầu không phải tải trước mã nguồn nặng của Modal khi người dùng chưa bấm nút.
3. **Tối ưu CLS (Chống giật layout):**
   - Tất cả ảnh mockup dự án học viên và avatar mentor đều khai báo thuộc tính `width`, `height` hoặc bao bọc trong khung `aspect-video` (`aspect-ratio: 16/9`).
   - Sử dụng font-fallback có số đo metric tương đương để chống hiện tượng nhảy chữ (FOUT / FOIT).

---

## 3. Kịch Bản Nghiệm Thu Hiệu Năng (Performance Acceptance Criteria)

| Mã AC | Kịch bản kiểm tra | Điều kiện thử nghiệm | Tiêu chí đạt nghiệm thu |
|---|---|---|---|
| **AC-PERF-01** | Kiểm tra Google PageSpeed Insights | Chạy URL trang chủ trên công cụ chính thức của Google (môi trường Production). | • Điểm số Hiệu năng Mobile: **>= 90 điểm**.<br>• Điểm số Hiệu năng Desktop: **>= 95 điểm**.<br>• Các tiêu chí Core Web Vitals đều đạt màu xanh lá (Good). |
| **AC-PERF-02** | Đo lường độ trễ Edge CDN TTFB | Gửi request `curl -I` từ máy tính cá nhân tại Việt Nam. | Header trả về `x-vercel-cache: HIT` hoặc `cf-cache-status: HIT`, thời gian TTFB **< 50ms**. |
| **AC-PERF-03** | Đo lường thời gian xuất bản nội dung | Chị Ly chỉnh sửa học phí từ `2.990.000` thành `2.790.000` trên Google Sheets ➔ Bấm nút [Đồng Bộ Lên Website]. | • Script Apps Script hoàn thành trong vòng < 1.5 giây.<br>• Mở tab ẩn danh truy cập website thấy học phí mới hiển thị ngay lập tức sau 1-2 giây. |
| **AC-PERF-04** | Kiểm tra tải đồng thời (Load Test) | Dùng công cụ K6 bơm 1.000 requests/phút vào trang `/` và `/courses/sql-for-data-analytics`. | • Tỉ lệ lỗi (Error Rate): **0.00%**.<br>• P95 Latency: **< 200ms**.<br>• Google Sheets API không phát sinh bất kỳ lỗi 429 nào. |

---

[Quay lại Mục lục NFR](README.md) | [Đến NFR Độ tin cậy](reliability.md)
