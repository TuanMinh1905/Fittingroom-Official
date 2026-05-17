// ===== TMFashion Admin Product Edit =====
// Tương đương pages/admin/products/[id].vue

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { Category } from "@/stores/category";
import type { Brand } from "@/stores/brand";

export default function AdminProductEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    sku: "",
    alias: "",
    price: 0,
    compare_at_price: 0,
    category_id: "",
    brand_id: "",
    image_url: "",
    description: "",
    stock: 0,
    is_active: true,
  });

  useEffect(() => {
    async function load() {
      try {
        const [product, cats, brs] = await Promise.all([
          api.get<Record<string, unknown>>(`/products/${id}`),
          api.get<{ data: Category[] }>("/categories"),
          api.get<{ data: Brand[] }>("/brands"),
        ]);
        setCategories(Array.isArray(cats) ? cats : ((cats as { data: Category[] }).data || []));
        setBrands(Array.isArray(brs) ? brs : ((brs as { data: Brand[] }).data || []));

        const p = product;
        if (p) {
          setForm({
            name: (p.name as string) || "",
            sku: (p.sku as string) || "",
            alias: (p.alias as string) || "",
            price: (p.price as number) || 0,
            compare_at_price: (p.compare_at_price as number) || 0,
            category_id: ((p.category_id as Record<string, string>)?._id as string) || (p.category_id as string) || "",
            brand_id: ((p.brand_id as Record<string, string>)?._id as string) || (p.brand_id as string) || "",
            image_url: (p.image_url as string) || "",
            description: (p.description as string) || "",
            stock: (p.stock as number) || 0,
            is_active: p.is_active !== false,
          });
        }
      } catch {
        alert("Không tìm thấy sản phẩm");
        router.push("/admin/products");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, router]);

  function updateForm(field: string, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/products/${id}`, {
        ...form,
        price: Number(form.price),
        compare_at_price: Number(form.compare_at_price) || undefined,
        stock: Number(form.stock),
      });
      router.push("/admin/products");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Lỗi cập nhật sản phẩm");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="text-center py-12 text-gray-400">Đang tải...</div>;
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Chỉnh sửa sản phẩm</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm</label>
              <input value={form.name} onChange={(e) => updateForm("name", e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
              <input value={form.sku} onChange={(e) => updateForm("sku", e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Giá bán</label>
              <input type="number" value={form.price} onChange={(e) => updateForm("price", e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Giá gốc</label>
              <input type="number" value={form.compare_at_price} onChange={(e) => updateForm("compare_at_price", e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
              <select value={form.category_id} onChange={(e) => updateForm("category_id", e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">-- Chọn --</option>
                {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Thương hiệu</label>
              <select value={form.brand_id} onChange={(e) => updateForm("brand_id", e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">-- Chọn --</option>
                {brands.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL Hình ảnh</label>
              <input value={form.image_url} onChange={(e) => updateForm("image_url", e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              {form.image_url && <img src={form.image_url} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-lg border" />}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tồn kho</label>
              <input type="number" value={form.stock} onChange={(e) => updateForm("stock", e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" checked={form.is_active} onChange={(e) => updateForm("is_active", e.target.checked)} className="w-5 h-5 accent-primary" id="is_active" />
              <label htmlFor="is_active" className="text-sm text-gray-700">Đang bán</label>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
          <textarea value={form.description} onChange={(e) => updateForm("description", e.target.value)} rows={4} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>

        <div className="flex gap-4 pt-4 border-t">
          <button type="button" onClick={() => router.back()} className="px-6 py-2 border rounded-lg hover:bg-gray-100 transition">Hủy</button>
          <button type="submit" disabled={saving} className="px-6 py-2 bg-primary hover:bg-yellow-400 text-gray-800 font-medium rounded-lg transition disabled:opacity-50">
            {saving ? "Đang lưu..." : "Cập nhật sản phẩm"}
          </button>
        </div>
      </form>
    </div>
  );
}
