import Link from "next/link";
import { ReactNode } from "react";

interface Props {
  href?: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
}

export default function AdminButton({
  href,
  children,
  variant = "primary",
}: Props) {
  const classes =
    variant === "primary"
      ? "rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800"
      : "rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold hover:bg-slate-50";

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes}>
      {children}
    </button>
  );
}