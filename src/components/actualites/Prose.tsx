import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

// Spec: the "ArticleView, Prose" entry in msca-design/COMPONENTS.md.
// The wrapper styles the bare elements that `md()` returns (h2, h3, ul, ol, li,
// blockquote, code, a), so the renderer stays free of classes. `md()` renders
// "#" and "##" as h2 (the page h1 is the article title) and "###" as h3. The
// h2 rule carries the look that "##" had when it rendered h3 (1.5rem), because
// every article body opens with "##". Preflight removed the list markers and
// the heading margins: restore them here. Links keep the line that the base
// layer draws. Spacing steps that are not quarters of 1rem are rem literals.
const PROSE =
  "text-[1.08rem] leading-[1.7] [&_h2]:mt-[1.8rem] [&_h2]:mb-2 [&_h2]:text-s150 [&_h3]:mt-[1.4rem] [&_h3]:mb-2 [&_h3]:text-s130 [&_ul]:mb-[1.2rem] [&_ul]:list-disc [&_ul]:pl-[1.3rem] [&_ol]:mb-[1.2rem] [&_ol]:list-decimal [&_ol]:pl-[1.3rem] [&_li]:mb-[0.4rem] [&_blockquote]:my-[1.4rem] [&_blockquote]:border-l-3 [&_blockquote]:border-sage [&_blockquote]:py-[0.4rem] [&_blockquote]:pl-[1.2rem] [&_blockquote]:font-display-italic [&_blockquote]:text-s125 [&_blockquote]:text-ink-soft [&_code]:rounded-[4px] [&_code]:bg-paper-2 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.9em] [&_a]:underline-offset-3";

export function Prose({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return <div className={cn(PROSE, className)} {...props} />;
}
