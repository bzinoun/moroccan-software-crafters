import type { Cta } from "@/content/types";
import { frenchSpacing } from "@/lib/french";
import type { FormatStepItem, TopicNote } from "@/lib/home-data";
import { toRoute } from "@/lib/routes";
import { Button } from "../Button";
import { Section } from "../Section";
import { SectionFoot } from "../SectionFoot";
import { SectionHead } from "../SectionHead";
import { TopicWall } from "./TopicWall";

// Spec: the "FormatAgenda" entry in msca-design/COMPONENTS.md; port of the
// #format section of the former `index.html` (`git show 1353207:index.html`), of `.agenda` in the former `assets/css/style.css` (`git show 1353207:assets/css/style.css`) and of
// the agenda part of the former `assets/js/home.js` (`git show 1353207:assets/js/home.js`). The head, the steps, the topics and
// the more link all come from content/home.json and content/events.json.

type FormatAgendaProps = {
  eyebrow: string;
  /** May hold one `<em>` word, drawn by the section head. */
  title: string;
  lead?: string;
  /** `formatSteps(home)`. */
  steps: FormatStepItem[];
  /** `topicsFromEvents(events, home.topics.limit)`. */
  topics: TopicNote[];
  /** `home.topics.title`, the name of the post-it wall. */
  topicsLabel: string;
  /** `home.format.more`, with the raw `.html` href of the JSON. */
  more?: Cta;
};

// The old site had four columns, two below 900px and one below 560px. The
// nearest default breakpoints are `lg` (1024px) and `sm` (640px).
const AGENDA =
  "m-0 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-4";

const CARD =
  "group flex flex-col overflow-hidden rounded-card border border-line bg-card";

const SHOT = "aspect-16/10 overflow-hidden bg-paper-2";

const PHOTO =
  "h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-[ease] motion-safe:group-hover:scale-[1.04]";

// The step number is a decoration: the ordered list already numbers its items.
const NUMBER =
  "mb-[0.2rem] block font-display text-[1.9rem] leading-none font-semibold text-red";

const TIME =
  "text-[0.78rem] font-semibold tracking-[0.06em] text-green uppercase";

export function FormatAgenda({
  eyebrow,
  title,
  lead,
  steps,
  topics,
  topicsLabel,
  more,
}: FormatAgendaProps) {
  return (
    <Section id="format" aria-labelledby="format-title">
      <SectionHead
        eyebrow={eyebrow}
        title={frenchSpacing(title)}
        lead={lead ? frenchSpacing(lead) : undefined}
        titleId="format-title"
      />
      <ol role="list" className={AGENDA}>
        {steps.map((step, i) => (
          <li key={step.title} className={CARD}>
            {step.photoSrc ? (
              <div className={SHOT}>
                {/* eslint-disable-next-line @next/next/no-img-element -- exported site, images are unoptimized */}
                <img
                  className={PHOTO}
                  src={step.photoSrc}
                  alt=""
                  loading="lazy"
                />
              </div>
            ) : null}
            <div className="px-5.5 pt-4.5 pb-5.5">
              <span aria-hidden="true" className={NUMBER}>
                {`0${i + 1}`}
              </span>
              <span className={TIME}>{frenchSpacing(step.time)}</span>
              <h3 className="mb-[0.35rem] text-[1.15rem]">
                {frenchSpacing(step.title)}
              </h3>
              <p className="m-0 text-[0.95rem] text-ink-soft">
                {frenchSpacing(step.text)}
              </p>
            </div>
          </li>
        ))}
      </ol>
      <TopicWall label={topicsLabel} topics={topics} />
      {more ? (
        <SectionFoot>
          <Button variant="ghost" href={toRoute(more.href)}>
            {frenchSpacing(more.label)}
          </Button>
        </SectionFoot>
      ) : null}
    </Section>
  );
}
