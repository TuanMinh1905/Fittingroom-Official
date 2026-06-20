"use client";

import React from "react";
import Link from "next/link";
import { Product } from "@/store/productStore";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    toast.success(`Đã thêm ${product.name} vào giỏ hàng`, {
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  };

  const handleTryOn = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push("/fitting-room");
  };

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

          <div className="mt-auto flex justify-between items-end">
            <div>
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

            <div className="flex gap-2">
              <button
                onClick={handleTryOn}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] border border-[var(--primary)] transition-colors hover:bg-[var(--primary)] hover:text-white text-[var(--primary)]"
                title="Thử đồ ngay"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z"/>
                </svg>
              </button>
              <button
                onClick={handleAddToCart}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] border border-red-500 transition-colors hover:bg-red-50"
                title="Thêm vào giỏ hàng"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                  <circle cx="9" cy="21" r="1"/>
                  <circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
