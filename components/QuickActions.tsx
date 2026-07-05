import {
  Plane,
  Globe,
  DollarSign,
  Scale,
  Clock3,
  Timer,
} from "lucide-react";

import ActionCard from "./ActionCard";

export default function QuickActions() {
  return (
    <div>
<div className="rounded-3xl bg-white p-8 shadow-lg"></div>
      <h2 className="mb-5 text-2xl font-bold text-black">
        Quick Actions
      </h2>

     <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

        <ActionCard
          title="Reservations"
          href="/Reservations"
          icon={<Plane className="text-red-700" />}
      
        />

        <ActionCard
          title="Airport Codes"
          href="/airport-codes"
          icon={<Globe className="text-red-700" />}
        />

        <ActionCard
          title="Currency"
          href="/currency-converter"
          icon={<DollarSign className="text-red-700" />}
        />

        <ActionCard
          title="Time"
          href="/time-converter"
          icon={<Clock3 className="text-red-700" />}
        />

        <ActionCard
          title="Duration"
          href="/flight-duration"
          icon={<Timer className="text-red-700" />}
        />

      </div>

    </div>
  );
}