import CopyButton from "./CopyButton";
import ResultBadge from "./ResultBadge";

interface Props {
  code: string;
  city: string;
  airport: string;
  country: string;
}

export default function AirportCard({
  code,
  city,
  airport,
  country,
}: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow hover:shadow-lg transition">

      <div className="flex items-center justify-between">

        <h2 className="text-3xl font-bold text-red-700">
          {code}
        </h2>

        <CopyButton text={code} />

      </div>

      <div className="mt-4 space-y-2">

        <p className="font-semibold text-black">
          {city}
        </p>

        <p className="text-gray-600">
          {airport}
        </p>

        <ResultBadge text={country} />

      </div>

    </div>
  );
}