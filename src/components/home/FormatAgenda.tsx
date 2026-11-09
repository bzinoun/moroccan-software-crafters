import type { Cta } from "@/content/types";
import { frenchSpacing } from "@/lib/french";
import type { FormatStepItem, TopicNote } from "@/lib/home-data";
import { Button } from "../Button";
import { Section } from "../Section";
import { SectionFoot } from "../SectionFoot";
import { SectionHead } from "../SectionHead";
import { TopicWall } from "./TopicWall";
import { Photo } from "../Photo";

// Spec: the "FormatAgenda, TopicWall" entry in msca-design/COMPONENTS.md.
// The head, the steps, the topics and the more link all come from
// content/home.json and content/events.json.

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
  /** `home.format.more`. */
  more?: Cta;
};

// Four columns from `lg` (1024px), two from `sm` (640px), one below.
const AGENDA =
  "m-0 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-4";

const CARD =
  "group flex flex-col overflow-hidden rounded-card border border-line bg-white";

const SHOT = "aspect-16/10 overflow-hidden bg-paper-2";

const PHOTO =
  "h-full w-full object-cover motion-safe:transition-[scale] motion-safe:duration-500 motion-safe:ease-standard motion-safe:group-hover:scale-104";

// The step number is a decoration: the ordered list already numbers its items.
const NUMBER =
  "mb-[0.2rem] block font-display text-s190 leading-none font-semibold text-red";

const TIME = "text-s78 font-semibold tracking-[0.06em] text-green uppercase";

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
        title={title}
        lead={lead}
        titleId="format-title"
      />
      {steps.length > 0 ? (
        <ol role="list" className={AGENDA}>
          {steps.map((step, i) => (
            <li key={`${i}-${step.title}`} className={CARD}>
              {step.photoSrc ? (
                <div className={SHOT}>
                  <Photo className={PHOTO} src={step.photoSrc} alt="" />
                </div>
              ) : null}
              <div className="px-5.5 pt-4.5 pb-5.5">
                <span aria-hidden="true" className={NUMBER}>
                  {`0${i + 1}`}
                </span>
                <span className={TIME}>{frenchSpacing(step.time)}</span>
                <h3 className="mb-[0.35rem] text-s115">
                  {frenchSpacing(step.title)}
                </h3>
                <p className="m-0 text-s95 text-ink-soft">
                  {frenchSpacing(step.text)}
                </p>
              </div>
            </li>
          ))}
        </ol>
      ) : null}
      <TopicWall label={topicsLabel} topics={topics} />
      {more ? (
        <SectionFoot>
          <Button variant="ghost" href={more.href}>
            {frenchSpacing(more.label)}
          </Button>
        </SectionFoot>
      ) : null}
    </Section>
  );
}
