import {
  Trophy,
  Medal,
  Star,
} from "lucide-react";

const contributors = [
  {
    id: 1,
    name: "Administrator",
    articles: 148,
  },
  {
    id: 2,
    name: "Reservations Supervisor",
    articles: 83,
  },
  {
    id: 3,
    name: "Training Manager",
    articles: 61,
  },
  {
    id: 4,
    name: "Quality Team",
    articles: 44,
  },
];

export default function TopContributorsPage() {
  return (
    <div className="space-y-8">

      <div>

        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-700">
          Dashboard
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          Top Contributors
        </h1>

      </div>

      <div className="space-y-5">

        {contributors.map((user, index) => (

          <div
            key={user.id}
            className="rounded-3xl bg-white p-6 shadow-sm flex items-center justify-between"
          >

            <div className="flex items-center gap-5">

              <div className="rounded-2xl bg-red-100 p-4">

                {index === 0 ? (
                  <Trophy className="text-red-700" />
                ) : index === 1 ? (
                  <Medal className="text-blue-700" />
                ) : (
                  <Star className="text-amber-600" />
                )}

              </div>

              <div>

                <h2 className="font-bold text-lg">
                  {user.name}
                </h2>

                <p className="text-slate-500">
                  Knowledge Contributor
                </p>

              </div>

            </div>

            <div className="text-right">

              <h2 className="text-3xl font-bold">
                {user.articles}
              </h2>

              <p className="text-slate-500">
                Articles
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}