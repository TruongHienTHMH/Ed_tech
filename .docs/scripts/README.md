# Công cụ hỗ trợ DataWithLy

## Tạo file Excel mẫu đăng ký

Script: [generate_leads_template.py](generate_leads_template.py), trước đây là generate_excel_template.py ở thư mục gốc.

Yêu cầu Python 3 và package openpyxl. Cài trong môi trường Python riêng đang sử dụng:

```bash
python3 -m pip install openpyxl
```

Chạy từ thư mục gốc dự án:

```bash
python3 scripts/generate_leads_template.py
```

Khi ở thư mục khác, gọi bằng đường dẫn tuyệt đối đến script. Đường dẫn đầu ra được tính từ vị trí script bằng __file__, không phụ thuộc thư mục chạy lệnh.

## Đầu ra và bản lưu

- Đầu ra duy nhất: [google-apps-script/Ly_Data_Leads_Template.xlsx](../google-apps-script/Ly_Data_Leads_Template.xlsx). Chạy script sẽ ghi đè file này.
- [Bản từng nằm ở thư mục gốc](../google-apps-script/archive/leads-template-from-root.xlsx) được giữ riêng vì nội dung worksheet khác bản đang dùng. Chưa hợp nhất; script không ghi vào archive.
- Đợt tổ chức lại chỉ kiểm tra script mà không chạy ghi đè Excel hiện có.
- .gitignore đang bỏ qua *.xlsx; giữ nguyên chính sách này. Các workbook cục bộ có thể không có trong bản clone mới; có thể chạy script để tạo đầu ra.

[Hướng dẫn Google Sheets](../google-apps-script/README.md) · [Bộ docs](../README.md).
