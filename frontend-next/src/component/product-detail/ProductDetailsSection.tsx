"use client";

import React, { useState } from "react";
import { Product } from "@/store/productStore";

interface Props {
  product: Product;
}

type TabType = "description" | "specifications" | "reviews";

export default function ProductDetailsSection({ product }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>("description");

  // Mock review statistics
  const totalReviews = 42;
  const ratingDistribution = [
    { stars: 5, percentage: 85, count: 36 },
    { stars: 4, percentage: 10, count: 4 },
    { stars: 3, percentage: 5, count: 2 },
    { stars: 2, percentage: 0, count: 0 },
    { stars: 1, percentage: 0, count: 0 },
  ];

  // Mock comments
  const mockReviews = [
    {
      name: "Hoàng Anh",
      rating: 5,
      date: "25/06/2026",
      comment: "Đồ mặc siêu vừa vặn cho chú cún nhà mình luôn! Vải thun co giãn tốt, giặt không bị xù lông. Rất ưng tính năng 3D Fitting Room của shop giúp chọn size cực chuẩn.",
      avatar: "HA",
      avatarBg: "bg-indigo-100 text-indigo-700",
      verified: true
    },
    {
      name: "Minh Thư",
      rating: 5,
      date: "22/06/2026",
      comment: "Chất lượng sản phẩm tuyệt vời, vải dày dặn mà mát mẻ cho mèo. Giao hàng hỏa tốc trong 2 giờ nhận ngay. Shop tư vấn dễ thương nhiệt tình, 5 sao!",
      avatar: "MT",
      avatarBg: "bg-rose-100 text-rose-700",
      verified: true
    },
    {
      name: "Khánh Duy",
      rating: 4,
      date: "18/06/2026",
      comment: "Áo đẹp, đường may tỉ mỉ. Bé cún mặc vào nhìn cưng xỉu. Mỗi tội giao hàng hơi chậm một chút do trời mưa, nhưng đóng gói rất cẩn thận nên vẫn tặng shop đánh giá tốt.",
      avatar: "KD",
      avatarBg: "bg-amber-100 text-amber-700",
      verified: true
    }
  ];

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-50">
      {/* Tabs Header */}
      <div className="flex border-b border-slate-100 mb-8 overflow-x-auto hide-scrollbar gap-8">
        <button
          onClick={() => setActiveTab("description")}
          className={`pb-4 text-sm md:text-base font-extrabold tracking-tight relative transition-all duration-300 flex-shrink-0 cursor-pointer ${
            activeTab === "description"
              ? "text-slate-900"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          Mô Tả Sản Phẩm
          {activeTab === "description" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--primary)] rounded-full animate-fade-in" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("specifications")}
          className={`pb-4 text-sm md:text-base font-extrabold tracking-tight relative transition-all duration-300 flex-shrink-0 cursor-pointer ${
            activeTab === "specifications"
              ? "text-slate-900"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          Thông Số Chi Tiết
          {activeTab === "specifications" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--primary)] rounded-full animate-fade-in" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("reviews")}
          className={`pb-4 text-sm md:text-base font-extrabold tracking-tight relative transition-all duration-300 flex-shrink-0 cursor-pointer ${
            activeTab === "reviews"
              ? "text-slate-900"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          Đánh Giá ({totalReviews})
          {activeTab === "reviews" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--primary)] rounded-full animate-fade-in" />
          )}
        </button>
      </div>

      {/* Tab Contents */}
      <div className="min-h-[250px]">
        {/* TAB 1: DESCRIPTION */}
        {activeTab === "description" && (
          <div className="space-y-6 text-slate-600 leading-relaxed text-sm md:text-base animate-fade-in">
            <p className="font-medium text-slate-800">{product.description}</p>
            
            <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100/80">
              <h4 className="font-extrabold text-slate-900 mb-3 flex items-center gap-2">
                <span>🐾</span> ĐIỂM NỔI BẬT NỔI BẬT:
              </h4>
              <ul className="space-y-2.5">
                <li className="flex items-start gap-2.5">
                  <span className="text-[var(--primary)] mt-0.5">✓</span>
                  <span>Chất liệu vải cao cấp, mềm mịn, thông thoáng tuyệt đối, không gây kích ứng da cho thú cưng.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[var(--primary)] mt-0.5">✓</span>
                  <span>Thiết kế phom chuẩn công nghệ SMPL 3D, dễ dàng mặc vào và cởi ra mà không làm boss khó chịu.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[var(--primary)] mt-0.5">✓</span>
                  <span>Đường chỉ may tỉ mỉ, bo viền chắc chắn đảm bảo độ bền đẹp khi giặt tay hoặc giặt máy.</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-extrabold text-slate-900 mb-3 flex items-center gap-2">
                <span>📋</span> HƯỚNG DẪN BẢO QUẢN:
              </h4>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-500">
                <li>Nên giặt sản phẩm bằng tay với xà phòng nhẹ để duy trì phom dáng tốt nhất.</li>
                <li>Tránh phơi trực tiếp dưới ánh nắng gay gắt, phơi ở nơi thoáng mát.</li>
                <li>Không sử dụng chất tẩy mạnh hoặc bàn ủi nhiệt độ quá cao.</li>
              </ul>
            </div>
          </div>
        )}

        {/* TAB 2: SPECIFICATIONS */}
        {activeTab === "specifications" && (
          <div className="space-y-4 animate-fade-in">
            <div className="overflow-hidden border border-slate-100 rounded-2xl">
              <table className="w-full text-sm md:text-base border-collapse">
                <tbody>
                  <tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-5 text-slate-500 font-medium w-1/3">Thương hiệu</td>
                    <td className="py-4 px-5 text-slate-900 font-semibold">{product.brand || "TMF Store"}</td>
                  </tr>
                  <tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors bg-slate-50/20">
                    <td className="py-4 px-5 text-slate-500 font-medium w-1/3">Danh mục sản phẩm</td>
                    <td className="py-4 px-5 text-slate-900 font-semibold uppercase">{product.categorySlug}</td>
                  </tr>
                  <tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-5 text-slate-500 font-medium w-1/3">Hạn dùng / Độ bền</td>
                    <td className="py-4 px-5 text-slate-900 font-semibold">{product.expiryDate || "> 2 năm"}</td>
                  </tr>
                  <tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors bg-slate-50/20">
                    <td className="py-4 px-5 text-slate-500 font-medium w-1/3">Xuất xứ công nghệ</td>
                    <td className="py-4 px-5 text-slate-900 font-semibold">Việt Nam (Tiêu chuẩn SMPL 3D Fitting)</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-5 text-slate-500 font-medium w-1/3">Đơn vị phân phối</td>
                    <td className="py-4 px-5 text-slate-900 font-semibold">Công ty Cổ phần Pet Pet</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-5 flex gap-3 text-amber-800">
              <span className="text-xl">💡</span>
              <p className="text-xs md:text-sm font-medium leading-relaxed">
                <strong>Mẹo chọn size chuẩn:</strong> Bạn có thể sử dụng tính năng <strong>Thử đồ ảo 3D</strong> ở phần trên trang để nhập số đo cân nặng, chiều dài lưng của bé cún/mèo nhà mình nhằm mô phỏng và lựa chọn size vừa vặn nhất!
              </p>
            </div>
          </div>
        )}

        {/* TAB 3: REVIEWS & FEEDBACK */}
        {activeTab === "reviews" && (
          <div className="space-y-8 animate-fade-in">
            {/* Rating Summary Card */}
            <div className="bg-slate-50/70 border border-slate-100 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-8">
              {/* Left Total Rating */}
              <div className="text-center md:border-r border-slate-200 md:pr-10 flex-shrink-0">
                <span className="text-5xl font-extrabold text-slate-900">{product.rating ? product.rating.toFixed(1) : "5.0"}</span>
                <span className="text-slate-400 block text-sm mt-1">trên 5 sao</span>
                <div className="flex text-amber-400 text-lg justify-center mt-2.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <span className="text-xs text-slate-400 font-semibold block mt-1">{totalReviews} đánh giá thực tế</span>
              </div>

              {/* Progress bars */}
              <div className="w-full space-y-2">
                {ratingDistribution.map((dist) => (
                  <div key={dist.stars} className="flex items-center gap-3 text-xs md:text-sm font-medium">
                    <span className="w-10 text-slate-500 font-bold flex items-center gap-0.5 justify-end">
                      {dist.stars} <span className="text-amber-400">★</span>
                    </span>
                    <div className="flex-grow h-2 bg-slate-200/60 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-400 rounded-full transition-all duration-500" 
                        style={{ width: `${dist.percentage}%` }}
                      />
                    </div>
                    <span className="w-12 text-slate-400 font-semibold">{dist.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Review Comments List */}
            <div className="space-y-6">
              <h4 className="font-extrabold text-slate-900 text-base md:text-lg border-b border-slate-100 pb-3">Đánh giá tiêu biểu</h4>
              
              <div className="divide-y divide-slate-100">
                {mockReviews.map((rev, idx) => (
                  <div key={idx} className={`py-6 ${idx === 0 ? "pt-0" : ""}`}>
                    <div className="flex justify-between items-start gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-sm ${rev.avatarBg}`}>
                          {rev.avatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900 text-sm md:text-base">{rev.name}</span>
                            {rev.verified && (
                              <span className="bg-emerald-100 text-emerald-700 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                                </svg>
                                Đã mua
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 font-semibold">{rev.date}</span>
                        </div>
                      </div>
                      
                      {/* Stars */}
                      <div className="flex text-amber-400 text-xs">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i}>{i < rev.rating ? "★" : "☆"}</span>
                        ))}
                      </div>
                    </div>
                    
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed pl-13">
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .pl-13 {
          padding-left: 3.25rem;
        }
        @media (max-width: 640px) {
          .pl-13 {
            padding-left: 0;
          }
        }
      `}</style>
    </div>
  );
}
