"use client";

interface Props {
  text: string;
}

export default function CopyButton({
  text,
}: Props) {
  const copy = async () => {
    await navigator.clipboard.writeText(text);
  };

  return (
    <button
      onClick={copy}
      className="rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
    >
      Copy
    </button>
  );
}