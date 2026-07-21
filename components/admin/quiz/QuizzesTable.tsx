"use client";

import AdminListTable from "@/components/admin/AdminListTable";
import AdminBadge from "@/components/admin/AdminBadge";
import QuizRowActions from "./QuizRowActions";
import { deleteManyQuizzesAction } from "@/app/admin/actions/quiz-actions";

interface QuizRow {
  id: number;
  title: string;
  status: string;
  timeLimitMinutes: number;
  questionCount: number;
  attemptCount: number;
  avgScore: number | null;
}

interface Props {
  quizzes: QuizRow[];
}

export default function QuizzesTable({ quizzes }: Props) {
  return (
    <AdminListTable
      columns={[
        { key: "title", label: "Title" },
        { key: "status", label: "Status" },
        { key: "time", label: "Time Limit" },
        { key: "questions", label: "Questions" },
        { key: "attempts", label: "Attempts" },
        { key: "avg", label: "Avg. Score" },
      ]}
      data={quizzes}
      searchPlaceholder="Search quizzes..."
      searchFn={(item, query) => item.title.toLowerCase().includes(query.toLowerCase())}
      filters={[
        {
          key: "status",
          label: "Status",
          options: [
            { value: "Published", label: "Published" },
            { value: "Draft", label: "Draft" },
          ],
        },
      ]}
      filterFn={(item, values) => {
        if (values.status && item.status !== values.status) return false;
        return true;
      }}
      onDeleteMany={deleteManyQuizzesAction}
      emptyMessage="No quizzes yet."
      renderRow={(item) => (
        <>
          <td className="px-6 py-5 font-semibold">{item.title}</td>

          <td className="px-6 py-5">
            <AdminBadge color={item.status === "Published" ? "green" : "gray"}>
              {item.status}
            </AdminBadge>
          </td>

          <td className="px-6 py-5">{item.timeLimitMinutes} min</td>
          <td className="px-6 py-5">{item.questionCount}</td>
          <td className="px-6 py-5">{item.attemptCount}</td>
          <td className="px-6 py-5">{item.avgScore != null ? `${item.avgScore}%` : "-"}</td>

          <td className="px-6 py-5">
            <QuizRowActions id={item.id} status={item.status} />
          </td>
        </>
      )}
    />
  );
}
