# DataWithLy — Điểm bắt đầu cho Agent

- **Mục đích:** Điều hướng tài liệu, thứ tự đọc và điều kiện triển khai.
- **Trạng thái:** Draft
- **Người duyệt:** TBD
- **Ngày cập nhật:** 2026-10-27
- **Nguồn tham khảo:** [Hướng dẫn repository](../AGENTS.md); [Quy trình](08-project/delivery-process.md)
- **Câu hỏi còn mở:** Q-01 đến Q-10. [Danh sách câu hỏi](08-project/open-questions.md)

> Đây là khung tài liệu. TBD là nội dung chưa chốt; việc có file không đồng nghĩa yêu cầu được duyệt hoặc tính năng đã hoàn thành.

## Phạm vi hiện tại

Kế hoạch tạo khung đã được yêu cầu triển khai. Bộ docs ở Draft để review; chưa xác nhận yêu cầu chi tiết hoặc tính năng hoàn thành. Chỉ tạo tài liệu, không thay đổi ứng dụng/API/cấu hình triển khai.

## Bản đồ 8 nhóm

- [01-product — Sản phẩm](01-product/product-overview.md).
- [Hướng dẫn tự viết nhóm 01-product](01-product/WRITING-GUIDE.md).
- [02-domain — Nghiệp vụ](02-domain/domain-overview.md).
- [03-modules — Module](03-modules/M01-homepage/README.md).
- [04-workflows — Luồng nghiệp vụ](04-workflows/README.md).
- [05-non-functional-requirements — Chất lượng](05-non-functional-requirements/README.md).
- [06-acceptance — Nghiệm thu](06-acceptance/README.md).
- [07-architecture — Kiến trúc](07-architecture/README.md).
- [08-project — Quản lý và quy trình](08-project/delivery-process.md).

## Thứ tự đọc

1. [AGENTS.md](../AGENTS.md), tài liệu này và [quy trình](08-project/delivery-process.md).
2. Product, [ràng buộc](08-project/constraints.md), [giả định](08-project/assumptions.md), [câu hỏi mở](08-project/open-questions.md).
3. Domain, README/PRD của module, workflow liên quan.
4. Kiến trúc, ADR được duyệt và NFR áp dụng.
5. Acceptance, ma trận truy vết và task theo [template](08-project/agent-task-template.md).

Trước khi code Next.js đọc hướng dẫn liên quan trong node_modules/next/dist/docs/ theo AGENTS.md. Chỉ triển khai phần có đầu vào được duyệt; dừng phần phụ thuộc TBD/câu hỏi mở, tiếp tục phần độc lập đủ điều kiện.

## Quy ước và nguồn sự thật

- Nội dung tiếng Việt; tên file/mã tiếng Anh; thương hiệu DataWithLy.
- Draft → In Review → Approved; cần người, ngày và bằng chứng duyệt. Duyệt khung không đồng nghĩa duyệt tính năng.
- TBD là chưa chốt; XXX trong mã là mẫu, không phải yêu cầu thật.
- [Hiện trạng kiến trúc](07-architecture/architecture-overview.md) dựa trên kiểm tra tĩnh, chưa phải kiểm thử runtime.
- Nguồn mâu thuẫn thì ghi câu hỏi và xin xác nhận; không tự chọn tài liệu cũ làm yêu cầu mới.

## Tài liệu cũ cần đối chiếu

[Report_SetUpPRD](references/initial-product-report.md), [báo cáo giải pháp](references/solution-and-scope-report.md), [CheckList](references/additional-requirements.md), [Q.A](references/project-qa.md) là nguồn tham khảo cần xác minh. Dấu tick/cam kết không chứng minh tính năng hoàn thành. Bảo toàn nội dung tài liệu gốc; các file đã được gom và đổi tên theo yêu cầu. Xem [mục lục tài liệu tham khảo](references/README.md).

## Danh mục file

- [01-product/WRITING-GUIDE.md](01-product/WRITING-GUIDE.md)
- [01-product/actors-and-roles.md](01-product/actors-and-roles.md)
- [01-product/goals-and-non-goals.md](01-product/goals-and-non-goals.md)
- [01-product/problem-statement.md](01-product/problem-statement.md)
- [01-product/product-overview.md](01-product/product-overview.md)
- [01-product/product-scope.md](01-product/product-scope.md)
- [02-domain/business-rules.md](02-domain/business-rules.md)
- [02-domain/content-lifecycle.md](02-domain/content-lifecycle.md)
- [02-domain/course-model.md](02-domain/course-model.md)
- [02-domain/domain-overview.md](02-domain/domain-overview.md)
- [02-domain/lead-lifecycle.md](02-domain/lead-lifecycle.md)
- [02-domain/terminology.md](02-domain/terminology.md)
- [03-modules/M01-homepage/README.md](03-modules/M01-homepage/README.md)
- [03-modules/M01-homepage/prd.md](03-modules/M01-homepage/prd.md)
- [03-modules/M02-course-details/README.md](03-modules/M02-course-details/README.md)
- [03-modules/M02-course-details/prd.md](03-modules/M02-course-details/prd.md)
- [03-modules/M03-blog/README.md](03-modules/M03-blog/README.md)
- [03-modules/M03-blog/prd.md](03-modules/M03-blog/prd.md)
- [03-modules/M04-lead-capture/README.md](03-modules/M04-lead-capture/README.md)
- [03-modules/M04-lead-capture/prd.md](03-modules/M04-lead-capture/prd.md)
- [03-modules/M05-content-management/README.md](03-modules/M05-content-management/README.md)
- [03-modules/M05-content-management/prd.md](03-modules/M05-content-management/prd.md)
- [04-workflows/README.md](04-workflows/README.md)
- [04-workflows/WF-01-explore-courses.md](04-workflows/WF-01-explore-courses.md)
- [04-workflows/WF-02-view-course-details.md](04-workflows/WF-02-view-course-details.md)
- [04-workflows/WF-03-submit-consultation.md](04-workflows/WF-03-submit-consultation.md)
- [04-workflows/WF-04-read-blog.md](04-workflows/WF-04-read-blog.md)
- [04-workflows/WF-05-publish-content.md](04-workflows/WF-05-publish-content.md)
- [05-non-functional-requirements/README.md](05-non-functional-requirements/README.md)
- [05-non-functional-requirements/deployment.md](05-non-functional-requirements/deployment.md)
- [05-non-functional-requirements/observability.md](05-non-functional-requirements/observability.md)
- [05-non-functional-requirements/performance.md](05-non-functional-requirements/performance.md)
- [05-non-functional-requirements/reliability.md](05-non-functional-requirements/reliability.md)
- [05-non-functional-requirements/security.md](05-non-functional-requirements/security.md)
- [05-non-functional-requirements/seo.md](05-non-functional-requirements/seo.md)
- [05-non-functional-requirements/usability.md](05-non-functional-requirements/usability.md)
- [06-acceptance/README.md](06-acceptance/README.md)
- [06-acceptance/test-scenarios.md](06-acceptance/test-scenarios.md)
- [06-acceptance/traceability-matrix.md](06-acceptance/traceability-matrix.md)
- [07-architecture/README.md](07-architecture/README.md)
- [07-architecture/api-design.md](07-architecture/api-design.md)
- [07-architecture/architecture-overview.md](07-architecture/architecture-overview.md)
- [07-architecture/data-model.md](07-architecture/data-model.md)
- [07-architecture/security-design.md](07-architecture/security-design.md)
- [07-architecture/system-context.md](07-architecture/system-context.md)
- [07-architecture/technical-decisions/README.md](07-architecture/technical-decisions/README.md)
- [08-project/agent-task-template.md](08-project/agent-task-template.md)
- [08-project/assumptions.md](08-project/assumptions.md)
- [08-project/constraints.md](08-project/constraints.md)
- [08-project/delivery-process.md](08-project/delivery-process.md)
- [08-project/glossary.md](08-project/glossary.md)
- [08-project/open-questions.md](08-project/open-questions.md)

## Nghiệm thu bộ khung

Kiểm tra đủ 8 nhóm, hai file mỗi module, liên kết, metadata, truy vết và câu hỏi tập trung. Bàn giao chủ dự án review khung trước bước 3.

---

[Điểm bắt đầu của bộ docs](README.md)

## Ghi chú trao đổi ngày 2026-10-28

[Yêu cầu khách hàng và phương án để viết PD](08-project/customer-requirements-notes.md). Bộ ghi chú được lưu local trong .docs; chưa thay thế PRD hoặc quyết định kiến trúc đã duyệt.
