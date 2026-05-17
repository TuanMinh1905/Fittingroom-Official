"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { useProductStore } from "@/store/productStore";

export default function All_Product() {
  const { products, loading, error, fetchProducts } = useProductStore();
  const [visibleCount, setVisibleCount] = useState(15); // 3 dòng x 5 sản phẩm

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [fetchProducts, products.length]);

  if (loading && products.length === 0) {
    return (
      <div className="py-10 max-w-[1200px] mx-auto px-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-[12px] md:gap-[16px]">
            {[...Array(15)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-[300px] rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-10">{error}</div>;
  }

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 15);
  };

  const displayProducts = products.slice(0, visibleCount);
  const hasMore = visibleCount < products.length;

  return (
    <section className="py-8 bg-white mb-4">
      <div className="max-w-[1200px] mx-auto px-[16px]">
        <div className="flex justify-between items-end mb-4 md:mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
              Gợi ý cho bạn
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-[12px] md:gap-[16px]">
          {displayProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {hasMore && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleLoadMore}
              className="px-[40px] py-[12px] border-[1.5px] border-[var(--primary)] text-[var(--primary)] font-medium rounded-md bg-white hover:bg-[var(--primary-hover)] hover:border-[var(--primary-hover)] hover:text-white transition-all duration-300 pointer-events-auto cursor-pointer"
            >
              Xem thêm
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
