export default function PortalLoading() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="h-40 rounded-3xl bg-gray-200 dark:bg-surface" />

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="h-64 rounded-3xl bg-gray-200 dark:bg-surface" />
        <div className="h-64 rounded-3xl bg-gray-200 dark:bg-surface" />
      </div>
    </div>
  );
}
