import Link from "next/link";
import {
  GraduationCap,
  BookOpen,
  Award,
  Plus,
} from "lucide-react";
import { getTrainingCourses } from "@/lib/training-service";
import TrainingCoursesTable from "@/components/admin/training/TrainingCoursesTable";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminStatCard from "@/components/admin/AdminStatCard";

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
        description="Manage training courses and lessons."
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

      <TrainingCoursesTable courses={courses} />
    </div>
  );
}
