import AppLayout from "@/components/AppLayout";

import Hero from "@/components/Hero";

import DashboardStats from "@/components/DashboardStats";

import QuickActions from "@/components/QuickActions";

import Announcements from "@/components/Announcements";

import TimeConverter from "@/components/TimeConverter";

import FavoriteArticles from "@/components/FavoriteArticles";

import TrendingArticles from "@/components/TrendingArticles";

import RecentArticles from "@/components/RecentArticles";

import RecentActivity from "@/components/RecentActivity";

import UpcomingTraining from "@/components/UpcomingTraining";

export default function HomePage() {

  return (

    <AppLayout>

      <Hero />

      <DashboardStats />

      <QuickActions />

      <div className="grid gap-8 lg:grid-cols-2">

        <Announcements />

        <TimeConverter />

      </div>

      <div className="grid gap-8 lg:grid-cols-2">

        <FavoriteArticles />

        <TrendingArticles />

      </div>

      <div className="grid gap-8 lg:grid-cols-2">

        <RecentArticles />

        <RecentActivity />

      </div>

      <UpcomingTraining />

    </AppLayout>

  );

}