# Thư Mục Bàn Giao & Quy Trình Vận Hành (Handover & Client Operations)

- **Mục đích:** Lưu trữ toàn bộ các tài liệu bàn giao kỹ thuật, checklist môi trường và **Sổ tay quy trình vận hành ứng dụng dành riêng cho Khách hàng (Founder Hứa Thảo Ly & Đội ngũ vận hành DataWithLy)**.
- **Trạng thái:** Sẵn sàng bàn giao (Approved for Handover)
- **Người lập:** TechLead & Project Assistant
- **Ngày cập nhật:** 2026-11-04
- **Nguồn tham khảo:** 
  - [Quy tắc nghiệp vụ BR-13](../02-domain/business-rules.md)
  - [Module Quản lý nội dung (M05)](../03-modules/M05-content-management/README.md)
  - [Module Thiết lập kết nối (M00)](../03-modules/M00-setup-and-connectivity/README.md)

---

## 1. Danh mục Tài liệu trong Thư mục

| Tên tài liệu | Đối tượng sử dụng | Trọng tâm nội dung |
|---|---|---|
| **[client-operations-guide.md](client-operations-guide.md)** | **Chị Hứa Thảo Ly & Biên tập viên** | **Sổ tay Vận hành Toàn diện:** Hướng dẫn chi tiết từng bước (Step-by-step) cách thêm khóa học mới, chỉnh sửa đề cương với `Alt+Enter`, kiểm tra lỗi dữ liệu, đồng bộ 1-click lên website, và quản lý danh sách học viên đăng ký tư vấn. |
| **[technical-handover-checklist.md](technical-handover-checklist.md)** | **TechLead, DevOps & Developer tiếp quản** | **Checklist Bàn giao Kỹ thuật:** Danh mục biến môi trường, phân quyền tài khoản Google Service Account, cấu hình tên miền DNS, tài khoản Vercel, và quy trình chuyển đổi Staging sang Production. |

---

## 2. Nguyên tắc Vận hành Cốt lõi dành cho Người dùng

1. **Vận hành Song Song Linh Hoạt (Hybrid Operations - BR-13):**
   - Bạn có thể thao tác tiện lợi qua thanh menu **`[🚀 DataWithLy CMS]`** ngay trên Google Sheets (được hệ thống tự động kiểm tra lỗi).
   - Hoặc có thể gõ chỉnh sửa nhanh trực tiếp trên ô (Direct Cell Edit) khi muốn sửa lỗi chính tả hay cập nhật văn bản ngắn.
2. **Luôn chạy "Kiểm Tra Lỗi Dữ Liệu" trước khi Xuất bản:**
   - Để đảm bảo website luôn hoạt động mượt mà và không bao giờ bị lỗi ảnh hay lệch dòng.
3. **Bảo mật Thông tin Học viên Tuyệt đối:**
   - File Google Sheets chứa dữ liệu Lead được bảo vệ bằng quyền riêng tư của tài khoản Google Workspace cá nhân; tuyệt đối không chia sẻ quyền truy cập công khai ra ngoài.

---

[Quay về điểm bắt đầu của bộ docs](../README.md)

