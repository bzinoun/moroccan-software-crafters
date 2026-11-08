import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { frauncesItalic } from "@/app/fonts-italic";
import { ArticleView } from "@/components/actualites/ArticleView";
import { LightboxProvider } from "@/components/Lightbox";
import { loadEvents, loadSite } from "@/content/load";
import { articleBySlug, articleSlugs } from "@/lib/articles-server";
import { pageMetadata } from "@/lib/page-metadata";
import { articleMeta, articleView } from "@/lib/pages-data";

// One prerendered page per article. `output: "export"` refuses a slug that
// `generateStaticParams` did not return, and `dynamicParams = false` says so.
export const dynamicParams = false;

type Params = { slug: string };
type Props = { params: Promise<Params> };

export function generateStaticParams(): Params[] {
  return articleSlugs().map((slug) => ({ slug }));
}

function articleOf(slug: string) {
  const article = articleBySlug(slug);
  // Unreachable with dynamicParams = false; it narrows the type.
  if (!article) notFound();
  return article;
}

// Light lookup: the metadata needs the article and the site, not the events.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const meta = articleMeta(articleOf(slug), loadSite());
  return pageMetadata({
    path: meta.path,
    title: meta.documentTitle,
    description: meta.description,
    photo: meta.photo,
    type: "article",
  });
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const view = articleView(articleOf(slug), loadEvents(), loadSite());
  const page = <ArticleView view={view} />;
  // The lightbox only serves the photos link, which needs photos. The wrapper
  // carries the slanted font variable for a quote in the body.
  return (
    <div className={frauncesItalic.variable}>
      {view.photos.length > 0 ? (
        <LightboxProvider>{page}</LightboxProvider>
      ) : (
        page
      )}
    </div>
  );
}
