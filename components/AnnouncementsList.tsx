"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import AnnouncementItem from "@/components/AnnouncementItem";

interface Announcement {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
}

interface Props {
  announcements: Announcement[];
}

export default function AnnouncementsList({ announcements }: Props) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return announcements;
    return announcements.filter(
      (a) => a.title.toLowerCase().includes(q) || a.content.toLowerCase().includes(q)
    );
  }, [announcements, search]);

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search announcements..."
          className="w-full rounded-xl border border-gray-300 dark:border-border-subtle bg-white dark:bg-surface py-2.5 pl-9 pr-4 text-sm text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-10 text-center shadow-sm">
          <p className="text-gray-500 dark:text-slate-400">
            {search ? `No announcements match "${search}".` : "No announcements yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <AnnouncementItem
              key={item.id}
              id={item.id}
              title={item.title}
              content={item.content}
              createdAt={item.createdAt}
            />
          ))}
        </div>
      )}
    </div>
  );
}
