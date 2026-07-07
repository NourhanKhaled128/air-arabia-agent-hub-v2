import ArticleMetadataCard from "./ArticleMetadataCard";

interface Props {
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ArticleSidebar({ author, createdAt, updatedAt }: Props) {
  return (
    <div className="space-y-6">

      <ArticleMetadataCard
        author={author}
        createdAt={formatDate(createdAt)}
        updatedAt={formatDate(updatedAt)}
      />

    </div>
  );
}
