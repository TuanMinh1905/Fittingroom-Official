const postersUSP = [
	{
		src: "/home_USP1.png",
		alt: "Khuyến mãi poster 1",
	},
	{
		src: "/home_USP2.png",
		alt: "Khuyến mãi poster 2",
	},
	{
		src: "/home_USP3.png",
		alt: "Khuyến mãi poster 3",
	},
    {
		src: "/home_USP4.png",
		alt: "Khuyến mãi poster 4",
	},
];

export default function PosterUSP() {
  return (
    <section className="w-full flex items-center justify-between">
        {postersUSP.map((poster) => (
          <img
            key={poster.src}
            src={poster.src}
            alt={poster.alt}
            width={220}
            height={144}
          />
        ))}
    </section>
  );
}
