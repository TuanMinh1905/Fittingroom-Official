"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useBlogStore, Blog } from "@/store/blogStore";
import toast from "react-hot-toast";

interface PageProps {
  params: Promise<{ slug: string }>;
}

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
  const minutes = Math.ceil(words / 15);
  return minutes > 0 ? minutes : 2;
};

export default function BlogDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  const router = useRouter();
  const { blogs, fetchBlogs, fetchBlogBySlug } = useBlogStore();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [emailSub, setEmailSub] = useState("");

  useEffect(() => {
    let active = true;
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
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

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          toast.success("Sao chép liên kết bài viết thành công!", {
            style: {
              background: "#0f172a",
              color: "#fff",
              fontSize: "12px",
              borderRadius: "10px",
              fontWeight: 600,
            }
          });
        })
        .catch(() => {
          toast.error("Không thể sao chép liên kết.");
        });
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailSub.trim()) {
      toast.success(`Đăng ký nhận tin thành công với: ${emailSub}`, {
        style: {
          background: "#0f172a",
          color: "#fff",
          fontSize: "12px",
          borderRadius: "10px",
          fontWeight: 600,
        }
      });
      setEmailSub("");
    }
  };

  const relatedBlogs = blogs
    .filter((b) => b.slug !== slug)
    .slice(0, 3);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8 font-monasans animate-pulse">
        <div className="max-w-[800px] mx-auto">
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
      <main className="min-h-screen bg-slate-50/50 py-20 px-4 text-center font-monasans">
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-slate-800 mb-1">Đã xảy ra lỗi</h2>
          <p className="text-slate-500 mb-6 text-xs leading-relaxed">{error || "Bài viết không khả dụng"}</p>
          <div className="flex flex-col gap-2">
            <Link
              href="/blog"
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs transition-all cursor-pointer"
            >
              Quay lại danh sách blog
            </Link>
            <Link
              href="/"
              className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-all cursor-pointer"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Tách đoạn văn bản và lọc bỏ các khoảng trắng trống
  const paragraphs = blog.description
    .split("\n\n")
    .flatMap((p) => p.split("\n"))
    .filter((p) => p.trim() !== "");

  const categoryInfo = getCategoryInfo(blog.slug);
  const readTime = getReadingTime(blog.description);

  return (
    <main className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8 font-monasans relative">
      {/* Decorative background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#5DADE2]/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="max-w-[1000px] mx-auto">
        {/* Breadcrumb */}
        <nav className="text-xs font-semibold tracking-wider text-slate-400 mb-8 uppercase" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="hover:text-[#5DADE2] transition-colors">
                Trang chủ
              </Link>
            </li>
            <li className="text-slate-300">/</li>
            <li>
              <Link href="/blog" className="hover:text-[#5DADE2] transition-colors">
                Blog
              </Link>
            </li>
            <li className="text-slate-300">/</li>
            <li className="text-slate-600 truncate max-w-[150px] sm:max-w-[300px]">
              {blog.title}
            </li>
          </ol>
        </nav>

        {/* Dynamic Grid: Left Controls Sticky, Center Article */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Desktop Left Sticky Actions Panel */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 flex flex-col items-center gap-4">
              <button
                onClick={() => router.back()}
                className="h-10 w-10 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 hover:border-slate-200 shadow-sm hover:shadow transition-all cursor-pointer group"
                title="Quay lại"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 transition-transform group-hover:-translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={handleCopyLink}
                className="h-10 w-10 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:text-[#5DADE2] hover:border-[#5DADE2]/30 shadow-sm hover:shadow transition-all cursor-pointer"
                title="Sao chép liên kết"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Main Article Container */}
          <div className="lg:col-span-11 max-w-3xl">
            {/* Back Button for mobile */}
            <div className="lg:hidden flex items-center justify-between mb-6">
              <button
                onClick={() => router.back()}
                className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors group"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1 transition-transform group-hover:-translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Quay lại
              </button>

              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-[#5DADE2] transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Chia sẻ
              </button>
            </div>

            {/* Article Header */}
            <header className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${categoryInfo.color}`}>
                  {categoryInfo.name}
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full">
                  🕒 {readTime} phút đọc
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-6">
                {blog.title}
              </h1>
              
              {/* Author Row */}
              <div className="flex items-center gap-4 text-xs text-slate-500 border-b border-slate-100 pb-6">
                <div className="h-10 w-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-600">
                  T
                </div>
                <div>
                  <div className="font-bold text-slate-800">TMF Editor</div>
                  <div className="text-[10px] text-slate-400 font-medium">
                    Đăng ngày{" "}
                    {blog.createdAt
                      ? new Date(blog.createdAt).toLocaleDateString("vi-VN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "24 Tháng 6, 2026"}
                  </div>
                </div>
              </div>
            </header>

            {/* Article Cover Image */}
            <div className="relative w-full aspect-video rounded-[32px] overflow-hidden shadow-md border border-slate-100/50 mb-10">
              <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
            </div>

            {/* Premium Article Body typography */}
            <article className="prose prose-slate max-w-none mb-16 text-slate-700 text-lg leading-relaxed font-light">
              {paragraphs.map((para, index) => {
                const isFirst = index === 0;

                // Định dạng tiêu đề con (Heading 3)
                if (para.startsWith("###")) {
                  return (
                    <h3 key={index} className="text-xl sm:text-2xl font-black text-slate-900 mt-10 mb-4 tracking-tight">
                      {para.replace("###", "").trim()}
                    </h3>
                  );
                }

                // Định dạng danh sách (List items)
                if (para.startsWith("- ") || para.startsWith("* ")) {
                  return (
                    <div key={index} className="flex gap-2.5 mb-3.5 pl-2">
                      <span className="text-[#5DADE2] text-sm mt-1.5">•</span>
                      <p className="text-slate-700 text-base leading-relaxed font-light">
                        {para.substring(2).trim()}
                      </p>
                    </div>
                  );
                }

                // Định dạng trích dẫn (Blockquote)
                if (para.startsWith(">")) {
                  return (
                    <blockquote key={index} className="border-l-4 border-[#5DADE2] pl-5 italic text-slate-600 bg-slate-50/80 py-4 pr-5 rounded-r-2xl my-8 font-light shadow-sm">
                      {para.substring(1).trim()}
                    </blockquote>
                  );
                }

                // Đoạn văn mặc định kèm Drop Cap cho đoạn đầu
                return (
                  <p
                    key={index}
                    className={`text-slate-700 text-base sm:text-lg leading-relaxed mb-6 font-light ${
                      isFirst
                        ? "first-letter:text-5xl first-letter:font-black first-letter:text-[#5DADE2] first-letter:mr-3 first-letter:float-left first-letter:leading-[0.8] first-letter:mt-1 first-letter:font-sans"
                        : ""
                    }`}
                  >
                    {para}
                  </p>
                );
              })}
            </article>

            {/* Newsletter CTA Block */}
            <section className="bg-slate-950 text-white rounded-3xl p-8 sm:p-10 border border-slate-900 shadow-xl mb-16 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-[#5DADE2]/15 z-0"></div>
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#5DADE2]/10 rounded-full blur-3xl"></div>
              
              <div className="relative z-10 max-w-lg">
                <span className="text-[#5DADE2] text-[10px] font-bold uppercase tracking-widest block mb-2">TMF Club</span>
                <h3 className="text-xl sm:text-2xl font-black mb-3">Đăng ký nhận mẹo thời trang</h3>
                <p className="text-slate-400 text-xs sm:text-sm font-light leading-relaxed mb-6">
                  Đăng ký email để nhận ngay các gợi ý phối đồ thời thượng và thông báo ưu đãi độc quyền từ TMF.
                </p>
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="email"
                    placeholder="Email của bạn..."
                    required
                    value={emailSub}
                    onChange={(e) => setEmailSub(e.target.value)}
                    className="flex-grow px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#5DADE2]/50 focus:border-[#5DADE2] text-xs font-semibold"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#5DADE2] hover:bg-[#5DADE2]/90 text-white font-bold rounded-2xl text-xs transition-all shadow-lg shadow-[#5DADE2]/20 whitespace-nowrap cursor-pointer"
                  >
                    Đăng Ký
                  </button>
                </form>
              </div>
            </section>

            {/* Divider */}
            <hr className="border-slate-100 mb-12" />

            {/* Related Posts Section */}
            {relatedBlogs.length > 0 && (
              <section className="mb-8">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 mb-6 tracking-tight">Bài viết liên quan khác ✨</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {relatedBlogs.map((item) => {
                    const itemCat = getCategoryInfo(item.slug);
                    return (
                      <Link
                        key={item._id}
                        href={`/blog/${item.slug}`}
                        className="flex flex-col bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300 group h-full"
                      >
                        <div className="relative w-full aspect-video overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute top-3 left-3 z-20">
                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider border ${itemCat.color}`}>
                              {itemCat.name.split(" ")[0]}
                            </span>
                          </div>
                        </div>
                        <div className="p-4 flex flex-col flex-grow justify-between">
                          <h3 className="text-xs sm:text-sm font-bold text-slate-800 leading-snug line-clamp-2 group-hover:text-[#5DADE2] transition-colors mb-2">
                            {item.title}
                          </h3>
                          <span className="text-[9px] text-[#5DADE2] font-extrabold flex items-center gap-0.5 mt-auto">
                            Đọc bài viết
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

