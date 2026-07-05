export default function SearchBar() {
  return (
    <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">

      <div className="flex flex-col gap-4 lg:flex-row">

        <input
          type="text"
          placeholder="🔍 Search articles, SOPs, airports, procedures..."
          className="flex-1 rounded-xl border border-gray-300 px-5 py-4 text-black outline-none transition focus:border-red-600"
        />

        <select className="rounded-xl border border-gray-300 px-5 py-4 text-black">

          <option>All Categories</option>
          <option>Reservations</option>
          <option>Refunds</option>
          <option>Payments</option>
          <option>AirRewards</option>
          <option>Airport Operations</option>

        </select>

        <button className="rounded-xl bg-red-700 px-8 py-4 font-semibold text-white transition hover:bg-red-800">

          Search

        </button>

      </div>

    </div>
  );
}