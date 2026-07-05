import { articles } from "@/Data/articles";
import { favorites } from "@/Data/favorites";
import ArticleMiniCard from "./ArticleMiniCard";

export default function FavoriteArticles() {
  const items = articles.filter(article =>
    favorites.includes(article.id)
  );

  return (
    <div className="mt-6 space-y-4 overflow-y-auto h-[300px] pr-2">

      <h2 className="mb-5 text-2xl font-bold">
        ⭐ Favorite Articles
      </h2>

      <div className="space-y-4">
        {items.map(article => (
          <ArticleMiniCard
            key={article.id}
            title={article.title}
            category={article.category}
            slug={article.slug}
          />
        ))}
      </div>

    </div>
  );
}