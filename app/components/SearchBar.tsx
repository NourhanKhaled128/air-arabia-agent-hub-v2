export default function SearchBar() {
  return (
    <div className="mt-8">

      <input
        type="text"
        placeholder="Search articles, airports, procedures..."
        className="
          w-full
          rounded-2xl
          border
          border-gray-300
          bg-white
          px-6
          py-5
          text-lg
          shadow-md
          focus:outline-none
          focus:ring-2
          focus:ring-red-600
        "
      />

    </div>
  );
}