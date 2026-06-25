"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useCategoryStore } from "@/store/categoryStore";

export default function CategoriesPage() {
  const { categories, fetchCategories, loading, error } = useCategoryStore();

  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

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
            <li className="text-slate-800 font-semibold">Danh mục</li>
          </ol>
        </nav>

        {/* Heading */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
            Danh Mục Sản Phẩm
          </h1>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
            Khám phá các bộ sưu tập thời trang chất lượng cao từ TMF, được thiết kế để mang lại phong cách và sự thoải mái tối ưu.
          </p>
          <div className="mt-6 w-24 h-1 bg-yellow-400 mx-auto rounded-full"></div>
        </div>

        {/* State Indicators */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-slate-200 border-t-yellow-400 rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-500 font-medium">Đang tải danh mục...</p>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700 max-w-md mx-auto">
            <p className="font-semibold">{error}</p>
            <button
              onClick={() => void fetchCategories()}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Categories Grid */}
        {!loading && !error && (
          categories.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              Chưa có danh mục nào được hiển thị.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  href={`/category/${cat.slug}`}
                  className="group relative h-96 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 block bg-slate-900 border border-slate-100"
                >
                  {/* Category Image */}
                  <div className="absolute inset-0 w-full h-full">
                    <img
                      src={cat.imageCategory || "/placeholder.png"}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out opacity-80 group-hover:opacity-70"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                  </div>

                  {/* Content */}
                  <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col justify-end h-1/2 text-white">
                    <span className="text-yellow-400 text-xs font-semibold tracking-wider uppercase mb-1">
                      Bộ sưu tập {cat.sortOder}
                    </span>
                    <h2 className="text-2xl font-bold tracking-wide group-hover:translate-x-2 transition-transform duration-300">
                      {cat.name}
                    </h2>
                    <div className="mt-4 flex items-center text-sm font-semibold text-yellow-300 group-hover:text-white transition-colors">
                      Khám phá ngay
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-2 group-hover:translate-x-2 transition-transform duration-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )
        )}
      </div>
    </main>
  );
}
