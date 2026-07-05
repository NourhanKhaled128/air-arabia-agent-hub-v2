import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">

      <AdminSidebar />

      <main className="ml-72">

        <AdminHeader />

        <div className="p-8">

          {children}

        </div>

      </main>

    </div>
  );
}