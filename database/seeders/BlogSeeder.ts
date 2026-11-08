import { BlogPost } from "@/lib/cms/types";
import { Seeder } from "./types";

export class BlogSeeder implements Seeder<BlogPost> {
  run(): BlogPost[] {
    return [
      {
        id: "blog-sql-meo-can-biet",
        title: "Các mẹo SQL cần biết trong doanh nghiệp",
        slug: "cac-meo-sql-can-biet",
        category: "SQL",
        excerpt:
          "Khám phá các mẹo, thủ thuật và câu lệnh SQL hữu ích giúp viết truy vấn ngắn gọn, tối ưu và hiệu quả hơn trong môi trường doanh nghiệp thực tế.",
        coverImageUrl: "/assets/figma/71218f0038c8a9ce02ba0e6f6b102fbf63b6953b.png",
        authorName: "Hứa Thảo Ly",
        publishedAt: "2026-03-01",
        readTimeMinutes: 6,
        isActive: true,
        contentMarkdown: `## 1. Tại sao kỹ năng viết SQL chuẩn doanh nghiệp lại quan trọng?

Khi làm việc với các hệ thống cơ sở dữ liệu lớn hàng chục triệu dòng tại các công ty như ví điện tử hay sàn thương mại điện tử, việc viết câu lệnh SQL chạy được là **chưa đủ**. Một truy vấn không tối ưu có thể làm sập database server hoặc khiến báo cáo chạy mất hàng giờ đồng hồ.

> **Lời khuyên từ Mentor Ly:** Trong phỏng vấn và công việc thực tế, nhà tuyển dụng đánh giá cao một Data Analyst biết sử dụng CTE, Window Function và kiểm soát tốt chi phí quét dữ liệu (scan cost).

---

## 2. Tận dụng CTE (Common Table Expressions) thay vì Subquery lồng nhau

Subquery lồng nhiều tầng khiến người đọc hoa mắt và gây khó khăn cho việc bảo trì code. Sử dụng mệnh đề \`WITH\` giúp tách logic thành từng bước tuần tự rõ ràng:

\`\`\`sql
-- Tính doanh thu và xếp hạng chi tiêu của khách hàng theo tháng
WITH monthly_customer_revenue AS (
  SELECT
    DATE_TRUNC('month', order_date) AS order_month,
    customer_id,
    SUM(total_amount) AS total_spent,
    COUNT(order_id) AS order_count
  FROM orders
  WHERE order_status = 'COMPLETED'
  GROUP BY 1, 2
),
ranked_customers AS (
  SELECT
    order_month,
    customer_id,
    total_spent,
    DENSE_RANK() OVER (
      PARTITION BY order_month 
      ORDER BY total_spent DESC
    ) AS spending_rank
  FROM monthly_customer_revenue
)
SELECT *
FROM ranked_customers
WHERE spending_rank <= 10
ORDER BY order_month DESC, spending_rank ASC;
\`\`\`

---

## 3. Phân biệt ROW_NUMBER, RANK và DENSE_RANK

Đây là câu hỏi thường xuyên xuất hiện trong các bài test SQL kỹ thuật:

- **ROW_NUMBER():** Luôn trả về số thứ tự duy nhất (1, 2, 3, 4...), hữu ích khi cần lấy chính xác 1 dòng mới nhất (deduplication).
- **RANK():** Nếu có giá trị bằng nhau sẽ đồng hạng và **nhảy cóc** thứ tự (1, 2, 2, 4...).
- **DENSE_RANK():** Nếu bằng nhau sẽ đồng hạng nhưng **không nhảy cóc** (1, 2, 2, 3...).

### Ví dụ xử lý bản ghi trùng lặp (Deduplication):

\`\`\`sql
-- Lấy trạng thái mới nhất của mỗi đơn hàng dựa trên thời gian cập nhật
WITH ranked_events AS (
  SELECT
    order_id,
    status,
    updated_at,
    ROW_NUMBER() OVER (
      PARTITION BY order_id 
      ORDER BY updated_at DESC
    ) AS rn
  FROM order_logs
)
SELECT order_id, status, updated_at
FROM ranked_events
WHERE rn = 1;
\`\`\`

---

## 4. Xử lý giá trị NULL an toàn với COALESCE

Tránh để giá trị \`NULL\` làm hỏng phép tính tổng hoặc hiển thị bảng điều khiển bằng hàm \`COALESCE\`:

\`\`\`sql
SELECT
  p.product_name,
  COALESCE(s.discount_rate, 0) AS safe_discount,
  p.base_price * (1 - COALESCE(s.discount_rate, 0)) AS final_price
FROM products p
LEFT JOIN promotions s ON p.promo_id = s.id;
\`\`\`

---

## 5. Tổng kết

Nắm vững các kỹ thuật trên không chỉ giúp bạn hoàn thành tốt các bài tập phân tích dữ liệu mà còn tự tin giải quyết bài toán nghiệp vụ quy mô lớn tại các doanh nghiệp hàng đầu.`,
      },
      {
        id: "blog-dashboard-5-giay",
        title: "Cách thiết kế Dashboard trực quan chỉ trong 5 giây",
        slug: "thiet-ke-dashboard-truc-quan",
        category: "Dashboard",
        excerpt:
          "Những nguyên lý thị giác quan trọng giúp báo cáo của bạn vừa chuẩn logic kinh doanh vừa đẹp mắt, thuyết phục ban lãnh đạo ngay từ cái nhìn đầu tiên.",
        coverImageUrl: "/assets/figma/71218f0038c8a9ce02ba0e6f6b102fbf63b6953b.png",
        authorName: "Hứa Thảo Ly",
        publishedAt: "2026-03-05",
        readTimeMinutes: 7,
        isActive: true,
        contentMarkdown: `## 1. Quy tắc 5 giây (The 5-Second Rule) trong thiết kế báo cáo

Một dashboard hiệu quả là khi người dùng (đặc biệt là Ban Giám Đốc hoặc Trưởng phòng) có thể nắm bắt được bức tranh toàn cảnh về sức khỏe kinh doanh chỉ sau **5 giây đầu tiên** nhìn vào màn hình.

> Nếu sếp của bạn mất quá 1 phút để tìm xem doanh thu hôm nay tăng hay giảm, dashboard đó đã thất bại về mặt trải nghiệm người dùng (UX/UI).

---

## 2. Bố cục theo mẫu chữ F và chữ Z (Eye-Tracking Patterns)

Mắt người đọc phương Tây và Việt Nam luôn quét từ **trái sang phải**, từ **trên xuống dưới**. Do đó hãy sắp xếp dashboard theo cấu trúc phân cấp thông tin:

- **Góc trên cùng bên trái:** Các chỉ số sinh mệnh (North Star KPIs) như Doanh thu, Lợi nhuận, Số lượng đơn hàng mới.
- **Khu vực trung tâm:** Biểu đồ xu hướng (Trend Line) hoặc so sánh chỉ số qua các mốc thời gian (MoM, YoY).
- **Góc dưới hoặc thanh bên phải:** Bảng chi tiết phân rã theo ngành hàng, khu vực địa lý hoặc kênh phân phối.

---

## 3. Màu sắc có chủ đích: Đừng biến báo cáo thành hộp bút chì màu

Sai lầm phổ biến nhất của các bạn mới làm Data Analyst là sử dụng quá nhiều màu sắc rực rỡ khiến người xem bị quá tải thị giác:

- **Màu trung tính (#252525, #676767, #F8F9FA):** Dành cho nền, chữ và các yếu tố phụ.
- **Màu thương hiệu hoặc điểm nhấn (Crimson / Navy):** Dành cho số liệu trọng tâm cần thu hút sự chú ý.
- **Màu trạng thái (Xanh lá / Đỏ):** Chỉ dùng khi biểu thị tích cực (tăng trưởng, đạt KPI) hoặc tiêu cực (sụt giảm, rủi ro).

---

## 4. Tính toán chỉ số tăng trưởng (Growth Rate) chuẩn xác

Dưới đây là công thức SQL mẫu để tính tỷ lệ tăng trưởng doanh thu so với tháng trước (MoM Growth) trước khi đưa lên biểu đồ:

\`\`\`sql
WITH monthly_sales AS (
  SELECT
    DATE_TRUNC('month', order_date) AS sales_month,
    SUM(net_revenue) AS current_revenue
  FROM fact_sales
  GROUP BY 1
),
sales_with_lag AS (
  SELECT
    sales_month,
    current_revenue,
    LAG(current_revenue, 1) OVER (ORDER BY sales_month) AS previous_month_revenue
  FROM monthly_sales
)
SELECT
  sales_month,
  current_revenue,
  previous_month_revenue,
  ROUND(
    ((current_revenue - previous_month_revenue) / NULLIF(previous_month_revenue, 0)) * 100, 
    2
  ) AS mom_growth_percent
FROM sales_with_lag
ORDER BY sales_month DESC;
\`\`\`

---

## 5. Tạm kết

Một dashboard xuất sắc không chỉ nằm ở vẻ ngoài thẩm mỹ mà là khả năng kích hoạt hành động nghiệp vụ (Actionable Insights) cho đội ngũ lãnh đạo.`,
      },
      {
        id: "blog-chuyen-nganh-data-0",
        title: "Lộ trình chuyển ngành Data Analytics từ con số 0",
        slug: "lo-trinh-chuyen-nganh-data-analyst",
        category: "Career",
        excerpt:
          "Kinh nghiệm thực chiến từ việc học công cụ, làm portfolio dự án đến cách trả lời câu hỏi phỏng vấn hóc búa dành cho người trái ngành.",
        coverImageUrl: "/assets/figma/71218f0038c8a9ce02ba0e6f6b102fbf63b6953b.png",
        authorName: "Hứa Thảo Ly",
        publishedAt: "2026-03-10",
        readTimeMinutes: 8,
        isActive: true,
        contentMarkdown: `## 1. Chuyển ngành sang Data Analytics có quá muộn?

Rất nhiều bạn từ khối ngành kinh tế, marketing, logistics hay tài chính ngân hàng thường lo lắng: *"Mình không biết lập trình, học toán bình thường thì có làm được Data Analyst không?"*

Câu trả lời ngắn gọn là: **Hoàn toàn được!** Data Analyst không đòi hỏi bạn phải có bằng Khoa học Máy tính. Điều quan trọng nhất của một DA là **tư duy kinh doanh (Business Sense)** kết hợp với khả năng sử dụng dữ liệu để chứng minh luận điểm.

---

## 2. 4 Giai đoạn trong lộ trình chinh phục nghề DA

### Giai đoạn 1: Tư duy phân tích và Nền tảng số liệu
- Hiểu các mô hình kinh doanh phổ biến (E-commerce, SaaS, Retail, Banking).
- Nắm rõ các chỉ số vận hành cốt lõi: CAC, LTV, AOV, Churn Rate, Retention Rate.

### Giai đoạn 2: Vũ khí tối thượng — SQL thực chiến
SQL là kỹ năng bắt buộc số 1 mà 99% các vị trí tuyển dụng Data Analyst đều yêu cầu. Bạn cần thành thạo:
- Lọc, kết hợp dữ liệu: \`WHERE\`, \`JOIN\` (INNER, LEFT, FULL).
- Gom nhóm và tính toán: \`GROUP BY\`, \`HAVING\`, Aggregations.
- Các hàm nâng cao: CTEs, Window Functions (\`ROW_NUMBER\`, \`LEAD\`, \`LAG\`).

### Giai đoạn 3: Trực quan hóa dữ liệu (BI Dashboard)
- Lựa chọn công cụ phù hợp: Looker Studio, Power BI hoặc Tableau.
- Thiết kế luồng dữ liệu tự động và xây dựng báo cáo phân tích tương tác.

### Giai đoạn 4: Python cho Phân tích thăm dò (EDA)
Sử dụng thư viện \`pandas\` và \`matplotlib\` để làm sạch dữ liệu lớn và trực quan hóa phân phối:

\`\`\`python
import pandas as pd
import numpy as np

# Đọc dữ liệu khách hàng và kiểm tra tỷ lệ rời bỏ (Churn)
df = pd.read_csv("customer_churn_data.csv")

# Tính toán các chỉ số cơ bản
summary = df.groupby("subscription_plan").agg(
    total_users=("user_id", "count"),
    avg_monthly_spend=("monthly_charge", "mean"),
    churn_rate=("is_churned", lambda x: np.mean(x) * 100)
).reset_index()

print("Báo cáo tỷ lệ Churn theo gói dịch vụ:")
print(summary.round(2))
\`\`\`

---

## 3. Bí quyết xây dựng Portfolio dự án gây ấn tượng với nhà tuyển dụng

Thay vì chỉ nộp CV với các dự án Titanic hay Iris dataset có sẵn trên Kaggle, hãy tạo ít nhất **2 dự án Capstone giải quyết bài toán kinh doanh cụ thể**:
1. **Dự án E-commerce Basket Analysis:** Phân tích quy luật mua sắm chéo để gợi ý sản phẩm bán kèm.
2. **Dự án Customer Segmentation (RFM):** Phân khúc khách hàng theo Tần suất, Giá trị và Thời gian mua sắm gần nhất.

---

## 4. Lời kết từ Mentor Hứa Thảo Ly

Con đường chuyển ngành sẽ có những thời điểm bạn cảm thấy quá tải trước lượng kiến thức đồ sộ. Nhưng nếu có một lộ trình học có định hướng, người hướng dẫn sát sao và kiên trì rèn luyện dự án thực tế, bạn hoàn toàn có thể tự tin ứng tuyển vị trí Data Analyst trong vòng 4 đến 6 tháng.`,
      },
    ];
  }
}
