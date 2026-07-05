"use client";

import {
  Bell,
  Search,
} from "lucide-react";

export default function AdminHeader() {

  return (

    <header className="sticky top-0 z-40 flex items-center justify-between border-b bg-white px-8 py-5">

      <div>

        <h1 className="text-3xl font-bold">

          Air Arabia CMS

        </h1>

        <p className="text-gray-500">

          Knowledge Management System

        </p>

      </div>

      <div className="flex items-center gap-6">

        <div className="relative">

          <Search
            className="absolute left-4 top-3 text-gray-400"
            size={18}
          />

          <input
            placeholder="Search..."
            className="w-80 rounded-xl border border-gray-300 py-3 pl-11 pr-4 outline-none focus:border-red-700"
          />

        </div>

        <button className="rounded-full bg-gray-100 p-3 hover:bg-red-50">

          <Bell size={20} />

        </button>

        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-700 font-bold text-white">

            N

          </div>

          <div>

            <p className="font-semibold">

              Nourhan Khaled

            </p>

            <p className="text-sm text-gray-500">

              Administrator

            </p>

          </div>

        </div>

      </div>

    </header>

  );

}