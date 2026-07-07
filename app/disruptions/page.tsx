export const dynamic = "force-dynamic";

import ToolHeader from "@/components/ToolHeader";
import AirportAlerts from "@/components/AirportAlerts";

export default function DisruptionsPage() {
  return (
    <main className="space-y-8">

      <ToolHeader
        title="Flight Disruptions"
        subtitle="Current airport alerts and disruption notices."
      />

      <AirportAlerts />

    </main>
  );
}
