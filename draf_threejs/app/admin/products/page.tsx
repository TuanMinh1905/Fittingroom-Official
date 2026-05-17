// ===== TMFashion Admin Products Page =====
// Tương đương pages/admin/products/index.vue
// SD: Quản lý sản phẩm → Admin CRUD sản phẩm
// STM Quản lý sản phẩm: Xem danh sách → Tìm kiếm/Lọc → Thêm/Sửa/Xóa

"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { formatVNDWithComma } from "@/utils";
import type { Product } from "@/stores/product";
import type { Category } from "@/stores/category";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number | undefined> = {
        page: currentPage,
        limit: 15,
      };
      if (search) params.keyword = search;
      if (filterCategory) params.category_id = filterCategory;

      const data = await api.get<{ data: Product[]; pagination: { page: number; limit: number; total: number; totalPages: number } }>("/products", params);
      setProducts(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, filterCategory]);

  useEffect(() => {
    api.get<{ data: Category[] }>("/categories").then((res) => {
      const cats = Array.isArray(res) ? res : (res.data || []);
      setCategories(cats);
    });
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  async function handleDelete(id: string) {
    if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch {
      alert("Lỗi xóa sản phẩm");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý sản phẩm</h1>
        <Link
          href="/admin/products/create"
          className="px-4 py-2 bg-primary hover:bg-yellow-400 text-gray-800 font-medium rounded-lg transition"
        >
          + Thêm sản phẩm
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <select
          value={filterCategory}
          onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Tất cả danh mục</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-sm text-gray-500">
                <th className="text-left py-3 px-4">Sản phẩm</th>
                <th className="text-left py-3 px-4">SKU</th>
                <th className="text-right py-3 px-4">Giá</th>
                <th className="text-center py-3 px-4">Danh mục</th>
                <th className="text-center py-3 px-4">Trạng thái</th>
                <th className="text-center py-3 px-4">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    Đang tải...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    Không tìm thấy sản phẩm
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image_url || "/placeholder.png"}
                          alt={p.name}
                          className="w-12 h-12 rounded-lg object-cover border"
                        />
                        <span className="font-medium text-gray-800 line-clamp-1">
                          {p.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500 font-mono">
                      {p.sku || "-"}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <p className="font-medium text-gray-800">
                        {formatVNDWithComma(p.price)}đ
                      </p>
                      {p.compare_at_price && p.compare_at_price > p.price && (
                        <p className="text-xs text-gray-400 line-through">
                          {formatVNDWithComma(p.compare_at_price)}đ
                        </p>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center text-sm">
                      {(p.category_id?.name || p.category?.name) || "-"}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        p.is_active !== false ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                      }`}>
                        {p.is_active !== false ? "Đang bán" : "Ẩn"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/admin/products/${p._id}`}
                          className="px-3 py-1 text-sm border rounded hover:bg-gray-100 transition"
                        >
                          Sửa
                        </Link>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="px-3 py-1 text-sm border border-red-200 text-red-500 rounded hover:bg-red-50 transition"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
              .map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`px-3 py-1 rounded ${
                    p === currentPage ? "bg-primary text-gray-800 font-bold" : "hover:bg-gray-100"
                  }`}
                >
                  {p}
                </button>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
