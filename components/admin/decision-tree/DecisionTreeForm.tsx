"use client";

import { useState } from "react";
import NodeEditor, { type DecisionNodeInput } from "./NodeEditor";

interface DecisionTreeFormData {
  title: string;
  description: string;
  topic: string;
  status: string;
  sourceArticleId: number | null;
  nodes: DecisionNodeInput[];
}

interface Props {
  articles?: { id: number; title: string }[];
  trees?: { id: number; title: string; slug: string }[];
  defaultAuthor?: string;
}

const emptyFormData: DecisionTreeFormData = {
  title: "",
  description: "",
  topic: "",
  status: "Draft",
  sourceArticleId: null,
  nodes: [{ id: Date.now(), type: "question", text: "", image: "", options: [] }],
};

export default function DecisionTreeForm({ articles = [], trees = [], defaultAuthor = "" }: Props) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<DecisionTreeFormData>(emptyFormData);

  function updateField<K extends keyof DecisionTreeFormData>(
    name: K,
    value: DecisionTreeFormData[K]
  ) {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/decision-trees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          topic: formData.topic,
          status: formData.status,
          author: defaultAuthor,
          sourceArticleId: formData.sourceArticleId,
          nodes: formData.nodes.map((node, index) => ({
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
        throw new Error(result.error ?? "Failed to save decision tree.");
      }

      alert("Decision tree created successfully!");
      setFormData(emptyFormData);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="rounded-3xl bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-2xl font-bold">Details</h2>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-gray-700">Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="e.g. G9 TV Handling — Which fee applies?"
              className="w-full rounded-xl border p-4"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-gray-700">Description</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="One line describing what this tree helps the agent decide."
              className="w-full rounded-xl border p-4"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Topic</label>
            <input
              type="text"
              value={formData.topic}
              onChange={(e) => updateField("topic", e.target.value)}
              placeholder="e.g. G9, 3O, General"
              className="w-full rounded-xl border p-4"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Status</label>
            <select
              value={formData.status}
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
              value={formData.sourceArticleId ?? ""}
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
        nodes={formData.nodes}
        onChange={(nodes) => setFormData((prev) => ({ ...prev, nodes }))}
        trees={trees}
      />

      <section className="rounded-3xl bg-white p-8 shadow-sm">
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-red-700 px-8 py-3 font-semibold text-white hover:bg-red-800 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Decision Tree"}
          </button>
        </div>
      </section>
    </form>
  );
}
