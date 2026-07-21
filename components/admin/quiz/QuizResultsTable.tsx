"use client";

import { Fragment, useState, useTransition } from "react";
import { Download, Trash2 } from "lucide-react";
import AdminBadge from "@/components/admin/AdminBadge";
import { deleteAttemptAction } from "@/app/admin/actions/quiz-actions";

interface Attempt {
  id: number;
  name: string;
  email: string;
  previousClassFeedback: string | null;
  score: number;
  totalPoints: number;
  percentage: number;
  passed: boolean;
  timeTakenSeconds: number;
  submittedAt: Date;
}

interface Props {
  quizId: number;
  quizTitle: string;
  attempts: Attempt[];
}

function formatDate(date: Date) {
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

function toCsvValue(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

export default function QuizResultsTable({ quizId, quizTitle, attempts }: Props) {
  const [isPending, startTransition] = useTransition();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  function handleDelete(id: number) {
    if (!confirm("Delete this submission permanently?")) return;

    startTransition(async () => {
      try {
        await deleteAttemptAction(id, quizId);
      } catch (error) {
        console.error(error);
        alert("Operation failed.");
      }
    });
  }

  function exportCsv() {
    const header = [
      "Name",
      "Email",
      "Score",
      "Total",
      "Percentage",
      "Passed",
      "Time Taken (s)",
      "Submitted At",
      "Feedback on Previous Class",
    ];

    const rows = attempts.map((a) => [
      a.name,
      a.email,
      String(a.score),
      String(a.totalPoints),
      `${Math.round(a.percentage)}%`,
      a.passed ? "Yes" : "No",
      String(a.timeTakenSeconds),
      formatDate(a.submittedAt),
      a.previousClassFeedback ?? "",
    ]);

    const csv = [header, ...rows]
      .map((row) => row.map((cell) => toCsvValue(cell)).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${quizTitle.replace(/[^a-z0-9]+/gi, "-")}-results.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={exportCsv}
          disabled={attempts.length === 0}
          className="flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2.5 font-semibold text-gray-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto rounded-3xl bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr className="text-left text-sm">
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Score</th>
              <th className="px-6 py-4">Result</th>
              <th className="px-6 py-4">Time Taken</th>
              <th className="px-6 py-4">Submitted</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {attempts.map((a) => (
              <Fragment key={a.id}>
                <tr className="border-t">
                  <td className="px-6 py-5 font-semibold">{a.name}</td>
                  <td className="px-6 py-5">{a.email}</td>
                  <td className="px-6 py-5">
                    {a.score}/{a.totalPoints} ({Math.round(a.percentage)}%)
                  </td>
                  <td className="px-6 py-5">
                    <AdminBadge color={a.passed ? "green" : "red"}>
                      {a.passed ? "Passed" : "Failed"}
                    </AdminBadge>
                  </td>
                  <td className="px-6 py-5">{formatDuration(a.timeTakenSeconds)}</td>
                  <td className="px-6 py-5">{formatDate(a.submittedAt)}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      {a.previousClassFeedback && (
                        <button
                          onClick={() => setExpandedId(expandedId === a.id ? null : a.id)}
                          className="rounded-lg border px-3 py-2 text-xs font-semibold hover:bg-slate-50"
                        >
                          {expandedId === a.id ? "Hide" : "Feedback"}
                        </button>
                      )}
                      <button
                        disabled={isPending}
                        onClick={() => handleDelete(a.id)}
                        className="rounded-lg border p-2 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedId === a.id && a.previousClassFeedback && (
                  <tr className="border-t bg-slate-50">
                    <td colSpan={7} className="px-6 py-4 text-sm text-slate-600">
                      <span className="font-semibold">Feedback on previous class: </span>
                      {a.previousClassFeedback}
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}

            {attempts.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-slate-500">
                  No submissions yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
