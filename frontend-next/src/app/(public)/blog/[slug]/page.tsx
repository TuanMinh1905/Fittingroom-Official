"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useBlogStore, Blog } from "@/store/blogStore";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function BlogDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  const router = useRouter();
  const { blogs, fetchBlogs, fetchBlogBySlug } = useBlogStore();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      // Tải tất cả các blog để phục vụ cho danh sách bài viết liên quan
      if (blogs.length === 0) {
        await fetchBlogs();
      }

      const details = await fetchBlogBySlug(slug);
      if (!active) return;

      if (details) {
        setBlog(details);
      } else {
        setError("Không tìm thấy bài viết này. Bài viết có thể đã bị xóa hoặc đường dẫn không đúng.");
      }
      setLoading(false);
    };

    void loadData();
    return () => {
      active = false;
    };
  }, [slug, fetchBlogs, fetchBlogBySlug, blogs.length]);

  // Lấy các bài viết khác làm bài viết liên quan (tối đa 3 bài)
  const relatedBlogs = blogs
    .filter((b) => b.slug !== slug)
    .slice(0, 3);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[800px] mx-auto animate-pulse">
          {/* Skeleton Breadcrumb */}
          <div className="h-4 bg-slate-200 rounded w-1/3 mb-8"></div>
          {/* Skeleton Title */}
          <div className="h-10 bg-slate-200 rounded w-3/4 mb-4"></div>
          {/* Skeleton Date */}
          <div className="h-4 bg-slate-200 rounded w-1/4 mb-8"></div>
          {/* Skeleton Image */}
          <div className="w-full aspect-video bg-slate-200 rounded-3xl mb-10"></div>
          {/* Skeleton Body Text */}
          <div className="space-y-4">
            <div className="h-4 bg-slate-200 rounded w-full"></div>
            <div className="h-4 bg-slate-200 rounded w-5/6"></div>
            <div className="h-4 bg-slate-200 rounded w-4/5"></div>
            <div className="h-4 bg-slate-200 rounded w-full"></div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !blog) {
    return (
      <main className="min-h-screen bg-slate-50 py-20 px-4 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-red-500 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Đã xảy ra lỗi</h2>
          <p className="text-slate-500 mb-6 text-sm">{error || "Bài viết không khả dụng"}</p>
          <div className="flex flex-col gap-2">
            <Link
              href="/blog"
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all"
            >
              Quay lại danh sách blog
            </Link>
            <Link
              href="/"
              className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Chia nhỏ đoạn văn trong description nếu có xuống dòng, hoặc xử lý hiển thị
  const paragraphs = blog.description.split("\n\n").flatMap((p) => p.split("\n"));

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[800px] mx-auto">
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
              <Link href="/blog" className="hover:text-slate-800 transition-colors">
                Blog
              </Link>
            </li>
            <li className="text-slate-400">/</li>
            <li className="text-slate-800 font-semibold truncate max-w-[200px] sm:max-w-[400px]">
              {blog.title}
            </li>
          </ol>
        </nav>

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors mb-6 group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1.5 transition-transform group-hover:-translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Quay lại
        </button>

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-yellow-400/20 text-yellow-800 text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md">
              Thời trang & Phong cách
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            {blog.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                T
              </div>
              <span>TMF Editor</span>
            </div>
            <div className="h-1 w-1 bg-slate-300 rounded-full"></div>
            <span>
              {blog.createdAt
                ? new Date(blog.createdAt).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "24 Tháng 6, 2026"}
            </span>
          </div>
        </header>

        {/* Cover Photo */}
        <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-lg border border-slate-100 mb-10">
          <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
        </div>

        {/* Article Body */}
        <article className="prose prose-slate max-w-none mb-16">
          {paragraphs.map((para, index) => (
            <p key={index} className="text-slate-700 text-lg leading-relaxed mb-6 font-light font-monasans">
              {para}
            </p>
          ))}
        </article>

        {/* Divider */}
        <hr className="border-slate-200 mb-12" />

        {/* Related Posts Section */}
        {relatedBlogs.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Bài viết liên quan khác 📚</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedBlogs.map((item) => (
                <Link
                  key={item._id}
                  href={`/blog/${item.slug}`}
                  className="flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300 group"
                >
                  <div className="relative w-full aspect-video overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-yellow-600 transition-colors">
                      {item.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
