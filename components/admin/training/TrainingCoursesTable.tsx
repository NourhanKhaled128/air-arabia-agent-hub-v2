"use client";

import AdminListTable from "@/components/admin/AdminListTable";
import AdminBadge from "@/components/admin/AdminBadge";
import CourseRowActions from "./CourseRowActions";
import { deleteManyTrainingCoursesAction } from "@/app/admin/actions/training-actions";

interface Course {
  id: number;
  title: string;
  description: string | null;
  duration: string | null;
  passingScore: number | null;
  status: string;
  lessons: { id: number }[];
}

interface Props {
  courses: Course[];
}

export default function TrainingCoursesTable({ courses }: Props) {
  return (
    <AdminListTable
      columns={[
        { key: "title", label: "Course" },
        { key: "duration", label: "Duration" },
        { key: "lessons", label: "Lessons" },
        { key: "passingScore", label: "Passing Score" },
        { key: "status", label: "Status" },
      ]}
      data={courses}
      searchPlaceholder="Search courses..."
      searchFn={(course, query) => {
        const q = query.toLowerCase();
        return (
          course.title.toLowerCase().includes(q) ||
          (course.description ?? "").toLowerCase().includes(q)
        );
      }}
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
      filterFn={(course, values) => {
        if (values.status && course.status !== values.status) return false;
        return true;
      }}
      onDeleteMany={deleteManyTrainingCoursesAction}
      emptyMessage="No courses yet."
      renderRow={(course) => (
        <>
          <td className="px-6 py-5 font-semibold">
            {course.title}
          </td>

          <td className="px-6 py-5">
            {course.duration ?? "-"}
          </td>

          <td className="px-6 py-5">
            {course.lessons.length}
          </td>

          <td className="px-6 py-5">
            {course.passingScore != null ? `${course.passingScore}%` : "-"}
          </td>

          <td className="px-6 py-5">
            <AdminBadge color={course.status === "Published" ? "green" : "gray"}>
              {course.status}
            </AdminBadge>
          </td>

          <td className="px-6 py-5">
            <CourseRowActions id={course.id} />
          </td>
        </>
      )}
    />
  );
}
