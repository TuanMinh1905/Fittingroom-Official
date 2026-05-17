// ===== TMFashion Checkout Page =====
// Trang giỏ hàng + thanh toán (tương đương pages/checkout.vue)
// STM Người dùng mua hàng: Xem giỏ hàng → Chọn → Thanh toán → Đặt hàng
// SD: Quản lý mua hàng → Chọn sản phẩm, chọn phương thức, đặt hàng

"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth";
import { useCartStore, type CartItem } from "@/stores/cart";
import { api } from "@/lib/api";
import { formatVNDWithComma } from "@/utils";
import {
  PROVINCES,
  SHIPPING_RATES,
  ZONE_LABELS,
  FREE_SHIPPING_THRESHOLDS,
  getShippingZone,
  calculateShippingFee,
  isMethodAvailable,
  type ShippingZone,
} from "@/data/vietnam-locations";

// Phương thức vận chuyển (base info — giá thực tế tùy vùng)
const shippingMethods = [
  { id: "standard", name: "Giao hàng tiêu chuẩn", description: "Nhận hàng trong 3-5 ngày" },
  { id: "fast", name: "Giao hàng nhanh", description: "Nhận hàng trong 1-2 ngày" },
  { id: "express", name: "Giao hàng hỏa tốc", description: "Nhận hàng trong 2-4 giờ (nội thành)" },
];

// Phương thức thanh toán
const paymentMethods = [
  { id: "cod", name: "Thanh toán khi nhận hàng (COD)", description: "Thanh toán bằng tiền mặt khi nhận hàng", icon: "💵" },
  { id: "bank", name: "Chuyển khoản ngân hàng", description: "Chuyển khoản trước khi giao hàng", icon: "🏦" },
  { id: "momo", name: "Ví MoMo", description: "Thanh toán qua ví điện tử MoMo", icon: "📱" },
  { id: "vnpay", name: "VNPay", description: "Thanh toán qua cổng VNPay", icon: "💳" },
];

export default function CheckoutPage() {
  const { user, isLoggedIn } = useAuthStore();
  const cartStore = useCartStore();

  const [pageLoading, setPageLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderCode, setOrderCode] = useState("");
  const [voucherCode, setVoucherCode] = useState("");
  const [discount, setDiscount] = useState(0);

  // Checkout form
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [shippingAddress, setShippingAddress] = useState(""); // Địa chỉ chi tiết (số nhà, đường, phường)
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [note, setNote] = useState("");

  // Init
  useEffect(() => {
    async function init() {
      if (isLoggedIn) {
        await cartStore.fetchCart();
        // Select all items by default
        const items = cartStore.cart?.items || [];
        setSelectedItems(items.map((i) => i._id));
        setFullName(user?.fullName || "");
      }
      setPageLoading(false);
    }
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  // Computed
  const items = cartStore.cart?.items || [];
  const allSelected = items.length > 0 && selectedItems.length === items.length;

  const selectedTotal = items
    .filter((item) => selectedItems.includes(item._id))
    .reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Province/District computed
  const currentProvince = PROVINCES.find(p => p.code === selectedProvince);
  const currentDistricts = currentProvince?.districts || [];
  const currentZone: ShippingZone = selectedProvince
    ? getShippingZone(selectedProvince, selectedDistrict || undefined)
    : 'trong_nuoc';

  // Tính phí ship theo vùng + phương thức + tổng đơn
  const currentShippingFee = useMemo(() => {
    if (!selectedProvince) return 0; // Chưa chọn tỉnh => chưa tính
    const fee = calculateShippingFee(currentZone, shippingMethod as 'standard' | 'fast' | 'express', selectedTotal);
    return fee >= 0 ? fee : 0;
  }, [currentZone, shippingMethod, selectedTotal, selectedProvince]);

  // Kiểm tra phương thức nào khả dụng cho vùng đã chọn
  const availableMethods = useMemo(() => {
    return shippingMethods.filter(m => isMethodAvailable(currentZone, m.id as 'standard' | 'fast' | 'express'));
  }, [currentZone]);

  // Ngưỡng miễn phí theo vùng
  const freeThreshold = FREE_SHIPPING_THRESHOLDS[currentZone];

  const grandTotal = selectedTotal - discount + currentShippingFee;

  // Handlers
  function toggleSelectAll() {
    if (allSelected) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map((i) => i._id));
    }
  }

  function toggleSelectItem(itemId: string) {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  }

  async function updateQuantity(itemId: string, qty: number) {
    if (qty < 1) return;
    await cartStore.updateQuantity(itemId, qty);
  }

  async function removeItem(itemId: string) {
    if (confirm("Bạn có muốn xóa sản phẩm này khỏi giỏ hàng?")) {
      await cartStore.removeItem(itemId);
      setSelectedItems((prev) => prev.filter((id) => id !== itemId));
    }
  }

  function applyVoucher() {
    if (voucherCode.toUpperCase() === "TMF50") {
      const d = Math.min(50000, selectedTotal * 0.1);
      setDiscount(d);
      alert("Áp dụng mã giảm giá thành công! Giảm " + formatVNDWithComma(d) + "đ");
    } else if (voucherCode.toUpperCase() === "FREESHIP") {
      alert("Áp dụng mã FREESHIP thành công!");
    } else if (voucherCode) {
      alert("Mã giảm giá không hợp lệ");
    }
  }

  function goToCheckout() {
    if (selectedItems.length === 0) {
      alert("Vui lòng chọn ít nhất 1 sản phẩm");
      return;
    }
    setShowCheckout(true);
  }

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName || !phone || !shippingAddress || !selectedProvince || !selectedDistrict) {
      alert("Vui lòng điền đầy đủ thông tin (tỉnh/thành, quận/huyện, địa chỉ, SĐT)");
      return;
    }

    setCheckoutLoading(true);
    try {
      const response = await api.post<{ order: { _id: string } }>("/orders", {
        shipping_address: shippingAddress,
        shipping_province: selectedProvince,
        shipping_district: selectedDistrict,
        phone,
        payment_method: paymentMethod,
        shipping_method: shippingMethod,
        note,
      });

      const orderId = response.order?._id || "000000";
      setOrderCode(`TMF${String(orderId).slice(-8).padStart(8, "0")}`);
      setShowCheckout(false);
      setOrderSuccess(true);
      cartStore.clearCart();
      setSelectedItems([]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Lỗi đặt hàng";
      alert(message);
    } finally {
      setCheckoutLoading(false);
    }
  }

  // Not logged in
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50">
        <CheckoutHeader totalItems={0} />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <CartIcon />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Vui lòng đăng nhập</h2>
            <p className="text-gray-500 mb-6">Đăng nhập để xem giỏ hàng và đặt hàng</p>
            <Link href="/login" className="inline-block px-8 py-3 bg-primary hover:bg-yellow-400 text-gray-800 font-semibold rounded-lg transition">
              Đăng nhập ngay
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Loading
  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <CheckoutHeader totalItems={0} />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-500">Đang tải giỏ hàng...</p>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart
  if (items.length === 0 && !orderSuccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <CheckoutHeader totalItems={0} />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <CartIcon />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Giỏ hàng trống</h2>
            <p className="text-gray-500 mb-6">Hãy thêm sản phẩm vào giỏ hàng</p>
            <Link href="/shop" className="inline-block px-8 py-3 bg-primary hover:bg-yellow-400 text-gray-800 font-semibold rounded-lg transition">
              Mua sắm ngay
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CheckoutHeader totalItems={cartStore.totalItems} />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Items List (2/3) */}
          <div className="lg:col-span-2 space-y-4">
            {/* Select All */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                  className="w-5 h-5 accent-primary"
                />
                <span className="font-medium text-gray-700">
                  Chọn tất cả ({items.length} sản phẩm)
                </span>
                {selectedItems.length > 0 && (
                  <button
                    className="ml-auto text-red-500 hover:text-red-600 text-sm"
                    onClick={async () => {
                      if (confirm(`Xóa ${selectedItems.length} sản phẩm đã chọn?`)) {
                        for (const id of selectedItems) {
                          await cartStore.removeItem(id);
                        }
                        setSelectedItems([]);
                      }
                    }}
                  >
                    Xóa đã chọn ({selectedItems.length})
                  </button>
                )}
              </div>
            </div>

            {/* Cart Items */}
            <div className="bg-white rounded-lg shadow divide-y">
              {items.map((item: CartItem) => (
                <div key={item._id} className="p-4 hover:bg-gray-50 transition">
                  <div className="flex gap-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item._id)}
                      onChange={() => toggleSelectItem(item._id)}
                      className="w-5 h-5 accent-primary mt-6"
                    />
                    <img
                      src={item.product.image_url || "/placeholder.png"}
                      alt={item.product.name}
                      className="w-24 h-24 object-cover rounded-lg border flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-800 line-clamp-2 mb-1">
                        {item.product.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg font-bold text-red-500">
                          {formatVNDWithComma(item.product.price)}đ
                        </span>
                        {item.product.compare_at_price && (
                          <span className="text-sm text-gray-400 line-through">
                            {formatVNDWithComma(item.product.compare_at_price)}đ
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border rounded-lg">
                          <button
                            className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 transition text-lg"
                            disabled={item.quantity <= 1}
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          >
                            −
                          </button>
                          <span className="w-14 text-center border-x">
                            {item.quantity}
                          </span>
                          <button
                            className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 transition text-lg"
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Thành tiền:</p>
                          <p className="text-lg font-bold text-red-500">
                            {formatVNDWithComma(item.product.price * item.quantity)}đ
                          </p>
                        </div>
                      </div>
                    </div>
                    <button
                      className="self-start p-2 text-gray-400 hover:text-red-500 transition"
                      onClick={() => removeItem(item._id)}
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary (1/3) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-800 mb-4 pb-4 border-b">
                Thông tin đơn hàng
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tạm tính ({selectedItems.length} sản phẩm)</span>
                  <span className="font-medium">{formatVNDWithComma(selectedTotal)}đ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Giảm giá</span>
                  <span className="text-green-600">-{formatVNDWithComma(discount)}đ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phí vận chuyển</span>
                  {!selectedProvince ? (
                    <span className="text-gray-400 italic text-xs">Chọn địa chỉ</span>
                  ) : currentShippingFee === 0 ? (
                    <span className="text-green-600">Miễn phí</span>
                  ) : (
                    <span className="font-medium">{formatVNDWithComma(currentShippingFee)}đ</span>
                  )}
                </div>
                {selectedProvince && selectedDistrict && (
                  <div className="text-xs text-gray-400">
                    Vùng: {ZONE_LABELS[currentZone]} ({currentProvince?.name}, {selectedDistrict})
                  </div>
                )}
              </div>

              {/* Voucher */}
              <div className="mt-4 pt-4 border-t">
                <div className="flex gap-2">
                  <input
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    type="text"
                    placeholder="Nhập mã giảm giá"
                    className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    onClick={applyVoucher}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition"
                  >
                    Áp dụng
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold text-gray-800">Tổng cộng</span>
                  <span className="text-2xl font-bold text-red-500">
                    {formatVNDWithComma(grandTotal)}đ
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-4">(Đã bao gồm VAT nếu có)</p>
              </div>

              <button
                disabled={selectedItems.length === 0}
                onClick={goToCheckout}
                className="w-full py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                Mua hàng ({selectedItems.length})
              </button>

              <Link
                href="/shop"
                className="block w-full py-3 mt-3 text-center text-gray-600 hover:text-gray-800 text-sm"
              >
                ← Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <div
          className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 overflow-y-auto py-8"
          onClick={(e) => e.target === e.currentTarget && setShowCheckout(false)}
        >
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 my-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Thanh toán đơn hàng</h2>
              <button onClick={() => setShowCheckout(false)} className="p-2 hover:bg-gray-100 rounded-full transition">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCheckout} className="p-6">
              {/* Thông tin người nhận */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-4">Thông tin người nhận</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên <span className="text-red-500">*</span></label>
                    <input value={fullName} onChange={(e) => setFullName(e.target.value)} type="text" placeholder="Nguyễn Văn A" className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại <span className="text-red-500">*</span></label>
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" placeholder="0901234567" className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" required />
                  </div>
                </div>
              </div>

              {/* Địa chỉ giao hàng */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-4">Địa chỉ giao hàng</h3>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  {/* Tỉnh/Thành phố */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tỉnh/Thành phố <span className="text-red-500">*</span></label>
                    <select
                      value={selectedProvince}
                      onChange={(e) => {
                        setSelectedProvince(e.target.value);
                        setSelectedDistrict(""); // Reset quận khi đổi tỉnh
                        // Auto-reset shipping method if not available for new zone
                        const newZone = getShippingZone(e.target.value);
                        if (!isMethodAvailable(newZone, shippingMethod as 'standard' | 'fast' | 'express')) {
                          setShippingMethod("standard");
                        }
                      }}
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                      required
                    >
                      <option value="">-- Chọn Tỉnh/Thành phố --</option>
                      {PROVINCES.map((p) => (
                        <option key={p.code} value={p.code}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  {/* Quận/Huyện */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quận/Huyện <span className="text-red-500">*</span></label>
                    <select
                      value={selectedDistrict}
                      onChange={(e) => {
                        setSelectedDistrict(e.target.value);
                        // Auto-reset shipping method if not available for new zone
                        const newZone = getShippingZone(selectedProvince, e.target.value);
                        if (!isMethodAvailable(newZone, shippingMethod as 'standard' | 'fast' | 'express')) {
                          setShippingMethod("standard");
                        }
                      }}
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                      required
                      disabled={!selectedProvince}
                    >
                      <option value="">-- Chọn Quận/Huyện --</option>
                      {currentDistricts.map((d) => (
                        <option key={d.name} value={d.name}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                {/* Hiển thị vùng ship + ngưỡng miễn phí */}
                {selectedProvince && selectedDistrict && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                    <div className="flex items-center gap-2 text-blue-700">
                      <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <span>
                        Vùng giao hàng: <strong>{ZONE_LABELS[currentZone]}</strong>
                        {freeThreshold > 0 && (
                          <> — Miễn phí ship tiêu chuẩn cho đơn từ <strong>{formatVNDWithComma(freeThreshold)}đ</strong></>
                        )}
                        {freeThreshold === 0 && <> — Không áp dụng miễn phí ship</>}
                      </span>
                    </div>
                  </div>
                )}
                {/* Địa chỉ chi tiết */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ chi tiết <span className="text-red-500">*</span></label>
                  <textarea value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} rows={2} placeholder="Số nhà, tên đường, phường/xã..." className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" required />
                </div>
              </div>

              {/* Phương thức vận chuyển */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-4">
                  Phương thức vận chuyển
                  {!selectedProvince && <span className="text-sm font-normal text-gray-400 ml-2">(chọn địa chỉ trước)</span>}
                </h3>
                <div className="space-y-3">
                  {shippingMethods.map((m) => {
                    const methodAvailable = isMethodAvailable(currentZone, m.id as 'standard' | 'fast' | 'express');
                    const methodFee = selectedProvince
                      ? calculateShippingFee(currentZone, m.id as 'standard' | 'fast' | 'express', selectedTotal)
                      : SHIPPING_RATES.trong_nuoc[m.id as keyof typeof SHIPPING_RATES.trong_nuoc];
                    const isFree = methodFee === 0;
                    const displayFee = methodFee > 0 ? methodFee : (methodFee === -1 ? -1 : 0);

                    return (
                      <label
                        key={m.id}
                        className={`flex items-center p-4 border rounded-lg transition ${
                          !methodAvailable
                            ? "opacity-40 cursor-not-allowed bg-gray-50"
                            : shippingMethod === m.id
                            ? "border-primary bg-yellow-50 cursor-pointer"
                            : "hover:border-gray-300 cursor-pointer"
                        }`}
                      >
                        <input
                          type="radio"
                          checked={shippingMethod === m.id}
                          onChange={() => methodAvailable && setShippingMethod(m.id)}
                          disabled={!methodAvailable}
                          className="w-5 h-5 accent-primary"
                        />
                        <div className="ml-4 flex-1">
                          <p className="font-medium text-gray-800">{m.name}</p>
                          <p className="text-sm text-gray-500">{m.description}</p>
                        </div>
                        <span className={`font-semibold ${
                          displayFee === -1 ? "text-gray-400" : isFree ? "text-green-600" : "text-gray-800"
                        }`}>
                          {displayFee === -1
                            ? "Không khả dụng"
                            : isFree
                            ? "Miễn phí"
                            : formatVNDWithComma(displayFee) + "đ"}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Phương thức thanh toán */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-4">Phương thức thanh toán</h3>
                <div className="space-y-3">
                  {paymentMethods.map((m) => (
                    <label key={m.id} className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${paymentMethod === m.id ? "border-primary bg-yellow-50" : "hover:border-gray-300"}`}>
                      <input type="radio" checked={paymentMethod === m.id} onChange={() => setPaymentMethod(m.id)} className="w-5 h-5 accent-primary" />
                      <div className="ml-4 flex-1">
                        <p className="font-medium text-gray-800">{m.name}</p>
                        <p className="text-sm text-gray-500">{m.description}</p>
                      </div>
                      <span className="text-2xl">{m.icon}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Ghi chú */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-4">Ghi chú đơn hàng</h3>
                <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="Ghi chú cho người bán (ví dụ: màu sắc, size...)" className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>

              {/* Tóm tắt */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Tóm tắt đơn hàng</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tạm tính ({selectedItems.length} sản phẩm)</span>
                    <span>{formatVNDWithComma(selectedTotal)}đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Giảm giá</span>
                    <span className="text-green-600">-{formatVNDWithComma(discount)}đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phí vận chuyển</span>
                    <span>{currentShippingFee === 0 ? "Miễn phí" : formatVNDWithComma(currentShippingFee) + "đ"}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t font-bold text-lg">
                    <span>Tổng thanh toán</span>
                    <span className="text-red-500">{formatVNDWithComma(grandTotal)}đ</span>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button type="button" onClick={() => setShowCheckout(false)} className="flex-1 py-4 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition">
                  Quay lại
                </button>
                <button type="submit" disabled={checkoutLoading} className="flex-1 py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition disabled:opacity-50">
                  {checkoutLoading ? "Đang xử lý..." : "Xác nhận đặt hàng"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Success Modal */}
      {orderSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Đặt hàng thành công!</h2>
            <p className="text-gray-600 mb-4">Cảm ơn bạn đã mua hàng tại TMF</p>
            <div className="bg-gray-100 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-500 mb-1">Mã đơn hàng của bạn</p>
              <p className="text-2xl font-bold text-primary">{orderCode}</p>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận đơn hàng.
            </p>
            <div className="flex gap-4">
              <Link href="/shop" className="flex-1 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition text-center">
                Tiếp tục mua sắm
              </Link>
              <Link href="/" className="flex-1 py-3 bg-primary hover:bg-yellow-400 text-gray-800 font-medium rounded-lg transition text-center">
                Về trang chủ
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-components
function CheckoutHeader({ totalItems }: { totalItems: number }) {
  return (
    <div className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-2xl font-bold text-gray-800">TMF</Link>
          <span className="text-gray-300">|</span>
          <h1 className="text-xl text-gray-600">Giỏ hàng</h1>
          {totalItems > 0 && (
            <span className="text-sm text-gray-400">({totalItems} sản phẩm)</span>
          )}
        </div>
      </div>
    </div>
  );
}

function CartIcon() {
  return (
    <svg className="h-20 w-20 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}
