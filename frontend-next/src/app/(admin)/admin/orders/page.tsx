"use client";

import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
};

type Order = {
  _id: string;
  customerName: string;
  phoneNumber: string;
  address: string;
  paymentMethod: string;
  items: OrderItem[];
  shippingFee: number;
  totalPrice: number;
  status: "Pending" | "Processing" | "Delivered" | "Cancelled";
  createdAt?: string;
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:8000/orders");
      if (!response.ok) {
        throw new Error("Không thể tải danh sách đơn hàng từ server");
      }
      const data = await response.json();
      setOrders(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Lỗi kết nối tới server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    const originalOrders = [...orders];
    
    // Cập nhật lạc quan trên giao diện (Optimistic UI)
    setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus as any } : o));

    try {
      const response = await fetch(`http://localhost:8000/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Không thể cập nhật trạng thái");
      }

      toast.success(`Đã cập nhật trạng thái đơn hàng sang ${
        newStatus === "Pending" ? "Chờ duyệt" :
        newStatus === "Processing" ? "Đang xử lý" :
        newStatus === "Delivered" ? "Đã giao" : "Đã hủy"
      }`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Lỗi khi cập nhật trạng thái");
      // Quay lại dữ liệu gốc nếu lỗi
      setOrders(originalOrders);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa vĩnh viễn đơn hàng này?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/orders/${orderId}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Không thể xóa đơn hàng");
      }

      setOrders(prev => prev.filter(o => o._id !== orderId));
      toast.success("Xóa đơn hàng thành công");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Lỗi khi xóa đơn hàng");
    }
  };

  const formatVND = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.phoneNumber.includes(search) ||
      o._id.toLowerCase().includes(search.toLowerCase());
      
    const matchesStatus = statusFilter === "All" || o.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg backdrop-blur-md">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-cyan-500/10 blur-[100px]"></div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-300 font-semibold">Khu vực quản trị</p>
            <h1 className="mt-1 text-3xl font-bold text-white tracking-tight">Quản lý Đơn Hàng</h1>
            <p className="mt-2 text-sm text-slate-400">
              Xem chi tiết giỏ hàng, cập nhật trạng thái giao nhận và quản lý thông tin khách hàng.
            </p>
          </div>
          <button 
            onClick={fetchOrders}
            className="flex items-center justify-center rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-700 active:scale-95 self-start sm:self-center"
          >
            Làm mới
          </button>
        </div>
      </section>

      {/* Bộ lọc & Tìm kiếm */}
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="sm:col-span-2 relative">
          <input
            type="text"
            placeholder="Tìm kiếm theo Tên khách hàng, Số điện thoại hoặc Mã đơn hàng..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-slate-800 bg-slate-900/50 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-400 transition backdrop-blur-sm"
          />
          <svg className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-2xl border border-slate-800 bg-slate-900/50 py-3 px-4 text-sm text-white outline-none focus:border-cyan-400 transition backdrop-blur-sm cursor-pointer appearance-none"
          >
            <option value="All" className="bg-slate-900 text-white">Tất cả trạng thái</option>
            <option value="Pending" className="bg-slate-900 text-white">Chờ duyệt (Pending)</option>
            <option value="Processing" className="bg-slate-900 text-white">Đang xử lý (Processing)</option>
            <option value="Delivered" className="bg-slate-900 text-white">Đã giao (Delivered)</option>
            <option value="Cancelled" className="bg-slate-900 text-white">Đã hủy (Cancelled)</option>
          </select>
          <div className="pointer-events-none absolute right-4 top-4 text-slate-400">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </section>

      {/* Danh sách đơn hàng */}
      {loading ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center space-y-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-500/20 border-t-cyan-400"></div>
          <p className="text-sm text-slate-400 animate-pulse">Đang tải danh sách đơn hàng...</p>
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-center text-red-400">
          <p>{error}</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-12 text-center text-slate-400">
          Không tìm thấy đơn hàng nào phù hợp với bộ lọc.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <article 
              key={order._id}
              className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 shadow-md backdrop-blur-sm hover:border-slate-700/80 transition duration-200"
            >
              <div className="flex flex-col lg:flex-row gap-6 justify-between border-b border-slate-800/80 pb-4 mb-4">
                {/* Thông tin đơn */}
                <div>
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="text-xs font-mono text-cyan-300 font-bold bg-cyan-500/10 px-2 py-0.5 rounded">
                      #{order._id.toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-500">
                      Đã đặt ngày: {formatDate(order.createdAt)}
                    </span>
                  </div>
                  
                  <div className="mt-3 grid sm:grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-6 text-xs text-slate-300">
                    <p>Khách hàng: <span className="font-semibold text-white">{order.customerName}</span></p>
                    <p>Số điện thoại: <span className="font-semibold text-white">{order.phoneNumber}</span></p>
                    <p className="sm:col-span-2 md:col-span-1">Địa chỉ: <span className="text-slate-400 line-clamp-1">{order.address}</span></p>
                  </div>
                </div>

                {/* Trạng thái & Hành động */}
                <div className="flex flex-wrap items-center gap-3 self-start lg:self-center">
                  <div className="relative">
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                      className={`rounded-xl px-3 py-1.5 text-xs font-bold border outline-none cursor-pointer appearance-none pr-8 transition ${
                        order.status === "Delivered" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" :
                        order.status === "Pending" ? "bg-amber-500/10 text-amber-400 border-amber-500/30" :
                        order.status === "Processing" ? "bg-purple-500/10 text-purple-400 border-purple-500/30" :
                        "bg-rose-500/10 text-rose-400 border-rose-500/30"
                      }`}
                    >
                      <option value="Pending" className="bg-slate-900 text-white">Chờ duyệt</option>
                      <option value="Processing" className="bg-slate-900 text-white">Đang xử lý</option>
                      <option value="Delivered" className="bg-slate-900 text-white">Đã giao hàng</option>
                      <option value="Cancelled" className="bg-slate-900 text-white">Đã hủy đơn</option>
                    </select>
                    <div className="pointer-events-none absolute right-2.5 top-2.5 text-slate-400">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.0} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteOrder(order._id)}
                    className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition active:scale-90"
                    title="Xóa đơn hàng"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Sản phẩm trong giỏ */}
              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  {order.items.map((item, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-3 bg-slate-900/30 p-2.5 rounded-2xl border border-slate-800/50"
                    >
                      <img 
                        src={item.imageUrl || "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=100"} 
                        alt={item.name} 
                        className="h-12 w-12 rounded-xl object-cover bg-slate-800 border border-slate-700/50"
                      />
                      <div className="text-xs min-w-0 flex-1">
                        <p className="font-semibold text-white truncate">{item.name}</p>
                        <div className="mt-1 flex items-center justify-between text-slate-400">
                          <p>{formatVND(item.price)}</p>
                          <p className="font-bold text-slate-200">SL: {item.quantity}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-2 border-t border-slate-800/80 pt-3 text-xs">
                  <div className="text-slate-400">
                    Hình thức thanh toán: <span className="font-semibold text-slate-200 bg-slate-800 px-2 py-0.5 rounded">{order.paymentMethod}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400">Phí vận chuyển: <span className="text-slate-200 font-medium">{formatVND(order.shippingFee)}</span></p>
                    <p className="mt-1 text-sm text-slate-400">
                      Tổng tiền: <span className="text-base font-black text-cyan-300">{formatVND(order.totalPrice)}</span>
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
