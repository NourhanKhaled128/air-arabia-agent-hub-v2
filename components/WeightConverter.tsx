"use client";

import { useState } from "react";
import CurrencyCard from "./CurrencyCard";

const units = ["kg", "lb", "g", "oz"] as const;
type Unit = (typeof units)[number];

const toKg: Record<Unit, number> = {
  kg: 1,
  lb: 0.45359237,
  g: 0.001,
  oz: 0.028349523,
};

export default function WeightConverter() {
  const [amount, setAmount] = useState(20);
  const [from, setFrom] = useState<Unit>("kg");
  const [to, setTo] = useState<Unit>("lb");

  const convert = () => {
    const inKg = amount * toKg[from];
    return (inKg / toKg[to]).toFixed(2);
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-200">

      <h2 className="mb-6 text-2xl font-bold text-red-700">
        Weight Converter
      </h2>

      <div className="grid gap-4 md:grid-cols-3">

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="rounded-lg border p-3 text-black"
        />

        <select
          value={from}
          onChange={(e) => setFrom(e.target.value as Unit)}
          className="rounded-lg border p-3 text-black"
        >
          {units.map((u) => (
            <option key={u}>{u}</option>
          ))}
        </select>

        <select
          value={to}
          onChange={(e) => setTo(e.target.value as Unit)}
          className="rounded-lg border p-3 text-black"
        >
          {units.map((u) => (
            <option key={u}>{u}</option>
          ))}
        </select>

      </div>

      <div className="mt-8">

        <CurrencyCard
          title="Converted Weight"
          value={`${convert()} ${to}`}
        />

      </div>

    </div>
  );
}
