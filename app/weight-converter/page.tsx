import PageHeader from "@/components/PageHeader";
import WeightConverter from "@/components/WeightConverter";

export default function WeightConverterPage() {
  return (
    <main className="space-y-8">

      <PageHeader
        title="Weight Converter"
        subtitle="Convert baggage weight between common units."
      />

      <WeightConverter />

    </main>
  );
}
