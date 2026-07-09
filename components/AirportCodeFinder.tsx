"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

interface Airport {
  id: number;
  code: string;
  city: string;
  airport: string;
  country: string;
  terminal: string | null;
}

interface Props {
  airports: Airport[];
}

export default function AirportCodeFinder({ airports }: Props) {
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("");

  const countryOptions = useMemo(
    () => Array.from(new Set(airports.map((a) => a.country))).sort(),
    [airports]
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();

    return airports.filter((airport) => {
      if (country && airport.country !== country) return false;

      if (!q) return true;

      return (
        airport.code.toLowerCase().includes(q) ||
        airport.city.toLowerCase().includes(q) ||
        airport.airport.toLowerCase().includes(q) ||
        airport.country.toLowerCase().includes(q) ||
        (airport.terminal ?? "").toLowerCase().includes(q)
      );
    });
  }, [query, country, airports]);

  return (
    <div className="space-y-6">

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex flex-1 min-w-[220px] items-center gap-3 rounded-xl border border-gray-300 px-4 py-3">
          <Search size={18} className="text-gray-500" />

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by code, city, airport, terminal, or country..."
            className="w-full bg-transparent outline-none"
          />
        </div>

        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="rounded-xl border border-gray-300 px-4 py-3"
        >
          <option value="">Country: All</option>
          {countryOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="text-left text-sm text-gray-500">
              <th className="px-6 py-4">Code</th>
              <th className="px-6 py-4">City</th>
              <th className="px-6 py-4">Airport</th>
              <th className="px-6 py-4">Terminal</th>
              <th className="px-6 py-4">Country</th>
            </tr>
          </thead>

          <tbody>
            {results.map((airport) => (
              <tr key={airport.id} className="border-t border-gray-100">
                <td className="px-6 py-4">
                  <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-bold text-red-700">
                    {airport.code}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium">{airport.city}</td>
                <td className="px-6 py-4 text-gray-600">{airport.airport}</td>
                <td className="px-6 py-4 text-gray-600">{airport.terminal ?? "-"}</td>
                <td className="px-6 py-4 text-gray-600">{airport.country}</td>
              </tr>
            ))}

            {results.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                  No airports match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
