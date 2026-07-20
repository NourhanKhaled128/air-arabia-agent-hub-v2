import type { Metadata } from "next";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import AdminMain from "@/components/AdminMain";
import AdminCommandPalette from "@/components/admin/AdminCommandPalette";
import { SidebarPrefsProvider } from "@/components/SidebarPrefsProvider";
import { getAllArticles } from "@/lib/article-service";
import { getCurrentAdminUser } from "@/lib/admin-dal";
import { getDraftNotificationCount } from "@/lib/notification-service";

export const metadata: Metadata = {
  title: "KB Admin",
};

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({
  children,
}: AdminLayoutProps) {
  const currentUser = await getCurrentAdminUser();

  if (!currentUser) {
    redirect("/admin/login");
  }

  const [articles, draftNotificationCount] = await Promise.all([
    getAllArticles(),
    getDraftNotificationCount(),
  ]);

  return (
    <SidebarPrefsProvider>
      <div className="min-h-screen bg-slate-100 dark:bg-background">
        <AdminSidebar />

        <AdminCommandPalette
          articles={articles.map((a) => ({ id: a.id, title: a.title, category: a.category }))}
        />

        <AdminMain>
          <AdminHeader
            draftNotificationCount={draftNotificationCount}
            user={{ name: currentUser.name, role: currentUser.role.name }}
          />

          {children}
        </AdminMain>
      </div>
    </SidebarPrefsProvider>
  );
}
