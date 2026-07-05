"use client";

import { useMemo, useState } from "react";
import { airports } from "@/Data/airports";
import AirportCard from "./AirportCard";
import SearchInput from "./SearchInput";
import EmptyState from "./EmptyState";
import UtilityCard from "./UtilityCard";

export default function AirportCodeFinder() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query) return airports;

    return airports.filter((airport) =>
      airport.code.toLowerCase().includes(query.toLowerCase()) ||
      airport.city.toLowerCase().includes(query.toLowerCase()) ||
      airport.airport.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  return (
    <UtilityCard title="Airport Code Finder">

      <SearchInput
        value={query}
        onChange={setQuery}
        placeholder="Search by airport code or city..."
      />

      <div className="mt-6 grid gap-4 md:grid-cols-2">

        {filtered.length === 0 ? (
          <EmptyState message="No airport found." />
        ) : (
          filtered.map((airport) => (
            <AirportCard
              key={airport.code}
              code={airport.code}
              city={airport.city}
              airport={airport.airport}
              country={airport.country}
            />
          ))
        )}

      </div>

    </UtilityCard>
  );
}