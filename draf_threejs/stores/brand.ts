// ===== TMFashion Brand Store (Zustand) =====
// Tương đương store/brand.ts trong Nuxt (Pinia)

"use client";

import { create } from "zustand";
import { api } from "@/lib/api";

export interface Brand {
  _id: string;
  name: string;
  slug?: string;
  logo_url?: string;
  description?: string;
}

interface BrandState {
  brands: Brand[];
  currentBrand: Brand | null;
  brandProducts: import("./product").Product[];
  loading: boolean;
  getBrands: () => Promise<void>;
  getBrandDetail: (idOrSlug: string) => Promise<void>;
}

export const useBrandStore = create<BrandState>((set) => ({
  brands: [],
  currentBrand: null,
  brandProducts: [],
  loading: false,

  getBrands: async () => {
    set({ loading: true });
    try {
      const res = await api.get<{ data: Brand[] }>("/brands");
      const brands = Array.isArray(res) ? res : (res.data || []);
      set({ brands, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  getBrandDetail: async (idOrSlug) => {
    set({ loading: true });
    try {
      const data = await api.get<{ brand: Brand }>(`/brands/${idOrSlug}`);
      set({ currentBrand: data.brand || null, loading: false });
      // Fetch products by brand
      const products = await api.get<{ products: import("./product").Product[] }>(
        "/products",
        { brand: idOrSlug }
      );
      set({ brandProducts: products.products || [] });
    } catch {
      set({ loading: false });
    }
  },
}));
