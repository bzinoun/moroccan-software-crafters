import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleView } from "@/components/actualites/ArticleView";
import { LightboxProvider } from "@/components/Lightbox";
import { loadEvents, loadSite } from "@/content/load";
import { articleBySlug, articleSlugs, articleView } from "@/lib/pages-data";

// One static page per article. `output: "export"` refuses a slug that
// `generateStaticParams` did not return, and `dynamicParams = false` says so.
export const dynamicParams = false;

type Params = { slug: string };
type Props = { params: Promise<Params> };

export function generateStaticParams(): Params[] {
  return articleSlugs().map((slug) => ({ slug }));
}

function viewOf(slug: string) {
  const article = articleBySlug(slug);
  // Unreachable with dynamicParams = false; it narrows the type.
  if (!article) notFound();
  const site = loadSite();
  return { article, view: articleView(article, loadEvents(), site), site };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { article, view, site } = viewOf(slug);
  const cover = article.cover
    ? `${site.baseUrl}/assets/img/meetups/${article.cover}.jpg`
    : undefined;
  return {
    title: view.documentTitle,
    description: view.excerpt,
    openGraph: {
      type: "article",
      title: view.documentTitle,
      description: view.excerpt,
      url: `${site.baseUrl}/actualites/${slug}/`,
      images: cover ? [cover] : [],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const { view } = viewOf(slug);
  return (
    <LightboxProvider>
      <ArticleView view={view} />
    </LightboxProvider>
  );
}
