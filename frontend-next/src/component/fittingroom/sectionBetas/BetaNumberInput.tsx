"use client";

type BetaNumberInputProps = {
  label: string;
  value: number;
  unit?: string;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
};

export default function BetaNumberInput({
  label,
  value,
  unit,
  min,
  max,
  step = 1,
  onChange,
}: BetaNumberInputProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-900">{label}</p>
          {unit ? <p className="text-xs text-slate-500">Đơn vị: {unit}</p> : null}
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
          <input
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => {
              const nextValue = e.currentTarget.value === "" ? min : Number(e.currentTarget.value);
              onChange(Number.isFinite(nextValue) ? nextValue : value);
            }}
            className="w-24 bg-transparent text-right text-sm font-semibold text-slate-900 outline-none"
          />
          {unit ? <span className="ml-2 text-xs text-slate-500">{unit}</span> : null}
        </div>
      </div>
    </div>
  );
}
