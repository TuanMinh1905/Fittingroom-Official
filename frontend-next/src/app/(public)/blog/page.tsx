"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useBlogStore } from "@/store/blogStore";

// Các danh mục được định nghĩa động
const CATEGORIES = [
  "Tất cả",
  "Bí quyết Phối đồ",
  "Giày & Sneakers",
  "Bảo quản & Dọn dẹp",
  "Xu hướng & Đời sống",
];

// Hàm lấy thông tin danh mục dựa vào slug bài viết
const getCategoryInfo = (slug: string) => {
  if (slug.includes("phoi-do") || slug.includes("oversize")) {
    return {
      name: "Bí quyết Phối đồ",
      color: "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30",
    };
  }
  if (slug.includes("sneaker") || slug.includes("giay")) {
    return {
      name: "Giày & Sneakers",
      color: "bg-sky-50 text-sky-700 border-sky-100 dark:bg-sky-950/20 dark:text-sky-400 dark:border-sky-900/30",
    };
  }
  if (slug.includes("bao-quan") || slug.includes("lon-xon") || slug.includes("tu-do")) {
    return {
      name: "Bảo quản & Dọn dẹp",
      color: "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30",
    };
  }
  return {
    name: "Xu hướng & Đời sống",
    color: "bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/30",
  };
};

// Hàm tính thời gian đọc ước tính dựa vào số từ
const getReadingTime = (text: string) => {
  const words = text ? text.split(/\s+/).length : 0;
  const minutes = Math.ceil(words / 15); // Ước tính từ độ dài mô tả ngắn
  return minutes > 0 ? minutes : 2;
};

export default function BlogListingPage() {
  const { blogs, loading, error, fetchBlogs } = useBlogStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  useEffect(() => {
    void fetchBlogs();
  }, [fetchBlogs]);

  // Lọc bài viết theo danh mục & từ khóa tìm kiếm
  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedCategory === "Tất cả") return matchesSearch;

    const categoryInfo = getCategoryInfo(blog.slug);
    return matchesSearch && categoryInfo.name === selectedCategory;
  });

  // Tách bài viết nổi bật (bài viết đầu tiên khi không tìm kiếm/lọc cụ thể)
  const isDefaultView = selectedCategory === "Tất cả" && searchQuery === "";
  const featuredBlog = isDefaultView && filteredBlogs.length > 0 ? filteredBlogs[0] : null;
  const displayBlogs = featuredBlog ? filteredBlogs.slice(1) : filteredBlogs;

  return (
    <main className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8 font-monasans">
      {/* Background Decorative Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#5DADE2]/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-indigo-400/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="max-w-[1200px] mx-auto">
        {/* Breadcrumb */}
        <nav className="text-xs font-semibold tracking-wider text-slate-400 mb-8 uppercase" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="hover:text-[#5DADE2] transition-colors">
                Trang chủ
              </Link>
            </li>
            <li className="text-slate-300">/</li>
            <li className="text-slate-600">Blog</li>
          </ol>
        </nav>

        {/* Header Banner */}
        <div className="relative rounded-3xl overflow-hidden mb-12 bg-slate-950 text-white shadow-xl border border-slate-900">
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/95 to-[#5DADE2]/20 z-10"></div>
          {/* Animated Glowing Orbs inside Banner */}
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-[#5DADE2]/10 rounded-full blur-3xl z-0 animate-pulse"></div>
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl z-0 animate-pulse" style={{ animationDelay: '2s' }}></div>
          
          <div className="relative z-20 px-6 py-16 sm:px-16 sm:py-24 text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md text-[#5DADE2] text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/10 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5DADE2] animate-ping"></span>
              TMF Magazine & Editorial
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-white leading-tight">
              Tạp Chí <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5DADE2] to-sky-300">Thời Trang</span> & Phong Cách
            </h1>
            <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed max-w-xl mx-auto">
              Nơi cập nhật xu hướng thời trang hàng đầu, hướng dẫn phối đồ thông minh và bí quyết định hình phong cách cá nhân độc bản.
            </p>
          </div>
        </div>

        {/* Search & Categories Bar */}
        <div className="flex flex-col gap-6 mb-12">
          {/* Search Input */}
          <div className="max-w-md mx-auto w-full relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm bài viết, xu hướng phối đồ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-12 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5DADE2]/50 focus:border-[#5DADE2] bg-white text-slate-800 text-sm font-medium shadow-sm transition-all placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-3.5 p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Categories Pills Filter */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {CATEGORIES.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide border transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "bg-[#5DADE2] border-[#5DADE2] text-white shadow-md shadow-[#5DADE2]/20 scale-105"
                      : "bg-white hover:bg-slate-50 border-slate-200 text-slate-600"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* State Indicators */}
        {loading && blogs.length === 0 && (
          <div className="space-y-12 py-8 animate-pulse">
            {/* Featured Post Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white border border-slate-200 rounded-3xl overflow-hidden h-[420px]">
              <div className="lg:col-span-7 bg-slate-200 h-full"></div>
              <div className="lg:col-span-5 p-8 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                  <div className="h-8 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                </div>
                <div className="h-10 bg-slate-200 rounded w-1/3"></div>
              </div>
            </div>
            {/* Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm h-[400px]">
                  <div className="w-full aspect-[16/10] bg-slate-200"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                    <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-3xl border border-red-100 bg-red-50/50 backdrop-blur-sm p-8 text-center max-w-md mx-auto shadow-sm">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-slate-800 font-bold mb-1">Không thể tải dữ liệu</h3>
            <p className="text-slate-500 text-xs mb-5 leading-relaxed">{error}</p>
            <button
              onClick={() => void fetchBlogs()}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            >
              Thử tải lại trang
            </button>
          </div>
        )}

        {/* Blog Listings */}
        {!loading && !error && (
          filteredBlogs.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm max-w-lg mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-slate-300 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.25"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1m2 4a2 2 0 0 0-2-2v4a2 2 0 0 0 2-2m-2-2h-3m3 8H9"
                />
              </svg>
              <p className="text-slate-600 font-bold text-base mb-1">Không tìm thấy bài viết</p>
              <p className="text-slate-400 text-xs mb-6 px-4">Hãy thử tìm kiếm từ khóa khác hoặc chuyển danh mục bài viết.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("Tất cả");
                }}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-all cursor-pointer"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Featured Post Card */}
              {featuredBlog && (
                <article className="grid grid-cols-1 lg:grid-cols-12 bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group">
                  {/* Thumbnail Image */}
                  <Link href={`/blog/${featuredBlog.slug}`} className="lg:col-span-7 relative w-full aspect-video lg:aspect-auto lg:h-[420px] overflow-hidden block">
                    <img
                      src={featuredBlog.image}
                      alt={featuredBlog.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent z-10"></div>
                    <div className="absolute top-6 left-6 z-20">
                      <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm border ${getCategoryInfo(featuredBlog.slug).color}`}>
                        {getCategoryInfo(featuredBlog.slug).name}
                      </span>
                    </div>
                  </Link>

                  {/* Body Content */}
                  <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold mb-4 uppercase tracking-wider">
                        <span>
                          {featuredBlog.createdAt
                            ? new Date(featuredBlog.createdAt).toLocaleDateString("vi-VN", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                            : "24 Tháng 6, 2026"}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <span>🕒 {getReadingTime(featuredBlog.description)} phút đọc</span>
                        <span className="ml-auto bg-amber-100 text-amber-800 text-[9px] font-extrabold px-2 py-0.5 rounded">HOT ✨</span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-4 group-hover:text-[#5DADE2] transition-colors leading-snug">
                        <Link href={`/blog/${featuredBlog.slug}`}>{featuredBlog.title}</Link>
                      </h3>

                      <p className="text-sm text-slate-500 font-light leading-relaxed mb-6 line-clamp-4">
                        {featuredBlog.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                          T
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-800">TMF Editor</div>
                          <div className="text-[10px] text-slate-400 font-medium">Ban Biên Tập TMF</div>
                        </div>
                      </div>

                      <Link
                        href={`/blog/${featuredBlog.slug}`}
                        className="inline-flex items-center text-xs font-bold text-[#5DADE2] hover:text-[#5DADE2]/80 transition-colors group/link"
                      >
                        Đọc bài viết
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3.5 w-3.5 ml-1.5 transition-transform group-hover/link:translate-x-1.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </article>
              )}

              {/* Standard Blog Grid */}
              {displayBlogs.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {displayBlogs.map((blog) => {
                    const catInfo = getCategoryInfo(blog.slug);
                    const readTime = getReadingTime(blog.description);
                    return (
                      <article
                        key={blog._id}
                        className="flex flex-col bg-white border border-slate-100 rounded-3xl overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 group h-full"
                      >
                        {/* Thumbnail Image */}
                        <Link href={`/blog/${blog.slug}`} className="relative w-full aspect-[16/10] overflow-hidden block">
                          <img
                            src={blog.image}
                            alt={blog.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ease-out"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent z-10"></div>
                          <div className="absolute top-4 left-4 z-20">
                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider shadow-sm border ${catInfo.color}`}>
                              {catInfo.name}
                            </span>
                          </div>
                        </Link>

                        {/* Body Content */}
                        <div className="p-6 flex flex-col flex-grow justify-between">
                          <div>
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold mb-3 uppercase tracking-wider">
                              <span>
                                {blog.createdAt
                                  ? new Date(blog.createdAt).toLocaleDateString("vi-VN", {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    })
                                  : "24 Tháng 6, 2026"}
                              </span>
                              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                              <span>🕒 {readTime} phút đọc</span>
                            </div>

                            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mb-2.5 group-hover:text-[#5DADE2] transition-colors leading-snug line-clamp-2">
                              <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
                            </h3>

                            <p className="text-xs sm:text-sm text-slate-500 font-light leading-relaxed mb-5 line-clamp-3">
                              {blog.description}
                            </p>
                          </div>

                          <div className="border-t border-slate-50 pt-4 flex items-center justify-between mt-auto">
                            <div className="flex items-center gap-2">
                              <div className="h-7 w-7 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                T
                              </div>
                              <span className="text-[10px] font-bold text-slate-600">TMF Editor</span>
                            </div>

                            <Link
                              href={`/blog/${blog.slug}`}
                              className="inline-flex items-center text-xs font-bold text-[#5DADE2] hover:text-[#5DADE2]/80 transition-colors group/link"
                            >
                              Xem thêm
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3 ml-1 transition-transform group-hover/link:translate-x-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2.5"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                              </svg>
                            </Link>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          )
        )}
      </div>
    </main>
  );
}

