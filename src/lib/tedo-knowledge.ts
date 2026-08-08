/**
 * MOCK "RAG" knowledge base for the quote-advisor chatbot.
 *
 * This stands in for a real retrieval layer. The public shape — `retrieveContext(query)`
 * returning the most relevant chunks — is deliberately RAG-flavoured so it can later be
 * swapped for a real vector search (embed the query, pull top-k from a store) without
 * touching the route handler or the prompt builder.
 *
 * Price book below is the one agreed in `biz.md` §2.5 (01/08/2026). Two advertised tiers
 * with a floor of 25tr — landing pages and brochure sites are still accepted on request
 * but deliberately not quoted up front, because delivery capacity is 3–4 concurrent
 * projects and every slot spent on a cheap build is a slot not spent on a paying one.
 * The bot still treats every number as an estimate to be confirmed on a call.
 */

export type KnowledgeChunk = {
    topic: string
    text: string
    keywords: string[]
}

export const TEDO_KB: Array<KnowledgeChunk> = [
    {
        topic: "Dịch vụ",
        keywords: ["dịch vụ", "làm gì", "service", "website", "web"],
        text: "TEDO nhận thiết kế và lập trình website riêng cho doanh nghiệp: landing page, web giới thiệu doanh nghiệp, thương mại điện tử, và web có CMS tự quản nội dung. Thiết kế riêng theo brand, không dùng giao diện template.",
    },
    {
        topic: "Bảng giá (tạm tính)",
        keywords: ["giá", "báo giá", "chi phí", "bao nhiêu", "price", "cost", "budget", "ngân sách"],
        text: "Khoảng giá tạm tính (chốt ở buổi tư vấn): Thương mại điện tử + CMS 25–60 triệu (4–8 tuần); Hệ thống nghiệp vụ / phần mềm riêng 50–100 triệu trở lên (theo phạm vi). Giá phụ thuộc số màn hình, chức năng, mức độ thiết kế riêng. Việc nhỏ hơn như landing page hay web giới thiệu vẫn nhận — báo giá riêng khi khách hỏi, không có sẵn khoảng giá.",
    },
    {
        topic: "Trả góp",
        keywords: ["trả góp", "trả chậm", "chia đợt", "thanh toán", "trả dần", "gói tài chính", "chưa đủ tiền"],
        text: "Khách chưa gom đủ tiền mặt lúc đầu thì có phương án trả góp: trả trước 40% khi ký, phần còn lại chia đều 6 tháng, cộng phụ phí trả chậm 10–15% vào giá. Quyền sở hữu mã nguồn chuyển khi thanh toán đủ. Ví dụ dự án 56 triệu: phương án trả góp khoảng 62,7 triệu, trả trước 25,1 triệu, còn lại khoảng 6,27 triệu mỗi tháng trong 6 tháng.",
    },
    {
        topic: "Quy trình",
        keywords: ["quy trình", "quá trình", "làm sao", "process", "bao lâu", "thời gian", "tiến độ"],
        text: "Năm bước: 1) Tư vấn và chốt phạm vi (2–4 ngày); 2) Thiết kế giao diện, prototype Figma duyệt trước khi code (1–2 tuần); 3) Xây dựng, cuối mỗi sprint có bản demo bấm được (theo phạm vi); 4) Kiểm thử và chạy thử — staging, server, SSL, database, kiểm thử giao diện, chức năng và API (3–5 ngày); 5) Bàn giao và nghiệm thu — mã nguồn, tài liệu, quyền quản trị, đào tạo (2–3 ngày).",
    },
    {
        topic: "Gồm những gì",
        keywords: ["gồm", "bao gồm", "bàn giao", "source code", "mã nguồn", "sở hữu"],
        text: "Bàn giao đầy đủ mã nguồn, tài liệu, quyền quản trị, đào tạo sử dụng. Sản phẩm thuộc sở hữu của khách — không khoá chân, không nền tảng đi thuê.",
    },
    {
        topic: "Bảo hành và gói duy trì",
        keywords: ["bảo hành", "duy trì", "hỗ trợ", "sau bàn giao", "vận hành", "maintenance", "bảo trì"],
        text: "Bảo hành 12 tháng miễn phí kể từ ngày nghiệm thu: bảo đảm hệ thống chạy, bảo mật, sao lưu hằng ngày, tư vấn và đào tạo sử dụng. Tiếp nhận sự cố chậm nhất 12 giờ, xác minh nguyên nhân chậm nhất 48 giờ. Hết 12 tháng thì có gói duy trì trả phí hằng năm, khoảng 15–20% giá trị dự án mỗi năm, gồm hạ tầng và tên miền, vá lỗi bảo mật, sao lưu và giám sát, hỗ trợ theo cam kết trên, cộng một số giờ chỉnh sửa nhỏ mỗi tháng.",
    },
    {
        topic: "Khác biệt",
        keywords: ["khác", "tại sao", "ưu điểm", "template", "haravan", "riêng", "ai"],
        text: "Thiết kế riêng theo brand thay vì dùng template có sẵn (Haravan…). Prototype duyệt trước khi code, luồng thật không lorem ipsum. Dùng AI trong quy trình để làm nhanh và tiết kiệm hơn.",
    },
    {
        topic: "Dự án đã làm",
        keywords: ["dự án", "portfolio", "đã làm", "case", "ví dụ", "tham khảo"],
        text: "Sản phẩm đã làm: StarCi Academy (nền tảng học và tuyển dụng, hơn 30 mô-đun nghiệp vụ, dựng trong 4 tháng); một hệ thống nghiệp vụ B2B đang vận hành, giao trong khoảng 30 ngày làm việc — tên khách và chi tiết đang chờ thư đồng ý công bố nên chưa nêu được; và FTES đang cập nhật hồ sơ. Xem thêm ở trang Dự án.",
    },
    {
        topic: "Liên hệ / đặt lịch",
        keywords: ["liên hệ", "đặt lịch", "tư vấn", "gặp", "contact", "book"],
        text: "Bước tiếp theo là đặt lịch tư vấn 30 phút. Xong buổi đó khách cầm về phạm vi công việc và một con số cụ thể — thuê hay không cũng vậy.",
    },
]

/**
 * Naive keyword retrieval — the mock stand-in for vector search. Scores each chunk by
 * how many of its keywords appear in the query, returns the top matches (falls back to
 * the whole KB when nothing matches, so the bot is never left context-less).
 */
export function retrieveContext(query: string, topK = 4): string {
    const q = (query || "").toLowerCase()
    const scored = TEDO_KB.map((c) => ({
        c,
        score: c.keywords.reduce((n, k) => (q.includes(k) ? n + 1 : n), 0),
    }))
    const hits = scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score)
    const chosen = (hits.length ? hits.slice(0, topK) : scored).map((s) => s.c)
    return chosen.map((c) => `## ${c.topic}\n${c.text}`).join("\n\n")
}

/** Builds the system prompt: role + guardrails + the retrieved (mock) context. */
export function buildSystemPrompt(context: string): string {
    return `Bạn là trợ lý tư vấn báo giá của TEDO — công ty làm website và hệ thống nghiệp vụ riêng cho doanh nghiệp.

NHIỆM VỤ:
- Tư vấn về dịch vụ của TEDO và ước lượng KHOẢNG giá.
- Hỏi ngắn gọn để hiểu nhu cầu: loại sản phẩm (bán hàng online / hệ thống quản lý nghiệp vụ / trang giới thiệu), số màn hình, chức năng chính, có cần thanh toán online hay tự sửa nội dung không, ngân sách dự kiến.
- Sau khi đủ ý, đưa một KHOẢNG giá và khoảng thời gian dựa trên thông tin bên dưới, rồi mời khách ĐẶT LỊCH TƯ VẤN để chốt con số.
- Khách lo về ngân sách thì chủ động nhắc phương án TRẢ GÓP trước khi họ bỏ đi.
- Khách hỏi sau khi bàn giao thì nói rõ bảo hành 12 tháng miễn phí, sau đó có gói duy trì trả phí.

CÁCH NÓI:
- Viết như một người tư vấn thật: tiếng Việt tự nhiên, xưng "mình" hoặc "TEDO", gọi khách là "bạn". Tránh khẩu hiệu, tránh từ ngữ máy móc và không lạm dụng thuật ngữ tiếng Anh. Ngắn gọn, thẳng, thân thiện; mỗi lần hỏi tối đa 1–2 câu.
- Mọi con số là TẠM TÍNH, luôn nói rõ sẽ chốt ở buổi tư vấn. KHÔNG cam kết giá cứng.
- Việc nhỏ hơn hai bậc giá trong dữ liệu (landing page, web giới thiệu) thì TEDO vẫn nhận, nhưng KHÔNG tự bịa ra khoảng giá — nói là báo giá riêng sau khi nghe yêu cầu.
- Chỉ trả lời trong phạm vi dịch vụ của TEDO. Câu ngoài phạm vi (hỏi kiến thức chung, viết code hộ…) thì lịch sự kéo về. KHÔNG bịa thông tin, chức năng hay giá không có trong dữ liệu.
- KHÔNG nêu tên khách hàng của dự án đang chờ thư đồng ý công bố.
- Khi khách sẵn sàng, hướng dẫn bấm "Đặt lịch tư vấn" hoặc để lại email/điện thoại.

DỮ LIỆU THAM KHẢO:
${context}`
}
