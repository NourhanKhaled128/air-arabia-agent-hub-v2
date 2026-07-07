import ToolHeader from "@/components/ToolHeader";
import AirportCodeFinder from "@/components/AirportCodeFinder";

export default function AirportCodesPage() {
  return (
    <main className="space-y-8">

      <ToolHeader
        title="Airport Code Finder"
        subtitle="Search airports by code, city, or airport name."
      />

      <AirportCodeFinder />

    </main>
  );
}
