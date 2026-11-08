from pathlib import Path

import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

def generate_leads_template():
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Leads"

    # Ensure grid lines are visible
    ws.views.sheetView[0].showGridLines = True

    headers = [
        "submission_id",
        "server_received_at",
        "client_submitted_at",
        "name",
        "phone",
        "email",
        "course_id",
        "course_name",
        "message",
        "first_utm_source",
        "first_utm_medium",
        "first_utm_campaign",
        "first_utm_content",
        "first_utm_term",
        "first_referrer",
        "first_landing_page",
        "first_seen_at",
        "last_utm_source",
        "last_utm_medium",
        "last_utm_campaign",
        "last_utm_content",
        "last_utm_term",
        "last_referrer",
        "last_landing_page",
        "last_seen_at",
        "gclid",
        "fbclid",
        "form_id",
        "cta_id",
        "page_url",
        "status"
    ]

    col_widths = {
        "submission_id": 36,
        "server_received_at": 24,
        "client_submitted_at": 24,
        "name": 22,
        "phone": 16,
        "email": 28,
        "course_id": 26,
        "course_name": 32,
        "message": 36,
        "first_utm_source": 18,
        "first_utm_medium": 18,
        "first_utm_campaign": 22,
        "first_utm_content": 20,
        "first_utm_term": 18,
        "first_referrer": 28,
        "first_landing_page": 24,
        "first_seen_at": 24,
        "last_utm_source": 18,
        "last_utm_medium": 18,
        "last_utm_campaign": 22,
        "last_utm_content": 20,
        "last_utm_term": 18,
        "last_referrer": 28,
        "last_landing_page": 24,
        "last_seen_at": 24,
        "gclid": 28,
        "fbclid": 28,
        "form_id": 26,
        "cta_id": 26,
        "page_url": 36,
        "status": 16
    }

    # Write Headers
    ws.append(headers)
    ws.row_dimensions[1].height = 28

    # Header styling
    header_fill = PatternFill(start_color="6227F4", end_color="6227F4", fill_type="solid")
    header_font = Font(name="Arial", size=11, bold=True, color="FFFFFF")
    header_alignment = Alignment(horizontal="center", vertical="center", wrap_text=False)
    thin_border_side = Side(style="thin", color="7C3AED")
    header_border = Border(left=thin_border_side, right=thin_border_side, top=thin_border_side, bottom=thin_border_side)

    for col_idx in range(1, len(headers) + 1):
        cell = ws.cell(row=1, column=col_idx)
        cell.fill = header_fill
        cell.font = header_font
        cell.alignment = header_alignment
        cell.border = header_border

    # Sample template data rows
    sample_rows = [
        [
            "e4b27a38-c6fd-419b-a674-123456789abc",
            "2026-09-08 15:00:00",
            "2026-09-08 14:59:58",
            "Nguyễn Văn An",
            "0912345678",
            "vanan.data@gmail.com",
            "sql-for-data-analytics",
            "SQL for Data Analytics",
            "Muốn học để chuyển ngành từ kế toán sang Data Analyst",
            "facebook",
            "cpc",
            "da_career_change_2026",
            "banner_sql_thuc_chien",
            "",
            "https://m.facebook.com",
            "/?utm_source=facebook&utm_medium=cpc",
            "2026-09-01 09:30:00",
            "google",
            "cpc",
            "brand_search_ly_data",
            "text_ad_sql",
            "khoa hoc sql ly data",
            "https://www.google.com",
            "/?utm_source=google&utm_medium=cpc",
            "2026-09-08 14:55:00",
            "CjwKCAjw...gclid_sample",
            "fb.1.1788...fbclid_sample",
            "cta_banner_form",
            "cta_banner_submit",
            "https://lydata.vn/#contact",
            "NEW"
        ],
        [
            "f9c18d45-12aa-45ef-8901-987654321def",
            "2026-09-08 15:10:00",
            "2026-09-08 15:09:55",
            "Trần Thị Mai Hương",
            "0988765432",
            "maihuong.bi@gmail.com",
            "analytics-thinking",
            "Analytics Thinking & Data Analytics",
            "Quan tâm lớp buổi tối 3-5-7",
            "tiktok",
            "organic",
            "review_khoa_hoc",
            "video_huong_dan_sql",
            "",
            "https://www.tiktok.com",
            "/?utm_source=tiktok",
            "2026-09-05 18:20:00",
            "direct",
            "none",
            "",
            "",
            "",
            "",
            "/",
            "2026-09-08 15:08:00",
            "",
            "",
            "modal_form_hero_primary_cta",
            "modal_submit_hero_primary_cta",
            "https://lydata.vn/",
            "CONTACTED"
        ]
    ]

    data_font = Font(name="Arial", size=10, color="1E293B")
    data_border_side = Side(style="thin", color="E2E8F0")
    data_border = Border(left=data_border_side, right=data_border_side, top=data_border_side, bottom=data_border_side)
    zebra_fill = PatternFill(start_color="F8F6FE", end_color="F8F6FE", fill_type="solid")

    for row_idx, row_data in enumerate(sample_rows, start=2):
        ws.append(row_data)
        ws.row_dimensions[row_idx].height = 22
        is_zebra = (row_idx % 2 == 1)
        for col_idx in range(1, len(headers) + 1):
            cell = ws.cell(row=row_idx, column=col_idx)
            cell.font = data_font
            cell.border = data_border
            if is_zebra:
                cell.fill = zebra_fill
            
            # Format phone and submission_id explicitly as Text
            if headers[col_idx - 1] in ["phone", "submission_id"]:
                cell.number_format = "@"
                cell.alignment = Alignment(horizontal="left", vertical="center")
            elif headers[col_idx - 1] == "status":
                cell.alignment = Alignment(horizontal="center", vertical="center")
            else:
                cell.alignment = Alignment(vertical="center")

    # Set Column Widths
    for idx, header in enumerate(headers, start=1):
        col_letter = get_column_letter(idx)
        ws.column_dimensions[col_letter].width = col_widths.get(header, 20)

    # Freeze Header Row
    ws.freeze_panes = "A2"

    # Add AutoFilter
    ws.auto_filter.ref = f"A1:{get_column_letter(len(headers))}3"

    # Resolve output from the script location, independent of the working directory.
    project_root = Path(__file__).resolve().parent.parent
    dest_path = project_root / "google-apps-script" / "Ly_Data_Leads_Template.xlsx"
    dest_path.parent.mkdir(parents=True, exist_ok=True)
    wb.save(dest_path)
    print(f"Generated successfully: {dest_path}")

if __name__ == "__main__":
    generate_leads_template()
