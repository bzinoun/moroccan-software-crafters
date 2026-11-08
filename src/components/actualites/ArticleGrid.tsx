import type { ArticleCard } from "@/lib/pages-data";
import { ArticleTeaser } from "./ArticleTeaser";

// Spec: the "ArticleGrid, ArticleCard" entry in msca-design/COMPONENTS.md.
// One column, two from `sm`, three from `lg`. The lead card spans the whole row.
export function ArticleGrid({ articles }: { articles: ArticleCard[] }) {
  if (articles.length === 0) return null;
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <ArticleTeaser key={article.slug} article={article} />
      ))}
    </div>
  );
}
