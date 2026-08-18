import type { QuoteDocument } from "./types"

// vn-ok: fixture preserves the client's original Vietnamese copy
/**
 * Real client proposal data from 06/08/2026 used as the preview fixture.
 *
 * Deliberately the REAL one rather than invented filler: a template only proves it
 * works when the copy is as long, as awkward and as unevenly sized as the actual
 * thing. Lorem ipsum makes every table look balanced.
 *
 * NOTE: Two things in here are flagged in `biz.md` as unresolved and are NOT to be
 * treated as settled house policy just because they appear in a fixture:
 *   1. The 25.000.000đ total sits below the 25tr floor agreed for the cheapest
 *      advertised WEB tier, while this scope is a dual-platform app suite.
 *   2. The original PDF carried no warranty and no maintenance plan at all.
 * The warranty/maintenance fields below reflect the agreed house terms, so the
 * preview shows what the template SHOULD say — not what that PDF said.
 */
export const sampleYabai: QuoteDocument = {
    reference: "TEDO-2026-08-YABAI",
    client: { name: "YABAI NAIL", note: "Chuỗi salon nail · 2 chi nhánh" }, // vn-ok: fixture preserves the client's original Vietnamese copy
    issuedAt: "2026-08-06",
    validDays: 30,

    title: "Ra mắt app đặt lịch nail đa chi nhánh trên iPhone & Android", // vn-ok: fixture preserves the client's original Vietnamese copy
    summary:
        "Ứng dụng cho khách, app quản trị và web admin cho salon — phong cách app nail Nhật: gọn, thao tác nhanh, đặt lịch trong vài chạm. Hỗ trợ tiếng Việt và tiếng Nhật, đăng lên App Store và CH Play.", // vn-ok: fixture preserves the client's original Vietnamese copy

    facts: [
        { label: "Khách hàng", value: "YABAI NAIL" }, // vn-ok: fixture preserves the client's original Vietnamese copy
        { label: "Đơn vị thực hiện", value: "TEDO" }, // vn-ok: fixture preserves the client's original Vietnamese copy
        { label: "Thời gian", value: "3 – 4 tuần" }, // vn-ok: fixture preserves the client's original Vietnamese copy
        { label: "Nền tảng", value: "iPhone & Android" }, // vn-ok: fixture preserves the client's original Vietnamese copy
    ],

    features: [
        {
            title: "Đặt lịch & phân bổ nhân viên", // vn-ok: fixture preserves the client's original Vietnamese copy
            body: "Khách chọn dịch vụ, nhân viên, ngày giờ và gửi kèm ảnh mẫu. Hệ thống hiện khung giờ trống, tự phân bổ theo nhân viên rảnh, chống trùng lịch — một khung giờ một nhân viên.", // vn-ok: fixture preserves the client's original Vietnamese copy
            core: true,
        },
        {
            title: "Tích điểm & hạng thành viên", // vn-ok: fixture preserves the client's original Vietnamese copy
            body: "Tích điểm mỗi lần dùng dịch vụ, quy đổi trừ thẳng vào tiền. Hạng tự động Bạc → Gold → Kim cương, coupon sinh nhật và quay lại, thẻ thành viên QR.", // vn-ok: fixture preserves the client's original Vietnamese copy
            core: true,
        },
        {
            title: "Đăng ký & nhắc lịch", // vn-ok: fixture preserves the client's original Vietnamese copy
            body: "Đăng ký bằng số điện thoại kèm OTP hoặc mạng xã hội, không bắt nhập nhiều — vào app là đặt được lịch ngay. Thông báo đẩy nhắc lịch, ưu đãi, sinh nhật.", // vn-ok: fixture preserves the client's original Vietnamese copy
            core: true,
        },
        {
            title: "Quản trị salon & đa chi nhánh", // vn-ok: fixture preserves the client's original Vietnamese copy
            body: "Quản lý lịch, khách, dịch vụ, nhân viên trên app và web admin. Hai chi nhánh có phân quyền, báo cáo tổng hợp và báo cáo theo từng salon.", // vn-ok: fixture preserves the client's original Vietnamese copy
            core: true,
        },
    ],

    scope: [
        "Đặt lịch, phân bổ nhân viên, chống trùng lịch", // vn-ok: fixture preserves the client's original Vietnamese copy
        "Phân bổ nhân viên tối ưu nâng cao", // vn-ok: fixture preserves the client's original Vietnamese copy
        "Tích điểm, hạng thành viên, coupon", // vn-ok: fixture preserves the client's original Vietnamese copy
        "Đăng ký nhanh và thông báo đẩy nhắc lịch", // vn-ok: fixture preserves the client's original Vietnamese copy
        "Menu dịch vụ, gửi ảnh mẫu, bộ sưu tập mẫu nail", // vn-ok: fixture preserves the client's original Vietnamese copy
        "Lịch hẹn của tôi, review và đánh giá", // vn-ok: fixture preserves the client's original Vietnamese copy
        "App quản trị salon: lịch, khách, dịch vụ, nhân viên, báo cáo", // vn-ok: fixture preserves the client's original Vietnamese copy
        "Web admin đầy đủ, quản trị trên trình duyệt", // vn-ok: fixture preserves the client's original Vietnamese copy
        "Đa chi nhánh: phân quyền, báo cáo theo từng salon", // vn-ok: fixture preserves the client's original Vietnamese copy
        "Song ngữ Việt / Nhật, khung cơ bản", // vn-ok: fixture preserves the client's original Vietnamese copy
        "Đưa lên App Store và CH Play", // vn-ok: fixture preserves the client's original Vietnamese copy
    ],
    outOfScope: [
        "Thanh toán online — bản này dùng tiền mặt và đặt cọc, bổ sung sau nếu salon cần", // vn-ok: fixture preserves the client's original Vietnamese copy
    ],

    phases: [
        {
            when: "Ngày 1 – 3", // vn-ok: fixture preserves the client's original Vietnamese copy
            title: "Thiết kế UX/UI", // vn-ok: fixture preserves the client's original Vietnamese copy
            body: "Wireframe và giao diện app khách, app quản trị, web admin dựa trên bản tham khảo. Salon duyệt trước khi code.", // vn-ok: fixture preserves the client's original Vietnamese copy
            tag: "Thiết kế", // vn-ok: fixture preserves the client's original Vietnamese copy
        },
        {
            when: "Ngày 4 – 11", // vn-ok: fixture preserves the client's original Vietnamese copy
            title: "Lập trình app khách hàng", // vn-ok: fixture preserves the client's original Vietnamese copy
            body: "Đăng ký, trang chủ, đặt lịch và chống trùng, menu và ảnh mẫu, lịch hẹn, thành viên và điểm, review, thông báo.", // vn-ok: fixture preserves the client's original Vietnamese copy
            tag: "Code",
        },
        {
            when: "Ngày 12 – 18", // vn-ok: fixture preserves the client's original Vietnamese copy
            title: "App quản trị, web admin, đa chi nhánh", // vn-ok: fixture preserves the client's original Vietnamese copy
            body: "Quản lý lịch, khách, dịch vụ, nhân viên và hoa hồng, coupon, báo cáo. Web admin, phân quyền và báo cáo đa chi nhánh.", // vn-ok: fixture preserves the client's original Vietnamese copy
            tag: "Code",
        },
        {
            when: "Ngày 19 – 20", // vn-ok: fixture preserves the client's original Vietnamese copy
            title: "Phân bổ nâng cao & tích hợp", // vn-ok: fixture preserves the client's original Vietnamese copy
            body: "Thuật toán phân bổ nhân viên tối ưu, ghép nối luồng khách với salon và chi nhánh, chuẩn bị dữ liệu mẫu.", // vn-ok: fixture preserves the client's original Vietnamese copy
            tag: "Code",
        },
        {
            when: "Ngày 21 – 23", // vn-ok: fixture preserves the client's original Vietnamese copy
            title: "Kiểm thử, lên store, bàn giao", // vn-ok: fixture preserves the client's original Vietnamese copy
            body: "Kiểm thử, build, đăng cả hai store, hướng dẫn sử dụng cho salon.", // vn-ok: fixture preserves the client's original Vietnamese copy
            tag: "Bàn giao", // vn-ok: fixture preserves the client's original Vietnamese copy
        },
    ],

    groups: [
        {
            code: "A",
            title: "Thiết kế UX/UI", // vn-ok: fixture preserves the client's original Vietnamese copy
            note: "2 – 3 ngày", // vn-ok: fixture preserves the client's original Vietnamese copy
            lines: [
                { label: "Nghiên cứu bản tham khảo và wireframe", detail: "Luồng khách, 8 màn hình", amount: 1_000_000 }, // vn-ok: fixture preserves the client's original Vietnamese copy
                { label: "Thiết kế UI màn khách hàng", detail: "UI kit và 8 màn hoàn chỉnh", amount: 1_200_000 }, // vn-ok: fixture preserves the client's original Vietnamese copy
                { label: "Thiết kế UI app quản trị và web admin", detail: "Các màn quản lý và dashboard web", amount: 800_000 }, // vn-ok: fixture preserves the client's original Vietnamese copy
            ],
        },
        {
            code: "B",
            title: "App khách hàng — iPhone & Android", // vn-ok: fixture preserves the client's original Vietnamese copy
            lines: [
                { label: "Đăng ký và đăng nhập tối ưu", detail: "Số điện thoại kèm OTP, mạng xã hội", amount: 800_000 }, // vn-ok: fixture preserves the client's original Vietnamese copy
                { label: "Trang chủ, giới thiệu, khuyến mãi", detail: "Banner, ưu đãi, địa chỉ", amount: 700_000 }, // vn-ok: fixture preserves the client's original Vietnamese copy
                { label: "Đặt lịch và chống trùng lịch", detail: "Dịch vụ, nhân viên, ngày giờ, ảnh mẫu", amount: 2_000_000 }, // vn-ok: fixture preserves the client's original Vietnamese copy
                { label: "Engine phân bổ nhân viên và khung giờ trống", detail: "Tự động, chống trùng nâng cao", amount: 1_200_000 }, // vn-ok: fixture preserves the client's original Vietnamese copy
                { label: "Menu dịch vụ và gửi ảnh mẫu", detail: "6 nhóm dịch vụ", amount: 900_000 }, // vn-ok: fixture preserves the client's original Vietnamese copy
                { label: "Lịch hẹn của tôi", detail: "Sắp tới, lịch sử, đổi, hủy", amount: 700_000 }, // vn-ok: fixture preserves the client's original Vietnamese copy
                { label: "Thành viên, tích điểm, QR, hạng", detail: "Tự thăng hạng Bạc → Gold → Kim cương", amount: 1_300_000 }, // vn-ok: fixture preserves the client's original Vietnamese copy
                { label: "Bộ sưu tập mẫu nail", detail: "Lọc theo phong cách", amount: 500_000 }, // vn-ok: fixture preserves the client's original Vietnamese copy
                { label: "Review và đánh giá", detail: "Sao, ảnh, thưởng điểm", amount: 500_000 }, // vn-ok: fixture preserves the client's original Vietnamese copy
                { label: "Trang cá nhân và thông báo đẩy", detail: "Hồ sơ, nhắc lịch, thông báo", amount: 700_000 }, // vn-ok: fixture preserves the client's original Vietnamese copy
                { label: "Song ngữ Việt / Nhật", detail: "Khung cơ bản, chuyển ngôn ngữ giao diện", amount: 700_000 }, // vn-ok: fixture preserves the client's original Vietnamese copy
            ],
        },
        {
            code: "C",
            title: "Trang quản lý salon", // vn-ok: fixture preserves the client's original Vietnamese copy
            lines: [
                { label: "Quản lý lịch và phân bổ nhân viên", detail: "Ngày / tuần / tháng, chống trùng, xác nhận", amount: 1_800_000 }, // vn-ok: fixture preserves the client's original Vietnamese copy
                { label: "Quản lý khách hàng và điểm", detail: "Hồ sơ, lịch sử, ghi chú", amount: 700_000 }, // vn-ok: fixture preserves the client's original Vietnamese copy
                { label: "Quản lý dịch vụ và giá", detail: "Thêm, sửa menu, phụ phí, thời gian", amount: 500_000 }, // vn-ok: fixture preserves the client's original Vietnamese copy
                { label: "Quản lý nhân viên, hoa hồng, lương", detail: "Kỹ năng, doanh thu, hoa hồng", amount: 800_000 }, // vn-ok: fixture preserves the client's original Vietnamese copy
                { label: "Thanh toán", detail: "Tiền mặt, đặt cọc, hoàn tiền", amount: 500_000 }, // vn-ok: fixture preserves the client's original Vietnamese copy
                { label: "Điểm và coupon", detail: "Sinh nhật, quay lại 30 / 60 ngày", amount: 500_000 }, // vn-ok: fixture preserves the client's original Vietnamese copy
                { label: "Báo cáo và ảnh trước / sau", detail: "Doanh thu, khách mới và cũ, ảnh đăng mạng xã hội", amount: 700_000 }, // vn-ok: fixture preserves the client's original Vietnamese copy
            ],
        },
        {
            code: "D",
            title: "Đa chi nhánh, web admin, phân bổ nâng cao", // vn-ok: fixture preserves the client's original Vietnamese copy
            lines: [
                { label: "Quản lý đa chi nhánh và phân quyền", detail: "Báo cáo tổng hợp và theo từng salon", amount: 2_000_000 }, // vn-ok: fixture preserves the client's original Vietnamese copy
                { label: "Web admin dashboard đầy đủ", detail: "Quản trị trên trình duyệt", amount: 2_200_000 }, // vn-ok: fixture preserves the client's original Vietnamese copy
                { label: "Phân bổ nhân viên tối ưu nâng cao", detail: "Thuật toán tối ưu, giảm trống lịch", amount: 800_000 }, // vn-ok: fixture preserves the client's original Vietnamese copy
            ],
        },
        {
            code: "E",
            title: "Deploy và bàn giao", // vn-ok: fixture preserves the client's original Vietnamese copy
            lines: [
                { label: "Kiểm thử, bàn giao, hướng dẫn", detail: "Kiểm thử, tài liệu, đào tạo salon", amount: 1_500_000 }, // vn-ok: fixture preserves the client's original Vietnamese copy
                { label: "Đưa lên CH Play và App Store", detail: "TEDO đăng cả hai store", badge: "included" }, // vn-ok: fixture preserves the client's original Vietnamese copy
                { label: "Cấu hình tên miền năm đầu", detail: "Quà tặng từ TEDO", badge: "gift" }, // vn-ok: fixture preserves the client's original Vietnamese copy
            ],
        },
    ],

    runningCosts: [
        { label: "Cloud server", note: "Vận hành app và dữ liệu, giai đoạn đầu", cost: "500.000 đ / tháng" }, // vn-ok: fixture preserves the client's original Vietnamese copy
        { label: "Tên miền — năm đầu", note: "Quà tặng từ TEDO", cost: "Miễn phí" }, // vn-ok: fixture preserves the client's original Vietnamese copy
        { label: "Tên miền — từ năm thứ hai", note: "Gia hạn hằng năm", cost: "~300.000 đ / năm" }, // vn-ok: fixture preserves the client's original Vietnamese copy
        { label: "Google Play Developer", note: "TEDO chi trả khi đăng app, một lần", cost: "Miễn phí" }, // vn-ok: fixture preserves the client's original Vietnamese copy
        { label: "Apple Developer", note: "Bắt buộc để đăng app iOS, gia hạn hằng năm", cost: "~2.500.000 đ / năm" }, // vn-ok: fixture preserves the client's original Vietnamese copy
    ],
    scaleNotes: [
        { label: "Lượt đặt lịch tăng mạnh", note: "Server cần nâng cấu hình để chạy mượt", cost: "~1 – 2 triệu / tháng" }, // vn-ok: fixture preserves the client's original Vietnamese copy
        { label: "Lưu nhiều ảnh mẫu và ảnh trước / sau", note: "Tăng dung lượng lưu trữ và băng thông", cost: "~100 – 500 nghìn / tháng" }, // vn-ok: fixture preserves the client's original Vietnamese copy
        { label: "Gửi thông báo đẩy số lượng lớn", note: "Có thể phát sinh phí nếu dùng gói trả phí", cost: "Theo lượng gửi" }, // vn-ok: fixture preserves the client's original Vietnamese copy
        { label: "Mở thêm chi nhánh", note: "Nâng gói hạ tầng và tài khoản", cost: "Báo giá riêng" }, // vn-ok: fixture preserves the client's original Vietnamese copy
    ],

    instalments: [
        { label: "Đợt 1 — Tạm ứng", milestone: "Ký hợp đồng, bắt đầu UX/UI", percent: 40 }, // vn-ok: fixture preserves the client's original Vietnamese copy
        { label: "Đợt 2 — Giữa dự án", milestone: "Duyệt UI xong, code app khách", percent: 30 }, // vn-ok: fixture preserves the client's original Vietnamese copy
        { label: "Đợt 3 — Nghiệm thu", milestone: "Lên hai store và bàn giao", percent: 30 }, // vn-ok: fixture preserves the client's original Vietnamese copy
    ],

    warrantyMonths: 12,
    maintenancePercent: [15, 20],

    commitments: [
        {
            title: "Không phát sinh ngoài phạm vi", // vn-ok: fixture preserves the client's original Vietnamese copy
            body: "Báo giá trọn gói đúng phạm vi đã thống nhất, không phí ẩn. Hạng mục ngoài phạm vi chỉ thực hiện khi salon chủ động yêu cầu và đồng ý báo giá riêng.", // vn-ok: fixture preserves the client's original Vietnamese copy
        },
        {
            title: "Bàn giao trọn vẹn", // vn-ok: fixture preserves the client's original Vietnamese copy
            body: "Mã nguồn, tài liệu, quyền quản trị và đào tạo sử dụng đều bàn giao cho salon. Không khoá chân, không nền tảng đi thuê.", // vn-ok: fixture preserves the client's original Vietnamese copy
        },
        {
            title: "Chi phí hạ tầng minh bạch", // vn-ok: fixture preserves the client's original Vietnamese copy
            body: "Chi phí hạ tầng do nhà cung cấp thu, không phải phí TEDO. Cần nâng cấp thì TEDO báo trước và tư vấn, salon chủ động quyết định.", // vn-ok: fixture preserves the client's original Vietnamese copy
        },
    ],
}
