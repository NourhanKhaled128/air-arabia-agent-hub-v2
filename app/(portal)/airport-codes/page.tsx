import PageHeader from "@/components/PageHeader";
import AirportCodeFinder from "@/components/AirportCodeFinder";
import { getAirports } from "@/lib/airport-service";

export default async function AirportCodesPage() {
  const airports = await getAirports();

  return (
    <>
      <PageHeader
        title="Airport Code Finder"
        subtitle="Search airports by code, city, or airport name."
      />

      <AirportCodeFinder airports={airports} />
    </>
  );
}
