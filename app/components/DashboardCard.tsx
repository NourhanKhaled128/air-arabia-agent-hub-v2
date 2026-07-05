type DashboardCardProps = {
  title: string;
  children: React.ReactNode;
};

export default function DashboardCard({
  title,
  children,
}: DashboardCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <h2 className="text-2xl font-bold text-red-700 mb-5">
        {title}
      </h2>

      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}