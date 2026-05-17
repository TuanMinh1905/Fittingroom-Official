// ===== TMFashion Admin Orders Page =====
// Tương đương pages/admin/orders.vue
// SD: Quản lý đơn hàng → Admin duyệt/cập nhật đơn
// STM Quản lý đơn hàng: Xem danh sách → Lọc theo trạng thái → Cập nhật trạng thái

"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { formatVNDWithComma, formatDate } from "@/utils";

interface OrderItem {
  product_id: { _id: string; name: string; image_url?: string };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  user_id?: { full_name: string; email: string; phone?: string };
  items?: OrderItem[];
  total_amount: number;
  status: string;
  payment_method?: string;
  payment_status?: string;
  shipping_address?: string;
  note?: string;
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
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState("");
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get<{ orders: Order[] }>("/orders/admin/all");
      setOrders(data.orders || []);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = activeStatus
    ? orders.filter((o) => o.status === activeStatus)
    : orders;

  const statusCounts: Record<string, number> = {};
  orders.forEach((o) => {
    statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
  });

  async function updateStatus(orderId: string, newStatus: string) {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Lỗi cập nhật trạng thái");
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Quản lý đơn hàng</h1>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveStatus(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeStatus === tab.key
                ? "bg-primary text-gray-800"
                : "bg-white border hover:bg-gray-50"
            }`}
          >
            {tab.label}
            {tab.key ? (
              <span className="ml-1">({statusCounts[tab.key] || 0})</span>
            ) : (
              <span className="ml-1">({orders.length})</span>
            )}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-sm text-gray-500">
                <th className="text-left py-3 px-4">Mã đơn</th>
                <th className="text-left py-3 px-4">Khách hàng</th>
                <th className="text-right py-3 px-4">Tổng tiền</th>
                <th className="text-center py-3 px-4">Trạng thái</th>
                <th className="text-center py-3 px-4">Ngày tạo</th>
                <th className="text-center py-3 px-4">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">Đang tải...</td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">Không có đơn hàng</td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-mono">{order._id.slice(-8)}</td>
                    <td className="py-3 px-4">
                      <p className="text-sm font-medium text-gray-800">{order.user_id?.full_name || "N/A"}</p>
                      <p className="text-xs text-gray-400">{order.user_id?.email}</p>
                    </td>
                    <td className="py-3 px-4 text-right text-sm font-medium">{formatVNDWithComma(order.total_amount)}đ</td>
                    <td className="py-3 px-4 text-center">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        className={`px-2 py-1 rounded text-xs font-medium cursor-pointer ${STATUS_COLORS[order.status] || "bg-gray-100"}`}
                      >
                        <option value="pending">Chờ xử lý</option>
                        <option value="confirmed">Đã xác nhận</option>
                        <option value="shipping">Đang giao</option>
                        <option value="delivered">Hoàn thành</option>
                        <option value="cancelled">Đã hủy</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-center text-sm text-gray-500">{formatDate(order.created_at)}</td>
                    <td className="py-3 px-4 text-center">
                      <button onClick={() => setDetailOrder(order)} className="px-3 py-1 text-sm border rounded hover:bg-gray-100 transition">
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {detailOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setDetailOrder(null)}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">
                Đơn hàng #{detailOrder._id.slice(-8)}
              </h2>
              <button onClick={() => setDetailOrder(null)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Khách hàng:</span>
                  <p className="font-medium">{detailOrder.user_id?.full_name}</p>
                </div>
                <div>
                  <span className="text-gray-500">Email:</span>
                  <p className="font-medium">{detailOrder.user_id?.email}</p>
                </div>
                <div>
                  <span className="text-gray-500">Tổng tiền:</span>
                  <p className="font-medium text-red-500">{formatVNDWithComma(detailOrder.total_amount)}đ</p>
                </div>
                <div>
                  <span className="text-gray-500">Thanh toán:</span>
                  <p className="font-medium">{detailOrder.payment_method || "COD"}</p>
                </div>
                {detailOrder.shipping_address && (
                  <div className="col-span-2">
                    <span className="text-gray-500">Địa chỉ giao hàng:</span>
                    <p className="font-medium">{detailOrder.shipping_address}</p>
                  </div>
                )}
                {detailOrder.note && (
                  <div className="col-span-2">
                    <span className="text-gray-500">Ghi chú:</span>
                    <p className="font-medium">{detailOrder.note}</p>
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium text-gray-800 mb-3">Sản phẩm</h3>
                <div className="space-y-3">
                  {(detailOrder.items || []).map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <img src={item.product_id?.image_url || "/placeholder.png"} alt="" className="w-12 h-12 rounded object-cover border" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.product_id?.name}</p>
                        <p className="text-xs text-gray-400">x{item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium">{formatVNDWithComma(item.price * item.quantity)}đ</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
