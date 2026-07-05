"use client";

const airports = [
  "SHJ",
  "CAI",
  "JED",
  "RUH",
  "DXB",
  "KWI",
  "DOH",
  "BAH",
  "AMM",
  "MED",
  "DMM",
  "ELQ",
];

export default function AirportSection() {
  return (
    <section className="rounded-3xl bg-white p-8 shadow-sm">

      <h2 className="mb-6 text-2xl font-bold">
        Applicable Airports
      </h2>

      <p className="mb-6 text-gray-500">
        Select airports where this procedure applies.
      </p>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">

        {airports.map((airport) => (

          <label
            key={airport}
            className="flex items-center gap-3 rounded-xl border p-4 hover:bg-red-50"
          >

            <input type="checkbox" />

            <span className="font-medium">
              {airport}
            </span>

          </label>

        ))}

      </div>

    </section>
  );
}