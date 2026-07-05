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

      <section className="mt-8">
        <DashboardStats />
      </section>

      <section className="mt-8">
        <QuickActions />
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2 items-start">
        <Announcements />
        <TimeConverter />
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2 items-start">
        <FavoriteArticles />
        <TrendingArticles />
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2 items-start">
        <RecentArticles />
        <RecentActivity />
      </section>

      <section className="mt-8">
        <UpcomingTraining />
      </section>

    </AppLayout>
  );
}