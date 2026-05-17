// ===== TMFashion ListProductVertical =====
// Grid sản phẩm 5 cột (tương đương components/product/ListProductVertical.vue)
// Giống Nuxt: 5-col grid, gap-[25px], "Xem thêm sản phẩm" load more

"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import type { Product } from "@/stores/product";

interface ListProductVerticalProps {
  products: Product[];
  loading?: boolean;
  initialRows?: number;
}

export default function ListProductVertical({
  products,
  loading = false,
  initialRows = 3,
}: ListProductVerticalProps) {
  const cols = 5;
  const [visibleCount, setVisibleCount] = useState(initialRows * cols);

  const visibleProducts = products.slice(0, visibleCount);
  const hasMore = visibleCount < products.length;

  if (loading) {
    return (
      <div className="py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-[25px]">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-[14px] animate-pulse">
              <div className="min-h-[258px] bg-gray-300 rounded-t-[14px]" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-3/4" />
                <div className="h-3 bg-gray-300 rounded w-1/2" />
                <div className="h-4 bg-gray-300 rounded w-2/3" />
                <div className="h-8 bg-gray-300 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500">
        Không có sản phẩm nào
      </div>
    );
  }

  return (
    <div className="py-6">
      {/* Grid 5 cột — giống Nuxt: gap-[25px] */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-[15px] md:gap-[25px]">
        {visibleProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {/* Load more button — giống Nuxt: "Xem thêm sản phẩm" */}
      {hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={() => setVisibleCount((prev) => prev + cols * 2)}
            className="px-8 py-3 border-2 border-primary text-primary hover:bg-primary hover:text-white font-medium rounded-lg transition text-[14px]"
          >
            Xem thêm sản phẩm
          </button>
        </div>
      )}
    </div>
  );
}
