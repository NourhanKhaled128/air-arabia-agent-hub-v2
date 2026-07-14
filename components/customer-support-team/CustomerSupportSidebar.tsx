"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ChevronsLeft,
  ChevronsRight,
  Folder,
  GitBranch,
  PhoneCall,
  X,
} from "lucide-react";

import { useSidebarPrefs } from "@/components/SidebarPrefsProvider";

interface CustomerSupportFolder {
  id: number;
  name: string;
}

interface Props {
  folders: CustomerSupportFolder[];
}

export default function CustomerSupportSidebar({ folders }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { collapsed, dock, mobileOpen, toggleCollapsed, closeMobile } = useSidebarPrefs();

  const activeFolderId = searchParams.get("folder");
  const onLanding = pathname === "/CustomerSupportTeam";
  const onDecisionTrees = pathname.startsWith("/CustomerSupportTeam/decision-trees");

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
                <PhoneCall size={18} />
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-slate-100">Customer Support Team</p>
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
              href="/CustomerSupportTeam"
              onClick={closeMobile}
              title={collapsed ? "All Articles" : undefined}
              className={`mb-2 flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                collapsed ? "justify-center px-0" : ""
              } ${
                onLanding && !activeFolderId
                  ? "border-l-4 border-brand bg-red-50 dark:bg-red-950/40 text-brand shadow"
                  : "text-gray-800 dark:text-slate-200 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-brand"
              }`}
            >
              <Folder size={20} />
              {!collapsed && <span className="font-medium">All Articles</span>}
            </Link>

            {folders.map((folder) => (
              <Link
                key={folder.id}
                href={`/CustomerSupportTeam?folder=${folder.id}`}
                onClick={closeMobile}
                title={collapsed ? folder.name : undefined}
                className={`mb-2 flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                  collapsed ? "justify-center px-0" : "pl-8"
                } ${
                  onLanding && activeFolderId === String(folder.id)
                    ? "border-l-4 border-brand bg-red-50 dark:bg-red-950/40 text-brand shadow"
                    : "text-gray-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-brand"
                }`}
              >
                {collapsed && <Folder size={18} />}
                <span className={collapsed ? "hidden" : "font-medium"}>{folder.name}</span>
              </Link>
            ))}

          </div>

          <div className="mb-8">

            {!collapsed && (
              <h3 className="mb-3 px-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">
                Tools
              </h3>
            )}

            <Link
              href="/CustomerSupportTeam/decision-trees"
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

        </div>

      </aside>
    </>
  );
}
