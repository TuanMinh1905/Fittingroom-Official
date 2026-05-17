// ===== TMFashion Cart Store (Zustand) =====
// Quản lý giỏ hàng
// Tương đương store/cart.ts trong Nuxt (Pinia)

"use client";

import { create } from "zustand";
import { api } from "@/lib/api";

export interface CartItemProduct {
  _id: string;
  name: string;
  image_url?: string;
  price: number;
  compare_at_price?: number;
}

export interface CartItem {
  _id: string;
  product: CartItemProduct;
  quantity: number;
}

export interface Cart {
  _id: string;
  items: CartItem[];
}

interface CartState {
  cart: Cart | null;
  loading: boolean;

  // Getters
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  isEmpty: boolean;

  // Actions
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  loading: false,

  // Computed getters
  get items() {
    return get().cart?.items || [];
  },
  get totalItems() {
    return (get().cart?.items || []).reduce((sum, item) => sum + item.quantity, 0);
  },
  get totalAmount() {
    return (get().cart?.items || []).reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  },
  get isEmpty() {
    return (get().cart?.items || []).length === 0;
  },

  fetchCart: async () => {
    set({ loading: true });
    try {
      const data = await api.get<{ items: CartItem[]; totalItems: number; totalAmount: number }>("/cart");
      const items = data.items || [];
      const totalItems = data.totalItems || 0;
      const totalAmount = data.totalAmount || 0;
      set({
        cart: { _id: "current", items },
        loading: false,
        items,
        totalItems,
        totalAmount,
        isEmpty: items.length === 0,
      });
    } catch {
      set({ loading: false });
    }
  },

  addToCart: async (productId, quantity = 1) => {
    try {
      await api.post("/cart/items", { product_id: productId, quantity });
      await get().fetchCart();
    } catch (err) {
      console.error("Lỗi thêm giỏ hàng:", err);
      throw err;
    }
  },

  updateQuantity: async (itemId, quantity) => {
    try {
      await api.put(`/cart/items/${itemId}`, { quantity });
      await get().fetchCart();
    } catch (err) {
      console.error("Lỗi cập nhật số lượng:", err);
      throw err;
    }
  },

  removeItem: async (itemId) => {
    try {
      await api.delete(`/cart/items/${itemId}`);
      await get().fetchCart();
    } catch (err) {
      console.error("Lỗi xóa sản phẩm:", err);
      throw err;
    }
  },

  clearCart: () => {
    set({
      cart: null,
      items: [],
      totalItems: 0,
      totalAmount: 0,
      isEmpty: true,
    });
  },
}));
