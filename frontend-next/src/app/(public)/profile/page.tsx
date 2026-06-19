"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: "",
        phone: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                setFormData({
                    name: parsedUser.name || "",
                    email: parsedUser.email || "",
                    address: parsedUser.address || "",
                    phone: parsedUser.phone || "",
                });
            } catch (e) {
                router.push("/");
            }
        } else {
            router.push("/");
        }
    }, [router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ type: "", text: "" });

        try {
            const res = await fetch(`http://localhost:8000/users/${user._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: "success", text: "Cập nhật thông tin thành công!" });
                // Update local storage
                localStorage.setItem("user", JSON.stringify(data.user));
                // Dispatch event to update navbar if needed, though navbar reads from localStorage on load
                window.dispatchEvent(new Event("loginSuccess"));
            } else {
                setMessage({ type: "error", text: data.message || "Có lỗi xảy ra" });
            }
        } catch (error) {
            setMessage({ type: "error", text: "Không thể kết nối đến server" });
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-[var(--primary)] px-8 py-10 text-center">
                    <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-white text-[var(--primary)] text-4xl font-bold shadow-md mb-4">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <h1 className="text-3xl font-longreach text-white">Hồ sơ của bạn</h1>
                    <p className="text-white/80 font-monasans mt-2">Quản lý thông tin cá nhân và bảo mật</p>
                </div>

                <div className="p-8">
                    {message.text && (
                        <div className={`p-4 rounded-xl mb-6 font-monasans ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2 font-monasans">
                                    Họ và Tên
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 font-monasans outline-none transition focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2 font-monasans">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    readOnly // Thường không cho đổi email, hoặc nếu cho thì phải verify
                                    className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 font-monasans outline-none text-slate-500 cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2 font-monasans">
                                    Số điện thoại
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Nhập số điện thoại..."
                                    className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 font-monasans outline-none transition focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2 font-monasans">
                                    Địa chỉ
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Nhập địa chỉ nhận hàng..."
                                    className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 font-monasans outline-none transition focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
                                />
                            </div>
                        </div>

                        <div className="pt-6 flex items-center justify-end border-t border-slate-100">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex h-12 items-center justify-center rounded-xl bg-[var(--primary)] px-8 font-semibold text-white transition hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
