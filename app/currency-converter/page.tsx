import ToolHeader from "@/components/ToolHeader";
import CurrencyConverter from "@/components/CurrencyConverter";

export default function CurrencyConverterPage() {
  return (
    <main className="space-y-8">

      <ToolHeader
        title="Currency Converter"
        subtitle="Convert between common airline currencies."
      />

      <CurrencyConverter />

    </main>
  );
}