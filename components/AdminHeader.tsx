"use client";

import { Bell, Search } from "lucide-react";

export default function AdminHeader() {

  return (

    <header className="flex items-center justify-between border-b bg-white px-8 py-5">

      <div>

        <h1 className="text-3xl font-bold">

          Admin Portal

        </h1>

        <p className="text-gray-500">

          Manage Knowledge Base

        </p>

      </div>

      <div className="flex items-center gap-5">

        <div className="relative">

          <Search
            className="absolute left-4 top-3 text-gray-400"
            size={18}
          />

          <input
            placeholder="Search..."
            className="w-80 rounded-xl border px-12 py-3 outline-none"
          />

        </div>

        <button className="rounded-full bg-gray-100 p-3">

          <Bell />

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