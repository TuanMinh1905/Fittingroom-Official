import { create } from "zustand";

export type SizeMeasurement = {
  size: string;
  length_cm?: number;
  chest_half_cm?: number;
  shoulder_cm?: number;
  waist_cm?: number;
  hip_cm?: number;
};

export type Product = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number;
  description: string;
  imageUrl?: string;
  categorySlug?: string;
  rating?: number;
  soldCount?: number;
  brand?: string;
  expiryDate?: string;
  stock?: number;
  shippingInfo?: string;
  number?: string | number;
  size?: string;
  color?: string;
  sizes?: string[];
  colorCodes?: string[];
  sizeChart?: SizeMeasurement[];
  // TailorNet garment type — được lưu từ DB, dùng để chọn đúng AI model khi thử đồ ảo
  // Ví dụ: 't-shirt' | 'shirt' | 'pant' | 'short-pant' | 'skirt'
  garment_type?: string;
};

type ProductState = {
  products: Product[];
  categoryProducts: Product[];
  brandProducts: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  fetchProductsByCategory: (categorySlug: string) => Promise<void>;
  fetchProductsByBrand: (brandSlug: string) => Promise<void>;
};

const PRODUCTS_API = "http://localhost:8003/products";

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  categoryProducts: [],
  brandProducts: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(PRODUCTS_API);
      if (!response.ok) {
        set({ loading: false, error: "Khong lay duoc du lieu tu /products" });
        return;
      }

      const data = (await response.json()) as Product[];
      set({ products: Array.isArray(data) ? data : [], loading: false });
    } catch {
      set({ loading: false, error: "Khong lay duoc du lieu tu /products" });
    }
  },

  fetchProductsByCategory: async (categorySlug: string) => {
    set({ loading: true, error: null, categoryProducts: [] });
    try {
      const response = await fetch(`${PRODUCTS_API}/category/${categorySlug}`);
      if (!response.ok) {
        set({ loading: false, error: `Khong lay duoc du lieu tu danh muc ${categorySlug}` });
        return;
      }

      const data = (await response.json()) as Product[];
      set({ categoryProducts: Array.isArray(data) ? data : [], loading: false });
    } catch {
      set({ loading: false, error: `Khong lay duoc du lieu tu danh muc ${categorySlug}` });
    }
  },

  fetchProductsByBrand: async (brandSlug: string) => {
    set({ loading: true, error: null, brandProducts: [] });
    try {
      const response = await fetch(`${PRODUCTS_API}/brand/${brandSlug}`);
      if (!response.ok) {
        set({ loading: false, error: `Khong lay duoc du lieu tu thuong hieu ${brandSlug}` });
        return;
      }

      const data = (await response.json()) as Product[];
      set({ brandProducts: Array.isArray(data) ? data : [], loading: false });
    } catch {
      set({ loading: false, error: `Khong lay duoc du lieu tu thuong hieu ${brandSlug}` });
    }
  },
}));
