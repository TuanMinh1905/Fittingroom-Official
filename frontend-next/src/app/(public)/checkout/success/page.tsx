"use client";

import React from "react";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-[600px] w-full bg-white rounded-3xl p-8 md:p-12 text-center shadow-sm border border-gray-100">
        
        {/* Biểu tượng thành công */}
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4 font-monasans">
          Đặt hàng thành công!
        </h1>
        
        <p className="text-gray-600 mb-8 text-lg">
          Cảm ơn bạn đã mua sắm tại TMF-SHOP. Đơn hàng của bạn đã được ghi nhận và đang trong quá trình xử lý. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.
        </p>

        <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left">
          <h3 className="font-semibold text-gray-800 mb-2">Thông tin lưu ý:</h3>
          <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
            <li>Bạn sẽ thanh toán bằng tiền mặt khi nhận hàng (COD).</li>
            <li>Thời gian giao hàng dự kiến từ 2-4 ngày làm việc.</li>
            <li>Vui lòng giữ liên lạc qua số điện thoại đã đăng ký.</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            href="/"
            className="inline-block bg-[var(--primary)] text-white font-bold px-8 py-4 rounded-xl transition hover:bg-[var(--primary-hover)] shadow-sm"
          >
            Tiếp tục mua sắm
          </Link>
          <Link 
            href="/profile"
            className="inline-block bg-white text-gray-700 font-bold px-8 py-4 rounded-xl transition border border-gray-200 hover:bg-gray-50 shadow-sm"
          >
            Quản lý đơn hàng
          </Link>
        </div>
      </div>
    </div>
  );
}
