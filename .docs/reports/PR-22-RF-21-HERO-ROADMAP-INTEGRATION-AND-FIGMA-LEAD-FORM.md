# BÁO CÁO PULL REQUEST: TÍCH HỢP HERO ROADMAP, FORM TƯ VẤN FIGMA 12:3320 VÀ BẢO MẬT HỆ THỐNG (RF-19 ĐẾN RF-21)

**Mã định danh:** PR-22-RF-21  
**Nhánh Git đề xuất:** `feature/rf-21-hero-roadmap-and-figma-lead-form`  
**Nhánh đích:** `main` (hoặc `develop`)  
**Trạng thái:** ✅ SẴN SÀNG MERGE (100% Quality Gates Passed)  
**Thời gian cập nhật:** 14/11/2026  

---

## 1. TỔNG QUAN THAY ĐỔI (OVERVIEW)

Pull Request này bao gồm các cải tiến giao diện người dùng (UI/UX) trọng tâm theo thiết kế Figma mới nhất cùng các củng cố an toàn hệ thống:

1. **Tích hợp RoadMap 4 giai đoạn vào HeroSection ([HeroSection.tsx](file:///Users/hientruongthmh/Documents/Web_Jobs/ed_da_tech/components/home/HeroSection.tsx)):**
   - Giữ nguyên cấu trúc layout căn giữa hiện tại của trang chủ.
   - Thay thế form nhập email tĩnh bằng khối **RoadMap 4 Giai Đoạn** (`Data Foundation`, `Data Analysis & Visualization`, `Analytical Thinking`, `Case Study & Project`) chuẩn theo bản vẽ Figma Node `157:903` và tài liệu hình ảnh người dùng cung cấp.
   - Nút hành động gradient: `Khám phá lộ trình chi tiết →` mở trực tiếp popup tư vấn `LeadModal`.
   - Giữ nguyên dải Social Proof 5 avatar học viên, 5 sao ⭐⭐⭐⭐⭐ (`200+ học viên đã tham gia`) và hàng logo công nghệ (SQL, Google Sheet, Data Studio, Power BI, Python).

2. **Căn chỉnh 2 Component Tranh minh họa không nền ([Iconic_left](https://www.figma.com/design/epfQwa5s3iMO6toM4Fmmpu/Hien-Ed_TECH?node-id=157-835) & [Iconic_right](https://www.figma.com/design/epfQwa5s3iMO6toM4Fmmpu/Hien-Ed_TECH?node-id=157-904)):**
   - Trích xuất 2 asset PNG 100% trong suốt từ Figma Desktop MCP ([hero-clean-left.png](file:///Users/hientruongthmh/Documents/Web_Jobs/ed_da_tech/public/assets/decorations/hero-clean-left.png) và [hero-clean-right.png](file:///Users/hientruongthmh/Documents/Web_Jobs/ed_da_tech/public/assets/decorations/hero-clean-right.png)), loại bỏ triệt để các khung hộp xám và viền chữ nhật dư thừa.
   - Đặt trực tiếp vào hai khoảng trống hai bên cánh tiêu đề (`top-1/2 -translate-y-1/2`), hiển thị hài hòa từ màn hình laptop (`lg:block` >= 1024px), khắc phục hoàn toàn tình trạng bị cắt hình ở mép trình duyệt.

3. **Form Tư vấn chuẩn 100% Figma Node 12:3320 ([LeadForm.tsx](file:///Users/hientruongthmh/Documents/Web_Jobs/ed_da_tech/components/forms/LeadForm.tsx)):**
   - Header & Subtitle: `Đăng Kí Tư Vấn Ngay` / `Chúng tôi sẽ ngưng nhận tư vấn khi đủ số lượng đăng ký!`.
   - Bổ sung trường Dropdown: `Ngày trao đổi thuận tiện với bạn nhất là *` (Thứ 2 đến Chủ Nhật).
   - Bổ sung trường Dropdown: `Khung giờ phù hợp để trao đổi với bạn là *` (10h - 10h30, 09h - 09h30, 14h - 14h30, v.v.).
   - Radio group cam kết: `Bạn nhớ xuất hiện đúng giờ hẹn nhé` (`Tôi chắc chắn`, `Tôi cam kết`).
   - Nút bấm Submit: `ĐĂNG KÝ NGAY` với gradient `#784080` &rarr; `#AF445A`, bo góc `rounded-[12px]`.
   - Áp dụng nhất quán trên `LeadModal`, `CourseFaq` và các điểm nhúng form toàn website.

4. **Làm sạch Secret & Tối ưu Revalidation (RF-19 & RF-20):**
   - Loại bỏ 100% token bí mật hardcoded trong mã nguồn và giao diện người dùng.
   - Bảo mật thông tin trong Apps Script dialogs với cơ chế che dấu `●●●●●●●●`.
   - Đảm bảo cơ chế On-demand ISR Revalidation hoạt động ổn định giữa Google Sheets và Next.js Vercel.

---

## 2. DANH SÁCH FILE THAY ĐỔI (CHANGED FILES)

| Khu Vực | Đường Dẫn File | Tóm Tắt Thay Đổi |
| :--- | :--- | :--- |
| **Hero UI** | `components/home/HeroSection.tsx` | Tích hợp RoadMap 4 giai đoạn, căn chỉnh 2 tranh minh họa không nền ôm sát tiêu đề. |
| **Lead Form UI** | `components/forms/LeadForm.tsx` | Tuân thủ 100% Figma Node `12:3320` (Dropdown ngày, giờ, radio cam kết, nút gradient). |
| **Lead Modal** | `components/forms/LeadModal.tsx` | Cập nhật tiêu đề & thông điệp cam kết theo Figma Node `12:3320`. |
| **Lead Service** | `lib/modules/leads/lead.service.ts` | Map các trường ngày hẹn & khung giờ vào payload lưu trữ CRM Google Sheets. |
| **Lead DTO** | `lib/modules/leads/types.ts` | Bổ sung `preferred_date` và `preferred_time_slot` vào `LeadInputDto`. |
| **Revalidate API**| `app/api/revalidate/route.ts` | Làm sạch toàn bộ secret fallback token, kiểm tra chặt chẽ `process.env.REVALIDATION_SECRET`. |
| **GAS Maintenance**| `apps-script/cms/06_CmsMaintenance.gs` | Che dấu mã bí mật dạng `●●●●●●●●`, sửa lỗi đường dẫn gọi revalidation. |
| **GAS Bundles** | `apps-script/cms/dist/Code.cms.bundle.gs`, `Code.leads.bundle.gs` | Đồng bộ bản bundle sau khi cập nhật mã nguồn GAS. |
| **Assets** | `public/assets/decorations/hero-clean-left.png`, `hero-clean-right.png` | Asset trong suốt 100% Retina-ready cho 2 cánh của HeroSection. |

---

## 3. KẾT QUẢ KIỂM THỬ (AUTOMATED QUALITY GATES)

| Kiểm thử | Lệnh thực thi | Kết quả | Ghi chú |
| :--- | :--- | :--- | :--- |
| **Lead Validation & Anti-Bot** | `npm run test:lead` | **10 / 10 PASSED** | BR-09 Rate Limit, Honeypot trap, phone regex |
| **GAS QA & Deduplication** | `npm run test:gas` | **80 / 80 PASSED** | 0 duplicate functions, 100% DOM IDs valid |
| **GAS Bundler** | `npm run bundle:gas` | **PASS** | CMS (246.8 KB), Leads (31.3 KB) |
| **Code Linting** | `npm run lint` | **0 Errors** | Tuân thủ toàn bộ quy tắc ESLint |
| **Next.js Production Build** | `npm run build` | **19 / 19 Routes** | Biên dịch thành công toàn bộ Static & Dynamic SSG |

---

## 4. HƯỚNG DẪN REVIEW VÀ KIỂM THỬ THỰC TẾ (HOW TO TEST)

1. Mở trang chủ [http://localhost:3000](http://localhost:3000):
   - Kiểm tra tiêu đề Hero hiển thị kèm 2 hình minh họa không nền ôm sát hai bên khoảng trống.
   - Kiểm tra khối RoadMap 4 giai đoạn hiển thị cân đối, thẻ số 2 được tô sáng.
   - Nhấp vào nút `Khám phá lộ trình chi tiết →` để mở form tư vấn `LeadModal`.
2. Kiểm tra form đăng ký:
   - Các trường ngày hẹn (`Thứ 2` .. `Chủ Nhật`) và khung giờ (`10h - 10h30`, v.v.) hiển thị chuẩn xác.
   - Thử gửi form và kiểm tra ghi nhận vào CRM Google Sheets.
