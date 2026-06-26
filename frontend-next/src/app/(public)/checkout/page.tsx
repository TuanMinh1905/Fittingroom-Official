"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore, calculateShippingFee, SHIPPING_THRESHOLD } from "@/store/cartStore";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const subtotal = getTotalPrice();
  const shippingFee = calculateShippingFee(subtotal);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    customerName: "",
    phoneNumber: "",
    address: "",
    paymentMethod: "COD"
  });

  useEffect(() => {
    setMounted(true);
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setFormData(prev => ({
          ...prev,
          customerName: user.name || "",
          phoneNumber: user.phone || "",
          address: user.address || "",
        }));
      } catch (e) {
        console.error("Lỗi khi parse user từ localStorage:", e);
      }
    }
  }, []);

  // Nếu giỏ hàng trống thì redirect về trang chủ
  useEffect(() => {
    if (mounted && items.length === 0 && !isSuccess) {
      router.push("/");
    }
  }, [mounted, items, router, isSuccess]);

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
      if (formData.paymentMethod === "BANK") {
        // Giả lập kiểm tra giao dịch chuyển khoản ngân hàng trong 1.5s
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }

      // Check if user is logged in
      const storedUser = localStorage.getItem("user");
      let currentUser: any = null;
      if (storedUser) {
        try {
          currentUser = JSON.parse(storedUser);
        } catch (e) {
          console.error("Lỗi khi parse user từ localStorage:", e);
        }
      }

      const orderPayload = {
        ...formData,
        userId: currentUser?._id || undefined,
        items: items.map(item => ({
          productId: item._id,
          name: item.name,
          price: item.discountPrice || item.price,
          quantity: item.quantity,
          imageUrl: item.imageUrl
        })),
        shippingFee: shippingFee,
        totalPrice: subtotal + shippingFee
      };

      const response = await fetch("http://localhost:8003/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(orderPayload)
      });

      if (!response.ok) {
        throw new Error("Không thể đặt hàng, vui lòng thử lại sau!");
      }

      // Update user profile details if user is logged in
      if (currentUser && currentUser._id) {
        try {
          let needsUpdate = false;
          const updatePayload: any = {};

          if (!currentUser.phone || currentUser.phone !== formData.phoneNumber) {
            updatePayload.phone = formData.phoneNumber;
            needsUpdate = true;
          }
          if (!currentUser.address || currentUser.address !== formData.address) {
            updatePayload.address = formData.address;
            needsUpdate = true;
          }
          if (!currentUser.name || currentUser.name !== formData.customerName) {
            updatePayload.name = formData.customerName;
            needsUpdate = true;
          }

          if (needsUpdate) {
            const userRes = await fetch(`http://localhost:8000/users/${currentUser._id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(updatePayload),
            });
            if (userRes.ok) {
              const userData = await userRes.json();
              const updatedUser = { ...currentUser, ...userData.user };
              localStorage.setItem("user", JSON.stringify(updatedUser));
            }
          }
        } catch (error) {
          console.error("Lỗi khi tự động cập nhật thông tin user:", error);
        }
      }

      // Xóa giỏ hàng và chuyển hướng
      setIsSuccess(true);
      clearCart();
      toast.success("Thanh toán và đặt hàng thành công!");
      router.push(`/checkout/success?method=${formData.paymentMethod}&phone=${formData.phoneNumber}`);
      
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
                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${
                  formData.paymentMethod === "COD"
                    ? "border-[var(--primary)] bg-blue-50/50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="COD" 
                    checked={formData.paymentMethod === "COD"}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-[var(--primary)]"
                  />
                  <div className="ml-4">
                    <span className="block font-medium text-gray-900 font-monasans">Thanh toán khi nhận hàng (COD)</span>
                    <span className="text-sm text-gray-500">Bạn sẽ thanh toán bằng tiền mặt khi shipper giao hàng tới.</span>
                  </div>
                </label>
                
                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${
                  formData.paymentMethod === "BANK"
                    ? "border-[var(--primary)] bg-blue-50/50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="BANK" 
                    checked={formData.paymentMethod === "BANK"}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-[var(--primary)]"
                  />
                  <div className="ml-4">
                    <span className="block font-medium text-gray-900 font-monasans">Chuyển khoản ngân hàng (VietQR)</span>
                    <span className="text-sm text-gray-500">Quét mã QR qua ứng dụng ngân hàng của bạn để thanh toán nhanh chóng.</span>
                  </div>
                </label>
              </div>

              {formData.paymentMethod === "BANK" && (
                <div className="mt-6 p-6 border border-blue-100 bg-blue-50/30 rounded-2xl mb-8 transition-all">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 font-monasans flex items-center gap-2">
                    <svg className="w-5 h-5 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Thông tin chuyển khoản qua VietQR
                  </h3>
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm shrink-0">
                      <img 
                        src={`https://img.vietqr.io/image/MB-999988889999-compact2.png?amount=${subtotal + shippingFee}&addInfo=TMF%20${formData.phoneNumber || 'KHACHHANG'}&accountName=CONG%20TY%20TMF%20SHOP`}
                        alt="VietQR Code"
                        className="w-48 h-48 object-contain"
                      />
                    </div>
                    <div className="flex-1 w-full space-y-3 text-sm">
                      <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-gray-500 font-medium">Ngân hàng:</span>
                        <span className="font-bold text-gray-800">MB Bank (Ngân hàng Quân đội)</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-gray-500 font-medium">Số tài khoản:</span>
                        <span className="font-bold text-[var(--primary)] font-mono text-base">999988889999</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-gray-500 font-medium">Chủ tài khoản:</span>
                        <span className="font-bold text-gray-800 uppercase">CONG TY TMF SHOP</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-gray-500 font-medium">Số tiền:</span>
                        <span className="font-bold text-rose-500 text-base">{formatPrice(subtotal + shippingFee)}</span>
                      </div>
                      <div className="flex justify-between pb-1">
                        <span className="text-gray-500 font-medium">Nội dung chuyển khoản:</span>
                        <span className="font-bold text-gray-800 bg-yellow-100 px-2 py-0.5 rounded font-mono">
                          TMF {formData.phoneNumber || 'KHACHHANG'}
                        </span>
                      </div>
                      <p className="text-xs text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-100 leading-relaxed font-medium">
                        ⚠️ Quý khách vui lòng quét mã QR hoặc nhập chính xác nội dung chuyển khoản trên để hệ thống tự động xác nhận nhanh nhất.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="hidden lg:block mt-8">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold py-4 rounded-xl transition-colors text-lg shadow-sm disabled:opacity-70 flex justify-center items-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {formData.paymentMethod === "BANK" ? "Đang xác thực giao dịch chuyển khoản..." : "Đang xử lý..."}
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
                  <span className="font-medium text-gray-800">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span className="font-medium text-gray-800">
                    {shippingFee > 0 ? formatPrice(shippingFee) : "Miễn phí"}
                  </span>
                </div>
                {shippingFee > 0 && (
                  <div className="text-xs text-amber-600 bg-amber-50 p-2.5 rounded-xl border border-amber-100/50 font-medium mt-2">
                    💡 Mua thêm <span className="font-bold">{formatPrice(SHIPPING_THRESHOLD - subtotal)}</span> để được miễn phí vận chuyển!
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-200 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-800">Tổng cộng</span>
                  <span className="text-2xl font-bold text-[var(--primary)]">{formatPrice(subtotal + shippingFee)}</span>
                </div>
              </div>

              <div className="lg:hidden">
                <button 
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold py-4 rounded-xl transition-colors text-lg shadow-sm disabled:opacity-70 flex justify-center items-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {formData.paymentMethod === "BANK" ? "Đang xác thực giao dịch chuyển khoản..." : "Đang xử lý..."}
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
