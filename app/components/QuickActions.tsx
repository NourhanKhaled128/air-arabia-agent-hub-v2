import Link from "next/link";
import DashboardCard from "./DashboardCard";

export default function QuickActions() {
  return (
    <DashboardCard title="Quick Actions">

      <Link href="/articles/flight-change" className="block hover:text-red-700">
        ✈ Flight Change
      </Link>

      <Link href="/articles/new-booking" className="block hover:text-red-700">
        🛫 New Booking
      </Link>

      <Link href="/articles/refund" className="block hover:text-red-700">
        💰 Refund
      </Link>

      <Link href="/articles/add-baggage" className="block hover:text-red-700">
        🧳 Add Baggage
      </Link>

      <Link href="/articles/name-correction" className="block hover:text-red-700">
        ✍ Name Correction
      </Link>

    </DashboardCard>
  );
}