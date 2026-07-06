"use client";

interface Props {
  onSaveDraft?: () => void;
  onPublish?: () => void;
}

export default function PublishActions({
  onSaveDraft,
  onPublish,
}: Props) {
  return (
    <div className="flex justify-end gap-4">

      <button
        onClick={onSaveDraft}
        className="rounded-xl border px-6 py-3 font-semibold hover:bg-slate-50"
      >
        Save Draft
      </button>

      <button
        onClick={onPublish}
        className="rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800"
      >
        Publish
      </button>

    </div>
  );
}