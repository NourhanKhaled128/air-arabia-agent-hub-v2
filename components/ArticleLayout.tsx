import Link from "next/link";

export default function ArticleLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-gray-100">

      <div className="bg-red-700 text-white p-6 shadow-lg">

        <Link
          href="/"
          className="text-sm hover:underline"
        >
          ← Back to Home
        </Link>

        <h1 className="text-5xl font-bold mt-4">
          {title}
        </h1>

      </div>

      <div className="max-w-6xl mx-auto p-10">

        <div className="bg-white rounded-2xl shadow-xl p-10">

          {children}

        </div>

      </div>

    </main>
  );
}