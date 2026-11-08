"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { GoogleSheetsSyncReport } from "@/lib/cms/content-fetcher";
import { Course, CurriculumModule } from "@/lib/cms/types";

function toSlugClient(str: string): string {
  if (!str) return "";
  let s = str.toLowerCase().trim();
  s = s.replace(/[áàảãạăắằẳẵặâấầẩẫậ]/g, "a");
  s = s.replace(/[éèẻẽẹêếềểễệ]/g, "e");
  s = s.replace(/[íìỉĩị]/g, "i");
  s = s.replace(/[óòỏõọôốồổỗộơớờởỡợ]/g, "o");
  s = s.replace(/[úùủũụưứừửữự]/g, "u");
  s = s.replace(/[ýỳỷỹỵ]/g, "y");
  s = s.replace(/đ/g, "d");
  s = s.replace(/[^a-z0-9\s-]/g, "");
  s = s.replace(/[\s_]+/g, "-");
  s = s.replace(/-+/g, "-");
  return s.replace(/^-+|-+$/g, "");
}

function resolveUniqueSlugClient(str: string, existingSlugs: string[]): string {
  const base = toSlugClient(str);
  if (!base) return "";
  const clean = base.replace(/-v\d+$/, "");
  const map: Record<string, boolean> = {};
  for (const s of existingSlugs) {
    if (s) map[s.toLowerCase().trim()] = true;
  }
  if (!map[clean]) return clean;
  let v = 1;
  while (true) {
    const cand = `${clean}-v${v}`;
    if (!map[cand]) return cand;
    v++;
  }
}

export default function TestsDataPage() {
  const [report, setReport] = useState<GoogleSheetsSyncReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"courses" | "curriculum" | "add_course" | "lead_test" | "raw_json">("courses");
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");

  // Lead Test Form State
  const [leadName, setLeadName] = useState("Nguyễn Văn Test");
  const [leadPhone, setLeadPhone] = useState("0901234567");
  const [leadEmail, setLeadEmail] = useState("test.student@datawithly.edu.vn");
  const [leadCourse, setLeadCourse] = useState("sql-for-data-analytics");
  const [leadMessage, setLeadMessage] = useState("Muốn tư vấn lịch học buổi tối");
  const [submittingLead, setSubmittingLead] = useState(false);
  const [leadSubmitResult, setLeadSubmitResult] = useState<Record<string, unknown> | null>(null);

  // New Course Form State
  const [newTitle, setNewTitle] = useState("");
  const [newTagline, setNewTagline] = useState("");
  const [newTag, setNewTag] = useState("SQL");
  const [newLevel, setNewLevel] = useState<"Beginner" | "Intermediate" | "Advanced">("Beginner");
  const [newTuition, setNewTuition] = useState("4500000");
  const [newOrigTuition, setNewOrigTuition] = useState("6000000");
  const [newDuration, setNewDuration] = useState("8 tuần (24 buổi)");
  const [newIsActive, setNewIsActive] = useState(true);
  const [newIsFeatured, setNewIsFeatured] = useState(true);
  const [newDescription, setNewDescription] = useState("");
  const [submittingCourse, setSubmittingCourse] = useState(false);

  const existingSlugs = report?.courses?.map((c) => c.slug) || [];
  const autoSlug = resolveUniqueSlugClient(newTitle, existingSlugs);
  const autoId = autoSlug;
  const isVersioned = Boolean(autoSlug && autoSlug.match(/-v\d+$/));

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchSyncReport = async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        setSyncing(true);
      }

      const res = await fetch(`/api/cms/sheets-data?force_refresh=${forceRefresh}`);
      const data: GoogleSheetsSyncReport = await res.json();
      setReport(data);

      if (data.courses && data.courses.length > 0 && !selectedCourseId) {
        setSelectedCourseId(data.courses[0].id);
      }

      if (forceRefresh) {
        showToast("✅ Đã đồng bộ và làm mới dữ liệu từ Google Sheets thành công!");
      }
    } catch (err: unknown) {
      showToast("❌ Lỗi kết nối khi đồng bộ: " + (err as Error)?.message);
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetch(`/api/cms/sheets-data`)
      .then((res) => res.json())
      .then((data: GoogleSheetsSyncReport) => {
        if (!isMounted) return;
        setReport(data);
        if (data.courses && data.courses.length > 0) {
          setSelectedCourseId(data.courses[0].id);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        setToastMessage("❌ Lỗi tải dữ liệu: " + (err as Error)?.message);
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleTriggerRevalidate = async () => {
    try {
      setSyncing(true);
      await fetch("/api/revalidate?secret=datawithly_secure_reval_token_2026", { method: "POST" });
      await fetchSyncReport(true);
    } catch (err: unknown) {
      showToast("Lỗi revalidate: " + (err as Error)?.message);
      setSyncing(false);
    }
  };

  const handleTestSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingLead(true);
    setLeadSubmitResult(null);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submission_id: `demo_${Date.now()}`,
          name: leadName,
          phone: leadPhone,
          email: leadEmail,
          course_id: leadCourse,
          message: leadMessage,
        }),
      });

      const json = await res.json();
      setLeadSubmitResult(json);
      if (res.ok) {
        showToast("🎉 Đã gửi Lead thành công! Mở tab 'leads (private)' trên Google Sheet để kiểm tra dòng mới.");
      } else {
        showToast("⚠️ Nộp Lead thất bại: " + (json.error?.message || "Lỗi máy chủ"));
      }
    } catch (err: unknown) {
      showToast("Lỗi kết nối form: " + (err as Error)?.message);
    } finally {
      setSubmittingLead(false);
    }
  };

  const handleCreateCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showToast("⚠️ Vui lòng nhập Tên khóa học.");
      return;
    }

    setSubmittingCourse(true);
    try {
      const res = await fetch("/api/cms/course-create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          slug: autoSlug,
          id: autoId,
          tagline: newTagline,
          tag: newTag,
          level: newLevel,
          tuition_vnd: Number(newTuition) || 0,
          original_tuition_vnd: Number(newOrigTuition) || 0,
          duration: newDuration,
          is_active: newIsActive,
          is_featured: newIsFeatured,
          description: newDescription,
        }),
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        showToast(`🎉 Đã thêm khóa học thành công! (Slug: ${data.course?.slug || autoSlug})`);
        setNewTitle("");
        setNewTagline("");
        setNewDescription("");
        setActiveTab("courses");
        await fetchSyncReport(true);
      } else {
        showToast("❌ Lỗi khi lưu: " + (data.error?.message || "Không thể lưu khóa học"));
      }
    } catch (err: unknown) {
      showToast("❌ Lỗi mạng: " + (err as Error)?.message);
    } finally {
      setSubmittingCourse(false);
    }
  };

  const selectedCourse: Course | undefined = report?.courses?.find((c) => c.id === selectedCourseId) || report?.courses?.[0];

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#1F242F] text-white px-5 py-3 rounded-xl shadow-2xl border border-neutral-700 flex items-center space-x-3 text-sm font-medium">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-gray-400 hover:text-white cursor-pointer">✕</button>
        </div>
      )}

      {/* Brand Header */}
      <header className="bg-[#1F242F] text-white border-b border-neutral-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-[#8B1D2C] flex items-center justify-center font-bold text-white text-lg shadow-md">
              D
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold">DataWithLy Google CMS Live Inspector</h1>
                <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">
                  {report?.source === "google_sheets_live" ? "Live Sheets Connected" : "Local Fallback Snapshot"}
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Bảng điều khiển kiểm chứng đồng bộ dữ liệu thời gian thực giữa Google Sheets và Website Next.js
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleTriggerRevalidate}
              disabled={syncing}
              className="px-4 py-2 rounded-lg bg-[#8B1D2C] hover:bg-[#A32435] text-white font-semibold text-xs transition-all shadow-sm flex items-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              <span className={syncing ? "animate-spin" : ""}>⚡</span>
              <span>{syncing ? "Đang đồng bộ..." : "Đồng Bộ Lại Dữ Liệu Ngay"}</span>
            </button>
            <Link
              href="/api-docs"
              target="_blank"
              className="px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium border border-neutral-700 transition-colors"
            >
              Swagger Docs
            </Link>
            <Link
              href="/api/health"
              target="_blank"
              className="px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium border border-neutral-700 transition-colors"
            >
              Health API
            </Link>
            <Link
              href="/"
              className="px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium border border-neutral-700 transition-colors"
            >
              Về Trang Chủ
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Form Pathways Information Banner */}
        <div className="bg-gradient-to-r from-red-50 to-amber-50 border border-red-200 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-neutral-800 shadow-xs">
          <div className="flex items-start space-x-3">
            <span className="text-xl">📋</span>
            <div>
              <strong className="text-sm text-[#8B1D2C] block">Các cổng nhập dữ liệu trực tiếp vào Google Sheets:</strong>
              <div className="mt-1 space-y-0.5 text-neutral-600">
                <div>• <strong>Form thêm Khóa học từ Web:</strong> Bấm vào tab <em>&quot;➕ Thêm Khóa Học Mới&quot;</em> bên dưới (tự động thêm <code>-v1, -v2</code> nếu trùng slug).</div>
                <div>• <strong>Form tiếp nhận Lead học viên:</strong> Bấm vào tab <em>&quot;Thử Nghiệm Gửi Lead&quot;</em> (ghi vào tab <code>leads (private)</code>).</div>
                <div>• <strong>Form Modal bên trong Google Sheets:</strong> Mở bảng tính ➔ Menu <code>🚀 DataWithLy CMS</code> ➔ <code>➕ Thêm Khóa Học Mới</code>.</div>
              </div>
            </div>
          </div>
          <div className="shrink-0">
            <button
              onClick={() => setActiveTab("add_course")}
              className="px-3 py-2 bg-[#8B1D2C] text-white font-semibold rounded-lg hover:bg-[#721522] transition-colors cursor-pointer text-xs"
            >
              ➕ Mở Form Thêm Khóa Học
            </button>
          </div>
        </div>

        {/* KPI & Connection Status Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Độ trễ Google Sheets</span>
            <div className="mt-1 flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-neutral-900">{report?.latencyMs || 0}</span>
              <span className="text-xs text-neutral-500">ms</span>
            </div>
            <div className="mt-1 text-xs text-emerald-600 font-medium">● Phản hồi ổn định</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Tổng số Khóa học</span>
            <div className="mt-1 text-2xl font-bold text-neutral-900">{report?.totalCourses || 0}</div>
            <div className="mt-1 text-xs text-neutral-500">Trong tab &apos;courses&apos;</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs">
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Đang tuyển sinh (Active)</span>
            <div className="mt-1 text-2xl font-bold text-emerald-600">{report?.activeCourses || 0}</div>
            <div className="mt-1 text-xs text-neutral-500">Cờ isActive = TRUE</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs">
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Đã ẩn (Soft Deleted)</span>
            <div className="mt-1 text-2xl font-bold text-neutral-500">{report?.archivedCourses || 0}</div>
            <div className="mt-1 text-xs text-neutral-500">Cờ isActive = FALSE</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-neutral-200 space-x-4">
          <button
            onClick={() => setActiveTab("courses")}
            className={`pb-3 text-sm font-semibold border-b-2 cursor-pointer transition-colors ${
              activeTab === "courses"
                ? "border-[#8B1D2C] text-[#8B1D2C]"
                : "border-transparent text-neutral-500 hover:text-neutral-800"
            }`}
          >
            🎓 Khóa Học &amp; Bảng Giá ({report?.totalCourses || 0})
          </button>
          <button
            onClick={() => setActiveTab("curriculum")}
            className={`pb-3 text-sm font-semibold border-b-2 cursor-pointer transition-colors ${
              activeTab === "curriculum"
                ? "border-[#8B1D2C] text-[#8B1D2C]"
                : "border-transparent text-neutral-500 hover:text-neutral-800"
            }`}
          >
            📚 Đề Cương Chi Tiết ({report?.totalCurriculumModules || 0} chương)
          </button>
          <button
            onClick={() => setActiveTab("add_course")}
            className={`pb-3 text-sm font-semibold border-b-2 cursor-pointer transition-colors ${
              activeTab === "add_course"
                ? "border-[#8B1D2C] text-[#8B1D2C]"
                : "border-transparent text-neutral-500 hover:text-neutral-800"
            }`}
          >
            ➕ Thêm Khóa Học Mới
          </button>
          <button
            onClick={() => setActiveTab("lead_test")}
            className={`pb-3 text-sm font-semibold border-b-2 cursor-pointer transition-colors ${
              activeTab === "lead_test"
                ? "border-[#8B1D2C] text-[#8B1D2C]"
                : "border-transparent text-neutral-500 hover:text-neutral-800"
            }`}
          >
            📩 Thử Nghiệm Gửi Lead
          </button>
          <button
            onClick={() => setActiveTab("raw_json")}
            className={`pb-3 text-sm font-semibold border-b-2 cursor-pointer transition-colors ${
              activeTab === "raw_json"
                ? "border-[#8B1D2C] text-[#8B1D2C]"
                : "border-transparent text-neutral-500 hover:text-neutral-800"
            }`}
          >
            🔍 JSON Thô Đối Chiếu
          </button>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="py-12 text-center text-neutral-500 text-sm">
            <span className="inline-block animate-spin mr-2">⏳</span> Đang nạp dữ liệu từ Google Sheets CMS...
          </div>
        )}

        {/* TAB 1: COURSES & PRICING */}
        {!loading && activeTab === "courses" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-neutral-800">Danh Sách Khóa Học Trong Tab &apos;courses&apos;</h2>
              <span className="text-xs text-neutral-500">
                Đồng bộ lần cuối: {report?.fetchedAt ? new Date(report.fetchedAt).toLocaleTimeString("vi-VN") : "N/A"}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {report?.courses?.map((course) => (
                <div
                  key={course.id}
                  className={`bg-white rounded-xl border p-5 shadow-xs transition-all relative flex flex-col justify-between ${
                    course.isActive ? "border-neutral-200" : "border-dashed border-neutral-300 opacity-60 bg-neutral-100"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-[#8B1D2C]/10 text-[#8B1D2C]">
                        {course.tag}
                      </span>
                      <span className="text-[11px] font-medium text-neutral-400">
                        {course.duration}
                      </span>
                    </div>

                    <h3 className="font-bold text-neutral-900 text-base leading-snug">
                      {course.title}
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
                      {course.tagline}
                    </p>

                    <div className="mt-4 pt-3 border-t border-neutral-100 flex items-baseline justify-between">
                      <div>
                        <div className="text-lg font-bold text-[#8B1D2C]">
                          {course.tuitionVnd.toLocaleString("vi-VN")} đ
                        </div>
                        {course.originalTuitionVnd && course.originalTuitionVnd > course.tuitionVnd && (
                          <div className="text-xs text-neutral-400 line-through">
                            {course.originalTuitionVnd.toLocaleString("vi-VN")} đ
                          </div>
                        )}
                      </div>
                      <span className="text-xs font-medium px-2 py-1 bg-neutral-100 rounded text-neutral-600">
                        {course.level}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px]">
                    <div className="flex items-center space-x-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          course.isActive ? "bg-emerald-500" : "bg-neutral-400"
                        }`}
                      />
                      <span className={course.isActive ? "text-emerald-700 font-semibold" : "text-neutral-500"}>
                        {course.isActive ? "Đang hiển thị" : "Đã ẩn (Soft-delete)"}
                      </span>
                    </div>
                    <code className="text-neutral-400 bg-neutral-50 px-1.5 py-0.5 rounded text-[10px]">
                      {course.slug}
                    </code>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: CURRICULUM */}
        {!loading && activeTab === "curriculum" && (
          <div className="bg-white rounded-xl border border-neutral-200 shadow-xs p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
              <div>
                <h2 className="text-sm font-bold text-neutral-900">Chi Tiết Đề Cương Theo Khóa Học</h2>
                <p className="text-xs text-neutral-500">
                  Dữ liệu được bóc tách từ các dòng `Alt+Enter` trong tab `curriculum` của Google Sheets
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <label className="text-xs font-semibold text-neutral-600">Chọn Khóa Học:</label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="text-xs border border-neutral-300 rounded-lg px-3 py-1.5 bg-neutral-50 focus:ring-1 focus:ring-[#8B1D2C] focus:outline-none"
                >
                  {report?.courses?.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedCourse ? (
              <div className="space-y-4">
                <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-neutral-900">{selectedCourse.title}</h3>
                    <p className="text-xs text-neutral-500">{selectedCourse.duration} • Trình độ: {selectedCourse.level}</p>
                  </div>
                  <span className="text-xs font-bold text-[#8B1D2C] bg-[#8B1D2C]/10 px-2.5 py-1 rounded-full">
                    {selectedCourse.curriculumModules?.length || 0} Chương Học
                  </span>
                </div>

                <div className="space-y-3">
                  {selectedCourse.curriculumModules?.map((mod: CurriculumModule) => (
                    <div key={mod.moduleNumber} className="border border-neutral-200 rounded-xl p-4 hover:border-neutral-300 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-xs text-neutral-800">
                          {mod.title}
                        </span>
                        <span className="text-xs text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded">
                          {mod.durationHours ? `${mod.durationHours} giờ` : ""}
                        </span>
                      </div>

                      <ul className="list-disc list-inside space-y-1 text-xs text-neutral-600 pl-1">
                        {mod.bulletPoints?.map((topic: string, i: number) => (
                          <li key={i} className="leading-relaxed">
                            {topic}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-neutral-400 text-xs">
                Chưa có đề cương cho khóa học này trên Google Sheets.
              </div>
            )}
          </div>
        )}

        {/* TAB 3: FORM THÊM KHÓA HỌC MỚI */}
        {!loading && activeTab === "add_course" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-white rounded-xl border border-neutral-200 shadow-xs p-6 space-y-5">
              <div className="border-b border-neutral-200 pb-3">
                <h2 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                  <span>🎓</span> Form Nhập Liệu Khóa Học Vào Google Sheets
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Tự động sinh Slug SEO và ID theo thời gian thực (tự động thêm <code>-v1, -v2</code> nếu trùng lặp)
                </p>
              </div>

              <form onSubmit={handleCreateCourseSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Tên Khóa Học *</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="VD: Phân Tích Dữ Liệu SQL & Tối Ưu Truy Vấn Cho Doanh Nghiệp"
                    required
                    className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#8B1D2C] focus:outline-none"
                  />
                  <div className="mt-1.5 p-2 bg-neutral-50 rounded-lg border border-neutral-200 text-[11px] font-mono flex items-center justify-between text-neutral-600">
                    <div className="flex items-center space-x-2">
                      <span>Slug: <strong className="text-[#8B1D2C]">{autoSlug || "chua-co-tieu-de"}</strong></span>
                      {isVersioned && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          Tự động thêm {autoSlug.match(/-v\d+$/)?.[0]} do trùng lặp
                        </span>
                      )}
                    </div>
                    <span>ID: <strong className="text-neutral-800">{autoId || "chua-co-tieu-de"}</strong></span>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Tagline / Khẩu Hiệu Ngắn</label>
                  <input
                    type="text"
                    value={newTagline}
                    onChange={(e) => setNewTagline(e.target.value)}
                    placeholder="VD: Tự tin xử lý hàng triệu dòng dữ liệu và tối ưu hiệu năng câu lệnh"
                    className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#8B1D2C] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Chủ Đề (Tag) *</label>
                    <select
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#8B1D2C] focus:outline-none"
                    >
                      <option value="SQL">SQL</option>
                      <option value="Dashboard">Dashboard</option>
                      <option value="Python">Python</option>
                      <option value="End-to-End">End-to-End</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Cấp Độ (Level) *</label>
                    <select
                      value={newLevel}
                      onChange={(e) => setNewLevel(e.target.value as "Beginner" | "Intermediate" | "Advanced")}
                      className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#8B1D2C] focus:outline-none"
                    >
                      <option value="Beginner">Beginner (Cơ bản)</option>
                      <option value="Intermediate">Intermediate (Trung cấp)</option>
                      <option value="Advanced">Advanced (Nâng cao)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Học Phí Ưu Đãi (VNĐ) *</label>
                    <input
                      type="number"
                      value={newTuition}
                      onChange={(e) => setNewTuition(e.target.value)}
                      required
                      className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#8B1D2C] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Học Phí Gốc (VNĐ)</label>
                    <input
                      type="number"
                      value={newOrigTuition}
                      onChange={(e) => setNewOrigTuition(e.target.value)}
                      className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#8B1D2C] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Thời Lượng</label>
                    <input
                      type="text"
                      value={newDuration}
                      onChange={(e) => setNewDuration(e.target.value)}
                      className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#8B1D2C] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Mô Tả Ngắn</label>
                    <input
                      type="text"
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      placeholder="Tóm tắt nội dung chính"
                      className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#8B1D2C] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-6 pt-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newIsActive}
                      onChange={(e) => setNewIsActive(e.target.checked)}
                      className="w-4 h-4 accent-[#8B1D2C] rounded"
                    />
                    <span className="font-medium text-neutral-700">Kích hoạt tuyển sinh (isActive = TRUE)</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newIsFeatured}
                      onChange={(e) => setNewIsFeatured(e.target.checked)}
                      className="w-4 h-4 accent-[#8B1D2C] rounded"
                    />
                    <span className="font-medium text-neutral-700">Khóa học nổi bật (isFeatured = TRUE)</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={submittingCourse}
                  className="w-full py-2.5 rounded-lg bg-[#8B1D2C] hover:bg-[#721522] text-white font-bold text-xs shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  {submittingCourse ? "⏳ Đang ghi dữ liệu vào Google Sheets..." : "🚀 Lưu Khóa Học Lên Google Sheets & Xuất Bản"}
                </button>
              </form>
            </div>

            {/* Live Course Preview Card */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white rounded-xl border border-neutral-200 shadow-xs p-5">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Xem Trước Thẻ Khóa Học</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">LIVE PREVIEW</span>
                </div>

                <div className="mt-4 p-5 rounded-xl border border-neutral-200 bg-white shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-[#8B1D2C]/10 text-[#8B1D2C]">
                      {newTag || "SQL"}
                    </span>
                    <span className="text-xs text-neutral-400 font-medium">{newDuration || "8 tuần"}</span>
                  </div>

                  <h3 className="font-bold text-neutral-900 text-base leading-snug">
                    {newTitle || "Tên khóa học sẽ hiển thị ở đây"}
                  </h3>

                  <p className="text-xs text-neutral-500 leading-relaxed">
                    {newTagline || "Tagline khẩu hiệu ngắn gọn giải thích giá trị của khóa học..."}
                  </p>

                  <div className="pt-3 border-t border-neutral-100 flex items-baseline justify-between">
                    <div>
                      <div className="text-xl font-bold text-[#8B1D2C]">
                        {(Number(newTuition) || 0).toLocaleString("vi-VN")} đ
                      </div>
                      {Number(newOrigTuition) > Number(newTuition) && (
                        <div className="text-xs text-neutral-400 line-through">
                          {(Number(newOrigTuition) || 0).toLocaleString("vi-VN")} đ
                        </div>
                      )}
                    </div>
                    <span className="text-xs font-medium px-2.5 py-1 bg-neutral-100 rounded text-neutral-700">
                      {newLevel}
                    </span>
                  </div>

                  <div className="pt-2 text-[10px] text-neutral-400 font-mono flex items-center justify-between">
                    <span>Slug: /{autoSlug || "..."}</span>
                    {isVersioned && (
                      <span className="text-amber-700 font-semibold">{autoSlug.match(/-v\d+$/)?.[0]}</span>
                    )}
                  </div>
                </div>

                <div className="mt-4 p-3 bg-neutral-50 rounded-lg text-[11px] text-neutral-500">
                  💡 Sau khi bấm <strong>Lưu</strong>, dữ liệu sẽ được chuyển lên Web App Google Apps Script và tự động ghi vào dòng mới của tab <code>courses</code> với đầy đủ định dạng số tiền VNĐ.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: LEAD TEST FORM */}
        {!loading && activeTab === "lead_test" && (
          <div className="max-w-2xl mx-auto bg-white rounded-xl border border-neutral-200 shadow-xs p-6 space-y-4">
            <div>
              <h2 className="text-sm font-bold text-neutral-900">Thử Nghiệm Gửi Lead Học Viên Trực Tiếp Vào Google Sheets</h2>
              <p className="text-xs text-neutral-500">
                Gửi thông tin thử nghiệm qua API <code>/api/leads</code> và quan sát bản ghi mới xuất hiện trong tab <code>leads (private)</code> trên Google Sheets
              </p>
            </div>

            <form onSubmit={handleTestSubmitLead} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Họ và Tên Học Viên:</label>
                <input
                  type="text"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  required
                  className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-[#8B1D2C] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Số Điện Thoại:</label>
                  <input
                    type="text"
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                    required
                    className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-[#8B1D2C] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Email:</label>
                  <input
                    type="email"
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    required
                    className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-[#8B1D2C] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Khóa Học Quan Tâm:</label>
                <select
                  value={leadCourse}
                  onChange={(e) => setLeadCourse(e.target.value)}
                  className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-[#8B1D2C] focus:outline-none"
                >
                  {report?.courses?.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Ghi Chú Tư Vấn:</label>
                <textarea
                  value={leadMessage}
                  onChange={(e) => setLeadMessage(e.target.value)}
                  rows={3}
                  className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-[#8B1D2C] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submittingLead}
                className="w-full py-2.5 rounded-lg bg-[#8B1D2C] hover:bg-[#A32435] text-white font-bold text-xs shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                {submittingLead ? "Đang gửi dữ liệu vào Google Sheets..." : "Gửi Lead Thử Nghiệm Ngay ➔"}
              </button>
            </form>

            {leadSubmitResult && (
              <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                  Kết Quả Phản Hồi Từ API:
                </span>
                <pre className="text-[11px] font-mono text-neutral-800 bg-white p-3 rounded-lg border border-neutral-200 overflow-x-auto">
                  {JSON.stringify(leadSubmitResult, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: RAW JSON INSPECTOR */}
        {!loading && activeTab === "raw_json" && (
          <div className="bg-white rounded-xl border border-neutral-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-neutral-900">Dữ Liệu JSON Thô Đọc Từ Google Sheets</h2>
                <p className="text-xs text-neutral-500">Xem trực tiếp payload đối chiếu giữa các ô Google Sheet và đối tượng JSON</p>
              </div>
              <button
                onClick={() => fetchSyncReport(true)}
                className="text-xs font-semibold text-[#8B1D2C] hover:underline cursor-pointer"
              >
                Làm mới JSON
              </button>
            </div>
            <pre className="text-xs font-mono text-neutral-800 bg-neutral-50 p-4 rounded-xl border border-neutral-200 max-h-96 overflow-y-auto">
              {JSON.stringify(report, null, 2)}
            </pre>
          </div>
        )}
      </main>
    </div>
  );
}
