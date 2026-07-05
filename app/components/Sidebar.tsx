import Link from "next/link";
import Image from "next/image";

export default function Sidebar() {
  return (
    <aside className="w-72 bg-white shadow-xl min-h-screen p-6">

      <div className="flex justify-center mb-10">
        <Image
          src="/images/logo.png"
          alt="Air Arabia"
          width={180}
          height={70}
        />
      </div>

      <nav className="space-y-4 text-lg">

        <Link href="/" className="block hover:text-red-700">
          🏠 Dashboard
        </Link>

        <Link href="/knowledge" className="block hover:text-red-700">
          📚 Knowledge
        </Link>

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

        <Link href="/flight-disruptions" className="block hover:text-red-700">
          ⚠ Flight Disruptions
        </Link>

        <Link href="/systems" className="block hover:text-red-700">
          💻 Systems
        </Link>

        <Link href="/training" className="block hover:text-red-700">
          🎓 Training
        </Link>

      </nav>

    </aside>
  );
}