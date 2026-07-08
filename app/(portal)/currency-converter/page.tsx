import PageHeader from "@/components/PageHeader";
import CurrencyConverter from "@/components/CurrencyConverter";

export default function CurrencyConverterPage() {
  return (
    <>
      <PageHeader
        title="Currency Converter"
        subtitle="Convert between common airline currencies."
      />

      <CurrencyConverter />
    </>
  );
}