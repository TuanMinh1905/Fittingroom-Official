"use client";

import React from "react";
import Link from "next/link";
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
    <Link href={`/p/${product.slug || product._id}`} className="block h-full">
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
            {/* Giá */}
            {product.discountPrice ? (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-[var(--primary)] bg-[var(--primary)]/10 px-1.5 py-0.5 rounded font-semibold border border-[var(--primary)]/20">
                    -{Math.round(((Number(product.price) - Number(product.discountPrice)) / Number(product.price)) * 100)}%
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    {formatPrice(product.price)}
                  </span>
                </div>
                <div className="text-gray-900 font-bold text-base md:text-lg">
                  {formatPrice(product.discountPrice)}
                </div>
              </>
            ) : (
              <div className="text-gray-900 font-bold text-base mt-2 md:text-lg">
                {formatPrice(product.price)}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
