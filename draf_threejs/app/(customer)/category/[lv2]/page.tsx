// ===== TMFashion Category Page =====
// Tương đương pages/category/[LV2]/index.vue

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import ProductCard from "@/components/product/ProductCard";
import type { Product } from "@/stores/product";

interface CategoryData {
  _id: string;
  name: string;
  slug: string;
  children?: CategoryData[];
}

export default function CategoryPage() {
  const params = useParams();
  const slug = params.lv2 as string;

  const [category, setCategory] = useState<CategoryData | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        // Find category by slug
        const catRes = await api.get<{ data: CategoryData[] }>("/categories");
        const cats = Array.isArray(catRes) ? catRes : (catRes.data || []);
        const cat = cats.find((c) => c.slug === slug || c._id === slug);
        setCategory(cat || null);

        if (cat) {
          const data = await api.get<{ data: Product[]; pagination: any }>("/products", { category: cat._id, limit: 30 });
          setProducts(data.data || []);
        }
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (!loading && !category) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-12 text-center">
        <p className="text-gray-400 mb-4">Không tìm thấy danh mục</p>
        <Link href="/shop" className="text-primary hover:underline">Quay lại cửa hàng</Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary">Trang chủ</Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">{category?.name}</span>
      </div>

      <h1 className="text-2xl font-bold text-gray-800 mb-6">{category?.name}</h1>

      {/* Sub-categories if any */}
      {category?.children && category.children.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {category.children.map((child) => (
            <Link key={child._id} href={`/category/${slug}/${child.slug}`} className="px-4 py-2 bg-white border rounded-full text-sm hover:border-primary hover:bg-yellow-50 transition">
              {child.name}
            </Link>
          ))}
        </div>
      )}

      {/* Products */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-lg h-[300px] animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 text-gray-400">Chưa có sản phẩm trong danh mục này</div>
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
