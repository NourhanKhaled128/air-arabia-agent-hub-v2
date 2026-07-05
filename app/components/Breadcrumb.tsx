import Link from "next/link";

type Props = {
  current: string;
};

export default function Breadcrumb({ current }: Props) {
  return (
    <div className="mb-8 text-sm text-gray-600">

      <Link href="/" className="hover:text-red-700">
        Home
      </Link>

      {" > "}

      <Link href="/knowledge" className="hover:text-red-700">
        Knowledge
      </Link>

      {" > "}

      <span className="font-semibold text-red-700">
        {current}
      </span>

    </div>
  );
}