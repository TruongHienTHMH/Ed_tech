/**
 * OpenAPI 3.0 Specification for DataWithLy API
 * Defines contracts, schemas, parameters and response payloads for all endpoints
 */

export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "DataWithLy Educational Platform API",
    version: "1.0.0",
    description:
      "Tài liệu kỹ thuật API chính thức cho nền tảng giáo dục DataWithLy (Mentor Hứa Thảo Ly). Bao gồm các dịch vụ kết nối Google Sheets, giám sát sức khỏe hệ thống, thu thập Lead học viên, On-demand ISR Revalidation và lưu trữ hình ảnh Cloudflare R2.",
    contact: {
      name: "DataWithLy Engineering Team",
      email: "tech@datawithly.edu.vn",
      url: "https://datawithly.edu.vn",
    },
  },
  servers: [
    {
      url: "/",
      description: "Máy chủ hiện tại (Local / Staging / Production)",
    },
  ],
  tags: [
    {
      name: "Observability & Health",
      description: "Endpoint kiểm tra tình trạng kết nối Google Sheets, bộ nhớ RAM Node.js và Cloudflare Storage",
    },
    {
      name: "Leads Ingestion",
      description: "Tiếp nhận thông tin đăng ký tư vấn học viên, xác thực Zod và đồng bộ an toàn về Google Sheets",
    },
    {
      name: "CMS & Revalidation",
      description: "Kích hoạt làm mới bản đệm Edge CDN (On-demand ISR) khi nội dung Google Sheets thay đổi",
    },
    {
      name: "Cloud Storage",
      description: "Tải ảnh lên Cloudflare R2 / Cloudflare Images với cơ chế Edge Caching 1 năm",
    },
  ],
  paths: {
    "/api/health": {
      get: {
        tags: ["Observability & Health"],
        summary: "Kiểm tra toàn diện sức khỏe hệ thống",
        description:
          "Trả về trạng thái hoạt động của Google Sheets, Cloudflare Storage và các chỉ số bộ nhớ V8 Heap (chống rò rỉ bộ nhớ).",
        responses: {
          "200": {
            description: "Hệ thống hoạt động bình thường (Healthy hoặc Degraded)",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HealthCheckResponse",
                },
              },
            },
          },
          "503": {
            description: "Dịch vụ quan trọng bị gián đoạn (Down)",
          },
        },
      },
    },
    "/api/health/sheets": {
      get: {
        tags: ["Observability & Health"],
        summary: "Đo độ trễ kết nối Google Sheets",
        description: "Gửi ping thử nghiệm tới Google Apps Script Web App để đo độ trễ mạng (latency_ms).",
        responses: {
          "200": {
            description: "Kết nối thành công",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    service: { type: "string", example: "google_sheets" },
                    status: { type: "string", example: "connected" },
                    latency_ms: { type: "number", example: 120 },
                    message: { type: "string" },
                    timestamp: { type: "string" },
                  },
                },
              },
            },
          },
          "503": {
            description: "Mất kết nối Google Sheets",
          },
        },
      },
    },
    "/api/cms/sheets-data": {
      get: {
        tags: ["CMS & Revalidation"],
        summary: "Đọc dữ liệu thời gian thực từ Google Sheets (Live Sync Inspector)",
        description:
          "Truy vấn trực tiếp các tab courses, curriculum và packages_pricing từ Google Sheets qua Apps Script Web App, hỗ trợ ép làm mới cache qua query force_refresh=true.",
        parameters: [
          {
            name: "force_refresh",
            in: "query",
            required: false,
            description: "Bỏ qua bộ nhớ đệm và ép buộc fetch trực tiếp từ Google Sheets",
            schema: { type: "boolean", default: false },
          },
        ],
        responses: {
          "200": {
            description: "Dữ liệu Google Sheets đã được đồng bộ và phân tích thành công",
          },
        },
      },
    },
    "/api/leads": {
      post: {
        tags: ["Leads Ingestion"],
        summary: "Nộp thông tin đăng ký tư vấn học viên",
        description:
          "Tiếp nhận họ tên, số điện thoại Việt Nam hợp lệ, email và khóa học quan tâm. Áp dụng Rate Limit (3 lượt/phút/IP) và bẫy bot Honeypot.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/LeadInputDto",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Lưu Lead thành công hoặc bẫy bot âm thầm",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ok: { type: "boolean", example: true },
                    submissionId: { type: "string", example: "sub_12345678" },
                    status: { type: "string", example: "stored" },
                  },
                },
              },
            },
          },
          "400": {
            description: "Dữ liệu không hợp lệ (sai định dạng số điện thoại, thiếu họ tên)",
          },
          "429": {
            description: "Vượt quá tần suất nộp (Rate limit: 3 lần/phút/IP)",
          },
        },
      },
    },
    "/api/revalidate": {
      post: {
        tags: ["CMS & Revalidation"],
        summary: "Xóa đệm và làm mới nội dung tức thì (On-Demand ISR)",
        description: "Được gọi từ nút [Đồng Bộ Website] trên Menu Google Sheets hoặc Webhook quản trị.",
        parameters: [
          {
            name: "secret",
            in: "query",
            required: true,
            description: "Mã bí mật xác thực REVALIDATION_SECRET",
            schema: { type: "string" },
          },
          {
            name: "tag",
            in: "query",
            required: false,
            description: "Nhãn cache cần làm mới (ví dụ: 'courses', 'curriculum', 'blog')",
            schema: { type: "string" },
          },
          {
            name: "path",
            in: "query",
            required: false,
            description: "Đường dẫn trang cụ thể cần revalidate (ví dụ: '/courses/sql-for-data-analytics')",
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Revalidate thành công",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    revalidated: { type: "boolean", example: true },
                    now: { type: "number", example: 1799000000000 },
                    message: { type: "string" },
                  },
                },
              },
            },
          },
          "401": {
            description: "Sai secret token",
          },
        },
      },
    },
    "/api/storage/upload": {
      post: {
        tags: ["Cloud Storage"],
        summary: "Tải file ảnh lên kho lưu trữ Cloudflare R2",
        description:
          "Tiếp nhận file ảnh multipart/form-data, kiểm tra dung lượng (< 5MB), tải lên Cloudflare R2 với header Cache-Control 1 năm và trả về URL CDN công khai.",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  file: {
                    type: "string",
                    format: "binary",
                    description: "File hình ảnh (JPG, PNG, WEBP, AVIF, SVG)",
                  },
                  folder: {
                    type: "string",
                    example: "courses",
                    description: "Thư mục phân loại (courses, avatars, blog, proofs)",
                  },
                },
                required: ["file"],
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Tải ảnh lên thành công",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ok: { type: "boolean", example: true },
                    data: {
                      type: "object",
                      properties: {
                        url: { type: "string", example: "https://pub-xxx.r2.dev/courses/1799-sql-cover.webp" },
                        key: { type: "string", example: "courses/1799-sql-cover.webp" },
                        sizeBytes: { type: "number", example: 245600 },
                        mimeType: { type: "string", example: "image/webp" },
                        cached: { type: "boolean", example: true },
                      },
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "Thiếu file hoặc file vượt quá kích thước 5MB",
          },
          "415": {
            description: "Định dạng file không được hỗ trợ",
          },
        },
      },
    },
  },
  components: {
    schemas: {
      HealthCheckResponse: {
        type: "object",
        properties: {
          status: { type: "string", enum: ["healthy", "degraded", "down"] },
          timestamp: { type: "string" },
          uptimeSeconds: { type: "number" },
          environment: { type: "string" },
          services: {
            type: "object",
            properties: {
              googleSheets: {
                type: "object",
                properties: {
                  status: { type: "string" },
                  latencyMs: { type: "number" },
                  message: { type: "string" },
                },
              },
              imageStorage: {
                type: "object",
                properties: {
                  provider: { type: "string" },
                  status: { type: "string" },
                  bucketName: { type: "string" },
                },
              },
            },
          },
          memory: {
            type: "object",
            properties: {
              heapUsedMb: { type: "number" },
              heapTotalMb: { type: "number" },
              rssMb: { type: "number" },
            },
          },
        },
      },
      LeadInputDto: {
        type: "object",
        required: ["submission_id", "name", "phone"],
        properties: {
          submission_id: { type: "string", example: "sub_123456" },
          name: { type: "string", example: "Nguyễn Minh Quân" },
          phone: { type: "string", example: "0901234567" },
          email: { type: "string", example: "minhquan.data@gmail.com" },
          course_id: { type: "string", example: "sql-for-data-analytics" },
          message: { type: "string", example: "Muốn học lớp buổi tối" },
          _hp: { type: "string", description: "Honeypot field (bắt buộc rỗng)" },
        },
      },
    },
  },
};

