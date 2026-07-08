import AdminPageHeader from "@/components/admin/AdminPageHeader";
import HomeWidgetsManager from "@/components/admin/home-widgets/HomeWidgetsManager";
import { getHomeWidgets } from "@/lib/home-widget-service";

export default async function HomeWidgetsPage() {
  const widgets = await getHomeWidgets();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Home Page Widgets"
        description="Control which widgets appear on the agent portal home page, their order, size, and visibility."
      />

      <HomeWidgetsManager widgets={widgets} />
    </div>
  );
}
