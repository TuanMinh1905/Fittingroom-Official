"use client";

import React, { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import FittingRoom3DViewer, { type MeshData } from "@/component/fittingroom/FittingRoom3DViewer";
import AIChatbox from "@/component/fittingroom/chatbox/AIChatbox";

const TRYON_PROXY = "/api/tryon";
const SIZE_NEXT: Record<string, string> = { XS: "S", S: "M", M: "L", L: "XL", XL: "XXL" };
const GARMENT_TYPE_MAP: Record<string, string[]> = {
  ao: ["t-shirt", "shirt"],
  quan: ["pant", "short-pant"],
};

// Số đo cơ thể thực tế với giá trị mặc định theo giới tính
const BODY_DEFAULTS = {
  male: { shoulder: 46, arm: 60, bust: 96, waist: 82, hip: 96, leg: 80 },
  female: { shoulder: 38, arm: 55, bust: 88, waist: 70, hip: 98, leg: 74 },
};
const BODY_MEASUREMENTS = [
  { key: "shoulder" as const, label: "Bề ngang vai", unit: "cm", min: 28, max: 58 },
  { key: "arm" as const, label: "Chiều dài tay", unit: "cm", min: 40, max: 75 },
  { key: "bust" as const, label: "Vòng ngực", unit: "cm", min: 70, max: 130 },
  { key: "waist" as const, label: "Vòng eo", unit: "cm", min: 55, max: 120 },
  { key: "hip" as const, label: "Vòng hông", unit: "cm", min: 75, max: 130 },
  { key: "leg" as const, label: "Chiều dài chân", unit: "cm", min: 55, max: 100 },
];
type BodyKey = typeof BODY_MEASUREMENTS[number]["key"];

export default function FittingRoomPage() {
  const { items, removeFromCart } = useCartStore();
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(65);
  const [gender, setGender] = useState<"male" | "female">("male");
  const [poseIdx, setPoseIdx] = useState(0);
  const [bodyMeasures, setBodyMeasures] = useState({ ...BODY_DEFAULTS.male });

  const handleGenderChange = (g: "male" | "female") => {
    setGender(g);
    setBodyMeasures({ ...BODY_DEFAULTS[g] });
    setHeight(g === "male" ? 175 : 162);
    setWeight(g === "male" ? 75 : 60);
  };

  const handleBodyChange = (key: BodyKey, value: number) => {
    setBodyMeasures(prev => ({ ...prev, [key]: value }));
  };
  const [selectedOptions, setSelectedOptions] = useState<Record<string, { size: string; color: string; garmentType: string }>>({});
  const [selectedTopId, setSelectedTopId] = useState<string | null>(null);
  const [selectedBottomId, setSelectedBottomId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resultImg, setResultImg] = useState<string | null>(null);
  const [meshData, setMeshData] = useState<MeshData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [pendingAnalysis, setPendingAnalysis] = useState(false);
  const [hasTryOnResult, setHasTryOnResult] = useState(false);

  const topItems = items.filter(i => i.categorySlug === "ao").slice(0, 3);
  const bottomItems = items.filter(i => i.categorySlug === "quan").slice(0, 3);

  useEffect(() => {
    const init: Record<string, { size: string; color: string; garmentType: string }> = {};
    items.forEach(item => {
      if (!selectedOptions[item._id]) {
        init[item._id] = {
          size: item.sizes?.[0] || "M",
          color: item.colorCodes?.[0] || "#0000FF",
          garmentType: item.categorySlug === "ao" ? "t-shirt" : "pant",
        };
      }
    });
    if (Object.keys(init).length > 0) setSelectedOptions(prev => ({ ...prev, ...init }));
  }, [items]);

  const formatPrice = (price: number) => new Intl.NumberFormat("vi-VN").format(price) + " đ";

  const handleOption = (id: string, key: "size" | "color" | "garmentType", val: string) => {
    setSelectedOptions(prev => ({ ...prev, [id]: { ...prev[id], [key]: val } }));
  };

  const handleTryOn = async () => {
    if (!height || !weight) { setError("Vui lòng nhập chiều cao và cân nặng!"); return; }
    if (!selectedTopId && !selectedBottomId) { setError("Vui lòng chọn ít nhất 1 áo hoặc 1 quần!"); return; }

    setIsLoading(true);
    setError(null);
    setResultImg(null);
    setMeshData(null);

    // Số đo cơ thể bổ sung gửi kèm
    const bodyExtra = {
      shoulder_cm: bodyMeasures.shoulder,
      arm_length_cm: bodyMeasures.arm,
      bust_cm: bodyMeasures.bust,
      waist_cm: bodyMeasures.waist,
      hip_cm: bodyMeasures.hip,
      leg_length_cm: bodyMeasures.leg,
    };

    try {
      const topOpt = selectedTopId ? selectedOptions[selectedTopId] : null;
      const botOpt = selectedBottomId ? selectedOptions[selectedBottomId] : null;

      // Helper: tra sizeChart của product → lấy số đo cho size đã chọn
      const getGarmentMeasurements = (itemId: string, size: string) => {
        const item = items.find(i => i._id === itemId);
        const entry = item?.sizeChart?.find((sc: any) => sc.size === size);
        if (!entry) return {};
        return {
          garment_length_cm: entry.length_cm,
          garment_chest_cm: entry.chest_half_cm,
          garment_shoulder_cm: entry.shoulder_cm,
          garment_waist_cm: entry.waist_cm,
          garment_hip_cm: entry.hip_cm,
        };
      };

      let data: any;

      if (selectedTopId && selectedBottomId && topOpt && botOpt) {
        // Outfit mode: áo + quần
        const topMeasures = getGarmentMeasurements(selectedTopId, topOpt.size);
        const botMeasures = getGarmentMeasurements(selectedBottomId, botOpt.size);
        const payload = {
          height_cm: height,
          weight_kg: weight,
          gender,
          pose_idx: poseIdx,
          extreme_demo: false,
          ...bodyExtra,
          garments: [
            { garment_type: topOpt.garmentType, size_small: topOpt.size, size_large: SIZE_NEXT[topOpt.size] || "XL", color_hex: topOpt.color, ...topMeasures },
            { garment_type: botOpt.garmentType, size_small: botOpt.size, size_large: SIZE_NEXT[botOpt.size] || "XL", color_hex: botOpt.color, ...botMeasures },
          ],
        };
        const res = await fetch(`${TRYON_PROXY}?endpoint=try-on-outfit`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) { const e = await res.json(); throw new Error(e.error || "Lỗi TailorNet"); }
        data = await res.json();
      } else {
        // Single mode: chỉ áo hoặc chỉ quần
        const opt = topOpt || botOpt!;
        const itemId = selectedTopId || selectedBottomId!;
        const garmentMeasures = getGarmentMeasurements(itemId, opt.size);
        const payload = {
          height_cm: height,
          weight_kg: weight,
          gender,
          garment_type: opt.garmentType,
          size_small: opt.size,
          size_large: SIZE_NEXT[opt.size] || "XL",
          pose_idx: poseIdx,
          extreme_demo: false,
          garment_color_hex: opt.color,
          ...bodyExtra,
          ...garmentMeasures,
        };
        const res = await fetch(`${TRYON_PROXY}?endpoint=try-on`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) { const e = await res.json(); throw new Error(e.error || "Lỗi TailorNet"); }
        data = await res.json();
      }

      // Ưu tiên hiển thị 3D mesh nếu có, fallback sang ảnh 2D
      if (data.mesh_data && data.mesh_data.body_vertices && data.mesh_data.body_vertices.length > 0) {
        setMeshData(data.mesh_data);
      }
      // Luôn lưu ảnh fallback
      setResultImg(`data:image/png;base64,${data.image_small}`);
      // Đánh dấu có kết quả mới — chờ người dùng chủ động mở AI chatbox
      setHasTryOnResult(true);
      setPendingAnalysis(true);
      // Tự động mở chatbox nếu người dùng đã từng mở trước đó
      // (không tự mở lần đầu để tránh làm phiền)
    } catch (e: any) {
      setError(e.message || "Có lỗi xảy ra khi kết nối TailorNet.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderItem = (item: any, isTop: boolean) => {
    const isSelected = isTop ? selectedTopId === item._id : selectedBottomId === item._id;
    const opt = selectedOptions[item._id] || { size: item.sizes?.[0] || "M", color: item.colorCodes?.[0] || "#0000FF", garmentType: isTop ? "t-shirt" : "pant" };
    const garmentOptions = isTop ? GARMENT_TYPE_MAP.ao : GARMENT_TYPE_MAP.quan;

    return (
      <div key={item._id}
        className={`flex gap-3 border ${isSelected ? "border-[var(--primary)] bg-[var(--primary)]/5" : "border-gray-100"} p-3 rounded-xl transition-colors cursor-pointer relative`}
        onClick={() => isTop ? setSelectedTopId(item._id) : setSelectedBottomId(item._id)}
      >
        <div className="absolute top-3 left-3 z-10">
          <input type="radio" name={isTop ? "topSelect" : "bottomSelect"} checked={isSelected}
            onChange={() => isTop ? setSelectedTopId(item._id) : setSelectedBottomId(item._id)}
            onClick={e => e.stopPropagation()}
            className="w-4 h-4 accent-[var(--primary)] cursor-pointer"
          />
        </div>
        <div className="w-20 h-28 bg-gray-50 rounded-lg overflow-hidden shrink-0 mt-6">
          {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No img</div>}
        </div>
        <div className="flex flex-col flex-1 py-1">
          <div className="flex justify-between items-start">
            <div className="pr-1 pt-1">
              <h3 className="text-sm font-medium line-clamp-2 text-gray-800">{item.name}</h3>
              <p className="text-xs text-[var(--primary)] font-bold mt-1">{formatPrice(item.discountPrice || item.price)}</p>
            </div>
            <button onClick={e => { e.stopPropagation(); removeFromCart(item._id); }} className="text-xs text-red-500 hover:underline p-1 shrink-0">Xóa</button>
          </div>
          <div className="mt-2 flex flex-col gap-2" onClick={e => e.stopPropagation()}>
            {/* Garment type */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-12 shrink-0">Loại:</span>
              <select value={opt.garmentType} onChange={e => handleOption(item._id, "garmentType", e.target.value)}
                className="text-xs border border-gray-200 rounded px-1.5 py-1 outline-none focus:border-[var(--primary)] bg-white cursor-pointer flex-1">
                {garmentOptions.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            {/* Size */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-12 shrink-0">Size:</span>
              <select value={opt.size} onChange={e => handleOption(item._id, "size", e.target.value)}
                className="text-xs border border-gray-200 rounded px-1.5 py-1 outline-none focus:border-[var(--primary)] bg-white cursor-pointer">
                {(item.sizes?.length ? item.sizes : ["S", "M", "L", "XL"]).map((s: string) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            {/* Colors */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-12 shrink-0">Màu:</span>
              <div className="flex gap-1.5 flex-wrap">
                {(item.colorCodes?.length ? item.colorCodes : ["#0000FF", "#FF0000", "#FFFFFF", "#000000"]).slice(0, 4).map((color: string) => (
                  <button key={color} onClick={() => handleOption(item._id, "color", color)}
                    className={`w-5 h-5 rounded-full border-2 transition-all ${opt.color === color ? "border-[var(--primary)] scale-110 shadow-sm" : "border-gray-300"}`}
                    style={{ backgroundColor: color }} title={color}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <style>{`
        @keyframes customPulseOpacity {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        .custom-pulse-opacity {
          animation: customPulseOpacity 1.5s ease-in-out infinite;
        }
      `}</style>
      <h1 className="text-3xl font-bold text-center mb-8 font-monasans text-[var(--text-primary)]">
        Phòng Thử Đồ Ảo (Virtual Fitting Room)
      </h1>
      <div className="flex flex-col lg:flex-row gap-6 min-h-[700px]">

        {/* Section 1: Danh sách đồ */}
        <div className="w-full lg:w-1/4 bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-[700px] overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold text-[var(--primary)] flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z" /></svg>
              Đồ đang chọn ({items.length})
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {items.length === 0 ? (
              <div className="text-center text-gray-500 mt-10">
                <p>Chưa có sản phẩm nào</p>
                <Link href="/" className="text-[var(--primary)] hover:underline mt-2 inline-block">Quay lại mua sắm</Link>
              </div>
            ) : (
              <>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-3 border-b pb-2 flex items-center justify-between">
                    <span>👕 Áo</span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{topItems.length}/3</span>
                  </h3>
                  <div className="space-y-3">
                    {topItems.length > 0 ? topItems.map(i => renderItem(i, true)) : <p className="text-sm text-gray-400 italic text-center py-2">Trống</p>}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-3 border-b pb-2 flex items-center justify-between">
                    <span>👖 Quần</span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{bottomItems.length}/3</span>
                  </h3>
                  <div className="space-y-3">
                    {bottomItems.length > 0 ? bottomItems.map(i => renderItem(i, false)) : <p className="text-sm text-gray-400 italic text-center py-2">Trống</p>}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Section 2: Khu vực render */}
        <div className="w-full lg:w-2/4 flex flex-col gap-4">
          <div className="bg-gray-900 rounded-2xl shadow-sm border border-gray-700 flex flex-col items-center justify-center relative overflow-hidden h-[700px]">
            <FittingRoom3DViewer
              meshData={meshData}
              fallbackImage={resultImg}
              isLoading={isLoading}
              error={error}
              onClearError={() => setError(null)}
            />
          </div>

          {/* Nút mở AI ở vị trí dưới cùng giữa màn hình */}
          {hasTryOnResult && !isLoading && (
            <div className="flex justify-center w-full">
              <button
                onClick={() => setIsChatOpen(true)}
                className="relative w-full max-w-md group flex items-center justify-center transition-transform hover:scale-[1.02] custom-pulse-opacity"
              >
                {/* Lớp viền sáng (glow) phía sau */}
                <div 
                  className="absolute -inset-1.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 blur-md" 
                ></div>
                
                <div className="relative w-full flex items-center justify-center gap-2.5 px-5 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl font-bold text-white shadow-xl border border-white/20">
                  <span className="text-xl animate-bounce" style={{ animationDuration: '2s' }}>🤖</span>
                  <span className="text-[14px] uppercase tracking-wide">Xem ý kiến và trò chuyện với AI</span>
                  {pendingAnalysis && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center shadow-lg">
                      <span className="absolute w-full h-full bg-red-500 rounded-full animate-ping opacity-75" />
                      <span className="relative text-[10px] font-bold text-white">1</span>
                    </span>
                  )}
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Section 3: Thông số */}
        <div className="w-full lg:w-1/4 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col h-[700px]">
          <h2 className="text-xl font-bold mb-4 border-b pb-2 text-gray-800">Thông số người mẫu</h2>
          <div className="flex-1 overflow-y-auto space-y-4 pr-1" style={{ scrollbarWidth: 'thin' }}>
            {/* Giới tính */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Giới tính</label>
              <div className="grid grid-cols-2 gap-3">
                {(["male", "female"] as const).map(g => (
                  <button key={g} onClick={() => handleGenderChange(g)}
                    className={`py-2.5 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all text-sm font-medium
                      ${gender === g
                        ? g === "male" ? "border-[var(--primary)] bg-[var(--primary)]/5 text-[var(--primary)]" : "border-pink-500 bg-pink-50 text-pink-600"
                        : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}>
                    {g === "male" ? "♂" : "♀"} {g === "male" ? "Nam" : "Nữ"}
                  </button>
                ))}
              </div>
            </div>

            {/* Chiều cao — slider + input */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1">CHIỀU CAO</label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 w-7 shrink-0">140</span>
                <input type="range" min={140} max={220} step={1} value={height}
                  onChange={e => setHeight(Number(e.target.value))}
                  className="flex-1 h-1.5 cursor-pointer appearance-none rounded-full bg-gray-200 accent-[var(--primary)]" />
                <span className="text-xs text-gray-400 w-7 shrink-0 text-right">220</span>
                <div className="flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden shrink-0">
                  <input type="number" value={height} min={140} max={220}
                    onChange={e => setHeight(Number(e.target.value) || 140)}
                    className="w-12 text-center text-sm font-semibold text-gray-900 outline-none py-1.5 bg-transparent" />
                  <span className="text-xs text-gray-500 pr-2">cm</span>
                </div>
              </div>
            </div>

            {/* Cân nặng — slider + input */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1">CÂN NẶNG</label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 w-7 shrink-0">30</span>
                <input type="range" min={30} max={150} step={1} value={weight}
                  onChange={e => setWeight(Number(e.target.value))}
                  className="flex-1 h-1.5 cursor-pointer appearance-none rounded-full bg-gray-200 accent-[var(--primary)]" />
                <span className="text-xs text-gray-400 w-7 shrink-0 text-right">150</span>
                <div className="flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden shrink-0">
                  <input type="number" value={weight} min={30} max={150}
                    onChange={e => setWeight(Number(e.target.value) || 30)}
                    className="w-12 text-center text-sm font-semibold text-gray-900 outline-none py-1.5 bg-transparent" />
                  <span className="text-xs text-gray-500 pr-2">kg</span>
                </div>
              </div>
            </div>

            {/* Divider: Số đo chi tiết */}
            <div className="border-t border-gray-200 pt-3">
              <p className="text-xs text-gray-400">Số đo chi tiết cơ thể</p>
            </div>

            {/* 6 Body measurement sliders */}
            {BODY_MEASUREMENTS.map(({ key, label, unit, min, max }) => (
              <div key={key}>
                <label className="block text-sm font-bold text-gray-800 mb-1">{label.toUpperCase()}</label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 w-7 shrink-0">{min}</span>
                  <input type="range" min={min} max={max} step={1} value={bodyMeasures[key]}
                    onChange={e => handleBodyChange(key, Number(e.target.value))}
                    className="flex-1 h-1.5 cursor-pointer appearance-none rounded-full bg-gray-200 accent-[var(--primary)]" />
                  <span className="text-xs text-gray-400 w-7 shrink-0 text-right">{max}</span>
                  <div className="flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden shrink-0">
                    <input type="number" value={bodyMeasures[key]} min={min} max={max}
                      onChange={e => handleBodyChange(key, Number(e.target.value) || min)}
                      className="w-12 text-center text-sm font-semibold text-gray-900 outline-none py-1.5 bg-transparent" />
                    <span className="text-xs text-gray-500 pr-2">{unit}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Tư thế */}
            <div className="border-t border-gray-200 pt-3">
              <label className="block text-sm font-bold text-gray-800 mb-1.5">TƯ THẾ</label>
              <select value={poseIdx} onChange={e => setPoseIdx(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none transition-all text-gray-800 text-sm">
                <option value={0}>Đứng thẳng (A-pose)</option>
                <option value={1}>Tư thế 1</option>
                <option value={2}>Tư thế 2</option>
                <option value={3}>Tư thế 3</option>
              </select>
            </div>

            {/* Nút reset */}
            <button onClick={() => { setBodyMeasures({ ...BODY_DEFAULTS[gender] }); setHeight(gender === "male" ? 175 : 162); setWeight(gender === "male" ? 75 : 60); }}
              className="w-full py-2 text-xs text-gray-500 hover:text-[var(--primary)] hover:bg-gray-50 rounded-lg transition-colors border border-dashed border-gray-300">
              ↺ Reset về mặc định
            </button>
          </div>

          <button onClick={handleTryOn} disabled={isLoading}
            className="w-full py-3.5 mt-3 bg-[var(--primary)] text-white text-base font-bold rounded-xl shadow-lg hover:shadow-[var(--primary)]/30 hover:-translate-y-1 transition-all active:translate-y-0 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 shrink-0">
            {isLoading ? (
              <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Đang xử lý...</span></>
            ) : (
              <><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z" /></svg><span>ẤN THỬ ĐỒ NGAY</span></>
            )}
          </button>
        </div>
      </div>

      {/* Floating AI Chatbox — chỉ mở khi người dùng chủ động click */}
      <AIChatbox
        body={{ ...bodyMeasures, height, weight }}
        gender={gender}
        topGarment={selectedTopId && selectedOptions[selectedTopId] ? {
          garmentType: selectedOptions[selectedTopId].garmentType,
          size: selectedOptions[selectedTopId].size,
          color: selectedOptions[selectedTopId].color,
          name: items.find(i => i._id === selectedTopId)?.name,
        } : null}
        bottomGarment={selectedBottomId && selectedOptions[selectedBottomId] ? {
          garmentType: selectedOptions[selectedBottomId].garmentType,
          size: selectedOptions[selectedBottomId].size,
          color: selectedOptions[selectedBottomId].color,
          name: items.find(i => i._id === selectedBottomId)?.name,
        } : null}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        pendingAnalysis={pendingAnalysis}
        onAnalysisTriggered={() => setPendingAnalysis(false)}
      />
    </div>
  );
}
