import { frenchSpacing } from "@/lib/french";
import type { StatItem } from "@/lib/home-data";
import { Container } from "../Container";

// Spec: the "StatsBand" entry in msca-design/COMPONENTS.md; port of `.stats`
// in the former `assets/css/style.css` (`git show 1353207:assets/css/style.css`). The old site went from five columns to two at
// 760px; the nearest default breakpoint is `md` (768px). Below it the last
// figure spans the row; from `md` it takes its own column again.
export function StatsBand({ items }: { items: StatItem[] }) {
  return (
    <section
      aria-label="Chiffres clés"
      className="border-y border-line bg-paper-2 py-7"
    >
      <Container>
        <ul
          role="list"
          className="m-0 grid list-none grid-cols-2 gap-5 p-0 md:grid-cols-5 md:gap-4"
        >
          {items.map((item) => (
            <li
              key={item.label}
              className="text-center last:col-span-full md:last:col-auto"
            >
              <b className="block font-display text-[length:clamp(1.8rem,3vw,2.4rem)] leading-[1.1] font-semibold text-green">
                {frenchSpacing(item.value)}
              </b>
              <span className="text-[0.88rem] text-ink-soft">
                {frenchSpacing(item.label)}
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
