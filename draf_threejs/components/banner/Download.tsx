// ===== TMFashion Banner Download =====
// Banner tải app (tương đương components/banner/Dowload.vue)
// Giống Nuxt: bg-primary, QR code, text + buttons

export default function BannerDownload() {
  return (
    <div className="bg-primary rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
      {/* Left: QR + Text */}
      <div className="flex items-center gap-6">
        {/* QR Code */}
        <img
          src="/QRDowload.png"
          alt="QR Download"
          className="w-[100px] h-[100px] rounded-lg bg-white p-1 hidden sm:block"
        />
        <div>
          <h3 className="text-[20px] md:text-[24px] font-bold text-white mb-1">
            Tải ứng dụng TMFashion
          </h3>
          <p className="text-[14px] text-white/80">
            Mua sắm tiện lợi hơn với ứng dụng TMFashion trên điện thoại
          </p>
        </div>
      </div>
      {/* Right: Store buttons */}
      <div className="flex items-center gap-3">
        <button className="px-5 py-2.5 bg-white text-primary rounded-lg flex items-center gap-2 hover:bg-gray-100 transition text-[14px] font-medium">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
          </svg>
          App Store
        </button>
        <button className="px-5 py-2.5 bg-white text-primary rounded-lg flex items-center gap-2 hover:bg-gray-100 transition text-[14px] font-medium">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.302 2.302a1 1 0 010 1.38l-2.302 2.302L15.2 12.99l2.498-3.482zM5.864 2.658L16.8 8.99l-2.3 2.3-8.636-8.632z" />
          </svg>
          Google Play
        </button>
      </div>
    </div>
  );
}
