import PageHeader from "@/components/PageHeader";
import TimeConverter from "@/components/TimeConverter";

export default function TimeConverterPage() {
  return (
    <main className="space-y-8">

      <PageHeader
        title="Time Converter"
        subtitle="Convert time between airport time zones."
      />

      <TimeConverter />

    </main>
  );
}
