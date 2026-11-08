"use client";

import { useState, useRef, useEffect } from "react";
import { getFlatAttribution } from "@/lib/analytics/attribution";
import {
  trackFormStart,
  trackFormSubmitAttempt,
  trackGenerateLead,
  trackFormSubmitError,
  trackFormRetry,
  trackClickZalo,
} from "@/lib/analytics/gtm";

const PENDING_LEAD_STORAGE_KEY = "ed_da_pending_lead_v1";

export interface LeadFormProps {
  formId?: string;
  ctaId?: string;
  defaultCourseId?: string;
  initialEmail?: string;
  onSuccess?: () => void;
  className?: string;
}

interface FormDataState {
  name: string;
  email: string;
  phone: string;
  interestedCourses: string[];
  message: string;
  attendanceCommitment: "Tôi chắc chắn" | "Tôi cam kết";
  _hp: string; // Honeypot
}

const AVAILABLE_COURSES = [
  { id: "sql-for-data-analytics", name: "SQL for Data Analytics" },
  {
    id: "data-analytical-thinking",
    name: "Analytical Thinking & Data Analysis with Looker Studio",
  },
];

function getInitialPendingData() {
  if (typeof window === "undefined") return null;
  try {
    const pending = localStorage.getItem(PENDING_LEAD_STORAGE_KEY);
    if (pending) {
      const parsed = JSON.parse(pending);
      if (parsed.submission_id && parsed.formData) {
        return parsed;
      }
    }
  } catch {
    // Ignore storage parse errors
  }
  return null;
}

export default function LeadForm({
  formId = "homepage_consultation_form",
  ctaId = "submit_consultation_form",
  defaultCourseId = "sql-for-data-analytics",
  initialEmail = "",
  onSuccess,
  className = "",
}: LeadFormProps) {
  const [initialPending] = useState(() => getInitialPendingData());

  const getInitialCourses = (courseId: string): string[] => {
    if (
      courseId === "data-analytical-thinking" ||
      courseId === "analytical-thinking-dashboard-design" ||
      courseId === "analytics-thinking"
    ) {
      return ["Analytical Thinking & Data Analysis with Looker Studio"];
    }
    if (courseId === "end-to-end-analytics") {
      return [
        "SQL for Data Analytics",
        "Analytical Thinking & Data Analysis with Looker Studio",
      ];
    }
    return ["SQL for Data Analytics"];
  };

  const [formData, setFormData] = useState<FormDataState>(() => {
    if (initialPending?.formData) {
      return initialPending.formData;
    }
    return {
      name: "",
      email: "",
      phone: "",
      interestedCourses: getInitialCourses(defaultCourseId),
      message: "",
      attendanceCommitment: "Tôi chắc chắn",
      _hp: "",
    };
  });

  const [submissionId, setSubmissionId] = useState<string>(() => {
    if (initialPending?.submission_id) {
      return initialPending.submission_id;
    }
    return typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : "";
  });

  const [status, setStatus] = useState<"idle" | "success" | "error">(() => {
    return initialPending ? "error" : "idle";
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [errorMessage, setErrorMessage] = useState<string>(() => {
    return initialPending
      ? "Bạn có biểu mẫu chưa hoàn tất gửi lần trước. Hãy bấm 'Thử lại ngay'."
      : "";
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [retryCount, setRetryCount] = useState<number>(0);

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      if (defaultCourseId) {
        setFormData((prev) => ({
          ...prev,
          interestedCourses:
            prev.interestedCourses.length > 0
              ? prev.interestedCourses
              : getInitialCourses(defaultCourseId),
        }));
      }
      if (initialEmail) {
        setFormData((prev) => ({
          ...prev,
          email: prev.email || initialEmail,
        }));
      }
    });
    return () => cancelAnimationFrame(frameId);
  }, [defaultCourseId, initialEmail]);

  const hasStartedRef = useRef<boolean>(false);
  const errorRef = useRef<HTMLDivElement>(null);

  const handleFieldFocus = () => {
    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      trackFormStart({
        form_id: formId,
        course_id: formData.interestedCourses.join(", ") || defaultCourseId,
      });
    }
  };

  const handleCourseToggle = (courseName: string) => {
    handleFieldFocus();
    setFormData((prev) => {
      const exists = prev.interestedCourses.includes(courseName);
      const next = exists
        ? prev.interestedCourses.filter((c) => c !== courseName)
        : [...prev.interestedCourses, courseName];
      return { ...prev, interestedCourses: next };
    });
    if (validationErrors.courses) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next.courses;
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Vui lòng nhập họ và tên của bạn";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Họ tên quá ngắn (tối thiểu 2 ký tự)";
    }

    const phoneClean = formData.phone.replace(/\s+/g, "");
    const phoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
    if (!phoneClean) {
      errors.phone = "Vui lòng nhập số điện thoại hoặc Zalo liên hệ";
    } else if (!phoneRegex.test(phoneClean)) {
      errors.phone = "Số điện thoại không hợp lệ (Ví dụ: 0912 345 678)";
    }

    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        errors.email = "Địa chỉ email không đúng định dạng";
      }
    }

    if (formData.interestedCourses.length === 0) {
      errors.courses = "Vui lòng chọn ít nhất một khóa coaching bạn quan tâm";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (isSubmitting) return;

    if (!validate()) return;

    setIsSubmitting(true);
    setErrorMessage("");

    const currentSubId = submissionId || crypto.randomUUID();
    if (!submissionId) setSubmissionId(currentSubId);

    const primaryCourse = formData.interestedCourses.some((c) =>
      c.toLowerCase().includes("sql")
    )
      ? "sql-for-data-analytics"
      : "data-analytical-thinking";

    const selectedCourseNames = formData.interestedCourses.join(", ");

    trackFormSubmitAttempt({
      form_id: formId,
      submission_id: currentSubId,
      course_id: primaryCourse,
    });

    const attr = getFlatAttribution();
    const noteLines = [
      formData.message.trim() ? `Mục tiêu/Vị trí: ${formData.message.trim()}` : "",
      `Khóa quan tâm: ${selectedCourseNames}`,
      `Cam kết xuất hiện: ${formData.attendanceCommitment}`,
    ].filter(Boolean);

    const payload = {
      submission_id: currentSubId,
      client_submitted_at: new Date().toISOString(),
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      course_id: primaryCourse,
      course_name: selectedCourseNames,
      message: noteLines.join("\n"),
      _hp: formData._hp,
      form_id: formId,
      cta_id: ctaId,
      page_url: typeof window !== "undefined" ? window.location.href : "",
      ...attr,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const result = await response.json();

      if (response.ok && result.ok) {
        setStatus("success");
        try {
          localStorage.removeItem(PENDING_LEAD_STORAGE_KEY);
        } catch {
          // Ignore storage delete errors
        }

        trackGenerateLead({
          form_id: formId,
          submission_id: currentSubId,
          course_id: primaryCourse,
          status: result.status === "duplicate" ? "duplicate" : "stored",
        });

        if (onSuccess) onSuccess();
      } else {
        throw new Error(
          result.error?.message || "Máy chủ không thể lưu thông tin lúc này."
        );
      }
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      const isAbort = (err as Error)?.name === "AbortError";
      const errText = isAbort
        ? "Quá thời gian phản hồi (timeout). Vui lòng thử lại hoặc liên hệ Zalo trực tiếp."
        : (err as Error)?.message ||
          "Không thể kết nối máy chủ. Thông tin của bạn đã được giữ lại.";

      setStatus("error");
      setErrorMessage(errText);

      // Save pending payload to localStorage
      try {
        localStorage.setItem(
          PENDING_LEAD_STORAGE_KEY,
          JSON.stringify({
            submission_id: currentSubId,
            formData,
            savedAt: new Date().toISOString(),
          })
        );
      } catch {
        // Ignore storage write errors
      }

      trackFormSubmitError({
        form_id: formId,
        submission_id: currentSubId,
        error_type: isAbort ? "TIMEOUT" : "SUBMIT_FAILED",
      });

      if (errorRef.current) {
        errorRef.current.focus();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    const nextRetry = retryCount + 1;
    setRetryCount(nextRetry);
    trackFormRetry({
      form_id: formId,
      submission_id: submissionId,
      retry_count: nextRetry,
    });
    handleSubmit();
  };

  const handleResetForNewSubmission = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      interestedCourses: getInitialCourses(defaultCourseId),
      message: "",
      attendanceCommitment: "Tôi chắc chắn",
      _hp: "",
    });
    setSubmissionId(crypto.randomUUID());
    setStatus("idle");
    setValidationErrors({});
    hasStartedRef.current = false;
  };

  if (status === "success") {
    return (
      <div
        className={`bg-white rounded-2xl p-6 sm:p-8 text-neutral-900 border border-emerald-200 shadow-xl text-center space-y-4 animate-in fade-in zoom-in-95 duration-200 ${className}`}
        aria-live="polite"
      >
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
          ✓
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-neutral-900">
          Đăng Ký Tư Vấn Thành Công!
        </h3>
        <p className="text-sm sm:text-base text-neutral-600 max-w-md mx-auto leading-relaxed">
          Cảm ơn <strong>{formData.name}</strong>. Giảng viên Lý Data sẽ liên hệ trực tiếp qua số điện thoại/Zalo{" "}
          <strong className="text-[#8B1D2C]">{formData.phone}</strong> trong vòng 12 giờ làm việc để tư vấn lộ trình học phù hợp nhất cho bạn.
        </p>
        <div className="pt-2">
          <button
            type="button"
            onClick={handleResetForNewSubmission}
            className="text-xs font-semibold text-[#8B1D2C] hover:text-[#AF445A] underline cursor-pointer"
          >
            Đăng ký thêm thông tin khác
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={`space-y-4 text-left ${className}`}
      aria-label="Biểu mẫu đăng ký tư vấn khóa học"
    >
      {/* Honeypot Anti-Bot Field */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor={`hp_${formId}`}>Do not fill this</label>
        <input
          id={`hp_${formId}`}
          type="text"
          name="_hp"
          value={formData._hp}
          onChange={(e) => setFormData({ ...formData, _hp: e.target.value })}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Form Error Alert */}
      {status === "error" && (
        <div
          ref={errorRef}
          tabIndex={-1}
          aria-live="assertive"
          className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm space-y-2 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <div className="flex items-start gap-2 font-semibold">
            <span className="text-red-500 font-bold">⚠️</span>
            <span>{errorMessage || "Có lỗi xảy ra khi gửi thông tin."}</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              onClick={handleRetry}
              disabled={isSubmitting}
              className="px-4 py-1.5 rounded-lg bg-red-600 text-white font-semibold text-xs hover:bg-red-700 transition-colors shadow-xs active:scale-95 cursor-pointer"
            >
              {isSubmitting ? "Đang thử lại..." : "Thử lại ngay"}
            </button>
            <a
              href="https://zalo.me/0934938431"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackClickZalo({ cta_location: "form_error_fallback" })}
              className="text-xs text-[#8B1D2C] font-semibold underline hover:text-[#AF445A]"
            >
              Hoặc nhắn tin qua Zalo hỗ trợ &rarr;
            </a>
          </div>
        </div>
      )}

      {/* 1. Họ và tên */}
      <div className="space-y-1">
        <label
          htmlFor={`name_${formId}`}
          className="block text-xs font-bold text-neutral-800 uppercase tracking-wider"
        >
          Họ và tên <span className="text-red-500">*</span>
        </label>
        <input
          id={`name_${formId}`}
          type="text"
          required
          placeholder="Nhập họ và tên của bạn"
          value={formData.name}
          onFocus={handleFieldFocus}
          onChange={(e) => {
            setFormData({ ...formData, name: e.target.value });
            if (validationErrors.name) {
              setValidationErrors((prev) => {
                const next = { ...prev };
                delete next.name;
                return next;
              });
            }
          }}
          disabled={isSubmitting}
          className={`w-full px-4 py-2.5 rounded-xl border text-sm font-medium bg-neutral-50/70 text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
            validationErrors.name
              ? "border-red-500 focus:ring-red-400"
              : "border-neutral-300 focus:ring-[#8B1D2C]/40 focus:border-[#8B1D2C]"
          }`}
        />
        {validationErrors.name && (
          <p className="text-xs text-red-600 font-medium">{validationErrors.name}</p>
        )}
      </div>

      {/* 2. Email */}
      <div className="space-y-1">
        <label
          htmlFor={`email_${formId}`}
          className="block text-xs font-bold text-neutral-800 uppercase tracking-wider"
        >
          Email
        </label>
        <input
          id={`email_${formId}`}
          type="email"
          placeholder="example@gmail.com"
          value={formData.email}
          onFocus={handleFieldFocus}
          onChange={(e) => {
            setFormData({ ...formData, email: e.target.value });
            if (validationErrors.email) {
              setValidationErrors((prev) => {
                const next = { ...prev };
                delete next.email;
                return next;
              });
            }
          }}
          disabled={isSubmitting}
          className={`w-full px-4 py-2.5 rounded-xl border text-sm font-medium bg-neutral-50/70 text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
            validationErrors.email
              ? "border-red-500 focus:ring-red-400"
              : "border-neutral-300 focus:ring-[#8B1D2C]/40 focus:border-[#8B1D2C]"
          }`}
        />
        {validationErrors.email && (
          <p className="text-xs text-red-600 font-medium">{validationErrors.email}</p>
        )}
      </div>

      {/* 3. Số điện thoại / Zalo */}
      <div className="space-y-1">
        <label
          htmlFor={`phone_${formId}`}
          className="block text-xs font-bold text-neutral-800 uppercase tracking-wider"
        >
          Số điện thoại / Zalo <span className="text-red-500">*</span>
        </label>
        <input
          id={`phone_${formId}`}
          type="tel"
          required
          placeholder="0912 345 678"
          value={formData.phone}
          onFocus={handleFieldFocus}
          onChange={(e) => {
            setFormData({ ...formData, phone: e.target.value });
            if (validationErrors.phone) {
              setValidationErrors((prev) => {
                const next = { ...prev };
                delete next.phone;
                return next;
              });
            }
          }}
          disabled={isSubmitting}
          className={`w-full px-4 py-2.5 rounded-xl border text-sm font-medium bg-neutral-50/70 text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
            validationErrors.phone
              ? "border-red-500 focus:ring-red-400"
              : "border-neutral-300 focus:ring-[#8B1D2C]/40 focus:border-[#8B1D2C]"
          }`}
        />
        {validationErrors.phone && (
          <p className="text-xs text-red-600 font-medium">{validationErrors.phone}</p>
        )}
      </div>

      {/* 4. Checkbox: Khóa coaching bạn quan tâm là */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider">
          Khóa coaching bạn quan tâm là: <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2 bg-neutral-50/80 p-3 rounded-xl border border-neutral-200">
          {AVAILABLE_COURSES.map((course) => {
            const isChecked = formData.interestedCourses.includes(course.name);
            return (
              <label
                key={course.id}
                className="flex items-center gap-3 text-sm font-medium text-neutral-800 cursor-pointer select-none hover:text-neutral-950"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleCourseToggle(course.name)}
                  disabled={isSubmitting}
                  className="w-4 h-4 rounded text-[#8B1D2C] accent-[#8B1D2C] focus:ring-[#8B1D2C] border-neutral-300 cursor-pointer"
                />
                <span>{course.name}</span>
              </label>
            );
          })}
        </div>
        {validationErrors.courses && (
          <p className="text-xs text-red-600 font-medium">{validationErrors.courses}</p>
        )}
      </div>

      {/* 5. Input: Mục tiêu học tập hoặc vị trí hiện tại */}
      <div className="space-y-1">
        <label
          htmlFor={`message_${formId}`}
          className="block text-xs font-bold text-neutral-800 uppercase tracking-wider"
        >
          Mục tiêu học tập hoặc vị trí hiện tại
        </label>
        <input
          id={`message_${formId}`}
          type="text"
          placeholder="Ví dụ: Chuyển ngành sang DA, nâng cao kỹ năng xử lý data..."
          value={formData.message}
          onFocus={handleFieldFocus}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          disabled={isSubmitting}
          className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-sm font-medium bg-neutral-50/70 text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8B1D2C]/40 focus:border-[#8B1D2C] transition-all"
        />
      </div>

      {/* 6. Radio Group: Bạn nhớ xuất hiện đúng giờ hẹn nhé */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider">
          Bạn nhớ xuất hiện đúng giờ hẹn nhé
        </label>
        <div className="flex items-center gap-6 bg-neutral-50/80 p-3 rounded-xl border border-neutral-200">
          <label className="flex items-center gap-2 text-sm font-medium text-neutral-800 cursor-pointer select-none">
            <input
              type="radio"
              name={`attendance_${formId}`}
              value="Tôi chắc chắn"
              checked={formData.attendanceCommitment === "Tôi chắc chắn"}
              onChange={() =>
                setFormData({ ...formData, attendanceCommitment: "Tôi chắc chắn" })
              }
              disabled={isSubmitting}
              className="w-4 h-4 text-[#8B1D2C] accent-[#8B1D2C] focus:ring-[#8B1D2C] cursor-pointer"
            />
            <span>Tôi chắc chắn</span>
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-neutral-800 cursor-pointer select-none">
            <input
              type="radio"
              name={`attendance_${formId}`}
              value="Tôi cam kết"
              checked={formData.attendanceCommitment === "Tôi cam kết"}
              onChange={() =>
                setFormData({ ...formData, attendanceCommitment: "Tôi cam kết" })
              }
              disabled={isSubmitting}
              className="w-4 h-4 text-[#8B1D2C] accent-[#8B1D2C] focus:ring-[#8B1D2C] cursor-pointer"
            />
            <span>Tôi cam kết</span>
          </label>
        </div>
      </div>

      {/* 7. Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 px-6 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-[#8B1D2C] to-[#AF445A] hover:from-[#731422] hover:to-[#96374C] disabled:opacity-60 transition-all shadow-lg hover:shadow-xl active:scale-98 cursor-pointer flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Đang gửi thông tin...</span>
            </>
          ) : (
            <span>Đăng Ký Tư Vấn</span>
          )}
        </button>
      </div>

      <p className="text-[11px] text-neutral-500 text-center pt-1 font-medium">
        Cam kết bảo mật thông tin • Tư vấn 1-on-1 cùng Mentor Hứa Thảo Ly
      </p>
    </form>
  );
}
