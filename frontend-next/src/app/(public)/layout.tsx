import Footer from "@/component/layout/footer";
import Navbar from "@/component/layout/navbar";
import OnTop from "@/component/layout/ontop";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <OnTop />
      <Navbar className="" />
      <div className="rowCenter bg-gray-300">
        <div className="w-[1200px] my-[20px]">{children}</div>
      </div>
      <Footer />
    </>
  );
}