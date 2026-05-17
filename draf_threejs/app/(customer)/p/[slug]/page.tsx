// ===== TMFashion Product Detail Page =====
// Trang chi tiết sản phẩm (tương đương pages/p/[slug].vue)
// STM Người dùng mua hàng: Xem chi tiết → Thêm giỏ hàng → Mua

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Wrap from "@/components/base/Wrap";
import ProductCard from "@/components/product/ProductCard";
import { useProductStore } from "@/stores/product";
import { useCartStore } from "@/stores/cart";
import { useAuthStore } from "@/stores/auth";
import { formatVNDWithComma, discountPercent } from "@/utils";
import { api } from "@/lib/api";
import type { Product } from "@/stores/product";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const { currentProduct, loading, getProductDetail, clearCurrent } =
    useProductStore();
  const { addToCart } = useCartStore();
  const { isLoggedIn } = useAuthStore();

  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    getProductDetail(slug);
    return () => clearCurrent();
  }, [slug, getProductDetail, clearCurrent]);

  // Fetch related products
  useEffect(() => {
    if (currentProduct?.category) {
      api
        .get<{ data: Product[]; pagination: any }>("/products", {
          category: currentProduct.category._id,
          limit: 5,
        })
        .then((data) => {
          setRelatedProducts(
            (data.data || []).filter((p) => p._id !== currentProduct._id)
          );
        })
        .catch(() => {});
    }
  }, [currentProduct]);

  async function handleAddToCart() {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    if (!currentProduct) return;

    setAddingToCart(true);
    try {
      await addToCart(currentProduct._id, quantity);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch {
      alert("Lỗi thêm vào giỏ hàng");
    } finally {
      setAddingToCart(false);
    }
  }

  if (loading) {
    return (
      <Wrap className="py-12">
        <div className="animate-pulse">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-200 rounded-lg" />
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-6 bg-gray-200 rounded w-1/2" />
              <div className="h-10 bg-gray-200 rounded w-1/3" />
            </div>
          </div>
        </div>
      </Wrap>
    );
  }

  if (!currentProduct) {
    return (
      <Wrap className="py-12 text-center">
        <h2 className="text-xl text-gray-500">Không tìm thấy sản phẩm</h2>
        <Link href="/shop" className="text-primary hover:underline mt-4 inline-block">
          Quay lại cửa hàng
        </Link>
      </Wrap>
    );
  }

  const discount = currentProduct.compare_at_price
    ? discountPercent(currentProduct.price, currentProduct.compare_at_price)
    : 0;

  return (
    <div className="bg-white min-h-screen">
      <Wrap className="py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary">
            Trang chủ
          </Link>
          <span className="mx-2">/</span>
          <Link href="/shop" className="hover:text-primary">
            Cửa hàng
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800">{currentProduct.name}</span>
        </nav>

        {/* Product Info Grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg border bg-gray-50">
              <img
                src={currentProduct.image_url || "/placeholder.png"}
                alt={currentProduct.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div>
            {/* Brand */}
            {currentProduct.brand && (
              <Link
                href={`/brand/${currentProduct.brand.slug || currentProduct.brand._id}`}
                className="text-sm text-gray-500 hover:text-primary uppercase"
              >
                {currentProduct.brand.name}
              </Link>
            )}

            {/* Name */}
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mt-2 mb-4">
              {currentProduct.name}
            </h1>

            {/* Rating (hardcoded) */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-500">(5.0) | Đã bán 99+</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-red-500">
                {formatVNDWithComma(currentProduct.price)}đ
              </span>
              {currentProduct.compare_at_price &&
                currentProduct.compare_at_price > currentProduct.price && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      {formatVNDWithComma(currentProduct.compare_at_price)}đ
                    </span>
                    <span className="bg-red-100 text-red-600 text-sm font-bold px-2 py-1 rounded">
                      -{discount}%
                    </span>
                  </>
                )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-medium text-gray-700">
                Số lượng:
              </span>
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition text-lg"
                >
                  −
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition text-lg"
                >
                  +
                </button>
              </div>
              {currentProduct.stock !== undefined && (
                <span className="text-sm text-gray-500">
                  Còn {currentProduct.stock} sản phẩm
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="flex-1 py-4 bg-primary hover:bg-yellow-400 text-gray-800 font-bold rounded-lg transition disabled:opacity-50 text-lg"
              >
                {addingToCart ? "Đang thêm..." : "Thêm vào giỏ hàng"}
              </button>
            </div>

            {/* SKU */}
            {currentProduct.sku && (
              <p className="text-sm text-gray-400 mt-4">
                SKU: {currentProduct.sku}
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        {currentProduct.description && (
          <div className="mt-12 border-t pt-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              THÔNG TIN CHI TIẾT
            </h2>
            <div
              className="prose max-w-none text-gray-600"
              dangerouslySetInnerHTML={{ __html: currentProduct.description }}
            />
          </div>
        )}

        {/* Reviews Section (hardcoded) */}
        <div className="mt-12 border-t pt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            ĐÁNH GIÁ SẢN PHẨM
          </h2>
          <div className="space-y-4">
            {[
              { name: "Phạm Tuấn Minh", date: "15/01/2025", content: "Sản phẩm rất tốt, chất liệu đẹp, giao hàng nhanh!" },
              { name: "Đỗ Quang Thanh", date: "10/01/2025", content: "Đóng gói cẩn thận, sản phẩm đúng mô tả. Sẽ ủng hộ tiếp!" },
              { name: "Trịnh Gia Ngân", date: "05/01/2025", content: "Chất lượng ok, giá hợp lý. Recommend cho mọi người." },
            ].map((review, i) => (
              <div key={i} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-gray-800 font-bold flex-shrink-0">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-800">{review.name}</span>
                    <span className="text-xs text-gray-400">{review.date}</span>
                  </div>
                  <div className="flex mb-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <svg key={s} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">{review.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 border-t pt-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              SẢN PHẨM LIÊN QUAN
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {relatedProducts.slice(0, 5).map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </Wrap>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-[slideDown_0.3s_ease]">
          Đã thêm vào giỏ hàng!
        </div>
      )}
    </div>
  );
}
