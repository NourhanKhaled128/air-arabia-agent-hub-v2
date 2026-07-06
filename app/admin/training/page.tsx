import Link from "next/link";
import {
  GraduationCap,
  BookOpen,
  ClipboardCheck,
  Award,
  Plus,
  Pencil,
  Trash2,
  Eye,
} from "lucide-react";

const courses = [
  {
    id: 1,
    title: "Reservations Fundamentals",
    category: "Reservations",
    lessons: 14,
    quizzes: 4,
    status: "Published",
  },
  {
    id: 2,
    title: "Refunds & ADM",
    category: "Refunds",
    lessons: 10,
    quizzes: 3,
    status: "Published",
  },
  {
    id: 3,
    title: "Payments & EMD",
    category: "Payments",
    lessons: 8,
    quizzes: 2,
    status: "Draft",
  },
];

export default function TrainingPage() {
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

        <button className="flex items-center gap-2 rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800">
          <Plus size={18} />
          New Course
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <GraduationCap className="mb-4 text-red-700" />
          <p className="text-sm text-slate-500">Courses</p>
          <h2 className="mt-2 text-3xl font-bold">18</h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <BookOpen className="mb-4 text-blue-700" />
          <p className="text-sm text-slate-500">Lessons</p>
          <h2 className="mt-2 text-3xl font-bold">246</h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <ClipboardCheck className="mb-4 text-emerald-700" />
          <p className="text-sm text-slate-500">Quizzes</p>
          <h2 className="mt-2 text-3xl font-bold">59</h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <Award className="mb-4 text-amber-600" />
          <p className="text-sm text-slate-500">Certificates</p>
          <h2 className="mt-2 text-3xl font-bold">124</h2>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left">Course</th>
              <th className="px-6 py-4 text-left">Category</th>
              <th className="px-6 py-4 text-left">Lessons</th>
              <th className="px-6 py-4 text-left">Quizzes</th>
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
                  {course.category}
                </td>

                <td className="px-6 py-5">
                  {course.lessons}
                </td>

                <td className="px-6 py-5">
                  {course.quizzes}
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
                  <div className="flex gap-2">
                    <button className="rounded-lg border p-2 hover:bg-slate-50">
                      <Eye size={18} />
                    </button>

                    <button className="rounded-lg border p-2 hover:bg-slate-50">
                      <Pencil size={18} />
                    </button>

                    <button className="rounded-lg border p-2 hover:bg-slate-50">
                      <Trash2 size={18} />
                    </button>

                    <Link
                      href={`/admin/training/${course.id}`}
                      className="rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-slate-50"
                    >
                      Open
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}