// ===== TMFashion Brand List =====
// Grid thương hiệu (tương đương components/brand/List.vue)
// Giống Nuxt: title + subtitle, cards 211x152, logo + name, "Xem tất cả"

"use client";

import { useState } from "react";
import Link from "next/link";
import type { Brand } from "@/stores/brand";

interface BrandListProps {
  brands: Brand[];
}

export default function BrandList({ brands }: BrandListProps) {
  const [showAll, setShowAll] = useState(false);

  if (brands.length === 0) return null;

  // Giống Nuxt: hiện 5 brand đầu, bấm "Xem tất cả" hiện hết
  const visibleBrands = showAll ? brands : brands.slice(0, 5);

  return (
    <div className="py-6">
      {/* Header — giống Nuxt */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-[18px] md:text-[20px] font-bold text-text-brand">
            Thương hiệu yêu thích
          </h2>
          <p className="text-[13px] text-gray-500 mt-1">
            Sen chọn đúng gu - Boss thích mê ly
          </p>
        </div>
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-[13px] text-primary hover:underline font-medium"
        >
          {showAll ? "Thu gọn" : "Xem tất cả"}
        </button>
      </div>

      {/* Brand cards grid — giống Nuxt: cards border-2 rounded-lg */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {visibleBrands.map((brand) => (
          <Link
            key={brand._id}
            href={`/brand/${brand.slug || brand._id}`}
            className="flex flex-col items-center justify-center border-2 border-gray-200 rounded-lg p-4 min-h-[120px] md:min-h-[152px] hover:border-primary hover:shadow-md transition group bg-white"
          >
            {brand.logo_url ? (
              <img
                src={brand.logo_url}
                alt={brand.name}
                className="w-[44px] h-[44px] object-contain mb-3 group-hover:scale-110 transition-transform"
              />
            ) : (
              <div className="w-[44px] h-[44px] bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <span className="text-[18px] font-bold text-primary">
                  {brand.name.charAt(0)}
                </span>
              </div>
            )}
            <span className="text-[14px] md:text-[16px] font-medium text-text-brand text-center font-[var(--font-sans)]">
              {brand.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
