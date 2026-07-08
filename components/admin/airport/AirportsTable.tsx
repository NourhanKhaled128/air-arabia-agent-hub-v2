"use client";

import AdminListTable from "@/components/admin/AdminListTable";
import AirportRowActions from "./AirportRowActions";
import { deleteManyAirportsAction } from "@/app/admin/actions/airport-actions";

interface Airport {
  id: number;
  code: string;
  city: string;
  airport: string;
  terminal: string | null;
  country: string;
}

interface Props {
  airports: Airport[];
  countryOptions: { value: string; label: string }[];
}

export default function AirportsTable({ airports, countryOptions }: Props) {
  return (
    <AdminListTable
      columns={[
        { key: "code", label: "Code" },
        { key: "city", label: "City" },
        { key: "airport", label: "Airport" },
        { key: "terminal", label: "Terminal" },
        { key: "country", label: "Country" },
      ]}
      data={airports}
      searchPlaceholder="Search airports..."
      searchFn={(airport, query) => {
        const q = query.toLowerCase();
        return (
          airport.code.toLowerCase().includes(q) ||
          airport.city.toLowerCase().includes(q) ||
          airport.airport.toLowerCase().includes(q) ||
          airport.country.toLowerCase().includes(q)
        );
      }}
      filters={[
        {
          key: "country",
          label: "Country",
          options: countryOptions,
        },
      ]}
      filterFn={(airport, values) => {
        if (values.country && airport.country !== values.country) return false;
        return true;
      }}
      onDeleteMany={deleteManyAirportsAction}
      emptyMessage="No airports uploaded yet."
      renderRow={(airport) => (
        <>
          <td className="px-6 py-5 font-semibold">{airport.code}</td>
          <td className="px-6 py-5">{airport.city}</td>
          <td className="px-6 py-5">{airport.airport}</td>
          <td className="px-6 py-5">{airport.terminal ?? "-"}</td>
          <td className="px-6 py-5">{airport.country}</td>
          <td className="px-6 py-5">
            <AirportRowActions id={airport.id} />
          </td>
        </>
      )}
    />
  );
}
