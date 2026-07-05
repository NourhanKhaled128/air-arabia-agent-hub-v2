"use client";

import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";

export default function TimeConverter() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("--:--");

  useEffect(() => {
    if (input.length !== 4) {
      setResult("--:--");
      return;
    }

    const hour = Number(input.substring(0, 2));
    const minute = Number(input.substring(2, 4));

    if (
      isNaN(hour) ||
      isNaN(minute) ||
      hour < 0 ||
      hour > 23 ||
      minute < 0 ||
      minute > 59
    ) {
      setResult("Invalid");
      return;
    }

    const period = hour >= 12 ? "PM" : "AM";

    let h = hour % 12;

    if (h === 0) h = 12;

    setResult(`${h}:${minute.toString().padStart(2, "0")} ${period}`);
  }, [input]);

  return (
    <section className="h-[360px] rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">

      {/* Header */}

      <div className="flex items-center gap-4">

        <div className="rounded-xl bg-red-100 p-3">

          <Clock3 className="text-red-700" size={24} />

        </div>

        <div>

          <h2 className="text-2xl font-bold text-red-700">

            Time Converter

          </h2>

          <p className="text-sm text-gray-500">

            24-Hour → 12-Hour Format

          </p>

        </div>

      </div>

      {/* Input */}

      <div className="mt-6">

        <label className="mb-2 block font-semibold text-gray-800">

          Enter Time (24H)

        </label>

        <input
          type="text"
          inputMode="numeric"
          maxLength={4}
          value={input}
          onChange={(e) =>
            setInput(e.target.value.replace(/\D/g, ""))
          }
          placeholder="2230"
          className="w-full rounded-xl border border-gray-300 px-5 py-3 text-center text-2xl font-bold tracking-normal outline-none transition focus:border-red-700"
        />

      </div>

      {/* Result */}

      <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 py-5 text-center">

        <p className="text-gray-500">

          Converted Time

        </p>

        <h2 className="mt-2 text-4xl font-bold text-red-700">

          {result}

        </h2>

      </div>

    </section>
  );
}