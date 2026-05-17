type BigSection1Props = {
	className?: string;
};

export default function BigSection1({ className = "" }: BigSection1Props) {
	return (
		<section className={className}>
			<div className="text-lg font-semibold text-gray-900">Section 1</div>
			<p className="mt-2 text-sm text-gray-600">Khu clothing</p>
		</section>
	);
}
