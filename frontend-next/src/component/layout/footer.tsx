
import Link from "next/link";

const aboutLinks = [
    "Giới thiệu về TMF",
    "Tuyển dụng",
    "Chính sách bảo mật",
    "Điều khoản chung",
];

const supportLinks = [
    "Mua & Giao nhận Online",
    "Tin Khuyến Mãi",
    "Bảo hành & Bảo trì",
    "Đổi trả & Hoàn tiền",
];

const petLinks = ["Dành cho Cún Cưng", "Dành cho Mèo Cưng"];
const socials = [
    {"icon": "icon_fb.jpg", "url": "https://www.facebook.com/"},
    {"icon": "icon_ig.jpg", "url": "https://www.instagram.com/"},
    {"icon": "icon_tt.jpg", "url": "https://www.tiktok.com/"},
    {"icon": "icon_yt.jpg", "url": "https://www.youtube.com/"}
];

export default function FooterPage() {
    return (
        <footer className="w-[1200px] m-auto bg-white">
            <div className="flex justify-center gap-[50px] py-[30px]">
                <div className="flex-1 font-monasans text-[var(--text-primary)] gap-[20px]">
                    <h3 className="text-[20px] font-semibold font-monasans">Công Ty Cổ Phần TMF-Shop</h3>

                    <div className="mt-6 space-y-4 text-[16px] leading-[1.45]">
                        <p className="flex items-start gap-3">
                            <span className="pt-1">✉</span>
                            <span>ilove@tmf.vn</span>
                        </p>
                        <p className="flex items-start gap-3">
                            <span className="pt-1">☎</span>
                            <span>0909 020 900</span>
                        </p>
                        <p className="flex items-start gap-3">
                            <span className="pt-1">📍</span>
                            <span>ĐKKD: 562 Đường Lê Quang Định, Phường Long Trường, TP Hồ Chí Minh, Việt Nam</span>
                        </p>
                    </div>

                    <div className="mt-7 flex items-center gap-3">
                        <p className="font-longreach text-[52px] leading-none">TMF</p>
                        <img src="/avt_main.png" alt="TMF mascot" className="h-11 w-11 rounded-full object-cover" />
                    </div>
                </div>

                <div className="flex-1 font-monasans text-[16px] text-[var(--text-primary)]">
                    <div>
                        <h3 className="text-[20px] font-semibold">Về TMF</h3>
                        <ul className="mt-5 space-y-3 text-[16px]">
                            {aboutLinks.map((item) => (
                                <li key={item}>
                                    <Link href="/" className="hover:text-[var(--primary-hover)]">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="mt-8">
                        <h3 className="text-[20px] font-semibold">Hỗ trợ khách hàng</h3>
                        <ul className="mt-5 space-y-3 text-[16px]">
                            {supportLinks.map((item) => (
                                <li key={item}>
                                    <Link href="/" className="hover:text-[var(--primary-hover)]">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="mt-8">
                        <h3 className="text-[20px] font-semibold">Thú cưng</h3>
                        <ul className="mt-5 space-y-3 text-[16px]">
                            {petLinks.map((item) => (
                                <li key={item}>
                                    <Link href="/" className="hover:text-[var(--primary-hover)]">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="flex-1 font-monasans text-[16px] text-[var(--text-primary)]">
                    <div>
                        <h3 className="text-[20px] font-semibold">Chấp nhận thanh toán</h3>
                        <img src="/footer_payment.png" alt="Payment methods" className="mt-5" />
                    </div>

                    <div className="mt-10">
                        <h3 className="text-[20px] font-semibold">Đối tác vận chuyển</h3>
                        <img src="/footer_transport.jpg" alt="Transport partners" className="mt-5" />
                    </div>
                </div>
                
                <div className="flex-1 font-monasans text-[16px] text-[var(--text-primary)]">
                    <div>
                        <h3 className="text-[20px] font-semibold">Kết nối với TMF tại</h3>
                        <div className="mt-5 flex flex-wrap gap-3">
                            {socials.map((item) => (
                                <a
                                    key={item.icon}
                                    href={item.url}
                                    target="_blank" // là Mở đường dẫn ở tab/cửa sổ mới thay vì tab hiện tại.
                                    rel="noopener noreferrer" // chặn trang mới truy cập window.opener của trang hiện tại, giúp tránh một số kiểu tấn công (tabnabbing).
                                    className=""
                                >
                                    <img src={item.icon} alt={item.icon} className="h-[52px] w-[52px] " />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="mt-10">
                        <h3 className="text-[20px] font-semibold leading-[1.2]">
                            Mua sắm dễ dàng - Ưu đãi ngập tràn cùng app TMF
                        </h3>

                        <div className="mt-5 flex items-center gap-4">
                            <img src="/QR.png" alt="Mobile app" className="h-[95px] w-[95px] border border-[var(--primary)] rounded-[8px]" />

                            <div className="colCenter space-y-3">
                                <img src="/dowload_AppStore.png" alt="App Store" className="h-[40px] w-[120px] " />
                                <img src="/dowload_CHplay.png" alt="Google Play" className="h-[40px] w-[120px]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}