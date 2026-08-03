/**
 * MOCK "RAG" knowledge base for the quote-advisor chatbot.
 *
 * This stands in for a real retrieval layer. The public shape — `retrieveContext(query)`
 * returning the most relevant chunks — is deliberately RAG-flavoured so it can later be
 * swapped for a real vector search (embed the query, pull top-k from a store) without
 * touching the route handler or the prompt builder.
 *
 * ⚠️ The price ranges below are PLACEHOLDER numbers for the mock. Replace with the real
 * price book before going live (and the bot is instructed to treat every number as a
 * rough estimate to be confirmed on a call).
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
        text: "Khoảng giá tạm tính (chốt ở buổi tư vấn): Landing page 8–15 triệu (1–2 tuần); Web giới thiệu doanh nghiệp 15–35 triệu (3–5 tuần); Thương mại điện tử + CMS 25–60 triệu (4–8 tuần); Web hệ thống/phần mềm riêng 50–100 triệu trở lên. Giá phụ thuộc số trang, chức năng, mức độ thiết kế riêng.",
    },
    {
        topic: "Quy trình",
        keywords: ["quy trình", "quá trình", "làm sao", "process", "bao lâu", "thời gian", "tiến độ"],
        text: "Sáu bước: 1) Tư vấn và chốt phạm vi (2–4 ngày); 2) Phác thảo điều hướng (2–4 ngày); 3) Thiết kế giao diện, prototype Figma (1–2 tuần); 4) Lập trình, demo mỗi 2 tuần; 5) Kiểm thử, cấu hình server/SSL/database (3–5 ngày); 6) Bàn giao mã nguồn, tài liệu, đào tạo (2–3 ngày).",
    },
    {
        topic: "Gồm những gì",
        keywords: ["gồm", "bao gồm", "bàn giao", "bảo hành", "source code", "mã nguồn", "sở hữu", "hỗ trợ"],
        text: "Bàn giao đầy đủ mã nguồn, tài liệu, quyền quản trị, đào tạo sử dụng. Có bảo hành sau dự án. Website thuộc sở hữu của khách — không khoá chân, không nền tảng đi thuê.",
    },
    {
        topic: "Khác biệt",
        keywords: ["khác", "tại sao", "ưu điểm", "template", "haravan", "riêng", "ai"],
        text: "Thiết kế riêng theo brand thay vì dùng template có sẵn (Haravan…). Prototype duyệt trước khi code, luồng thật không lorem ipsum. Dùng AI trong quy trình để làm nhanh và tiết kiệm hơn.",
    },
    {
        topic: "Dự án đã làm",
        keywords: ["dự án", "portfolio", "đã làm", "case", "ví dụ", "tham khảo"],
        text: "Sản phẩm đã làm: StarCi Academy (nền tảng học và tuyển dụng, hơn 30 mô-đun, làm trong 4 tháng) và FTES. Xem thêm ở trang Dự án.",
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
    return `Bạn là trợ lý tư vấn báo giá của TEDO — công ty thiết kế và lập trình website riêng cho doanh nghiệp ở Đà Nẵng.

NHIỆM VỤ:
- Tư vấn về dịch vụ làm website của TEDO và ước lượng KHOẢNG giá.
- Hỏi ngắn gọn để hiểu nhu cầu: loại website (bán hàng / giới thiệu / landing), số trang, chức năng chính, có cần thanh toán online / tự sửa nội dung không, ngân sách dự kiến.
- Sau khi đủ ý, đưa một KHOẢNG giá và khoảng thời gian dựa trên thông tin bên dưới, rồi mời khách ĐẶT LỊCH TƯ VẤN để chốt con số.

CÁCH NÓI:
- Tiếng Việt, xưng "mình" hoặc "TEDO", gọi khách là "bạn". Ngắn gọn, thẳng, thân thiện. Mỗi lần hỏi tối đa 1–2 câu.
- Mọi con số là TẠM TÍNH, luôn nói rõ sẽ chốt ở buổi tư vấn. KHÔNG cam kết giá cứng.
- Chỉ trả lời trong phạm vi dịch vụ website của TEDO. Câu ngoài phạm vi (hỏi kiến thức chung, viết code hộ…) thì lịch sự kéo về việc làm website. KHÔNG bịa thông tin, chức năng hay giá không có trong dữ liệu.
- Khi khách sẵn sàng, hướng dẫn bấm "Đặt lịch tư vấn" hoặc để lại email/điện thoại.

DỮ LIỆU THAM KHẢO:
${context}`
}
