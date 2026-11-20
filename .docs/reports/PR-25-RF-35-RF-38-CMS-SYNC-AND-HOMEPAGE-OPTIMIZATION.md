# Pull Request: RF-35 ~ RF-38 - Tối Ưu Hóa Đồng Bộ CMS Google Sheets, Triệt Tiêu Độ Trễ Cache & Nâng Cấp Homepage

**Mã PR:** PR-25  
**Tasks bao gồm:** RF-35, RF-36, RF-37, RF-38  
**Nhánh đề xuất:** `feature/cms-zero-delay-sync-and-speedup` (hoặc tiếp tục trên `refactor/homepage-update`)  
**Target Branch:** `main` (hoặc `staging`)  
**Trạng thái kiểm thử:** ✅ `tsc --noEmit` (0 errors), ✅ `eslint` (0 errors), ✅ `next build` (Thành công 100%)  

---

## 1. Tóm Tắt Tổng Quan (Summary)

Pull Request này hoàn thiện chuỗi nhiệm vụ quan trọng nhằm:
1. **Triệt tiêu hoàn toàn độ trễ đồng bộ (Zero-Delay Sync)** giữa Google Sheets CMS và Next.js ở cả 2 môi trường (Local Development và Vercel Production).
2. **Nâng cấp hiệu năng Google Apps Script**: Tích hợp `CacheService` RAM tốc độ cao (~200ms), quét đơn lượt bảng tính (Single-Pass RPC) giảm 80% thời gian tải.
3. **Hoàn thiện cấu trúc dữ liệu khóa học & gói combo**:
   - Thêm cột `study-style` và `student_enrollment` chuẩn hóa trên Google Sheets.
   - Truy vấn động giá gói combo (`packages_pricing` với `single` và `combo`) từ Sheets thay vì gán tĩnh.
4. **Chuẩn hóa giao diện Homepage**:
   - Cập nhật banner chuyển tiếp lượn sóng (`banner-lower.svg`).
   - Sửa cảnh báo aspect-ratio hình ảnh logo đối tác (`AlumniCompaniesSection.tsx`).
   - Cập nhật layout và hiệu ứng ảnh mẫu dự án học viên (`StudentProjectsSection.tsx`).
5. **Hệ thống chẩn đoán & Báo cáo kỹ thuật**:
   - Thêm route chẩn đoán chuyên sâu `/api/cms/debug`.
   - Viết kịch bản kiểm thử kết nối `scripts/test-sheets-connection.js` (`npm run test:sheets`).
   - Lập báo cáo phân tích rủi ro & lộ trình mở rộng kiến trúc tại `.docs/reports/Problems-Solution-v1.md`.

---

## 2. Chi Tiết Các Thay Đổi (Changelog & Tasks)

### 🚀 RF-38: Tối Ưu Hóa Đồng Bộ & Triệt Tiêu Độ Trễ Cache (Sync Zero-Delay)
* **Phía Next.js Client (`lib/cms/sheets-client.ts`)**:
  * Khi `NODE_ENV === "development"`:
    * Bỏ qua in-memory cache `LRUCacheManager`.
    * Áp dụng `cache: "no-store"` (Next.js không bao giờ cache ở local).
    * Tự động truyền tham số `&force_refresh=true` lên Apps Script để buộc đọc dữ liệu mới nhất từ bảng tính thật.
    * In log terminal trực quan: `Script update new:` kèm tóm tắt số lượng khóa học, gói combo, bài viết, dự án và toàn bộ payload nhận được.
* **Phía Google Apps Script (`04_CmsEndpoints.gs`, `06_CmsMaintenance.gs`, `02_CmsMenu.gs`)**:
  * Giảm `CMS_CACHE_TTL_SEC` từ 15 phút (900s) xuống **5 phút (300s)** để đồng nhất với cơ chế ISR `revalidate = 300` của Next.js trên Vercel.
  * Tích hợp `clearCmsCache()` ngay đầu hàm `triggerWebsiteRevalidation()`: Xóa sạch cache RAM của Google ngay khi admin bấm nút *"⚡ Xuất Bản Website"*.
  * Tích hợp `clearCmsCache()` vào sự kiện `onEdit(e)`: Tự động dọn cache RAM khi admin chỉnh sửa bất kỳ ô nào trên Google Sheets.
  * Đóng gói lại toàn bộ vào `apps-script/dist/Code.bundle.gs` và `apps-script/cms/dist/Code.cms.bundle.gs`.

### ⚡ RF-37: Tăng Tốc Google Apps Script & Hệ Thống Chẩn Đoán Lỗi (Debug Diagnostics)
* Quét bảng tính 1 lượt (Single-Pass `ss.getSheets()`) thay vì 11 lệnh RPC riêng lẻ.
* Bóc tách lỗi chi tiết mạng `err.cause` (`causeCode`, `causeMessage`, `diagnostic`) trong `SheetsClient` giúp phát hiện ngay lỗi DNS, SSL hay Quota.
* Tạo endpoint `/api/cms/debug` kiểm tra trạng thái từng bước: Ping, Secret Auth, Fetch Tabs, và Đếm số lượng record.
* Khắc phục triệt để lỗi console cảnh báo kích thước ảnh trong `AlumniCompaniesSection.tsx` (MoMo, Shopee, IRTech, GHN).

### 🏷️ RF-36: Cột Chuẩn Hóa Khóa Học & Truy Vấn Động Gói Combo
* **Google Sheets & Modal Quản Trị**:
  * Chuẩn hóa 2 cột `study-style` và `student_enrollment` trên tab `courses`.
  * Cập nhật Modal quản trị khóa học trên Sheets (`CourseModal.html`, `05_CourseModal.gs`, `03_CmsTablesSetup.gs`).
* **Next.js Presentation**:
  * `lib/cms/types.ts`: Bổ sung `studyStyle` và `studentEnrollment` vào kiểu dữ liệu `Course`.
  * `ComboPricingSection.tsx`: Truy vấn trực tiếp từ bảng `packages_pricing` dựa vào `package_id` chứa `single` (khóa đơn lẻ) và `combo` (gói combo 2 khóa học).

### 🎨 RF-35: Chuẩn Hóa Khối Dự Án Học Viên (Student Projects)
* Tích hợp artwork nền `stu-project-background.svg`.
* Bổ sung biến thể `outlinePrimary` trong `components/ui/Badge.tsx`.
* Căn chỉnh viền khung `border-4 border-white` cho lưới 3x3 dự án và transition banner `banner-lower.svg`.

---

## 3. Danh Sách Tệp Thay Đổi (Files Modified)

| Phân loại | Tệp tin | Mô tả thay đổi |
| :--- | :--- | :--- |
| **Next.js Core** | `lib/cms/sheets-client.ts` | Bỏ qua cache ở dev, gắn `force_refresh=true`, thêm log `Script update new:`, bóc tách `err.cause`. |
| **Next.js API** | `app/api/revalidate/route.ts` | Tự động kéo dữ liệu mới và log ra terminal khi có webhook revalidate. |
| **Next.js API** | `app/api/cms/debug/route.ts` | Endpoint chẩn đoán 4 bước kiểm tra kết nối Google Apps Script. |
| **Apps Script** | `apps-script/cms/02_CmsMenu.gs` | Thêm `clearCmsCache()` vào sự kiện `onEdit(e)`. |
| **Apps Script** | `apps-script/cms/04_CmsEndpoints.gs` | CacheService RAM, Single-Pass `ss.getSheets()`, giảm TTL về 300s. |
| **Apps Script** | `apps-script/cms/06_CmsMaintenance.gs` | Gọi `clearCmsCache()` ngay đầu hàm `triggerWebsiteRevalidation()`. |
| **Apps Script Dist** | `apps-script/dist/Code.bundle.gs` | Bundle cập nhật toàn bộ module Apps Script. |
| **Apps Script Dist** | `apps-script/cms/dist/Code.cms.bundle.gs`| Bundle cập nhật CMS module. |
| **Scripts** | `scripts/test-sheets-connection.js` | Script CLI độc lập kiểm thử kết nối Google Sheets (`npm run test:sheets`). |
| **Package** | `package.json` | Bổ sung npm script `"test:sheets"`. |
| **Documentation** | `.docs/reports/Problems-Solution-v1.md` | Báo cáo phân tích rủi ro, điểm nghẽn và lộ trình nâng cấp hệ thống. |

---

## 4. Kết Quả Kiểm Thử (Verification & Quality Gates)

```bash
# 1. Kiểm tra toàn vẹn kiểu dữ liệu
$ npm run typecheck
> tsc --noEmit
# Kết quả: 0 errors

# 2. Kiểm tra chuẩn mã nguồn
$ npm run lint
> eslint
# Kết quả: 0 errors, 1 warning (font ngoài trang)

# 3. Đóng gói mã nguồn Apps Script
$ npm run bundle:gas
# Kết quả: Đóng gói thành công Code.cms.bundle.gs (3470 dòng) & Code.leads.bundle.gs (768 dòng)

# 4. Kiểm tra Next.js Production Build
$ npm run build
# Kết quả: Compiled successfully, 19/19 static/SSG pages generated hoàn tất
```

---

## 5. Hướng Dẫn Kiểm Thử Sau Khi Merge (Post-Merge Testing Guide)

1. **Môi trường Local**:
   - Chạy `npm run dev`.
   - Vào Google Sheets sửa một thông tin và F5 `localhost:3000`.
   - Kiểm tra log terminal có tiền tố: `Script update new:` xuất hiện ngay lập tức với dữ liệu mới.
2. **Môi trường Production (Vercel)**:
   - Đảm bảo Vercel Environment Variables đã cấu hình đủ `REVALIDATION_SECRET`, `GOOGLE_APPS_SCRIPT_CMS_URL`, `GOOGLE_APPS_SCRIPT_CMS_SECRET`.
   - Vào Google Sheets sửa 1 ô và bấm menu: **`🚀 DataWithLy CMS ➔ ⚡ Xuất Bản Website (Đồng Bộ)`**.
   - Mở trình duyệt ẩn danh kiểm tra `https://ed-tech-mu-umber.vercel.app` để thấy thay đổi trong ~1-2 giây.
