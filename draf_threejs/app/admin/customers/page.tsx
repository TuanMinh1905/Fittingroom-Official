// ===== TMFashion Admin Customers Page =====
// Tương đương pages/admin/customers.vue
// SD: Quản lý tài khoản → Admin CRUD user
// STM Quản lý tài khoản: Xem danh sách → Tìm kiếm → Xem chi tiết/Sửa/Khóa

"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { formatDate } from "@/utils";

interface User {
  _id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: string;
  avatar?: string;
  is_active?: boolean;
  created_at: string;
}

export default function AdminCustomersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [detailUser, setDetailUser] = useState<User | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get<{ users: User[] }>("/users", search ? { keyword: search } : undefined);
      setUsers(data.users || []);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(fetchUsers, 300);
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  async function toggleActive(userId: string, currentActive: boolean) {
    try {
      await api.put(`/users/${userId}`, { is_active: !currentActive });
      fetchUsers();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Lỗi cập nhật");
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Quản lý khách hàng</h1>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm kiếm theo tên, email..."
          className="w-full md:w-96 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-sm text-gray-500">
                <th className="text-left py-3 px-4">Người dùng</th>
                <th className="text-left py-3 px-4">Email</th>
                <th className="text-center py-3 px-4">SĐT</th>
                <th className="text-center py-3 px-4">Vai trò</th>
                <th className="text-center py-3 px-4">Ngày tạo</th>
                <th className="text-center py-3 px-4">Trạng thái</th>
                <th className="text-center py-3 px-4">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">Đang tải...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">Không tìm thấy người dùng</td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-sm">
                          {u.avatar ? (
                            <img src={u.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                          ) : (
                            (u.full_name || "?").charAt(0).toUpperCase()
                          )}
                        </div>
                        <span className="font-medium text-gray-800">{u.full_name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{u.email}</td>
                    <td className="py-3 px-4 text-center text-sm">{u.phone || "-"}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        u.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-sm text-gray-500">{formatDate(u.created_at)}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => toggleActive(u._id, u.is_active !== false)}
                        className={`px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${
                          u.is_active !== false ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {u.is_active !== false ? "Hoạt động" : "Đã khóa"}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button onClick={() => setDetailUser(u)} className="px-3 py-1 text-sm border rounded hover:bg-gray-100 transition">
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
      {detailUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setDetailUser(null)}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">Thông tin người dùng</h2>
              <button onClick={() => setDetailUser(null)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="text-center mb-4">
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-2xl mx-auto mb-3">
                {detailUser.avatar ? (
                  <img src={detailUser.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                ) : (
                  (detailUser.full_name || "?").charAt(0).toUpperCase()
                )}
              </div>
              <p className="text-lg font-bold text-gray-800">{detailUser.full_name}</p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-1 ${
                detailUser.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
              }`}>
                {detailUser.role}
              </span>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Email:</span>
                <span className="font-medium">{detailUser.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">SĐT:</span>
                <span className="font-medium">{detailUser.phone || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Ngày tạo:</span>
                <span className="font-medium">{formatDate(detailUser.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Trạng thái:</span>
                <span className={`font-medium ${detailUser.is_active !== false ? "text-green-600" : "text-red-600"}`}>
                  {detailUser.is_active !== false ? "Hoạt động" : "Đã khóa"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
