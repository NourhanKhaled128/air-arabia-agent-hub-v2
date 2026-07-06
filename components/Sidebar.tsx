"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Home,
  BookOpen,
  Plane,
  AlertTriangle,
  Clock3,
  Globe,
  DollarSign,
  Scale,
  Timer,
  Search,
  ChevronDown,
  ChevronRight,
  Star,
  Folder,
} from "lucide-react";

interface SidebarCategory {
  id: number;
  name: string;
  slug: string;
  group: string;
}

interface Props {
  categories: SidebarCategory[];
}

const pinnedKnowledgeItems = [
  { title: "Knowledge", icon: BookOpen, href: "/Knowledge" },
  {
    title: "Flight Disruptions",
    icon: AlertTriangle,
    href: "/disruptions",
  },
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

export default function Sidebar({ categories }: Props) {
  const pathname = usePathname();

  const [search, setSearch] = useState("");

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const [toolsOpen, setToolsOpen] = useState(true);

  const groups = new Map<string, SidebarCategory[]>();

  for (const category of categories) {
    const items = groups.get(category.group) ?? [];
    items.push(category);
    groups.set(category.group, items);
  }

  function isGroupOpen(group: string) {
    return openGroups[group] ?? true;
  }

  function toggleGroup(group: string) {
    setOpenGroups((prev) => ({
      ...prev,
      [group]: !isGroupOpen(group),
    }));
  }

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

        <div className="mb-8">
          <MenuSection
            items={pinnedKnowledgeItems}
            pathname={pathname}
            search={search}
          />
        </div>

        {Array.from(groups.entries()).map(([group, items]) => (
          <div key={group} className="mb-8">

            <button
              onClick={() => toggleGroup(group)}
              className="mb-3 flex w-full items-center justify-between px-4"
            >

              <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                {group}
              </span>

              {isGroupOpen(group) ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}

            </button>

            {isGroupOpen(group) && (
              <MenuSection
                items={items.map((category) => ({
                  title: category.name,
                  href: `/category/${category.slug}`,
                  icon: Folder,
                }))}
                pathname={pathname}
                search={search}
              />
            )}

          </div>
        ))}

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
