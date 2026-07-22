"use client";

import { ReactNode, useEffect, useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

interface WidgetItem {
  id: number;
  size: string;
  node: ReactNode;
}

interface Props {
  widgets: WidgetItem[];
}

const STORAGE_KEY = "airarabia_home_widget_order";

export default function HomeWidgetsGrid({ widgets }: Props) {
  const [order, setOrder] = useState<number[]>(widgets.map((w) => w.id));

  // Admin-controlled order is the default; a saved per-browser preference (if any,
  // and still valid for the widgets currently visible) overrides it — new/removed
  // widgets since the preference was saved are appended/dropped gracefully.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved: number[] = JSON.parse(raw);
      const currentIds = widgets.map((w) => w.id);
      const validSaved = saved.filter((id) => currentIds.includes(id));
      const missing = currentIds.filter((id) => !validSaved.includes(id));
      setOrder([...validSaved, ...missing]);
    } catch {
      // ignore malformed/unavailable storage
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function persist(next: number[]) {
    setOrder(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore storage errors (e.g. private browsing quota)
    }
  }

  function move(id: number, direction: -1 | 1) {
    const index = order.indexOf(id);
    const target = index + direction;
    if (target < 0 || target >= order.length) return;
    const next = [...order];
    [next[index], next[target]] = [next[target], next[index]];
    persist(next);
  }

  const ordered = order
    .map((id) => widgets.find((w) => w.id === id))
    .filter((w): w is WidgetItem => !!w);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {ordered.map((widget, i) => (
        <div
          key={widget.id}
          className={`group relative ${widget.size === "full" ? "lg:col-span-2" : ""}`}
        >
          {/* Always visible on touch-sized screens (no hover to reveal them);
              hidden-until-hover only kicks in at md+ where a mouse is likely. */}
          <div className="absolute right-3 top-3 z-10 flex gap-1 md:hidden md:group-hover:flex">
            <button
              type="button"
              onClick={() => move(widget.id, -1)}
              disabled={i === 0}
              title="Move up"
              className="rounded-lg border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-1.5 text-gray-500 dark:text-slate-400 shadow-sm disabled:opacity-30"
            >
              <ChevronUp size={14} />
            </button>
            <button
              type="button"
              onClick={() => move(widget.id, 1)}
              disabled={i === ordered.length - 1}
              title="Move down"
              className="rounded-lg border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-1.5 text-gray-500 dark:text-slate-400 shadow-sm disabled:opacity-30"
            >
              <ChevronDown size={14} />
            </button>
          </div>
          {widget.node}
        </div>
      ))}
    </div>
  );
}
