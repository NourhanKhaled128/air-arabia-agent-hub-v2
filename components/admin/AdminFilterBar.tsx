"use client";

interface Props {
  children: React.ReactNode;
}

export default function AdminFilterBar({
  children,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-3xl bg-white p-6 shadow-sm">
      {children}
    </div>
  );
}