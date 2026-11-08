import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

// Spec: the "ArticleView, Prose" entry in msca-design/COMPONENTS.md; port of
// `.prose` in the former `assets/css/style.css` (`git show 1353207:assets/css/style.css`). The wrapper styles the bare elements that
// `md()` returns (h2, h3, h4, p, ul, ol, li, blockquote, code, a), so the
// renderer stays free of classes. `md()` maps "#" to h2 and "##" to h3, which
// the old rules sized at 1.6rem and 1.5rem. Preflight removed the list markers,
// the heading margins and the link line: restore them here. `leading-*`
// comes after the text size so the merge keeps it.
// Spacing steps that are not quarters of 1rem are rem literals.
const PROSE =
  "text-[1.08rem] leading-[1.7] [&_h2]:mt-8 [&_h2]:mb-[0.6rem] [&_h2]:text-[1.6rem] [&_h3]:mt-[1.8rem] [&_h3]:mb-2 [&_h3]:text-[1.5rem] [&_ul]:mb-[1.2rem] [&_ul]:list-disc [&_ul]:pl-[1.3rem] [&_ol]:mb-[1.2rem] [&_ol]:list-decimal [&_ol]:pl-[1.3rem] [&_li]:mb-[0.4rem] [&_blockquote]:my-[1.4rem] [&_blockquote]:border-l-3 [&_blockquote]:border-sage [&_blockquote]:py-[0.4rem] [&_blockquote]:pl-[1.2rem] [&_blockquote]:font-display [&_blockquote]:text-[1.25rem] [&_blockquote]:text-ink-soft [&_blockquote]:italic [&_code]:rounded-[4px] [&_code]:bg-paper-2 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.9em] [&_a]:underline [&_a]:underline-offset-3";

export function Prose({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return <div className={cn(PROSE, className)} {...props} />;
}
