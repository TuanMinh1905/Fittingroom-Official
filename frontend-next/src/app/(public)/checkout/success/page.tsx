"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

interface ConfettiParticle {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  color: string;
  shape: string;
  rotation: number;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const method = searchParams.get("method") || "COD";
  const phone = searchParams.get("phone") || "";
  const [particles, setParticles] = useState<ConfettiParticle[]>([]);

  useEffect(() => {
    // Tạo 40 hạt confetti ngẫu nhiên
    const colors = ["#5DADE2", "#F4D03F", "#58D68D", "#EC7063", "#AF7AC5", "#EB984E"];
    const generated = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // % width
      delay: Math.random() * 2, // seconds
      duration: 2 + Math.random() * 3, // seconds
      size: 6 + Math.random() * 10, // px
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: Math.random() > 0.5 ? "circle" : "square",
      rotation: Math.random() * 360,
    }));
    setParticles(generated);

    // Kích hoạt thông báo thành công lần nữa
    const timer = setTimeout(() => {
      toast.success("Hệ thống đã nhận đơn hàng của bạn!", {
        icon: "🎉",
      });
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative overflow-hidden min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
      {/* CSS Confetti Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute opacity-80 animate-confetti-fall"
            style={{
              left: `${p.x}%`,
              top: `-20px`,
              width: `${p.size}px`,
              height: `${p.shape === "circle" ? p.size : p.size / 2}px`,
              backgroundColor: p.color,
              borderRadius: p.shape === "circle" ? "50%" : "2px",
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              transform: `rotate(${p.rotation}deg)`,
            }}
          />
        ))}
      </div>

      <div className="max-w-[600px] w-full bg-white rounded-3xl p-8 md:p-12 text-center shadow-lg border border-gray-100/80 relative z-10 transition-all hover:shadow-xl animate-scaleUp">
        
        {/* Biểu tượng thành công */}
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-100 animate-bounceOnce">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-4 font-monasans tracking-tight">
          Đặt Hàng Thành Công!
        </h1>
        
        <p className="text-gray-600 mb-8 text-base leading-relaxed">
          Cảm ơn bạn đã mua sắm tại <span className="font-semibold text-[var(--primary)] font-monasans">TMF-SHOP</span>. Đơn hàng của bạn đã được ghi nhận thành công và đang được chuẩn bị.
        </p>

        <div className="bg-slate-50/80 rounded-2xl p-6 mb-8 text-left border border-slate-100 transition-all hover:bg-slate-50">
          <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wider flex items-center gap-2">
            <svg className="w-4.5 h-4.5 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Thông tin đơn đặt hàng:
          </h3>
          <ul className="text-sm text-gray-600 space-y-2 list-none">
            <li className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[var(--primary)] rounded-full shrink-0"></span>
              <span>Hình thức: <strong className="text-gray-800">{method === "BANK" ? "Chuyển khoản VietQR" : "Thanh toán khi nhận hàng (COD)"}</strong></span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[var(--primary)] rounded-full shrink-0"></span>
              <span>Trạng thái thanh toán: <strong className="text-green-600">{method === "BANK" ? "Đã thanh toán trực tuyến" : "Chờ thanh toán khi nhận hàng"}</strong></span>
            </li>
            {phone && (
              <li className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[var(--primary)] rounded-full shrink-0"></span>
                <span>Số điện thoại giao hàng: <strong className="text-gray-800 font-mono">{phone}</strong></span>
              </li>
            )}
            <li className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[var(--primary)] rounded-full shrink-0"></span>
              <span>Thời gian giao dự kiến: <strong className="text-gray-800">2-4 ngày làm việc</strong></span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            href="/"
            className="inline-block bg-[var(--primary)] text-white font-bold px-8 py-4 rounded-xl transition hover:bg-[var(--primary-hover)] hover:scale-105 active:scale-95 shadow-md shadow-[var(--primary)]/10 cursor-pointer text-center"
          >
            Tiếp tục mua sắm
          </Link>
          <Link 
            href="/profile?tab=orders"
            className="inline-block bg-white text-gray-700 font-bold px-8 py-4 rounded-xl transition border border-gray-200 hover:bg-gray-50 hover:scale-105 active:scale-95 shadow-sm cursor-pointer text-center"
          >
            Quản lý đơn hàng
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes confetti-fall {
          0% {
            transform: translateY(-20px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti-fall {
          animation-name: confetti-fall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        @keyframes scaleUp {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scaleUp {
          animation: scaleUp 0.4s ease-out forwards;
        }
        @keyframes bounceOnce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        .animate-bounceOnce {
          animation: bounceOnce 0.6s ease-out 1;
        }
      `}} />
      <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center">Đang hiển thị...</div>}>
        <SuccessContent />
      </Suspense>
    </>
  );
}
