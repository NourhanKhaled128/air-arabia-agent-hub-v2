interface Props {
  data: {
    overview: string;
  };

  updateField: (
    name: string,
    value: string
  ) => void;
}

export default function OverviewSection({
  data,
  updateField,
}: Props) {
  return (
    <section className="rounded-3xl bg-white p-8 shadow-sm">

      <h2 className="mb-6 text-2xl font-bold">
        Overview
      </h2>

      <textarea
        rows={12}
        value={data.overview}
        onChange={(e) =>
          updateField("overview", e.target.value)
        }
        className="w-full rounded-xl border border-gray-300 p-4"
        placeholder="Write the article overview..."
      />

    </section>
  );
}