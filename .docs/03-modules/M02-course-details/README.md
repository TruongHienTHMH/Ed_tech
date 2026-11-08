# M02 — Chi tiết khóa học (Course Details)

- **Mục đích:** Xác định ranh giới, cấu trúc route động (`/courses/[slug]`), kiến trúc thành phần và tiêu chuẩn đề cương chi tiết cho Module Chi tiết Khóa học.
- **Trạng thái:** Sẵn sàng triển khai (Approved for Implementation)
- **Người phụ trách:** TechLead & Frontend Agent
- **Ngày cập nhật:** 2026-11-03
- **Nguồn tham khảo:** 
  - [PRD M02 Chi tiết](prd.md)
  - [Workflow Xem chi tiết khóa học (WF-02)](../../04-workflows/WF-02-view-course-details.md)
  - [Mô hình dữ liệu khóa học (Course Model)](../../02-domain/course-model.md)
  - [Quy tắc Design System & 4-Point Spacing](../../07-architecture/design-system-rules.md)
  - Slide bài giảng: `[LYDATA] Data Analytics Courses.pptx.pdf`

---

## 1. Ranh giới module (Module Boundaries)

Module Course Details chịu trách nhiệm hiển thị trang thông tin chuyên sâu cho từng khóa học cụ thể theo route động `app/courses/[slug]/page.tsx`, giúp học viên hiểu rõ phương pháp học thực chiến, đề cương từng buổi và ra quyết định đăng ký tư vấn.

### Trong phạm vi (In-Scope)
1. **Dynamic Routing & Static Generation (SSG/ISR):**
   - Hỗ trợ đầy đủ 3 khóa học thực tế:
     - `/courses/sql-for-data-analytics`
     - `/courses/analytical-thinking-dashboard-design`
     - `/courses/end-to-end-analytics`
   - Sử dụng `generateStaticParams()` để build tĩnh toàn bộ trang khóa học tại thời điểm build và cập nhật tức thì qua ISR Cache khi Sheets thay đổi.
2. **Cấu trúc trang 7 phần (7 Section Layout):**
   - *Course Hero:* Tiêu đề, Tagline, Thời lượng (buổi), Hình thức (Live Zoom), Lịch học, Học phí công khai và CTA đăng ký.
   - *Visual Learning Flow:* Sơ đồ trực quan hóa chu trình phân tích thực tế: `Business Problem → Metrics Definition → Data Extraction (SQL) → Deep-dive Insight → Dashboard`.
   - *Who Is This For:* Phân tích đối tượng phù hợp và điều kiện tiên quyết (Prerequisites).
   - *Interactive Curriculum Accordion:* Đề cương chi tiết 12 đến 25 buổi, hỗ trợ nút **[Mở rộng tất cả] / [Thu gọn tất cả]**, parse các dòng `Alt+Enter` từ Google Sheets thành gạch đầu dòng rõ ràng.
   - *Outcomes & Deliverables:* Chuẩn đầu ra và sản phẩm Portfolio thực tế học viên đạt được sau khóa học.
   - *Transparent Pricing & Combo Options:* Học phí công khai, cam kết quyền lợi và thẻ gợi ý nâng cấp gói Combo End-to-End tiết kiệm.
   - *Course FAQs:* Các câu hỏi thường gặp về lịch học, hoàn tiền và hỗ trợ cài đặt công cụ.
3. **Chuyển hóa Lead (Conversion Trigger):**
   - CTA chính ghim sẵn `course_id` tương ứng khi mở Modal Lead Capture (M04).
   - Form đăng ký nhúng ở cuối trang phục vụ người dùng thích điền trực tiếp.

### Ngoài phạm vi (Out-of-Scope)
- Nền tảng xem video bài giảng hoặc làm bài tập trắc nghiệm (LMS).
- Mua khóa học trực tiếp qua thẻ tín dụng/cổng thanh toán (không có giỏ hàng/checkout).

---

## 2. Kiến trúc Component

```
[Page: app/courses/[slug]/page.tsx (Server Component)]
  ├── <HeaderNavigation />
  ├── <CourseHeroSection course={data} />
  ├── <MethodologyFlowSection />
  ├── <TargetAudienceSection requirements={data.level} />
  ├── <CurriculumAccordion items={data.curriculum} /> (Client Component: Toggle & Expand All)
  ├── <LearningOutcomesSection outcomes={data.outcomes} />
  ├── <PricingAndComboSection currentCourse={data} combo={comboData} />
  ├── <CourseFaqSection faqs={data.faqs} />
  ├── <Footer />
  └── <LeadCaptureModal defaultCourseId={data.id} />
```

---

[Điểm bắt đầu của bộ docs](../../README.md) | [Đọc tiếp: PRD Chi tiết M02](prd.md)
