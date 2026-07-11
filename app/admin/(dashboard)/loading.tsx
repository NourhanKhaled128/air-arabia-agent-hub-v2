export default function AdminLoading() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="h-10 w-64 rounded-xl bg-slate-200 dark:bg-surface" />

      <div className="grid gap-6 md:grid-cols-3">
        <div className="h-28 rounded-3xl bg-slate-200 dark:bg-surface" />
        <div className="h-28 rounded-3xl bg-slate-200 dark:bg-surface" />
        <div className="h-28 rounded-3xl bg-slate-200 dark:bg-surface" />
      </div>

      <div className="h-96 rounded-3xl bg-slate-200 dark:bg-surface" />
    </div>
  );
}
