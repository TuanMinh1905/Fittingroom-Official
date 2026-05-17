"use client";

import Image from "next/image";
import { useState } from "react";

const posters = [
	{
		src: "/poster1.png",
		alt: "Khuyến mãi poster 1",
	},
	{
		src: "/poster2.png",
		alt: "Khuyến mãi poster 2",
	},
	{
		src: "/poster3.png",
		alt: "Khuyến mãi poster 3",
	},
];

export default function PosterSlider() {
	const [activeIndex, setActiveIndex] = useState(0);

	const goToPrevious = () => {
		setActiveIndex((current) => (current === 0 ? posters.length - 1 : current - 1));
	};

	const goToNext = () => {
		setActiveIndex((current) => (current === posters.length - 1 ? 0 : current + 1));
	};

	return (
		<section className="w-[1200px]">
			<div className="relative overflow-hidden rounded-[24px]">
				<div className="relative w-[1200px] h-[460px]">
					<div
						className="flex h-full transition-transform duration-500 ease-out"
						style={{ transform: `translateX(-${activeIndex * 100}%)` }}
					>
						{posters.map((poster) => (
							<div key={poster.src} className="relative h-full min-w-full">
								<Image
									src={poster.src}
									alt={poster.alt}
									fill
									priority={poster.src === "/poster1.png"}
									className="object-cover"
									sizes="(max-width: 768px) 100vw, 1200px"
								/>
							</div>
						))}
					</div>
				</div>

				<button
					type="button"
					onClick={goToPrevious}
					aria-label="Poster trước"
					className="absolute cursor-pointer left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 text-slate-700 shadow-md transition hover:bg-white hover:scale-110"
				>
					<svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
						<path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
				</button>

				<button
					type="button"
					onClick={goToNext}
					aria-label="Poster tiếp theo"
					className="absolute cursor-pointer right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 text-slate-700 shadow-md transition hover:bg-white hover:scale-110"
				>
					<svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
						<path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
				</button>

				<div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/10 px-3 py-2 backdrop-blur-sm">
					{posters.map((poster, index) => (
						<button
							key={poster.src}
							type="button"
							onClick={() => setActiveIndex(index)}
							aria-label={`Đi tới poster ${index + 1}`}
							className={`h-2.5 rounded-full transition-all ${
								index === activeIndex ? "w-8 bg-slate-800" : "w-2.5 bg-slate-500/50 hover:bg-slate-700/70"
							}`}
						/>
					))}
				</div>
			</div>
		</section>
	);
}
