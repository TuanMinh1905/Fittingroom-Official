"use client";

import React from "react";
import Image from "next/image";
import { Product } from "@/store/productStore";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Format giá tiền Việt Nam
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " đ";
  };

  return (
    <div className="w-[220px] h-[365px] flex flex-col bg-white border border-[var(--border-product)] rounded-[14px] overflow-hidden hover:border-[var(--primary-hover)] transition-transform duration-300 hover:translate-y-[-15px]">
      {/* Hình ảnh */}
      <div className="relative aspect-square w-full bg-gray-50 overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No image
          </div>
        )}
      </div>

      {/* Nội dung sản phẩm */}
      <div className="p-3 md:p-4 flex flex-col flex-grow">
        <h3 className="text-sm md:text-base text-gray-800 font-medium line-clamp-2 mb-2 min-h-[40px] md:min-h-[48px]">
          {product.name}
        </h3>

        <div className="mt-auto">
          {/* Giá hiện tại */}
          <div className="text-gray-900 font-bold text-base mt-2 md:text-lg">
            {formatPrice(product.price)}
          </div>
        </div>
      </div>
    </div>
  );
}
