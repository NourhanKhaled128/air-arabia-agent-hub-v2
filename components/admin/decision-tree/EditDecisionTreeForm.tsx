"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import NodeEditor, { type DecisionNodeInput } from "./NodeEditor";

interface DecisionTreeWithNodes {
  id: number;
  title: string;
  description: string | null;
  topic: string | null;
  status: string;
  author: string;
  sourceArticleId: number | null;
  nodes: {
    id: number;
    type: string;
    text: string;
    image: string | null;
    order: number;
    options: {
      id: number;
      label: string;
      targetNodeId: number | null;
      targetTreeId: number | null;
      order: number;
    }[];
  }[];
}

interface Props {
  tree: DecisionTreeWithNodes;
  articles?: { id: number; title: string }[];
  trees?: { id: number; title: string; slug: string }[];
}

interface EditFormData {
  title: string;
  description: string;
  topic: string;
  status: string;
  author: string;
  sourceArticleId: number | null;
  nodes: DecisionNodeInput[];
}

function toFormData(tree: DecisionTreeWithNodes): EditFormData {
  return {
    title: tree.title,
    description: tree.description ?? "",
    topic: tree.topic ?? "",
    status: tree.status,
    author: tree.author,
    sourceArticleId: tree.sourceArticleId,
    nodes: tree.nodes.map((node) => ({
      id: node.id,
      type: node.type as "question" | "outcome",
      text: node.text,
      image: node.image ?? "",
      options: node.options.map((opt) => ({
        id: opt.id,
        label: opt.label,
        targetId: opt.targetNodeId,
        targetTreeId: opt.targetTreeId,
      })),
    })),
  };
}

export default function EditDecisionTreeForm({ tree, articles = [], trees = [] }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<EditFormData>(() => toFormData(tree));

  function updateField<K extends keyof EditFormData>(name: K, value: EditFormData[K]) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function save() {
    setLoading(true);

    try {
      const response = await fetch(`/api/decision-trees/${tree.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          topic: form.topic,
          status: form.status,
          author: form.author,
          sourceArticleId: form.sourceArticleId,
          nodes: form.nodes.map((node, index) => ({
            clientKey: node.id,
            type: node.type,
            text: node.text,
            image: node.image,
            order: index,
            options: node.options.map((opt) => ({
              label: opt.label,
              targetClientKey: opt.targetId,
              targetTreeId: opt.targetTreeId,
            })),
          })),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Failed to update decision tree.");
      }

      alert("Decision tree updated successfully.");
      router.push("/admin/decision-trees");
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-2xl font-bold">Details</h2>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-gray-700">Title</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              className="w-full rounded-xl border p-4"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-gray-700">Description</label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              className="w-full rounded-xl border p-4"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Topic</label>
            <input
              type="text"
              value={form.topic}
              onChange={(e) => updateField("topic", e.target.value)}
              className="w-full rounded-xl border p-4"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Status</label>
            <select
              value={form.status}
              onChange={(e) => updateField("status", e.target.value)}
              className="w-full rounded-xl border p-4"
            >
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Source article (optional)
            </label>
            <select
              value={form.sourceArticleId ?? ""}
              onChange={(e) =>
                updateField("sourceArticleId", e.target.value ? Number(e.target.value) : null)
              }
              className="w-full rounded-xl border p-4"
            >
              <option value="">— none —</option>
              {articles.map((article) => (
                <option key={article.id} value={article.id}>
                  {article.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <NodeEditor
        nodes={form.nodes}
        onChange={(nodes) => setForm((prev) => ({ ...prev, nodes }))}
        trees={trees}
        currentTreeId={tree.id}
      />

      <div className="flex justify-end">
        <button
          onClick={save}
          disabled={loading}
          className="rounded-xl bg-red-700 px-8 py-3 font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
