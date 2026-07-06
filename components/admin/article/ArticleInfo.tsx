interface Props {
  data: {
    title: string;
    category: string;
    description: string;
    author: string;
  };

  updateField: (
    name: string,
    value: string
  ) => void;
}

export default function ArticleInfo({
  data,
  updateField,
}: Props) {
  return (
    <section className="rounded-3xl bg-white p-8 shadow-sm">

      <h2 className="mb-8 text-2xl font-bold">
        Article Information
      </h2>

      <div className="grid gap-6 lg:grid-cols-2">

        <div>

          <label className="mb-2 block font-semibold">
            Title
          </label>

          <input
            value={data.title}
            onChange={(e) =>
              updateField("title", e.target.value)
            }
            className="w-full rounded-xl border border-gray-300 p-3"
          />

        </div>

        <div>

          <label className="mb-2 block font-semibold">
            Category
          </label>

          <select
            value={data.category}
            onChange={(e) =>
              updateField("category", e.target.value)
            }
            className="w-full rounded-xl border border-gray-300 p-3"
          >
            <option value="">Select Category</option>
            <option>Reservations</option>
            <option>Refunds</option>
            <option>Payments</option>
            <option>Systems</option>
            <option>Training</option>
            <option>AirRewards</option>
          </select>

        </div>

      </div>

      <div className="mt-6">

        <label className="mb-2 block font-semibold">
          Author
        </label>

        <input
          value={data.author}
          onChange={(e) =>
            updateField("author", e.target.value)
          }
          className="w-full rounded-xl border border-gray-300 p-3"
        />

      </div>

      <div className="mt-6">

        <label className="mb-2 block font-semibold">
          Description
        </label>

        <textarea
          rows={4}
          value={data.description}
          onChange={(e) =>
            updateField("description", e.target.value)
          }
          className="w-full rounded-xl border border-gray-300 p-4"
        />

      </div>

    </section>
  );
}