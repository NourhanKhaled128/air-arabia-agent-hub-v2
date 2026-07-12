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
  ExternalLink,
  type LucideIcon,
} from "lucide-react";

import { getSidebarIcon } from "@/lib/sidebar-icons";
import { useSidebarPrefs } from "@/components/SidebarPrefsProvider";
import CopyButton from "@/components/CopyButton";

interface SidebarFolder {
  id: number;
  name: string;
}

interface SidebarCategory {
  id: number;
  name: string;
  slug: string;
  group: string;
  folders: SidebarFolder[];
}

interface SidebarNavLink {
  id: number;
  label: string;
  href: string;
  icon: string;
}

interface ImportantLinkItem {
  id: number;
  title: string;
  url: string;
  icon: string;
}

interface Props {
  categories: SidebarCategory[];
  pinnedLinks: SidebarNavLink[];
  toolLinks: SidebarNavLink[];
  importantLinks: ImportantLinkItem[];
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
                ? "border-l-4 border-brand bg-red-50 dark:bg-red-950/40 text-brand shadow"
                : "text-gray-800 dark:text-slate-200 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-brand"
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

function CategoryMenuRow({
  category,
  pathname,
  onNavigate,
  open,
  onToggleFolders,
}: {
  category: SidebarCategory;
  pathname: string;
  onNavigate: () => void;
  open: boolean;
  onToggleFolders: () => void;
}) {
  const active = pathname === `/category/${category.slug}`;
  const hasFolders = category.folders.length > 0;

  return (
    <div className="mb-2">
      <div
        className={`flex items-center rounded-xl transition-all duration-200 ${
          active
            ? "border-l-4 border-brand bg-red-50 dark:bg-red-950/40 text-brand shadow"
            : "text-gray-800 dark:text-slate-200 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-brand"
        }`}
      >
        <Link
          href={`/category/${category.slug}`}
          onClick={onNavigate}
          className="flex flex-1 items-center gap-3 px-4 py-3"
        >
          <Folder size={20} />
          <span className="font-medium">{category.name}</span>
        </Link>

        {hasFolders && (
          <button
            onClick={onToggleFolders}
            title={open ? "Hide folders" : "Show folders"}
            className="px-3 py-3 text-gray-500 dark:text-slate-400 hover:text-brand"
          >
            {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        )}
      </div>

      {hasFolders && open && (
        <div className="ml-6 mt-1 space-y-1 border-l border-gray-200 dark:border-border-subtle pl-3">
          {category.folders.map((folder) => (
            <Link
              key={folder.id}
              href={`/category/${category.slug}?folder=${folder.id}`}
              onClick={onNavigate}
              className="block rounded-lg px-3 py-2 text-sm text-gray-600 dark:text-slate-400 transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-brand"
            >
              {folder.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Sidebar({ categories, pinnedLinks, toolLinks, importantLinks }: Props) {
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

  const [linksOpen, setLinksOpen] = useState(true);

  const [openCategoryFolders, setOpenCategoryFolders] = useState<Record<number, boolean>>({});

  function isCategoryFoldersOpen(categoryId: number) {
    return openCategoryFolders[categoryId] ?? true;
  }

  function toggleCategoryFolders(categoryId: number) {
    setOpenCategoryFolders((prev) => ({
      ...prev,
      [categoryId]: !isCategoryFoldersOpen(categoryId),
    }));
  }

  const filteredImportantLinks = importantLinks.filter((link) =>
    link.title.toLowerCase().includes(search.toLowerCase())
  );

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
        className={`fixed top-0 z-50 flex h-screen w-72 flex-col border-gray-200 dark:border-border-subtle bg-white dark:bg-surface transition-transform duration-300 ease-in-out ${sideClasses} ${widthClasses} ${mobileTranslate} ${desktopTranslate}`}
      >

        <div className="flex items-center justify-between border-b border-gray-200 dark:border-border-subtle p-6">

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
            className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-slate-800 lg:hidden"
          >
            <X size={22} />
          </button>

        </div>

        <div className="hidden items-center justify-between gap-2 border-b border-gray-200 dark:border-border-subtle px-4 py-2 lg:flex">

          <button
            onClick={toggleCollapsed}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="rounded-lg p-2 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800"
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
              className="rounded-lg p-2 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800"
            >
              <ArrowLeftRight size={18} />
            </button>
          )}

        </div>

        {!collapsed && (
          <div className="p-4">

            <div className="flex items-center gap-2 rounded-xl border border-gray-300 dark:border-border-subtle px-3 py-3">

              <Search size={18} className="text-gray-500 dark:text-slate-400" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter menu..."
                className="w-full bg-transparent outline-none text-black dark:text-white"
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
                ? "border-l-4 border-brand bg-red-50 dark:bg-red-950/40 text-brand shadow"
                : "hover:bg-red-50 dark:hover:bg-red-950/40"
            }`}
          >

            <Home size={20} />

            {!collapsed && <span className="font-semibold">Dashboard</span>}

          </Link>

          <div className="mb-8">

            {!collapsed && (
              <h3 className="mb-3 flex items-center gap-2 px-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">

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

                    <span className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-slate-400">
                      {group}
                    </span>

                    {isGroupOpen(group) ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}

                  </button>

                  {isGroupOpen(group) && (
                    <>
                      {items
                        .filter((category) =>
                          category.name.toLowerCase().includes(search.toLowerCase())
                        )
                        .map((category) => (
                          <CategoryMenuRow
                            key={category.id}
                            category={category}
                            pathname={pathname}
                            onNavigate={closeMobile}
                            open={isCategoryFoldersOpen(category.id)}
                            onToggleFolders={() => toggleCategoryFolders(category.id)}
                          />
                        ))}
                    </>
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

                  <span className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-slate-400">
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

          {/* Important Links */}

          {filteredImportantLinks.length > 0 && (
            <div className="mb-8">

              {collapsed ? (
                <>
                  <Link
                    href="/important-links"
                    title="All Important Links"
                    className="mb-2 flex items-center justify-center rounded-xl px-0 py-3 text-gray-800 dark:text-slate-200 transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-brand"
                  >
                    <ExternalLink size={20} />
                  </Link>

                  {filteredImportantLinks.map((link) => {
                    const Icon = getSidebarIcon(link.icon);

                    return (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={link.title}
                        className="mb-2 flex items-center justify-center rounded-xl px-0 py-3 text-gray-800 dark:text-slate-200 transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-brand"
                      >
                        <Icon size={20} />
                      </a>
                    );
                  })}
                </>
              ) : (
                <>
                  <div className="mb-3 flex w-full items-center justify-between px-4">

                    <Link
                      href="/important-links"
                      className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-slate-400 hover:text-brand"
                    >
                      Important Links
                    </Link>

                    <button
                      onClick={() => setLinksOpen(!linksOpen)}
                      aria-label={linksOpen ? "Collapse important links" : "Expand important links"}
                      className="text-gray-500 dark:text-slate-400 hover:text-brand"
                    >
                      {linksOpen ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </button>

                  </div>

                  {linksOpen && (
                    <div>
                      {filteredImportantLinks.map((link) => {
                        const Icon = getSidebarIcon(link.icon);

                        return (
                          <div
                            key={link.id}
                            className="mb-2 flex items-center gap-2 rounded-xl px-4 py-3 text-gray-800 dark:text-slate-200 transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-brand"
                          >
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex min-w-0 flex-1 items-center gap-3"
                            >
                              <Icon size={20} />
                              <span className="flex-1 truncate font-medium">{link.title}</span>
                              <ExternalLink size={14} className="shrink-0 text-gray-400 dark:text-slate-500" />
                            </a>

                            <CopyButton text={link.url} compact />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}

            </div>
          )}

        </div>

        {/* Shared shift footer */}

        <div className="border-t border-gray-200 dark:border-border-subtle bg-gray-50 dark:bg-surface-muted p-5">

          <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand text-lg font-bold text-white shadow-md">
              AA
            </div>

            {!collapsed && (
              <div className="flex-1">

                <p className="font-semibold text-gray-900 dark:text-slate-100">
                  Air Arabia Agent Hub
                </p>

                <p className="text-sm text-gray-500 dark:text-slate-400">
                  Shared shift portal
                </p>

              </div>
            )}

          </div>

        </div>

      </aside>
    </>
  );
}
