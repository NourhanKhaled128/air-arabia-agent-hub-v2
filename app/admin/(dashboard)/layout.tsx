import type { Metadata } from "next";
import type { ReactNode } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
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
    <div className="min-h-screen bg-slate-100">
      <AdminSidebar />

      <div className="ml-72 min-h-screen">
        <main className="p-8">
          <div className="mx-auto w-full max-w-[1700px] space-y-8">
            <AdminHeader
              articles={articles}
              user={
                currentUser
                  ? { name: currentUser.name, role: currentUser.role.name }
                  : null
              }
            />

            {children}
          </div>
        </main>
      </div>
    </div>
  );
}