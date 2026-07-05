import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

interface Props {
  children: React.ReactNode;
}

export default function AppLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <Sidebar />

      <main className="ml-64">
        <Header />

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}