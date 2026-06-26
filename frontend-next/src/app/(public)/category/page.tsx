"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useCategoryStore } from "@/store/categoryStore";

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
  const { categories, fetchCategories, loading, error } = useCategoryStore();

  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

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
        <div className="relative mb-16 text-center max-w-3xl mx-auto">
          <div className="absolute inset-0 -top-6 flex items-center justify-center opacity-[0.03] select-none pointer-events-none">
            <span className="text-[120px] font-black tracking-widest uppercase">COLLECTIONS</span>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 tracking-widest uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-ping"></span>
            TMF Boutique
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none mb-6">
            Khám Phá <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-indigo-600">Danh Mục</span> Thời Trang
          </h1>
          <p className="text-base md:text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto">
            Tìm kiếm mảnh ghép hoàn hảo cho phong cách cá nhân của bạn. Mỗi danh mục là một bộ sưu tập được giám tuyển kỹ lưỡng từ chất liệu đến thiết kế.
          </p>
          <div className="mt-8 flex justify-center gap-1">
            <span className="w-10 h-1 bg-[var(--primary)] rounded-full"></span>
            <span className="w-2.5 h-1 bg-indigo-600 rounded-full"></span>
            <span className="w-1.5 h-1 bg-slate-300 rounded-full"></span>
          </div>
        </div>

        {/* State Indicators */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="relative h-96 rounded-[32px] overflow-hidden bg-slate-100 animate-pulse border border-slate-100/50 flex flex-col justify-end p-8"
              >
                <div className="h-4 bg-slate-200 rounded w-1/4 mb-3"></div>
                <div className="h-8 bg-slate-200 rounded w-2/3 mb-4"></div>
                <div className="h-4 bg-slate-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="rounded-3xl border border-red-100 bg-red-50/50 backdrop-blur-sm p-8 text-center text-red-600 max-w-md mx-auto shadow-sm">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">!</div>
            <p className="font-semibold text-slate-800 mb-2">Đã xảy ra lỗi tải danh mục</p>
            <p className="text-sm text-red-500/80 mb-6">{error}</p>
            <button
              onClick={() => void fetchCategories()}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-red-200 cursor-pointer"
            >
              Thử tải lại
            </button>
          </div>
        )}

        {/* Categories Grid */}
        {!loading && !error && (
          categories.length === 0 ? (
            <div className="text-center py-24 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 text-slate-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <p className="font-medium text-slate-600">Chưa có danh mục sản phẩm nào được thiết lập.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((cat) => {
                const style = CATEGORY_STYLES[cat.slug] || {
                  tag: `BỘ SƯU TẬP #${cat.sortOder}`,
                  subtitle: "Thời trang cao cấp & phong cách đa dạng",
                  badgeBg: "bg-slate-800 text-white",
                };

                return (
                  <Link
                    key={cat._id}
                    href={`/category/${cat.slug}`}
                    className="group relative h-[420px] rounded-[32px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] border border-slate-100 transition-all duration-500 ease-out block bg-slate-900"
                  >
                    {/* Background Category Image */}
                    <div className="absolute inset-0 w-full h-full">
                      <img
                        src={cat.imageCategory || "/placeholder.png"}
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-[0.85] group-hover:opacity-75"
                      />
                      {/* Gradient Overlay for text contrast */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                    </div>

                    {/* Badge and Tag */}
                    <div className="absolute top-6 left-6 z-10 flex flex-col items-start gap-2">
                      <span className={`text-[10px] font-bold tracking-widest px-3 py-1 rounded-full uppercase ${style.badgeBg} shadow-sm`}>
                        {style.tag}
                      </span>
                    </div>

                    {/* Card Content Overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col justify-end h-3/5 text-white z-10">
                      <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2 group-hover:translate-x-1 transition-transform duration-300">
                        {cat.name}
                      </h2>
                      <p className="text-xs md:text-sm text-slate-200/90 leading-relaxed mb-6 font-medium max-w-[90%] opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-500 ease-out">
                        {style.subtitle}
                      </p>
                      
                      {/* Interactive discovery bar */}
                      <div className="flex items-center text-xs font-bold text-white uppercase tracking-wider">
                        <span className="relative pb-1">
                          Khám phá bộ sưu tập
                          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--primary)] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                        </span>
                        <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-[var(--primary)] backdrop-blur-sm ml-3 flex items-center justify-center transition-all duration-300 shadow-inner">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform duration-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )
        )}
      </div>
    </main>
  );
}

