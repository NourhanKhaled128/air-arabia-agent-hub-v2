import PageHeader from "@/components/PageHeader";
import LayoverCalculator from "@/components/LayoverCalculator";

export default function LayoverCalculatorPage() {
  return (
    <main className="space-y-8">

      <PageHeader
        title="Layover Calculator"
        subtitle="Check connection time between flights at the same airport."
      />

      <LayoverCalculator />

    </main>
  );
}
