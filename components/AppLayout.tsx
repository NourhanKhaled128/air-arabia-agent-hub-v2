import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

interface Props {
  children: React.ReactNode;
}

export default function AppLayout({
  children,
}: Props) {
  return (
    <div className="min-h-screen bg-gray-100">

      <Sidebar />

      <main className="ml-72">

        <div className="px-8 py-6">

          <Header />

          <div className="mt-8 space-y-8">

            {children}

          </div>

        </div>

      </main>

    </div>
  );
}