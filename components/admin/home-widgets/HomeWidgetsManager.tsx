"use client";

import { useState, useTransition } from "react";
import { GripVertical, Trash2, Plus, Eye, EyeOff } from "lucide-react";
import {
  addHomeWidgetAction,
  deleteHomeWidgetAction,
  reorderHomeWidgetsAction,
  setHomeWidgetSizeAction,
  toggleHomeWidgetVisibleAction,
} from "@/app/admin/actions/home-widget-actions";
import { HOME_WIDGET_CATALOG } from "@/lib/home-widget-catalog";
import SortableItemList from "@/components/admin/SortableItemList";

interface Widget {
  id: number;
  type: string;
  order: number;
  size: string;
  visible: boolean;
}

interface Props {
  widgets: Widget[];
}

export default function HomeWidgetsManager({ widgets }: Props) {
  const [isPending, startTransition] = useTransition();
  const [addType, setAddType] = useState("");
  const [order, setOrder] = useState(widgets);
  const [prevWidgets, setPrevWidgets] = useState(widgets);
  if (widgets !== prevWidgets) {
    setPrevWidgets(widgets);
    setOrder(widgets);
  }

  const placedTypes = new Set(widgets.map((w) => w.type));
  const availableTypes = Object.keys(HOME_WIDGET_CATALOG).filter((type) => !placedTypes.has(type));

  function run(action: () => Promise<void>) {
    startTransition(async () => {
      try {
        await action();
      } catch (error) {
        console.error(error);
        alert("Operation failed.");
      }
    });
  }

  function handleAdd() {
    if (!addType) return;
    run(() => addHomeWidgetAction(addType));
    setAddType("");
  }

  function handleDelete(id: number) {
    if (!confirm("Remove this widget from the home page? You can add it back later.")) return;
    run(() => deleteHomeWidgetAction(id));
  }

  function handleReorder(orderedIds: number[]) {
    const byId = new Map(order.map((w) => [w.id, w]));
    setOrder(orderedIds.map((id) => byId.get(id)!).filter(Boolean));
    run(() => reorderHomeWidgetsAction(orderedIds));
  }

  return (
    <div className="space-y-6">
      {availableTypes.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-3xl bg-white p-6 shadow-sm">
          <select
            value={addType}
            onChange={(e) => setAddType(e.target.value)}
            className="rounded-xl border border-gray-300 px-4 py-3"
          >
            <option value="">Choose a widget to add...</option>
            {availableTypes.map((type) => (
              <option key={type} value={type}>
                {HOME_WIDGET_CATALOG[type]}
              </option>
            ))}
          </select>

          <button
            type="button"
            disabled={!addType || isPending}
            onClick={handleAdd}
            className="flex items-center gap-2 rounded-xl bg-red-700 px-5 py-3 font-semibold text-white hover:bg-red-800 disabled:opacity-50"
          >
            <Plus size={18} />
            Add Widget
          </button>
        </div>
      )}

      {order.length === 0 ? (
        <div className="rounded-3xl bg-white p-10 text-center text-slate-500 shadow-sm">
          No widgets on the home page. Add one above.
        </div>
      ) : (
        <SortableItemList
          items={order}
          onReorder={handleReorder}
          renderItem={(widget, drag) => (
            <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-white p-4 shadow-sm">
              <button
                type="button"
                {...drag.attributes}
                {...drag.listeners}
                className="cursor-grab touch-none rounded-lg p-2 text-slate-400 hover:bg-slate-100 active:cursor-grabbing"
                title="Drag to reorder"
              >
                <GripVertical size={18} />
              </button>

              <span className="min-w-[10rem] flex-1 font-semibold">
                {HOME_WIDGET_CATALOG[widget.type] ?? widget.type}
              </span>

              <select
                value={widget.size}
                disabled={isPending}
                onChange={(e) => run(() => setHomeWidgetSizeAction(widget.id, e.target.value))}
                className="rounded-lg border border-gray-300 px-3 py-2"
              >
                <option value="half">Half width</option>
                <option value="full">Full width</option>
              </select>

              <button
                type="button"
                disabled={isPending}
                onClick={() => run(() => toggleHomeWidgetVisibleAction(widget.id, !widget.visible))}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 font-semibold ${
                  widget.visible
                    ? "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                    : "border-slate-300 text-slate-500 hover:bg-slate-50"
                }`}
              >
                {widget.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                {widget.visible ? "Visible" : "Hidden"}
              </button>

              <button
                type="button"
                disabled={isPending}
                onClick={() => handleDelete(widget.id)}
                className="flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 font-semibold text-red-600 hover:bg-red-50"
              >
                <Trash2 size={16} />
                Remove
              </button>
            </div>
          )}
        />
      )}
    </div>
  );
}
