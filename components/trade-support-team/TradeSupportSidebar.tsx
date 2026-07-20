"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Briefcase,
  ChevronDown,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ExternalLink,
  Folder,
  GitBranch,
  X,
} from "lucide-react";

import { useSidebarPrefs } from "@/components/SidebarPrefsProvider";
import { getSidebarIcon } from "@/lib/sidebar-icons";
import CopyButton from "@/components/CopyButton";

interface TradeSupportFolder {
  id: number;
  name: string;
}

interface TradeSupportCategory {
  id: number;
  name: string;
  slug: string;
  folders: TradeSupportFolder[];
}

interface ImportantLinkItem {
  id: number;
  title: string;
  url: string;
  icon: string;
}

interface Props {
  categories: TradeSupportCategory[];
  importantLinks: ImportantLinkItem[];
}

export default function TradeSupportSidebar({ categories, importantLinks }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { collapsed, dock, mobileOpen, toggleCollapsed, closeMobile } = useSidebarPrefs();

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

  const activeFolderId = searchParams.get("folder");
  const onOverview = pathname === "/TradeSupportTeam";
  const onDecisionTrees = pathname.startsWith("/TradeSupportTeam/decision-trees");

  const sideClasses = dock === "left" ? "left-0 border-r" : "right-0 border-l";
  const widthClasses = collapsed ? "lg:w-[4.5rem]" : "lg:w-72";
  const mobileTranslate = mobileOpen
    ? "translate-x-0"
    : dock === "left"
      ? "-translate-x-full"
      : "translate-x-full";

  return (
    <>
      {mobileOpen && (
        <div
          onClick={closeMobile}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 z-50 flex h-screen w-72 flex-col border-gray-200 dark:border-border-subtle bg-white dark:bg-surface transition-transform duration-300 ease-in-out ${sideClasses} ${widthClasses} ${mobileTranslate} lg:translate-x-0`}
      >

        <div className="flex items-center justify-between border-b border-gray-200 dark:border-border-subtle p-6">

          {!collapsed && (
            <Image
              src="/images/logo.png"
              alt="Air Arabia"
              width={140}
              height={60}
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

        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4">

          <Link
            href="/"
            onClick={closeMobile}
            title={collapsed ? "Back to Main Hub" : undefined}
            className={`mb-6 flex items-center gap-3 rounded-xl px-4 py-3 text-gray-800 dark:text-slate-200 transition hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-brand ${
              collapsed ? "justify-center px-0" : ""
            }`}
          >
            <ArrowLeft size={20} />
            {!collapsed && <span className="font-medium">Back to Main Hub</span>}
          </Link>

          {!collapsed && (
            <div className="mb-6 flex items-center gap-3 px-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                <Briefcase size={18} />
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-slate-100">Trade Support Team</p>
                <p className="text-xs text-gray-500 dark:text-slate-400">Separated workspace</p>
              </div>
            </div>
          )}

          <div className="mb-8">

            {!collapsed && (
              <h3 className="mb-3 px-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">
                Articles
              </h3>
            )}

            <Link
              href="/TradeSupportTeam"
              onClick={closeMobile}
              title={collapsed ? "Overview" : undefined}
              className={`mb-2 flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                collapsed ? "justify-center px-0" : ""
              } ${
                onOverview
                  ? "border-l-4 border-brand bg-red-50 dark:bg-red-950/40 text-brand shadow"
                  : "text-gray-800 dark:text-slate-200 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-brand"
              }`}
            >
              <Folder size={20} />
              {!collapsed && <span className="font-medium">Overview</span>}
            </Link>

            {categories.map((category) => {
              const categoryHref = `/TradeSupportTeam/category/${category.slug}`;
              const active = pathname === categoryHref;
              const hasFolders = category.folders.length > 0;
              const open = isCategoryFoldersOpen(category.id);

              if (collapsed) {
                return (
                  <Link
                    key={category.id}
                    href={categoryHref}
                    onClick={closeMobile}
                    title={category.name}
                    className={`mb-2 flex items-center justify-center rounded-xl px-0 py-3 transition-all duration-200 ${
                      active
                        ? "border-l-4 border-brand bg-red-50 dark:bg-red-950/40 text-brand shadow"
                        : "text-gray-800 dark:text-slate-200 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-brand"
                    }`}
                  >
                    <Folder size={18} />
                  </Link>
                );
              }

              return (
                <div key={category.id} className="mb-2">
                  <div
                    className={`flex items-center rounded-xl transition-all duration-200 ${
                      active
                        ? "border-l-4 border-brand bg-red-50 dark:bg-red-950/40 text-brand shadow"
                        : "text-gray-800 dark:text-slate-200 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-brand"
                    }`}
                  >
                    <Link
                      href={categoryHref}
                      onClick={closeMobile}
                      className="flex flex-1 items-center gap-3 px-4 py-3"
                    >
                      <Folder size={20} />
                      <span className="font-medium">{category.name}</span>
                    </Link>

                    {hasFolders && (
                      <button
                        onClick={() => toggleCategoryFolders(category.id)}
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
                          href={`${categoryHref}?folder=${folder.id}`}
                          onClick={closeMobile}
                          className={`block rounded-lg px-3 py-2 text-sm transition-all duration-200 ${
                            active && activeFolderId === String(folder.id)
                              ? "font-semibold text-brand"
                              : "text-gray-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-brand"
                          }`}
                        >
                          {folder.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

          </div>

          <div className="mb-8">

            {!collapsed && (
              <h3 className="mb-3 px-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">
                Tools
              </h3>
            )}

            <Link
              href="/TradeSupportTeam/decision-trees"
              onClick={closeMobile}
              title={collapsed ? "Decision Trees" : undefined}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                collapsed ? "justify-center px-0" : ""
              } ${
                onDecisionTrees
                  ? "border-l-4 border-brand bg-red-50 dark:bg-red-950/40 text-brand shadow"
                  : "text-gray-800 dark:text-slate-200 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-brand"
              }`}
            >
              <GitBranch size={20} />
              {!collapsed && <span className="font-medium">Decision Trees</span>}
            </Link>

          </div>

          {importantLinks.length > 0 && (
            <div className="mb-8">

              {collapsed ? (
                <>
                  {importantLinks.map((link) => {
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

                    <span className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-slate-400">
                      Important Links
                    </span>

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
                      {importantLinks.map((link) => {
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

      </aside>
    </>
  );
}
