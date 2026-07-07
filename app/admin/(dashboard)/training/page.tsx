import Link from "next/link";
import {
  GraduationCap,
  BookOpen,
  Award,
  Plus,
} from "lucide-react";
import { getTrainingCourses } from "@/lib/training-service";
import CourseRowActions from "@/components/admin/training/CourseRowActions";

export default async function TrainingPage() {
  const courses = await getTrainingCourses();

  const totalLessons = courses.reduce(
    (sum, course) => sum + course.lessons.length,
    0
  );
  const published = courses.filter((c) => c.status === "Published").length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-700">
            Administration
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Training Center
          </h1>

          <p className="mt-3 text-slate-500">
            Manage training courses, lessons and quizzes.
          </p>
        </div>

        <Link
          href="/admin/training/new"
          className="flex items-center gap-2 rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800"
        >
          <Plus size={18} />
          New Course
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <GraduationCap className="mb-4 text-red-700" />
          <p className="text-sm text-slate-500">Courses</p>
          <h2 className="mt-2 text-3xl font-bold">{courses.length}</h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <BookOpen className="mb-4 text-blue-700" />
          <p className="text-sm text-slate-500">Lessons</p>
          <h2 className="mt-2 text-3xl font-bold">{totalLessons}</h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <Award className="mb-4 text-amber-600" />
          <p className="text-sm text-slate-500">Published</p>
          <h2 className="mt-2 text-3xl font-bold">{published}</h2>
        </div>
      </div>

      <div className="overflow-x-auto rounded-3xl bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left">Course</th>
              <th className="px-6 py-4 text-left">Duration</th>
              <th className="px-6 py-4 text-left">Lessons</th>
              <th className="px-6 py-4 text-left">Passing Score</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className="border-t">
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
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${
                      course.status === "Published"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {course.status}
                  </span>
                </td>

                <td className="px-6 py-5">
                  <CourseRowActions id={course.id} />
                </td>
              </tr>
            ))}

            {courses.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-slate-500">
                  No courses yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
