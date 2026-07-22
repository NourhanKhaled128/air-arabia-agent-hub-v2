export const dynamic = "force-dynamic";


import Hero from "@/components/Hero";

import DashboardStats from "@/components/DashboardStats";

import YourQuizProgress from "@/components/YourQuizProgress";

import QuickActions from "@/components/QuickActions";

import Announcements from "@/components/Announcements";

import DisruptionsWidget from "@/components/DisruptionsWidget";

import TimeConverter from "@/components/TimeConverter";

import BrowseAtoZ from "@/components/BrowseAtoZ";

import TrendingArticles from "@/components/TrendingArticles";

import RecentArticles from "@/components/RecentArticles";

import RecentActivity from "@/components/RecentActivity";

import UpcomingTraining from "@/components/UpcomingTraining";

import ImportantLinks from "@/components/ImportantLinks";

import { getVisibleHomeWidgets } from "@/lib/home-widget-service";

const WIDGET_COMPONENTS: Record<string, React.ComponentType> = {
  quickActions: QuickActions,
  announcements: Announcements,
  disruptions: DisruptionsWidget,
  timeConverter: TimeConverter,
  favoriteArticles: BrowseAtoZ,
  trendingArticles: TrendingArticles,
  recentArticles: RecentArticles,
  recentActivity: RecentActivity,
  upcomingTraining: UpcomingTraining,
  importantLinks: ImportantLinks,
};

export default async function HomePage() {

  const widgets = await getVisibleHomeWidgets();

  return (

    <>

      <Hero />

      <DashboardStats />

      <YourQuizProgress />

      <div className="grid gap-8 lg:grid-cols-2">

        {widgets.map((widget) => {
          const Widget = WIDGET_COMPONENTS[widget.type];

          if (!Widget) return null;

          return (
            <div
              key={widget.id}
              className={widget.size === "full" ? "lg:col-span-2" : ""}
            >
              <Widget />
            </div>
          );
        })}

      </div>

    </>

  );

}
