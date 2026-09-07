# Demo website khóa học với Git-based CMS

Demo này dùng **Astro + Pages CMS + GitHub + Cloudflare Pages**. Nội dung khóa học, lộ trình và mentor được lưu trong repository; website được tạo thành các trang tĩnh nhanh, nhẹ và không cần database.

## Phạm vi demo

- Homepage responsive.
- Tối đa 6 khóa học, 6 lộ trình và 6 mentor trên Homepage.
- Khi chỉ có 1–2 mục, card được căn giữa; 3 mục tạo một hàng; 4–6 mục tự chia lưới responsive.
- Trang chi tiết riêng cho từng khóa học và lộ trình.
- Nút tư vấn mở popup QR/link Zalo.
- Có trạng thái rỗng nếu chưa xuất bản nội dung.
- Không có đăng nhập học viên, học phí, thanh toán hay LMS.

## Chạy thử trên máy

Yêu cầu Node.js phiên bản LTS mới.

```bash
npm install
npm run dev
```

Kiểm tra bản đưa lên hosting:

```bash
npm run build
npm run preview
```

Thư mục kết quả là `dist`.

## Thiết lập Pages CMS cho client

1. Tạo repository GitHub thuộc tài khoản hoặc Organization của client.
2. Đưa toàn bộ thư mục dự án lên repository, bảo đảm file `.pages.yml` nằm ở thư mục gốc.
3. Client đăng nhập [Pages CMS](https://app.pagescms.org/) bằng GitHub và cấp quyền cho đúng repository.
4. Chọn repository. Menu quản trị sẽ có **Khóa học**, **Lộ trình** và **Mentor**.
5. Khi client bấm lưu, Pages CMS tạo commit trong GitHub; Cloudflare Pages tự build và cập nhật website.

Client có thể thêm/sửa/ẩn nội dung, tải ảnh và đổi thứ tự. Client không thể kéo-thả thay đổi toàn bộ bố cục; thay đổi giao diện cần developer sửa code.

## Cách chỉnh nội dung

### Khóa học

Vào **Khóa học → New entry** và nhập đủ trường. `Hiển thị = bật` thì khóa học xuất hiện; `Thứ tự` nhỏ hơn sẽ đứng trước. Tên file được dùng làm URL, nên viết không dấu và dùng dấu gạch ngang, ví dụ `backend-nodejs`.

### Lộ trình

Vào **Lộ trình → New entry**, nhập các bước theo đúng thứ tự. Trang chi tiết được tạo tự động sau khi website build lại.

### Mentor

Vào **Mentor → New entry**. Homepage chỉ lấy tối đa 6 mentor đang bật `Hiển thị`.

### Ảnh và Zalo

- Ảnh client tải lên được lưu trong `public/uploads`.
- Thay logo demo trong `src/layouts/BaseLayout.astro`.
- Đặt QR thật tại `public/uploads/zalo-qr.png`, sau đó thay khối placeholder trong `src/layouts/BaseLayout.astro` bằng thẻ ảnh.
- Thay `https://zalo.me/` bằng đường dẫn Zalo chính thức.

## Deploy Cloudflare Pages

1. Client đăng nhập Cloudflare → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
2. Chọn repository GitHub của client.
3. Cấu hình:
   - Framework preset: `Astro`
   - Build command: `npm run build`
   - Build output directory: `dist`
4. Deploy. Sau đó gắn domain riêng trong **Custom domains**.

Mỗi lần Pages CMS lưu nội dung, GitHub thay đổi và Cloudflare tự build lại. Đây không phải cập nhật ngay tức thì: thời gian thường phụ thuộc hàng đợi và thời gian build, thường khoảng một vài phút.

## Quyền sở hữu nên bàn giao

- GitHub repository: client sở hữu, freelancer được mời làm collaborator.
- Cloudflare account và domain: client sở hữu và thanh toán trực tiếp.
- Pages CMS: client đăng nhập bằng GitHub của mình.
- Source code, nội dung và ảnh: nằm trong repository của client.

## Giới hạn cần nói rõ

- Pages CMS là trình quản lý **nội dung**, không phải công cụ thiết kế kéo-thả.
- Thêm nội dung sẽ kích hoạt một lần build; số lượt build chịu hạn mức của Cloudflare Pages/GitHub theo gói tại thời điểm sử dụng.
- Hệ thống hiện không có database, tài khoản học viên, thanh toán, phân quyền nghiệp vụ hoặc theo dõi tiến độ học.
- Nội dung do client nhập cần được kiểm tra bản quyền ảnh và thông tin mentor.
- Demo dùng tên/logo giả `EduPath`; cần thay bộ nhận diện thật trước khi phát hành.

## File quan trọng

- `.pages.yml`: cấu hình màn hình quản trị Pages CMS.
- `src/content.config.ts`: kiểm tra cấu trúc dữ liệu trước khi build.
- `src/content/courses`: dữ liệu và nội dung chi tiết khóa học.
- `src/content/roadmaps`: dữ liệu và nội dung chi tiết lộ trình.
- `src/content/mentors`: dữ liệu mentor.
- `src/pages/index.astro`: Homepage.
- `src/pages/courses/[id].astro`: mẫu trang chi tiết khóa học.
- `src/pages/roadmaps/[id].astro`: mẫu trang chi tiết lộ trình.
- `src/styles/global.css`: giao diện và responsive.
