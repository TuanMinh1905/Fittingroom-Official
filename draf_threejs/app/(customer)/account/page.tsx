// ===== TMFashion Account Profile Page =====
// Tương đương pages/account/index.vue
// SD: Quản lý tài khoản → User xem/sửa thông tin cá nhân

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth";
import { api } from "@/lib/api";

export default function AccountPage() {
  const router = useRouter();
  const { user, isLoggedIn, fetchMe } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    if (user) {
      setForm({
        fullName: user.fullName || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [isLoggedIn, user, router]);

  async function handleSave() {
    setSaving(true);
    try {
      await api.put("/auth/profile", form);
      await fetchMe();
      setEditing(false);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Lỗi cập nhật");
    } finally {
      setSaving(false);
    }
  }

  if (!user) {
    return <div className="text-center py-12 text-gray-400">Đang tải...</div>;
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <div className="grid md:grid-cols-[240px_1fr] gap-8">
        {/* Sidebar */}
        <aside className="space-y-2">
          <div className="text-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-500 mx-auto mb-3">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            <p className="font-semibold text-gray-800">{user.fullName}</p>
            <p className="text-sm text-gray-400">{user.email}</p>
          </div>
          <Link href="/account" className="block px-4 py-2 rounded-lg bg-primary text-gray-800 font-medium text-sm">
            Thông tin cá nhân
          </Link>
          <Link href="/account/orders" className="block px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-600 text-sm transition">
            Đơn hàng của tôi
          </Link>
        </aside>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-gray-800">Thông tin cá nhân</h1>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm transition"
              >
                Chỉnh sửa
              </button>
            )}
          </div>

          {editing ? (
            <div className="space-y-4 max-w-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
                <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setEditing(false)} className="px-6 py-2 border rounded-lg hover:bg-gray-100 transition">Hủy</button>
                <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-primary hover:bg-yellow-400 text-gray-800 font-medium rounded-lg transition disabled:opacity-50">
                  {saving ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="text-sm text-gray-500">Họ tên:</span>
                <span className="text-sm font-medium text-gray-800">{user.fullName}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="text-sm text-gray-500">Email:</span>
                <span className="text-sm font-medium text-gray-800">{user.email}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="text-sm text-gray-500">Số điện thoại:</span>
                <span className="text-sm font-medium text-gray-800">{user.phone || "Chưa cập nhật"}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <span className="text-sm text-gray-500">Địa chỉ:</span>
                <span className="text-sm font-medium text-gray-800">{user.address || "Chưa cập nhật"}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
