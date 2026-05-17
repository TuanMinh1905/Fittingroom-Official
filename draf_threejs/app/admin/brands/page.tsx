// ===== TMFashion Admin Brands Page =====
// SD: Quản lý sản phẩm → Admin quản lý thương hiệu

"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";

interface Brand {
  _id: string;
  name: string;
  slug: string;
  logo_url?: string;
  description?: string;
  is_active?: boolean;
}

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", logo_url: "", description: "", is_active: true });

  const fetchBrands = useCallback(async () => {
    try {
      const data = await api.get<{ data: Brand[] }>("/brands");
      setBrands(Array.isArray(data) ? data : (data.data || []));
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBrands(); }, [fetchBrands]);

  function openCreate() {
    setEditingId(null);
    setForm({ name: "", slug: "", logo_url: "", description: "", is_active: true });
    setShowModal(true);
  }

  function openEdit(b: Brand) {
    setEditingId(b._id);
    setForm({ name: b.name, slug: b.slug, logo_url: b.logo_url || "", description: b.description || "", is_active: b.is_active !== false });
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name) return;
    try {
      const body = { ...form, slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-") };
      if (editingId) {
        await api.put(`/brands/${editingId}`, body);
      } else {
        await api.post("/brands", body);
      }
      setShowModal(false);
      fetchBrands();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Lỗi");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Xóa thương hiệu này?")) return;
    try {
      await api.delete(`/brands/${id}`);
      fetchBrands();
    } catch { alert("Lỗi xóa"); }
  }

  if (loading) return <div className="text-center py-12 text-gray-400">Đang tải...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý thương hiệu</h1>
        <button onClick={openCreate} className="px-4 py-2 bg-primary hover:bg-yellow-400 text-gray-800 font-medium rounded-lg transition">+ Thêm thương hiệu</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {brands.map((b) => (
          <div key={b._id} className="bg-white rounded-lg shadow p-4 flex items-start gap-4">
            {b.logo_url ? (
              <img src={b.logo_url} alt={b.name} className="w-16 h-16 rounded-lg object-contain border" />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-xl">{b.name.charAt(0)}</div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-800">{b.name}</h3>
              <p className="text-xs text-gray-400">{b.slug}</p>
              {b.description && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{b.description}</p>}
              <div className="flex gap-2 mt-3">
                <button onClick={() => openEdit(b)} className="px-3 py-1 text-xs border rounded hover:bg-gray-100 transition">Sửa</button>
                <button onClick={() => handleDelete(b._id)} className="px-3 py-1 text-xs border border-red-200 text-red-500 rounded hover:bg-red-50 transition">Xóa</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-800 mb-4">{editingId ? "Sửa thương hiệu" : "Thêm thương hiệu"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL Logo</label>
                <input value={form.logo_url} onChange={(e) => setForm({ ...form, logo_url: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-5 h-5 accent-primary" id="brand_active" />
                <label htmlFor="brand_active" className="text-sm">Hiển thị</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 border rounded-lg hover:bg-gray-100 transition">Hủy</button>
                <button type="submit" className="flex-1 py-2 bg-primary hover:bg-yellow-400 text-gray-800 font-medium rounded-lg transition">{editingId ? "Cập nhật" : "Thêm"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
