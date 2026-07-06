import ArticleMetadataCard from "./ArticleMetadataCard";

export default function ArticleSidebar() {
  return (
    <div className="space-y-6">

      <ArticleMetadataCard
        author="Administrator"
        createdAt="06 Jul 2026"
        updatedAt="06 Jul 2026"
        version="1.0"
      />

    </div>
  );
}