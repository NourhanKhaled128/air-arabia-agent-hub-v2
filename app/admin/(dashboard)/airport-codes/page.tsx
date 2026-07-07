import { Plane } from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminStatCard from "@/components/admin/AdminStatCard";
import AirportUploadForm from "@/components/admin/airport/AirportUploadForm";
import { getAirports } from "@/lib/airport-service";

export default async function AdminAirportCodesPage() {
  const airports = await getAirports();

  const countries = new Set(airports.map((a) => a.country)).size;

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

      <div className="overflow-x-auto rounded-3xl bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left">Code</th>
              <th className="px-6 py-4 text-left">City</th>
              <th className="px-6 py-4 text-left">Airport</th>
              <th className="px-6 py-4 text-left">Country</th>
            </tr>
          </thead>

          <tbody>
            {airports.map((airport) => (
              <tr key={airport.id} className="border-t">
                <td className="px-6 py-5 font-semibold">{airport.code}</td>
                <td className="px-6 py-5">{airport.city}</td>
                <td className="px-6 py-5">{airport.airport}</td>
                <td className="px-6 py-5">{airport.country}</td>
              </tr>
            ))}

            {airports.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-slate-500">
                  No airports uploaded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
