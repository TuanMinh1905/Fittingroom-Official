"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useBlogStore } from "@/store/blogStore";

export default function BlogListingPage() {
  const { blogs, loading, error, fetchBlogs } = useBlogStore();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    void fetchBlogs();
  }, [fetchBlogs]);

  // Lọc bài viết theo từ khóa tìm kiếm
  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <li className="text-slate-800 font-semibold">Blog</li>
          </ol>
        </nav>

        {/* Header Banner */}
        <div className="relative rounded-3xl overflow-hidden mb-12 bg-slate-900 text-white shadow-xl border border-slate-800">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 to-indigo-950/90 z-10"></div>
          <div className="absolute -top-12 -left-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl z-0"></div>
          <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl z-0"></div>
          <div className="relative z-20 px-8 py-16 sm:px-12 sm:py-20 text-center">
            <span className="bg-yellow-400/20 text-yellow-300 text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full">
              TMF Magazine ✨
            </span>
            <h1 className="text-4xl font-extrabold sm:text-5xl tracking-tight mt-4 mb-3">
              Tạp Chí Thời Trang & Phong Cách
            </h1>
            <p className="text-lg text-slate-300 max-w-xl mx-auto font-light">
              Nơi cập nhật xu hướng thời trang hàng đầu, hướng dẫn phối đồ thông minh và bí quyết định hình phong cách cá nhân độc bản.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-12 relative">
          <input
            type="text"
            placeholder="Tìm kiếm bài viết thời trang..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-5 py-3.5 pl-12 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 bg-white text-slate-800 font-medium shadow-sm transition-all"
          />
          <svg
            className="absolute left-4 top-4 h-5 w-5 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-4 text-xs font-medium text-slate-400 hover:text-slate-600"
            >
              Xóa
            </button>
          )}
        </div>

        {/* State Indicators */}
        {loading && blogs.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm animate-pulse">
                <div className="w-full aspect-video bg-slate-200"></div>
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                  <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700 max-w-md mx-auto">
            <p className="font-semibold">{error}</p>
            <button
              onClick={() => void fetchBlogs()}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition-colors"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Blog Grid */}
        {!loading && !error && (
          filteredBlogs.length === 0 ? (
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
                  d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1m2 4a2 2 0 0 0-2-2v4a2 2 0 0 0 2-2m-2-2h-3m3 8H9"
                />
              </svg>
              <p className="text-slate-500 font-medium">Không tìm thấy bài viết nào phù hợp.</p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-4 px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold rounded-xl transition-all"
                >
                  Xóa bộ lọc tìm kiếm
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map((blog) => (
                <article
                  key={blog._id}
                  className="flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                >
                  {/* Thumbnail Image */}
                  <Link href={`/blog/${blog.slug}`} className="relative w-full aspect-video overflow-hidden block">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4 bg-slate-900/85 backdrop-blur-sm text-white text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-md">
                      Thời trang
                    </div>
                  </Link>

                  {/* Body Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="text-xs text-slate-400 mb-2 font-medium">
                      {blog.createdAt
                        ? new Date(blog.createdAt).toLocaleDateString("vi-VN", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "24 Tháng 6, 2026"}
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-yellow-600 transition-colors leading-snug line-clamp-2">
                      <Link href={`/blog/${blog.slug}`}>
                        {blog.title}
                      </Link>
                    </h3>
                    
                    <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed mb-4 flex-grow">
                      {blog.description}
                    </p>

                    <Link
                      href={`/blog/${blog.slug}`}
                      className="inline-flex items-center text-sm font-semibold text-slate-900 hover:text-yellow-600 transition-colors group/link"
                    >
                      Đọc bài viết
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1.5 transition-transform group-hover/link:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )
        )}
      </div>
    </main>
  );
}
