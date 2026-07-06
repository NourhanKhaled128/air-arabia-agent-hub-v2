"use client";

import { useState } from "react";
import CurrencyCard from "./CurrencyCard";

function minutesBetween(arrival: string, departure: string) {
  const [ah, am] = arrival.split(":").map(Number);
  const [dh, dm] = departure.split(":").map(Number);

  let minutes = dh * 60 + dm - (ah * 60 + am);
  if (minutes < 0) minutes += 24 * 60;

  return minutes;
}

function statusFor(minutes: number) {
  if (minutes < 60) return "Tight";
  if (minutes <= 180) return "Adequate";
  return "Long";
}

export default function LayoverCalculator() {
  const [arrival, setArrival] = useState("10:00");
  const [departure, setDeparture] = useState("12:00");

  const minutes = minutesBetween(arrival, departure);
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-200">

      <h2 className="mb-6 text-2xl font-bold text-red-700">
        Layover Calculator
      </h2>

      <div className="grid gap-4 md:grid-cols-2">

        <div>
          <label className="mb-2 block text-sm text-gray-600">
            Arrival time (connecting airport)
          </label>

          <input
            type="time"
            value={arrival}
            onChange={(e) => setArrival(e.target.value)}
            className="w-full rounded-lg border p-3 text-black"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-gray-600">
            Next departure time
          </label>

          <input
            type="time"
            value={departure}
            onChange={(e) => setDeparture(e.target.value)}
            className="w-full rounded-lg border p-3 text-black"
          />
        </div>

      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">

        <CurrencyCard
          title="Layover Duration"
          value={`${hours}h ${mins}m`}
        />

        <CurrencyCard
          title="Status"
          value={statusFor(minutes)}
        />

      </div>

    </div>
  );
}
