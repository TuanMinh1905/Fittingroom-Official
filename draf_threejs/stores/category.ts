// ===== TMFashion Category Store (Zustand) =====
// Tương đương store/category.ts trong Nuxt (Pinia)

"use client";

import { create } from "zustand";
import { api } from "@/lib/api";

export interface Category {
  _id: string;
  name: string;
  slug?: string;
  parent?: string | null;
  children?: Category[];
  sort_order?: number;
  is_active?: boolean;
}

interface CategoryState {
  categories: Category[];
  loading: boolean;
  getCategories: () => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  loading: false,

  getCategories: async () => {
    set({ loading: true });
    try {
      const res = await api.get<{ data: Category[] }>("/categories");
      const categories = Array.isArray(res) ? res : (res.data || []);
      set({ categories, loading: false });
    } catch {
      set({ loading: false });
    }
  },
}));
