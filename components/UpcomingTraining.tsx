const training = [

  {
    title: "Reservation Refresher",
    date: "08 July",
  },

  {
    title: "Refund Policy",
    date: "10 July",
  },

  {
    title: "Airport Operations",
    date: "14 July",
  },

];

export default function UpcomingTraining() {

  return (

    <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">

      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-2xl font-bold">

          Upcoming Training

        </h2>

        <button className="text-sm font-semibold text-red-700">

          View Calendar

        </button>

      </div>

      <div className="grid gap-5 lg:grid-cols-3">

        {training.map((course) => (

          <div
            key={course.title}
            className="rounded-2xl border border-gray-100 p-6"
          >

            <h3 className="font-semibold">

              {course.title}

            </h3>

            <p className="mt-3 text-gray-500">

              {course.date}

            </p>

          </div>

        ))}

      </div>

    </section>

  );

}