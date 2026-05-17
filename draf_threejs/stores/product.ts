// ===== TMFashion Product Store (Zustand) =====
// Quản lý danh sách sản phẩm, chi tiết sản phẩm
// Tương đương store/product.ts trong Nuxt (Pinia)

"use client";

import { create } from "zustand";
import { api } from "@/lib/api";

export interface Product {
  _id: string;
  name: string;
  alias?: string;
  sku?: string;
  price: number;
  compare_at_price?: number;
  image_url?: string;
  images?: string[];
  description?: string;
  // API trả về category_id / brand_id (populated)
  category_id?: { _id: string; name: string; slug?: string };
  brand_id?: { _id: string; name: string; slug?: string; logo_url?: string };
  // Alias cho tiện dùng
  category?: { _id: string; name: string; slug?: string };
  brand?: { _id: string; name: string; slug?: string; logo_url?: string };
  stock?: number;
  is_active?: boolean;
  model_3d_url?: string;
  rating?: number;
  review_count?: number;
  createdAt?: string;
}

interface ProductFilters {
  keyword?: string;
  category?: string;
  brand?: string;
  page?: number;
  limit?: number;
}

interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  relatedProducts: Product[];
  loading: boolean;
  totalPages: number;
  currentPage: number;
  total: number;

  // Actions
  getProducts: (filters?: ProductFilters) => Promise<void>;
  getProductDetail: (idOrSlug: string) => Promise<void>;
  clearCurrent: () => void;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  currentProduct: null,
  relatedProducts: [],
  loading: false,
  totalPages: 1,
  currentPage: 1,
  total: 0,

  getProducts: async (filters = {}) => {
    set({ loading: true });
    try {
      const params: Record<string, string | number | undefined> = {};
      if (filters.keyword) params.keyword = filters.keyword;
      if (filters.category) params.category = filters.category;
      if (filters.brand) params.brand = filters.brand;
      if (filters.page) params.page = filters.page;
      if (filters.limit) params.limit = filters.limit;

      const data = await api.get<{
        data: Product[];
        pagination: { page: number; limit: number; total: number; totalPages: number };
      }>("/products", params);

      set({
        products: data.data || [],
        totalPages: data.pagination?.totalPages || 1,
        currentPage: data.pagination?.page || 1,
        total: data.pagination?.total || 0,
        loading: false,
      });
    } catch {
      set({ loading: false });
    }
  },

  getProductDetail: async (idOrSlug) => {
    set({ loading: true });
    try {
      const data = await api.get<Product>(`/products/${idOrSlug}`);
      set({ currentProduct: data || null, loading: false });
    } catch {
      set({ loading: false, currentProduct: null });
    }
  },

  clearCurrent: () => set({ currentProduct: null }),
}));
