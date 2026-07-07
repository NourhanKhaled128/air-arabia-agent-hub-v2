import PageHeader from "@/components/PageHeader";
import FlightDurationCalculator from "@/components/FlightDurationCalculator";

export default function FlightDurationPage() {
  return (
    <main className="space-y-8">

      <PageHeader
        title="Flight Duration Calculator"
        subtitle="Calculate total flight time between departure and arrival."
      />

      <FlightDurationCalculator />

    </main>
  );
}
