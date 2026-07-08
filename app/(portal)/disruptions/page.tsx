export const dynamic = "force-dynamic";

import PageHeader from "@/components/PageHeader";
import AirportAlerts from "@/components/AirportAlerts";

export default function DisruptionsPage() {
  return (
    <>
      <PageHeader
        title="Flight Disruptions"
        subtitle="Current airport alerts and disruption notices."
      />

      <AirportAlerts />
    </>
  );
}
