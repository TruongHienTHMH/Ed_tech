# Tiêu Chuẩn NFR: Khả Năng Sử Dụng & Trải Nghiệm UI/UX (Usability & Ergonomics)

- **Mục đích:** Đặc tả các yêu cầu phi chức năng về khả năng sử dụng, tính thẩm mỹ, độ tiện dụng trên thiết bị di động cho Học viên và công thái học quản trị "Dễ xài — Dễ hiểu — Logic — Thân thiện" cho Chị Ly & Biên tập viên.
- **Trạng thái:** Sẵn sàng triển khai (Approved for Implementation)
- **Người quản lý:** TechLead & Frontend Agent
- **Ngày cập nhật:** 2026-11-04
- **Nguồn tham khảo:** 
  - [Biên bản hỏi đáp dự án](../references/project-qa.md)
  - [Biên bản yêu cầu bổ sung](../references/additional-requirements.md)
  - [Quy tắc Design System & 4-Point Spacing](../07-architecture/design-system-rules.md)
  - [Sổ tay vận hành cho Khách hàng](../09-handover/client-operations-guide.md)
  - Bản vẽ Figma: `https://www.figma.com/design/epfQwa5s3iMO6toM4Fmmpu/Hien-Ed_TECH?node-id=0-1&m=dev`

---

## 1. Bảng Tiêu Chuẩn Chi Tiết (NFR-USABILITY-001 đến NFR-USABILITY-010)

| Mã NFR | Tiêu chuẩn chất lượng | Đối tượng | Ngưỡng đo lường & Hành vi bắt buộc | Phương pháp & Công cụ kiểm tra | Mức ưu tiên |
|:---:|---|:---:|---|---|:---:|
| **NFR-USABILITY-001** | **Đáp ứng Màn hình (Responsive)** | Toàn bộ giao diện | Hiển thị hoàn hảo trên Mobile (`< 768px`), Tablet (`768px - 1023px`) và Desktop (`>= 1024px`). Tuyệt đối không xuất hiện thanh cuộn ngang ngoài ý muốn (`overflow-x: hidden`). | Chrome DevTools Device Mode (iPhone 14, Pixel 7, iPad Air, Macbook 14"). | **P0** |
| **NFR-USABILITY-002** | **Quy chuẩn 4-Point Spacing** | Toàn bộ thành phần UI | 100% khoảng cách (padding, margin, gap, kích thước nút) tuân thủ nghiêm ngặt bội số của 4px (`4, 8, 12, 16, 20, 24, 32, 40, 48, 64px`). Không dùng giá trị lẻ (`p-[13px]`, `gap-[7px]`). | Kiểm tra mã nguồn CSS/Tailwind, Linter kiểm tra token. | **P0** |
| **NFR-USABILITY-003** | **Kích thước Chạm Di động (Tap Target)** | Nút bấm, Link, Icon | Kích thước vùng bấm tối thiểu đạt **44 x 44 pixel** (theo chuẩn thiết kế Apple iOS HIG và Google Material Design) để ngón tay cái bấm dễ dàng, không bấm nhầm. | Lighthouse Accessibility Audit (tiêu chí "Tap targets are sized appropriately"). | **P0** |
| **NFR-USABILITY-004** | **Nút Hành Động Nhanh (Mobile Quick Actions)** | Mobile Drawer Menu | Trên màn hình di động, Drawer Menu bắt buộc trang bị **2 nút hành động trực tiếp**: nút **[Gọi Hotline: 0934752432]** (`tel:0934752432`) và nút **[Chat Zalo]** mở Zalo OA/Chat. | Thao tác chạm trực tiếp trên điện thoại thật, kiểm tra mở ứng dụng gọi điện và Zalo. | **P0** |
| **NFR-USABILITY-005** | **Bảo Toàn Dữ Liệu Form (Form Persistence)** | Form Tư vấn (M04) | Khi người dùng đang điền thông tin mà vô tình bấm F5 (Reload), chuyển tab hoặc mạng bị ngắt, 100% dữ liệu đã gõ được tự động khôi phục từ `sessionStorage` khi mở lại form. | Nhập form dở dang ➔ Bấm F5 ➔ Mở lại form kiểm tra các ô input được điền sẵn. | **P0** |
| **NFR-USABILITY-006** | **Báo Lỗi Tiếng Việt Tại Chỗ (Inline Validation)** | Ô nhập liệu Form | Báo lỗi ngay khi người dùng rời khỏi ô input (`onBlur`) bằng tiếng Việt chuẩn mực, rõ ràng (vd: *"Số điện thoại di động Việt Nam không hợp lệ (10 số, đầu 03, 05, 07, 08, 09)"*). Không dùng popup cảnh báo thô (`alert`). | Test cases kiểm thử các trường hợp nhập sai SĐT, email sai định dạng, bỏ trống họ tên. | **P0** |
| **NFR-USABILITY-007** | **Tiếp Cận Chuẩn WCAG 2.1 Cấp độ AA** | Toàn bộ trang web | • Độ tương phản màu chữ Crimson `#8B1D2C` trên nền trắng đạt **>= 4.5:1**.<br>• Hỗ trợ phím `Tab` duyệt tuần tự qua các thành phần tương tác.<br>• Phím `Escape` đóng ngay lập tức bất kỳ Modal nào đang mở. | Công cụ axe DevTools, Lighthouse Accessibility score >= 95 điểm, kiểm thử bàn phím thuần. | **P1** |
| **NFR-USABILITY-008** | **Chống Giật Khung Hình (Skeleton Loaders)** | Trạng thái tải trang | Tuyệt đối không dùng vòng quay spinner toàn màn hình gây sốt ruột. Sử dụng bộ khung xương giả lập (Skeleton với hiệu ứng `animate-pulse`) giữ nguyên kích thước bố cục, bảo đảm điểm CLS < 0.05. | Làm chậm mạng (Throttling Slow 3G) trong Network tab, quan sát quá trình render layout. | **P1** |
| **NFR-USABILITY-009** | **Tương Tác Vi Mô (Micro-interactions)** | Khối Code & Đọc bài | • Nút **[Sao chép mã]** ở góc code block SQL/Python đổi sang chữ *"Đã chép!"* trong 2 giây khi bấm.<br>• Dải **Reading Progress Bar** ở đỉnh màn hình tăng giảm mượt mà theo độ cuộn bài viết.<br>• Đề cương môn học mở rộng/thu gọn với hiệu ứng chuyển động nhẹ nhàng. | Thao tác người dùng trực quan trên giao diện desktop và mobile. | **P1** |
| **NFR-USABILITY-010** | **Công Thái Học Quản Trị (Admin Ergonomics)** | Menu Quản trị CMS | Giao diện quản trị cho Chị Ly trên Google Sheets đạt tiêu chí **"Dễ xài — Dễ hiểu — Logic — Thân thiện"**:<br>• Dropdown chọn khóa học thay vì bắt gõ mã ID.<br>• Tự động chuẩn hóa tiền tệ (`2.990.000` hay `2990000`).<br>• Tự động chuyển đổi xuống dòng bullets `\n` (`Alt+Enter`).<br>• Xóa mềm (Soft Delete) an toàn, có hộp thoại xác nhận. | Thử nghiệm thực tế bởi Chị Ly và Biên tập viên theo [Sổ tay Vận hành](../09-handover/client-operations-guide.md). | **P0** |

---

## 2. Tiêu Chuẩn Công Thái Học Quản Trị Chi Tiết Cho Chị Ly (Admin Ergonomics)

Để Chị Ly và đội ngũ biên tập viên cảm thấy thao tác "mượt tay", hệ thống tuân thủ 4 nguyên tắc thiết kế nhân bản (Human-Centered Design):

```
                       ┌─────────────────────────────────────────┐
                       │  CÔNG THÁI HỌC QUẢN TRỊ (ADMIN UX)     │
                       └────────────────────┬────────────────────┘
                                            │
        ┌───────────────────┬───────────────┴───────────────┬───────────────────┐
        ▼                   ▼                               ▼                   ▼
┌───────────────┐   ┌───────────────┐               ┌───────────────┐   ┌───────────────┐
│   1. DỄ XÀI   │   │   2. DỄ HIỂU  │               │   3. LOGIC    │   │ 4. THÂN THIỆN │
├───────────────┤   ├───────────────┤               ├───────────────┤   ├───────────────┤
│ • Dropdown ID │   │ • 100% Tiếng  │               │ • Luồng tự    │   │ • Soft Delete │
│ • Auto-format │   │   Việt rõ chữ │               │   nhiên       │   │ • Data Linter │
│ • Placeholder │   │ • Giải thích  │               │ • Tự gợi ý    │   │ • Xác nhận    │
│   gợi ý mẫu   │   │   lỗi cụ thể  │               │   khóa ngoại  │   │   khi ẩn khóa │
└───────────────┘   └───────────────┘               └───────────────┘   └───────────────┘
```

1. **Dễ Xài (Effortless Input):**
   - Không bắt người dùng nhớ các chuỗi kỹ thuật như `sql-for-data-analytics`. Khi thêm buổi học đề cương, form hiển thị danh sách thả xuống: `[SQL for Data Analytics]`, `[Analytical Thinking & Dashboard Design]`, `[End-to-End Analytics]`.
   - Trường học phí thông minh: Chị Ly gõ `2990000` hay gõ `2.990.000 VNĐ` thì script đều tự động làm sạch thành số nguyên chuẩn `2990000`.
2. **Dễ Hiểu (Clarity over Complexity):**
   - Trạng thái rõ nghĩa: Thay vì hiển thị mã boolean `TRUE/FALSE`, giao diện quản trị hiển thị nhãn màu xanh lá `[Đang tuyển sinh]` và màu xám `[Tạm dừng]`.
   - Khi phát sinh lỗi, thông báo hiển thị chỉ dẫn hành động rõ ràng: *"Ô C5 trong tab Courses đang để trống học phí ưu đãi. Bạn vui lòng điền số tiền trước khi xuất bản nhé!"*.
3. **Logic & Nhất Quán (Natural Flow):**
   - Quy trình làm việc đi từ tổng quan đến chi tiết: Khởi tạo thông tin khóa học ➔ Soạn đề cương từng buổi ➔ Chạy Data Linter ➔ Bấm Đồng bộ lên Website.
4. **Thân Thiện & An Tâm (Forgiving UI):**
   - Không có nút xóa vĩnh viễn (Hard Delete) trên menu. Mọi thao tác xóa đều là **Soft Delete** chuyển trạng thái sang `ARCHIVED` để Chị Ly không bao giờ phải lo lắng về việc bấm nhầm làm mất dữ liệu học viên hay đề cương cũ.

---

## 3. Kịch Bản & Tiêu Chí Nghiệm Thu (Acceptance Criteria)

| Mã AC | Yêu cầu kiểm tra | Thao tác thực hiện | Kết quả kỳ vọng đạt |
|---|---|---|---|
| **AC-USABILITY-01** | Co giãn màn hình | Mở website trên iPhone 14 Pro Max và cuộn từ đầu đến chân trang. | Không có thanh cuộn ngang, phông chữ dễ đọc, hình ảnh không bị méo tỉ lệ, khối dự án học viên vuốt ngang mượt mà. |
| **AC-USABILITY-02** | Bấm Hotline & Zalo Mobile | Mở Drawer Menu trên điện thoại ➔ Bấm nút [Gọi Hotline] ➔ Bấm nút [Chat Zalo]. | Điện thoại tự động bật trình quay số `0934752432`; nút Zalo mở ứng dụng Zalo dẫn tới kênh tư vấn DataWithLy. |
| **AC-USABILITY-03** | Khôi phục Form | Mở Modal Lead Form ➔ Nhập Họ tên, Email, SĐT ➔ Đóng tab trình duyệt ➔ Mở lại website và bấm [Tư vấn]. | Toàn bộ Họ tên, Email, SĐT vừa nhập hiển thị nguyên vẹn trong ô input. |
| **AC-USABILITY-04** | Kiểm thử bàn phím Tab | Không dùng chuột, chỉ dùng phím `Tab` để di chuyển từ đầu trang đến nút [Tư vấn ngay] và nhấn `Enter`. | Viền sáng focus (`ring-2 ring-crimson-600`) hiển thị rõ ràng trên từng nút bấm; phím Enter kích hoạt mở Modal thành công; phím `Escape` đóng modal ngay lập tức. |
| **AC-USABILITY-05** | Quản trị viên nhập dữ liệu | Chị Ly mở menu `[DataWithLy CMS] > 📚 Thêm Buổi Học Đề Cương` ➔ Chọn khóa học từ Dropdown ➔ Nhập 3 gạch đầu dòng ➔ Bấm Lưu. | Dòng mới được thêm vào đúng vị trí trong tab `curriculum`, không phát sinh lỗi lệch cột hay mất dòng. |

---

[Quay lại Mục lục NFR](README.md) | [Đến NFR Hiệu năng](performance.md)
