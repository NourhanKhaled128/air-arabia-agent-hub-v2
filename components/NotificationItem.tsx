interface Props {
  title: string;
  message: string;
  time: string;
  unread: boolean;
}

export default function NotificationItem({
  title,
  message,
  time,
  unread,
}: Props) {
  return (
    <div
      className={`rounded-xl border p-4 transition ${
        unread
          ? "border-red-300 bg-red-50"
          : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-center justify-between">

        <h3 className="font-bold text-black">
          {title}
        </h3>

        {unread && (
          <div className="h-3 w-3 rounded-full bg-red-600"></div>
        )}

      </div>

      <p className="mt-2 text-sm text-gray-600">
        {message}
      </p>

      <p className="mt-3 text-xs text-gray-500">
        {time}
      </p>

    </div>
  );
}