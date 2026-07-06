"use client";

import AdminInput from "../AdminInput";
import AdminTextarea from "../AdminTextarea";

export default function CourseBuilder() {
  return (
    <div className="space-y-6">

      <AdminInput
        label="Course Title"
        placeholder="Reservations Fundamentals"
      />

      <AdminTextarea
        label="Description"
        placeholder="Course description..."
      />

      <AdminInput
        label="Duration"
        placeholder="3 Hours"
      />

      <AdminInput
        label="Passing Score"
        placeholder="80%"
      />

      <button className="rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800">
        Save Course
      </button>

    </div>
  );
}