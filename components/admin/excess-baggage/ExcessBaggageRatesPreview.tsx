interface Rate {
  id: number;
  hub: string;
  section: string;
  region: string | null;
  destination: string;
  rate: string;
  updatedAt: Date;
}

interface Props {
  rates: Rate[];
}

const HUB_ORDER = ["G9", "3O", "9P", "E5"];

export default function ExcessBaggageRatesPreview({ rates }: Props) {
  if (rates.length === 0) {
    return (
      <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
        <p className="text-gray-500">No rates uploaded yet. Upload the workbook above to populate this table.</p>
      </div>
    );
  }

  const lastUpdated = rates.reduce(
    (latest, r) => (r.updatedAt > latest ? r.updatedAt : latest),
    rates[0].updatedAt
  );

  return (
    <div className="space-y-8">
      <p className="text-sm text-gray-500">
        Last updated {lastUpdated.toLocaleString()} — {rates.length} rows.
      </p>

      {HUB_ORDER.filter((hub) => rates.some((r) => r.hub === hub)).map((hub) => {
        const hubRates = rates.filter((r) => r.hub === hub);
        const sections = Array.from(new Set(hubRates.map((r) => r.section)));

        return (
          <div key={hub} className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="mb-4 text-xl font-bold">{hub}</h2>

            {sections.map((section) => (
              <div key={section} className="mb-6 last:mb-0">
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
                  {section}
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b text-gray-500">
                        {hubRates.some((r) => r.region) && <th className="py-2 pr-4">Region</th>}
                        <th className="py-2 pr-4">Destination</th>
                        <th className="py-2">Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hubRates
                        .filter((r) => r.section === section)
                        .map((r) => (
                          <tr key={r.id} className="border-b border-gray-50">
                            {hubRates.some((row) => row.region) && (
                              <td className="py-2 pr-4 text-gray-500">{r.region ?? ""}</td>
                            )}
                            <td className="py-2 pr-4 font-medium">{r.destination}</td>
                            <td className="py-2 whitespace-pre-line">{r.rate}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
