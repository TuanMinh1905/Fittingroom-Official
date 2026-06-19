"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import LoginModal from "./loginModal";

const navItems = ["Trang chủ", "Danh mục", "Giới thiệu", "Blog"];

type NavbarPageProps = {
    className?: string;
};

export default function NavbarPage({ className = "" }: NavbarPageProps) {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [keyword, setKeyword] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const router = useRouter();
    const searchRef = useRef<HTMLDivElement>(null);

    // Xử lý tìm kiếm với debounce 1.5s
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (keyword.trim()) {
                fetch(`http://localhost:8000/products/search?q=${encodeURIComponent(keyword)}`)
                    .then(res => res.json())
                    .then(data => {
                        setResults(data);
                        setShowDropdown(true);
                    })
                    .catch(err => console.error("Lỗi khi tìm kiếm:", err));
            } else {
                setResults([]);
                setShowDropdown(false);
            }
        }, 1500);

        return () => clearTimeout(delayDebounceFn);
    }, [keyword]);

    // Xử lý click ra ngoài để đóng dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = (q: string) => {
        if (q.trim()) {
            setShowDropdown(false);
            router.push(`/search_product?q=${encodeURIComponent(q)}`);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch(keyword);
        }
    };

    // Cập nhật state từ localStorage khi load và sau khi đăng nhập
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                // Ignore parse errors
            }
        }
        
        // Listen to custom event for login updates
        const handleLoginSuccess = () => {
            const updatedUser = localStorage.getItem("user");
            if (updatedUser) setUser(JSON.parse(updatedUser));
        };
        
        window.addEventListener("loginSuccess", handleLoginSuccess);
        return () => window.removeEventListener("loginSuccess", handleLoginSuccess);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
        // Refresh to reset state
        window.location.reload();
    };

    return (
        <>
            <header className={`py-[20px] w-full bg-white ${className}`.trim()}>
                <div className="m-auto flex w-full max-w-[1200px] items-center justify-between">
                    <div className="rowCenter gap-[24px]">
                        <Link href="/" className="text-[45px] font-longreach text-[var(--text-primary)]">
                            TMF-SHOP  
                        </Link>

                        <nav aria-label="Main navigation" className="rowCenter text-[16px] font-monasans text-[var(--text-primary)] font-regular gap-[24px]">
                            {navItems.map((item, index) => (
                                <Link
                                    key={item}
                                    href={index === 0 ? "/" : "/"}
                                    className={`transition hover:text-slate-900 ${index === 0 ? "text-slate-900 underline decoration-4 underline-offset-8 decoration-yellow-400" : ""}`}
                                >
                                    {item}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="rowCenter gap-[12px]">
                        <div className="relative" ref={searchRef}>
                            <div className="h-[48px] w-[315px] rowCenter rounded-[12px] border-[2px] border-[var(--primary)] bg-white relative z-10">
                                
                                <input
                                    type="text"
                                    placeholder="Tìm Fashion phù hợp với bạn :v"
                                    className="w-full text-[14px] placeholder:font-monasans outline-none placeholder:text-slate-400 ml-[36px]"
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    onFocus={() => { if(keyword.trim()) setShowDropdown(true) }}
                                />

                                <img 
                                    src="/man_main.png" 
                                    alt="Search icon" 
                                    aria-hidden="true" 
                                    className="h-[64px] scale-x-[-1] object-cover cursor-pointer absolute right-0" 
                                    onClick={() => handleSearch(keyword)}
                                />
                            </div>
                            
                            {/* Dropdown gợi ý tìm kiếm */}
                            {showDropdown && results.length > 0 && (
                                <div className="absolute top-[56px] left-0 w-full bg-white border-[2px] border-[var(--primary)] rounded-[12px] shadow-lg z-50 overflow-hidden">
                                    <ul className="max-h-[300px] overflow-y-auto">
                                        {results.map((product: any) => (
                                            <li 
                                                key={product._id} 
                                                className="px-4 py-3 hover:bg-slate-100 cursor-pointer text-[14px] font-monasans border-b border-slate-100 last:border-b-0 truncate"
                                                onClick={() => handleSearch(product.name)}
                                            >
                                                {product.name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {user ? (
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="flex h-[44px] items-center justify-center rounded-xl border-[2px] border-red-500 bg-red-500 px-6 text-[14px] font-semibold text-white transition hover:bg-white hover:text-red-500"
                            >
                                Đăng xuất
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setIsLoginModalOpen(true)}
                                className="flex h-[44px] items-center justify-center rounded-xl border-[2px] border-[var(--primary)] bg-[var(--primary)] px-6 text-[14px] font-semibold text-white transition hover:bg-white hover:text-[var(--primary)]"
                            >
                                Đăng nhập
                            </button>
                        )}

                        <button
                            type="button"
                            className="flex h-[44px] w-[100px] items-center gap-2 rounded-xl border-[2px] border-[var(--primary)] bg-white px-3 text-[14px]"
                        >
                            <span className="rowCenter h-9 w-9 rounded-md bg-red-500 text-[24px] leading-none text-yellow-300">
                                ★
                            </span>
                            VN
                        </button>
                    </div>
                </div>
            </header>
            
            <LoginModal 
                isOpen={isLoginModalOpen} 
                onClose={() => setIsLoginModalOpen(false)} 
            />
        </>
    );
}