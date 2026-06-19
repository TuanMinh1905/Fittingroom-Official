import React from "react";
import ProductMainInfo from "@/component/product-detail/ProductMainInfo";
import ProductDetailsSection from "@/component/product-detail/ProductDetailsSection";
import RelatedProductsSidebar from "@/component/product-detail/RelatedProductsSidebar";
import ProductBottomSlider from "@/component/product-detail/ProductBottomSlider";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getProductBySlug(slug: string) {
  const res = await fetch(`http://localhost:8000/products/slug/${slug}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

async function getAllProducts() {
  const res = await fetch(`http://localhost:8000/products`, { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  const allProducts = await getAllProducts();

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-2xl font-bold">Sản phẩm không tồn tại</h1>
      </div>
    );
  }

  // Filter products for sidebar and bottom slider
  const relatedProducts = allProducts.filter((p: any) => p.categorySlug === product.categorySlug && p.slug !== product.slug);
  const bossFavoriteProducts = allProducts.filter((p: any) => p.slug !== product.slug).slice(0, 10);

  return (
    <main className="min-h-screen bg-[#f5f5fa] pb-10">
      <div className="mx-auto w-full max-w-[1200px] px-[16px] py-4 flex flex-col gap-4">
        {/* Breadcrumb can be part of ProductMainInfo or here */}
        <div className="text-sm text-gray-500 py-2">
          Petpet / {product.categorySlug} / <span className="text-gray-800">{product.name}</span>
        </div>

        {/* Top Section */}
        <ProductMainInfo product={product} />

        {/* Middle Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-2">
          <div className="md:col-span-8 lg:col-span-9 space-y-4">
            <ProductDetailsSection product={product} />
          </div>
          <div className="md:col-span-4 lg:col-span-3">
            <RelatedProductsSidebar products={relatedProducts} />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8">
          <ProductBottomSlider products={bossFavoriteProducts} />
        </div>
      </div>
    </main>
  );
}
