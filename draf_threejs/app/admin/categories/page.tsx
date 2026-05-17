// ===== TMFashion Admin Categories Page =====
// Tương đương pages/admin/categories.vue
// SD: Quản lý sản phẩm → Admin quản lý danh mục
// STM Quản lý sản phẩm: Xem danh sách → Thêm/Sửa/Xóa danh mục

"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";

interface Category {
  _id: string;
  name: string;
  slug: string;
  parent_id?: { _id: string; name: string } | string;
  sortOrder?: number;
  isActive?: boolean;
  children?: Category[];
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    parent_id: "",
    sortOrder: 0,
    isActive: true,
  });

  const fetchCategories = useCallback(async () => {
    try {
      const data = await api.get<{ data: Category[] }>("/categories");
      setCategories(Array.isArray(data) ? data : (data.data || []));
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Build tree structure
  const parentCategories = categories.filter((c) => !c.parent_id);
  const getChildren = (parentId: string) =>
    categories.filter((c) => {
      const pid = typeof c.parent_id === "object" ? c.parent_id?._id : c.parent_id;
      return pid === parentId;
    });

  function openCreate() {
    setEditingId(null);
    setForm({ name: "", slug: "", parent_id: "", sortOrder: 0, isActive: true });
    setShowModal(true);
  }

  function openEdit(cat: Category) {
    setEditingId(cat._id);
    const parentId = typeof cat.parent_id === "object" ? cat.parent_id?._id : cat.parent_id;
    setForm({
      name: cat.name,
      slug: cat.slug,
      parent_id: parentId || "",
      sortOrder: cat.sortOrder || 0,
      isActive: cat.isActive !== false,
    });
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name) return;
    try {
      const body: Record<string, unknown> = {
        name: form.name,
        slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-"),
        sortOrder: Number(form.sortOrder),
        isActive: form.isActive,
      };
      if (form.parent_id) body.parent_id = form.parent_id;

      if (editingId) {
        await api.put(`/categories/${editingId}`, body);
      } else {
        await api.post("/categories", body);
      }
      setShowModal(false);
      fetchCategories();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Lỗi thao tác");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Xóa danh mục này?")) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch {
      alert("Lỗi xóa danh mục");
    }
  }

  if (loading) {
    return <div className="text-center py-12 text-gray-400">Đang tải...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý danh mục</h1>
        <button onClick={openCreate} className="px-4 py-2 bg-primary hover:bg-yellow-400 text-gray-800 font-medium rounded-lg transition">
          + Thêm danh mục
        </button>
      </div>

      {/* Category Tree */}
      <div className="bg-white rounded-lg shadow divide-y">
        {parentCategories.length === 0 && (
          <div className="p-8 text-center text-gray-400">Chưa có danh mục nào</div>
        )}
        {parentCategories.map((parent) => {
          const children = getChildren(parent._id);
          return (
            <div key={parent._id}>
              {/* Parent row */}
              <div className="flex items-center justify-between px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                  <span className="font-medium text-gray-800">{parent.name}</span>
                  <span className="text-xs text-gray-400">({parent.slug})</span>
                  {parent.isActive === false && (
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-400 text-xs rounded-full">Ẩn</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => openEdit(parent)} className="px-3 py-1 text-sm border rounded hover:bg-gray-100 transition">Sửa</button>
                  <button onClick={() => handleDelete(parent._id)} className="px-3 py-1 text-sm border border-red-200 text-red-500 rounded hover:bg-red-50 transition">Xóa</button>
                </div>
              </div>

              {/* Children */}
              {children.map((child) => (
                <div key={child._id} className="flex items-center justify-between px-6 py-3 pl-12 bg-gray-50/50 hover:bg-gray-100/50">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-300">└</span>
                    <span className="text-gray-700">{child.name}</span>
                    <span className="text-xs text-gray-400">({child.slug})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(child)} className="px-3 py-1 text-sm border rounded hover:bg-gray-100 transition">Sửa</button>
                    <button onClick={() => handleDelete(child._id)} className="px-3 py-1 text-sm border border-red-200 text-red-500 rounded hover:bg-red-50 transition">Xóa</button>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              {editingId ? "Sửa danh mục" : "Thêm danh mục"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên danh mục *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Tự tạo nếu bỏ trống" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục cha</label>
                <select value={form.parent_id} onChange={(e) => setForm({ ...form, parent_id: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="">-- Không (danh mục gốc) --</option>
                  {parentCategories
                    .filter((c) => c._id !== editingId)
                    .map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thứ tự</label>
                <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="w-5 h-5 accent-primary" id="cat_active" />
                <label htmlFor="cat_active" className="text-sm text-gray-700">Hiển thị</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 border rounded-lg hover:bg-gray-100 transition">Hủy</button>
                <button type="submit" className="flex-1 py-2 bg-primary hover:bg-yellow-400 text-gray-800 font-medium rounded-lg transition">
                  {editingId ? "Cập nhật" : "Thêm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
