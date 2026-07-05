"use client";

import { useState } from "react";
import { currencies } from "@/Data/currencies";
import CurrencyCard from "./CurrencyCard";

export default function CurrencyConverter() {
  const [amount, setAmount] = useState(100);
  const [from, setFrom] = useState("AED");
  const [to, setTo] = useState("USD");

  const convert = () => {
    const fromRate = currencies.find((c) => c.code === from)?.rate || 1;
    const toRate = currencies.find((c) => c.code === to)?.rate || 1;

    return ((amount * fromRate) / toRate).toFixed(2);
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-200">

      <h2 className="mb-6 text-2xl font-bold text-red-700">
        Currency Converter
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
          onChange={(e) => setFrom(e.target.value)}
          className="rounded-lg border p-3 text-black"
        >
          {currencies.map((c) => (
            <option key={c.code}>{c.code}</option>
          ))}
        </select>

        <select
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="rounded-lg border p-3 text-black"
        >
          {currencies.map((c) => (
            <option key={c.code}>{c.code}</option>
          ))}
        </select>

      </div>

      <div className="mt-8">

        <CurrencyCard
          title="Converted Amount"
          value={`${convert()} ${to}`}
        />

      </div>

    </div>
  );
}