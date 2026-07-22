"use client";

import { useRef, useTransition } from "react";
import Link from "next/link";
import { Trash2, Star } from "lucide-react";
import {
  createQualityReviewAction,
  deleteQualityReviewAction,
} from "@/app/admin/actions/quality-review-actions";

interface Agent {
  id: number;
  name: string;
  email: string;
}

interface QualityReview {
  id: number;
  rating: number;
  comment: string;
  reviewerName: string;
  createdAt: Date;
  portalUser: Agent;
}

interface Props {
  agents: Agent[];
  reviews: QualityReview[];
  canManage: boolean;
}

export default function QualityFeedbackManager({ agents, reviews, canManage }: Props) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(formData: FormData) {
    const portalUserId = Number(formData.get("portalUserId"));

    if (!Number.isInteger(portalUserId) || portalUserId <= 0) {
      alert("Please select an agent.");
      return;
    }

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

  function handleDelete(id: number, portalUserId: number) {
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
    <div className="space-y-8">
      {canManage && (
        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold">Add Quality Review</h2>

          <form ref={formRef} action={handleSubmit} className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <label className="font-semibold text-slate-700">Agent</label>
              <select
                name="portalUserId"
                required
                defaultValue=""
                className="min-w-[16rem] rounded-lg border border-slate-300 px-3 py-2"
              >
                <option value="" disabled>
                  Select an agent...
                </option>
                {agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name} ({agent.email})
                  </option>
                ))}
              </select>

              <label className="font-semibold text-slate-700">Rating</label>
              <select
                name="rating"
                required
                defaultValue=""
                className="rounded-lg border border-slate-300 px-3 py-2"
              >
                <option value="" disabled>
                  Select...
                </option>
                <option value="1">1 - Poor</option>
                <option value="2">2 - Below Average</option>
                <option value="3">3 - Average</option>
                <option value="4">4 - Good</option>
                <option value="5">5 - Excellent</option>
              </select>
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
        </section>
      )}

      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold">All Quality Reviews ({reviews.length})</h2>

        {reviews.length === 0 ? (
          <p className="text-slate-500">No quality reviews yet.</p>
        ) : (
          <ul className="space-y-3">
            {reviews.map((r) => (
              <li key={r.id} className="rounded-xl border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link
                      href={`/admin/portal-users/${r.portalUser.id}/activity`}
                      className="font-semibold text-slate-900 hover:text-red-700"
                    >
                      {r.portalUser.name}
                    </Link>
                    <span className="ml-3 inline-flex items-center gap-1 font-bold text-amber-600">
                      <Star size={16} fill="currentColor" />
                      {r.rating}/5
                    </span>
                    <p className="mt-1 text-slate-800">{r.comment}</p>
                    <p className="mt-2 text-sm text-slate-500">
                      {r.reviewerName} · {new Date(r.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {canManage && (
                    <button
                      disabled={isPending}
                      onClick={() => handleDelete(r.id, r.portalUser.id)}
                      title="Delete"
                      className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
