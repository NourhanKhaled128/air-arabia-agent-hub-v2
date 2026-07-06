import AdminInput from "../AdminInput";
import AdminTextarea from "../AdminTextarea";
import AdminSelect from "../AdminSelect";

interface Course {
  title: string;
  description: string | null;
  duration: string | null;
  passingScore: number | null;
  status: string;
}

interface Props {
  action: (formData: FormData) => void;
  submitLabel?: string;
  course?: Course;
}

export default function CourseBuilder({
  action,
  submitLabel = "Save Course",
  course,
}: Props) {
  return (
    <form action={action} className="space-y-6">

      <AdminInput
        name="title"
        label="Course Title"
        placeholder="Reservations Fundamentals"
        defaultValue={course?.title}
        required
      />

      <AdminTextarea
        name="description"
        label="Description"
        placeholder="Course description..."
        defaultValue={course?.description ?? ""}
      />

      <AdminInput
        name="duration"
        label="Duration"
        placeholder="3 Hours"
        defaultValue={course?.duration ?? ""}
      />

      <AdminInput
        type="number"
        name="passingScore"
        label="Passing Score (%)"
        placeholder="80"
        defaultValue={course?.passingScore ?? undefined}
      />

      <AdminSelect
        name="status"
        label="Status"
        defaultValue={course?.status ?? "Draft"}
        options={[
          { label: "Draft", value: "Draft" },
          { label: "Published", value: "Published" },
        ]}
      />

      <button
        type="submit"
        className="rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800"
      >
        {submitLabel}
      </button>

    </form>
  );
}
