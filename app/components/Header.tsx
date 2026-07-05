import Image from "next/image";

export default function Header() {
  return (
    <header className="relative h-72 rounded-3xl overflow-hidden shadow-xl">

      <Image
        src="/images/plane.jpg"
        alt="Air Arabia Plane"
        fill
        priority
        className="object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-red-900/80 via-red-800/60 to-black/40" />

      <div className="absolute inset-0 flex flex-col justify-center px-12">

        <h1 className="text-5xl font-bold text-white">
          Air Arabia Agent Hub
        </h1>

        <p className="text-xl text-gray-200 mt-3 max-w-2xl">
          Your internal knowledge base for reservations, refunds,
          baggage, disruptions, AirRewards, systems and operational procedures.
        </p>

      </div>

    </header>
  );
}