"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useCategoryStore } from "@/store/categoryStore";
import { useProductStore } from "@/store/productStore";
import ProductCard from "@/component/product/ProductCard";

// Helper map to give each category a stylish fashion look
const CATEGORY_STYLES: Record<string, { tag: string; subtitle: string; badgeBg: string }> = {
  ao: {
    tag: "TRENDING NOW",
    subtitle: "Áo thun, sơ mi & áo khoác thời thượng",
    badgeBg: "bg-amber-500 text-white",
  },
  quan: {
    tag: "NEW SEASON",
    subtitle: "Quần jean, khaki & âu ống rộng phong cách",
    badgeBg: "bg-indigo-600 text-white",
  },
  giay: {
    tag: "EXCLUSIVE",
    subtitle: "Giày sneaker, loafer & chelsea boot đẳng cấp",
    badgeBg: "bg-rose-500 text-white",
  },
  mu: {
    tag: "MUST HAVE",
    subtitle: "Mũ lưỡi trai, bucket & len cá tính",
    badgeBg: "bg-emerald-600 text-white",
  },
  tat: {
    tag: "DAILY COMFORT",
    subtitle: "Vớ gân, tất thể thao & lót lụa êm ái",
    badgeBg: "bg-sky-500 text-white",
  },
  "phu-kien": {
    tag: "FINISHING TOUCH",
    subtitle: "Thắt lưng da, kính râm & trang sức cao cấp",
    badgeBg: "bg-purple-600 text-white",
  },
};

export default function CategoriesPage() {
  const { categories, fetchCategories, loading: categoryLoading, error: categoryError } = useCategoryStore();
  const { categoryProducts, fetchProductsByCategory, fetchProductsByCategoryGroup, loading: productLoading, error: productError } = useProductStore();

  const [selectedSlug, setSelectedSlug] = useState<string>("");
  const [selectedSubSlug, setSelectedSubSlug] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("default");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [minRating, setMinRating] = useState<number>(0);
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  // Lọc ra chỉ parent categories (không có parentSlug) để hiển thị hàng icon chính
  const parentCategories = useMemo(() => {
    return categories.filter((cat) => !cat.parentSlug);
  }, [categories]);

  // Lấy subcategories của category đang chọn
  const subcategories = useMemo(() => {
    if (!selectedSlug) return [];
    return categories.filter((cat) => cat.parentSlug === selectedSlug).sort((a, b) => a.sortOder - b.sortOder);
  }, [categories, selectedSlug]);

  // Set default category slug when categories are loaded
  useEffect(() => {
    if (parentCategories.length > 0 && !selectedSlug) {
      setSelectedSlug(parentCategories[0].slug);
    }
  }, [parentCategories, selectedSlug]);

  // Reset filters when switching category
  const handleResetFilters = () => {
    setSearchQuery("");
    setPriceRange("all");
    setSelectedBrand("all");
    setMinRating(0);
    setSortBy("default");
  };

  // Fetch products when selected category or subcategory changes
  useEffect(() => {
    if (selectedSlug) {
      if (selectedSubSlug === "all") {
        // Lấy tất cả sản phẩm của parent category (bao gồm subcategories)
        void fetchProductsByCategoryGroup(selectedSlug);
      } else {
        // Lấy sản phẩm của subcategory cụ thể
        void fetchProductsByCategory(selectedSubSlug);
      }
      handleResetFilters();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSlug, selectedSubSlug, fetchProductsByCategoryGroup, fetchProductsByCategory]);

  // Reset subcategory khi chuyển parent category
  const handleSelectParent = (slug: string) => {
    setSelectedSlug(slug);
    setSelectedSubSlug("all");
  };

  const currentCategory = categories.find((cat) => cat.slug === selectedSlug);
  const categoryName = currentCategory ? currentCategory.name : "";
  const currentStyle = selectedSlug ? (CATEGORY_STYLES[selectedSlug] || {
    tag: "COLLECTION",
    subtitle: "Thời trang cao cấp & phong cách đa dạng",
    badgeBg: "bg-slate-800 text-white",
  }) : null;

  // Extract unique brands dynamically from category products
  const uniqueBrands = useMemo(() => {
    if (!categoryProducts) return [];
    const brands = categoryProducts
      .map((p) => p.brand || "TMF Store")
      .filter((b, index, self) => self.indexOf(b) === index);
    return brands;
  }, [categoryProducts]);

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
  const processedProducts = useMemo(() => {
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
        items.sort((a, b) => {
          const priceA = a.discountPrice || a.price;
          const priceB = b.discountPrice || b.price;
          return priceA - priceB;
        });
        break;
      case "price-desc":
        items.sort((a, b) => {
          const priceA = a.discountPrice || a.price;
          const priceB = b.discountPrice || b.price;
          return priceB - priceA;
        });
        break;
      case "sold-desc":
        items.sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
        break;
      case "rating-desc":
        items.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        break;
    }
    return items;
  }, [categoryProducts, searchQuery, priceRange, selectedBrand, minRating, sortBy]);

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
                  ? "bg-[var(--primary)]/10 text-[var(--primary)] font-semibold"
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
                  ? "bg-[var(--primary)]/10 text-[var(--primary)] font-semibold"
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
                    ? "bg-[var(--primary)]/10 text-[var(--primary)] font-semibold"
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
                  ? "bg-[var(--primary)]/10 text-[var(--primary)] font-semibold"
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
            <li className="text-slate-800 font-bold">Danh mục</li>
          </ol>
        </nav>

        {/* Heading Editorial Section */}
        <div className="relative mb-8 text-center max-w-3xl mx-auto">
          <div className="absolute inset-0 -top-6 flex items-center justify-center opacity-[0.03] select-none pointer-events-none">
            <span className="text-[120px] font-black tracking-widest uppercase">COLLECTIONS</span>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 tracking-widest uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-ping"></span>
            TMF Boutique
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none mb-4">
            Khám Phá <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-indigo-600">Danh Mục</span> Thời Trang
          </h1>
          <p className="text-base text-slate-500 leading-relaxed max-w-2xl mx-auto">
            Chọn danh mục thời trang bên dưới để khám phá ngay những thiết kế độc bản phù hợp nhất với phong cách cá nhân của bạn.
          </p>
        </div>

        {/* Category Row (Small horizontal circular icons) */}
        {categoryLoading && (
          <div className="flex justify-center space-x-8 py-6 mb-8 border-b border-slate-100">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2 animate-pulse shrink-0">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-slate-100"></div>
                <div className="h-4 bg-slate-100 rounded w-12"></div>
              </div>
            ))}
          </div>
        )}

        {categoryError && (
          <div className="rounded-3xl border border-red-100 bg-red-50/50 backdrop-blur-sm p-8 text-center text-red-600 max-w-md mx-auto shadow-sm mb-8">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">!</div>
            <p className="font-semibold text-slate-800 mb-2">Đã xảy ra lỗi tải danh mục</p>
            <p className="text-sm text-red-500/80 mb-6">{categoryError}</p>
            <button
              onClick={() => void fetchCategories()}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-red-200 cursor-pointer"
            >
              Thử tải lại
            </button>
          </div>
        )}

        {!categoryLoading && !categoryError && parentCategories.length > 0 && (
          <>
            {/* Parent Category Row */}
            <div className="flex items-center space-x-6 md:space-x-8 overflow-x-auto py-6 justify-start md:justify-center scrollbar-none border-b border-slate-100 pb-8">
              {parentCategories.map((cat) => {
                const isSelected = selectedSlug === cat.slug;
                return (
                  <button
                    key={cat._id}
                    onClick={() => handleSelectParent(cat.slug)}
                    className="flex flex-col items-center gap-2 cursor-pointer group focus:outline-none shrink-0"
                  >
                    <div className={`relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 transition-all duration-300 p-[2px] bg-white ${
                      isSelected 
                        ? "border-[var(--primary)] ring-2 ring-[var(--primary)]/20 ring-offset-2 scale-105 shadow-md" 
                        : "border-slate-200 group-hover:border-slate-400 group-hover:scale-105"
                    }`}>
                      <img
                        src={cat.imageCategory || "/placeholder.png"}
                        alt={cat.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                      <div className="absolute inset-0 bg-slate-950/5 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-full"></div>
                    </div>
                    <span className={`text-xs md:text-sm tracking-wide transition-colors duration-200 ${
                      isSelected 
                        ? "text-[var(--primary)] font-bold" 
                        : "text-slate-600 group-hover:text-slate-900 font-semibold"
                    }`}>
                      {cat.name}
                    </span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] -mt-1 animate-pulse"></span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Subcategory Tabs (chỉ hiện khi parent có subcategories) */}
            {subcategories.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto py-4 mb-6 justify-start md:justify-center scrollbar-none">
                <button
                  onClick={() => setSelectedSubSlug("all")}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap border ${
                    selectedSubSlug === "all"
                      ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-md shadow-blue-100"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:text-slate-900"
                  }`}
                >
                  Tất cả {categoryName}
                </button>
                {subcategories.map((sub) => (
                  <button
                    key={sub._id}
                    onClick={() => setSelectedSubSlug(sub.slug)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap border ${
                      selectedSubSlug === sub.slug
                        ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-md shadow-blue-100"
                        : "bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:text-slate-900"
                    }`}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {/* Selected Category Listing Section */}
        {selectedSlug && currentCategory && (
          <div>
            {/* Editorial Category Header Banner */}
            <div className="relative rounded-3xl overflow-hidden mb-12 bg-slate-900 text-white shadow-xl border border-slate-100 min-h-[180px] flex items-center">
              <div className="absolute inset-0 bg-slate-950/40 mix-blend-multiply z-10"></div>
              {currentCategory.imageCategory && (
                <img
                  src={currentCategory.imageCategory}
                  alt={categoryName}
                  className="absolute inset-0 w-full h-full object-cover opacity-45"
                />
              )}
              <div className="relative z-20 px-8 py-10 sm:px-12 sm:py-12 text-center sm:text-left">
                <span className={`text-[10px] font-extrabold tracking-widest px-3 py-1 rounded-full uppercase ${currentStyle?.badgeBg}`}>
                  {currentStyle?.tag}
                </span>
                <h2 className="text-3xl sm:text-5xl font-black capitalize tracking-tight mt-3 mb-4 leading-none">
                  {categoryName}
                </h2>
                <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                  {currentStyle?.subtitle}
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
                {productLoading && (
                  <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="animate-pulse bg-slate-100 h-[380px] md:h-[400px] rounded-2xl border border-slate-100"></div>
                    ))}
                  </div>
                )}

                {/* Error Indicator */}
                {productError && (
                  <div className="rounded-2xl border border-red-100 bg-red-50/50 p-8 text-center text-red-700 max-w-md mx-auto shadow-sm">
                    <p className="font-semibold mb-2">Không thể tải sản phẩm</p>
                    <p className="text-sm text-red-600/80 mb-6">{productError}</p>
                    <button
                      onClick={() => void fetchProductsByCategory(selectedSlug)}
                      className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition-colors"
                    >
                      Thử lại
                    </button>
                  </div>
                )}

                {/* Product Grid & Empty States */}
                {!productLoading && !productError && (
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
                        Thử thay đổi bộ lọc hoặc tìm từ khóa khác để có kết quả chính xác hơn.
                      </p>
                      {activeFiltersCount > 0 && (
                        <button
                          onClick={handleResetFilters}
                          className="px-6 py-2.5 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white font-bold rounded-xl transition-all shadow-md shadow-blue-100 cursor-pointer"
                        >
                          Đặt lại bộ lọc
                        </button>
                      )}
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
        )}
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


