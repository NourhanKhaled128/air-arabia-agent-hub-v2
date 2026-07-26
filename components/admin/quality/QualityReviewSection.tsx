"use client";

import { useRef, useState, useTransition } from "react";
import { Trash2, Star, Pencil } from "lucide-react";
import {
  createQualityReviewAction,
  updateQualityReviewAction,
  deleteQualityReviewAction,
} from "@/app/admin/actions/quality-review-actions";

interface QualityReview {
  id: number;
  rating: number;
  comment: string;
  reviewerName: string;
  createdAt: Date;
}

interface Props {
  portalUserId: number;
  reviews: QualityReview[];
  canManage: boolean;
}

export default function QualityReviewSection({ portalUserId, reviews, canManage }: Props) {
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<number | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await createQualityReviewAction(portalUserId, formData);
        formRef.current?.reset();
      } catch (error) {
        console.error(error);
        alert("Could not save the quality review.");
      }
    });
  }

  function handleUpdate(id: number, formData: FormData) {
    startTransition(async () => {
      try {
        await updateQualityReviewAction(id, portalUserId, formData);
        setEditingId(null);
      } catch (error) {
        console.error(error);
        alert("Could not update the quality review.");
      }
    });
  }

  function handleDelete(id: number) {
    if (!confirm("Delete this quality review permanently?")) return;
    startTransition(async () => {
      try {
        await deleteQualityReviewAction(id, portalUserId);
      } catch (error) {
        console.error(error);
        alert("Could not delete the quality review.");
      }
    });
  }

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-bold">Quality Feedback ({reviews.length})</h2>

      {canManage && (
        <form
          ref={formRef}
          action={handleSubmit}
          className="mb-6 space-y-3 rounded-xl border border-slate-200 p-4"
        >
          <div className="flex items-center gap-3">
            <label className="font-semibold text-slate-700">Score (0-100)</label>
            <input
              type="number"
              name="rating"
              required
              min={0}
              max={100}
              step={0.1}
              placeholder="92"
              className="w-28 rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>

          <textarea
            name="comment"
            required
            rows={3}
            placeholder="Notes on this agent's quality..."
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />

          <button
            type="submit"
            disabled={isPending}
            className="rounded-xl bg-red-700 px-5 py-2.5 font-semibold text-white hover:bg-red-800 disabled:opacity-50"
          >
            Add Quality Review
          </button>
        </form>
      )}

      {reviews.length === 0 ? (
        <p className="text-slate-500">No quality reviews yet.</p>
      ) : (
        <ul className="space-y-3">
          {reviews.map((r) =>
            editingId === r.id ? (
              <li key={r.id} className="rounded-xl border border-red-200 p-4">
                <form
                  action={(formData) => handleUpdate(r.id, formData)}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <label className="font-semibold text-slate-700">Score (0-100)</label>
                    <input
                      type="number"
                      name="rating"
                      required
                      min={0}
                      max={100}
                      step={0.1}
                      defaultValue={r.rating}
                      className="w-28 rounded-lg border border-slate-300 px-3 py-2"
                    />
                  </div>

                  <textarea
                    name="comment"
                    required
                    rows={3}
                    defaultValue={r.comment}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  />

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={isPending}
                      className="rounded-xl bg-red-700 px-5 py-2.5 font-semibold text-white hover:bg-red-800 disabled:opacity-50"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="rounded-xl border border-slate-300 px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </li>
            ) : (
              <li key={r.id} className="rounded-xl border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="flex items-center gap-1 font-bold text-amber-600">
                      <Star size={16} fill="currentColor" />
                      {r.rating}%
                    </span>
                    <p className="mt-1 text-slate-800">{r.comment}</p>
                    <p className="mt-2 text-sm text-slate-500">
                      {r.reviewerName} · {new Date(r.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {canManage && (
                    <div className="flex gap-1">
                      <button
                        disabled={isPending}
                        onClick={() => setEditingId(r.id)}
                        title="Edit"
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        disabled={isPending}
                        onClick={() => handleDelete(r.id)}
                        title="Delete"
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </li>
            )
          )}
        </ul>
      )}
    </section>
  );
}
