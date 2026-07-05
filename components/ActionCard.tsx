import Link from "next/link";
import { ReactNode } from "react";

interface Props {
  title: string;
  icon: ReactNode;
  href: string;
}

export default function ActionCard({
  title,
  icon,
  href,
}: Props) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-gray-200 bg-white p-5 shadow hover:shadow-lg hover:-translate-y-1 transition"
    >
      <div className="mb-3">
        {icon}
      </div>

      <h3 className="font-bold text-black">
        {title}
      </h3>
    </Link>
  );
}