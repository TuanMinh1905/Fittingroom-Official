"use client";

import React, { useRef } from "react";
import ProductCard from "@/component/product/ProductCard";
import { Product } from "@/store/productStore";

interface Props {
  products: Product[];
}

export default function ProductBottomSlider({ products }: Props) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (!products || products.length === 0) return null;

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      // Scroll by 70% of the visible container width
      const scrollAmount = clientWidth * 0.7;
      const targetScroll = direction === "left" 
        ? scrollLeft - scrollAmount 
        : scrollLeft + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full relative group/slider">
      {/* Title section */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>✨</span> Boss cũng yêu thích
          </h2>
          <p className="text-xs md:text-sm text-slate-400 font-semibold mt-1">
            Săn deal hời - Chăm boss nhẹ tênh!
          </p>
        </div>

        {/* Desktop navigation buttons */}
        <div className="hidden md:flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 active:scale-95 transition-all duration-300 shadow-sm cursor-pointer"
            title="Trước"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 active:scale-95 transition-all duration-300 shadow-sm cursor-pointer"
            title="Kế tiếp"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Slider wrapper with relative position */}
      <div className="relative">
        <div 
          ref={scrollContainerRef}
          className="flex gap-5 overflow-x-auto pb-6 snap-x hide-scrollbar scroll-smooth"
        >
          {products.map((product) => (
            <div key={product._id} className="snap-start flex-shrink-0 w-[240px] md:w-[260px]">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

