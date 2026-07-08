"use client";

import { useState, useTransition } from "react";
import { ArrowUp, ArrowDown, Trash2, Plus, Eye, EyeOff } from "lucide-react";
import {
  addHomeWidgetAction,
  deleteHomeWidgetAction,
  moveHomeWidgetAction,
  setHomeWidgetSizeAction,
  toggleHomeWidgetVisibleAction,
} from "@/app/admin/actions/home-widget-actions";
import { HOME_WIDGET_CATALOG } from "@/lib/home-widget-catalog";

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

      <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr className="text-left text-sm">
              <th className="px-6 py-4">Widget</th>
              <th className="px-6 py-4">Size</th>
              <th className="px-6 py-4">Visible</th>
              <th className="px-6 py-4">Order</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {widgets.map((widget, index) => (
              <tr key={widget.id} className="border-t">
                <td className="px-6 py-5 font-semibold">
                  {HOME_WIDGET_CATALOG[widget.type] ?? widget.type}
                </td>

                <td className="px-6 py-5">
                  <select
                    value={widget.size}
                    disabled={isPending}
                    onChange={(e) => run(() => setHomeWidgetSizeAction(widget.id, e.target.value))}
                    className="rounded-lg border border-gray-300 px-3 py-2"
                  >
                    <option value="half">Half width</option>
                    <option value="full">Full width</option>
                  </select>
                </td>

                <td className="px-6 py-5">
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
                </td>

                <td className="px-6 py-5">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={isPending || index === 0}
                      onClick={() => run(() => moveHomeWidgetAction(widget.id, "up"))}
                      className="rounded-lg border p-2 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <ArrowUp size={16} />
                    </button>

                    <button
                      type="button"
                      disabled={isPending || index === widgets.length - 1}
                      onClick={() => run(() => moveHomeWidgetAction(widget.id, "down"))}
                      className="rounded-lg border p-2 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <ArrowDown size={16} />
                    </button>
                  </div>
                </td>

                <td className="px-6 py-5">
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleDelete(widget.id)}
                    className="flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 font-semibold text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                    Remove
                  </button>
                </td>
              </tr>
            ))}

            {widgets.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                  No widgets on the home page. Add one above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
