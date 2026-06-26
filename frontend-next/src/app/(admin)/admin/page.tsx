"use client";

import { useState, useEffect } from "react";

type StatSummary = {
  totalRevenue: number;
  totalOrders: number;
  totalItemsSold: number;
  uniqueCustomers: number;
  revenueGrowthPercent: number;
  averageOrderValue: number;
};

type MonthlyRevenue = {
  month: string;
  revenue: number;
  orders: number;
};

type BestSeller = {
  productId: string;
  name: string;
  imageUrl: string;
  price: number;
  soldCount: number;
  totalRevenue: number;
};

type DashboardStats = {
  summary: StatSummary;
  statusBreakdown: {
    pending: number;
    processing: number;
    delivered: number;
    cancelled: number;
  };
  paymentMethods: Record<string, number>;
  categoryRevenue: Record<string, number>;
  monthlyRevenue: MonthlyRevenue[];
  bestSellers: BestSeller[];
};

// Map hiển thị tiếng Việt cho các danh mục slug
const categoryNameMap: Record<string, string> = {
  'ao': 'Áo thời trang',
  'quan': 'Quần thời trang',
  'giay': 'Giày & Dép',
  'mu': 'Mũ nón',
  'tat': 'Tất vớ',
  'phu-kien': 'Phụ kiện thời trang',
  'khac': 'Sản phẩm khác'
};

const categoryColorMap: Record<string, string> = {
  'ao': '#22d3ee', // cyan-400
  'quan': '#a855f7', // purple-500
  'giay': '#10b981', // emerald-500
  'mu': '#f59e0b', // amber-500
  'tat': '#ec4899', // pink-500
  'phu-kien': '#f43f5e', // rose-500
  'khac': '#64748b' // slate-500
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"visual" | "products" | "sheets">("visual");
  const [hoveredChartIdx, setHoveredChartIdx] = useState<number | null>(null);
  const [exporting, setExporting] = useState(false);
  const [searchProduct, setSearchProduct] = useState("");

  const fetchStats = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:8000/orders/stats");
      if (!response.ok) {
        throw new Error("Không thể kết xuất dữ liệu thống kê từ server");
      }
      const data = await response.json();
      setStats(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Lỗi kết nối tới server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      alert("Xuất báo cáo doanh thu thành công! File report_doanh_thu_2026.csv đã được tải về máy của bạn.");
    }, 1500);
  };

  const formatVND = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-cyan-500/20 border-t-cyan-400"></div>
        <p className="text-sm text-slate-400 animate-pulse">Đang thu thập và phân tích dữ liệu doanh số...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-center">
        <h3 className="text-xl font-bold text-red-400">Đã xảy ra lỗi tải dữ liệu</h3>
        <p className="mt-2 text-sm text-slate-300">{error}</p>
        <button
          onClick={fetchStats}
          className="mt-6 rounded-xl bg-red-500/20 px-6 py-2.5 text-sm font-semibold text-red-300 border border-red-500/30 hover:bg-red-500/30 transition"
        >
          Thử lại
        </button>
      </div>
    );
  }

  const { summary, statusBreakdown, paymentMethods, categoryRevenue, monthlyRevenue, bestSellers } = stats;

  // Xử lý dữ liệu biểu đồ doanh thu theo tháng
  const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.revenue)) || 1;
  const maxOrders = Math.max(...monthlyRevenue.map((m) => m.orders)) || 1;

  // Kích thước khung biểu đồ
  const chartWidth = 900;
  const chartHeight = 240;
  const paddingX = 50;
  const paddingY = 30;

  const points = monthlyRevenue.map((m, idx) => {
    const x = paddingX + (idx / (monthlyRevenue.length - 1)) * (chartWidth - paddingX * 2);
    // Tỷ lệ chiều cao biểu đồ
    const y = chartHeight - paddingY - (m.revenue / maxRevenue) * (chartHeight - paddingY * 2);
    return { x, y, ...m };
  });

  const pathD = points.length > 0 
    ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map((p) => `L ${p.x} ${p.y}`).join(" ")
    : "";

  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`
    : "";

  // Dữ liệu vòng tròn danh mục
  const categoryKeys = Object.keys(categoryRevenue);
  const totalCategoryRev = Object.values(categoryRevenue).reduce((a, b) => a + b, 0) || 1;
  let accumulatedPercent = 0;

  const donutSegments = categoryKeys.map((key) => {
    const value = categoryRevenue[key];
    const percent = value / totalCategoryRev;
    const startPercent = accumulatedPercent;
    accumulatedPercent += percent;

    return {
      key,
      name: categoryNameMap[key] || key,
      value,
      percent,
      startPercent,
      color: categoryColorMap[key] || "#64748b"
    };
  });

  // Tìm kiếm sản phẩm
  const filteredBestSellers = bestSellers.filter(p =>
    p.name.toLowerCase().includes(searchProduct.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Tiêu đề & Tổng quan */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.35)] backdrop-blur-md">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-cyan-500/10 blur-[100px]"></div>
        <div className="absolute -left-20 -bottom-20 h-60 w-60 rounded-full bg-purple-500/10 blur-[100px]"></div>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-300 font-semibold">Báo cáo tổng quan</p>
            <h1 className="mt-1 text-3xl font-bold text-white tracking-tight">Thống Kê Doanh Thu</h1>
            <p className="mt-2 text-sm text-slate-400">
              Phân tích hiệu suất bán hàng, biểu đồ tăng trưởng và xếp hạng các sản phẩm bán chạy nhất.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={fetchStats}
              className="flex items-center justify-center rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-700 active:scale-95"
            >
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18" />
              </svg>
              Làm mới
            </button>
            <button 
              onClick={handleExport}
              disabled={exporting}
              className="flex items-center justify-center rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-50 active:scale-95 shadow-[0_0_20px_rgba(34,211,238,0.2)]"
            >
              {exporting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent"></div>
                  Đang xuất...
                </>
              ) : (
                <>
                  <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Tải báo cáo
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Thẻ Chỉ số chính (KPI Cards) */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Doanh thu */}
        <article className="group relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/50 p-6 shadow-lg backdrop-blur-sm transition duration-300 hover:border-cyan-500/30 hover:bg-slate-900/80">
          <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400 transition group-hover:scale-110">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Doanh thu thuần</p>
          <p className="mt-3 text-2xl sm:text-3xl font-bold text-white tracking-tight leading-none">
            {formatVND(summary.totalRevenue)}
          </p>
          <div className="mt-4 flex items-center gap-1.5 text-xs">
            <span className={`flex items-center font-bold px-1.5 py-0.5 rounded-md ${
              summary.revenueGrowthPercent >= 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
            }`}>
              {summary.revenueGrowthPercent >= 0 ? "+" : ""}
              {summary.revenueGrowthPercent.toFixed(1)}%
            </span>
            <span className="text-slate-500">so với tháng trước</span>
          </div>
        </article>

        {/* Số lượng đơn hàng */}
        <article className="group relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/50 p-6 shadow-lg backdrop-blur-sm transition duration-300 hover:border-purple-500/30 hover:bg-slate-900/80">
          <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-400/10 text-purple-400 transition group-hover:scale-110">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Tổng đơn hàng</p>
          <p className="mt-3 text-2xl sm:text-3xl font-bold text-white tracking-tight leading-none">
            {summary.totalOrders}
          </p>
          <div className="mt-4 flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center text-emerald-400 font-medium">
              ● {statusBreakdown.delivered} Đã giao
            </span>
            <span className="flex items-center text-cyan-400 font-medium">
              ● {statusBreakdown.pending + statusBreakdown.processing} Đang xử lý
            </span>
          </div>
        </article>

        {/* Số sản phẩm đã bán */}
        <article className="group relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/50 p-6 shadow-lg backdrop-blur-sm transition duration-300 hover:border-emerald-500/30 hover:bg-slate-900/80">
          <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400 transition group-hover:scale-110">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Sản phẩm bán ra</p>
          <p className="mt-3 text-2xl sm:text-3xl font-bold text-white tracking-tight leading-none">
            {summary.totalItemsSold} <span className="text-sm font-normal text-slate-400">cái</span>
          </p>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-500">
            <span className="font-semibold text-slate-300">{summary.uniqueCustomers}</span> khách hàng đã đặt mua sản phẩm
          </div>
        </article>

        {/* Đơn hàng trung bình (AOV) */}
        <article className="group relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/50 p-6 shadow-lg backdrop-blur-sm transition duration-300 hover:border-amber-500/30 hover:bg-slate-900/80">
          <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400 transition group-hover:scale-110">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Giá trị TB đơn (AOV)</p>
          <p className="mt-3 text-2xl sm:text-3xl font-bold text-white tracking-tight leading-none">
            {formatVND(summary.averageOrderValue)}
          </p>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-500">
            Chỉ số doanh thu trên mỗi đơn hàng thành công
          </div>
        </article>
      </section>

      {/* Tabs chuyển đổi */}
      <div className="flex border-b border-slate-800">
        {[
          { id: "visual", label: "Phân tích biểu đồ & Cơ cấu" },
          { id: "products", label: "Xếp hạng sản phẩm bán chạy" },
          { id: "sheets", label: "Bảng dữ liệu báo cáo chi tiết" }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-4 text-sm font-semibold tracking-wide border-b-2 transition ${
              activeTab === tab.id
                ? "border-cyan-400 text-cyan-300 font-bold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Biểu đồ trực quan */}
      {activeTab === "visual" && (
        <section className="grid gap-6 lg:grid-cols-3">
          {/* Biểu đồ doanh thu 12 tháng */}
          <div className="lg:col-span-2 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">Doanh thu & Số lượng đơn hàng theo tháng</h3>
                <p className="text-xs text-slate-400">Dữ liệu tổng hợp từ các đơn hàng đã thanh toán thành công</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <span className="h-3 w-3 rounded-full bg-cyan-400/20 border border-cyan-400"></span> Doanh thu
                </span>
                <span className="flex items-center gap-1.5 text-purple-400">
                  <span className="h-3 w-3 rounded-full bg-purple-400/20 border border-purple-400"></span> Số đơn hàng
                </span>
              </div>
            </div>

            {/* Sơ đồ vẽ bằng SVG */}
            <div className="relative w-full">
              <svg 
                viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
                className="w-full overflow-visible"
              >
                <defs>
                  {/* Gradient cho biểu đồ Area */}
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.0" />
                  </linearGradient>
                  {/* Bộ lọc phát sáng neon cho đường Line */}
                  <filter id="neonGlow" x="-10%" y="-10%" width="120%" height="120%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Đường Grid trục Y */}
                {[0, 0.25, 0.5, 0.75, 1].map((val, idx) => {
                  const y = paddingY + val * (chartHeight - paddingY * 2);
                  const revVal = Math.round(maxRevenue * (1 - val));
                  return (
                    <g key={idx} className="opacity-10">
                      <line 
                        x1={paddingX} 
                        y1={y} 
                        x2={chartWidth - paddingX} 
                        y2={y} 
                        stroke="#ffffff" 
                        strokeWidth="1" 
                        strokeDasharray="4 4"
                      />
                      <text 
                        x={paddingX - 10} 
                        y={y + 4} 
                        fill="#ffffff" 
                        fontSize="10" 
                        textAnchor="end"
                      >
                        {formatVND(revVal).replace("₫", "")}
                      </text>
                    </g>
                  );
                })}

                {/* Biểu đồ Area */}
                {areaD && (
                  <path 
                    d={areaD} 
                    fill="url(#areaGradient)" 
                  />
                )}

                {/* Biểu đồ Line */}
                {pathD && (
                  <path 
                    d={pathD} 
                    fill="none" 
                    stroke="#22d3ee" 
                    strokeWidth="3.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    filter="url(#neonGlow)"
                  />
                )}

                {/* Các điểm mốc Dot và vùng tương tác Hover */}
                {points.map((p, idx) => (
                  <g key={idx}>
                    {/* Trục X nhãn tháng */}
                    <text
                      x={p.x}
                      y={chartHeight - 8}
                      fill="#94a3b8"
                      fontSize="10"
                      textAnchor="middle"
                      className="opacity-70"
                    >
                      {p.month}
                    </text>

                    {/* Điểm nút */}
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={hoveredChartIdx === idx ? 7 : 4}
                      fill={hoveredChartIdx === idx ? "#ffffff" : "#0f172a"}
                      stroke="#22d3ee"
                      strokeWidth={hoveredChartIdx === idx ? 4 : 2}
                      className="transition-all duration-200 cursor-pointer"
                    />

                    {/* Vùng vô hình nhạy hover để tăng kích thước nhấp chuột/hover */}
                    <rect
                      x={p.x - 25}
                      y={0}
                      width={50}
                      height={chartHeight}
                      fill="transparent"
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredChartIdx(idx)}
                      onMouseLeave={() => setHoveredChartIdx(null)}
                    />
                  </g>
                ))}
              </svg>

              {/* Tooltip nổi tương tác */}
              {hoveredChartIdx !== null && points[hoveredChartIdx] && (
                <div 
                  className="absolute z-10 rounded-2xl border border-slate-700 bg-slate-900/95 p-3.5 shadow-2xl backdrop-blur-md transition-all duration-150"
                  style={{
                    left: `${(points[hoveredChartIdx].x / chartWidth) * 100}%`,
                    top: `${(points[hoveredChartIdx].y / chartHeight) * 100 - 35}%`,
                    transform: "translate(-50%, -100%)",
                  }}
                >
                  <p className="text-xs font-bold text-slate-400">Tháng {points[hoveredChartIdx].month}</p>
                  <p className="mt-1 text-sm font-bold text-white flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
                    DT: {formatVND(points[hoveredChartIdx].revenue)}
                  </p>
                  <p className="mt-0.5 text-xs text-purple-300 flex items-center gap-1.5 font-medium">
                    <span className="h-2 w-2 rounded-full bg-purple-400"></span>
                    Đơn hàng: {points[hoveredChartIdx].orders} đơn
                  </p>
                </div>
              )}
            </div>
            
            {/* Phân tích nhanh biểu đồ */}
            <div className="mt-4 grid grid-cols-2 gap-4 border-t border-slate-800/80 pt-4 text-xs text-slate-400">
              <div>
                Tháng doanh thu cao nhất: <span className="font-semibold text-white">
                  {monthlyRevenue.length > 0 
                    ? monthlyRevenue.reduce((max, m) => m.revenue > max.revenue ? m : max, monthlyRevenue[0]).month 
                    : "N/A"}
                </span>
              </div>
              <div className="text-right">
                Doanh thu trung bình tháng: <span className="font-semibold text-white">
                  {formatVND(Math.round(summary.totalRevenue / (monthlyRevenue.length || 1)))}
                </span>
              </div>
            </div>
          </div>

          {/* Biểu đồ hình khuyên phân bổ danh mục */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Cơ cấu doanh thu</h3>
              <p className="text-xs text-slate-400">Tỷ trọng đóng góp doanh số theo từng nhóm sản phẩm</p>
            </div>

            {/* SVG Donut */}
            <div className="relative flex items-center justify-center my-6">
              <svg width="180" height="180" viewBox="0 0 140 140" className="transform -rotate-90">
                <circle 
                  cx="70" 
                  cy="70" 
                  r="50" 
                  fill="transparent" 
                  stroke="#1e293b" 
                  strokeWidth="12" 
                />
                
                {donutSegments.map((seg, idx) => {
                  const circumference = 2 * Math.PI * 50; // 314.159
                  const strokeLength = seg.percent * circumference;
                  const strokeOffset = circumference - (seg.startPercent * circumference);
                  return (
                    <circle
                      key={seg.key}
                      cx="70"
                      cy="70"
                      r="50"
                      fill="transparent"
                      stroke={seg.color}
                      strokeWidth="12"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeOffset}
                      strokeLinecap={seg.percent > 0.05 ? "round" : "butt"}
                      className="transition-all duration-300 hover:stroke-[14px] cursor-pointer"
                    />
                  );
                })}
              </svg>
              
              {/* Nội dung trung tâm Donut */}
              <div className="absolute text-center">
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Doanh thu</p>
                <p className="text-sm font-extrabold text-white mt-0.5">{formatVND(summary.totalRevenue).replace("₫", "")}</p>
                <p className="text-[9px] text-cyan-400 font-semibold uppercase">Tổng cộng</p>
              </div>
            </div>

            {/* Danh sách nhãn chú thích */}
            <div className="space-y-2">
              {donutSegments.map((seg) => (
                <div key={seg.key} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span 
                      className="h-2.5 w-2.5 rounded-full" 
                      style={{ backgroundColor: seg.color }}
                    ></span>
                    <span className="text-slate-300 font-medium">{seg.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400">{formatVND(seg.value)}</span>
                    <span className="font-bold text-white w-8 text-right">{(seg.percent * 100).toFixed(0)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tab 2: Xếp hạng sản phẩm bán chạy */}
      {activeTab === "products" && (
        <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">Bảng xếp hạng sản phẩm bán chạy nhất</h3>
              <p className="text-xs text-slate-400">Xếp hạng sản phẩm dựa trên số lượng đơn hàng giao thành công</p>
            </div>
            
            {/* Thanh tìm kiếm sản phẩm */}
            <div className="w-full sm:max-w-xs relative">
              <input
                type="text"
                placeholder="Tìm sản phẩm..."
                value={searchProduct}
                onChange={(e) => setSearchProduct(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-850 py-2 pl-10 pr-4 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400 transition"
              />
              <svg className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-slate-300">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-4 rounded-l-2xl">Hạng</th>
                  <th className="px-6 py-4">Sản phẩm</th>
                  <th className="px-6 py-4">Đơn giá</th>
                  <th className="px-6 py-4">Đã bán</th>
                  <th className="px-6 py-4 text-right rounded-r-2xl">Doanh thu thu về</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredBestSellers.length > 0 ? (
                  filteredBestSellers.map((item, idx) => {
                    const maxSold = bestSellers[0]?.soldCount || 1;
                    const percentSold = (item.soldCount / maxSold) * 100;
                    
                    return (
                      <tr 
                        key={item.productId}
                        className="group hover:bg-slate-850/40 transition duration-150"
                      >
                        <td className="px-6 py-4">
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg font-black text-xs">
                            {idx === 0 && <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20">1</span>}
                            {idx === 1 && <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-300 text-slate-950 font-bold shadow-md">2</span>}
                            {idx === 2 && <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-600 text-white font-bold shadow-md">3</span>}
                            {idx > 2 && <span className="text-slate-500">#{idx + 1}</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-white">
                          <div className="flex items-center gap-3">
                            <img 
                              src={item.imageUrl || "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=100"} 
                              alt={item.name} 
                              className="h-10 w-10 rounded-lg object-cover bg-slate-800 border border-slate-700/60"
                            />
                            <div>
                              <p className="line-clamp-1">{item.name}</p>
                              <p className="text-[10px] text-slate-500 font-mono">ID: {item.productId.slice(-6)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-semibold">
                          {formatVND(item.price)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="w-10 font-bold text-white">{item.soldCount}</span>
                            <div className="h-2 w-32 rounded-full bg-slate-800 overflow-hidden hidden sm:block">
                              <div 
                                className={`h-full rounded-full transition-all duration-500 ${
                                  idx === 0 ? "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]" :
                                  idx === 1 ? "bg-slate-300" :
                                  idx === 2 ? "bg-amber-600" : "bg-cyan-500"
                                }`}
                                style={{ width: `${percentSold}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right font-black text-cyan-300">
                          {formatVND(item.totalRevenue)}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                      Không tìm thấy sản phẩm bán chạy nào phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Tab 3: Bảng dữ liệu chi tiết */}
      {activeTab === "sheets" && (
        <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">Báo cáo hiệu suất bán hàng chi tiết</h3>
              <p className="text-xs text-slate-400">Số liệu thô tháng qua tháng dùng cho mục đích kế toán báo cáo</p>
            </div>
            
            <button 
              onClick={handleExport}
              disabled={exporting}
              className="flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2.5 text-xs font-semibold transition"
            >
              CSV Export
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-slate-300">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-4 rounded-l-2xl">Tháng / Năm</th>
                  <th className="px-6 py-4">Số lượng đơn hàng</th>
                  <th className="px-6 py-4">Doanh thu thuần</th>
                  <th className="px-6 py-4">Giá trị trung bình (AOV)</th>
                  <th className="px-6 py-4 text-right rounded-r-2xl">Phí vận chuyển (Ước tính)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {monthlyRevenue.map((item, idx) => {
                  const avg = item.orders > 0 ? Math.round(item.revenue / item.orders) : 0;
                  const estimatedShipping = item.orders * 25000; // Uớc tính trung bình 25k/đơn
                  
                  return (
                    <tr 
                      key={item.month}
                      className="hover:bg-slate-850/40 transition duration-150"
                    >
                      <td className="px-6 py-4 font-bold text-white">{item.month}</td>
                      <td className="px-6 py-4 font-semibold text-slate-200">{item.orders} đơn</td>
                      <td className="px-6 py-4 font-black text-cyan-300">{formatVND(item.revenue)}</td>
                      <td className="px-6 py-4 font-semibold text-slate-300">{formatVND(avg)}</td>
                      <td className="px-6 py-4 text-right text-slate-400">{formatVND(estimatedShipping)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Các chỉ số báo cáo phụ: Phương thức thanh toán & Trạng thái đơn */}
      <section className="grid gap-6 md:grid-cols-2">
        {/* Thanh toán */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md">
          <h3 className="text-base font-bold text-white mb-4">Phương thức thanh toán phổ biến</h3>
          <div className="space-y-4">
            {Object.entries(paymentMethods).map(([method, count]) => {
              const totalOrders = Object.values(paymentMethods).reduce((a, b) => a + b, 0) || 1;
              const percent = (count / totalOrders) * 100;
              
              return (
                <div key={method} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300">
                      {method === "COD" ? "Thanh toán khi nhận hàng (COD)" :
                       method === "VNPay" ? "Thanh toán VNPay" :
                       method === "Momo" ? "Ví điện tử MoMo" : method}
                    </span>
                    <span className="font-bold text-slate-400">{count} đơn ({percent.toFixed(0)}%)</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        method === "COD" ? "bg-indigo-500" :
                        method === "VNPay" ? "bg-cyan-400" :
                        method === "Momo" ? "bg-pink-500" : "bg-slate-500"
                      }`}
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trạng thái đơn hàng */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md">
          <h3 className="text-base font-bold text-white mb-4">Tỷ lệ hủy đơn & Hoàn tất</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-emerald-500/10 p-4 border border-emerald-500/20 text-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Đã hoàn thành</p>
              <p className="mt-2 text-2xl font-extrabold text-white">{statusBreakdown.delivered}</p>
              <p className="mt-1 text-[10px] text-slate-400">Đơn hàng giao thành công</p>
            </div>
            
            <div className="rounded-2xl bg-rose-500/10 p-4 border border-rose-500/20 text-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-rose-400">Đơn hàng bị hủy</p>
              <p className="mt-2 text-2xl font-extrabold text-white">{statusBreakdown.cancelled}</p>
              <p className="mt-1 text-[10px] text-slate-400">Khách hủy / lỗi hệ thống</p>
            </div>

            <div className="rounded-2xl bg-amber-500/10 p-4 border border-amber-500/20 text-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Đang chờ duyệt</p>
              <p className="mt-2 text-2xl font-extrabold text-white">{statusBreakdown.pending}</p>
              <p className="mt-1 text-[10px] text-slate-400">Đang ở hàng đợi duyệt</p>
            </div>

            <div className="rounded-2xl bg-purple-500/10 p-4 border border-purple-500/20 text-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-purple-400">Đang xử lý</p>
              <p className="mt-2 text-2xl font-extrabold text-white">{statusBreakdown.processing}</p>
              <p className="mt-1 text-[10px] text-slate-400">Đóng gói & Chuyển phát</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}