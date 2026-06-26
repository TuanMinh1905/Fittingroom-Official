import React from "react";
import Link from "next/link";
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
      <div className="flex flex-col justify-center items-center h-screen bg-slate-50 gap-4">
        <span className="text-5xl">😢</span>
        <h1 className="text-2xl font-black text-slate-800">Sản phẩm không tồn tại</h1>
        <p className="text-slate-400 font-medium text-sm">Vui lòng quay lại trang chủ hoặc kiểm tra lại đường dẫn.</p>
        <Link href="/" className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold shadow-md hover:bg-slate-800 transition-colors">
          Quay về Trang chủ
        </Link>
      </div>
    );
  }

  // Filter products for sidebar and bottom slider
  const relatedProducts = allProducts.filter((p: any) => p.categorySlug === product.categorySlug && p.slug !== product.slug);
  const bossFavoriteProducts = allProducts.filter((p: any) => p.slug !== product.slug).slice(0, 10);

  return (
    <main className="min-h-screen bg-slate-50/50 pb-16 font-monasans">
      <div className="mx-auto w-full max-w-[1200px] px-4 md:px-6 py-4 flex flex-col gap-6">
        
        {/* Modern Breadcrumb */}
        <nav className="text-xs font-bold uppercase tracking-wider text-slate-400 py-1" aria-label="Breadcrumb">
          <ol className="flex items-center flex-wrap gap-2.5">
            <li>
              <Link href="/" className="hover:text-[var(--primary)] transition-colors">
                Trang chủ
              </Link>
            </li>
            <li className="text-slate-300">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </li>
            <li>
              <Link href="/category" className="hover:text-[var(--primary)] transition-colors">
                Danh mục
              </Link>
            </li>
            <li className="text-slate-300">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </li>
            {product.categorySlug && (
              <>
                <li>
                  <Link href={`/category/${product.categorySlug}`} className="hover:text-[var(--primary)] transition-colors text-[var(--primary)]">
                    {product.categorySlug}
                  </Link>
                </li>
                <li className="text-slate-300">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </li>
              </>
            )}
            <li className="text-slate-800 truncate max-w-[200px] sm:max-w-xs md:max-w-md" aria-current="page">
              {product.name}
            </li>
          </ol>
        </nav>

        {/* Top Section */}
        <ProductMainInfo product={product} />

        {/* Middle Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-2">
          <div className="lg:col-span-8 xl:col-span-9 space-y-6">
            <ProductDetailsSection product={product} />
          </div>
          <div className="lg:col-span-4 xl:col-span-3">
            <RelatedProductsSidebar products={relatedProducts} />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 border-t border-slate-100 pt-10">
          <ProductBottomSlider products={bossFavoriteProducts} />
        </div>
      </div>
    </main>
  );
}

