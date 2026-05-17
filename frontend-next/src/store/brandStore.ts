import { create } from "zustand";

export type Brand = {
  _id: string;
  name: string;
  slug: string;
  sortOder: number;
  description?: string;
  logo?: string;
};

type BrandState = {
  brands: Brand[];
  loading: boolean;
  error: string | null;
  fetchBrands: () => Promise<void>;
};

const BRANDS_API = "http://localhost:8000/brand";

export const useBrandStore = create<BrandState>((set) => ({
  brands: [],
  loading: false,
  error: null,

  fetchBrands: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(BRANDS_API);
      if (!response.ok) {
        set({ loading: false, error: "Failed to fetch brands" });
        return;
      }

      const data = (await response.json()) as Brand[];
      set({ brands: Array.isArray(data) ? data : [], loading: false });
    } catch {
      set({ loading: false, error: "Failed to fetch brands" });
    }
  },
}));