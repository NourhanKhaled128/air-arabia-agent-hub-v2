import { Plane } from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminStatCard from "@/components/admin/AdminStatCard";
import AdminListTable from "@/components/admin/AdminListTable";
import AirportUploadForm from "@/components/admin/airport/AirportUploadForm";
import AirportRowActions from "@/components/admin/airport/AirportRowActions";
import { getAirports } from "@/lib/airport-service";
import { deleteManyAirportsAction } from "@/app/admin/actions/airport-actions";

export default async function AdminAirportCodesPage() {
  const airports = await getAirports();

  const countries = new Set(airports.map((a) => a.country)).size;
  const countryOptions = Array.from(new Set(airports.map((a) => a.country)))
    .sort()
    .map((country) => ({ value: country, label: country }));

  return (
    <div className="space-y-8">

      <AdminPageHeader
        title="Airport Codes"
        description="Manage the airport code reference list shown to agents. Upload an Excel sheet to replace the entire list."
      />

      <div className="grid gap-6 md:grid-cols-2">
        <AdminStatCard title="Total Airports" value={airports.length} icon={Plane} />
        <AdminStatCard title="Countries Covered" value={countries} icon={Plane} color="text-blue-700" />
      </div>

      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <AirportUploadForm />
      </div>

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

    </div>
  );
}
