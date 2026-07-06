"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Article {
  id: number;
  title: string;
  category: string;
  description: string;
  overview: string;
  author: string;
  status: string;
}

interface Props {
  article: Article;
}

export default function EditArticleForm({
  article,
}: Props) {

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState(article);

  function update(
    key: keyof Article,
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function save() {

    setLoading(true);

    try {

      const response = await fetch(
        `/api/articles/${article.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error);
      }

      alert("Article updated successfully.");

      router.push("/admin/articles");

      router.refresh();

    } catch (error) {

      alert(
        error instanceof Error
          ? error.message
          : "Unknown error"
      );

    } finally {

      setLoading(false);

    }

  }

  return (
    <div className="space-y-8">

      <div className="rounded-3xl bg-white p-8 shadow-sm">

        <div className="grid gap-6">

          <input
            value={form.title}
            onChange={(e) =>
              update("title", e.target.value)
            }
            className="rounded-xl border p-3"
          />

          <input
            value={form.category}
            onChange={(e) =>
              update("category", e.target.value)
            }
            className="rounded-xl border p-3"
          />

          <textarea
            rows={4}
            value={form.description}
            onChange={(e) =>
              update("description", e.target.value)
            }
            className="rounded-xl border p-3"
          />

          <textarea
            rows={10}
            value={form.overview}
            onChange={(e) =>
              update("overview", e.target.value)
            }
            className="rounded-xl border p-3"
          />

          <input
            value={form.author}
            onChange={(e) =>
              update("author", e.target.value)
            }
            className="rounded-xl border p-3"
          />

          <select
            value={form.status}
            onChange={(e) =>
              update("status", e.target.value)
            }
            className="rounded-xl border p-3"
          >

            <option>Draft</option>

            <option>Published</option>

            <option>Archived</option>

          </select>

        </div>

      </div>

      <div className="flex justify-end">

        <button
          onClick={save}
          disabled={loading}
          className="rounded-xl bg-red-700 px-8 py-3 font-semibold text-white"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>

      </div>

    </div>
  );
}