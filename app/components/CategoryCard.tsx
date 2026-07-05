import Link from "next/link";

type CategoryCardProps = {
  title: string;
  description: string;
  href: string;
  icon: string;
};

export default function CategoryCard({
  title,
  description,
  href,
  icon,
}: CategoryCardProps) {
  return (
    <Link
      href={href}
      className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl hover:-translate-y-1 transition-all block"
    >
      <div className="text-4xl mb-4">{icon}</div>

      <h2 className="text-2xl font-bold text-red-700 mb-2">
        {title}
      </h2>

      <p className="text-gray-600">
        {description}
      </p>
    </Link>
  );
}