import PageHeader from "@/components/PageHeader";
import FlightDurationCalculator from "@/components/FlightDurationCalculator";

export default function FlightDurationPage() {
  return (
    <>
      <PageHeader
        title="Flight Duration Calculator"
        subtitle="Calculate total flight time between departure and arrival."
      />

      <FlightDurationCalculator />
    </>
  );
}
