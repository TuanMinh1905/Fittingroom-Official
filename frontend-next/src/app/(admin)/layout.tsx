export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="border-b border-slate-800 bg-slate-900/95 px-6 py-6 lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400 text-lg font-black text-slate-950">
              A
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Admin</p>
              <h1 className="text-xl font-semibold text-white">TMF Control</h1>
            </div>
          </div>

          <nav className="mt-8 space-y-2 text-sm font-medium text-slate-300">
            <a className="block rounded-xl bg-slate-800/80 px-4 py-3 text-white" href="/admin">
              Dashboard
            </a>
            <a className="block rounded-xl px-4 py-3 transition hover:bg-slate-800 hover:text-white" href="/admin/products">
              Products
            </a>
            <a className="block rounded-xl px-4 py-3 transition hover:bg-slate-800 hover:text-white" href="/admin/categories">
              Categories
            </a>
            <a className="block rounded-xl px-4 py-3 transition hover:bg-slate-800 hover:text-white" href="/admin/brands">
              Brands
            </a>
            <a className="block rounded-xl px-4 py-3 transition hover:bg-slate-800 hover:text-white" href="/admin/orders">
              Orders
            </a>
            <a className="block rounded-xl px-4 py-3 transition hover:bg-slate-800 hover:text-white" href="/admin/users">
              Users
            </a>
          </nav>

          <div className="mt-8 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm text-cyan-100">
            <p className="font-semibold">Admin layout riêng</p>
            <p className="mt-1 text-cyan-100/80">Không dùng chung navbar/footer của public site.</p>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-slate-800 bg-slate-950/90 px-6 py-4 backdrop-blur">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Management area</p>
              <h2 className="text-lg font-semibold text-white">Admin dashboard</h2>
            </div>
            <div className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-300">
              Signed in as Admin
            </div>
          </header>

          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}