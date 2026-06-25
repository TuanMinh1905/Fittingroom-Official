export default function AdminPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.35)]">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Overview</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Admin Dashboard</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
          Đây là trang quản trị riêng với layout tách biệt, không dùng header/footer của site public.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Products</p>
          <p className="mt-3 text-3xl font-semibold text-white">128</p>
          <p className="mt-2 text-sm text-emerald-300">+12 this week</p>
        </article>
        <article className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Orders</p>
          <p className="mt-3 text-3xl font-semibold text-white">42</p>
          <p className="mt-2 text-sm text-cyan-300">8 pending</p>
        </article>
        <article className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Customers</p>
          <p className="mt-3 text-3xl font-semibold text-white">1,204</p>
          <p className="mt-2 text-sm text-amber-300">+86 this month</p>
        </article>
        <article className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Revenue</p>
          <p className="mt-3 text-3xl font-semibold text-white">$18.4k</p>
          <p className="mt-2 text-sm text-rose-300">-2.1% vs last month</p>
        </article>
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
        <h2 className="text-lg font-semibold text-white">Recent activity</h2>
        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-800">
          <div className="grid grid-cols-4 bg-slate-950 px-4 py-3 text-sm font-medium text-slate-400">
            <span>Action</span>
            <span>Target</span>
            <span>User</span>
            <span>Status</span>
          </div>
          <div className="grid grid-cols-4 border-t border-slate-800 px-4 py-3 text-sm text-slate-200">
            <span>Updated product</span>
            <span>Classic Jacket</span>
            <span>Admin</span>
            <span className="text-emerald-300">Done</span>
          </div>
          <div className="grid grid-cols-4 border-t border-slate-800 px-4 py-3 text-sm text-slate-200">
            <span>Created brand</span>
            <span>TMF Studio</span>
            <span>Admin</span>
            <span className="text-cyan-300">Queued</span>
          </div>
        </div>
      </section>
    </div>
  );
}
