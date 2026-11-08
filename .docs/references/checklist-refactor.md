# Cần update lại một số vấn đề sau
1. Tinh gọn code.
2. Fix lỗi không khớp design.
3. Update lại 1 số tính năng cho Sheets CMS.
## Data
Vấn đề đầu tiên cần điều chỉnh nằm ở dữ liệu. Cần phải dọn sạch những mock data không cần thiết, Kiểm tra xem những có những mã nguồn tsx hay component nào không được gọi có thể xoá đi. 
Cần tối ưu lại 1 số unit component - một số component Btn hay icon sài chung chưa được gọi đúng nơi. 
## AppScript
Đối với Script - HTML Sheets APPSCRIPT thay thế tính năng lưu vào tạo thêm thành tính nămg: thêm "+", nghĩa là sẽ thêm 1 Form nữa và sau đó người dùng nhập input vào và chọn lưu sẽ tự đòng lưu hàng loạt. Áp dụng cho Khoá học - Lộ trình - Blogs - Giảng viên. Nhớ bám sát các quy tắc nghiệp vụ.
## Design
Hiện tại đang có 1 số desgin bị lệch và thiếu sao với thiết kế. 
1. Chung: 
    * Thanh Ưu đãi, phía trên header đang không bám them layout chung, nó đang bị trành ra khỏi scope hay dài hơn so với Header và các component khác - padding hoặc margin đang không chuẩn. 
    Banner ưu đãi: https://www.figma.com/design/epfQwa5s3iMO6toM4Fmmpu/Hien-Ed_TECH?node-id=12-684&m=dev 
    Header_black: https://www.figma.com/design/epfQwa5s3iMO6toM4Fmmpu/Hien-Ed_TECH?node-id=12-1174&m=dev, Và cũng cần refactor lại header của dự án, vì chúng ta có đến 2 header. 
    Header_white: https://www.figma.com/design/epfQwa5s3iMO6toM4Fmmpu/Hien-Ed_TECH?node-id=12-1769&m=dev
    Ảnh: /Users/hientruongthmh/Desktop/Ảnh màn hình 2026-11-08 lúc 16.49.30.png

    * Bỏ đi CTA Đăng ký tư vấn ở mỗi page: 
    <button
        type="button"
        onClick={() => openLeadModal({ ctaLocation: "floating_pill_cta" })}
        className="flex items-center gap-2 bg-gradient-to-r from-[#8B1D2C] to-[#AF445A] hover:from-[#731422] hover:to-[#96374C] text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer border border-white/20"
        title="Đăng ký tư vấn 1-on-1"
      >
    Trong FloatingCta.tsx

    * Resize lại các Section cho hợp lý, để refactor chính xác, cần hỏi Section đó có những component nào và list ra những component đó ra cho mình chọn.

    * Thiếu badge - component có chức năng làm đầy Section hoặc "hài hoà" Section: 
        Upper: https://www.figma.com/design/epfQwa5s3iMO6toM4Fmmpu/Hien-Ed_TECH?node-id=12-779&m=dev,
        Lower: https://www.figma.com/design/epfQwa5s3iMO6toM4Fmmpu/Hien-Ed_TECH?node-id=12-781&m=dev

2. Homepage: 
    * HeroSection đang thiếu 2 compoenent ảnh như thiết kế: https://www.figma.com/design/epfQwa5s3iMO6toM4Fmmpu/Hien-Ed_TECH?node-id=12-701&m=dev
        2 component đó là: 
            1. https://www.figma.com/design/epfQwa5s3iMO6toM4Fmmpu/Hien-Ed_TECH?node-id=12-702&m=dev
            2. https://www.figma.com/design/epfQwa5s3iMO6toM4Fmmpu/Hien-Ed_TECH?node-id=12-708&m=dev
    
    * CourseDetail cũng cần fix lại theo thiết kế sau: https://www.figma.com/design/epfQwa5s3iMO6toM4Fmmpu/Hien-Ed_TECH?node-id=12-778&m=dev

    * Học viên đã trúng tuyển section lệch so với design: https://www.figma.com/design/epfQwa5s3iMO6toM4Fmmpu/Hien-Ed_TECH?node-id=12-782&m=dev
        Và những công ty này cần dạng tự động trượt 1 cách hài hoà, 
    
    * ComboPricingSection cũng cần refactor lại: https://www.figma.com/design/epfQwa5s3iMO6toM4Fmmpu/Hien-Ed_TECH?node-id=12-1175&m=dev

    * Các dự án của học viên Section cần Refactor lại như sau: https://www.figma.com/design/epfQwa5s3iMO6toM4Fmmpu/Hien-Ed_TECH?node-id=12-873&m=dev

    * Đánh giá của Sinh viên: https://www.figma.com/design/epfQwa5s3iMO6toM4Fmmpu/Hien-Ed_TECH?node-id=12-892&m=dev

3. CourseDetail
    * Có thể giữa thiết kế hiện tại cần update lại 1 vài chi tiết nhỏ như badge - btn - layout. 
    * Về như CourseHero bỏ đi các {/* Trust Proof Bullets */} vì không cần 
    * Thay thế các Badge 
        {/* Tag Badge */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center px-3.5 py-1 rounded-full border border-[#AF445A] bg-[#AF445A]/10 text-xs sm:text-sm font-bold text-[#FFC934] tracking-wide uppercase">
                {course.tag || "Data Analytics"}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-xs sm:text-sm text-white/90 font-medium">
                {course.level || "Người mới bắt đầu"}
              </span>
            </div>
        
        Hoặc thêm badge như thiết kế sau: https://www.figma.com/design/epfQwa5s3iMO6toM4Fmmpu/Hien-Ed_TECH?node-id=12-1427&m=dev

        Bage Live Online Qua Zoom cần Sử thành Live Class bỏ đi Badge Mentor nào kèm 
    
    * Cần đầy đủ các trường thông tin sau như design https://www.figma.com/design/epfQwa5s3iMO6toM4Fmmpu/Hien-Ed_TECH?node-id=12-1430&m=dev 

    Đã có lỗi responesive của các component CourseMethodologyFlow, CourseOutcomes , bạn có thể fix lại.

*Lưu ý* vì các frame bị sắp xếp không đúng quy tắc nên hãy check ảnh từ: .docs/references/homepage_ref.png, .docs/references/coursedetail_ref.png trước để nhận layout đúng nhất.