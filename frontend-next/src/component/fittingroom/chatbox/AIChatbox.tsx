"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import ChatMessage, { TypingIndicator, type ChatMessageData } from "./ChatMessage";
import { analyzeFit, generateFitReport, type BodyMeasurements, type FitAnalysis } from "./fitEngine";

// ── Types ───────────────────────────────────────────────────

interface GarmentContext {
  garmentType: string;
  size: string;
  color: string;
  name?: string;
}

interface AIChatboxProps {
  body: BodyMeasurements;
  gender: "male" | "female";
  topGarment: GarmentContext | null;
  bottomGarment: GarmentContext | null;
  /** Chatbox đang mở hay đóng — do parent kiểm soát */
  isOpen: boolean;
  /** Callback để đóng chatbox */
  onClose: () => void;
  /** Nếu true, khi mở chatbox lần đầu sẽ tự gọi AI phân tích 1 lần */
  pendingAnalysis?: boolean;
  /** Callback sau khi AI analysis đã được kích hoạt (để parent reset flag) */
  onAnalysisTriggered?: () => void;
  /** Nếu có, chatbox sẽ hiển thị ngay cảnh báo này thay vì gọi AI */
  initialWarningMessage?: string | null;
}

const BACKEND_URL = "http://localhost:8003";

// ── Quick Actions ───────────────────────────────────────────

const QUICK_ACTIONS = [
  { label: "📏 Đánh giá áo", message: "Đánh giá mức độ vừa vặn của áo tôi đang mặc" },
  { label: "👖 Phân tích quần", message: "Phân tích quần tôi đang mặc có vừa không?" },
  { label: "💡 Gợi ý size", message: "Gợi ý size phù hợp nhất cho tôi" },
  { label: "👔 Tư vấn phối đồ", message: "Tư vấn cách phối đồ phù hợp với thể hình của tôi" },
];

// ── Component ───────────────────────────────────────────────

export default function AIChatbox({
  body,
  gender,
  topGarment,
  bottomGarment,
  isOpen,
  onClose,
  pendingAnalysis,
  onAnalysisTriggered,
  initialWarningMessage,
}: AIChatboxProps) {
  const [messages, setMessages] = useState<ChatMessageData[]>([
    {
      id: "welcome",
      role: "system",
      content: "AI Tư Vấn Size — Nhấn nút bên dưới để nhận ý kiến sau khi thử đồ!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const analysisTriggeredRef = useRef(false);

  // Auto scroll to bottom (chỉ cuộn trong chatbox, không cuộn cả page)
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, isTyping]);

  // Khi chatbox mở và có pendingAnalysis → trigger AI 1 lần duy nhất
  // (nhưng chỉ khi không có initialWarningMessage — nếu có warning thì chỉ hiển warning)
  useEffect(() => {
    if (isOpen && pendingAnalysis && !analysisTriggeredRef.current && !initialWarningMessage) {
      analysisTriggeredRef.current = true;
      handleAutoAnalyze();
      onAnalysisTriggered?.();
    }
    // Reset flag khi chatbox đóng để lần sau mở lại có thể trigger mới
    if (!isOpen) {
      analysisTriggeredRef.current = false;
    }
  }, [isOpen, pendingAnalysis, initialWarningMessage]);

  // Hiển thị initialWarningMessage ngay khi chatbox mở (nếu có)
  useEffect(() => {
    if (isOpen && initialWarningMessage) {
      setMessages([
        {
          id: "welcome",
          role: "system",
          content: "AI Tư Vấn Size — Phân tích kích cỡ thực tế",
          timestamp: new Date(),
        },
        {
          id: "size-warning",
          role: "ai",
          content: initialWarningMessage,
          timestamp: new Date(),
          isWarning: true,
        },
      ]);
    } else if (!isOpen) {
      // Reset messages khi đóng chatbox (chuẩn bị cho lần mở tiếp theo)
      if (!initialWarningMessage) {
        setMessages([
          {
            id: "welcome",
            role: "system",
            content: "AI Tư Vấn Size — Nhấn nút bên dưới để nhận ý kiến sau khi thử đồ!",
            timestamp: new Date(),
          },
        ]);
      }
    }
  }, [isOpen, initialWarningMessage]);

  const buildContext = useCallback((): string => {
    const lines: string[] = [];
    lines.push(`=== THÔNG TIN KHÁCH HÀNG ===`);
    lines.push(`Giới tính: ${gender === "male" ? "Nam" : "Nữ"}`);
    lines.push(`Chiều cao: ${body.height}cm | Cân nặng: ${body.weight}kg`);
    lines.push(`Số đo: vai ${body.shoulder}cm, ngực ${body.bust}cm, eo ${body.waist}cm, hông ${body.hip}cm, tay ${body.arm}cm, chân ${body.leg}cm`);

    if (topGarment) {
      const topAnalysis = analyzeFit(body, topGarment.size, topGarment.garmentType, gender);
      lines.push(``);
      lines.push(`=== ÁO ĐANG MẶC ===`);
      lines.push(`Loại: ${topGarment.garmentType} | Size: ${topGarment.size}${topGarment.name ? ` | Tên: ${topGarment.name}` : ""}`);
      lines.push(generateFitReport(topAnalysis));
    }

    if (bottomGarment) {
      const bottomAnalysis = analyzeFit(body, bottomGarment.size, bottomGarment.garmentType, gender);
      lines.push(``);
      lines.push(`=== QUẦN ĐANG MẶC ===`);
      lines.push(`Loại: ${bottomGarment.garmentType} | Size: ${bottomGarment.size}${bottomGarment.name ? ` | Tên: ${bottomGarment.name}` : ""}`);
      lines.push(generateFitReport(bottomAnalysis));
    }

    return lines.join("\n");
  }, [body, gender, topGarment, bottomGarment]);

  const handleAutoAnalyze = useCallback(() => {
    const garmentNames: string[] = [];
    if (topGarment) garmentNames.push(`áo ${topGarment.garmentType} size ${topGarment.size}`);
    if (bottomGarment) garmentNames.push(`quần ${bottomGarment.garmentType} size ${bottomGarment.size}`);

    if (garmentNames.length === 0) return;

    const autoMessage = `Tôi vừa mặc thử ${garmentNames.join(" và ")}. Hãy đánh giá mức độ vừa vặn và gợi ý size phù hợp.`;
    sendMessage(autoMessage);
  }, [topGarment, bottomGarment]);

  const sendMessage = async (content: string) => {
    // Add user message
    const userMsg: ChatMessageData = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      // Gửi context + messages đến backend
      const context = buildContext();
      const chatHistory = [...messages.filter(m => m.role !== "system"), userMsg].map(m => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      }));

      const res = await fetch(`${BACKEND_URL}/ai-advisor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          context,
          history: chatHistory,
        }),
      });

      if (!res.ok) {
        throw new Error("API error");
      }

      const data = await res.json();

      const aiMsg: ChatMessageData = {
        id: `ai-${Date.now()}`,
        role: "ai",
        content: data.reply || "Xin lỗi, tôi chưa thể trả lời ngay lúc này.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      // Fallback: dùng rule-based results
      const fallbackContent = buildFallbackResponse(content);
      const aiMsg: ChatMessageData = {
        id: `ai-${Date.now()}`,
        role: "ai",
        content: fallbackContent,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const buildFallbackResponse = (userMessage: string): string => {
    const lines: string[] = [];
    lines.push("⚠️ **Đang dùng chế độ offline** (không kết nối được AI)\n");

    if (topGarment) {
      const analysis = analyzeFit(body, topGarment.size, topGarment.garmentType, gender);
      lines.push(`👕 **Áo ${topGarment.garmentType} size ${topGarment.size}**: ${analysis.overallLabel}`);
      for (const d of analysis.details) {
        lines.push(`- ${d.label}: ${d.bodyValue}cm (áo ${d.sizeRange[0]}-${d.sizeRange[1]}cm) → **${d.fitLabel}**`);
      }
      lines.push(`\n👉 Size gợi ý: **${analysis.recommendedSize}** (vừa) | **${analysis.comfortSize}** (thoải mái)`);
    }

    if (bottomGarment) {
      const analysis = analyzeFit(body, bottomGarment.size, bottomGarment.garmentType, gender);
      lines.push(`\n👖 **Quần ${bottomGarment.garmentType} size ${bottomGarment.size}**: ${analysis.overallLabel}`);
      for (const d of analysis.details) {
        lines.push(`- ${d.label}: ${d.bodyValue}cm (quần ${d.sizeRange[0]}-${d.sizeRange[1]}cm) → **${d.fitLabel}**`);
      }
      lines.push(`\n👉 Size gợi ý: **${analysis.recommendedSize}** (vừa) | **${analysis.comfortSize}** (thoải mái)`);
    }

    if (!topGarment && !bottomGarment) {
      lines.push("Bạn chưa chọn đồ nào. Hãy chọn áo hoặc quần rồi nhấn **Thử đồ** trước nhé!");
    }

    return lines.join("\n");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;
    sendMessage(input.trim());
  };

  const handleQuickAction = (action: typeof QUICK_ACTIONS[0]) => {
    if (isTyping) return;
    sendMessage(action.message);
  };

  // ── Render ──────────────────────────────────────────────

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[360px] h-[550px] flex flex-col bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 shadow-2xl transition-all animate-[slideIn_0.3s_ease-out]">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <span className="text-sm">🤖</span>
          </div>
          <div>
            <h3 className="font-semibold text-sm">AI Tư Vấn Size</h3>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <span className="text-[10px] text-white/70">Đang hoạt động</span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          title="Đóng"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1" style={{ scrollbarWidth: "thin" }}>
        {messages.map(msg => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {messages.length <= 2 && (
        <div className="px-3 pb-2 flex flex-wrap gap-1.5">
          {QUICK_ACTIONS.map((action, i) => (
            <button
              key={i}
              onClick={() => handleQuickAction(action)}
              disabled={isTyping}
              className="text-xs px-2.5 py-1.5 bg-white border border-gray-200 rounded-full text-gray-600 hover:bg-cyan-50 hover:border-cyan-300 hover:text-cyan-700 transition-all disabled:opacity-50"
            >
              {action.label}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="px-3 pb-3 shrink-0">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-100 transition-all">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Hỏi về size, fit, phối đồ..."
            className="flex-1 text-sm outline-none bg-transparent text-gray-800 placeholder-gray-400"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg flex items-center justify-center hover:shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
