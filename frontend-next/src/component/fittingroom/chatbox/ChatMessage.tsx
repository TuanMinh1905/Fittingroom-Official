"use client";

import React from "react";

export type MessageRole = "user" | "ai" | "system";

export interface ChatMessageData {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  isWarning?: boolean;
}

interface ChatMessageProps {
  message: ChatMessageData;
}

/**
 * Component render từng tin nhắn trong chatbox.
 * Phân biệt giữa user (phải, xanh) và AI (trái, trắng).
 */
export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";
  const isWarning = message.isWarning === true;

  if (isSystem) {
    return (
      <div className="flex justify-center my-2">
        <div className="bg-gray-100 text-gray-500 text-xs px-3 py-1.5 rounded-full max-w-[85%] text-center">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3 animate-[slideIn_0.3s_ease-out]`}>
      {/* Avatar AI */}
      {!isUser && (
        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mr-2 mt-1 shadow-md ${
          isWarning
            ? "bg-gradient-to-br from-red-500 to-orange-500"
            : "bg-gradient-to-br from-cyan-500 to-blue-600"
        }`}>
          <span className="text-white text-xs font-bold">{isWarning ? "⚠️" : "AI"}</span>
        </div>
      )}

      {/* Bubble */}
      <div
        className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
          isUser
            ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-md"
            : isWarning
              ? "bg-gradient-to-br from-red-50 to-orange-50 text-gray-800 border-2 border-red-200 rounded-bl-md"
              : "bg-white text-gray-800 border border-gray-100 rounded-bl-md"
        }`}
      >
        {/* Render content với markdown đơn giản */}
        {renderContent(message.content, isUser)}
      </div>

      {/* Avatar User */}
      {isUser && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0 ml-2 mt-1 shadow-md">
          <span className="text-white text-xs">👤</span>
        </div>
      )}
    </div>
  );
}

/**
 * Render content hỗ trợ bold (**text**) và line breaks.
 */
function renderContent(content: string, isUser: boolean) {
  const lines = content.split("\n");

  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        if (line.trim() === "") return <div key={i} className="h-1" />;

        // Parse bold **text**
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
          <p key={i} className={line.startsWith("- ") || line.startsWith("👉") || line.startsWith("•") ? "pl-1" : ""}>
            {parts.map((part, j) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                return (
                  <strong key={j} className={isUser ? "font-bold" : "font-semibold text-gray-900"}>
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              return <span key={j}>{part}</span>;
            })}
          </p>
        );
      })}
    </div>
  );
}

/**
 * Component hiển thị typing indicator (AI đang suy nghĩ).
 */
export function TypingIndicator() {
  return (
    <div className="flex justify-start mb-3">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shrink-0 mr-2 mt-1 shadow-md">
        <span className="text-white text-xs font-bold">AI</span>
      </div>
      <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}
