interface Props {
  title: string;
  value: string;
}

export default function CurrencyCard({ title, value }: Props) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow">

      <p className="text-sm text-gray-500">
        {title}
      </p>

      <h2 className="mt-2 text-3xl font-bold text-red-700">
        {value}
      </h2>

    </div>
  );
}