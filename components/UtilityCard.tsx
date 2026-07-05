interface UtilityCardProps {
  title: string;
  children: React.ReactNode;
}

export default function UtilityCard({
  title,
  children,
}: UtilityCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
      <h2 className="mb-6 text-2xl font-bold text-red-700">
        {title}
      </h2>

      {children}
    </div>
  );
}