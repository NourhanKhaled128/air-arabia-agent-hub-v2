"use client";

import { useState } from "react";
import CurrencyCard from "./CurrencyCard";

function minutesBetween(departure: string, arrival: string) {
  const [dh, dm] = departure.split(":").map(Number);
  const [ah, am] = arrival.split(":").map(Number);

  let minutes = ah * 60 + am - (dh * 60 + dm);
  if (minutes < 0) minutes += 24 * 60;

  return minutes;
}

export default function FlightDurationCalculator() {
  const [departure, setDeparture] = useState("08:00");
  const [arrival, setArrival] = useState("11:30");

  const duration = () => {
    const minutes = minutesBetween(departure, arrival);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    return `${hours}h ${mins}m`;
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-200">

      <h2 className="mb-6 text-2xl font-bold text-red-700">
        Flight Duration Calculator
      </h2>

      <div className="grid gap-4 md:grid-cols-2">

        <div>
          <label className="mb-2 block text-sm text-gray-600">
            Departure time
          </label>

          <input
            type="time"
            value={departure}
            onChange={(e) => setDeparture(e.target.value)}
            className="w-full rounded-lg border p-3 text-black"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-gray-600">
            Arrival time
          </label>

          <input
            type="time"
            value={arrival}
            onChange={(e) => setArrival(e.target.value)}
            className="w-full rounded-lg border p-3 text-black"
          />
        </div>

      </div>

      <div className="mt-8">

        <CurrencyCard
          title="Flight Duration"
          value={duration()}
        />

      </div>

    </div>
  );
}
