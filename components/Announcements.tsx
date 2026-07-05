export default function Announcements() {
  return (
    <div className="rounded-3xl bg-red-700 p-8 text-white shadow-lg h-[420px]">
      <h2 className="text-2xl font-bold">
        Latest Announcements
      </h2>

      <ul className="mt-6 space-y-4">
        <li>✅ New refund policy effective this week.</li>
        <li>✈️ Flight disruption SOP updated.</li>
        <li>🎓 July training schedule published.</li>
        <li>💳 Payment gateway maintenance on Friday.</li>
      </ul>
      <div className="mt-6 space-y-5 overflow-y-auto pr-2 h-[280px]"></div>
    </div>
  );
}