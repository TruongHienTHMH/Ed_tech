/**
 * ==============================================================================
 * MODULE 04: HỆ THỐNG THÔNG BÁO TỰ ĐỘNG LEADS CRM (LEADS NOTIFICATIONS)
 * ==============================================================================
 * 1. sendLeadEmails(payload): Gửi email 2 chiều:
 *    - Email 1: Thông báo tức thì tới ban tuyển sinh / Founder Ly Hứa (hientruongthmh@gmail.com).
 *    - Email 2: Gửi thư cảm ơn học viên kèm mã liên kết Zalo tư vấn 1-1.
 * 2. sendTelegramNotification(payload): Bắn cảnh báo tức thì qua Telegram Bot (< 2s).
 * ==============================================================================
 */

function sendLeadEmails(payload) {
  if (!payload) return;

  var leadName = payload.name || "Học viên";
  var leadPhone = payload.phone || "Chưa cung cấp";
  var leadEmail = payload.email || "";
  var courseName = payload.course_name || payload.interested_courses || "Data Analytics";
  var courseId = payload.course_id || "general";
  var message = payload.message || payload.target_or_goal || "Không có";
  var timeStr = Utilities.formatDate(new Date(), "Asia/Ho_Chi_Minh", "dd/MM/yyyy HH:mm:ss");
  var zaloUrl = CONFIG.ZALO_CONTACT_URL || "https://zalo.me/0934938431";

  // --- 1. EMAIL GỬI CHO CLIENT (ADMIN / TUYỂN SINH) ---
  var clientRecipients = CONFIG.CLIENT_NOTIFICATION_EMAILS;
  if (clientRecipients && clientRecipients.length > 0) {
    var clientSubject = "🔥 [DataWithLy - Lead Mới] " + leadName + " vừa đăng ký tư vấn khóa " + courseName;
    var clientHtml = [
      "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E5E7EB; border-radius: 8px;'>",
      "<div style='background: #8B1D2C; color: #FFFFFF; padding: 15px 20px; border-radius: 6px 6px 0 0;'>",
      "<h2 style='margin: 0; font-size: 18px;'>🔥 THÔNG BÁO HỌC VIÊN ĐĂNG KÝ TƯ VẤN MỚI</h2>",
      "</div>",
      "<div style='padding: 20px; background: #FFFFFF;'>",
      "<p style='font-size: 14px; color: #374151;'>Hệ thống vừa tiếp nhận một lượt đăng ký tư vấn mới từ website DataWithLy:</p>",
      "<table style='width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 14px;'>",
      "<tr style='background: #F9FAFB;'><td style='padding: 10px; border: 1px solid #E5E7EB; font-weight: bold; width: 35%;'>Họ và tên:</td><td style='padding: 10px; border: 1px solid #E5E7EB; color: #111827;'>" + leadName + "</td></tr>",
      "<tr><td style='padding: 10px; border: 1px solid #E5E7EB; font-weight: bold;'>Số điện thoại:</td><td style='padding: 10px; border: 1px solid #E5E7EB;'><a href='tel:" + leadPhone + "' style='color: #8B1D2C; font-weight: bold; text-decoration: none;'>" + leadPhone + "</a> (Bấm để gọi)</td></tr>",
      "<tr style='background: #F9FAFB;'><td style='padding: 10px; border: 1px solid #E5E7EB; font-weight: bold;'>Email:</td><td style='padding: 10px; border: 1px solid #E5E7EB;'><a href='mailto:" + leadEmail + "' style='color: #2563EB; text-decoration: none;'>" + leadEmail + "</a></td></tr>",
      "<tr><td style='padding: 10px; border: 1px solid #E5E7EB; font-weight: bold;'>Khóa học quan tâm:</td><td style='padding: 10px; border: 1px solid #E5E7EB; font-weight: bold; color: #784080;'>" + courseName + " (" + courseId + ")</td></tr>",
      "<tr style='background: #F9FAFB;'><td style='padding: 10px; border: 1px solid #E5E7EB; font-weight: bold;'>Lời nhắn / Ghi chú:</td><td style='padding: 10px; border: 1px solid #E5E7EB;'>" + message + "</td></tr>",
      "<tr><td style='padding: 10px; border: 1px solid #E5E7EB; font-weight: bold;'>Thời gian đăng ký:</td><td style='padding: 10px; border: 1px solid #E5E7EB; color: #6B7280;'>" + timeStr + "</td></tr>",
      "</table>",
      "<div style='margin-top: 20px; padding: 12px; background: #FEF3C7; border-left: 4px solid #F59E0B; border-radius: 4px; font-size: 13px; color: #92400E;'>",
      "⚡ <strong>Hành động nhanh:</strong> Vui lòng liên hệ học viên trong vòng 15-30 phút để đạt tỷ lệ chuyển đổi cao nhất.",
      "</div>",
      "</div>",
      "</div>"
    ].join("");

    for (var i = 0; i < clientRecipients.length; i++) {
      var emailTo = clientRecipients[i];
      try {
        MailApp.sendEmail({
          to: emailTo,
          subject: clientSubject,
          htmlBody: clientHtml
        });
      } catch (err) {
        console.error("Lỗi khi gửi email thông báo cho Client (" + emailTo + "):", err);
      }
    }
  }

  // --- 2. EMAIL CẢM ƠN HỌC VIÊN KÈM MÃ ZALO TƯ VẤN ---
  if (leadEmail && leadEmail.indexOf("@") !== -1) {
    var studentSubject = "🎯 Xác nhận đăng ký tư vấn lộ trình Data Analytics - Mentor Hứa Thảo Ly";
    var studentHtml = [
      "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E5E7EB; border-radius: 8px;'>",
      "<div style='background: #8B1D2C; color: #FFFFFF; padding: 20px; border-radius: 6px 6px 0 0; text-align: center;'>",
      "<h1 style='margin: 0; font-size: 20px;'>Chào mừng bạn đến với DataWithLy!</h1>",
      "<p style='margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;'>Nền tảng đào tạo Data Analytics thực chiến cùng Mentor Hứa Thảo Ly</p>",
      "</div>",
      "<div style='padding: 24px; background: #FFFFFF; line-height: 1.6; color: #374151;'>",
      "<p>Chào <strong>" + leadName + "</strong>,</p>",
      "<p>Cảm ơn bạn đã quan tâm và đăng ký tư vấn khóa học <strong>" + courseName + "</strong> tại DataWithLy.</p>",
      "<p>Cô Ly và đội ngũ trợ giảng đã nhận được thông tin của bạn. Trong vòng <strong>15 - 30 phút tới</strong> (trong giờ làm việc), Mentor sẽ trực tiếp liên hệ qua số điện thoại/Zalo <strong>" + leadPhone + "</strong> để trao đổi chi tiết về định hướng và lộ trình học tập phù hợp nhất với bạn.</p>",
      "<div style='margin: 25px 0; text-align: center;'>",
      "<a href='" + zaloUrl + "' style='background: #0068FF; color: #FFFFFF; padding: 12px 24px; font-size: 15px; font-weight: bold; text-decoration: none; border-radius: 6px; display: inline-block;'>💬 Kết nối Zalo trực tiếp với Mentor ngay</a>",
      "</div>",
      "<p style='font-size: 13px; color: #6B7280;'>Nếu bạn có thắc mắc cần giải đáp gấp, bạn có thể chủ động bấm vào nút Zalo bên trên để được hỗ trợ tức thì.</p>",
      "<hr style='border: none; border-top: 1px solid #E5E7EB; margin: 20px 0;'>",
      "<p style='margin: 0; font-size: 13px; color: #9CA3AF;'>Trân trọng,<br><strong style='color: #4B5563;'>Hứa Thảo Ly & Đội ngũ DataWithLy</strong><br>Hotline/Zalo: 0934 938 431</p>",
      "</div>",
      "</div>"
    ].join("");

    try {
      MailApp.sendEmail({
        to: leadEmail,
        subject: studentSubject,
        htmlBody: studentHtml
      });
    } catch (err2) {
      console.error("Lỗi khi gửi email cảm ơn học viên (" + leadEmail + "):", err2);
    }
  }
}

function sendTelegramNotification(payload) {
  try {
    var text = "🔥 *CÓ HỌC VIÊN ĐĂNG KÝ TƯ VẤN MỚI!*\n\n" +
      "👤 *Họ tên:* " + (payload.name || "N/A") + "\n" +
      "📞 *Số điện thoại:* `" + (payload.phone || "N/A") + "`\n" +
      "📧 *Email:* " + (payload.email || "N/A") + "\n" +
      "📚 *Khóa học:* " + (payload.course_name || "Tư vấn chung") + "\n" +
      "💬 *Ghi chú:* " + (payload.message || "Không có");

    var url = "https://api.telegram.org/bot" + CONFIG.TELEGRAM_BOT_TOKEN + "/sendMessage";
    UrlFetchApp.fetch(url, {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify({
        chat_id: CONFIG.TELEGRAM_CHAT_ID,
        text: text,
        parse_mode: "Markdown"
      }),
      muteHttpExceptions: true
    });
  } catch (e) {
    Logger.log("Telegram alert error: " + e.toString());
  }
}
