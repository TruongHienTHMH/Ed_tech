# Quy trình phát triển và duyệt

- **Mục đích:** Định nghĩa đầu vào, đầu ra và điểm duyệt.
- **Trạng thái:** Draft
- **Người duyệt:** TBD
- **Ngày cập nhật:** 2026-10-27
- **Nguồn tham khảo:** [Quy trình triển khai](delivery-process.md)
- **Câu hỏi còn mở:** Q-10. [Danh sách câu hỏi](open-questions.md)

> Đây là khung tài liệu. TBD là nội dung chưa chốt; việc có file không đồng nghĩa yêu cầu được duyệt hoặc tính năng đã hoàn thành.

## Các bước

| Bước | Công việc | Đầu ra | Điểm duyệt |
|---|---|---|---|
| 1 | Chốt kế hoạch | Cây thư mục, module, mức chi tiết | Người dùng đã yêu cầu triển khai kế hoạch |
| 2 | Tạo docs/template và kiểm tra | Bộ khung review được | Chủ dự án duyệt khung; chưa phải duyệt yêu cầu |
| 3 | Làm rõ sản phẩm/nghiệp vụ | Màn hình, nội dung, CTA, nguồn dữ liệu | Chủ dự án chốt phạm vi |
| 4 | Hoàn thiện PRD, workflow, kiến trúc, NFR, nghiệm thu | Đặc tả có truy vết | Chủ dự án duyệt yêu cầu; tech lead rà khả thi |
| 5 | Chia task và phụ thuộc | Task đủ đầu vào/AC | Tech lead kiểm tra điều kiện bắt đầu |
| 6 | Agent code, kiểm tra, review | Code và bằng chứng trên preview | Review kỹ thuật, chủ dự án duyệt preview |
| 7 | Chuẩn bị phát hành | Cấu hình, checklist, rollback, kiểm tra sau triển khai | Chủ dự án duyệt production |

Đợt hiện tại chỉ thực hiện bước 2; bước 3–7 là quy trình tương lai.

## Duyệt và thay đổi

Draft → In Review → Approved. Ghi người duyệt, ngày, phiên bản/phạm vi và bằng chứng. Không tự chuyển Approved. Phần yêu cầu đã duyệt khi thay đổi phải ghi ảnh hưởng và đưa phần sửa về Draft để review lại.

## Điều kiện giao Agent

Đầu vào liên quan đã duyệt, phạm vi rõ, AC đo được và không còn câu hỏi/TBD chặn phần việc. Đọc [AGENTS.md](../../AGENTS.md) và hướng dẫn Next.js cục bộ trước khi code. Không suy ra phê duyệt từ file tồn tại hoặc checklist đã tick.

## Bàn giao

Báo cáo thay đổi, AC đáp ứng, kiểm tra thực sự đã chạy, kết quả, giới hạn và bằng chứng. Cập nhật [ma trận truy vết](../06-acceptance/traceability-matrix.md). Chưa chạy thì không đánh dấu đạt.

## Mẫu ghi nhận duyệt

| Tài liệu/phạm vi/phiên bản | Người duyệt | Ngày | Quyết định | Bằng chứng | Điều kiện còn lại |
|---|---|---|---|---|---|
| TBD | TBD | TBD | TBD | TBD | TBD |

---

[Điểm bắt đầu của bộ docs](../README.md)
