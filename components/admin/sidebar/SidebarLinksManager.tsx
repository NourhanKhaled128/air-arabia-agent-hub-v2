"use client";

import { useState, useTransition } from "react";
import { GripVertical } from "lucide-react";
import SortableItemList from "@/components/admin/SortableItemList";
import SidebarLinkRowActions from "./SidebarLinkRowActions";
import { getSidebarIcon } from "@/lib/sidebar-icons";
import { reorderSidebarLinksAction } from "@/app/admin/actions/sidebar-actions";

interface Link {
  id: number;
  label: string;
  href: string;
  icon: string;
  section: string;
  order: number;
  visible: boolean;
}

interface Props {
  links: Link[];
}

const SECTION_LABELS: Record<string, string> = {
  pinned: "Pinned Knowledge",
  tools: "Agent Tools",
  quickActions: "Quick Actions",
};

const SECTION_ORDER = ["pinned", "tools", "quickActions"];

export default function SidebarLinksManager({ links }: Props) {
  const [isPending, startTransition] = useTransition();
  const [order, setOrder] = useState(links);
  const [prevLinks, setPrevLinks] = useState(links);
  if (links !== prevLinks) {
    setPrevLinks(links);
    setOrder(links);
  }

  const sections = Array.from(new Set([...SECTION_ORDER, ...order.map((l) => l.section)]));

  function handleReorder(section: string, orderedIds: number[]) {
    const byId = new Map(order.map((l) => [l.id, l]));
    const otherLinks = order.filter((l) => l.section !== section);
    const reorderedSection = orderedIds.map((id) => byId.get(id)!).filter(Boolean);
    setOrder([...otherLinks, ...reorderedSection]);

    startTransition(async () => {
      try {
        await reorderSidebarLinksAction(orderedIds);
      } catch (error) {
        console.error(error);
        alert("Reorder failed.");
      }
    });
  }

  return (
    <div className="space-y-8">
      {sections.map((section) => {
        const sectionLinks = order.filter((l) => l.section === section);
        if (sectionLinks.length === 0) return null;

        return (
          <div key={section}>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-slate-500">
              {SECTION_LABELS[section] ?? section}
            </h3>

            <SortableItemList
              items={sectionLinks}
              onReorder={(ids) => handleReorder(section, ids)}
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

                    <span className="flex min-w-[10rem] flex-1 items-center gap-2 font-semibold">
                      <Icon size={18} className="text-slate-500" />
                      {link.label}
                    </span>

                    <span className="min-w-[8rem] flex-1 truncate text-slate-600">{link.href}</span>

                    <span
                      className={`rounded-full px-3 py-1 text-sm font-semibold ${
                        link.visible
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {link.visible ? "Visible" : "Hidden"}
                    </span>

                    <SidebarLinkRowActions id={link.id} />
                  </div>
                );
              }}
            />
          </div>
        );
      })}

      {order.length === 0 && (
        <div className="rounded-3xl bg-white p-10 text-center text-slate-500 shadow-sm">
          No sidebar links yet.
        </div>
      )}
    </div>
  );
}
