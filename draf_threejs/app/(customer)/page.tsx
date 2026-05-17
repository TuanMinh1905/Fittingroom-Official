// ===== TMFashion Home Page =====
// Trang chủ (tương đương pages/index.vue)
// SD: Quản lý sản phẩm → Hiển thị danh sách sản phẩm cho người dùng

"use client";

import { useEffect } from "react";
import Wrap from "@/components/base/Wrap";
import BannerListSlider from "@/components/banner/ListSlider";
import BannerDownload from "@/components/banner/Download";
import HomeAction from "@/components/home/HomeAction";
import BrandList from "@/components/brand/BrandList";
import ListProductVertical from "@/components/product/ListProductVertical";
import { useProductStore } from "@/stores/product";
import { useCategoryStore } from "@/stores/category";
import { useBrandStore } from "@/stores/brand";

export default function HomePage() {
  const { products, loading, getProducts } = useProductStore();
  const { categories, getCategories } = useCategoryStore();
  const { brands, getBrands } = useBrandStore();

  useEffect(() => {
    getProducts({ limit: 50 });
    getCategories();
    getBrands();
  }, [getProducts, getCategories, getBrands]);

  return (
    <div className="pb-8 bg-color-layout">
      {/* Banner Slider — giống Nuxt */}
      <Wrap className="pt-4">
        <BannerListSlider />
      </Wrap>

      {/* Home Action / Quick Category Icons — giống Nuxt HomeAction.vue */}
      <Wrap className="bg-white mt-4 rounded-xl">
        <HomeAction />
      </Wrap>

      {/* Brand List — giống Nuxt */}
      <Wrap className="bg-white mt-4 rounded-xl px-6">
        <BrandList brands={brands} />
      </Wrap>

      {/* Product Grid — giống Nuxt: "Sản phẩm nổi bật" */}
      <Wrap className="bg-white mt-4 rounded-xl px-6 pb-10">
        <h2 className="text-[18px] md:text-[20px] font-bold text-text-brand pt-6 mb-2">
          Sản phẩm nổi bật
        </h2>
        <ListProductVertical products={products} loading={loading} />
      </Wrap>

      {/* Download App Banner — giống Nuxt */}
      <Wrap className="mt-5 mb-5">
        <BannerDownload />
      </Wrap>
    </div>
  );
}
