"use client";

import React, { useState } from "react";
import { Product } from "@/store/productStore";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";

interface Props {
  product: Product;
}

export default function ProductMainInfo({ product }: Props) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState("Đen");
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);

  // Fallback and mock details for richer UX
  const isShoe = product.categorySlug === "giay" || product.slug.includes("giay");
  const colors = [
    { name: "Đen", hex: "#111827" },
    { name: "Trắng Cream", hex: "#F3F4F6", hasBorder: true },
    { name: "Xanh Olive", hex: "#374151" },
    { name: "Beige", hex: "#D1D5DB" }
  ];
  const sizes = isShoe ? ["39", "40", "41", "42", "43"] : ["S", "M", "L", "XL", "XXL"];

  // Mock secondary images for gallery if product has only one
  const images = [
    product.imageUrl || "/images/placeholder.jpg",
    // We mock 3 other angles using CSS filter variations or crop coordinates
    product.imageUrl || "/images/placeholder.jpg",
    product.imageUrl || "/images/placeholder.jpg",
    product.imageUrl || "/images/placeholder.jpg",
  ];

  const handleAddToCart = () => {
    // Add selected color and size to the product info going to cart
    const customizedProduct = {
      ...product,
      color: selectedColor,
      size: selectedSize,
    };
    addToCart(customizedProduct, quantity);
    toast.success(
      <div>
        <p className="font-bold">Đã thêm vào giỏ hàng!</p>
        <p className="text-xs opacity-90">{product.name} ({selectedColor} / Size {selectedSize}) x{quantity}</p>
      </div>,
      {
        style: {
          borderRadius: "12px",
          background: "#1E293B",
          color: "#fff",
          padding: "12px 16px",
        },
        icon: "🛒",
      }
    );
  };

  const handleBuyNow = () => {
    const customizedProduct = {
      ...product,
      color: selectedColor,
      size: selectedSize,
    };
    addToCart(customizedProduct, quantity);
    router.push("/cart");
  };

  const handleTryOn = () => {
    router.push("/fitting-room");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " đ";
  };

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    if (quantity < (product.stock || 20)) setQuantity(quantity + 1);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-50 flex flex-col lg:flex-row gap-8 md:gap-12">
      {/* Left: Dynamic Gallery */}
      <div className="w-full lg:w-1/2 flex flex-col gap-4">
        {/* Main image container with zoom effect */}
        <div 
          className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-100/80 cursor-zoom-in"
          onMouseEnter={() => setIsZooming(true)}
          onMouseLeave={() => setIsZooming(false)}
          onMouseMove={handleMouseMove}
        >
          <img 
            src={images[activeImageIndex]} 
            alt={product.name} 
            className={`w-full h-full object-cover transition-transform duration-100 ${
              isZooming ? "scale-200" : "scale-100"
            }`}
            style={
              isZooming
                ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` }
                : undefined
            }
          />
          
          {/* Tags */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
            {product.discountPrice && (
              <span className="bg-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm bg-opacity-95">
                -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}% GIẢM
              </span>
            )}
            <span className="bg-indigo-600/90 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              3D TRY-ON READY
            </span>
          </div>
        </div>

        {/* Thumbnail slider */}
        <div className="flex gap-3 overflow-x-auto pb-1 hide-scrollbar">
          {images.map((img, idx) => {
            // Apply different rotation filters to mock unique angles if URLs are identical
            const filterClass = idx === 1 ? "hue-rotate-15 brightness-95" : idx === 2 ? "saturate-150 contrast-105" : idx === 3 ? "brightness-90 contrast-95" : "";
            
            return (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-20 aspect-[4/5] rounded-xl overflow-hidden border-2 transition-all duration-300 flex-shrink-0 ${
                  activeImageIndex === idx
                    ? "border-[var(--primary)] shadow-md scale-95"
                    : "border-slate-100 hover:border-slate-300"
                }`}
              >
                <img 
                  src={img} 
                  alt={`thumbnail-${idx}`} 
                  className={`w-full h-full object-cover ${filterClass} ${
                    activeImageIndex === idx ? "opacity-100" : "opacity-75 hover:opacity-100"
                  }`} 
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: Info Section */}
      <div className="w-full lg:w-1/2 flex flex-col">
        {/* Brand & Category breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
          <span>{product.brand || "TMF Premium"}</span>
          <span>•</span>
          <span className="text-[var(--primary)]">{product.categorySlug}</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-3 tracking-tight leading-tight">
          {product.name}
        </h1>

        {/* Ratings and Sales count */}
        <div className="flex items-center gap-6 mb-6">
          <div className="flex items-center gap-1">
            <div className="flex text-amber-400 text-lg">
              {Array.from({ length: 5 }).map((_, i) => {
                const isGold = i < Math.floor(product.rating || 5);
                return (
                  <span 
                    key={i} 
                    className="hover:scale-125 transition-transform duration-200 cursor-pointer"
                  >
                    {isGold ? "★" : "☆"}
                  </span>
                );
              })}
            </div>
            <span className="text-sm font-bold text-slate-800 ml-1">
              {product.rating || 5.0}
            </span>
          </div>
          <div className="w-[1.5px] h-4 bg-slate-200"></div>
          <span className="text-sm font-semibold text-slate-500">
            Đã bán <strong className="text-slate-800">{product.soldCount || 128}</strong> sản phẩm
          </span>
        </div>

        {/* Price panel */}
        <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-5 mb-6 flex flex-col gap-1.5">
          {product.discountPrice ? (
            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {formatPrice(product.discountPrice)}
              </span>
              <span className="text-base text-slate-400 line-through font-medium">
                {formatPrice(product.price)}
              </span>
              <span className="bg-rose-100 text-rose-600 text-xs font-bold px-2 py-0.5 rounded-md">
                Tiết kiệm {Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
              </span>
            </div>
          ) : (
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {formatPrice(product.price)}
            </span>
          )}
          <p className="text-[11px] text-slate-400 flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
            </svg>
            Giá đã bao gồm thuế và phí bảo đảm chính hãng.
          </p>
        </div>

        {/* Options selection */}
        <div className="flex flex-col gap-5 mb-8">
          {/* Colors */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Màu Sắc: <strong className="text-slate-800">{selectedColor}</strong>
            </span>
            <div className="flex gap-3">
              {colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c.name)}
                  className={`w-9 h-9 rounded-full relative flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                    c.hasBorder ? "border border-slate-200" : ""
                  } ${
                    selectedColor === c.name 
                      ? "ring-2 ring-indigo-500 ring-offset-2 scale-105" 
                      : "hover:ring-1 hover:ring-slate-300 hover:ring-offset-1"
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                >
                  {selectedColor === c.name && (
                    <span className={`w-2 h-2 rounded-full ${c.name.includes("Trắng") ? "bg-slate-900" : "bg-white"}`}></span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Kích Thước: <strong className="text-slate-800">Size {selectedSize}</strong>
            </span>
            <div className="flex gap-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all duration-200 ${
                    selectedSize === s
                      ? "border-slate-950 bg-slate-950 text-white shadow-sm"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Số Lượng:
            </span>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50 shadow-inner">
                <button 
                  onClick={handleDecrease}
                  className="px-4 py-2 hover:bg-slate-100 text-slate-600 font-bold transition-colors border-r border-slate-200"
                >
                  -
                </button>
                <input 
                  type="text" 
                  value={quantity} 
                  readOnly 
                  className="w-12 text-center outline-none text-sm font-extrabold bg-transparent text-slate-800" 
                />
                <button 
                  onClick={handleIncrease}
                  className="px-4 py-2 hover:bg-slate-100 text-slate-600 font-bold transition-colors border-l border-slate-200"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-slate-400 font-semibold">
                Còn {product.stock || 20} sản phẩm trong kho
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 mt-auto">
          {/* Try On Button: Futuristic glow design */}
          <button
            onClick={handleTryOn}
            className="w-full relative group overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-extrabold py-4 px-8 rounded-2xl shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3 cursor-pointer"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-[pulse_2s_infinite]">
              <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z"/>
            </svg>
            <span className="tracking-wider uppercase text-sm md:text-base font-monasans">Thử Đồ Ảo 3D (Virtual Try-on)</span>
          </button>

          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 border-2 border-slate-900 text-slate-900 font-extrabold py-3.5 px-6 rounded-2xl hover:bg-slate-900 hover:text-white transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] text-sm md:text-base cursor-pointer"
            >
              Thêm vào giỏ hàng
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 bg-slate-950 text-white font-extrabold py-3.5 px-6 rounded-2xl hover:bg-slate-800 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-slate-950/10 text-sm md:text-base cursor-pointer"
            >
              Mua ngay
            </button>
          </div>
        </div>

        {/* Quick features banner */}
        <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-6 mt-8">
          <div className="flex flex-col items-center text-center p-2">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296a3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296a3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043a3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
              </svg>
            </div>
            <span className="text-[11px] font-bold text-slate-700">100% Chính Hãng</span>
            <span className="text-[9px] text-slate-400 mt-0.5">Cam kết chất lượng</span>
          </div>

          <div className="flex flex-col items-center text-center p-2">
            <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124l-.321-5.128a2.25 2.25 0 00-2.236-2.112h-1.08c-.761 0-1.506-.102-2.224-.275V7.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5m1.5 0h1.5M8.25 7.5h7.5" />
              </svg>
            </div>
            <span className="text-[11px] font-bold text-slate-700">Giao Nhanh 2h</span>
            <span className="text-[9px] text-slate-400 mt-0.5">Nội thành TP.HCM</span>
          </div>

          <div className="flex flex-col items-center text-center p-2">
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
              </svg>
            </div>
            <span className="text-[11px] font-bold text-slate-700">Đổi Trả 7 Ngày</span>
            <span className="text-[9px] text-slate-400 mt-0.5">Thủ tục nhanh gọn</span>
          </div>
        </div>
      </div>
      
      {/* CSS Animation injection for hover shimmer effect on the 3D Try On button */}
      <style jsx global>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}

