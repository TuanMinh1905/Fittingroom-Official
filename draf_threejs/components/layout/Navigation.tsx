// ===== TMFashion Navigation Component =====
// Thanh điều hướng chính (tương đương components/layout/Navigation.vue)
// Logo TMF 60px + nav links + search bar với sticker + cart + auth

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/stores/auth";
import { useCartStore } from "@/stores/cart";
import { api } from "@/lib/api";

interface SearchProduct {
  _id: string;
  name: string;
  image_url?: string;
  price: number;
}

export default function Navigation() {
  const router = useRouter();
  const { user, isLoggedIn, isAdmin, logout } = useAuthStore();
  const cartStore = useCartStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchProduct[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Init auth on mount
  useEffect(() => {
    useAuthStore.getState().init();
  }, []);

  // Fetch cart khi đã đăng nhập
  useEffect(() => {
    if (isLoggedIn) {
      cartStore.fetchCart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  // Close menus on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearch(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Search autocomplete
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      setShowSearch(false);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const data = await api.get<{ data: SearchProduct[]; pagination: any }>("/products", {
          keyword: searchQuery,
          limit: 5,
        });
        setSearchResults(data.data || []);
        setShowSearch(true);
      } catch {
        /* ignore */
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  function handleLogout() {
    logout();
    router.push("/");
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
    }
  }

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex items-center justify-between h-[70px]">
          {/* Logo TMF — giống Nuxt: font-Longreach 60px */}
          <Link href="/" className="flex-shrink-0">
            <span className="text-[48px] lg:text-[60px] text-primary font-[var(--font-longreach)] leading-none">
              TMF
            </span>
          </Link>

          {/* Nav Links (Desktop) — giống Nuxt: Trang chủ, Danh mục, Giới thiệu, Tạp chí */}
          <div className="hidden md:flex items-center gap-5 ml-6">
            <Link href="/" className="text-[14px] text-gray-tmf hover:text-primary transition font-medium">
              Trang chủ
            </Link>
            <Link href="/shop" className="text-[14px] text-gray-tmf hover:text-primary transition font-medium">
              Danh mục
            </Link>
            <Link href="/introduce" className="text-[14px] text-gray-tmf hover:text-primary transition font-medium">
              Giới thiệu
            </Link>
            <Link href="/fitting-room" className="text-[14px] text-gray-tmf hover:text-primary transition font-medium">
              Phòng thử đồ
            </Link>
          </div>

          {/* Search Bar — giống Nuxt: border-2 border-primary rounded-[12px] + sticker */}
          <div className="flex-1 max-w-[328px] mx-4 relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative">
              {/* Sticker image on left — giống Nuxt icon_thanhsearch.png */}
              <img
                src="/icon_thanhsearch.png"
                alt=""
                className="absolute left-[-12px] top-1/2 -translate-y-1/2 w-[40px] h-[40px] z-10 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-[8px] border-2 border-primary rounded-[12px] text-[13px] focus:outline-none focus:ring-1 focus:ring-primary bg-white"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <svg
                  className="h-[18px] w-[18px] text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </form>

            {/* Autocomplete dropdown */}
            {showSearch && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border-2 border-primary rounded-[12px] shadow-lg mt-1 z-50 overflow-hidden">
                {searchResults.map((p) => (
                  <Link
                    key={p._id}
                    href={`/p/${p._id}`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition"
                    onClick={() => setShowSearch(false)}
                  >
                    <img
                      src={p.image_url || "/placeholder.png"}
                      alt={p.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <span className="text-[13px] text-gray-700 line-clamp-1">
                      {p.name}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Right Side: Cart + User — giống Nuxt */}
          <div className="flex items-center gap-3">
            {/* Cart icon */}
            <Link href="/checkout" className="relative p-2 text-gray-tmf hover:text-primary transition">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {cartStore.totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartStore.totalItems}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isLoggedIn ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUserMenu(!showUserMenu);
                  }}
                  className="flex items-center gap-2 p-2 text-gray-tmf hover:text-primary transition"
                >
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-[13px] font-bold text-white">
                    {user?.fullName?.charAt(0) || "U"}
                  </div>
                  <span className="hidden lg:block text-[13px] font-medium text-gray-tmf">
                    {user?.fullName || "User"}
                  </span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                    <Link
                      href="/account"
                      className="block px-4 py-3 text-[13px] text-gray-700 hover:bg-gray-50 transition"
                    >
                      Tài khoản
                    </Link>
                    <Link
                      href="/account/orders"
                      className="block px-4 py-3 text-[13px] text-gray-700 hover:bg-gray-50 transition"
                    >
                      Đơn hàng
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="block px-4 py-3 text-[13px] text-gray-700 hover:bg-gray-50 transition"
                      >
                        Quản trị
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-[13px] text-red-500 hover:bg-gray-50 border-t transition"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2 text-[13px]">
                <Link
                  href="/login"
                  className="text-gray-tmf hover:text-primary transition font-medium"
                >
                  Đăng nhập
                </Link>
                <span className="text-gray-300">|</span>
                <Link
                  href="/register"
                  className="text-gray-tmf hover:text-primary transition font-medium"
                >
                  Đăng ký
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t py-4 space-y-2">
            <Link href="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded">
              Trang chủ
            </Link>
            <Link href="/shop" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded">
              Danh mục
            </Link>
            <Link href="/introduce" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded">
              Giới thiệu
            </Link>
            <Link href="/fitting-room" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded">
              Phòng thử đồ
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
