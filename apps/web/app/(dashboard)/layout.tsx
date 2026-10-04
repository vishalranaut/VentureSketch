export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950">
      <aside className="w-64 border-r bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 p-4">
        {/* Navigation placeholder */}
        <h1 className="text-xl font-bold">VentureSketch</h1>
      </aside>
      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  );
}
