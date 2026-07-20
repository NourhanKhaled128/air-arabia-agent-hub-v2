import { notFound } from "next/navigation";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AirportComposer from "@/components/admin/airport/AirportComposer";
import { getAirportById } from "@/lib/airport-service";
import { updateAirportAction } from "@/app/admin/actions/airport-actions";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditAirportPage({ params }: Props) {
  const { id } = await params;
  const airportId = Number(id);

  if (!Number.isInteger(airportId)) {
    notFound();
  }

  const airport = await getAirportById(airportId);

  if (!airport) {
    notFound();
  }

  const boundUpdate = updateAirportAction.bind(null, airportId);

  return (
    <div className="space-y-8">

      <AdminPageHeader
        title="Edit Airport"
        breadcrumbs={[{ label: "Airport Codes", href: "/admin/airport-codes" }, { label: airport.code }]}
      />

      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <AirportComposer
          action={boundUpdate}
          submitLabel="Save Changes"
          airport={airport}
        />
      </div>

    </div>
  );
}
