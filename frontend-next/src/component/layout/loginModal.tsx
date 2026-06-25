"use client";

import { useState } from "react";

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isLoginView ? "/auth/login" : "/auth/register";
      const body = isLoginView
        ? { email, password }
        : { name, email, password };

      const response = await fetch(`http://localhost:8003${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Có lỗi xảy ra");
      } else {
        alert(isLoginView ? "Đăng nhập thành công!" : "Đăng ký thành công!");
        localStorage.setItem("user", JSON.stringify(data.user));
        window.dispatchEvent(new Event("loginSuccess"));
        onClose();
      }
    } catch (err) {
      setError("Không thể kết nối tới server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">
            {isLoginView ? "Đăng nhập" : "Đăng ký"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold"
          >
            Đóng
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLoginView && (
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Họ tên
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLoginView}
                className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Mật khẩu
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-xl bg-[var(--primary)] py-3 font-semibold text-white transition hover:bg-[var(--primary-hover)] disabled:opacity-70"
          >
            {loading ? "Đang xử lý..." : isLoginView ? "Đăng nhập" : "Đăng ký"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          {isLoginView ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
          <button
            onClick={() => {
              setIsLoginView(!isLoginView);
              setError("");
            }}
            className="font-semibold text-[var(--primary)] hover:underline"
          >
            {isLoginView ? "Đăng ký ngay" : "Đăng nhập"}
          </button>
        </div>
      </div>
    </div>
  );
}
