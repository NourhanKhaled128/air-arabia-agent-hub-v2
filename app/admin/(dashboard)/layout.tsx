import type { Metadata } from "next";
import type { ReactNode } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import AdminMain from "@/components/AdminMain";
import { SidebarPrefsProvider } from "@/components/SidebarPrefsProvider";
import { getAllArticles } from "@/lib/article-service";
import { getCurrentAdminUser } from "@/lib/admin-dal";

export const metadata: Metadata = {
  title: "KB Admin",
};

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({
  children,
}: AdminLayoutProps) {
  const [articles, currentUser] = await Promise.all([
    getAllArticles(),
    getCurrentAdminUser(),
  ]);

  return (
    <SidebarPrefsProvider>
      <div className="min-h-screen bg-slate-100 dark:bg-background">
        <AdminSidebar />

        <AdminMain>
          <AdminHeader
            articles={articles}
            user={
              currentUser
                ? { name: currentUser.name, role: currentUser.role.name }
                : null
            }
          />

          {children}
        </AdminMain>
      </div>
    </SidebarPrefsProvider>
  );
}
