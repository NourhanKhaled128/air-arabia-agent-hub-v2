export default function RecentActivity() {
  const activities = [
    "Refund Policy updated",
    "New Reservation SOP",
    "Summer Schedule Published",
    "Payment Guide Updated",
    "Ancillary Services Revised",
  ];

  return (
    <div className="rounded-3xl bg-white p-6 shadow-lg h-[470px]">

      <h2 className="mb-5 text-2xl font-bold text-black">
        Recent Activity
      </h2>

      <div className="space-y-4">

        {activities.map((item) => (

          <div
            key={item}
            className="flex items-center justify-between rounded-xl bg-gray-50 p-4"
          >

            <span className="font-medium text-black">
              {item}
            </span>

            <span className="text-sm text-gray-500">
              Today
            </span>

          </div>

        ))}

      </div>

    </div>
  );
}