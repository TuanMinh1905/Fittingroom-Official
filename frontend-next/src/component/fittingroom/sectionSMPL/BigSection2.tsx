type BigSection2Props = {
	className?: string;
};

export default function BigSection2({ className = "" }: BigSection2Props) {
	return (
		<section className={className}>
			<div className="text-lg font-semibold text-gray-900">Section 2</div>
			<p className="mt-2 text-sm text-gray-600">Khu SMPL / 3D viewer</p>
		</section>
	);
}
