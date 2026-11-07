import type { ArticleCard as ArticleCardData } from "@/lib/pages-data";
import { ArticleCard } from "./ArticleCard";

// Spec: the "ArticleGrid, ArticleCard" entry in msca-design/COMPONENTS.md; port
// of `.article-grid`. One column, two from `sm` (old query 600px), three from
// `lg` (old query 960px). The lead card spans the whole row.
export function ArticleGrid({ articles }: { articles: ArticleCardData[] }) {
  if (articles.length === 0) return null;
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <ArticleCard key={article.slug} article={article} />
      ))}
    </div>
  );
}
