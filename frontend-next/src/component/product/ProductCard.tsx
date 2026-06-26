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
    <Link href={`/p/${product.slug || product._id}`} className="block h-full group">
      <div className="w-full h-[380px] md:h-[400px] flex flex-col bg-white border border-slate-100 rounded-2xl overflow-hidden hover:border-[var(--primary)] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_24px_-8px_rgba(93,173,226,0.2)] transition-all duration-300 hover:-translate-y-2">
        {/* Hình ảnh */}
        <div className="relative aspect-square w-full bg-slate-50 overflow-hidden">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 font-medium">
              Không có ảnh
            </div>
          )}

          {/* Discount Badge */}
          {product.discountPrice && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-full shadow-md z-10 backdrop-blur-sm bg-opacity-90">
              -{Math.round(((Number(product.price) - Number(product.discountPrice)) / Number(product.price)) * 100)}%
            </div>
          )}

          {/* Floating actions wrapper - displays on hover */}
          <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 z-10">
            <button
              onClick={handleTryOn}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[var(--primary)] shadow-lg transition-transform duration-300 hover:scale-110 hover:bg-[var(--primary)] hover:text-white"
              title="Thử đồ ảo"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z"/>
              </svg>
            </button>
            <button
              onClick={handleAddToCart}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-red-500 shadow-lg transition-transform duration-300 hover:scale-110 hover:bg-red-500 hover:text-white"
              title="Thêm vào giỏ"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Nội dung sản phẩm */}
        <div className="p-3 md:p-4 flex flex-col flex-grow">
          {/* Brand & Rating row */}
          <div className="flex items-center justify-between gap-1 mb-1.5">
            <span className="text-[10px] md:text-xs font-semibold text-slate-400 uppercase tracking-wider truncate">
              {product.brand || "TMF Store"}
            </span>
            {product.rating && (
              <div className="flex items-center gap-0.5 text-yellow-500 text-[10px] md:text-xs font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 fill-current" viewBox="0 0 24 24">
                  <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.857 1.4-8.168L.132 9.21l8.2-1.192L12 .587z"/>
                </svg>
                <span>{product.rating}</span>
              </div>
            )}
          </div>

          <h3 className="text-xs md:text-sm text-slate-800 font-semibold line-clamp-2 mb-2 group-hover:text-[var(--primary)] transition-colors duration-200 min-h-[32px] md:min-h-[40px] leading-tight">
            {product.name}
          </h3>

          <div className="mt-auto flex items-end justify-between">
            <div className="flex flex-col">
              {/* Giá */}
              {product.discountPrice ? (
                <>
                  <span className="text-[10px] md:text-xs text-slate-400 line-through mb-0.5">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-sm md:text-base text-red-500 font-extrabold tracking-tight">
                    {formatPrice(product.discountPrice)}
                  </span>
                </>
              ) : (
                <span className="text-sm md:text-base text-slate-900 font-extrabold tracking-tight">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* Sold Count */}
            {product.soldCount && (
              <span className="text-[10px] md:text-xs text-slate-400 font-medium">
                Đã bán {product.soldCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
