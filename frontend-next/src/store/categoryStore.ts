import { create } from "zustand";

export type Category = {
  _id?: string;
  name: string;
  slug: string;
  sortOder: number;
  imageCategory?: string;
  parentSlug?: string | null;
};

type CategoryState = {
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  createCategory: (data: Omit<Category, "_id">) => Promise<void>;
  updateCategory: (id: string, data: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
};

const API_URL = "http://localhost:8003/category";

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  loading: false,
  error: null,

  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        set({ error: "Failed to fetch categories" });
        return;
      }
      const data = (await response.json()) as Category[];
      set({ categories: Array.isArray(data) ? data : [], loading: false });
    } catch (error) {
      set({ error: "Failed to fetch categories" });
    } finally {
      set({ loading: false });
    }
  },

  createCategory: async (data: Omit<Category, "_id">) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        set({ error: "Failed to create category" });
        return;
      }
      const newCategory = (await response.json()) as Category;
      set((state) => ({
        categories: [...state.categories, newCategory],
        loading: false,
      }));
    } catch (error) {
      set({ error: "Failed to create category" });
    } finally {
      set({ loading: false });
    }
  },

  updateCategory: async (id: string, data: Partial<Category>) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        set({ error: "Failed to update category" });
        return;
      }
      const updated = (await response.json()) as Category;
      set((state) => ({
        categories: state.categories.map((cat) =>
          cat._id === id ? updated : cat
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: "Failed to update category" });
    } finally {
      set({ loading: false });
    }
  },

  deleteCategory: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        set({ error: "Failed to delete category" });
        return;
      }
      set((state) => ({
        categories: state.categories.filter((cat) => cat._id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: "Failed to delete category" });
    } finally {
      set({ loading: false });
    }
  },
}));
