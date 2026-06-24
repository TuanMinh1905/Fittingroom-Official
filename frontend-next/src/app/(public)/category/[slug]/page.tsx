"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useProductStore } from "@/store/productStore";
import { useCategoryStore } from "@/store/categoryStore";
import ProductCard from "@/component/product/ProductCard";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function CategoryDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  const { categoryProducts, fetchProductsByCategory, loading, error } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();
  
  const [sortBy, setSortBy] = useState<string>("default");

  useEffect(() => {
    void fetchProductsByCategory(slug);
    if (categories.length === 0) {
      void fetchCategories();
    }
  }, [slug, fetchProductsByCategory, fetchCategories, categories.length]);

  // Find category details
  const currentCategory = categories.find((cat) => cat.slug === slug);
  const categoryName = currentCategory ? currentCategory.name : slug;

  // Handle sorting
  const getSortedProducts = () => {
    if (!categoryProducts) return [];
    const productsCopy = [...categoryProducts];
    
    switch (sortBy) {
      case "price-asc":
        return productsCopy.sort((a, b) => a.price - b.price);
      case "price-desc":
        return productsCopy.sort((a, b) => b.price - a.price);
      case "sold-desc":
        return productsCopy.sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
      case "rating-desc":
        return productsCopy.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      default:
        return productsCopy; // default ordering
    }
  };

  const sortedProducts = getSortedProducts();

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1200px] mx-auto">
        {/* Breadcrumb */}
        <nav className="text-sm font-medium text-slate-500 mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="hover:text-slate-800 transition-colors">
                Trang chủ
              </Link>
            </li>
            <li className="text-slate-400">/</li>
            <li>
              <Link href="/category" className="hover:text-slate-800 transition-colors">
                Danh mục
              </Link>
            </li>
            <li className="text-slate-400">/</li>
            <li className="text-slate-800 font-semibold capitalize">{categoryName}</li>
          </ol>
        </nav>

        {/* Category Header */}
        <div className="relative rounded-3xl overflow-hidden mb-12 bg-slate-900 text-white shadow-lg border border-slate-100">
          <div className="absolute inset-0 bg-slate-900/60 mix-blend-multiply z-10"></div>
          {currentCategory?.imageCategory && (
            <img
              src={currentCategory.imageCategory}
              alt={categoryName}
              className="absolute inset-0 w-full h-full object-cover opacity-35"
            />
          )}
          <div className="relative z-20 px-8 py-16 sm:px-12 sm:py-24 text-center sm:text-left">
            <h1 className="text-4xl font-extrabold sm:text-5xl capitalize tracking-tight">
              {categoryName}
            </h1>
            <p className="mt-4 text-lg text-slate-300 max-w-xl">
              Danh sách những sản phẩm thời trang chất lượng nhất thuộc danh mục {categoryName} cho boss cưng của bạn.
            </p>
          </div>
        </div>

        {/* Filters and Sorting Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 mb-8 gap-4">
          <div className="text-slate-600 font-medium">
            Có <span className="text-slate-900 font-semibold">{sortedProducts.length}</span> sản phẩm được tìm thấy
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <label htmlFor="sort" className="text-sm font-medium text-slate-500 whitespace-nowrap">
              Sắp xếp theo:
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-56 px-4 py-2 border border-slate-200 rounded-xl bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all cursor-pointer"
            >
              <option value="default">Mặc định</option>
              <option value="price-asc">Giá: Thấp đến Cao</option>
              <option value="price-desc">Giá: Cao đến Thấp</option>
              <option value="sold-desc">Bán chạy nhất</option>
              <option value="rating-desc">Đánh giá tốt nhất</option>
            </select>
          </div>
        </div>

        {/* State Indicators */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-slate-200 border-t-yellow-400 rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-500 font-medium">Đang tải sản phẩm...</p>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700 max-w-md mx-auto">
            <p className="font-semibold">{error}</p>
            <button
              onClick={() => void fetchProductsByCategory(slug)}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Product Grid */}
        {!loading && !error && (
          sortedProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-slate-300 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <p className="text-slate-500 font-medium">Không có sản phẩm nào thuộc danh mục này.</p>
              <Link
                href="/category"
                className="mt-4 inline-block px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold rounded-xl transition-all"
              >
                Xem danh mục khác
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )
        )}
      </div>
    </main>
  );
}
