"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type TabType = "profile" | "orders" | "security";

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<TabType>("profile");
    
    // Form fields
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: "",
        phone: "",
        gender: "other",
        birthday: "",
    });
    
    // Password state
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [isPasswordLoading, setIsPasswordLoading] = useState(false);

    // Orders state
    const [orders, setOrders] = useState<any[]>([]);
    const [isOrdersLoading, setIsOrdersLoading] = useState(false);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    // Check auth on load
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
                    gender: parsedUser.gender || "other",
                    birthday: parsedUser.birthday || "",
                });
            } catch (e) {
                router.push("/");
            }
        } else {
            router.push("/");
        }
    }, [router]);

    // Fetch orders when orders tab is active
    useEffect(() => {
        if (activeTab === "orders" && user) {
            fetchOrders();
        }
    }, [activeTab, user]);

    const fetchOrders = async () => {
        setIsOrdersLoading(true);
        try {
            const res = await fetch("http://localhost:8000/orders");
            if (res.ok) {
                const data = await res.json();
                // Filter orders by phone matching user's phone or form phone
                const searchPhone = user.phone || formData.phone;
                const userOrders = data.filter((order: any) => {
                    const phoneClean = order.phoneNumber?.replace(/\s+/g, "");
                    const targetClean = searchPhone?.replace(/\s+/g, "");
                    return phoneClean && targetClean && phoneClean === targetClean;
                });
                setOrders(userOrders);
            }
        } catch (error) {
            console.error("Lỗi khi tải đơn hàng:", error);
            toast.error("Không thể tải danh sách đơn hàng");
        } finally {
            setIsOrdersLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

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
                toast.success("Cập nhật thông tin thành công!");
                // Update local storage
                const updatedUser = { ...user, ...data.user };
                localStorage.setItem("user", JSON.stringify(updatedUser));
                setUser(updatedUser);
                // Dispatch event to update navbar
                window.dispatchEvent(new Event("loginSuccess"));
            } else {
                toast.error(data.message || "Có lỗi xảy ra");
            }
        } catch (error) {
            toast.error("Không thể kết nối đến server");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            toast.error("Vui lòng điền đầy đủ các trường mật khẩu");
            return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp!");
            return;
        }
        setIsPasswordLoading(true);

        try {
            const res = await fetch(`http://localhost:8000/users/${user._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    password: passwordData.currentPassword,
                    newPassword: passwordData.newPassword,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Thay đổi mật khẩu thành công!");
                setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                });
                // Cập nhật lại mật khẩu trong state user hiện tại
                const updatedUser = { ...user, password: passwordData.newPassword };
                localStorage.setItem("user", JSON.stringify(updatedUser));
                setUser(updatedUser);
            } else {
                toast.error(data.message || "Có lỗi xảy ra");
            }
        } catch (error) {
            toast.error("Không thể kết nối đến server");
        } finally {
            setIsPasswordLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
        toast.success("Đăng xuất thành công!");
        router.push("/");
        setTimeout(() => {
            window.location.reload();
        }, 100);
    };

    // Calculate profile completeness score
    const calculateCompleteness = () => {
        let score = 0;
        if (formData.name) score += 20;
        if (formData.email) score += 20;
        if (formData.phone) score += 20;
        if (formData.address) score += 20;
        if (formData.gender && formData.gender !== "other") score += 10;
        if (formData.birthday) score += 10;
        return score;
    };

    const getStatusStyle = (status: string) => {
        switch (status.toLowerCase()) {
            case "pending":
                return "bg-amber-50 text-amber-700 border-amber-200";
            case "delivering":
            case "shipping":
                return "bg-blue-50 text-blue-700 border-blue-200";
            case "completed":
            case "success":
                return "bg-green-50 text-green-700 border-green-200";
            case "cancelled":
            case "failed":
                return "bg-rose-50 text-rose-700 border-rose-200";
            default:
                return "bg-slate-50 text-slate-700 border-slate-200";
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status.toLowerCase()) {
            case "pending":
                return "Chờ xử lý";
            case "delivering":
            case "shipping":
                return "Đang giao hàng";
            case "completed":
            case "success":
                return "Đã hoàn thành";
            case "cancelled":
            case "failed":
                return "Đã hủy";
            default:
                return status;
        }
    };

    if (!user) return null;

    const completeness = calculateCompleteness();

    return (
        <div className="min-h-screen bg-slate-50/50 py-8 px-2 font-monasans">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* 1. SIDEBAR COLUMN */}
                <div className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-6">
                    {/* User Info & Avatar Card */}
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col items-center text-center">
                        <div className="relative group mb-4">
                            <div className="absolute inset-0 bg-gradient-to-tr from-sky-400 to-[var(--primary)] rounded-full animate-pulse opacity-10"></div>
                            <div className="relative h-24 w-24 rounded-full border-4 border-white shadow-xl bg-gradient-to-tr from-[var(--primary)] to-sky-300 text-white flex items-center justify-center text-3xl font-bold font-longreach transition-transform duration-300 group-hover:scale-105">
                                {formData.name ? formData.name.charAt(0).toUpperCase() : user.name.charAt(0).toUpperCase()}
                            </div>
                        </div>

                        <h2 className="text-xl font-bold text-slate-800 line-clamp-1">{formData.name || user.name}</h2>
                        <p className="text-xs text-slate-400 mt-1 mb-3 font-medium">{user.email}</p>
                        
                        {/* Member Level Badge */}
                        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-bold uppercase tracking-wider mb-5">
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span>{user.role === "admin" ? "Quản trị viên" : "Thành viên Vàng"}</span>
                        </div>

                        {/* Completeness Tracker Widget */}
                        <div className="w-full border-t border-slate-100 pt-4 text-left">
                            <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
                                <span>Độ hoàn thiện hồ sơ</span>
                                <span className="text-[var(--primary)]">{completeness}%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                <div 
                                    className="bg-gradient-to-r from-sky-400 to-[var(--primary)] h-full rounded-full transition-all duration-700 ease-out"
                                    style={{ width: `${completeness}%` }}
                                ></div>
                            </div>
                            {completeness < 100 && (
                                <p className="text-[10px] text-slate-400 mt-2 font-medium">
                                    Cập nhật thêm SĐT, địa chỉ, giới tính để đạt 100%.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Navigation Menu Card */}
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-3 flex flex-col gap-1">
                        <button
                            onClick={() => setActiveTab("profile")}
                            className={`flex items-center space-x-3.5 px-4 py-3.5 rounded-2xl transition-all duration-300 font-semibold text-sm text-left ${
                                activeTab === "profile"
                                    ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                            }`}
                        >
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                            </svg>
                            <span>Thông tin cá nhân</span>
                        </button>

                        <button
                            onClick={() => setActiveTab("orders")}
                            className={`flex items-center space-x-3.5 px-4 py-3.5 rounded-2xl transition-all duration-300 font-semibold text-sm text-left ${
                                activeTab === "orders"
                                    ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                            }`}
                        >
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                            </svg>
                            <span>Đơn hàng của tôi</span>
                        </button>

                        <button
                            onClick={() => setActiveTab("security")}
                            className={`flex items-center space-x-3.5 px-4 py-3.5 rounded-2xl transition-all duration-300 font-semibold text-sm text-left ${
                                activeTab === "security"
                                    ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                            }`}
                        >
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                            </svg>
                            <span>Bảo mật tài khoản</span>
                        </button>

                        <div className="h-px bg-slate-100 my-2"></div>

                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-3.5 px-4 py-3.5 rounded-2xl transition-all duration-300 font-semibold text-sm text-left text-rose-500 hover:bg-rose-50/50 cursor-pointer"
                        >
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                            </svg>
                            <span>Đăng xuất</span>
                        </button>
                    </div>
                </div>

                {/* 2. DETAIL PANEL CONTENT AREA */}
                <div className="flex-1 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 min-h-[500px]">
                    
                    {/* TAB 1: PERSONAL INFORMATION */}
                    {activeTab === "profile" && (
                        <div>
                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-slate-800">Thông tin cá nhân</h3>
                                <p className="text-slate-400 text-xs mt-1 font-medium">Cập nhật hồ sơ của bạn để cá nhân hóa trải nghiệm mua sắm</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Name Input */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-monasans">
                                            Họ và tên
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                placeholder="Nhập họ và tên của bạn..."
                                                className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 pl-11 pr-4 py-3.5 font-monasans outline-none transition-all duration-300 focus:border-[var(--primary)] focus:bg-white focus:ring-4 focus:ring-[var(--primary)]/10 text-slate-700 font-semibold"
                                            />
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Email Input (ReadOnly) */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-monasans">
                                            Email liên hệ
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                readOnly
                                                className="w-full rounded-2xl border border-slate-100 bg-slate-100 pl-11 pr-10 py-3.5 font-monasans outline-none text-slate-400 cursor-not-allowed font-medium"
                                            />
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                                </svg>
                                            </div>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group cursor-help" title="Email không thể thay đổi để bảo mật tài khoản">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Phone Input */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-monasans">
                                            Số điện thoại
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="Nhập số điện thoại..."
                                                className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 pl-11 pr-4 py-3.5 font-monasans outline-none transition-all duration-300 focus:border-[var(--primary)] focus:bg-white focus:ring-4 focus:ring-[var(--primary)]/10 text-slate-700 font-semibold"
                                            />
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.302a12.017 12.017 0 01-9.09-9.09c-.242-.44-.076-.927.301-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Address Input */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-monasans">
                                            Địa chỉ nhận hàng
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                placeholder="Nhập địa chỉ giao hàng..."
                                                className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 pl-11 pr-4 py-3.5 font-monasans outline-none transition-all duration-300 focus:border-[var(--primary)] focus:bg-white focus:ring-4 focus:ring-[var(--primary)]/10 text-slate-700 font-semibold"
                                            />
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1115 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Gender (Select Dropdown styled beautifully) */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-monasans">
                                            Giới tính
                                        </label>
                                        <div className="relative">
                                            <select
                                                name="gender"
                                                value={formData.gender}
                                                onChange={handleChange}
                                                className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 pl-11 pr-4 py-3.5 font-monasans outline-none transition-all duration-300 focus:border-[var(--primary)] focus:bg-white focus:ring-4 focus:ring-[var(--primary)]/10 text-slate-700 font-semibold appearance-none cursor-pointer"
                                            >
                                                <option value="male">Nam</option>
                                                <option value="female">Nữ</option>
                                                <option value="other">Khác</option>
                                            </select>
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                                                </svg>
                                            </div>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Birthday Input */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-monasans">
                                            Ngày sinh
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                name="birthday"
                                                value={formData.birthday}
                                                onChange={handleChange}
                                                className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 pl-11 pr-4 py-3.5 font-monasans outline-none transition-all duration-300 focus:border-[var(--primary)] focus:bg-white focus:ring-4 focus:ring-[var(--primary)]/10 text-slate-700 font-semibold cursor-pointer"
                                            />
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 flex items-center justify-end border-t border-slate-100">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex items-center space-x-2 h-12 rounded-2xl bg-[var(--primary)] px-8 font-semibold text-white shadow-md shadow-[var(--primary)]/20 transition-all duration-300 hover:scale-105 hover:bg-slate-900 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        {isLoading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span>Đang lưu...</span>
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                </svg>
                                                <span>Lưu thay đổi</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* TAB 2: MY ORDERS */}
                    {activeTab === "orders" && (
                        <div>
                            <div className="mb-6 flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">Đơn hàng của tôi</h3>
                                    <p className="text-slate-400 text-xs mt-1 font-medium">Theo dõi tình trạng đơn đặt hàng của bạn</p>
                                </div>
                                <button 
                                    onClick={fetchOrders}
                                    className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
                                    title="Làm mới đơn hàng"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                                    </svg>
                                </button>
                            </div>

                            {isOrdersLoading ? (
                                <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
                                    <svg className="animate-spin h-10 w-10 text-[var(--primary)]" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span className="text-sm font-semibold">Đang tải danh sách đơn hàng...</span>
                                </div>
                            ) : orders.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mb-5">
                                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                        </svg>
                                    </div>
                                    <h4 className="text-base font-bold text-slate-700">Chưa có đơn hàng nào</h4>
                                    <p className="text-slate-400 text-xs max-w-sm mt-1 mb-6">Bạn chưa đặt đơn hàng nào bằng số điện thoại này hoặc số điện thoại của bạn chưa khớp.</p>
                                    <button 
                                        onClick={() => router.push("/")}
                                        className="h-10 px-6 bg-[var(--primary)] text-white text-xs font-bold rounded-2xl hover:bg-slate-900 transition-all duration-300 cursor-pointer shadow-sm shadow-[var(--primary)]/10"
                                    >
                                        Mua sắm ngay
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {orders.map((order) => {
                                        const isExpanded = expandedOrder === order._id;
                                        return (
                                            <div 
                                                key={order._id}
                                                className="border border-slate-100 rounded-2xl overflow-hidden transition-all duration-300 bg-slate-50/30 hover:border-slate-200/80 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.03)]"
                                            >
                                                {/* Header summary of order */}
                                                <div 
                                                    onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                                                    className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none"
                                                >
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-sm font-extrabold text-slate-800">
                                                                #{order._id.substring(order._id.length - 8).toUpperCase()}
                                                            </span>
                                                            <span className="text-[10px] text-slate-400 font-semibold">•</span>
                                                            <span className="text-xs text-slate-400 font-medium">
                                                                {new Date(order.createdAt || Date.now()).toLocaleDateString("vi-VN", {
                                                                    day: "2-digit",
                                                                    month: "2-digit",
                                                                    year: "numeric"
                                                                })}
                                                            </span>
                                                        </div>
                                                        <div className="text-xs text-slate-500 font-semibold mt-1">
                                                            {order.items.length} sản phẩm • Tổng cộng:{" "}
                                                            <span className="text-slate-800 font-bold">
                                                                {order.totalPrice.toLocaleString("vi-VN")} đ
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center space-x-3 self-end sm:self-auto">
                                                        {/* Status Badge */}
                                                        <span className={`px-3 py-1 rounded-full border text-xs font-bold ${getStatusStyle(order.status)}`}>
                                                            {getStatusLabel(order.status)}
                                                        </span>
                                                        {/* Expand Arrow */}
                                                        <svg 
                                                            className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                                                            fill="none" 
                                                            stroke="currentColor" 
                                                            viewBox="0 0 24 24" 
                                                            strokeWidth="2.5"
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                                        </svg>
                                                    </div>
                                                </div>

                                                {/* Expanded Details */}
                                                {isExpanded && (
                                                    <div className="px-5 pb-5 pt-3 border-t border-slate-100 bg-white space-y-4">
                                                        {/* Order details grid */}
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium text-slate-600 bg-slate-50/60 rounded-xl p-4">
                                                            <div>
                                                                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Người nhận</span>
                                                                <span className="text-slate-700 font-semibold">{order.customerName}</span>
                                                            </div>
                                                            <div>
                                                                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Số điện thoại</span>
                                                                <span className="text-slate-700 font-semibold">{order.phoneNumber}</span>
                                                            </div>
                                                            <div className="md:col-span-2">
                                                                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Địa chỉ giao hàng</span>
                                                                <span className="text-slate-700 font-semibold">{order.address}</span>
                                                            </div>
                                                            <div>
                                                                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Thanh toán</span>
                                                                <span className="text-slate-700 font-semibold">{order.paymentMethod || "COD"}</span>
                                                            </div>
                                                        </div>

                                                        {/* List of items */}
                                                        <div className="space-y-3">
                                                            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Chi tiết sản phẩm</span>
                                                            {order.items.map((item: any, index: number) => (
                                                                <div key={index} className="flex items-center justify-between gap-4 py-2 border-b border-slate-50 last:border-0">
                                                                    <div className="flex items-center space-x-3">
                                                                        <div className="h-12 w-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                                                                            <img 
                                                                                src={item.imageUrl || "https://picsum.photos/100/100"} 
                                                                                alt={item.name} 
                                                                                className="h-full w-full object-cover"
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <h5 className="text-xs font-bold text-slate-700 line-clamp-1">{item.name}</h5>
                                                                            <span className="text-[10px] text-slate-400 font-medium">SL: {item.quantity}</span>
                                                                        </div>
                                                                    </div>
                                                                    <span className="text-xs font-bold text-slate-700">
                                                                        {(item.price * item.quantity).toLocaleString("vi-VN")} đ
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* TAB 3: ACCOUNT SECURITY */}
                    {activeTab === "security" && (
                        <div>
                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-slate-800">Bảo mật tài khoản</h3>
                                <p className="text-slate-400 text-xs mt-1 font-medium">Cập nhật mật khẩu để bảo vệ thông tin cá nhân</p>
                            </div>

                            <form onSubmit={handlePasswordSubmit} className="space-y-6">
                                {/* Current Password */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-monasans">
                                        Mật khẩu hiện tại
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords.current ? "text" : "password"}
                                            name="currentPassword"
                                            value={passwordData.currentPassword}
                                            onChange={handlePasswordChange}
                                            required
                                            placeholder="Nhập mật khẩu hiện tại..."
                                            className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 pl-11 pr-12 py-3.5 font-monasans outline-none transition-all duration-300 focus:border-[var(--primary)] focus:bg-white focus:ring-4 focus:ring-[var(--primary)]/10 text-slate-700 font-semibold"
                                        />
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                            </svg>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                                        >
                                            {showPasswords.current ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* New Password */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-monasans">
                                        Mật khẩu mới
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords.new ? "text" : "password"}
                                            name="newPassword"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                            required
                                            placeholder="Nhập mật khẩu mới..."
                                            className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 pl-11 pr-12 py-3.5 font-monasans outline-none transition-all duration-300 focus:border-[var(--primary)] focus:bg-white focus:ring-4 focus:ring-[var(--primary)]/10 text-slate-700 font-semibold"
                                        />
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                                            </svg>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                                        >
                                            {showPasswords.new ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-monasans">
                                        Xác nhận mật khẩu mới
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords.confirm ? "text" : "password"}
                                            name="confirmPassword"
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordChange}
                                            required
                                            placeholder="Xác nhận mật khẩu mới..."
                                            className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 pl-11 pr-12 py-3.5 font-monasans outline-none transition-all duration-300 focus:border-[var(--primary)] focus:bg-white focus:ring-4 focus:ring-[var(--primary)]/10 text-slate-700 font-semibold"
                                        />
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0110 21a3.745 3.745 0 01-3.296-1.043 3.746 3.746 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0114 3a3.745 3.745 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                                            </svg>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                                        >
                                            {showPasswords.confirm ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-4 flex items-center justify-end border-t border-slate-100">
                                    <button
                                        type="submit"
                                        disabled={isPasswordLoading}
                                        className="flex items-center space-x-2 h-12 rounded-2xl bg-[var(--primary)] px-8 font-semibold text-white shadow-md shadow-[var(--primary)]/20 transition-all duration-300 hover:scale-105 hover:bg-slate-900 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        {isPasswordLoading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span>Đang lưu...</span>
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                                </svg>
                                                <span>Đổi mật khẩu</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
