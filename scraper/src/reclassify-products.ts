import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type GarmentType = "t-shirt" | "shirt" | "pant" | "short-pant";

interface SizeChart {
  size: string;
  length_cm: number;
  chest_half_cm?: number;
  shoulder_cm?: number;
  waist_half_cm?: number;
  hip_half_cm?: number;
  inseam_cm?: number;
  outseam_cm?: number;
}

interface Product {
  name: string;
  slug: string;
  price: number;
  discountPrice?: number;
  description: string;
  imageUrl: string;
  categorySlug: string;
  rating: number;
  soldCount: number;
  brand: string;
  expiryDate: string;
  stock: number;
  shippingInfo: string;
  colorCodes: string[];
  sizes: string[];
  sizeChart: SizeChart[];
  garment_type: string;
}

// Keywords indicating LONG sleeve (→ shirt)
const LONG_SLEEVE_KEYWORDS = [
  "dài tay",
  "tay dài",
  "long sleeve",
  "raglan", // typically long sleeve sporty tops
  "hoodie",
  "nỉ mũ",
  "nỉ nam",
  "nỉ nữ",
  "knit long",
  "thu đông",
];

// Keywords indicating SHORT sleeve (→ t-shirt)
const SHORT_SLEEVE_KEYWORDS = [
  "ngắn tay",
  "cộc tay",
  "tay ngắn",
  "short sleeve",
  "không tay",
  "ba lỗ",
];

/**
 * Determine garment_type based on categorySlug and product name.
 * Returns null if the product should be excluded (non-clothing: giay, tat, phu-kien).
 */
function classifyProduct(product: Product): GarmentType | null {
  const { categorySlug, name } = product;
  const nameLower = name.toLowerCase();

  // ─── Non-clothing: exclude ────────────────────────────────────────────────
  if (["giay", "tat", "phu-kien"].includes(categorySlug)) {
    return null;
  }

  // ─── Quần dài → pant ─────────────────────────────────────────────────────
  if (categorySlug === "quan-dai") {
    return "pant";
  }

  // ─── Quần ngắn → short-pant ──────────────────────────────────────────────
  if (categorySlug === "quan-short") {
    return "short-pant";
  }

  // ─── Áo tay dài → shirt (all of them are long-sleeve) ───────────────────
  if (categorySlug === "ao-tay-dai") {
    return "shirt";
  }

  // ─── Áo sơ mi: detect by name ────────────────────────────────────────────
  if (categorySlug === "ao-so-mi") {
    // Short-sleeve keywords in name → t-shirt
    if (SHORT_SLEEVE_KEYWORDS.some((kw) => nameLower.includes(kw))) {
      return "t-shirt";
    }
    // Long-sleeve keywords → shirt
    if (LONG_SLEEVE_KEYWORDS.some((kw) => nameLower.includes(kw))) {
      return "shirt";
    }
    // Default for ao-so-mi without explicit sleeve info → shirt
    // (sơ mi is traditionally associated with button-up/collared shirts)
    return "shirt";
  }

  // ─── Áo thun: detect by name ─────────────────────────────────────────────
  if (categorySlug === "ao-thun") {
    // Long-sleeve keywords → shirt
    if (LONG_SLEEVE_KEYWORDS.some((kw) => nameLower.includes(kw))) {
      return "shirt";
    }
    // Short-sleeve or default → t-shirt
    return "t-shirt";
  }

  // ─── Fallback: try to infer from name alone ───────────────────────────────
  if (
    nameLower.includes("quần") ||
    nameLower.includes("quan") ||
    nameLower.includes("short") ||
    nameLower.includes("jogger")
  ) {
    if (
      nameLower.includes("ngắn") ||
      nameLower.includes("short") ||
      nameLower.includes("lửng")
    ) {
      return "short-pant";
    }
    return "pant";
  }

  // Default for unknown tops → t-shirt
  return "t-shirt";
}

// ─── Size chart templates ────────────────────────────────────────────────────

const TSHIRT_SIZE_CHART: SizeChart[] = [
  { size: "S", length_cm: 66, chest_half_cm: 46, shoulder_cm: 41 },
  { size: "M", length_cm: 69, chest_half_cm: 49, shoulder_cm: 44 },
  { size: "L", length_cm: 72, chest_half_cm: 52, shoulder_cm: 47 },
  { size: "XL", length_cm: 75, chest_half_cm: 55, shoulder_cm: 50 },
];

const SHIRT_SIZE_CHART: SizeChart[] = [
  { size: "S", length_cm: 72, chest_half_cm: 47, shoulder_cm: 42 },
  { size: "M", length_cm: 75, chest_half_cm: 50, shoulder_cm: 45 },
  { size: "L", length_cm: 78, chest_half_cm: 53, shoulder_cm: 48 },
  { size: "XL", length_cm: 81, chest_half_cm: 56, shoulder_cm: 51 },
];

const PANT_SIZE_CHART: SizeChart[] = [
  { size: "S", length_cm: 97, waist_half_cm: 37, hip_half_cm: 47, inseam_cm: 73, outseam_cm: 97 },
  { size: "M", length_cm: 99, waist_half_cm: 39, hip_half_cm: 50, inseam_cm: 75, outseam_cm: 99 },
  { size: "L", length_cm: 101, waist_half_cm: 41, hip_half_cm: 53, inseam_cm: 77, outseam_cm: 101 },
  { size: "XL", length_cm: 103, waist_half_cm: 44, hip_half_cm: 56, inseam_cm: 79, outseam_cm: 103 },
];

const SHORT_PANT_SIZE_CHART: SizeChart[] = [
  { size: "S", length_cm: 48, waist_half_cm: 37, hip_half_cm: 47, inseam_cm: 20, outseam_cm: 48 },
  { size: "M", length_cm: 50, waist_half_cm: 39, hip_half_cm: 50, inseam_cm: 22, outseam_cm: 50 },
  { size: "L", length_cm: 52, waist_half_cm: 41, hip_half_cm: 53, inseam_cm: 24, outseam_cm: 52 },
  { size: "XL", length_cm: 54, waist_half_cm: 44, hip_half_cm: 56, inseam_cm: 26, outseam_cm: 54 },
];

function getSizeChartTemplate(garmentType: GarmentType): SizeChart[] {
  switch (garmentType) {
    case "t-shirt":
      return TSHIRT_SIZE_CHART;
    case "shirt":
      return SHIRT_SIZE_CHART;
    case "pant":
      return PANT_SIZE_CHART;
    case "short-pant":
      return SHORT_PANT_SIZE_CHART;
  }
}

// ─── Category slug mapping ───────────────────────────────────────────────────

function getCategorySlug(garmentType: GarmentType): string {
  switch (garmentType) {
    case "t-shirt":
      return "ao-thun";
    case "shirt":
      return "ao-so-mi";
    case "pant":
      return "quan-dai";
    case "short-pant":
      return "quan-short";
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────

const inputPath = path.join(__dirname, "../data/formatted-products.json");
const outputPath = path.join(__dirname, "../data/formatted-products.json");

const raw: Product[] = JSON.parse(fs.readFileSync(inputPath, "utf-8"));

const results = {
  "t-shirt": 0,
  shirt: 0,
  pant: 0,
  "short-pant": 0,
  excluded: 0,
};

const classified = raw
  .map((product) => {
    const garmentType = classifyProduct(product);

    if (garmentType === null) {
      results.excluded++;
      return null;
    }

    results[garmentType]++;

    return {
      ...product,
      categorySlug: getCategorySlug(garmentType),
      sizeChart: getSizeChartTemplate(garmentType),
      garment_type: garmentType,
    };
  })
  .filter(Boolean);

console.log("\n=== Classification Results ===");
console.log(`Total input:    ${raw.length}`);
console.log(`  → t-shirt:    ${results["t-shirt"]}`);
console.log(`  → shirt:      ${results.shirt}`);
console.log(`  → pant:       ${results.pant}`);
console.log(`  → short-pant: ${results["short-pant"]}`);
console.log(`  → excluded:   ${results.excluded} (giay/tat/phu-kien)`);
console.log(`Total output:   ${classified.length}`);

fs.writeFileSync(outputPath, JSON.stringify(classified, null, 2), "utf-8");
console.log(`\n✅ Saved to ${outputPath}`);
