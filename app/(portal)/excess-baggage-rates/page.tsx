import PageHeader from "@/components/PageHeader";
import ExcessBaggageRateFinder from "@/components/excess-baggage/ExcessBaggageRateFinder";
import { getAllExcessBaggageRates } from "@/lib/excess-baggage-service";

export default async function ExcessBaggageRatesPage() {
  const rates = await getAllExcessBaggageRates();

  return (
    <>
      <PageHeader
        title="Excess Baggage Rates"
        subtitle="Find the exact rate by hub, direction and destination."
      />

      <div className="rounded-3xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-8 shadow-sm">
        <ExcessBaggageRateFinder rates={rates} />
      </div>
    </>
  );
}
