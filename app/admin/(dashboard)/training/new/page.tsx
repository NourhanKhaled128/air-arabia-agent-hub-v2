import CourseBuilder from "@/components/admin/training/CourseBuilder";
import { createTrainingCourseAction } from "@/app/admin/actions/training-actions";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

export default function NewCoursePage() {
  return (
    <div className="space-y-8">

      <AdminPageHeader title="New Course" />

      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <CourseBuilder action={createTrainingCourseAction} />
      </div>

    </div>
  );
}
