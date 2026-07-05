import Link from "next/link";

interface Props {
  title: string;
  description: string;
  category: string;
  slug: string;
}

export default function SearchResultCard({
  title,
  description,
  category,
  slug,
}: Props) {

  return (

    <Link
      href={`/knowledge/${slug}`}
      className="block rounded-2xl border border-gray-200 bg-white p-6 shadow transition hover:-translate-y-1 hover:border-red-600 hover:shadow-xl"
    >

      <div className="flex items-center justify-between">

        <h2 className="text-2xl font-bold text-black">

          {title}

        </h2>

        <span className="rounded-full bg-red-100 px-4 py-1 text-sm font-semibold text-red-700">

          {category}

        </span>

      </div>

      <p className="mt-4 text-gray-600">

        {description}

      </p>

    </Link>

  );
}