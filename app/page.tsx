import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import QuickActions from "./components/QuickActions";
import RecentUpdates from "./components/RecentUpdates";
import DashboardCard from "./components/DashboardCard";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen bg-gray-100">

      <Sidebar />

      <div className="flex-1 p-8">

        <Header />

        <SearchBar />

        <div className="grid grid-cols-2 gap-6 mt-8">

          <QuickActions />

          <RecentUpdates />

          <DashboardCard title="Knowledge Categories">

            <Link href="/reservations" className="block hover:text-red-700">
              ✈ Reservations
            </Link>

            <Link href="/refunds" className="block hover:text-red-700">
              💰 Refunds
            </Link>

            <Link href="/ancillaries" className="block hover:text-red-700">
              🧳 Ancillaries
            </Link>

            <Link href="/payments" className="block hover:text-red-700">
              💳 Payments
            </Link>

            <Link href="/airrewards" className="block hover:text-red-700">
              🎁 AirRewards
            </Link>

          </DashboardCard>

          <DashboardCard title="Recently Viewed">

            <p>No articles viewed yet.</p>

          </DashboardCard>

        </div>

      </div>

    </main>
  );
}