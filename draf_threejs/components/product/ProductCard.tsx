// ===== TMFashion Product Card =====
// Card sản phẩm (tương đương components/product/Product.vue)
// Giống Nuxt: rounded-[14px], discount badge, 5 gold stars, price, "Thêm vào giỏ"

"use client";

import Link from "next/link";
import { formatVNDWithComma, discountPercent } from "@/utils";
import type { Product } from "@/stores/product";
import { useCartStore } from "@/stores/cart";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

// SVG star component — giống Nuxt
function StarIcon({ filled = true }: { filled?: boolean }) {
  return (
    <svg
      className={`w-[14px] h-[14px] ${filled ? "text-yellow-400" : "text-gray-300"}`}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCartStore();
  const [adding, setAdding] = useState(false);

  const discount = product.compare_at_price
    ? discountPercent(product.price, product.compare_at_price)
    : 0;

  return (
    <div className="group bg-white rounded-[14px] border border-[#D8DCE0] overflow-hidden hover:border-primary hover:-translate-y-[5px] transition-all duration-200 hover:shadow-lg">
      {/* Image — giống Nuxt: min-h-[200px] md:min-h-[258px] */}
      <Link href={`/p/${product._id}`} className="block relative overflow-hidden">
        <div className="min-h-[200px] md:min-h-[258px] bg-gray-100">
          <img
            src={product.image_url || "/placeholder.png"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        {/* Discount badge — giống Nuxt: bg-primary text-orange */}
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-primary text-orange-tmf text-[11px] font-bold px-2 py-1 rounded-md">
            -{discount}%
          </span>
        )}
      </Link>

      {/* Info */}
      <div className="p-3">
        {/* Name — giống Nuxt: 2 dòng, truncate */}
        <Link href={`/p/${product._id}`}>
          <h3 className="text-[13px] font-medium text-text-product line-clamp-2 mb-2 min-h-[2.5rem] hover:text-primary transition">
            {product.name}
          </h3>
        </Link>

        {/* Star rating — giống Nuxt: 5 sao vàng */}
        <div className="flex items-center gap-[2px] mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon key={star} filled={true} />
          ))}
        </div>

        {/* Price — giống Nuxt: bold, VND format */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[15px] font-bold text-text-product">
            {formatVNDWithComma(product.price)}đ
          </span>
          {product.compare_at_price && product.compare_at_price > product.price && (
            <span className="text-[12px] text-gray-400 line-through">
              {formatVNDWithComma(product.compare_at_price)}đ
            </span>
          )}
        </div>

        {/* Add to cart button — giống Nuxt: bg-primary text-white rounded */}
        <button
          onClick={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (adding) return;
            setAdding(true);
            try {
              await addToCart(product._id, 1);
            } catch {
              alert("Lỗi thêm vào giỏ hàng. Vui lòng đăng nhập!");
            } finally {
              setAdding(false);
            }
          }}
          disabled={adding}
          className="w-full py-[8px] bg-primary text-white text-[13px] font-medium rounded-lg hover:bg-secondary transition disabled:opacity-50"
        >
          {adding ? "Đang thêm..." : "Thêm vào giỏ"}
        </button>
      </div>
    </div>
  );
}
