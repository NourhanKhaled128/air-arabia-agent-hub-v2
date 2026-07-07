"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { airports } from "@/Data/airports";

export default function AirportCodeFinder() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) return airports;

    return airports.filter(
      (airport) =>
        airport.code.toLowerCase().includes(q) ||
        airport.city.toLowerCase().includes(q) ||
        airport.airport.toLowerCase().includes(q) ||
        airport.country.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="space-y-6">

      <div className="flex items-center gap-3 rounded-xl border border-gray-300 px-4 py-3">
        <Search size={18} className="text-gray-500" />

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by code, city, airport, or country..."
          className="w-full bg-transparent outline-none"
        />
      </div>

      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="text-left text-sm text-gray-500">
              <th className="px-6 py-4">Code</th>
              <th className="px-6 py-4">City</th>
              <th className="px-6 py-4">Airport</th>
              <th className="px-6 py-4">Country</th>
            </tr>
          </thead>

          <tbody>
            {results.map((airport) => (
              <tr key={airport.code} className="border-t border-gray-100">
                <td className="px-6 py-4">
                  <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-bold text-red-700">
                    {airport.code}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium">{airport.city}</td>
                <td className="px-6 py-4 text-gray-600">{airport.airport}</td>
                <td className="px-6 py-4 text-gray-600">{airport.country}</td>
              </tr>
            ))}

            {results.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
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
