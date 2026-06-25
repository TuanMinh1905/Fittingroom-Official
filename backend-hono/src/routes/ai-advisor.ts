// AI Advisor Route — Proxy endpoint gọi OpenAI API
// Nhận context cơ thể + tin nhắn → trả phản hồi tư vấn size bằng tiếng Việt

import { Hono } from 'hono'
import OpenAI from 'openai'
import 'dotenv/config'

const aiAdvisor = new Hono()

// Khởi tạo OpenAI client
const apiKey = process.env.OPENAI_API_KEY || ''
console.log(`[AI Advisor] API Key loaded: ${apiKey ? apiKey.substring(0, 8) + '...' : 'MISSING!'}`)
const openai = new OpenAI({ apiKey })

// System prompt — quy tắc cho AI tư vấn
const SYSTEM_PROMPT = `Bạn là chuyên gia tư vấn thời trang AI của cửa hàng TMF (Tuấn Minh Fashion).
Nhiệm vụ: Đánh giá mức độ vừa vặn (fit) của trang phục so với số đo cơ thể khách hàng, và đưa ra lời khuyên chọn size.

QUY TẮC BẮT BUỘC:
1. Luôn trả lời bằng TIẾNG VIỆT, thân thiện, ngắn gọn (tối đa 150 từ).
2. Dựa vào dữ liệu phân tích fit (fitScore, fitLabel) từ hệ thống rule engine đã tính sẵn.
3. Giải thích bằng ngôn ngữ đời thường, dễ hiểu (tránh thuật ngữ kỹ thuật).
4. Luôn đưa ra:
   - Đánh giá hiện tại: rộng/vừa/chật
   - Size gợi ý vừa vặn (slim fit)
   - Size gợi ý thoải mái (comfort fit)
5. Dùng emoji phù hợp (👕👖📏💡👉) để dễ đọc.
6. Nếu khách hỏi về phối đồ, phong cách — hãy tư vấn dựa trên thể hình.
7. KHÔNG bịa số liệu. Chỉ dùng dữ liệu được cung cấp trong context.

BẢNG SIZE CHART TMF — ÁO (nam/nữ):
| Size | Dài áo (nam) | Ngang ngực (nam) | Rộng vai (nam) | Dài áo (nữ) | Ngang ngực (nữ) | Rộng vai (nữ) |
|------|-------------|-----------------|---------------|-------------|-----------------|---------------|
| S    | 64cm        | 44cm            | 40cm          | 58cm        | 40cm            | 36cm          |
| M    | 67cm        | 47cm            | 43cm          | 61cm        | 43cm            | 38cm          |
| L    | 70cm        | 50cm            | 46cm          | 64cm        | 46cm            | 40cm          |
| XL   | 73cm        | 53cm            | 49cm          | 67cm        | 49cm            | 42cm          |

BẢNG SIZE CHART TMF — QUẦN (nam/nữ):
| Size | Dài quần (nam) | Vòng eo (nam) | Vòng hông (nam) | Dài quần (nữ) | Vòng eo (nữ) | Vòng hông (nữ) |
|------|---------------|--------------|----------------|---------------|--------------|----------------|
| S    | 98cm          | 72cm         | 90cm           | 92cm          | 64cm         | 86cm           |
| M    | 100cm         | 78cm         | 96cm           | 94cm          | 70cm         | 92cm           |
| L    | 102cm         | 84cm         | 102cm          | 96cm          | 76cm         | 98cm           |
| XL   | 104cm         | 90cm         | 108cm          | 98cm          | 82cm         | 104cm          |`

// POST /ai-advisor — Nhận message + context, trả reply từ OpenAI
aiAdvisor.post('/', async (c) => {
    try {
        const { message, context, history } = await c.req.json()

        if (!message) {
            return c.json({ error: 'Missing message' }, 400)
        }

        if (!process.env.OPENAI_API_KEY) {
            return c.json({ error: 'OPENAI_API_KEY not configured' }, 500)
        }

        // Chuyển đổi history từ format của frontend (dành cho Gemini) sang format của OpenAI
        const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
            { role: 'system', content: SYSTEM_PROMPT + '\n\n' + (context || '(Không có dữ liệu cơ thể)') }
        ]

        if (history && history.length > 0) {
            for (const msg of history) {
                messages.push({
                    role: msg.role === 'model' ? 'assistant' : 'user',
                    content: msg.parts[0].text
                })
            }
        }
        
        // Thêm câu hỏi hiện tại
        messages.push({ role: 'user', content: message })

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: messages,
            temperature: 0.7,
            max_tokens: 250,
        })

        const reply = response.choices[0]?.message?.content || 'Xin lỗi, tôi không thể trả lời lúc này.'

        return c.json({ reply })

    } catch (error: any) {
        console.error('[AI Advisor Error]', error?.message || error)
        console.error('[AI Advisor Error Detail]', JSON.stringify(error?.response?.data || error?.status || 'unknown'))

        // Fallback message khi OpenAI lỗi
        return c.json({
            reply: '⚠️ Xin lỗi, tôi đang gặp sự cố kết nối. Vui lòng thử lại sau!\n\n(Kết quả phân tích rule-based vẫn hiển thị bên dưới)',
            fallback: true,
        })
    }
})

export default aiAdvisor
