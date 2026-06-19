"use client";

import { useState, useEffect } from "react";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is already logged in as admin
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user && user.role === "admin") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (e) {
        setIsAdmin(false);
      }
    } else {
      setIsAdmin(false);
    }
  }, []);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Đăng nhập thất bại");
      } else {
        if (data.user.role === "admin") {
          localStorage.setItem("user", JSON.stringify(data.user));
          window.dispatchEvent(new Event("loginSuccess"));
          setIsAdmin(true);
        } else {
          setError("Tài khoản này không có quyền truy cập Admin");
        }
      }
    } catch (err) {
      setError("Không thể kết nối tới server");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsAdmin(false);
    window.dispatchEvent(new Event("loginSuccess")); // Cập nhật cả Navbar public nếu mở tab chung
    window.location.reload();
  };

  // Hiển thị form đăng nhập Admin nếu chưa đăng nhập quyền admin
  if (isAdmin === false) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-sm">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400 text-2xl font-black text-slate-950">
              A
            </div>
            <h2 className="text-2xl font-bold text-white">Admin Login</h2>
            <p className="mt-2 text-sm text-slate-400">Đăng nhập tài khoản quản trị</p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl bg-red-500/10 p-4 text-sm text-red-400 border border-red-500/20">
              {error}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-300">Mật khẩu</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full rounded-xl bg-cyan-400 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-70"
            >
              {loading ? "Đang xử lý..." : "Đăng nhập Admin"}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-cyan-400 hover:underline">← Quay về trang chủ</a>
          </div>
        </div>
      </div>
    );
  }

  // Nếu chưa load xong trạng thái (isAdmin === null), hiển thị màn hình trống mượt
  if (isAdmin === null) {
    return <div className="min-h-screen bg-slate-950"></div>;
  }

  // Render Admin Layout chính khi đã có quyền
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="border-b border-slate-800 bg-slate-900/95 px-6 py-6 lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400 text-lg font-black text-slate-950">
              A
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Admin</p>
              <h1 className="text-xl font-semibold text-white">TMF Control</h1>
            </div>
          </div>

          <nav className="mt-8 space-y-2 text-sm font-medium text-slate-300">
            <a className="block rounded-xl bg-slate-800/80 px-4 py-3 text-white" href="/admin">
              Dashboard
            </a>
            <a className="block rounded-xl px-4 py-3 transition hover:bg-slate-800 hover:text-white" href="/admin/products">
              Products
            </a>
            <a className="block rounded-xl px-4 py-3 transition hover:bg-slate-800 hover:text-white" href="/admin/categories">
              Categories
            </a>
            <a className="block rounded-xl px-4 py-3 transition hover:bg-slate-800 hover:text-white" href="/admin/brands">
              Brands
            </a>
            <a className="block rounded-xl px-4 py-3 transition hover:bg-slate-800 hover:text-white" href="/admin/orders">
              Orders
            </a>
            <a className="block rounded-xl px-4 py-3 transition hover:bg-slate-800 hover:text-white" href="/admin/users">
              Users
            </a>
          </nav>

          <div className="mt-8 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm text-cyan-100">
            <p className="font-semibold">Admin layout riêng</p>
            <p className="mt-1 text-cyan-100/80">Không dùng chung navbar/footer của public site.</p>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-slate-800 bg-slate-950/90 px-6 py-4 backdrop-blur">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Management area</p>
              <h2 className="text-lg font-semibold text-white">Admin dashboard</h2>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-300 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50 transition"
            >
              Đăng xuất
            </button>
          </header>

          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}