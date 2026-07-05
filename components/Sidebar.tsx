"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Home,
  BookOpen,
  Plane,
  CreditCard,
  Gift,
  AlertTriangle,
  Laptop,
  GraduationCap,
  Briefcase,
  Clock3,
  Globe,
  DollarSign,
  Scale,
  Timer,
  Search,
  ChevronDown,
  ChevronRight,
  Star,
} from "lucide-react";

const knowledgeItems = [
  { title: "Knowledge", icon: BookOpen, href: "/Knowledge" },
  { title: "Reservations", icon: Plane, href: "/Reservations" },
  { title: "Refunds", icon: DollarSign, href: "/Refunds" },
  { title: "Ancillaries", icon: Briefcase, href: "/Ancillaries" },
  { title: "Payments", icon: CreditCard, href: "/Payments" },
  { title: "AirRewards", icon: Gift, href: "/AirRewards" },
  {
    title: "Flight Disruptions",
    icon: AlertTriangle,
    href: "/flight-disruptions",
  },
  { title: "Systems", icon: Laptop, href: "/Systems" },
  { title: "Training", icon: GraduationCap, href: "/Training" },
];

const toolItems = [
  {
  title: "Favorites",
  icon: Star,
  href: "/favorites",
},
{
  title: "Recently Viewed",
  icon: Clock3,
  href: "/recent",
},
  { title: "Time Converter", icon: Clock3, href: "/time-converter" },
  { title: "Airport Codes", icon: Globe, href: "/airport-codes" },
  {
    title: "Currency Converter",
    icon: DollarSign,
    href: "/currency-converter",
  },
  {
    title: "Weight Converter",
    icon: Scale,
    href: "/weight-converter",
  },
  {
    title: "Flight Duration",
    icon: Timer,
    href: "/flight-duration",
  },
  {
    title: "Layover Calculator",
    icon: Timer,
    href: "/layover-calculator",
  },
];

type MenuItem = {
  title: string;
  href: string;
  icon: any;
};

function MenuSection({
  items,
  pathname,
  search,
}: {
  items: MenuItem[];
  pathname: string;
  search: string;
}) {
  const filtered = items.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {filtered.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href;

        return (
          <Link
            key={item.title}
            href={item.href}
            className={`mb-2 flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
              active
                ? "border-l-4 border-red-600 bg-red-50 text-red-700 shadow"
                : "text-gray-800 hover:bg-red-50 hover:text-red-700"
            }`}
          >
            <Icon size={20} />
            <span className="font-medium">{item.title}</span>
          </Link>
        );
      })}
    </>
  );
}

export default function Sidebar() {
  const pathname = usePathname();

  const [search, setSearch] = useState("");

  const [knowledgeOpen, setKnowledgeOpen] = useState(true);

  const [toolsOpen, setToolsOpen] = useState(true);

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-72 flex-col border-r border-gray-200 bg-white">

      <div className="border-b border-gray-200 p-6">

        <Image
          src="/images/logo.png"
          alt="Air Arabia"
          width={160}
          height={70}
          priority
        />

      </div>

      <div className="p-4">

        <div className="flex items-center gap-2 rounded-xl border border-gray-300 px-3 py-3">

          <Search size={18} className="text-gray-500" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full bg-transparent outline-none text-black"
          />

        </div>

      </div>

      <div className="flex-1 overflow-y-auto px-3">

        <Link
          href="/"
          className={`mb-6 flex items-center gap-3 rounded-xl px-4 py-3 transition ${
            pathname === "/"
              ? "border-l-4 border-red-600 bg-red-50 text-red-700 shadow"
              : "hover:bg-red-50"
          }`}
        >

          <Home size={20} />

          <span className="font-semibold">
            Dashboard
          </span>

        </Link>

        <div className="mb-8">

          <h3 className="mb-3 flex items-center gap-2 px-4 text-xs font-bold uppercase tracking-wider text-gray-500">

            <Star size={15} />

            Favorites

          </h3>

          <Link
            href="/Reservations"
            className="mb-2 flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-red-50"
          >

            <Plane size={20} />

            Reservations

          </Link>

          <Link
            href="/time-converter"
            className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-red-50"
          >

            <Clock3 size={20} />

            Time Converter

          </Link>

        </div>
                {/* Knowledge Base */}

        <div className="mb-8">

          <button
            onClick={() => setKnowledgeOpen(!knowledgeOpen)}
            className="mb-3 flex w-full items-center justify-between px-4"
          >

            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
              Knowledge Base
            </span>

            {knowledgeOpen ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}

          </button>

          {knowledgeOpen && (
            <MenuSection
              items={knowledgeItems}
              pathname={pathname}
              search={search}
            />
          )}

        </div>

        {/* Agent Tools */}

        <div className="mb-8">

          <button
            onClick={() => setToolsOpen(!toolsOpen)}
            className="mb-3 flex w-full items-center justify-between px-4"
          >

            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
              Agent Tools
            </span>

            {toolsOpen ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}

          </button>

          {toolsOpen && (
            <MenuSection
              items={toolItems}
              pathname={pathname}
              search={search}
            />
          )}

        </div>

      </div>

      {/* User */}

      <div className="border-t border-gray-200 bg-gray-50 p-5">

        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-700 text-lg font-bold text-white shadow-md">
            N
          </div>

          <div className="flex-1">

            <p className="font-semibold text-gray-900">
              Nourhan Khaled
            </p>

            <p className="text-sm text-gray-500">
              Reservations Agent
            </p>

          </div>

        </div>

      </div>

    </aside>
  );
}