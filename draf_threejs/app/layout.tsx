import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TMFashion - Thời trang cho mọi người",
  description: "TMFashion - Mang đến những sản phẩm thời trang chất lượng với giá cả hợp lý",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
