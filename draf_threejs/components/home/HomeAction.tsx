// ===== TMFashion HomeAction Component =====
// Quick action icons (tương đương components/HomeAction.vue)
// Hiển thị danh mục nhanh với icon SVG

"use client";

import Link from "next/link";

const quickActions = [
  { icon: "/category_shirt.svg", label: "Áo", href: "/shop?cat=ao" },
  { icon: "/category_shorts.svg", label: "Quần", href: "/shop?cat=quan" },
  { icon: "/catgory_shoe.svg", label: "Giày", href: "/shop?cat=giay" },
  { icon: "/categtory_hat.svg", label: "Nón", href: "/shop?cat=non" },
  { icon: "/category_glasses.svg", label: "Kính", href: "/shop?cat=kinh" },
  { icon: "/category_belt.svg", label: "Thắt lưng", href: "/shop?cat=that-lung" },
  { icon: "/category_socks.svg", label: "Vớ", href: "/shop?cat=vo" },
  { icon: "/quickAction_blog.svg", label: "Tạp chí", href: "/blog" },
  { icon: "/quickAction_branch.svg", label: "Chi nhánh", href: "/branches" },
];

export default function HomeAction() {
  return (
    <div className="py-6">
      <div className="flex items-center justify-center gap-4 md:gap-6 lg:gap-8 overflow-x-auto no-scrollbar py-2">
        {quickActions.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className="flex flex-col items-center gap-2 flex-shrink-0 group"
          >
            {/* Icon container — giống Nuxt: 60x60 mobile, 120x120 desktop, bg-[#F3F3F1] rounded */}
            <div className="w-[60px] h-[60px] md:w-[90px] md:h-[90px] lg:w-[100px] lg:h-[100px] rounded-2xl bg-[#F3F3F1] flex items-center justify-center group-hover:bg-primary/10 transition">
              <img
                src={action.icon}
                alt={action.label}
                className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] lg:w-[48px] lg:h-[48px] object-contain"
              />
            </div>
            <span className="text-[11px] md:text-[13px] text-gray-tmf font-medium text-center">
              {action.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
