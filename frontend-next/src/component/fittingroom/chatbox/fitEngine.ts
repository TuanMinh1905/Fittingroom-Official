/**
 * fitEngine.ts — Rule-Based Fit Scoring Engine
 * 
 * So sánh số đo cơ thể người dùng với bảng size chart
 * để đánh giá mức độ vừa vặn (fit) của trang phục.
 * 
 * Trả kết quả tức thì (<10ms), không cần API call.
 */

// ── Bảng Size Chart ─────────────────────────────────────────
// Đơn vị: cm. Mỗi size có khoảng min-max cho từng số đo.

export interface SizeRange {
  bust: [number, number];
  waist: [number, number];
  shoulder: [number, number];
  hip: [number, number];
}

type SizeChart = Record<string, SizeRange>;

const MALE_TOP_SIZES: SizeChart = {
  XS:  { bust: [80, 84],  waist: [64, 68],  shoulder: [38, 40], hip: [80, 84] },
  S:   { bust: [84, 92],  waist: [68, 76],  shoulder: [40, 43], hip: [84, 92] },
  M:   { bust: [92, 100], waist: [76, 84],  shoulder: [43, 46], hip: [92, 100] },
  L:   { bust: [100, 108], waist: [84, 92], shoulder: [46, 49], hip: [100, 108] },
  XL:  { bust: [108, 116], waist: [92, 100], shoulder: [49, 52], hip: [108, 116] },
  XXL: { bust: [116, 124], waist: [100, 108], shoulder: [52, 55], hip: [116, 124] },
};

const FEMALE_TOP_SIZES: SizeChart = {
  XS:  { bust: [74, 78],  waist: [56, 60],  shoulder: [34, 36], hip: [80, 84] },
  S:   { bust: [78, 84],  waist: [60, 66],  shoulder: [36, 38], hip: [84, 90] },
  M:   { bust: [84, 92],  waist: [66, 74],  shoulder: [38, 40], hip: [90, 98] },
  L:   { bust: [92, 100], waist: [74, 82],  shoulder: [40, 42], hip: [98, 106] },
  XL:  { bust: [100, 108], waist: [82, 90], shoulder: [42, 44], hip: [106, 114] },
  XXL: { bust: [108, 116], waist: [90, 98], shoulder: [44, 46], hip: [114, 122] },
};

const MALE_BOTTOM_SIZES: SizeChart = {
  XS:  { bust: [80, 84],  waist: [64, 68],  shoulder: [38, 40], hip: [80, 86] },
  S:   { bust: [84, 92],  waist: [68, 76],  shoulder: [40, 43], hip: [86, 94] },
  M:   { bust: [92, 100], waist: [76, 84],  shoulder: [43, 46], hip: [94, 102] },
  L:   { bust: [100, 108], waist: [84, 92], shoulder: [46, 49], hip: [102, 110] },
  XL:  { bust: [108, 116], waist: [92, 100], shoulder: [49, 52], hip: [110, 118] },
  XXL: { bust: [116, 124], waist: [100, 108], shoulder: [52, 55], hip: [118, 126] },
};

const FEMALE_BOTTOM_SIZES: SizeChart = {
  XS:  { bust: [74, 78],  waist: [56, 60],  shoulder: [34, 36], hip: [80, 86] },
  S:   { bust: [78, 84],  waist: [60, 66],  shoulder: [36, 38], hip: [86, 92] },
  M:   { bust: [84, 92],  waist: [66, 74],  shoulder: [38, 40], hip: [92, 100] },
  L:   { bust: [92, 100], waist: [74, 82],  shoulder: [40, 42], hip: [100, 108] },
  XL:  { bust: [100, 108], waist: [82, 90], shoulder: [42, 44], hip: [108, 116] },
  XXL: { bust: [108, 116], waist: [90, 98], shoulder: [44, 46], hip: [116, 124] },
};

function getSizeChart(gender: string, garmentType: string): SizeChart {
  const isTop = ["t-shirt", "shirt"].includes(garmentType);
  if (gender === "female") return isTop ? FEMALE_TOP_SIZES : FEMALE_BOTTOM_SIZES;
  return isTop ? MALE_TOP_SIZES : MALE_BOTTOM_SIZES;
}

// ── Fit Scoring ─────────────────────────────────────────────

export type FitLevel = "Rất chật" | "Hơi chật" | "Vừa vặn" | "Hơi rộng" | "Rất rộng";

export interface MeasurementDetail {
  label: string;
  bodyValue: number;
  sizeRange: [number, number];
  fitScore: number;     // -2 (rất chật) → 0 (vừa) → +2 (rất rộng)
  fitLabel: FitLevel;
}

export interface FitAnalysis {
  overallScore: number;        // -2 → +2
  overallLabel: FitLevel;
  recommendedSize: string;     // Size vừa nhất
  comfortSize: string;         // Size thoải mái (lớn hơn 1 bậc)
  currentSize: string;
  garmentType: string;
  gender: string;
  details: MeasurementDetail[];
}

const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL"];

function scoreSingleMeasurement(
  bodyValue: number,
  sizeRange: [number, number]
): number {
  const [min, max] = sizeRange;
  const mid = (min + max) / 2;
  const halfRange = (max - min) / 2;

  // Áo che phủ cơ thể → nếu số đo cơ thể > max của áo → áo chật (score âm)
  // Nếu cơ thể < min → áo rộng (score dương)
  if (bodyValue > max) {
    // Chật: tính mức độ vượt quá
    const excess = (bodyValue - max) / halfRange;
    return Math.max(-2, -excess);
  }
  if (bodyValue < min) {
    // Rộng: tính mức độ nhỏ hơn
    const deficit = (min - bodyValue) / halfRange;
    return Math.min(2, deficit);
  }
  // Trong khoảng: normalize về [-0.5, 0.5]
  return (mid - bodyValue) / (halfRange * 2);
}

function scoreToLabel(score: number): FitLevel {
  if (score <= -1.2) return "Rất chật";
  if (score <= -0.4) return "Hơi chật";
  if (score <= 0.4) return "Vừa vặn";
  if (score <= 1.2) return "Hơi rộng";
  return "Rất rộng";
}

export interface BodyMeasurements {
  shoulder: number;
  arm: number;
  bust: number;
  waist: number;
  hip: number;
  leg: number;
  height: number;
  weight: number;
}

/**
 * Phân tích mức độ vừa vặn của trang phục so với số đo cơ thể.
 */
export function analyzeFit(
  body: BodyMeasurements,
  currentSize: string,
  garmentType: string,
  gender: string
): FitAnalysis {
  const chart = getSizeChart(gender, garmentType);
  const sizeRange = chart[currentSize.toUpperCase()];

  if (!sizeRange) {
    return {
      overallScore: 0,
      overallLabel: "Vừa vặn",
      recommendedSize: currentSize,
      comfortSize: currentSize,
      currentSize,
      garmentType,
      gender,
      details: [],
    };
  }

  const isTop = ["t-shirt", "shirt"].includes(garmentType);

  // Chọn các số đo quan trọng theo loại quần áo
  type MeasureKey = "bust" | "waist" | "shoulder" | "hip";
  const measureKeys: { key: MeasureKey; label: string; bodyKey: keyof BodyMeasurements; weight: number }[] = isTop
    ? [
        { key: "bust", label: "Vòng ngực", bodyKey: "bust", weight: 0.35 },
        { key: "waist", label: "Vòng eo", bodyKey: "waist", weight: 0.25 },
        { key: "shoulder", label: "Bề ngang vai", bodyKey: "shoulder", weight: 0.30 },
        { key: "hip", label: "Vòng hông", bodyKey: "hip", weight: 0.10 },
      ]
    : [
        { key: "waist", label: "Vòng eo", bodyKey: "waist", weight: 0.35 },
        { key: "hip", label: "Vòng hông", bodyKey: "hip", weight: 0.45 },
        { key: "bust", label: "Vòng ngực", bodyKey: "bust", weight: 0.10 },
        { key: "shoulder", label: "Bề ngang vai", bodyKey: "shoulder", weight: 0.10 },
      ];

  const details: MeasurementDetail[] = [];
  let weightedScore = 0;
  let totalWeight = 0;

  for (const m of measureKeys) {
    const bodyVal = body[m.bodyKey] as number;
    const range = sizeRange[m.key];
    const score = scoreSingleMeasurement(bodyVal, range);

    details.push({
      label: m.label,
      bodyValue: bodyVal,
      sizeRange: range,
      fitScore: Math.round(score * 100) / 100,
      fitLabel: scoreToLabel(score),
    });

    weightedScore += score * m.weight;
    totalWeight += m.weight;
  }

  const overallScore = Math.round((weightedScore / totalWeight) * 100) / 100;
  const overallLabel = scoreToLabel(overallScore);

  // Tìm recommended size: size có overall score gần 0 nhất
  const recommendedSize = findBestSize(body, garmentType, gender, measureKeys);

  // Comfort size: 1 bậc lớn hơn recommended
  const recIdx = SIZE_ORDER.indexOf(recommendedSize);
  const comfortSize = recIdx < SIZE_ORDER.length - 1 ? SIZE_ORDER[recIdx + 1] : recommendedSize;

  return {
    overallScore,
    overallLabel,
    recommendedSize,
    comfortSize,
    currentSize: currentSize.toUpperCase(),
    garmentType,
    gender,
    details,
  };
}

function findBestSize(
  body: BodyMeasurements,
  garmentType: string,
  gender: string,
  measureKeys: { key: "bust" | "waist" | "shoulder" | "hip"; bodyKey: keyof BodyMeasurements; weight: number }[]
): string {
  const chart = getSizeChart(gender, garmentType);
  let bestSize = "M";
  let bestAbsScore = Infinity;

  for (const size of SIZE_ORDER) {
    const sizeRange = chart[size];
    if (!sizeRange) continue;

    let weightedScore = 0;
    let totalWeight = 0;

    for (const m of measureKeys) {
      const bodyVal = body[m.bodyKey] as number;
      const range = sizeRange[m.key];
      const score = scoreSingleMeasurement(bodyVal, range);
      weightedScore += score * m.weight;
      totalWeight += m.weight;
    }

    const absScore = Math.abs(weightedScore / totalWeight);
    if (absScore < bestAbsScore) {
      bestAbsScore = absScore;
      bestSize = size;
    }
  }

  return bestSize;
}

/**
 * Tạo report text từ kết quả phân tích để gửi cho LLM.
 */
export function generateFitReport(analysis: FitAnalysis): string {
  const lines: string[] = [];

  lines.push(`=== KẾT QUẢ PHÂN TÍCH FIT ===`);
  lines.push(`Loại đồ: ${analysis.garmentType} | Giới tính: ${analysis.gender === "male" ? "Nam" : "Nữ"}`);
  lines.push(`Size đang chọn: ${analysis.currentSize}`);
  lines.push(`Đánh giá tổng: ${analysis.overallLabel} (score: ${analysis.overallScore})`);
  lines.push(`Size gợi ý (vừa vặn): ${analysis.recommendedSize}`);
  lines.push(`Size gợi ý (thoải mái): ${analysis.comfortSize}`);
  lines.push(``);
  lines.push(`Chi tiết từng số đo:`);

  for (const d of analysis.details) {
    lines.push(`- ${d.label}: cơ thể ${d.bodyValue}cm, áo ${d.sizeRange[0]}-${d.sizeRange[1]}cm → ${d.fitLabel}`);
  }

  return lines.join("\n");
}
