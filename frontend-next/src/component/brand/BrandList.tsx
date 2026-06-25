"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useBrandStore } from "@/store/brandStore";

export default function BrandList() {
  const { brands, loading, error, fetchBrands } = useBrandStore();

  useEffect(() => {
    if (brands.length === 0) {
      fetchBrands();
    }
  }, [fetchBrands, brands.length]);

  if (loading && brands.length === 0) {
    return (
      <div className="py-8 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-100 h-24 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  return (
    <section className="py-8 mb-4 max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {brands.map((brand) => (
          <Link
            key={brand._id}
            href={`/brand/${brand.slug}`}
            className="flex flex-col items-center justify-center p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-shadow hover:border-gray-200"
          >
            <div className="h-12 w-full flex items-center justify-center mb-2">
              {brand.logo ? (
                 // Using img instead of next/image since we have dynamic external URLs (placeholders) right now without config
                 <img
                   src={brand.logo}
                   alt={brand.name}
                   className="max-h-full max-w-[100px] object-contain mix-blend-multiply"
                   loading="lazy"
                 />
              ) : (
                <div className="h-full flex items-center text-xs text-gray-400">No Logo</div>
              )}
            </div>
            <span className="text-sm font-medium text-gray-700 text-center">
              {brand.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
