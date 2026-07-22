export const dynamic = "force-dynamic";


import Hero from "@/components/Hero";

import DashboardStats from "@/components/DashboardStats";

import YourQuizProgress from "@/components/YourQuizProgress";

import ContinueReading from "@/components/ContinueReading";

import QuizzesToTake from "@/components/QuizzesToTake";

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

import QualityFeedbackWidget from "@/components/QualityFeedbackWidget";

import { getVisibleHomeWidgets } from "@/lib/home-widget-service";
import HomeWidgetsGrid from "@/components/HomeWidgetsGrid";
import OnboardingTour from "@/components/OnboardingTour";
import { getCurrentPortalUser } from "@/lib/portal-dal";

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
  qualityFeedback: QualityFeedbackWidget,
};

export default async function HomePage() {

  const [widgets, user] = await Promise.all([getVisibleHomeWidgets(), getCurrentPortalUser()]);

  return (

    <>

      {user && <OnboardingTour hasSeenOnboarding={user.hasSeenOnboarding} />}

      <Hero />

      <DashboardStats />

      <YourQuizProgress />

      <QuizzesToTake />

      <ContinueReading />

      <HomeWidgetsGrid
        widgets={widgets
          .filter((widget) => WIDGET_COMPONENTS[widget.type])
          .map((widget) => {
            const Widget = WIDGET_COMPONENTS[widget.type];
            return { id: widget.id, size: widget.size, node: <Widget /> };
          })}
      />

    </>

  );

}
