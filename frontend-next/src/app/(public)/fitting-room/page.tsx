"use client";

import React, { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import Image from "next/image";

export default function FittingRoomPage() {
  const { items, removeFromCart } = useCartStore();
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [gender, setGender] = useState<"male" | "female">("female");

  // Format giá tiền Việt Nam
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " đ";
  };

  const handleTryOn = () => {
    if (!height || !weight) {
      alert("Vui lòng nhập chiều cao và cân nặng!");
      return;
    }
    if (items.length === 0) {
      alert("Vui lòng chọn ít nhất 1 sản phẩm để thử đồ!");
      return;
    }
    alert(`Đang xử lý thử đồ với chiều cao: ${height}cm, cân nặng: ${weight}kg, giới tính: ${gender === "male" ? "Nam" : "Nữ"}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 font-monasans text-[var(--text-primary)]">
        Phòng Thử Đồ Ảo (Virtual Fitting Room)
      </h1>

      <div className="flex flex-col lg:flex-row gap-6 h-full min-h-[700px]">
        {/* Section 1: Giỏ hàng */}
        <div className="w-full lg:w-1/4 bg-white rounded-2xl shadow-sm border border-gray-200 p-4 flex flex-col h-[700px]">
          <h2 className="text-xl font-bold mb-4 border-b pb-2 text-[var(--primary)] flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z"/></svg>
            Đồ đang chọn ({items.length})
          </h2>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
            {items.length === 0 ? (
              <div className="text-center text-gray-500 mt-10">
                <p>Chưa có sản phẩm nào</p>
                <Link href="/" className="text-[var(--primary)] hover:underline mt-2 inline-block">
                  Quay lại mua sắm
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div key={item._id} className="flex gap-3 border border-gray-100 p-2 rounded-xl hover:border-[var(--primary)] transition-colors">
                  <div className="w-20 h-24 bg-gray-50 rounded-lg overflow-hidden shrink-0 relative">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No img</div>
                    )}
                  </div>
                  <div className="flex flex-col justify-between flex-1 py-1">
                    <div>
                      <h3 className="text-sm font-medium line-clamp-2 text-gray-800" title={item.name}>
                        {item.name}
                      </h3>
                      <p className="text-xs text-[var(--primary)] font-bold mt-1">
                        {formatPrice(item.discountPrice || item.price)}
                      </p>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item._id)}
                      className="text-xs text-red-500 self-start mt-2 hover:underline"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Section 2: Render 3D Model Placeholder */}
        <div className="w-full lg:w-2/4 bg-gray-50 rounded-2xl shadow-sm border-2 border-dashed border-gray-300 flex flex-col items-center justify-center relative overflow-hidden h-[700px]">
          <div className="text-center z-10 p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-400 mb-4"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Khu vực Render 3D</h2>
            <p className="text-gray-500">Người mẫu 3D sẽ xuất hiện ở đây sau khi bạn nhấn thử đồ.</p>
          </div>
          
          {/* Decorative background elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[500px] border border-gray-200 rounded-[100px] opacity-50"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[600px] border border-gray-200 rounded-[150px] opacity-30"></div>
        </div>

        {/* Section 3: Thông số người mẫu */}
        <div className="w-full lg:w-1/4 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col h-[700px]">
          <h2 className="text-xl font-bold mb-6 border-b pb-2 text-gray-800">
            Thông số người mẫu
          </h2>
          
          <div className="space-y-6 flex-1">
            {/* Giới tính */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Giới tính</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setGender("male")}
                  className={`py-3 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${gender === "male" ? "border-[var(--primary)] bg-[var(--primary)]/5 text-[var(--primary)]" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="14" r="5"/><line x1="13.5" y1="10.5" x2="21" y2="3"/><polyline points="16 3 21 3 21 8"/></svg>
                  <span className="font-medium">Nam</span>
                </button>
                <button
                  onClick={() => setGender("female")}
                  className={`py-3 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${gender === "female" ? "border-pink-500 bg-pink-50 text-pink-600" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="10" r="5"/><line x1="12" y1="15" x2="12" y2="22"/><line x1="9" y1="19" x2="15" y2="19"/></svg>
                  <span className="font-medium">Nữ</span>
                </button>
              </div>
            </div>

            {/* Chiều cao */}
            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-2">
                Chiều cao (cm)
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="height"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="Ví dụ: 170"
                  className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none transition-all text-gray-800 font-medium"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">cm</span>
              </div>
            </div>

            {/* Cân nặng */}
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
                Cân nặng (kg)
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="Ví dụ: 65"
                  className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none transition-all text-gray-800 font-medium"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">kg</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleTryOn}
            className="w-full py-4 mt-6 bg-[var(--primary)] text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-[var(--primary)]/30 hover:-translate-y-1 transition-all active:translate-y-0 flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z"/></svg>
            ẤN THỬ ĐỒ NGAY
          </button>
        </div>
      </div>
    </div>
  );
}