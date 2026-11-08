# Phương án hosting và CI/CD

- **Ngày cập nhật:** 2026-10-28
- **Trạng thái:** Draft — ghi nhận yêu cầu và đề xuất, chưa triển khai.
- **Người duyệt phương án:** TBD.
- **Nguồn:** Nhận xét của chủ dự án ngày 2026-10-28 và các liên kết chính thức trong bài; quota/giá cần kiểm tra lại trước phát hành.

## Trạng thái

Đề xuất để đánh giá, chưa chọn nhà cung cấp hoặc triển khai. Ưu tiên chi phí bổ sung thấp nhưng phải phù hợp website thương mại và runtime của dự án.

## Phân biệt công cụ

- GitHub Actions chạy build/test/deploy; không phải nơi giữ ứng dụng hoạt động liên tục. Standard runners cho repository public được miễn phí; private có hạn mức theo gói. [GitHub Actions billing](https://docs.github.com/en/actions/concepts/billing-and-usage).
- github.io là domain mặc định của GitHub Pages, nơi phục vụ website tĩnh. Không chạy được POST API Next.js tại đó. Pages hạn chế việc dùng làm hosting miễn phí để vận hành kinh doanh/giao dịch thương mại; không chọn làm phương án chính cho website tuyển sinh này. [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits).
- Domain .io nói chung không phải dịch vụ deploy miễn phí.

## Các phương án

| Phương án | Lợi ích | Đánh đổi và việc phải kiểm chứng |
|---|---|---|
| Cloudflare Workers + đường triển khai Next.js được hỗ trợ | Có runtime cho API và gói Free; ứng viên ưu tiên thử | Kiểm chứng Next.js 16.3.4, build/runtime, quota CPU và tính năng dùng thực tế; chưa coi tương thích được bảo đảm |
| Cloudflare Pages tĩnh + Worker API riêng | Tách trang nội dung khỏi API; hosting tĩnh tiết kiệm | Phải chuyển sang static export và tách POST API; nội dung thay đổi có thể cần rebuild; không chạy nguyên ứng dụng server hiện tại |
| Vercel gói thương mại | Phương án để so sánh công vận hành | Cần ngân sách; không dựa trên Hobby cho website thương mại |

Cloudflare hiện hướng dẫn Next.js trên Workers, với vinext là đường khuyến nghị trong tài liệu đã kiểm tra; OpenNext là một đường khác được ghi nhận. Không tự chuyển framework/adapter trong task tài liệu. Thử nghiệm tương thích phải được duyệt riêng. [Hướng dẫn Next.js](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/).

Workers Free công bố 100.000 request động/ngày và giới hạn CPU/tài nguyên; request tài nguyên tĩnh được tính khác. Đây không phải 100.000 người dùng/ngày. Pages Functions cũng dùng quota Workers. Không hứa miễn phí vô hạn hoặc có SLA từ gói Free. [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/), [limits](https://developers.cloudflare.com/workers/platform/limits/), [Pages Functions pricing](https://developers.cloudflare.com/pages/functions/pricing/).

Vercel Hobby giới hạn mục đích cá nhân, phi thương mại: [chính sách](https://vercel.com/docs/plans/hobby).

## Thử nghiệm tối thiểu trước quyết định

Build đúng phiên bản dự án; kiểm tra route/API, ảnh/font, 404 và cache; gửi lead giả vào Sheets thử; đo quota/CPU và latency; xác minh secret không lọt vào bundle; kiểm tra lỗi và đường rollback. Chọn hosting sau thử nghiệm và ước lượng tải, không dựa riêng vào số lượt xem.

## CI/CD đề xuất

PR → lint/typecheck/build và test trọng yếu → preview tách dữ liệu/GA4 → review → merge có kiểm tra bắt buộc → deploy production → smoke test/rollback nếu cần.

Dùng GitHub Actions hoặc tích hợp Git của hosting, tránh build trùng vô ích. Không có nhu cầu tự vận hành máy chủ CI ở giai đoạn đầu. Tài khoản/domain nên thuộc khách hàng, developer được cấp quyền phù hợp.
