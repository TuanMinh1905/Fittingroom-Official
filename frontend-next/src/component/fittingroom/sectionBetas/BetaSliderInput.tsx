"use client";

type BetaSliderInputProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
};

export default function BetaSliderInput({
  label,
  value,
  min,
  max,
  step = 0.1,
  unit,
  onChange,
}: BetaSliderInputProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-900">{label}</p>
          <p className="text-xs text-slate-500">
            {min}
            {unit ?? ""} đến {max}
            {unit ?? ""}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-semibold text-slate-900 tabular-nums">
          {value.toFixed(1)}
          {unit ?? ""}
        </div>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.currentTarget.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-cyan-600"
      />
    </div>
  );
}