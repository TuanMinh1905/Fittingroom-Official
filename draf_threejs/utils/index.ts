// ===== TMFashion Utility Functions =====

/**
 * Format số tiền VND với dấu chấm phân cách
 * Ví dụ: 1500000 → "1.500.000"
 */
export function formatVNDWithComma(value: number): string {
  if (!value && value !== 0) return "0";
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/**
 * Format số tiền VND đầy đủ
 * Ví dụ: 1500000 → "1.500.000₫"
 */
export function formatVND(value: number): string {
  return formatVNDWithComma(value) + "₫";
}

/**
 * Format ngày theo locale vi-VN
 */
export function formatDate(
  dateStr: string | Date,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }
): string {
  if (!dateStr) return "N/A";
  const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
  if (isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("vi-VN", options);
}

/**
 * Tạo slug từ tên tiếng Việt
 */
export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Format số lớn (K, M)
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

/**
 * Tính phần trăm giảm giá
 */
export function discountPercent(price: number, compareAtPrice: number): number {
  if (!compareAtPrice || compareAtPrice <= price) return 0;
  return Math.round((1 - price / compareAtPrice) * 100);
}

/**
 * Cn function: class name join (loại bỏ falsy values)
 */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
