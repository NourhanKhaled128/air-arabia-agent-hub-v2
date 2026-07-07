"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Home,
  Search,
  ChevronDown,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowLeftRight,
  X,
  Star,
  Folder,
  type LucideIcon,
} from "lucide-react";

import { getSidebarIcon } from "@/lib/sidebar-icons";
import { useSidebarPrefs } from "@/components/SidebarPrefsProvider";

interface SidebarCategory {
  id: number;
  name: string;
  slug: string;
  group: string;
}

interface SidebarNavLink {
  id: number;
  label: string;
  href: string;
  icon: string;
}

interface Props {
  categories: SidebarCategory[];
  pinnedLinks: SidebarNavLink[];
  toolLinks: SidebarNavLink[];
}

type MenuItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

function MenuSection({
  items,
  pathname,
  search,
  collapsed,
  onNavigate,
}: {
  items: MenuItem[];
  pathname: string;
  search: string;
  collapsed: boolean;
  onNavigate: () => void;
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
            title={collapsed ? item.title : undefined}
            onClick={onNavigate}
            className={`mb-2 flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
              collapsed ? "justify-center px-0" : ""
            } ${
              active
                ? "border-l-4 border-red-600 bg-red-50 text-red-700 shadow"
                : "text-gray-800 hover:bg-red-50 hover:text-red-700"
            }`}
          >
            <Icon size={20} />
            {!collapsed && <span className="font-medium">{item.title}</span>}
          </Link>
        );
      })}
    </>
  );
}

function toMenuItems(links: SidebarNavLink[]): MenuItem[] {
  return links.map((link) => ({
    title: link.label,
    href: link.href,
    icon: getSidebarIcon(link.icon),
  }));
}

export default function Sidebar({ categories, pinnedLinks, toolLinks }: Props) {
  const pathname = usePathname();

  const {
    collapsed,
    dock,
    mobileOpen,
    scrollHidden,
    toggleCollapsed,
    setDock,
    closeMobile,
  } = useSidebarPrefs();

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

  const sideClasses =
    dock === "left" ? "left-0 border-r" : "right-0 border-l";

  const widthClasses = collapsed ? "lg:w-[4.5rem]" : "lg:w-72";

  const mobileTranslate = mobileOpen
    ? "translate-x-0"
    : dock === "left"
      ? "-translate-x-full"
      : "translate-x-full";

  const desktopTranslate = scrollHidden
    ? dock === "left"
      ? "lg:-translate-x-full"
      : "lg:translate-x-full"
    : "lg:translate-x-0";

  return (
    <>
      {mobileOpen && (
        <div
          onClick={closeMobile}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 z-50 flex h-screen w-72 flex-col border-gray-200 bg-white transition-transform duration-300 ease-in-out ${sideClasses} ${widthClasses} ${mobileTranslate} ${desktopTranslate}`}
      >

        <div className="flex items-center justify-between border-b border-gray-200 p-6">

          {!collapsed && (
            <Image
              src="/images/logo.png"
              alt="Air Arabia"
              width={160}
              height={70}
              priority
            />
          )}

          <button
            onClick={closeMobile}
            className="rounded-lg p-1 hover:bg-gray-100 lg:hidden"
          >
            <X size={22} />
          </button>

        </div>

        <div className="hidden items-center justify-between gap-2 border-b border-gray-200 px-4 py-2 lg:flex">

          <button
            onClick={toggleCollapsed}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          >
            {collapsed ? (
              dock === "left" ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />
            ) : (
              dock === "left" ? <ChevronsLeft size={18} /> : <ChevronsRight size={18} />
            )}
          </button>

          {!collapsed && (
            <button
              onClick={() => setDock(dock === "left" ? "right" : "left")}
              title="Move sidebar to the other side"
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
            >
              <ArrowLeftRight size={18} />
            </button>
          )}

        </div>

        {!collapsed && (
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
        )}

        <div className="flex-1 overflow-y-auto overflow-x-hidden px-3">

          <Link
            href="/"
            onClick={closeMobile}
            title={collapsed ? "Dashboard" : undefined}
            className={`mb-6 flex items-center gap-3 rounded-xl px-4 py-3 transition ${
              collapsed ? "justify-center px-0" : ""
            } ${
              pathname === "/"
                ? "border-l-4 border-red-600 bg-red-50 text-red-700 shadow"
                : "hover:bg-red-50"
            }`}
          >

            <Home size={20} />

            {!collapsed && <span className="font-semibold">Dashboard</span>}

          </Link>

          <div className="mb-8">

            {!collapsed && (
              <h3 className="mb-3 flex items-center gap-2 px-4 text-xs font-bold uppercase tracking-wider text-gray-500">

                <Star size={15} />

                Pinned Knowledge

              </h3>
            )}

            <MenuSection
              items={toMenuItems(pinnedLinks)}
              pathname={pathname}
              search={search}
              collapsed={collapsed}
              onNavigate={closeMobile}
            />

          </div>

          {Array.from(groups.entries()).map(([group, items]) => (
            <div key={group} className="mb-8">

              {collapsed ? (
                <MenuSection
                  items={items.map((category) => ({
                    title: category.name,
                    href: `/category/${category.slug}`,
                    icon: Folder,
                  }))}
                  pathname={pathname}
                  search={search}
                  collapsed={collapsed}
                  onNavigate={closeMobile}
                />
              ) : (
                <>
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
                      collapsed={collapsed}
                      onNavigate={closeMobile}
                    />
                  )}
                </>
              )}

            </div>
          ))}

          {/* Agent Tools */}

          <div className="mb-8">

            {collapsed ? (
              <MenuSection
                items={toMenuItems(toolLinks)}
                pathname={pathname}
                search={search}
                collapsed={collapsed}
                onNavigate={closeMobile}
              />
            ) : (
              <>
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
                    items={toMenuItems(toolLinks)}
                    pathname={pathname}
                    search={search}
                    collapsed={collapsed}
                    onNavigate={closeMobile}
                  />
                )}
              </>
            )}

          </div>

        </div>

        {/* User */}

        <div className="border-t border-gray-200 bg-gray-50 p-5">

          <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-700 text-lg font-bold text-white shadow-md">
              N
            </div>

            {!collapsed && (
              <div className="flex-1">

                <p className="font-semibold text-gray-900">
                  Nourhan Khaled
                </p>

                <p className="text-sm text-gray-500">
                  Reservations Agent
                </p>

              </div>
            )}

          </div>

        </div>

      </aside>
    </>
  );
}
