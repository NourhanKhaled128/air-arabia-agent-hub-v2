const articles = [
  "Flight Change Procedure",
  "Refund Policy",
  "Schedule Change",
  "Special Service Requests",
  "Boarding Procedure",
];

export default function LatestArticles() {
  return (
    <div className="space-y-4">

      {articles.map((article) => (

        <div
          key={article}
          className="rounded-xl border border-gray-200 bg-white p-5 transition hover:border-red-600 hover:shadow-lg"
        >

          <h3 className="font-semibold text-black">

            📄 {article}

          </h3>

        </div>

      ))}

    </div>
  );
}