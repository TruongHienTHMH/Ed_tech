## 1. Tóm tắt nội dung (Summary)
Mô tả ngắn gọn mục tiêu, bối cảnh và giá trị mà đợt cập nhật này mang lại cho dự án.

## 2. Yêu cầu & Nghiệp vụ liên quan (Related Requirements)
- Mã phân hệ / Tính năng: Mxx
- Các quy tắc nghiệp vụ tuân thủ: BR-xx
- Yêu cầu phi chức năng (NFR): LCP < 1.2s, bảo mật PII, chống spam 3 lớp...

## 3. Danh mục các thay đổi (Changes Made)
- [ ] Giao diện người dùng (Frontend changes)
- [ ] Xử lý logic & API (Backend/API changes)
- [ ] Cấu trúc dữ liệu & Bảng Google Sheets (Database / CMS changes)
- [ ] Cập nhật tài liệu kỹ thuật & Hướng dẫn vận hành (Documentation updates)

## 4. Kết quả kiểm thử & Đo kiểm (Testing)
- [ ] Đã kiểm thử đầy đủ trên môi trường nội bộ (Local environment)
- [ ] Các tính năng hiện hữu không bị ảnh hưởng (Regression free)
- [ ] Đã kiểm tra kỹ các trạng thái tải (Loading), báo lỗi (Error) và rỗng (Empty)
- [ ] Bảo mật tuyệt đối: Không để lộ biến môi trường `.env` hoặc thông tin nhạy cảm
- [ ] Kiểm tra kiểu dữ liệu TypeScript (`npx tsc --noEmit`) đạt 0 lỗi
- [ ] Kiểm tra chuẩn code (`npm run lint`) đạt 0 lỗi
- [ ] Biên dịch thành công 100% routes (`npm run build`)

## 5. Bằng chứng giao diện & Đối soát Figma (UI Evidence)
- Liên kết thiết kế Figma chính thức: [Node Link]
- Mô tả trực quan hoặc ảnh chụp màn hình kiểm định.

## 6. Ghi chú dành cho Khách hàng / Người duyệt (Client & Reviewer Notes)
Các hướng dẫn trải nghiệm thực tế và những lưu ý vận hành quan trọng dành cho Chị Ly và Stakeholders.

## 7. Danh sách kiểm tra nghiệm thu (Checklist)
- [ ] Tên nhánh tuân thủ quy chuẩn dự án (`feature/...`)
- [ ] Mã nguồn tuân thủ nghiêm ngặt tiêu chuẩn kiến trúc và định lý CAP
- [ ] Tài liệu thuyết minh đầy đủ, trung thực, rõ ràng bằng tiếng Việt
- [ ] Không commit trực tiếp vào nhánh `main`
- [ ] Sẵn sàng để đối tác và đội ngũ kỹ thuật nghiệm thu

