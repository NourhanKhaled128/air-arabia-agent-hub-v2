"use client";

import { useState, useTransition } from "react";
import { Eye, EyeOff, FolderPlus, GripVertical, Pencil, Trash2, X, Check } from "lucide-react";
import {
  createCategoryFolderAction,
  deleteCategoryFolderAction,
  renameCategoryFolderAction,
  reorderCategoryFoldersAction,
  toggleCategoryFolderVisibleAction,
} from "@/app/admin/actions/category-actions";
import SortableItemList from "@/components/admin/SortableItemList";

interface Folder {
  id: number;
  name: string;
  visible: boolean;
}

interface Props {
  categoryId: number;
  folders: Folder[];
  articleCounts: Record<string, number>;
}

export default function CategoryFoldersManager({ categoryId, folders, articleCounts }: Props) {
  const [isPending, startTransition] = useTransition();
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [order, setOrder] = useState(folders);
  const [prevFolders, setPrevFolders] = useState(folders);
  if (folders !== prevFolders) {
    setPrevFolders(folders);
    setOrder(folders);
  }

  function handleReorder(orderedIds: number[]) {
    const byId = new Map(order.map((f) => [f.id, f]));
    setOrder(orderedIds.map((id) => byId.get(id)!).filter(Boolean));
    run(() => reorderCategoryFoldersAction(categoryId, orderedIds));
  }

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
    if (!newName.trim()) return;
    run(() => createCategoryFolderAction(categoryId, newName.trim()));
    setNewName("");
  }

  function startEdit(folder: Folder) {
    setEditingId(folder.id);
    setEditingName(folder.name);
  }

  function saveEdit(id: number) {
    if (!editingName.trim()) return;
    run(() => renameCategoryFolderAction(id, categoryId, editingName.trim()));
    setEditingId(null);
  }

  function handleDelete(id: number) {
    if (!confirm("Delete this folder? Articles inside it will become unfiled, not deleted.")) return;
    run(() => deleteCategoryFolderAction(id, categoryId));
  }

  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm">

      <h2 className="mb-6 text-2xl font-bold">Folders</h2>

      <div className="mb-6 flex gap-3">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
          placeholder="New folder name..."
          className="flex-1 rounded-xl border border-slate-300 px-4 py-3"
        />

        <button
          type="button"
          disabled={!newName.trim() || isPending}
          onClick={handleAdd}
          className="flex items-center gap-2 rounded-xl bg-red-700 px-5 py-3 font-semibold text-white hover:bg-red-800 disabled:opacity-50"
        >
          <FolderPlus size={18} />
          Add Folder
        </button>
      </div>

      {order.length === 0 ? (
        <p className="text-slate-500">
          No folders yet. Add one above to start organizing articles inside this category.
        </p>
      ) : (
        <SortableItemList
          items={order}
          onReorder={handleReorder}
          renderItem={(folder, drag) => (
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4">
              <button
                type="button"
                {...drag.attributes}
                {...drag.listeners}
                className="cursor-grab touch-none rounded-lg p-2 text-slate-400 hover:bg-slate-100 active:cursor-grabbing"
                title="Drag to reorder"
              >
                <GripVertical size={16} />
              </button>

              {editingId === folder.id ? (
                <input
                  autoFocus
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEdit(folder.id);
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  className="flex-1 rounded-lg border border-slate-300 px-3 py-2"
                />
              ) : (
                <div className="flex-1">
                  <span className="font-semibold">{folder.name}</span>
                  <span className="ml-3 text-sm text-slate-500">
                    {articleCounts[String(folder.id)] ?? 0} articles
                  </span>
                </div>
              )}

              <div className="flex gap-2">
                {editingId === folder.id ? (
                  <>
                    <button
                      type="button"
                      onClick={() => saveEdit(folder.id)}
                      className="rounded-lg border border-emerald-200 p-2 text-emerald-700 hover:bg-emerald-50"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="rounded-lg border p-2 hover:bg-slate-50"
                    >
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() =>
                        run(() => toggleCategoryFolderVisibleAction(folder.id, categoryId, !folder.visible))
                      }
                      title={folder.visible ? "Visible in sidebar" : "Hidden from sidebar"}
                      className={`rounded-lg border p-2 ${
                        folder.visible
                          ? "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                          : "border-slate-300 text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      {folder.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>

                    <button
                      type="button"
                      onClick={() => startEdit(folder)}
                      className="rounded-lg border p-2 hover:bg-slate-50"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => handleDelete(folder.id)}
                      className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        />
      )}

    </div>
  );
}
