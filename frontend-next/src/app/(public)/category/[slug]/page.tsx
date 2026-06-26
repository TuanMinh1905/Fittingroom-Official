"use client";

import React, { useEffect, useState, use, useMemo } from "react";
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
  
  // Sorting & Filtering state
  const [sortBy, setSortBy] = useState<string>("default");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [minRating, setMinRating] = useState<number>(0);
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  useEffect(() => {
    void fetchProductsByCategory(slug);
    if (categories.length === 0) {
      void fetchCategories();
    }
  }, [slug, fetchProductsByCategory, fetchCategories, categories.length]);

  // Find category details
  const currentCategory = categories.find((cat) => cat.slug === slug);
  const categoryName = currentCategory ? currentCategory.name : slug;

  // Extract unique brands dynamically from category products
  const uniqueBrands = useMemo(() => {
    if (!categoryProducts) return [];
    const brands = categoryProducts
      .map((p) => p.brand || "TMF Store")
      .filter((b, index, self) => self.indexOf(b) === index);
    return brands;
  }, [categoryProducts]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setPriceRange("all");
    setSelectedBrand("all");
    setMinRating(0);
    setSortBy("default");
  };

  // Get active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchQuery.trim() !== "") count++;
    if (priceRange !== "all") count++;
    if (selectedBrand !== "all") count++;
    if (minRating > 0) count++;
    return count;
  }, [searchQuery, priceRange, selectedBrand, minRating]);

  // Handle sorting and filtering
  const getProcessedProducts = () => {
    if (!categoryProducts) return [];
    let items = [...categoryProducts];

    // 1. Filter by Search Query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim();
      items = items.filter((p) => p.name.toLowerCase().includes(query));
    }

    // 2. Filter by Price Range
    if (priceRange !== "all") {
      items = items.filter((p) => {
        const actualPrice = p.discountPrice || p.price;
        if (priceRange === "under-200") {
          return actualPrice < 200000;
        } else if (priceRange === "200-500") {
          return actualPrice >= 200000 && actualPrice <= 500000;
        } else if (priceRange === "above-500") {
          return actualPrice > 500000;
        }
        return true;
      });
    }

    // 3. Filter by Brand
    if (selectedBrand !== "all") {
      items = items.filter((p) => (p.brand || "TMF Store") === selectedBrand);
    }

    // 4. Filter by Rating
    if (minRating > 0) {
      items = items.filter((p) => (p.rating || 0) >= minRating);
    }

    // 5. Sort Products
    switch (sortBy) {
      case "price-asc":
        return items.sort((a, b) => {
          const priceA = a.discountPrice || a.price;
          const priceB = b.discountPrice || b.price;
          return priceA - priceB;
        });
      case "price-desc":
        return items.sort((a, b) => {
          const priceA = a.discountPrice || a.price;
          const priceB = b.discountPrice || b.price;
          return priceB - priceA;
        });
      case "sold-desc":
        return items.sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
      case "rating-desc":
        return items.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      default:
        return items; // default ordering
    }
  };

  const processedProducts = getProcessedProducts();

  // Helper function to render filter fields
  const renderFiltersContent = () => (
    <div className="space-y-6">
      {/* Search Filter */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">Tìm kiếm</h3>
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
          />
          <svg className="absolute left-3 top-3 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* Price Presets */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">Khoảng giá</h3>
        <div className="flex flex-col gap-2">
          {[
            { label: "Tất cả", value: "all" },
            { label: "Dưới 200,000 đ", value: "under-200" },
            { label: "200,000 đ - 500,000 đ", value: "200-500" },
            { label: "Trên 500,000 đ", value: "above-500" },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setPriceRange(item.value)}
              className={`text-left px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                priceRange === item.value
                  ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                  : "hover:bg-slate-50 text-slate-600"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* Brand Selector */}
      {uniqueBrands.length > 0 && (
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">Thương hiệu</h3>
          <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
            <button
              onClick={() => setSelectedBrand("all")}
              className={`text-left px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedBrand === "all"
                  ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                  : "hover:bg-slate-50 text-slate-600"
              }`}
            >
              Tất cả thương hiệu
            </button>
            {uniqueBrands.map((brand) => (
              <button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className={`text-left px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedBrand === brand
                    ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                    : "hover:bg-slate-50 text-slate-600"
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>
      )}

      {uniqueBrands.length > 0 && <hr className="border-slate-100" />}

      {/* Rating Filter */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">Đánh giá</h3>
        <div className="flex flex-col gap-2">
          {[
            { label: "Tất cả", value: 0 },
            { label: "4 ★ trở lên", value: 4 },
            { label: "3 ★ trở lên", value: 3 },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setMinRating(item.value)}
              className={`text-left px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
                minRating === item.value
                  ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                  : "hover:bg-slate-50 text-slate-600"
              }`}
            >
              {item.value > 0 ? (
                <span className="flex items-center text-yellow-500 font-semibold gap-1">
                  <span>{item.label}</span>
                </span>
              ) : (
                <span>Tất cả đánh giá</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {activeFiltersCount > 0 && (
        <>
          <hr className="border-slate-100" />
          <button
            onClick={handleResetFilters}
            className="w-full py-2.5 text-center text-xs font-bold uppercase tracking-wider text-red-500 border border-red-200 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
          >
            Xóa bộ lọc ({activeFiltersCount})
          </button>
        </>
      )}
    </div>
  );

  return (
    <main className="min-h-screen bg-white py-10 px-4 sm:px-6 lg:px-8 font-monasans">
      <div className="max-w-[1200px] mx-auto">
        {/* Breadcrumb */}
        <nav className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="hover:text-[var(--primary)] transition-colors">
                Trang chủ
              </Link>
            </li>
            <li className="text-slate-300">/</li>
            <li>
              <Link href="/category" className="hover:text-[var(--primary)] transition-colors">
                Danh mục
              </Link>
            </li>
            <li className="text-slate-300">/</li>
            <li className="text-slate-800 font-bold capitalize">{categoryName}</li>
          </ol>
        </nav>

        {/* Editorial Category Header Banner */}
        <div className="relative rounded-3xl overflow-hidden mb-12 bg-slate-900 text-white shadow-xl border border-slate-100 min-h-[220px] flex items-center">
          <div className="absolute inset-0 bg-slate-950/40 mix-blend-multiply z-10"></div>
          {currentCategory?.imageCategory && (
            <img
              src={currentCategory.imageCategory}
              alt={categoryName}
              className="absolute inset-0 w-full h-full object-cover opacity-45"
            />
          )}
          <div className="relative z-20 px-8 py-12 sm:px-12 sm:py-16 text-center sm:text-left">
            <span className="text-[10px] font-extrabold tracking-widest bg-[var(--primary)] text-white px-3 py-1 rounded-full uppercase">
              BỘ SƯU TẬP
            </span>
            <h1 className="text-3xl sm:text-5xl font-black capitalize tracking-tight mt-3 mb-4 leading-none">
              {categoryName}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
              Bộ sưu tập các trang phục cao cấp và phụ kiện thời thượng thuộc danh mục {categoryName}, giúp định hình phong cách độc bản.
            </p>
          </div>
        </div>

        {/* Filters and Sorting Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-100 mb-8 gap-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)]">
          <div className="text-sm text-slate-600 font-semibold self-start sm:self-center">
            Tìm thấy <span className="text-slate-950 font-bold">{processedProducts.length}</span> sản phẩm
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-xl bg-white text-slate-700 text-sm font-semibold shadow-sm hover:bg-slate-50 transition-all cursor-pointer"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 8.293A1 1 0 013 7.586V4z" />
              </svg>
              Bộ lọc {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label htmlFor="sort" className="text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap hidden sm:inline">
                Sắp xếp:
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-48 px-3.5 py-2 text-sm border border-slate-200 rounded-xl bg-white text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all cursor-pointer shadow-sm"
              >
                <option value="default">Mặc định</option>
                <option value="price-asc">Giá: Thấp đến Cao</option>
                <option value="price-desc">Giá: Cao đến Thấp</option>
                <option value="sold-desc">Bán chạy nhất</option>
                <option value="rating-desc">Đánh giá tốt nhất</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Grid Layout (Sidebar Filters + Products) */}
        <div className="flex gap-8 items-start">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block w-64 shrink-0 bg-slate-50/50 p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">Bộ lọc tìm kiếm</h2>
              <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            {renderFiltersContent()}
          </aside>

          {/* Product Grid Area */}
          <div className="flex-grow">
            {/* Loading Indicator */}
            {loading && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-slate-100 h-[380px] md:h-[400px] rounded-2xl border border-slate-100"></div>
                ))}
              </div>
            )}

            {/* Error Indicator */}
            {error && (
              <div className="rounded-2xl border border-red-100 bg-red-50/50 p-8 text-center text-red-700 max-w-md mx-auto shadow-sm">
                <p className="font-semibold mb-2">Không thể tải sản phẩm</p>
                <p className="text-sm text-red-600/80 mb-6">{error}</p>
                <button
                  onClick={() => void fetchProductsByCategory(slug)}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition-colors"
                >
                  Thử lại
                </button>
              </div>
            )}

            {/* Product Grid & Empty States */}
            {!loading && !error && (
              processedProducts.length === 0 ? (
                <div className="text-center py-20 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
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
                  <p className="text-slate-700 font-bold text-lg mb-1">Không tìm thấy sản phẩm nào</p>
                  <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto px-4">
                    Thử thay đổi bộ lọc, tìm từ khóa khác hoặc bấm nút bên dưới để xem toàn bộ sản phẩm của danh mục.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="px-6 py-2.5 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white font-bold rounded-xl transition-all shadow-md shadow-blue-100 cursor-pointer"
                  >
                    Đặt lại bộ lọc
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {processedProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Slide-over Filter Panel */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm transition-opacity duration-300 ease-out"
            onClick={() => setShowMobileFilters(false)}
          />
          
          {/* Drawer Content */}
          <div className="relative w-full max-w-xs h-full bg-white shadow-2xl p-6 overflow-y-auto flex flex-col justify-between z-10 animate-in slide-in-from-right duration-300">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-base font-extrabold uppercase tracking-wider text-slate-800">Bộ lọc sản phẩm</h2>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-1 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {renderFiltersContent()}
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100">
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full py-3 bg-[var(--primary)] text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all text-sm cursor-pointer"
              >
                Áp dụng bộ lọc
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
