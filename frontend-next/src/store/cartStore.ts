import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "./productStore";

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find((item) => item._id === product._id);
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item._id === product._id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          return { items: [...state.items, { ...product, quantity }] };
        });
      },

      removeFromCart: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item._id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item._id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const priceToUse = item.discountPrice || item.price;
          return total + priceToUse * item.quantity;
        }, 0);
      },
    }),
    {
      name: "tmf-cart-storage", // Tên key lưu trong localStorage
    }
  )
);

export const SHIPPING_THRESHOLD = 500000;
export const SHIPPING_FEE = 30000;

export const calculateShippingFee = (subtotal: number) => {
  if (subtotal === 0 || subtotal >= SHIPPING_THRESHOLD) {
    return 0;
  }
  return SHIPPING_FEE;
};
