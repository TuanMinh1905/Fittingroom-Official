"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import ProductCard from "../product/ProductCard";
import { useProductStore } from "@/store/productStore";

export default function Collection() {
  const { products, loading, error, fetchProducts } = useProductStore();

  useEffect(() => {
    // Chỉ gọi API nếu chưa có dữ liệu để tránh re-fetch không cần thiết
    if (products.length === 0) {
      fetchProducts();
    }
  }, [fetchProducts, products.length]);

  if (loading && products.length === 0) {
    return (
      <div className="py-10 max-w-7xl mx-auto px-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-64 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-10">{error}</div>;
  }

  // Cắt ra 5 sản phẩm đầu tiên để demo cho giao diện giống hình ảnh
  // Tùy chỉnh việc hiển thị product có thể thay đổi sau theo Category cụ thể
  const displayProducts = products.slice(0, 5);

  return (
    <section className="py-8 bg-white mb-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-4 md:mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
              Combo tiết kiệm
            </h2>
            <p className="text-sm md:text-base text-gray-500">
              Săn deal hời - Chăm boss nhẹ tênh!
            </p>
          </div>
          <Link 
            href="/category/combo" 
            className="text-sm md:text-base text-blue-600 hover:text-blue-800 flex items-center mb-1 font-medium transition-colors"
          >
            Xem thêm <span className="ml-1">›</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-5">
          {displayProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
