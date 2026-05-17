// ===== Dữ liệu tỉnh/thành phố, quận/huyện Việt Nam =====
// Dùng cho: chọn địa chỉ giao hàng + tính phí ship theo vùng
// 63 tỉnh/thành phố — phân loại 5 vùng ship

export type ShippingZone = 'noi_thanh' | 'ngoai_thanh' | 'lan_can' | 'trong_nuoc' | 'vung_xa'

export interface District {
  name: string
  zone?: ShippingZone // Nếu khác zone của tỉnh (VD: ngoại thành HCM/HN)
}

export interface Province {
  code: string
  name: string
  zone: ShippingZone
  districts: District[]
}

// ===== Bảng phí ship (đồng) theo vùng × phương thức =====
// express = 0 nghĩa là KHÔNG hỗ trợ vùng đó
export const SHIPPING_RATES: Record<ShippingZone, { standard: number; fast: number; express: number }> = {
  noi_thanh:   { standard: 15000, fast: 30000, express: 50000 },
  ngoai_thanh: { standard: 20000, fast: 40000, express: 70000 },
  lan_can:     { standard: 25000, fast: 50000, express: 0 },
  trong_nuoc:  { standard: 35000, fast: 60000, express: 0 },
  vung_xa:     { standard: 50000, fast: 80000, express: 0 },
}

// Miễn phí ship tiêu chuẩn khi đơn hàng >= ngưỡng (0 = không miễn phí)
export const FREE_SHIPPING_THRESHOLDS: Record<ShippingZone, number> = {
  noi_thanh: 300000,    // 300k
  ngoai_thanh: 500000,  // 500k
  lan_can: 500000,      // 500k
  trong_nuoc: 1000000,  // 1 triệu
  vung_xa: 0,           // Không miễn phí
}

// Tên vùng hiển thị
export const ZONE_LABELS: Record<ShippingZone, string> = {
  noi_thanh: 'Nội thành',
  ngoai_thanh: 'Ngoại thành',
  lan_can: 'Lân cận',
  trong_nuoc: 'Liên tỉnh',
  vung_xa: 'Vùng xa',
}

// ===== Helper: tạo mảng District nhanh (inherit zone tỉnh) =====
function ds(...names: string[]): District[] {
  return names.map(name => ({ name }))
}

// Helper: district với zone khác tỉnh
function dz(name: string, zone: ShippingZone): District {
  return { name, zone }
}

// ===== Tính phí ship =====
// Trả về: số tiền phí ship, hoặc -1 nếu phương thức không hỗ trợ vùng đó
export function calculateShippingFee(
  zone: ShippingZone,
  method: 'standard' | 'fast' | 'express',
  orderAmount: number,
): number {
  const rates = SHIPPING_RATES[zone]
  const fee = rates[method]

  // Phương thức không hỗ trợ (VD: express ở vùng xa)
  if (fee === 0) return -1

  // Kiểm tra miễn phí ship tiêu chuẩn
  if (method === 'standard') {
    const threshold = FREE_SHIPPING_THRESHOLDS[zone]
    if (threshold > 0 && orderAmount >= threshold) return 0
  }

  return fee
}

// ===== Lấy zone từ tỉnh + quận =====
export function getShippingZone(provinceCode: string, districtName?: string): ShippingZone {
  const province = PROVINCES.find(p => p.code === provinceCode)
  if (!province) return 'trong_nuoc' // Fallback

  // Kiểm tra district có zone override không (VD: ngoại thành HCM/HN)
  if (districtName) {
    const district = province.districts.find(d => d.name === districtName)
    if (district?.zone) return district.zone
  }

  return province.zone
}

// ===== Kiểm tra phương thức có khả dụng cho zone không =====
export function isMethodAvailable(zone: ShippingZone, method: 'standard' | 'fast' | 'express'): boolean {
  return SHIPPING_RATES[zone][method] > 0
}

// ==========================================================================
//                         DỮ LIỆU 63 TỈNH / THÀNH PHỐ
// ==========================================================================

export const PROVINCES: Province[] = [

  // ==================== TP. HỒ CHÍ MINH ====================
  {
    code: 'HCM', name: 'TP. Hồ Chí Minh', zone: 'noi_thanh',
    districts: [
      // Quận nội thành (inherit zone noi_thanh)
      { name: 'Quận 1' },
      { name: 'Quận 3' },
      { name: 'Quận 4' },
      { name: 'Quận 5' },
      { name: 'Quận 6' },
      { name: 'Quận 7' },
      { name: 'Quận 8' },
      { name: 'Quận 10' },
      { name: 'Quận 11' },
      { name: 'Quận 12' },
      { name: 'Quận Bình Tân' },
      { name: 'Quận Bình Thạnh' },
      { name: 'Quận Gò Vấp' },
      { name: 'Quận Phú Nhuận' },
      { name: 'Quận Tân Bình' },
      { name: 'Quận Tân Phú' },
      { name: 'TP. Thủ Đức' },
      // Huyện ngoại thành (zone override → ngoai_thanh)
      dz('Huyện Bình Chánh', 'ngoai_thanh'),
      dz('Huyện Cần Giờ', 'ngoai_thanh'),
      dz('Huyện Củ Chi', 'ngoai_thanh'),
      dz('Huyện Hóc Môn', 'ngoai_thanh'),
      dz('Huyện Nhà Bè', 'ngoai_thanh'),
    ],
  },

  // ==================== TP. HÀ NỘI ====================
  {
    code: 'HN', name: 'TP. Hà Nội', zone: 'noi_thanh',
    districts: [
      // Quận nội thành
      { name: 'Quận Ba Đình' },
      { name: 'Quận Bắc Từ Liêm' },
      { name: 'Quận Cầu Giấy' },
      { name: 'Quận Đống Đa' },
      { name: 'Quận Hà Đông' },
      { name: 'Quận Hai Bà Trưng' },
      { name: 'Quận Hoàn Kiếm' },
      { name: 'Quận Hoàng Mai' },
      { name: 'Quận Long Biên' },
      { name: 'Quận Nam Từ Liêm' },
      { name: 'Quận Tây Hồ' },
      { name: 'Quận Thanh Xuân' },
      // Thị xã + Huyện ngoại thành
      dz('Thị xã Sơn Tây', 'ngoai_thanh'),
      dz('Huyện Ba Vì', 'ngoai_thanh'),
      dz('Huyện Chương Mỹ', 'ngoai_thanh'),
      dz('Huyện Đan Phượng', 'ngoai_thanh'),
      dz('Huyện Đông Anh', 'ngoai_thanh'),
      dz('Huyện Gia Lâm', 'ngoai_thanh'),
      dz('Huyện Hoài Đức', 'ngoai_thanh'),
      dz('Huyện Mê Linh', 'ngoai_thanh'),
      dz('Huyện Mỹ Đức', 'ngoai_thanh'),
      dz('Huyện Phú Xuyên', 'ngoai_thanh'),
      dz('Huyện Phúc Thọ', 'ngoai_thanh'),
      dz('Huyện Quốc Oai', 'ngoai_thanh'),
      dz('Huyện Sóc Sơn', 'ngoai_thanh'),
      dz('Huyện Thạch Thất', 'ngoai_thanh'),
      dz('Huyện Thanh Oai', 'ngoai_thanh'),
      dz('Huyện Thanh Trì', 'ngoai_thanh'),
      dz('Huyện Thường Tín', 'ngoai_thanh'),
      dz('Huyện Ứng Hòa', 'ngoai_thanh'),
    ],
  },

  // ==================== TP. ĐÀ NẴNG ====================
  {
    code: 'DN', name: 'TP. Đà Nẵng', zone: 'trong_nuoc',
    districts: ds(
      'Quận Hải Châu', 'Quận Thanh Khê', 'Quận Sơn Trà',
      'Quận Ngũ Hành Sơn', 'Quận Liên Chiểu', 'Quận Cẩm Lệ',
      'Huyện Hòa Vang', 'Huyện Hoàng Sa',
    ),
  },

  // ==================== TP. HẢI PHÒNG ====================
  {
    code: 'HP', name: 'TP. Hải Phòng', zone: 'trong_nuoc',
    districts: ds(
      'Quận Hồng Bàng', 'Quận Lê Chân', 'Quận Ngô Quyền',
      'Quận Kiến An', 'Quận Hải An', 'Quận Đồ Sơn', 'Quận Dương Kinh',
      'Huyện An Dương', 'Huyện An Lão', 'Huyện Bạch Long Vĩ',
      'Huyện Cát Hải', 'Huyện Kiến Thụy', 'Huyện Thủy Nguyên',
      'Huyện Tiên Lãng', 'Huyện Vĩnh Bảo',
    ),
  },

  // ==================== TP. CẦN THƠ ====================
  {
    code: 'CT', name: 'TP. Cần Thơ', zone: 'trong_nuoc',
    districts: ds(
      'Quận Ninh Kiều', 'Quận Bình Thủy', 'Quận Cái Răng',
      'Quận Ô Môn', 'Quận Thốt Nốt',
      'Huyện Cờ Đỏ', 'Huyện Phong Điền', 'Huyện Thới Lai', 'Huyện Vĩnh Thạnh',
    ),
  },

  // ==================== LÂN CẬN TP.HCM ====================
  {
    code: 'BD', name: 'Bình Dương', zone: 'lan_can',
    districts: ds(
      'TP. Thủ Dầu Một', 'TP. Dĩ An', 'TP. Thuận An', 'TP. Tân Uyên', 'TP. Bến Cát',
      'Huyện Bàu Bàng', 'Huyện Bắc Tân Uyên', 'Huyện Dầu Tiếng', 'Huyện Phú Giáo',
    ),
  },
  {
    code: 'DNI', name: 'Đồng Nai', zone: 'lan_can',
    districts: ds(
      'TP. Biên Hòa', 'TP. Long Khánh',
      'Huyện Cẩm Mỹ', 'Huyện Định Quán', 'Huyện Long Thành',
      'Huyện Nhơn Trạch', 'Huyện Tân Phú', 'Huyện Thống Nhất',
      'Huyện Trảng Bom', 'Huyện Vĩnh Cửu', 'Huyện Xuân Lộc',
    ),
  },
  {
    code: 'LA', name: 'Long An', zone: 'lan_can',
    districts: ds(
      'TP. Tân An', 'Thị xã Kiến Tường',
      'Huyện Bến Lức', 'Huyện Cần Đước', 'Huyện Cần Giuộc',
      'Huyện Châu Thành', 'Huyện Đức Hòa', 'Huyện Đức Huệ',
      'Huyện Mộc Hóa', 'Huyện Tân Hưng', 'Huyện Tân Thạnh',
      'Huyện Tân Trụ', 'Huyện Thạnh Hóa', 'Huyện Thủ Thừa', 'Huyện Vĩnh Hưng',
    ),
  },
  {
    code: 'BRVT', name: 'Bà Rịa - Vũng Tàu', zone: 'lan_can',
    districts: ds(
      'TP. Vũng Tàu', 'TP. Bà Rịa', 'Thị xã Phú Mỹ',
      'Huyện Châu Đức', 'Huyện Côn Đảo', 'Huyện Đất Đỏ',
      'Huyện Long Điền', 'Huyện Xuyên Mộc',
    ),
  },
  {
    code: 'TN', name: 'Tây Ninh', zone: 'lan_can',
    districts: ds(
      'TP. Tây Ninh', 'Thị xã Hòa Thành', 'Thị xã Trảng Bàng',
      'Huyện Bến Cầu', 'Huyện Châu Thành', 'Huyện Dương Minh Châu',
      'Huyện Gò Dầu', 'Huyện Tân Biên', 'Huyện Tân Châu',
    ),
  },

  // ==================== LÂN CẬN HÀ NỘI ====================
  {
    code: 'BN', name: 'Bắc Ninh', zone: 'lan_can',
    districts: ds(
      'TP. Bắc Ninh', 'TP. Từ Sơn',
      'Huyện Gia Bình', 'Huyện Lương Tài', 'Huyện Quế Võ',
      'Huyện Thuận Thành', 'Huyện Tiên Du', 'Huyện Yên Phong',
    ),
  },
  {
    code: 'HY', name: 'Hưng Yên', zone: 'lan_can',
    districts: ds(
      'TP. Hưng Yên', 'Thị xã Mỹ Hào',
      'Huyện Ân Thi', 'Huyện Khoái Châu', 'Huyện Kim Động',
      'Huyện Phù Cừ', 'Huyện Tiên Lữ', 'Huyện Văn Giang',
      'Huyện Văn Lâm', 'Huyện Yên Mỹ',
    ),
  },
  {
    code: 'HD', name: 'Hải Dương', zone: 'lan_can',
    districts: ds(
      'TP. Hải Dương', 'TP. Chí Linh',
      'Huyện Bình Giang', 'Huyện Cẩm Giàng', 'Huyện Gia Lộc',
      'Huyện Kim Thành', 'Huyện Kinh Môn', 'Huyện Nam Sách',
      'Huyện Ninh Giang', 'Huyện Thanh Hà', 'Huyện Thanh Miện', 'Huyện Tứ Kỳ',
    ),
  },
  {
    code: 'VP', name: 'Vĩnh Phúc', zone: 'lan_can',
    districts: ds(
      'TP. Vĩnh Yên', 'TP. Phúc Yên',
      'Huyện Bình Xuyên', 'Huyện Lập Thạch', 'Huyện Sông Lô',
      'Huyện Tam Dương', 'Huyện Tam Đảo', 'Huyện Vĩnh Tường', 'Huyện Yên Lạc',
    ),
  },
  {
    code: 'HNA', name: 'Hà Nam', zone: 'lan_can',
    districts: ds(
      'TP. Phủ Lý', 'Thị xã Duy Tiên',
      'Huyện Bình Lục', 'Huyện Kim Bảng', 'Huyện Lý Nhân', 'Huyện Thanh Liêm',
    ),
  },

  // ==================== MIỀN NAM - ĐÔNG NAM BỘ ====================
  {
    code: 'BP', name: 'Bình Phước', zone: 'trong_nuoc',
    districts: ds(
      'TP. Đồng Xoài', 'Thị xã Bình Long', 'Thị xã Phước Long', 'Thị xã Chơn Thành',
      'Huyện Bù Đăng', 'Huyện Bù Đốp', 'Huyện Bù Gia Mập',
      'Huyện Đồng Phú', 'Huyện Hớn Quản', 'Huyện Lộc Ninh', 'Huyện Phú Riềng',
    ),
  },

  // ==================== MIỀN NAM - ĐỒNG BẰNG SÔNG CỬU LONG ====================
  {
    code: 'AG', name: 'An Giang', zone: 'trong_nuoc',
    districts: ds(
      'TP. Long Xuyên', 'TP. Châu Đốc',
      'Huyện An Phú', 'Huyện Châu Phú', 'Huyện Châu Thành',
      'Huyện Chợ Mới', 'Huyện Phú Tân', 'Thị xã Tân Châu',
      'Huyện Thoại Sơn', 'Huyện Tịnh Biên', 'Huyện Tri Tôn',
    ),
  },
  {
    code: 'BL', name: 'Bạc Liêu', zone: 'trong_nuoc',
    districts: ds(
      'TP. Bạc Liêu', 'Thị xã Giá Rai',
      'Huyện Đông Hải', 'Huyện Hòa Bình', 'Huyện Hồng Dân',
      'Huyện Phước Long', 'Huyện Vĩnh Lợi',
    ),
  },
  {
    code: 'BTE', name: 'Bến Tre', zone: 'trong_nuoc',
    districts: ds(
      'TP. Bến Tre',
      'Huyện Ba Tri', 'Huyện Bình Đại', 'Huyện Châu Thành',
      'Huyện Chợ Lách', 'Huyện Giồng Trôm', 'Huyện Mỏ Cày Bắc',
      'Huyện Mỏ Cày Nam', 'Huyện Thạnh Phú',
    ),
  },
  {
    code: 'CM', name: 'Cà Mau', zone: 'trong_nuoc',
    districts: ds(
      'TP. Cà Mau',
      'Huyện Cái Nước', 'Huyện Đầm Dơi', 'Huyện Năm Căn',
      'Huyện Ngọc Hiển', 'Huyện Phú Tân', 'Huyện Thới Bình',
      'Huyện Trần Văn Thời', 'Huyện U Minh',
    ),
  },
  {
    code: 'DT', name: 'Đồng Tháp', zone: 'trong_nuoc',
    districts: ds(
      'TP. Cao Lãnh', 'TP. Sa Đéc', 'TP. Hồng Ngự',
      'Huyện Cao Lãnh', 'Huyện Châu Thành', 'Huyện Hồng Ngự',
      'Huyện Lai Vung', 'Huyện Lấp Vò', 'Huyện Tam Nông',
      'Huyện Tân Hồng', 'Huyện Thanh Bình', 'Huyện Tháp Mười',
    ),
  },
  {
    code: 'HGI', name: 'Hậu Giang', zone: 'trong_nuoc',
    districts: ds(
      'TP. Vị Thanh', 'TP. Ngã Bảy', 'Thị xã Long Mỹ',
      'Huyện Châu Thành', 'Huyện Châu Thành A',
      'Huyện Phụng Hiệp', 'Huyện Vị Thủy',
    ),
  },
  {
    code: 'KG', name: 'Kiên Giang', zone: 'trong_nuoc',
    districts: ds(
      'TP. Rạch Giá', 'TP. Hà Tiên', 'TP. Phú Quốc',
      'Huyện An Biên', 'Huyện An Minh', 'Huyện Châu Thành',
      'Huyện Giang Thành', 'Huyện Giồng Riềng', 'Huyện Gò Quao',
      'Huyện Hòn Đất', 'Huyện Kiên Hải', 'Huyện Kiên Lương',
      'Huyện Tân Hiệp', 'Huyện U Minh Thượng', 'Huyện Vĩnh Thuận',
    ),
  },
  {
    code: 'ST', name: 'Sóc Trăng', zone: 'trong_nuoc',
    districts: ds(
      'TP. Sóc Trăng', 'Thị xã Ngã Năm', 'Thị xã Vĩnh Châu',
      'Huyện Châu Thành', 'Huyện Cù Lao Dung', 'Huyện Kế Sách',
      'Huyện Long Phú', 'Huyện Mỹ Tú', 'Huyện Mỹ Xuyên',
      'Huyện Thạnh Trị', 'Huyện Trần Đề',
    ),
  },
  {
    code: 'TG', name: 'Tiền Giang', zone: 'trong_nuoc',
    districts: ds(
      'TP. Mỹ Tho', 'TP. Gò Công', 'Thị xã Cai Lậy',
      'Huyện Cai Lậy', 'Huyện Cái Bè', 'Huyện Châu Thành',
      'Huyện Chợ Gạo', 'Huyện Gò Công Đông', 'Huyện Gò Công Tây',
      'Huyện Tân Phú Đông', 'Huyện Tân Phước',
    ),
  },
  {
    code: 'TV', name: 'Trà Vinh', zone: 'trong_nuoc',
    districts: ds(
      'TP. Trà Vinh', 'Thị xã Duyên Hải',
      'Huyện Càng Long', 'Huyện Cầu Kè', 'Huyện Cầu Ngang',
      'Huyện Châu Thành', 'Huyện Duyên Hải', 'Huyện Tiểu Cần', 'Huyện Trà Cú',
    ),
  },
  {
    code: 'VL', name: 'Vĩnh Long', zone: 'trong_nuoc',
    districts: ds(
      'TP. Vĩnh Long', 'Thị xã Bình Minh',
      'Huyện Bình Tân', 'Huyện Long Hồ', 'Huyện Mang Thít',
      'Huyện Tam Bình', 'Huyện Trà Ôn', 'Huyện Vũng Liêm',
    ),
  },

  // ==================== MIỀN TRUNG - BẮC TRUNG BỘ ====================
  {
    code: 'THA', name: 'Thanh Hóa', zone: 'trong_nuoc',
    districts: ds(
      'TP. Thanh Hóa', 'TP. Sầm Sơn',
      'Thị xã Bỉm Sơn', 'Thị xã Nghi Sơn',
      'Huyện Bá Thước', 'Huyện Cẩm Thủy', 'Huyện Đông Sơn',
      'Huyện Hà Trung', 'Huyện Hậu Lộc', 'Huyện Hoằng Hóa',
      'Huyện Lang Chánh', 'Huyện Mường Lát', 'Huyện Nga Sơn',
      'Huyện Ngọc Lặc', 'Huyện Như Thanh', 'Huyện Như Xuân',
      'Huyện Nông Cống', 'Huyện Quan Hóa', 'Huyện Quan Sơn',
      'Huyện Quảng Xương', 'Huyện Thạch Thành', 'Huyện Thiệu Hóa',
      'Huyện Thọ Xuân', 'Huyện Thường Xuân', 'Huyện Triệu Sơn',
      'Huyện Vĩnh Lộc', 'Huyện Yên Định',
    ),
  },
  {
    code: 'NA', name: 'Nghệ An', zone: 'trong_nuoc',
    districts: ds(
      'TP. Vinh', 'Thị xã Cửa Lò', 'Thị xã Hoàng Mai', 'Thị xã Thái Hòa',
      'Huyện Anh Sơn', 'Huyện Con Cuông', 'Huyện Diễn Châu',
      'Huyện Đô Lương', 'Huyện Hưng Nguyên', 'Huyện Kỳ Sơn',
      'Huyện Nam Đàn', 'Huyện Nghi Lộc', 'Huyện Nghĩa Đàn',
      'Huyện Quế Phong', 'Huyện Quỳ Châu', 'Huyện Quỳ Hợp',
      'Huyện Quỳnh Lưu', 'Huyện Tân Kỳ', 'Huyện Thanh Chương',
      'Huyện Tương Dương', 'Huyện Yên Thành',
    ),
  },
  {
    code: 'HT', name: 'Hà Tĩnh', zone: 'trong_nuoc',
    districts: ds(
      'TP. Hà Tĩnh', 'Thị xã Hồng Lĩnh', 'Thị xã Kỳ Anh',
      'Huyện Cẩm Xuyên', 'Huyện Can Lộc', 'Huyện Đức Thọ',
      'Huyện Hương Khê', 'Huyện Hương Sơn', 'Huyện Kỳ Anh',
      'Huyện Lộc Hà', 'Huyện Nghi Xuân', 'Huyện Thạch Hà', 'Huyện Vũ Quang',
    ),
  },
  {
    code: 'QB', name: 'Quảng Bình', zone: 'trong_nuoc',
    districts: ds(
      'TP. Đồng Hới', 'Thị xã Ba Đồn',
      'Huyện Bố Trạch', 'Huyện Lệ Thủy', 'Huyện Minh Hóa',
      'Huyện Quảng Ninh', 'Huyện Quảng Trạch', 'Huyện Tuyên Hóa',
    ),
  },
  {
    code: 'QT', name: 'Quảng Trị', zone: 'trong_nuoc',
    districts: ds(
      'TP. Đông Hà', 'Thị xã Quảng Trị',
      'Huyện Cam Lộ', 'Huyện Đa Krông', 'Huyện Gio Linh',
      'Huyện Hải Lăng', 'Huyện Hướng Hóa', 'Huyện Triệu Phong',
      'Huyện Vĩnh Linh', 'Huyện Cồn Cỏ',
    ),
  },
  {
    code: 'TTH', name: 'Thừa Thiên Huế', zone: 'trong_nuoc',
    districts: ds(
      'TP. Huế',
      'Huyện A Lưới', 'Huyện Nam Đông', 'Huyện Phong Điền',
      'Huyện Phú Lộc', 'Huyện Phú Vang', 'Huyện Quảng Điền',
      'Huyện Hương Thủy', 'Huyện Hương Trà',
    ),
  },

  // ==================== MIỀN TRUNG - NAM TRUNG BỘ ====================
  {
    code: 'QNA', name: 'Quảng Nam', zone: 'trong_nuoc',
    districts: ds(
      'TP. Tam Kỳ', 'TP. Hội An',
      'Huyện Bắc Trà My', 'Huyện Đại Lộc', 'Huyện Điện Bàn',
      'Huyện Đông Giang', 'Huyện Duy Xuyên', 'Huyện Hiệp Đức',
      'Huyện Nam Giang', 'Huyện Nam Trà My', 'Huyện Nông Sơn',
      'Huyện Núi Thành', 'Huyện Phú Ninh', 'Huyện Phước Sơn',
      'Huyện Quế Sơn', 'Huyện Tây Giang', 'Huyện Thăng Bình', 'Huyện Tiên Phước',
    ),
  },
  {
    code: 'QNG', name: 'Quảng Ngãi', zone: 'trong_nuoc',
    districts: ds(
      'TP. Quảng Ngãi',
      'Huyện Ba Tơ', 'Huyện Bình Sơn', 'Huyện Đức Phổ',
      'Huyện Lý Sơn', 'Huyện Minh Long', 'Huyện Mộ Đức',
      'Huyện Nghĩa Hành', 'Huyện Sơn Hà', 'Huyện Sơn Tây',
      'Huyện Sơn Tịnh', 'Huyện Tây Trà', 'Huyện Trà Bồng', 'Huyện Tư Nghĩa',
    ),
  },
  {
    code: 'BDI', name: 'Bình Định', zone: 'trong_nuoc',
    districts: ds(
      'TP. Quy Nhơn',
      'Thị xã An Nhơn', 'Thị xã Hoài Nhơn',
      'Huyện An Lão', 'Huyện Hoài Ân', 'Huyện Phù Cát',
      'Huyện Phù Mỹ', 'Huyện Tây Sơn', 'Huyện Tuy Phước',
      'Huyện Vân Canh', 'Huyện Vĩnh Thạnh',
    ),
  },
  {
    code: 'PY', name: 'Phú Yên', zone: 'trong_nuoc',
    districts: ds(
      'TP. Tuy Hòa', 'Thị xã Sông Cầu',
      'Huyện Đông Hòa', 'Huyện Đồng Xuân', 'Huyện Phú Hòa',
      'Huyện Sơn Hòa', 'Huyện Sông Hinh', 'Huyện Tây Hòa', 'Huyện Tuy An',
    ),
  },
  {
    code: 'KH', name: 'Khánh Hòa', zone: 'trong_nuoc',
    districts: ds(
      'TP. Nha Trang', 'TP. Cam Ranh', 'Thị xã Ninh Hòa',
      'Huyện Cam Lâm', 'Huyện Diên Khánh', 'Huyện Khánh Sơn',
      'Huyện Khánh Vĩnh', 'Huyện Trường Sa', 'Huyện Vạn Ninh',
    ),
  },
  {
    code: 'NT', name: 'Ninh Thuận', zone: 'trong_nuoc',
    districts: ds(
      'TP. Phan Rang - Tháp Chàm',
      'Huyện Bác Ái', 'Huyện Ninh Hải', 'Huyện Ninh Phước',
      'Huyện Ninh Sơn', 'Huyện Thuận Bắc', 'Huyện Thuận Nam',
    ),
  },
  {
    code: 'BTH', name: 'Bình Thuận', zone: 'trong_nuoc',
    districts: ds(
      'TP. Phan Thiết', 'Thị xã La Gi',
      'Huyện Bắc Bình', 'Huyện Đức Linh', 'Huyện Hàm Thuận Bắc',
      'Huyện Hàm Thuận Nam', 'Huyện Hàm Tân', 'Huyện Phú Quý',
      'Huyện Tánh Linh', 'Huyện Tuy Phong',
    ),
  },

  // ==================== TÂY NGUYÊN ====================
  {
    code: 'DL', name: 'Đắk Lắk', zone: 'trong_nuoc',
    districts: ds(
      'TP. Buôn Ma Thuột', 'Thị xã Buôn Hồ',
      'Huyện Buôn Đôn', 'Huyện Cư Kuin', 'Huyện Cư Mgar',
      'Huyện Ea Hleo', 'Huyện Ea Kar', 'Huyện Ea Súp',
      'Huyện Krông Ana', 'Huyện Krông Bông', 'Huyện Krông Búk',
      'Huyện Krông Năng', 'Huyện Krông Pắc', 'Huyện Lắk', 'Huyện Mđrắk',
    ),
  },
  {
    code: 'DNO', name: 'Đắk Nông', zone: 'trong_nuoc',
    districts: ds(
      'TP. Gia Nghĩa',
      'Huyện Cư Jút', 'Huyện Đắk Glong', 'Huyện Đắk Mil',
      'Huyện Đắk Rlấp', 'Huyện Đắk Song', 'Huyện Krông Nô', 'Huyện Tuy Đức',
    ),
  },
  {
    code: 'GL', name: 'Gia Lai', zone: 'trong_nuoc',
    districts: ds(
      'TP. Pleiku', 'Thị xã An Khê', 'Thị xã Ayun Pa',
      'Huyện Chư Păh', 'Huyện Chư Prông', 'Huyện Chư Pưh', 'Huyện Chư Sê',
      'Huyện Đắk Đoa', 'Huyện Đắk Pơ', 'Huyện Đức Cơ',
      'Huyện Ia Grai', 'Huyện Ia Pa', 'Huyện Kbang',
      'Huyện Kông Chro', 'Huyện Krông Pa', 'Huyện Mang Yang', 'Huyện Phú Thiện',
    ),
  },
  {
    code: 'LD', name: 'Lâm Đồng', zone: 'trong_nuoc',
    districts: ds(
      'TP. Đà Lạt', 'TP. Bảo Lộc',
      'Huyện Bảo Lâm', 'Huyện Cát Tiên', 'Huyện Đạ Huoai',
      'Huyện Đạ Tẻh', 'Huyện Đam Rông', 'Huyện Di Linh',
      'Huyện Đơn Dương', 'Huyện Đức Trọng', 'Huyện Lạc Dương', 'Huyện Lâm Hà',
    ),
  },
  {
    code: 'KT', name: 'Kon Tum', zone: 'trong_nuoc',
    districts: ds(
      'TP. Kon Tum',
      'Huyện Đắk Glei', 'Huyện Đắk Hà', 'Huyện Đắk Tô',
      'Huyện Ia HDrai', 'Huyện Kon Plông', 'Huyện Kon Rẫy',
      'Huyện Ngọc Hồi', 'Huyện Sa Thầy', 'Huyện Tu Mơ Rông',
    ),
  },

  // ==================== MIỀN BẮC - ĐỒNG BẰNG + DUYÊN HẢI ====================
  {
    code: 'TNG', name: 'Thái Nguyên', zone: 'trong_nuoc',
    districts: ds(
      'TP. Thái Nguyên', 'TP. Sông Công', 'Thị xã Phổ Yên',
      'Huyện Đại Từ', 'Huyện Định Hóa', 'Huyện Đồng Hỷ',
      'Huyện Phú Bình', 'Huyện Phú Lương', 'Huyện Võ Nhai',
    ),
  },
  {
    code: 'PT', name: 'Phú Thọ', zone: 'trong_nuoc',
    districts: ds(
      'TP. Việt Trì', 'Thị xã Phú Thọ',
      'Huyện Cẩm Khê', 'Huyện Đoan Hùng', 'Huyện Hạ Hòa',
      'Huyện Lâm Thao', 'Huyện Phù Ninh', 'Huyện Tam Nông',
      'Huyện Tân Sơn', 'Huyện Thanh Ba', 'Huyện Thanh Sơn',
      'Huyện Thanh Thủy', 'Huyện Yên Lập',
    ),
  },
  {
    code: 'BG', name: 'Bắc Giang', zone: 'trong_nuoc',
    districts: ds(
      'TP. Bắc Giang',
      'Huyện Hiệp Hòa', 'Huyện Lạng Giang', 'Huyện Lục Nam',
      'Huyện Lục Ngạn', 'Huyện Sơn Động', 'Huyện Tân Yên',
      'Huyện Việt Yên', 'Huyện Yên Dũng', 'Huyện Yên Thế',
    ),
  },
  {
    code: 'ND', name: 'Nam Định', zone: 'trong_nuoc',
    districts: ds(
      'TP. Nam Định',
      'Huyện Giao Thủy', 'Huyện Hải Hậu', 'Huyện Mỹ Lộc',
      'Huyện Nam Trực', 'Huyện Nghĩa Hưng', 'Huyện Trực Ninh',
      'Huyện Vụ Bản', 'Huyện Xuân Trường', 'Huyện Ý Yên',
    ),
  },
  {
    code: 'NB', name: 'Ninh Bình', zone: 'trong_nuoc',
    districts: ds(
      'TP. Ninh Bình', 'TP. Tam Điệp',
      'Huyện Gia Viễn', 'Huyện Hoa Lư', 'Huyện Kim Sơn',
      'Huyện Nho Quan', 'Huyện Yên Khánh', 'Huyện Yên Mô',
    ),
  },
  {
    code: 'TB', name: 'Thái Bình', zone: 'trong_nuoc',
    districts: ds(
      'TP. Thái Bình',
      'Huyện Đông Hưng', 'Huyện Hưng Hà', 'Huyện Kiến Xương',
      'Huyện Quỳnh Phụ', 'Huyện Thái Thụy', 'Huyện Tiền Hải',
      'Huyện Vũ Thư',
    ),
  },
  {
    code: 'QNI', name: 'Quảng Ninh', zone: 'trong_nuoc',
    districts: ds(
      'TP. Hạ Long', 'TP. Móng Cái', 'TP. Cẩm Phả', 'TP. Uông Bí',
      'Thị xã Đông Triều', 'Thị xã Quảng Yên',
      'Huyện Ba Chẽ', 'Huyện Bình Liêu', 'Huyện Cô Tô',
      'Huyện Đầm Hà', 'Huyện Hải Hà', 'Huyện Hoành Bồ',
      'Huyện Tiên Yên', 'Huyện Vân Đồn',
    ),
  },
  {
    code: 'LS', name: 'Lạng Sơn', zone: 'trong_nuoc',
    districts: ds(
      'TP. Lạng Sơn',
      'Huyện Bắc Sơn', 'Huyện Bình Gia', 'Huyện Cao Lộc',
      'Huyện Chi Lăng', 'Huyện Đình Lập', 'Huyện Hữu Lũng',
      'Huyện Lộc Bình', 'Huyện Tràng Định', 'Huyện Văn Lãng', 'Huyện Văn Quan',
    ),
  },
  {
    code: 'HB', name: 'Hòa Bình', zone: 'trong_nuoc',
    districts: ds(
      'TP. Hòa Bình',
      'Huyện Cao Phong', 'Huyện Đà Bắc', 'Huyện Kim Bôi',
      'Huyện Lạc Sơn', 'Huyện Lạc Thủy', 'Huyện Lương Sơn',
      'Huyện Mai Châu', 'Huyện Tân Lạc', 'Huyện Yên Thủy',
    ),
  },

  // ==================== VÙNG XA - ĐÔNG BẮC ====================
  {
    code: 'HGG', name: 'Hà Giang', zone: 'vung_xa',
    districts: ds(
      'TP. Hà Giang',
      'Huyện Bắc Mê', 'Huyện Bắc Quang', 'Huyện Đồng Văn',
      'Huyện Hoàng Su Phì', 'Huyện Mèo Vạc', 'Huyện Quản Bạ',
      'Huyện Quang Bình', 'Huyện Vị Xuyên', 'Huyện Xín Mần', 'Huyện Yên Minh',
    ),
  },
  {
    code: 'CB', name: 'Cao Bằng', zone: 'vung_xa',
    districts: ds(
      'TP. Cao Bằng',
      'Huyện Bảo Lạc', 'Huyện Bảo Lâm', 'Huyện Hạ Lang',
      'Huyện Hà Quảng', 'Huyện Hòa An', 'Huyện Nguyên Bình',
      'Huyện Phục Hòa', 'Huyện Quảng Hòa', 'Huyện Thạch An',
      'Huyện Trùng Khánh',
    ),
  },
  {
    code: 'BK', name: 'Bắc Kạn', zone: 'vung_xa',
    districts: ds(
      'TP. Bắc Kạn',
      'Huyện Ba Bể', 'Huyện Bạch Thông', 'Huyện Chợ Đồn',
      'Huyện Chợ Mới', 'Huyện Na Rì', 'Huyện Ngân Sơn', 'Huyện Pác Nặm',
    ),
  },
  {
    code: 'TQ', name: 'Tuyên Quang', zone: 'vung_xa',
    districts: ds(
      'TP. Tuyên Quang',
      'Huyện Chiêm Hóa', 'Huyện Hàm Yên', 'Huyện Lâm Bình',
      'Huyện Na Hang', 'Huyện Sơn Dương', 'Huyện Yên Sơn',
    ),
  },
  {
    code: 'YB', name: 'Yên Bái', zone: 'vung_xa',
    districts: ds(
      'TP. Yên Bái', 'Thị xã Nghĩa Lộ',
      'Huyện Lục Yên', 'Huyện Mù Cang Chải', 'Huyện Trạm Tấu',
      'Huyện Trấn Yên', 'Huyện Văn Chấn', 'Huyện Văn Yên', 'Huyện Yên Bình',
    ),
  },
  {
    code: 'LC', name: 'Lào Cai', zone: 'vung_xa',
    districts: ds(
      'TP. Lào Cai', 'Thị xã Sa Pa',
      'Huyện Bắc Hà', 'Huyện Bảo Thắng', 'Huyện Bảo Yên',
      'Huyện Bát Xát', 'Huyện Mường Khương', 'Huyện Si Ma Cai', 'Huyện Văn Bàn',
    ),
  },

  // ==================== VÙNG XA - TÂY BẮC ====================
  {
    code: 'DB', name: 'Điện Biên', zone: 'vung_xa',
    districts: ds(
      'TP. Điện Biên Phủ', 'Thị xã Mường Lay',
      'Huyện Điện Biên', 'Huyện Điện Biên Đông', 'Huyện Mường Ảng',
      'Huyện Mường Chà', 'Huyện Mường Nhé', 'Huyện Nậm Pồ',
      'Huyện Tủa Chùa', 'Huyện Tuần Giáo',
    ),
  },
  {
    code: 'LCH', name: 'Lai Châu', zone: 'vung_xa',
    districts: ds(
      'TP. Lai Châu',
      'Huyện Mường Tè', 'Huyện Nậm Nhùn', 'Huyện Phong Thổ',
      'Huyện Sìn Hồ', 'Huyện Tam Đường', 'Huyện Tân Uyên', 'Huyện Than Uyên',
    ),
  },
  {
    code: 'SL', name: 'Sơn La', zone: 'vung_xa',
    districts: ds(
      'TP. Sơn La',
      'Huyện Bắc Yên', 'Huyện Mai Sơn', 'Huyện Mộc Châu',
      'Huyện Mường La', 'Huyện Phù Yên', 'Huyện Quỳnh Nhai',
      'Huyện Sông Mã', 'Huyện Sốp Cộp', 'Huyện Thuận Châu',
      'Huyện Vân Hồ', 'Huyện Yên Châu',
    ),
  },
]
