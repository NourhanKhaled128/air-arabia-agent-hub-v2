import Sidebar from "../components/Sidebar";
import Breadcrumb from "../components/Breadcrumb";
import Link from "next/link";

export default function ReservationsPage() {
  return (
    <main className="flex min-h-screen bg-gray-100">

      <Sidebar />

      <div className="flex-1 p-8">

        <Breadcrumb current="Reservations" />

        <h1 className="text-5xl font-bold text-red-700 mb-8">
          Reservations
        </h1>

        <div className="bg-white rounded-2xl shadow-lg p-8">

          <h2 className="text-2xl font-bold mb-6">
            Articles
          </h2>

          <div className="space-y-4">

            <Link
              href="/articles/flight-change"
              className="block hover:text-red-700"
            >
              ✈️ Flight Change
            </Link>

            <Link
              href="/articles/new-booking"
              className="block hover:text-red-700"
            >
              🛫 New Booking
            </Link>

            <Link
              href="/articles/name-correction"
              className="block hover:text-red-700"
            >
              ✍️ Name Correction
            </Link>

            <p>📅 Schedule Change</p>

            <p>🚫 Duplicate Booking</p>

          </div>

        </div>

      </div>

    </main>
  );
}