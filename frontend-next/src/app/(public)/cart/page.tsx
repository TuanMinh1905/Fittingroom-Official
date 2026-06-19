"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, getTotalPrice } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " đ";
  };

  if (!mounted) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Đang tải...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-[1200px] mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 font-monasans">Giỏ hàng của bạn</h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
            </div>
            <h2 className="text-xl font-medium text-gray-700 mb-4">Giỏ hàng đang trống</h2>
            <Link 
              href="/"
              className="inline-block bg-[var(--primary)] text-white font-medium px-8 py-3 rounded-xl transition hover:bg-[var(--primary-hover)]"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Danh sách sản phẩm */}
            <div className="lg:w-2/3 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-fit">
              <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-gray-100 text-sm font-medium text-gray-500">
                <div className="col-span-6">Sản phẩm</div>
                <div className="col-span-2 text-center">Đơn giá</div>
                <div className="col-span-2 text-center">Số lượng</div>
                <div className="col-span-2 text-right">Thành tiền</div>
              </div>

              <div className="divide-y divide-gray-100">
                {items.map((item) => (
                  <div key={item._id} className="py-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    {/* Sản phẩm */}
                    <div className="col-span-1 md:col-span-6 flex gap-4">
                      <Link href={`/p/${item.slug || item._id}`} className="w-24 h-24 rounded-lg border border-gray-100 overflow-hidden shrink-0">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-slate-100 flex items-center justify-center text-xs text-gray-400">No img</div>
                        )}
                      </Link>
                      <div className="flex flex-col justify-between py-1">
                        <Link href={`/p/${item.slug || item._id}`} className="font-medium text-gray-800 hover:text-[var(--primary)] transition-colors line-clamp-2">
                          {item.name}
                        </Link>
                        <button 
                          onClick={() => removeFromCart(item._id)}
                          className="text-red-500 text-sm font-medium hover:text-red-600 w-fit mt-2 flex items-center gap-1"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                          Xóa
                        </button>
                      </div>
                    </div>

                    {/* Đơn giá */}
                    <div className="col-span-1 md:col-span-2 md:text-center font-medium text-gray-600">
                      <span className="md:hidden text-gray-500 font-normal mr-2">Đơn giá:</span>
                      {formatPrice(item.discountPrice || item.price)}
                    </div>

                    {/* Số lượng */}
                    <div className="col-span-1 md:col-span-2 flex md:justify-center">
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden h-9 w-fit">
                        <button 
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="w-8 h-full flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors text-gray-600 border-r border-gray-200"
                        >
                          -
                        </button>
                        <input 
                          type="text" 
                          value={item.quantity}
                          readOnly
                          className="w-10 h-full text-center text-sm font-medium outline-none"
                        />
                        <button 
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="w-8 h-full flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors text-gray-600 border-l border-gray-200"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Thành tiền */}
                    <div className="col-span-1 md:col-span-2 md:text-right font-bold text-[var(--primary)]">
                      <span className="md:hidden text-gray-500 font-normal mr-2 text-sm">Thành tiền:</span>
                      {formatPrice((item.discountPrice || item.price) * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tổng kết đơn hàng */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
                <h3 className="text-xl font-bold text-gray-800 mb-6 font-monasans">Tổng đơn hàng</h3>
                
                <div className="space-y-4 text-sm mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính</span>
                    <span className="font-medium text-gray-800">{formatPrice(getTotalPrice())}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Phí vận chuyển</span>
                    <span className="font-medium text-gray-800">Miễn phí</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-800">Tổng cộng</span>
                    <span className="text-2xl font-bold text-[var(--primary)]">{formatPrice(getTotalPrice())}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 text-right">(Đã bao gồm VAT nếu có)</p>
                </div>

                <button className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold py-4 rounded-xl transition-colors text-lg shadow-sm">
                  Tiến hành thanh toán
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
