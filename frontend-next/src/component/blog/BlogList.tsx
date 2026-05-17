"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useBlogStore } from "@/store/blogStore";

export default function BlogList() {
  const { blogs, loading, error, fetchBlogs } = useBlogStore();

  useEffect(() => {
    if (blogs.length === 0) {
      fetchBlogs();
    }
  }, [fetchBlogs, blogs.length]);

  if (loading && blogs.length === 0) {
    return (
      <div className="py-8 w-full max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-100 h-[300px] rounded-2xl w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  // Lấy 6 bài mới nhất để layout 2 dòng 3 cột đẹp nhất
  const displayBlogs = blogs.slice(0, 6);

  return (
    <section className="py-8 w-full max-w-7xl mx-auto px-4 mb-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold uppercase text-gray-800">
          Tạp chí Thời Trang <span className="text-xl">✨</span>
        </h2>
        <Link href="/blog" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
          Xem thêm <span>›</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayBlogs.map((blog) => (
          <Link
            key={blog._id}
            href={`/blog/${blog.slug}`}
            className="flex flex-col bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group"
          >
            {/* Ảnh thumbnail */}
            <div className="relative w-full aspect-video overflow-hidden">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            
            {/* Nội dung bài viết */}
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">
                {blog.title}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-3">
                {blog.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
