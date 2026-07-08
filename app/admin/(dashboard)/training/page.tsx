import Link from "next/link";
import {
  GraduationCap,
  BookOpen,
  Award,
  Plus,
} from "lucide-react";
import { getTrainingCourses } from "@/lib/training-service";
import { deleteManyTrainingCoursesAction } from "@/app/admin/actions/training-actions";
import CourseRowActions from "@/components/admin/training/CourseRowActions";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminStatCard from "@/components/admin/AdminStatCard";
import AdminBadge from "@/components/admin/AdminBadge";
import AdminListTable from "@/components/admin/AdminListTable";

export default async function TrainingPage() {
  const courses = await getTrainingCourses();

  const totalLessons = courses.reduce(
    (sum, course) => sum + course.lessons.length,
    0
  );
  const published = courses.filter((c) => c.status === "Published").length;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Training Center"
        description="Manage training courses, lessons and quizzes."
        actions={
          <Link
            href="/admin/training/new"
            className="flex items-center gap-2 rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800"
          >
            <Plus size={18} />
            New Course
          </Link>
        }
      />

      <div className="grid gap-6 md:grid-cols-3">
        <AdminStatCard title="Courses" value={courses.length} icon={GraduationCap} />
        <AdminStatCard title="Lessons" value={totalLessons} icon={BookOpen} color="text-blue-700" />
        <AdminStatCard title="Published" value={published} icon={Award} color="text-amber-600" />
      </div>

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
    </div>
  );
}
