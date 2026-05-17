import BigSection1 from "@/component/fittingroom/sectionClothing/BigSection1";
import BigSection2 from "@/component/fittingroom/sectionSMPL/BigSection2";
import BigSection3 from "@/component/fittingroom/sectionBetas/BigSection3";

export default function Home() {
  return (
    <main className="flex h-screen w-full items-center justify-center bg-white">
      <BigSection1 className="mx-[20px] flex-[1] bg-gray-200 p-4" />
      <BigSection2 className="mx-[20px] flex-[2] bg-gray-200 p-4" />
      <BigSection3 className="mx-[20px] flex-[1] bg-gray-200 p-4" />
    </main>
  );
}