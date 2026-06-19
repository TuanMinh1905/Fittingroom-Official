// Tức là RootLayout chỉ ra rằng component này là layout chính cho toàn web.
// Children tương ứng với Slot bên Nuxt Đúng không ? => Chuẩn 100%
import "./globals.css";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
