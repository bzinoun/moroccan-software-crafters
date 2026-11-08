import { cn } from "@/lib/cn";
import type { TopicNote, TopicTone } from "@/lib/home-data";
import { PostIt } from "../PostIt";

// Spec: the "TopicWall" entry in msca-design/COMPONENTS.md; port of the
// `.topic-wall` rules in the former `assets/css/style.css` (`git show 1353207:assets/css/style.css`) and of the topics part of
// former `assets/js/home.js` (`git show 1353207:assets/js/home.js`). One post-it per past topic, the year in a small line.

/** A topic note; `from` (the host or the city) adds "year · from" as caption. */
export type TopicWallNote = TopicNote & { from?: string };

type TopicWallProps = {
  /** Accessible name of the group (`home.topics.title`). */
  label: string;
  /** `topicsFromEvents(events, home.topics.limit)`, or `meetupTopicBoard(events)` for the board. */
  topics: readonly TopicWallNote[];
  /**
   * `wall` (default): the centered wall of the home page. `board`: the cork
   * board of the meetup page (`#sujets`), notes start at the left.
   */
  variant?: "wall" | "board";
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

// Cork: a dotted tile on a tan color, a wooden frame and an inner dark glow.
const BOARD =
  "mt-0 justify-start rounded-card border-10 border-[#b58a55] bg-[#e9dcc3] bg-[url(data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%276%27%20height=%276%27%3E%3Ccircle%20cx=%271%27%20cy=%271%27%20r=%27.6%27%20fill=%27%23c9b48f%27%20fill-opacity=%27.5%27/%3E%3C/svg%3E)] px-7 py-9 shadow-[inset_0_0_40px_rgba(0,0,0,0.12)]";

export function TopicWall({ label, topics, variant = "wall" }: TopicWallProps) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "flex flex-wrap gap-3.5",
        variant === "board" ? BOARD : "mt-12 justify-center",
      )}
    >
      {topics.map((t, i) => (
        <PostIt
          key={t.topic}
          color={COLOR[t.tone]}
          caption={t.from ? `${t.year} · ${t.from}` : t.year}
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
