import PageHeader from "@/components/PageHeader";
import CurrencyConverter from "@/components/CurrencyConverter";

export default function CurrencyConverterPage() {
  return (
    <main className="space-y-8">

      <PageHeader
        title="Currency Converter"
        subtitle="Convert between common airline currencies."
      />

      <CurrencyConverter />

    </main>
  );
}