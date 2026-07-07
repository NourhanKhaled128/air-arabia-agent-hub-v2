interface Props {
  author?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function ArticleMetadataCard({
  author,
  createdAt,
  updatedAt,
}: Props) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-xl font-bold">
        Metadata
      </h2>

      <div className="space-y-4">

        <div className="flex justify-between">
          <span className="text-slate-500">
            Author
          </span>

          <span className="font-semibold">
            {author ?? "-"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-500">
            Created
          </span>

          <span className="font-semibold">
            {createdAt ?? "-"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-500">
            Updated
          </span>

          <span className="font-semibold">
            {updatedAt ?? "-"}
          </span>
        </div>

      </div>

    </div>
  );
}
