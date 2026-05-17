// ===== TMFashion Header Component =====
// Banner phía trên cùng (tương đương components/layout/Header.vue)
// bg-primary (#355C7D), "TMF | Hotline | TMF | THẾ GIỚI DÀNH GIỚI TRẺ"

"use client";

export default function Header() {
  return (
    <div className="bg-primary h-[68px] flex items-center">
      <div className="max-w-[1200px] w-full mx-auto px-4 flex items-center justify-between">
        {/* Left: TMF logo */}
        <div className="flex items-center gap-3">
          <span className="text-[20px] text-white font-[var(--font-longreach)]">
            TMF
          </span>
        </div>

        {/* Center: Hotline */}
        <div className="hidden md:flex items-center gap-2">
          <span className="text-[14px] text-white">
            Hotline:{" "}
            <strong className="text-white">0773 772 174</strong>
          </span>
        </div>

        {/* Right: TMF + slogan */}
        <div className="flex items-center gap-4">
          <span className="text-[20px] text-white font-[var(--font-longreach)]">
            TMF
          </span>
          <span className="hidden sm:block text-[13px] text-white tracking-wider">
            THẾ GIỚI DÀNH GIỚI TRẺ
          </span>
        </div>
      </div>
    </div>
  );
}
