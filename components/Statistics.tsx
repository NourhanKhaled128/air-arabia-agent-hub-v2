import { articles } from "@/Data/articles";

export default function Statistics() {

    const categories =
        [...new Set(articles.map(a=>a.category))];

    return (

        <div className="grid md:grid-cols-4 gap-6">

            <div className="bg-white rounded-2xl shadow-lg p-6">

                <h2 className="text-gray-500">
                    Articles
                </h2>

                <h1 className="text-4xl font-bold mt-3">
                    {articles.length}
                </h1>

            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">

                <h2 className="text-gray-500">
                    Categories
                </h2>

                <h1 className="text-4xl font-bold mt-3">
                    {categories.length}
                </h1>

            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">

                <h2 className="text-gray-500">
                    Updated
                </h2>

                <h1 className="text-4xl font-bold mt-3">
                    Today
                </h1>

            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">

                <h2 className="text-gray-500">
                    Status
                </h2>

                <h1 className="text-green-600 text-4xl font-bold mt-3">
                    Online
                </h1>

            </div>

        </div>

    );

}