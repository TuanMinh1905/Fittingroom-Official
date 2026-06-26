import React from "react";
import Link from "next/link";
import { Product } from "@/store/productStore";

interface Props {
  products: Product[];
}

export default function RelatedProductsSidebar({ products }: Props) {
  if (!products || products.length === 0) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " đ";
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-50 flex flex-col gap-5">
      <div>
        <h3 className="text-base font-extrabold text-slate-800 tracking-tight flex items-center gap-1.5">
          <span>🔥</span> Sản phẩm liên quan
        </h3>
        <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Có thể boss sẽ thích những mẫu này</p>
      </div>

      <div className="flex flex-col gap-4">
        {products.slice(0, 5).map((product) => (
          <Link 
            key={product._id} 
            href={`/p/${product.slug || product._id}`}
            className="flex gap-4 p-2 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all duration-300 group"
          >
            {/* Left Thumbnail */}
            <div className="relative w-18 h-18 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0">
              {product.imageUrl ? (
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400 font-bold">No Pic</div>
              )}
              {product.discountPrice && (
                <div className="absolute top-1 left-1 bg-rose-500 text-white text-[8px] font-extrabold px-1 py-0.5 rounded-md">
                  -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
                </div>
              )}
            </div>

            {/* Right Information */}
            <div className="flex flex-col justify-between flex-grow min-w-0 py-0.5">
              <div>
                <span className="text-[9px] font-extrabold text-[var(--primary)] uppercase tracking-wider block mb-0.5">
                  {product.brand || "TMF Store"}
                </span>
                <h4 className="text-xs font-bold text-slate-700 line-clamp-2 leading-tight group-hover:text-[var(--primary)] transition-colors">
                  {product.name}
                </h4>
              </div>

              <div className="flex items-baseline gap-1.5 mt-1.5">
                {product.discountPrice ? (
                  <>
                    <span className="text-xs font-extrabold text-slate-900">{formatPrice(product.discountPrice)}</span>
                    <span className="text-[10px] text-slate-400 line-through font-semibold">{formatPrice(product.price)}</span>
                  </>
                ) : (
                  <span className="text-xs font-extrabold text-slate-900">{formatPrice(product.price)}</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

