interface ResultBadgeProps {
  text: string;
}

export default function ResultBadge({ text }: ResultBadgeProps) {
  return (
    <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
      {text}
    </span>
  );
}