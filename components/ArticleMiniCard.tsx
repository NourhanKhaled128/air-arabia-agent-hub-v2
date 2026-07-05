import Link from "next/link";

interface Props {
  title: string;
  category: string;
  slug: string;
}

export default function ArticleMiniCard({
  title,
  category,
  slug,
}: Props) {
  return (
    <Link
      href={`/knowledge/${slug}`}
      className="block rounded-xl border border-gray-200 bg-white p-4 transition hover:border-red-600 hover:shadow-md"
    >
      <span className="text-xs font-semibold text-red-600">
        {category}
      </span>

      <h3 className="mt-2 font-bold text-black">
        {title}
      </h3>
    </Link>
  );
}