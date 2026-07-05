import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import CategoryCard from "../components/CategoryCard";

export default function KnowledgePage() {
  return (
    <main className="flex min-h-screen bg-gray-100">

      <Sidebar />

      <div className="flex-1 p-8">

        <Header />

        <SearchBar />

        <h2 className="text-3xl font-bold text-red-700 mt-10 mb-6">
          Knowledge Categories
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">

          <CategoryCard
            title="Reservations"
            description="Flight changes, bookings, schedule changes and name corrections."
            href="/reservations"
            icon="✈️"
          />

          <CategoryCard
            title="Refunds"
            description="Refund eligibility, airport taxes and refund requests."
            href="/refunds"
            icon="💰"
          />

          <CategoryCard
            title="Ancillaries"
            description="Seats, baggage, meals and extra services."
            href="/ancillaries"
            icon="🧳"
          />

          <CategoryCard
            title="AirRewards"
            description="Membership, points and benefits."
            href="/airrewards"
            icon="🎁"
          />

          <CategoryCard
            title="Flight Disruptions"
            description="Delays, cancellations and operational procedures."
            href="/flight-disruptions"
            icon="⚠️"
          />

          <CategoryCard
            title="Training"
            description="Training material and agent guides."
            href="/training"
            icon="🎓"
          />

        </div>

      </div>

    </main>
  );
}