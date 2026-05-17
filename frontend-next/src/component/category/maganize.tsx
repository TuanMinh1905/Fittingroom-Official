"use client";
import { useState } from "react";

const magazines = [
	{
		img: "/magazine_1.png",
		name: "Tạp chí",
		alt: "Tạp chí",
	},
	{
		img: "/magazine_2.png",
		name: "Thử đồ 3D",
		alt: "Thử đồ 3D",
	},
	{
		img: "/magazine_3.png",
		name: "Chi nhánh",
		alt: "Chi nhánh",
	}
];

export default function Magazine() {
	
	return (
		<section className="rowCenter gap-[25px]">
            {magazines.map((item, index) => (
                <div key={index} className="colCenter gap-[8px] w-[120px] h-[144px]">
                    <img src={item.img} alt={item.alt}/>
                    <h3>{item.name}</h3>
                </div>
            ))}
        </section>
	);
}
