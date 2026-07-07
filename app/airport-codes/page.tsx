import PageHeader from "@/components/PageHeader";
import AirportCodeFinder from "@/components/AirportCodeFinder";
import { getAirports } from "@/lib/airport-service";

export default async function AirportCodesPage() {
  const airports = await getAirports();

  return (
    <main className="space-y-8">

      <PageHeader
        title="Airport Code Finder"
        subtitle="Search airports by code, city, or airport name."
      />

      <AirportCodeFinder airports={airports} />

    </main>
  );
}
