import { getTrainingCourses } from "@/lib/training-service";

export default async function UpcomingTraining() {

  const courses = (await getTrainingCourses())
    .filter((course) => course.status === "Published")
    .slice(0, 3);

  return (

    <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">

      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-2xl font-bold">

          Available Training

        </h2>

      </div>

      {courses.length === 0 ? (

        <p className="text-gray-500">No published training courses yet.</p>

      ) : (

        <div className="grid gap-5 lg:grid-cols-3">

          {courses.map((course) => (

            <div
              key={course.id}
              className="rounded-2xl border border-gray-100 p-6"
            >

              <h3 className="font-semibold">

                {course.title}

              </h3>

              <p className="mt-3 text-gray-500">

                {course.duration ?? "Self-paced"} · {course.lessons.length} lesson{course.lessons.length === 1 ? "" : "s"}

              </p>

            </div>

          ))}

        </div>

      )}

    </section>

  );

}
