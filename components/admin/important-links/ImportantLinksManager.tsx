"use client";

import { useState, useTransition } from "react";
import { GripVertical } from "lucide-react";
import SortableItemList from "@/components/admin/SortableItemList";
import AdminBulkActionsBar from "@/components/admin/AdminBulkActionsBar";
import ImportantLinkRowActions from "./ImportantLinkRowActions";
import AdminBadge from "@/components/admin/AdminBadge";
import { getSidebarIcon } from "@/lib/sidebar-icons";
import {
  deleteManyImportantLinksAction,
  reorderImportantLinksAction,
} from "@/app/admin/actions/important-link-actions";

interface Link {
  id: number;
  title: string;
  url: string;
  icon: string;
  order: number;
  visible: boolean;
}

interface Props {
  links: Link[];
}

export default function ImportantLinksManager({ links }: Props) {
  const [isPending, startTransition] = useTransition();
  const [order, setOrder] = useState(links);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [deleting, setDeleting] = useState(false);
  const [prevLinks, setPrevLinks] = useState(links);
  if (links !== prevLinks) {
    setPrevLinks(links);
    setOrder(links);
  }

  function handleReorder(orderedIds: number[]) {
    const byId = new Map(order.map((l) => [l.id, l]));
    setOrder(orderedIds.map((id) => byId.get(id)!).filter(Boolean));
    startTransition(async () => {
      try {
        await reorderImportantLinksAction(orderedIds);
      } catch (error) {
        console.error(error);
        alert("Reorder failed.");
      }
    });
  }

  function toggleRow(id: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleDeleteSelected() {
    if (selected.size === 0) return;
    if (!confirm(`Delete ${selected.size} selected link(s) permanently?`)) return;

    setDeleting(true);
    try {
      await deleteManyImportantLinksAction(Array.from(selected));
      setSelected(new Set());
    } catch (error) {
      console.error(error);
      alert("Bulk delete failed.");
    } finally {
      setDeleting(false);
    }
  }

  if (order.length === 0) {
    return (
      <div className="rounded-3xl bg-white p-10 text-center text-slate-500 shadow-sm">
        No important links yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AdminBulkActionsBar
        count={selected.size}
        onClear={() => setSelected(new Set())}
        onDelete={handleDeleteSelected}
        deleting={deleting}
      />

      <SortableItemList
        items={order}
        onReorder={handleReorder}
        renderItem={(link, drag) => {
          const Icon = getSidebarIcon(link.icon);

          return (
            <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-white p-4 shadow-sm">
              <button
                type="button"
                {...drag.attributes}
                {...drag.listeners}
                disabled={isPending}
                className="cursor-grab touch-none rounded-lg p-2 text-slate-400 hover:bg-slate-100 active:cursor-grabbing"
                title="Drag to reorder"
              >
                <GripVertical size={18} />
              </button>

              <input
                type="checkbox"
                checked={selected.has(link.id)}
                onChange={() => toggleRow(link.id)}
                className="h-4 w-4 rounded border-gray-300"
              />

              <span className="flex min-w-[10rem] flex-1 items-center gap-2 font-semibold">
                <Icon size={18} className="text-slate-500" />
                {link.title}
              </span>

              <span className="min-w-[8rem] flex-1 truncate text-slate-600">{link.url}</span>

              <AdminBadge color={link.visible ? "green" : "gray"}>
                {link.visible ? "Visible" : "Hidden"}
              </AdminBadge>

              <ImportantLinkRowActions id={link.id} />
            </div>
          );
        }}
      />
    </div>
  );
}
