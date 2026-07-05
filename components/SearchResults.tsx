import { Article } from "@/Data/articles";
import SearchResultCard from "./SearchResultCard";
import EmptySearch from "./EmptySearch";

interface Props {
  results: Article[];
}

export default function SearchResults({
  results,
}: Props) {

  if (results.length === 0) {
    return <EmptySearch />;
  }

  return (
    <div className="space-y-5">

      {results.map((article) => (

        <SearchResultCard
          key={article.id}
          title={article.title}
          description={article.description}
          category={article.category}
          slug={article.slug}
        />

      ))}

    </div>
  );
}