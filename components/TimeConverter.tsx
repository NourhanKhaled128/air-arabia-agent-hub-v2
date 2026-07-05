"use client";

import React, { useState } from "react";
import { Clock3 } from "lucide-react";

export default function TimeConverter() {
  const [time24, setTime24] = useState("");
  const [result, setResult] = useState("--:--");

  const convertTime = (value: string) => {
    setTime24(value);

    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;

    if (!regex.test(value)) {
      setResult("--:--");
      return;
    }

    const [hourString, minute] = value.split(":");
    let hour = parseInt(hourString);

    const period = hour >= 12 ? "PM" : "AM";

    hour = hour % 12;
    if (hour === 0) hour = 12;

    setResult(`${hour}:${minute} ${period}`);
  };

  const clear = () => {
    setTime24("");
    setResult("--:--");
  };

  const copyResult = async () => {
    if (result !== "--:--") {
      await navigator.clipboard.writeText(result);
    }
  };

  return (
    <div className="rounded-3xl bg-white p-6 shadow-lg h-[420px]">

      {/* Header */}

      <div className="flex items-center gap-3 mb-5">

        <div className="h-12 w-12 rounded-xl bg-red-100 flex items-center justify-center">
          <Clock3 className="h-6 w-6 text-red-700" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-red-700">
            Time Converter
          </h2>

          <p className="text-sm text-gray-600">
            24-Hour → 12-Hour Format
          </p>
        </div>

      </div>

      {/* Input */}

      <div className="rounded-xl border border-gray-200 p-4">

        <label className="block mb-2 font-semibold text-black">
          Enter Time (24H)
        </label>

        <input
          type="text"
          value={time24}
          onChange={(e) => convertTime(e.target.value)}
          placeholder="23:30"
          className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-2xl font-bold text-black outline-none focus:border-red-600"
        />

        <p className="mt-2 text-sm text-gray-500">
          Format: HH:MM
        </p>

      </div>

      {/* Arrow */}

      <div className="flex justify-center my-5">

        <div className="h-12 w-12 rounded-full bg-red-700 text-white flex items-center justify-center text-xl shadow">
          ↓
        </div>

      </div>

      {/* Result */}

<div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6 text-center">

<h3 className="text-lg font-semibold text-gray-700">
Converted Time
</h3>

<p className="mt-3 text-4xl font-bold text-red-700">
{result}
</p>

</div>
   
    </div>
  );
}