export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 p-8">
        {children}
      </div>
    </div>
  );
}
