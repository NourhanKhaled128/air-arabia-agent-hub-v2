import ToolHeader from "@/components/ToolHeader";
import FlightDurationCalculator from "@/components/FlightDurationCalculator";

export default function FlightDurationPage() {
  return (
    <main className="space-y-8">

      <ToolHeader
        title="Flight Duration Calculator"
        subtitle="Calculate total flight time between departure and arrival."
      />

      <FlightDurationCalculator />

    </main>
  );
}
