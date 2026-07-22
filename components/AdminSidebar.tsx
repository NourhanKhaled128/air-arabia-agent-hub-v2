"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Folder,
  PanelLeft,
  AlertTriangle,
  Megaphone,
  GraduationCap,
  Users,
  UserCheck,
  Layers,
  Shield,
  ShieldCheck,
  Pencil,
  Settings,
  Home,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
  ChevronDown,
  ChevronRight,
  ArrowLeftRight,
  X,
  Plane,
  ClipboardList,
  PhoneCall,
  Link2,
  LayoutGrid,
  Image as ImageIcon,
  MessageCircle,
  MessageSquare,
  GitBranch,
  Luggage,
  BookOpen,
  ListChecks,
  Briefcase,
  BarChart3,
  Search,
  Bell,
  History,
  Database,
  Activity,
  ClipboardCheck,
  Star,
} from "lucide-react";
import { logoutAction } from "@/app/admin/actions/auth-actions";
import { useSidebarPrefs } from "@/components/SidebarPrefsProvider";

export const adminMenuGroups = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
      { title: "Global Search", href: "/admin/search", icon: Search },
    ],
  },
  {
    label: "Support Teams",
    items: [
      { title: "Customer Support Team", href: "/admin/customer-support-team", icon: PhoneCall },
      { title: "Trade Support Team", href: "/admin/trade-support-team", icon: Briefcase },
    ],
  },
  {
    label: "Content",
    items: [
      { title: "Articles", href: "/admin/articles", icon: FileText },
      { title: "Categories", href: "/admin/categories", icon: Folder },
      { title: "Decision Trees", href: "/admin/decision-trees", icon: GitBranch },
      { title: "Training", href: "/admin/training", icon: GraduationCap },
      { title: "Quizzes", href: "/admin/quizzes", icon: ClipboardCheck },
      { title: "Glossary", href: "/admin/glossary", icon: BookOpen },
      { title: "Quick Reference", href: "/admin/quick-reference", icon: ListChecks },
      { title: "Media Library", href: "/admin/media", icon: ImageIcon },
    ],
  },
  {
    label: "Reference Data",
    items: [
      { title: "Airport Codes", href: "/admin/airport-codes", icon: Plane },
      { title: "Excess Baggage Rates", href: "/admin/excess-baggage-rates", icon: Luggage },
      { title: "Disposition Codes", href: "/admin/disposition-codes", icon: ClipboardList },
      { title: "Escalation Contacts", href: "/admin/escalation", icon: PhoneCall },
      { title: "Important Links", href: "/admin/important-links", icon: Link2 },
    ],
  },
  {
    label: "Engagement",
    items: [
      { title: "Announcements", href: "/admin/announcements", icon: Megaphone },
      { title: "Notifications", href: "/admin/notifications", icon: Bell },
      { title: "Home Widgets", href: "/admin/home-widgets", icon: LayoutGrid },
      { title: "Comments", href: "/admin/comments", icon: MessageCircle },
      { title: "Feedback", href: "/admin/feedback", icon: MessageSquare },
      { title: "Content Suggestions", href: "/admin/content-suggestions", icon: Pencil },
      { title: "Quality Feedback", href: "/admin/quality-feedback", icon: Star },
    ],
  },
  {
    label: "Operations",
    items: [
      { title: "Disruptions", href: "/admin/disruptions", icon: AlertTriangle },
      { title: "Content Health", href: "/admin/content-health", icon: ShieldCheck },
      { title: "Audit Trail", href: "/admin/audit", icon: History },
      { title: "Backup & Restore", href: "/admin/backup", icon: Database },
      { title: "System Health", href: "/admin/system", icon: Activity },
    ],
  },
  {
    label: "People & Settings",
    items: [
      { title: "Sidebar Links", href: "/admin/sidebar", icon: PanelLeft },
      { title: "Users", href: "/admin/users", icon: Users },
      { title: "Agent Accounts", href: "/admin/portal-users", icon: UserCheck },
      { title: "Teams", href: "/admin/teams", icon: Layers },
      { title: "Roles", href: "/admin/roles", icon: Shield },
      { title: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

export default function AdminSidebar() {
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

  const activeGroupLabel = adminMenuGroups.find((group) =>
    group.items.some((item) => item.href === pathname)
  )?.label;

  const [closedGroups, setClosedGroups] = useState<Record<string, boolean>>({});

  function isGroupOpen(label: string) {
    if (closedGroups[label] !== undefined) return !closedGroups[label];
    // Auto-expand whichever group contains the current page.
    return true;
  }

  function toggleGroup(label: string) {
    setClosedGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  }

  const sideClasses = dock === "left" ? "left-0 border-r" : "right-0 border-l";

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

        <div className="flex items-center justify-between border-b border-gray-200 dark:border-border-subtle p-6 lg:p-8">

          {!collapsed && (
            <div>
              <h1 className="text-3xl font-bold text-brand">
                AIR ARABIA
              </h1>

              <p className="mt-1 text-gray-500 dark:text-slate-400">
                Content Management
              </p>
            </div>
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

        <nav className="flex-1 overflow-y-auto overflow-x-hidden p-5">

          {adminMenuGroups.map((group) => {
            const open = isGroupOpen(group.label);

            return (
              <div key={group.label} className="mb-4">

                {!collapsed && (
                  <button
                    onClick={() => toggleGroup(group.label)}
                    className={`mb-1 flex w-full items-center justify-between rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${
                      activeGroupLabel === group.label
                        ? "text-brand"
                        : "text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300"
                    }`}
                  >
                    {group.label}
                    {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>
                )}

                {(collapsed || open) &&
                  group.items.map((item) => {
                    const Icon = item.icon;
                    const active = pathname === item.href;

                    return (
                      <Link
                        key={item.title}
                        href={item.href}
                        onClick={closeMobile}
                        title={collapsed ? item.title : undefined}
                        className={`mb-2 flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                          collapsed ? "justify-center px-0" : ""
                        } ${
                          active
                            ? "border-l-4 border-brand bg-red-50 dark:bg-red-950/40 text-brand"
                            : "hover:bg-red-50 dark:hover:bg-red-950/40"
                        }`}
                      >
                        <Icon size={20} />
                        {!collapsed && <span className="flex-1">{item.title}</span>}
                      </Link>
                    );
                  })}

              </div>
            );
          })}

        </nav>

        <div className="border-t border-gray-200 dark:border-border-subtle p-5">

          <Link
            href="/"
            title={collapsed ? "Back to Champion Portal" : undefined}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-gray-100 dark:hover:bg-slate-800 ${
              collapsed ? "justify-center px-0" : ""
            }`}
          >
            <Home size={20} />
            {!collapsed && "Back to Champion Portal"}
          </Link>

          <form action={logoutAction}>
            <button
              type="submit"
              title={collapsed ? "Logout" : undefined}
              className={`mt-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-brand hover:bg-red-50 dark:hover:bg-red-950/40 ${
                collapsed ? "justify-center px-0" : ""
              }`}
            >
              <LogOut size={20} />
              {!collapsed && "Logout"}
            </button>
          </form>

        </div>

      </aside>
    </>
  );
}
