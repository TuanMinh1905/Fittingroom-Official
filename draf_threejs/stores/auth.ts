// ===== TMFashion Auth Store (Zustand) =====
// Quản lý đăng nhập, đăng ký, token JWT
// Tương đương store/auth.ts trong Nuxt (Pinia)

"use client";

import { create } from "zustand";
import { api, ApiError } from "@/lib/api";

export interface User {
  _id: string;
  email: string;
  fullName: string;
  phone?: string;
  address?: string;
  role: "ADMIN" | "CUSTOMER";
  createdAt?: string;
}

interface AuthState {
  user: User | null;
  token: string;
  loading: boolean;
  error: string;

  // Getters
  isLoggedIn: boolean;
  isAdmin: boolean;

  // Actions
  init: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
  }) => Promise<void>;
  fetchMe: () => Promise<void>;
  logout: () => void;
  setError: (error: string) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: "",
  loading: false,
  error: "",
  isLoggedIn: false,
  isAdmin: false,

  init: () => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("tmf_token") || "";
    const userStr = localStorage.getItem("tmf_user");
    let user: User | null = null;
    if (userStr) {
      try {
        user = JSON.parse(userStr);
      } catch {
        /* ignore */
      }
    }
    set({
      token,
      user,
      isLoggedIn: !!token,
      isAdmin: user?.role === "ADMIN",
    });
    // Fetch fresh user data if we have a token
    if (token) {
      get().fetchMe();
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: "" });
    try {
      const data = await api.post<{ token: string; user: { id: string; email: string; full_name: string; role: string } }>("/auth/login", {
        email,
        password,
      });
      // Map backend fields (full_name, role lowercase) → frontend format
      const user: User = {
        _id: data.user.id,
        email: data.user.email,
        fullName: data.user.full_name,
        role: data.user.role.toUpperCase() as "ADMIN" | "CUSTOMER",
      };
      localStorage.setItem("tmf_token", data.token);
      localStorage.setItem("tmf_user", JSON.stringify(user));
      set({
        user,
        token: data.token,
        isLoggedIn: true,
        isAdmin: user.role === "ADMIN",
        loading: false,
        error: "",
      });
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Đăng nhập thất bại";
      set({ loading: false, error: message });
      throw err;
    }
  },

  register: async (data) => {
    set({ loading: true, error: "" });
    try {
      // Backend expects full_name, not fullName
      const res = await api.post<{ token: string; user: { id: string; email: string; full_name: string; role: string } }>(
        "/auth/register",
        { email: data.email, password: data.password, full_name: data.fullName, phone: data.phone }
      );
      const user: User = {
        _id: res.user.id,
        email: res.user.email,
        fullName: res.user.full_name,
        role: res.user.role.toUpperCase() as "ADMIN" | "CUSTOMER",
      };
      localStorage.setItem("tmf_token", res.token);
      localStorage.setItem("tmf_user", JSON.stringify(user));
      set({
        user,
        token: res.token,
        isLoggedIn: true,
        isAdmin: user.role === "ADMIN",
        loading: false,
        error: "",
      });
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Đăng ký thất bại";
      set({ loading: false, error: message });
      throw err;
    }
  },

  fetchMe: async () => {
    try {
      const res = await api.get<{ user: { _id: string; email: string; full_name: string; role: string; phone?: string; address?: string } }>("/users/me");
      const raw = res.user;
      const user: User = {
        _id: raw._id,
        email: raw.email,
        fullName: raw.full_name,
        phone: raw.phone,
        address: raw.address,
        role: raw.role.toUpperCase() as "ADMIN" | "CUSTOMER",
      };
      localStorage.setItem("tmf_user", JSON.stringify(user));
      set({
        user,
        isLoggedIn: true,
        isAdmin: user.role === "ADMIN",
      });
    } catch {
      // Token hết hạn → logout
      get().logout();
    }
  },

  logout: () => {
    localStorage.removeItem("tmf_token");
    localStorage.removeItem("tmf_user");
    set({
      user: null,
      token: "",
      isLoggedIn: false,
      isAdmin: false,
      error: "",
    });
  },

  setError: (error) => set({ error }),
}));
