// ===== TMFashion Admin Dashboard =====
// Tương đương pages/admin/index.vue
// SD: Quản lý doanh thu → Admin xem tổng quan

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { formatVNDWithComma } from "@/utils";

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
  ordersByStatus: Record<string, number>;
  recentOrders: Array<{
    _id: string;
    total_amount: number;
    status: string;
    created_at: string;
    user_id?: { full_name: string; email: string };
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Fetch multiple endpoints concurrently
        const [products, orders, customers, revenue] = await Promise.all([
          api.get<{ data: unknown[]; pagination: { total: number } }>("/products", { limit: 1 }),
          api.get<{ orders: unknown[] }>("/orders/admin/all"),
          api.get<{ users: unknown[] }>("/users"),
          api.get<{ totalRevenue: number }>("/admin/revenue/overview"),
        ]);

        const orderList = (orders.orders || []) as Array<{ status: string; total_amount: number; _id: string; created_at: string; user_id?: { full_name: string; email: string } }>;
        const ordersByStatus: Record<string, number> = {};
        orderList.forEach((o) => {
          ordersByStatus[o.status] = (ordersByStatus[o.status] || 0) + 1;
        });

        setStats({
          totalProducts: products.pagination?.total || 0,
          totalOrders: orderList.length,
          totalCustomers: ((customers.users || []) as unknown[]).length,
          totalRevenue: revenue.totalRevenue || 0,
          ordersByStatus,
          recentOrders: orderList.slice(0, 5),
        });
      } catch {
        // fallback
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
              <div className="h-8 bg-gray-200 rounded w-3/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    { label: "Sản phẩm", value: stats?.totalProducts || 0, color: "text-blue-600", bg: "bg-blue-50", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4" },
    { label: "Đơn hàng", value: stats?.totalOrders || 0, color: "text-orange-600", bg: "bg-orange-50", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
    { label: "Khách hàng", value: stats?.totalCustomers || 0, color: "text-green-600", bg: "bg-green-50", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
    { label: "Doanh thu", value: formatVNDWithComma(stats?.totalRevenue || 0) + "đ", color: "text-red-600", bg: "bg-red-50", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${card.bg} rounded-lg flex items-center justify-center`}>
                <svg className={`w-6 h-6 ${card.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Status & Recent Orders */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Order Status Breakdown */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Trạng thái đơn hàng</h2>
          <div className="space-y-3">
            {Object.entries(stats?.ordersByStatus || {}).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 capitalize">{status}</span>
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Thao tác nhanh</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/admin/products/create" className="p-4 border rounded-lg hover:border-primary hover:bg-yellow-50 transition text-center">
              <p className="font-medium text-gray-800">+ Thêm sản phẩm</p>
            </Link>
            <Link href="/admin/categories" className="p-4 border rounded-lg hover:border-primary hover:bg-yellow-50 transition text-center">
              <p className="font-medium text-gray-800">+ Thêm danh mục</p>
            </Link>
            <Link href="/admin/orders" className="p-4 border rounded-lg hover:border-primary hover:bg-yellow-50 transition text-center">
              <p className="font-medium text-gray-800">Quản lý đơn hàng</p>
            </Link>
            <Link href="/admin/report" className="p-4 border rounded-lg hover:border-primary hover:bg-yellow-50 transition text-center">
              <p className="font-medium text-gray-800">Xem báo cáo</p>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Đơn hàng gần đây</h2>
          <Link href="/admin/orders" className="text-sm text-primary hover:underline">Xem tất cả</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-sm text-gray-500">
                <th className="text-left py-3 px-2">Mã đơn</th>
                <th className="text-left py-3 px-2">Khách hàng</th>
                <th className="text-right py-3 px-2">Tổng tiền</th>
                <th className="text-center py-3 px-2">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {(stats?.recentOrders || []).map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-2 text-sm font-mono">
                    {order._id.slice(-8)}
                  </td>
                  <td className="py-3 px-2 text-sm">
                    {order.user_id?.full_name || "N/A"}
                  </td>
                  <td className="py-3 px-2 text-sm text-right font-medium">
                    {formatVNDWithComma(order.total_amount)}đ
                  </td>
                  <td className="py-3 px-2 text-center">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === "delivered" ? "bg-green-100 text-green-700" :
                      order.status === "cancelled" ? "bg-red-100 text-red-700" :
                      order.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                      "bg-blue-100 text-blue-700"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
