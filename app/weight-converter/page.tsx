import ToolHeader from "@/components/ToolHeader";
import WeightConverter from "@/components/WeightConverter";

export default function WeightConverterPage() {
  return (
    <main className="space-y-8">

      <ToolHeader
        title="Weight Converter"
        subtitle="Convert baggage weight between common units."
      />

      <WeightConverter />

    </main>
  );
}
