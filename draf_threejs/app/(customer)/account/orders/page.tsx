// ===== TMFashion Account Orders Page =====
// Tương đương pages/account/orders.vue
// SD: Quản lý đơn hàng → User xem lịch sử đơn hàng
// STM Người dùng mua hàng: Xem đơn hàng → Lọc trạng thái → Xem chi tiết → Hủy đơn

"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth";
import { api } from "@/lib/api";
import { formatVNDWithComma, formatDate } from "@/utils";

interface OrderItem {
  product_id?: { _id: string; name: string; image_url?: string };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  items?: OrderItem[];
  total_amount: number;
  status: string;
  payment_method?: string;
  payment_status?: string;
  shipping_address?: string;
  created_at: string;
}

const STATUS_TABS = [
  { key: "", label: "Tất cả" },
  { key: "pending", label: "Chờ xử lý" },
  { key: "confirmed", label: "Đã xác nhận" },
  { key: "shipping", label: "Đang giao" },
  { key: "delivered", label: "Hoàn thành" },
  { key: "cancelled", label: "Đã hủy" },
];

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipping: "bg-indigo-100 text-indigo-700",
  completed: "bg-green-100 text-green-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AccountOrdersPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<Record<string, OrderItem[]>>({});

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get<{ orders: Order[] }>("/orders");
      setOrders(data.orders || []);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    fetchOrders();
  }, [isLoggedIn, router, fetchOrders]);

  const filteredOrders = activeStatus
    ? orders.filter((o) => o.status === activeStatus)
    : orders;

  async function cancelOrder(orderId: string) {
    if (!confirm("Bạn có chắc muốn hủy đơn hàng này?")) return;
    try {
      await api.put(`/orders/${orderId}/cancel`);
      fetchOrders();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Lỗi hủy đơn");
    }
  }

  async function toggleExpand(orderId: string) {
    if (expandedId === orderId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(orderId);
    // Fetch items if not already loaded
    if (!orderDetails[orderId]) {
      try {
        const data = await api.get<{ order: Order; items: OrderItem[] }>(`/orders/${orderId}`);
        setOrderDetails((prev) => ({ ...prev, [orderId]: data.items || [] }));
      } catch { /* ignore */ }
    }
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <div className="grid md:grid-cols-[240px_1fr] gap-8">
        {/* Sidebar */}
        <aside className="space-y-2">
          <Link href="/account" className="block px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-600 text-sm transition">
            Thông tin cá nhân
          </Link>
          <Link href="/account/orders" className="block px-4 py-2 rounded-lg bg-primary text-gray-800 font-medium text-sm">
            Đơn hàng của tôi
          </Link>
        </aside>

        {/* Main */}
        <div className="space-y-6">
          <h1 className="text-xl font-bold text-gray-800">Đơn hàng của tôi</h1>

          {/* Status Tabs */}
          <div className="flex flex-wrap gap-2">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveStatus(tab.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  activeStatus === tab.key ? "bg-primary text-gray-800" : "bg-white border hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Orders List */}
          {loading ? (
            <div className="text-center py-12 text-gray-400">Đang tải...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">Không có đơn hàng nào</p>
              <Link href="/shop" className="text-primary hover:underline">Tiếp tục mua sắm</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order._id} className="bg-white rounded-lg shadow overflow-hidden">
                  {/* Order Header */}
                  <div
                    className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleExpand(order._id)}
                  >
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-sm font-mono text-gray-500">#{order._id.slice(-8)}</p>
                        <p className="text-xs text-gray-400">{formatDate(order.created_at)}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status] || "bg-gray-100"}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-800">{formatVNDWithComma(order.total_amount)}đ</p>
                      <p className="text-xs text-gray-400">{(order.items || orderDetails[order._id] || []).length} sản phẩm</p>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedId === order._id && (
                    <div className="border-t px-6 py-4 space-y-4">
                      {/* Items */}
                      <div className="space-y-3">
                        {(orderDetails[order._id] || []).map((item, i) => (
                          <div key={i} className="flex items-center gap-4">
                            <img src={item.product_id?.image_url || "/placeholder.png"} alt="" className="w-14 h-14 rounded object-cover border" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800">{item.product_id?.name}</p>
                              <p className="text-xs text-gray-400">x{item.quantity} | {formatVNDWithComma(item.price)}đ</p>
                            </div>
                            <p className="text-sm font-medium">{formatVNDWithComma(item.price * item.quantity)}đ</p>
                          </div>
                        ))}
                      </div>

                      {/* Order Info */}
                      <div className="grid grid-cols-2 gap-2 text-sm pt-2 border-t">
                        <div>
                          <span className="text-gray-500">Thanh toán:</span>{" "}
                          <span className="font-medium">{order.payment_method || "COD"}</span>
                        </div>
                        {order.shipping_address && (
                          <div className="col-span-2">
                            <span className="text-gray-500">Giao đến:</span>{" "}
                            <span className="font-medium">{order.shipping_address}</span>
                          </div>
                        )}
                      </div>

                      {/* Cancel button */}
                      {order.status === "pending" && (
                        <div className="pt-2 border-t">
                          <button
                            onClick={() => cancelOrder(order._id)}
                            className="px-4 py-2 text-sm border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition"
                          >
                            Hủy đơn hàng
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
