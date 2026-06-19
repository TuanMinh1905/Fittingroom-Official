import { create } from "zustand";

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
};

type ProductState = {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
};

const PRODUCTS_API = "http://localhost:8000/products";

export const useProductStore = create<ProductState>((set) => ({
  products: [],
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
}));
