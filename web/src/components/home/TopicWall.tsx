import { cn } from "@/lib/cn";
import type { TopicNote, TopicTone } from "@/lib/home-data";
import { PostIt } from "../PostIt";

// Spec: the "TopicWall" entry in msca-design/COMPONENTS.md; port of the
// `.topic-wall` rules in assets/css/style.css and of the topics block of
// assets/js/home.js. One post-it per past topic, the year in a small line.

type TopicWallProps = {
  /** Accessible name of the group (`home.topics.title`). */
  label: string;
  /** `topicsFromEvents(events, home.topics.limit)`. */
  topics: TopicNote[];
};

// The old site named the first color "" (the base yellow note); the data layer
// calls it "default".
const COLOR = {
  default: "yellow",
  pink: "pink",
  green: "green",
  blue: "blue",
  orange: "orange",
} as const satisfies Record<TopicTone, string>;

// Old rules by 1-based position: odd -2deg, even 1.5deg, every third -0.5deg
// (declared last, so it wins). `i` is the 0-based index.
function tilt(i: number): string {
  if (i % 3 === 2) return "-rotate-[0.5deg]";
  return i % 2 === 0 ? "-rotate-2" : "rotate-[1.5deg]";
}

export function TopicWall({ label, topics }: TopicWallProps) {
  return (
    <div
      role="group"
      aria-label={label}
      className="mt-12 flex flex-wrap justify-center gap-3.5"
    >
      {topics.map((t, i) => (
        <PostIt
          key={t.topic}
          color={COLOR[t.tone]}
          caption={t.year}
          className={cn(
            "w-auto max-w-60 p-[12px_16px_14px] text-[1.25rem]",
            tilt(i),
          )}
        >
          {t.topic}
        </PostIt>
      ))}
    </div>
  );
}
