import Link from "next/link";
import { getDashboardStats } from "@/lib/dashboard-service";

export default async function Hero() {
  const stats = await getDashboardStats();

  return (
    <section className="relative overflow-hidden rounded-3xl">

      <img
        src="/images/plane.jpg"
        alt="Air Arabia"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-red-900/95 via-red-800/80 to-red-700/40"></div>

      <div className="relative flex min-h-[280px] items-center justify-between px-10 py-10">

        <div className="max-w-3xl">

          <span className="rounded-full bg-white/20 px-4 py-2 text-sm text-white backdrop-blur">

            Internal Knowledge Portal

          </span>

          <h1 className="mt-5 text-4xl font-bold text-white">

            Air Arabia Agent Hub

          </h1>

          <p className="mt-5 text-lg leading-8 text-white/90">

            Search operational procedures, reservations,
            refunds, airport operations, AirRewards,
            baggage policies and internal documentation.

          </p>

          <div className="mt-8 flex gap-4">

            <Link
              href="/Knowledge"
              className="rounded-xl bg-white px-6 py-3 font-semibold text-brand transition hover:bg-red-100"
            >

              Browse Knowledge

            </Link>

            <Link
              href="/disruptions"
              className="rounded-xl border border-white px-6 py-3 font-semibold text-white transition hover:bg-white hover:text-brand"
            >

              Latest Updates

            </Link>

          </div>

        </div>

        <div className="hidden xl:block">

          <div className="rounded-3xl bg-white/10 p-8 backdrop-blur-xl">

            <h2 className="mb-6 text-2xl font-bold text-white">

              Today's Summary

            </h2>

            <div className="space-y-5 text-white">

              <div className="flex justify-between gap-24">

                <span>Knowledge</span>

                <strong>{stats.articles}</strong>

              </div>

              <div className="flex justify-between">

                <span>Notifications</span>

                <strong>{stats.announcements}</strong>

              </div>

              <div className="flex justify-between">

                <span>Training</span>

                <strong>{stats.courses}</strong>

              </div>

              <div className="flex justify-between">

                <span>Alerts</span>

                <strong>{stats.activeAlerts}</strong>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
