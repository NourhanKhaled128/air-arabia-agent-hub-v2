import { notFound } from "next/navigation";
import CourseBuilder from "@/components/admin/training/CourseBuilder";
import { getTrainingCourse } from "@/lib/training-service";
import { updateTrainingCourseAction } from "@/app/admin/actions/training-actions";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditCoursePage({ params }: Props) {
  const { id } = await params;
  const courseId = Number(id);

  if (!Number.isInteger(courseId)) {
    notFound();
  }

  const course = await getTrainingCourse(courseId);

  if (!course) {
    notFound();
  }

  const boundUpdate = updateTrainingCourseAction.bind(null, courseId);

  return (
    <div className="space-y-8">

      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-700">
          Administration
        </p>

        <h1 className="mt-2 text-4xl font-bold text-slate-900">
          Edit Course
        </h1>
      </div>

      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <CourseBuilder
          action={boundUpdate}
          submitLabel="Save Changes"
          course={course}
        />
      </div>

      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <h2 className="mb-4 text-xl font-bold text-slate-900">
          Lessons ({course.lessons.length})
        </h2>

        {course.lessons.length === 0 && (
          <p className="text-slate-500">No lessons added yet.</p>
        )}

        {course.lessons.length > 0 && (
          <ol className="list-decimal space-y-2 pl-5">
            {course.lessons
              .sort((a, b) => a.order - b.order)
              .map((lesson) => (
                <li key={lesson.id} className="font-medium text-slate-800">
                  {lesson.title}
                </li>
              ))}
          </ol>
        )}
      </div>

    </div>
  );
}
