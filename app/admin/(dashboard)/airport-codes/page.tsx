import { Plane } from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminStatCard from "@/components/admin/AdminStatCard";
import AirportUploadForm from "@/components/admin/airport/AirportUploadForm";
import AirportsTable from "@/components/admin/airport/AirportsTable";
import { getAirports } from "@/lib/airport-service";

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

      <AirportsTable airports={airports} countryOptions={countryOptions} />

    </div>
  );
}
