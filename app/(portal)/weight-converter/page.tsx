import PageHeader from "@/components/PageHeader";
import WeightConverter from "@/components/WeightConverter";

export default function WeightConverterPage() {
  return (
    <>
      <PageHeader
        title="Weight Converter"
        subtitle="Convert baggage weight between common units."
      />

      <WeightConverter />
    </>
  );
}
