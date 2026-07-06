interface Props {
  loading: boolean;
}

export default function PublishSection({
  loading,
}: Props) {
  return (
    <section className="rounded-3xl bg-white p-8 shadow-sm">

      <div className="flex justify-end">

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-red-700 px-8 py-3 font-semibold text-white hover:bg-red-800 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Draft"}
        </button>

      </div>

    </section>
  );
}