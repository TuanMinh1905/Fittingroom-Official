// ===== TMFashion Footer Component =====
// Footer (tương đương components/layout/Footer.vue)
// Giống Nuxt: white bg, "TM - FAHSION" logo, email/phone/address, social icons, copyright

"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-[1200px] mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Brand Info — giống Nuxt: "TM - FAHSION" */}
          <div>
            <h3 className="text-[22px] font-bold text-primary font-[var(--font-longreach)] mb-4">
              TM - FAHSION
            </h3>
            <ul className="space-y-3 text-[13px] text-gray-tmf">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>tmfashion@gmail.com</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>0773 772 174</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>91B Trần Não, P. An Khánh, TP. Thủ Đức, TP.HCM</span>
              </li>
            </ul>
          </div>

          {/* Column 2: Về TMFashion */}
          <div>
            <h4 className="font-bold text-[15px] text-gray-tmf mb-4">Về TMFashion</h4>
            <ul className="space-y-2 text-[13px] text-gray-500">
              <li>
                <Link href="/introduce" className="hover:text-primary transition">
                  Giới thiệu về TMFashion
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-primary transition">
                  Sản phẩm
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  Tuyển dụng
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  Liên hệ hợp tác
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Chính sách */}
          <div>
            <h4 className="font-bold text-[15px] text-gray-tmf mb-4">Chính sách</h4>
            <ul className="space-y-2 text-[13px] text-gray-500">
              <li>
                <a href="#" className="hover:text-primary transition">
                  Chính sách đổi trả
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  Chính sách vận chuyển
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  Điều khoản sử dụng
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Social icons — giống Nuxt: Facebook, Instagram, TikTok, YouTube */}
          <div>
            <h4 className="font-bold text-[15px] text-gray-tmf mb-4">Kết nối với chúng tôi</h4>
            <div className="flex items-center gap-3">
              {/* Facebook */}
              <a href="#" className="w-10 h-10 bg-[#F3F3F1] hover:bg-primary/10 rounded-full flex items-center justify-center transition">
                <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              {/* Instagram */}
              <a href="#" className="w-10 h-10 bg-[#F3F3F1] hover:bg-primary/10 rounded-full flex items-center justify-center transition">
                <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              {/* TikTok */}
              <a href="#" className="w-10 h-10 bg-[#F3F3F1] hover:bg-primary/10 rounded-full flex items-center justify-center transition">
                <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48V13a8.28 8.28 0 005.58 2.16V11.7a4.83 4.83 0 01-3.77-1.7v-3.3z" />
                </svg>
              </a>
              {/* YouTube */}
              <a href="#" className="w-10 h-10 bg-[#F3F3F1] hover:bg-primary/10 rounded-full flex items-center justify-center transition">
                <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright — giống Nuxt */}
        <div className="border-t border-gray-200 mt-8 pt-6 text-center">
          <p className="text-[12px] text-gray-400">
            © {new Date().getFullYear()} TMFashion. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
}
