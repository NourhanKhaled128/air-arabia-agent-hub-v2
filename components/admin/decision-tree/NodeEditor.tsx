"use client";

import { GripVertical, Plus, Trash2 } from "lucide-react";
import SortableItemList, { type DragHandleProps } from "@/components/admin/SortableItemList";

export interface DecisionOptionInput {
  id: number;
  label: string;
  targetId: number | null;
}

export interface DecisionNodeInput {
  id: number;
  type: "question" | "outcome";
  text: string;
  options: DecisionOptionInput[];
}

interface Props {
  nodes: DecisionNodeInput[];
  onChange: (nodes: DecisionNodeInput[]) => void;
}

export default function NodeEditor({ nodes, onChange }: Props) {
  function addNode() {
    onChange([...nodes, { id: Date.now(), type: "question", text: "", options: [] }]);
  }

  function removeNode(id: number) {
    onChange(
      nodes
        .filter((node) => node.id !== id)
        .map((node) => ({
          ...node,
          options: node.options.map((opt) =>
            opt.targetId === id ? { ...opt, targetId: null } : opt
          ),
        }))
    );
  }

  function updateNode(id: number, patch: Partial<DecisionNodeInput>) {
    onChange(nodes.map((node) => (node.id === id ? { ...node, ...patch } : node)));
  }

  function addOption(nodeId: number) {
    onChange(
      nodes.map((node) =>
        node.id === nodeId
          ? { ...node, options: [...node.options, { id: Date.now(), label: "", targetId: null }] }
          : node
      )
    );
  }

  function updateOption(nodeId: number, optionId: number, patch: Partial<DecisionOptionInput>) {
    onChange(
      nodes.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              options: node.options.map((opt) =>
                opt.id === optionId ? { ...opt, ...patch } : opt
              ),
            }
          : node
      )
    );
  }

  function removeOption(nodeId: number, optionId: number) {
    onChange(
      nodes.map((node) =>
        node.id === nodeId
          ? { ...node, options: node.options.filter((opt) => opt.id !== optionId) }
          : node
      )
    );
  }

  function handleReorder(orderedIds: number[]) {
    const byId = new Map(nodes.map((node) => [node.id, node]));
    onChange(orderedIds.map((id) => byId.get(id)!));
  }

  function nodePreview(node: DecisionNodeInput, index: number) {
    const label = node.text.trim() || "(empty)";
    return `#${index + 1} — ${node.type === "question" ? "Q" : "Outcome"}: ${label.slice(0, 50)}`;
  }

  return (
    <section className="rounded-3xl bg-white p-8 shadow-sm">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Nodes</h2>
          <p className="mt-1 text-sm text-gray-500">
            The first node is the tree&apos;s starting question. Question nodes branch via
            options; Outcome nodes are the final resolution the agent lands on.
          </p>
        </div>

        <button
          type="button"
          onClick={addNode}
          className="flex items-center gap-2 rounded-xl bg-red-700 px-5 py-3 text-white"
        >
          <Plus size={18} />
          Add Node
        </button>
      </div>

      <SortableItemList
        items={nodes}
        onReorder={handleReorder}
        renderItem={(node, dragHandle: DragHandleProps) => {
          const index = nodes.findIndex((n) => n.id === node.id);

          return (
            <div className="mb-6 rounded-2xl border p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    {...dragHandle.attributes}
                    {...dragHandle.listeners}
                    className="cursor-grab text-gray-400 hover:text-gray-600"
                  >
                    <GripVertical size={18} />
                  </span>

                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                    {index === 0 ? "Start" : `#${index + 1}`}
                  </span>

                  <div className="flex overflow-hidden rounded-lg border">
                    <button
                      type="button"
                      onClick={() => updateNode(node.id, { type: "question" })}
                      className={`px-3 py-1.5 text-sm font-semibold ${
                        node.type === "question" ? "bg-red-700 text-white" : "bg-white text-gray-600"
                      }`}
                    >
                      Question
                    </button>
                    <button
                      type="button"
                      onClick={() => updateNode(node.id, { type: "outcome" })}
                      className={`px-3 py-1.5 text-sm font-semibold ${
                        node.type === "outcome" ? "bg-red-700 text-white" : "bg-white text-gray-600"
                      }`}
                    >
                      Outcome
                    </button>
                  </div>
                </div>

                {nodes.length > 1 && (
                  <button type="button" onClick={() => removeNode(node.id)}>
                    <Trash2 className="text-red-700" size={18} />
                  </button>
                )}
              </div>

              <textarea
                rows={node.type === "question" ? 2 : 4}
                value={node.text}
                onChange={(e) => updateNode(node.id, { text: e.target.value })}
                placeholder={
                  node.type === "question"
                    ? "The question the agent should ask, e.g. \"What's the TV's screen size?\""
                    : "The resolution / disposition text the agent lands on."
                }
                className="w-full rounded-xl border p-4"
              />

              {node.type === "question" && (
                <div className="mt-4 space-y-3">
                  <p className="text-sm font-semibold text-gray-600">Options</p>

                  {node.options.map((option) => (
                    <div key={option.id} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={option.label}
                        onChange={(e) =>
                          updateOption(node.id, option.id, { label: e.target.value })
                        }
                        placeholder="Option label, e.g. Under 40 inch"
                        className="flex-1 rounded-xl border p-3"
                      />

                      <select
                        value={option.targetId ?? ""}
                        onChange={(e) =>
                          updateOption(node.id, option.id, {
                            targetId: e.target.value ? Number(e.target.value) : null,
                          })
                        }
                        className="w-64 rounded-xl border p-3"
                      >
                        <option value="">— leads to… —</option>
                        {nodes
                          .filter((n) => n.id !== node.id)
                          .map((n) => (
                            <option key={n.id} value={n.id}>
                              {nodePreview(n, nodes.findIndex((x) => x.id === n.id))}
                            </option>
                          ))}
                      </select>

                      <button type="button" onClick={() => removeOption(node.id, option.id)}>
                        <Trash2 size={16} className="text-red-700" />
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => addOption(node.id)}
                    className="flex items-center gap-1 text-sm font-semibold text-red-700"
                  >
                    <Plus size={14} />
                    Add option
                  </button>
                </div>
              )}
            </div>
          );
        }}
      />
    </section>
  );
}
