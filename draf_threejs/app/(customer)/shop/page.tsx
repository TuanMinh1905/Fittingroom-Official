// ===== TMFashion Shop Page =====
// Trang cửa hàng với sidebar filter (tương đương pages/shop.vue)
// SD: Quản lý sản phẩm → Người dùng tìm kiếm và lọc sản phẩm

"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Wrap from "@/components/base/Wrap";
import ProductCard from "@/components/product/ProductCard";
import { api } from "@/lib/api";
import { useCategoryStore, type Category } from "@/stores/category";
import { useBrandStore, type Brand } from "@/stores/brand";
import type { Product } from "@/stores/product";

export default function ShopPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const { categories, getCategories } = useCategoryStore();
  const { brands, getBrands } = useBrandStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number | undefined> = {
        page: currentPage,
        limit: 20,
      };
      if (searchQuery) params.keyword = searchQuery;
      if (selectedCategory) params.category = selectedCategory;
      if (selectedBrand) params.brand = selectedBrand;

      const data = await api.get<{
        data: Product[];
        pagination: { page: number; limit: number; total: number; totalPages: number };
      }>("/products", params);

      setProducts(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, selectedCategory, selectedBrand]);

  useEffect(() => {
    getCategories();
    getBrands();
  }, [getCategories, getBrands]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts();
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Wrap className="py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
              {/* Search */}
              <form onSubmit={handleSearch} className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tìm kiếm
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tên sản phẩm..."
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </form>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Danh mục
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={!selectedCategory}
                      onChange={() => {
                        setSelectedCategory("");
                        setCurrentPage(1);
                      }}
                      className="accent-primary"
                    />
                    <span className="text-sm text-gray-600">Tất cả</span>
                  </label>
                  {categories.map((cat: Category) => (
                    <label key={cat._id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === cat._id}
                        onChange={() => {
                          setSelectedCategory(cat._id);
                          setCurrentPage(1);
                        }}
                        className="accent-primary"
                      />
                      <span className="text-sm text-gray-600">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brand Filter */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Thương hiệu
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="brand"
                      checked={!selectedBrand}
                      onChange={() => {
                        setSelectedBrand("");
                        setCurrentPage(1);
                      }}
                      className="accent-primary"
                    />
                    <span className="text-sm text-gray-600">Tất cả</span>
                  </label>
                  {brands.map((brand: Brand) => (
                    <label key={brand._id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="brand"
                        checked={selectedBrand === brand._id}
                        onChange={() => {
                          setSelectedBrand(brand._id);
                          setCurrentPage(1);
                        }}
                        className="accent-primary"
                      />
                      <span className="text-sm text-gray-600">{brand.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Cửa hàng</h1>
              {searchQuery && (
                <p className="text-gray-500">
                  Kết quả cho &quot;{searchQuery}&quot;
                </p>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-lg animate-pulse">
                    <div className="aspect-square bg-gray-200 rounded-t-lg" />
                    <div className="p-3 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-lg p-12 text-center">
                <p className="text-gray-500 text-lg">
                  Không tìm thấy sản phẩm nào
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    <button
                      disabled={currentPage <= 1}
                      onClick={() => setCurrentPage((p) => p - 1)}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50 transition"
                    >
                      Trước
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(
                        (p) =>
                          p === 1 ||
                          p === totalPages ||
                          Math.abs(p - currentPage) <= 2
                      )
                      .map((p) => (
                        <button
                          key={p}
                          onClick={() => setCurrentPage(p)}
                          className={`px-4 py-2 border rounded-lg transition ${
                            p === currentPage
                              ? "bg-primary text-gray-800 font-bold border-primary"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    <button
                      disabled={currentPage >= totalPages}
                      onClick={() => setCurrentPage((p) => p + 1)}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50 transition"
                    >
                      Sau
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </Wrap>
    </div>
  );
}
