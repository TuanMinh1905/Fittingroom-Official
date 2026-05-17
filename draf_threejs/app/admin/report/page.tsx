// ===== TMFashion Admin Report Page =====
// Tương đương pages/admin/report.vue (~695 lines)
// SD: Quản lý doanh thu → Admin xem báo cáo doanh thu
// STM Quản lý doanh thu: Xem tổng quan → Chọn khoảng thời gian → So sánh → Xuất CSV

"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { formatVNDWithComma } from "@/utils";

interface MonthlyData {
  _id: { year: number; month: number };
  revenue: number;
  orderCount: number;
}

interface TopProduct {
  productId: string;
  productName: string;
  productImage?: string;
  totalSold: number;
  totalRevenue: number;
}

interface OrderStatsData {
  orderStats: Record<string, { count: number; totalAmount: number }>;
}

interface OverviewData {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
}

const MONTHS = ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"];

export default function AdminReportPage() {
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [chartData, setChartData] = useState<MonthlyData[]>([]);
  const [lastYearData, setLastYearData] = useState<MonthlyData[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [orderStats, setOrderStats] = useState<OrderStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [compareResult, setCompareResult] = useState<{ current: number; previous: number; change: number } | null>(null);
  const [exporting, setExporting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const currentYear = new Date().getFullYear();
      const [ov, chart, lastYear, top, stats] = await Promise.all([
        api.get<OverviewData>("/admin/revenue/overview"),
        api.get<{ data: MonthlyData[] }>("/admin/revenue/chart", { year: currentYear }),
        api.get<{ data: MonthlyData[] }>("/admin/revenue/chart", { year: currentYear - 1 }),
        api.get<{ topProducts: TopProduct[] }>("/admin/revenue/top-products", { limit: 10 }),
        api.get<OrderStatsData>("/admin/revenue/order-stats"),
      ]);
      setOverview(ov);
      setChartData(chart.data || []);
      setLastYearData(lastYear.data || []);
      setTopProducts(top.topProducts || []);
      setOrderStats(stats);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Compare months
  async function handleCompare() {
    try {
      const currentYear = new Date().getFullYear();
      const data = await api.get<{ currentMonth: { revenue: number }; previousMonth: { revenue: number }; comparison: { revenueChange: number } }>(
        "/admin/revenue/compare",
        { month: selectedMonth, year: currentYear }
      );
      setCompareResult({
        current: data.currentMonth?.revenue || 0,
        previous: data.previousMonth?.revenue || 0,
        change: data.comparison?.revenueChange || 0,
      });
    } catch {
      setCompareResult(null);
    }
  }

  // Export CSV
  async function handleExportCSV() {
    setExporting(true);
    try {
      const res = await fetch(`http://localhost:8000/admin/revenue/export`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("tmf_token") || ""}` },
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `revenue-report-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Lỗi xuất CSV");
    } finally {
      setExporting(false);
    }
  }

  // SVG Line Chart helper
  const chartWidth = 700;
  const chartHeight = 300;
  const padding = 40;

  function getMaxRevenue() {
    const allValues = [...chartData.map((d) => d.revenue), ...lastYearData.map((d) => d.revenue)];
    return Math.max(...allValues, 1);
  }

  function toPoint(month: number, revenue: number, maxRev: number) {
    const x = padding + ((month - 1) / 11) * (chartWidth - 2 * padding);
    const y = chartHeight - padding - (revenue / maxRev) * (chartHeight - 2 * padding);
    return { x, y };
  }

  function buildPath(data: MonthlyData[], maxRev: number) {
    const points = Array.from({ length: 12 }, (_, i) => {
      const d = data.find((d) => (d._id?.month || 0) === i + 1);
      return toPoint(i + 1, d?.revenue || 0, maxRev);
    });
    return points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  }

  if (loading) {
    return <div className="text-center py-12 text-gray-400">Đang tải báo cáo...</div>;
  }

  const maxRev = getMaxRevenue();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Báo cáo doanh thu</h1>
        <button
          onClick={handleExportCSV}
          disabled={exporting}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition disabled:opacity-50"
        >
          {exporting ? "Đang xuất..." : "Xuất CSV"}
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500">Tổng doanh thu</p>
          <p className="text-2xl font-bold text-red-500">{formatVNDWithComma(overview?.totalRevenue || 0)}đ</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500">Tổng đơn hàng</p>
          <p className="text-2xl font-bold text-blue-600">{overview?.totalOrders || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500">Giá trị TB / đơn</p>
          <p className="text-2xl font-bold text-orange-500">{formatVNDWithComma(overview?.totalRevenue && overview?.totalOrders ? Math.round(overview.totalRevenue / overview.totalOrders) : 0)}đ</p>
        </div>
      </div>

      {/* Revenue Chart (SVG) */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Biểu đồ doanh thu theo tháng</h2>
        <div className="overflow-x-auto">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full min-w-[500px]">
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = chartHeight - padding - ratio * (chartHeight - 2 * padding);
              return (
                <g key={ratio}>
                  <line x1={padding} y1={y} x2={chartWidth - padding} y2={y} stroke="#e5e7eb" strokeDasharray="4" />
                  <text x={padding - 5} y={y + 4} textAnchor="end" fill="#9ca3af" fontSize="10">
                    {formatVNDWithComma(Math.round(maxRev * ratio))}
                  </text>
                </g>
              );
            })}

            {/* X axis labels */}
            {MONTHS.map((m, i) => {
              const pt = toPoint(i + 1, 0, maxRev);
              return (
                <text key={m} x={pt.x} y={chartHeight - 10} textAnchor="middle" fill="#6b7280" fontSize="11">
                  {m}
                </text>
              );
            })}

            {/* Last year line */}
            <path d={buildPath(lastYearData, maxRev)} fill="none" stroke="#d1d5db" strokeWidth="2" strokeDasharray="6" />

            {/* This year line */}
            <path d={buildPath(chartData, maxRev)} fill="none" stroke="#FED519" strokeWidth="3" />

            {/* This year dots */}
            {Array.from({ length: 12 }, (_, i) => {
              const d = chartData.find((d) => (d._id?.month || 0) === i + 1);
              const pt = toPoint(i + 1, d?.revenue || 0, maxRev);
              return (
                <circle key={i} cx={pt.x} cy={pt.y} r="4" fill="#FED519" stroke="white" strokeWidth="2" />
              );
            })}

            {/* Legend */}
            <rect x={chartWidth - 200} y={10} width={12} height={3} fill="#FED519" />
            <text x={chartWidth - 183} y={14} fill="#374151" fontSize="11">Năm nay</text>
            <line x1={chartWidth - 200} y1={28} x2={chartWidth - 188} y2={28} stroke="#d1d5db" strokeWidth="2" strokeDasharray="4" />
            <text x={chartWidth - 183} y={32} fill="#6b7280" fontSize="11">Năm trước</text>
          </svg>
        </div>
      </div>

      {/* Month Comparison */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">So sánh doanh thu tháng</h2>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">Tháng</label>
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))} className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
            </select>
          </div>
          <button onClick={handleCompare} className="px-4 py-2 bg-primary hover:bg-yellow-400 text-gray-800 font-medium rounded-lg transition">
            So sánh với tháng trước
          </button>
        </div>
        {compareResult && (
          <div className="mt-4 grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-500">Tháng hiện tại</p>
              <p className="text-lg font-bold">{formatVNDWithComma(compareResult.current)}đ</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tháng trước</p>
              <p className="text-lg font-bold">{formatVNDWithComma(compareResult.previous)}đ</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Thay đổi</p>
              <p className={`text-lg font-bold ${compareResult.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                {compareResult.change >= 0 ? "+" : ""}{compareResult.change.toFixed(1)}%
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Top Products & Order Stats */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Top sản phẩm bán chạy</h2>
          <div className="space-y-3">
            {topProducts.length === 0 ? (
              <p className="text-gray-400 text-sm">Chưa có dữ liệu</p>
            ) : (
              topProducts.map((item, i) => {
                const maxQty = topProducts[0]?.totalSold || 1;
                const barWidth = (item.totalSold / maxQty) * 100;
                return (
                  <div key={item.productId}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="flex items-center gap-2">
                        <span className="text-gray-400 font-mono w-5">#{i + 1}</span>
                        <span className="font-medium text-gray-800 line-clamp-1">{item.productName}</span>
                      </span>
                      <span className="text-gray-500 whitespace-nowrap ml-2">{item.totalSold} đã bán</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-primary rounded-full h-2 transition-all" style={{ width: `${barWidth}%` }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Order Stats */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Thống kê đơn hàng</h2>
          {orderStats?.orderStats ? (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-800">{Object.values(orderStats.orderStats).reduce((sum, s) => sum + s.count, 0)}</p>
                <p className="text-sm text-gray-500">Tổng số đơn hàng</p>
              </div>
              <div className="space-y-2">
                {Object.entries(orderStats.orderStats).map(([status, stat]) => {
                  const total = Object.values(orderStats.orderStats).reduce((sum, s) => sum + s.count, 0) || 1;
                  const pct = (stat.count / total) * 100;
                  const colors: Record<string, string> = {
                    pending: "bg-yellow-400",
                    confirmed: "bg-blue-400",
                    shipping: "bg-indigo-400",
                    delivered: "bg-green-400",
                    cancelled: "bg-red-400",
                  };
                  return (
                    <div key={status}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize text-gray-600">{status}</span>
                        <span className="text-gray-500">{stat.count} ({pct.toFixed(0)}%)</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className={`${colors[status] || "bg-gray-400"} rounded-full h-2`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">Chưa có dữ liệu</p>
          )}
        </div>
      </div>
    </div>
  );
}
