"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    customerName: "",
    phoneNumber: "",
    address: "",
    paymentMethod: "COD"
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Nếu giỏ hàng trống thì redirect về trang chủ
  useEffect(() => {
    if (mounted && items.length === 0) {
      router.push("/");
    }
  }, [mounted, items, router]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " đ";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.phoneNumber || !formData.address) {
      toast.error("Vui lòng điền đầy đủ thông tin giao hàng!");
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        ...formData,
        items: items.map(item => ({
          productId: item._id,
          name: item.name,
          price: item.discountPrice || item.price,
          quantity: item.quantity,
          imageUrl: item.imageUrl
        })),
        totalPrice: getTotalPrice()
      };

      const response = await fetch("http://localhost:8000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(orderPayload)
      });

      if (!response.ok) {
        throw new Error("Không thể đặt hàng, vui lòng thử lại sau!");
      }

      // Xóa giỏ hàng và chuyển hướng
      clearCart();
      router.push("/checkout/success");
      
    } catch (error: any) {
      console.error("Lỗi khi đặt hàng:", error);
      toast.error(error.message || "Lỗi hệ thống!");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || items.length === 0) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Đang tải...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="mb-8 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/cart" className="hover:text-[var(--primary)] transition-colors">Giỏ hàng</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Thanh toán</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8 font-monasans">Thanh toán đơn hàng</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cột form điền thông tin */}
          <div className="lg:w-2/3">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Thông tin giao hàng</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
                  <input 
                    type="text" 
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition-all bg-gray-50 focus:bg-white"
                    placeholder="Nhập họ tên của bạn"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                  <input 
                    type="tel" 
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition-all bg-gray-50 focus:bg-white"
                    placeholder="Nhập số điện thoại"
                    required
                  />
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ giao hàng chi tiết</label>
                <textarea 
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full p-4 rounded-xl border border-gray-300 focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition-all bg-gray-50 focus:bg-white min-h-[100px]"
                  placeholder="Ví dụ: Số nhà, Tên đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố"
                  required
                ></textarea>
              </div>

              <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Phương thức thanh toán</h2>
              
              <div className="space-y-4 mb-8">
                <label className="flex items-center p-4 border border-[var(--primary)] rounded-xl cursor-pointer bg-blue-50/50 transition-colors">
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="COD" 
                    checked={formData.paymentMethod === "COD"}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-[var(--primary)]"
                  />
                  <div className="ml-4">
                    <span className="block font-medium text-gray-900">Thanh toán khi nhận hàng (COD)</span>
                    <span className="text-sm text-gray-500">Bạn sẽ thanh toán bằng tiền mặt khi shipper giao hàng tới.</span>
                  </div>
                </label>
                
                {/* Có thể mở rộng phương thức khác ở đây sau này */}
                <label className="flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 opacity-60">
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="BANK" 
                    disabled
                    className="w-5 h-5 text-gray-400"
                  />
                  <div className="ml-4">
                    <span className="block font-medium text-gray-900">Chuyển khoản ngân hàng (Bảo trì)</span>
                    <span className="text-sm text-gray-500">Hệ thống đang bảo trì phương thức thanh toán này.</span>
                  </div>
                </label>
              </div>

              <div className="hidden lg:block mt-8">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold py-4 rounded-xl transition-colors text-lg shadow-sm disabled:opacity-70 flex justify-center items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Đang xử lý...
                    </>
                  ) : "Xác nhận đặt hàng"}
                </button>
              </div>
            </form>
          </div>

          {/* Cột tóm tắt đơn hàng */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Tóm tắt đơn hàng</h3>
              
              <div className="max-h-[300px] overflow-y-auto mb-6 pr-2 space-y-4">
                {items.map(item => (
                  <div key={item._id} className="flex gap-4">
                    <div className="relative w-16 h-16 rounded-lg border border-gray-100 overflow-hidden shrink-0">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-slate-100"></div>
                      )}
                      <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full z-10">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <span className="text-sm font-medium text-gray-800 line-clamp-2">{item.name}</span>
                      <span className="text-sm text-[var(--primary)] font-medium mt-1">
                        {formatPrice((item.discountPrice || item.price) * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-sm mb-6 border-t pt-4">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính ({items.length} sản phẩm)</span>
                  <span className="font-medium text-gray-800">{formatPrice(getTotalPrice())}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span className="font-medium text-gray-800">Miễn phí</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-800">Tổng cộng</span>
                  <span className="text-2xl font-bold text-[var(--primary)]">{formatPrice(getTotalPrice())}</span>
                </div>
              </div>

              <div className="lg:hidden">
                <button 
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold py-4 rounded-xl transition-colors text-lg shadow-sm disabled:opacity-70 flex justify-center items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Đang xử lý...
                    </>
                  ) : "Xác nhận đặt hàng"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
