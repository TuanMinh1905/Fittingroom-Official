// ===== TMFashion Brand Detail Page =====
// Tương đương pages/brand/[slug].vue

"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useBrandStore } from "@/stores/brand";
import { useProductStore } from "@/stores/product";
import ProductCard from "@/components/product/ProductCard";

export default function BrandPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { brands, getBrands } = useBrandStore();
  const { products, loading, getProducts } = useProductStore();

  const brand = brands.find((b) => b.slug === slug || b._id === slug);

  useEffect(() => {
    if (brands.length === 0) getBrands();
  }, [brands.length, getBrands]);

  useEffect(() => {
    if (brand) {
      getProducts({ brand: brand._id, limit: 30 });
    }
  }, [brand, getProducts]);

  if (!brand && brands.length > 0) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-12 text-center">
        <p className="text-gray-400 mb-4">Không tìm thấy thương hiệu</p>
        <Link href="/shop" className="text-primary hover:underline">Quay lại cửa hàng</Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      {/* Brand Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-8 flex items-center gap-6">
        {brand?.logo_url ? (
          <img src={brand.logo_url} alt={brand.name} className="w-20 h-20 rounded-lg object-contain border" />
        ) : (
          <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center text-3xl font-bold text-gray-400">
            {brand?.name?.charAt(0)}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{brand?.name}</h1>
          {brand?.description && <p className="text-sm text-gray-500 mt-1">{brand.description}</p>}
        </div>
      </div>

      {/* Products */}
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Sản phẩm ({products.length})
      </h2>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-lg h-[300px] animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          Chưa có sản phẩm nào từ thương hiệu này
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
