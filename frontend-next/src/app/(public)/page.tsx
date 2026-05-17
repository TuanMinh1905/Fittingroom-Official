import PosterSlider from "@/component/posterSlider";
import PosterUSP from "@/component/posterUSP";
import Magazine from "@/component/category/maganize";
import Category from "@/component/category/category";
import Collection from "@/component/collection/Collection";
import BrandList from "@/component/brand/BrandList";
import BlogList from "@/component/blog/BlogList";
import All_Product from "@/component/product/All_Product";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto flex w-full flex-col items-center gap-[20px]">
        <PosterSlider />
        
        <PosterUSP />
        
        <section className="w-full max-w-[1200px]">
          <BrandList />
        </section>

        <section className="flex w-full max-w-[1200px] flex-row items-center gap-[30px] px-[16px] mb-8">
            <Magazine />
            <div className="h-[100px] w-[3px] bg-[var(--text-primary)] opacity-30"></div>
            <Category />
        </section>

        <section className="w-full max-w-[1200px] px-[16px]">
            <Collection />
        </section>


        <section className="w-full max-w-[1200px] px-[16px]">
            <BlogList />
        </section>

        <section className="w-full max-w-[1200px] px-[16px]">
            <All_Product />
        </section>
      </div>
    </main>
  );
}