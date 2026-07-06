"use client";

import { Search } from "lucide-react";

interface AdminSearchProps {
  placeholder?: string;
}

export default function AdminSearch({
  placeholder = "Search...",
}: AdminSearchProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border bg-white px-5 py-3">

      <Search
        size={20}
        className="text-slate-500"
      />

      <input
        className="w-full bg-transparent outline-none"
        placeholder={placeholder}
      />

    </div>
  );
}