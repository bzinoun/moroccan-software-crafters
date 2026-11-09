// The SoCraTes page content: content/events.json is the single source of the
// editions, so this module joins content/socrates.json to the events. Pure:
// it reads no file.

import type { Event, Socrates, SocratesFile } from "@/content/types";
import { fmtDayRange } from "./derive";

const ORDINALS = ["1re", "2e", "3e", "4e", "5e", "6e"];

/** "1re édition" for the number 1, "2e édition" for 2, and so on. */
export function editionLabel(rank: number): string {
  return `${ORDINALS[rank - 1] ?? `${rank}e`} édition`;
}

/** The events of type socrates, oldest first. */
export function socratesEvents(events: Event[]): Event[] {
  return events
    .filter((e) => e.type === "socrates")
    .sort((a, b) => a.date.localeCompare(b.date));
}

/** Joins the editions and the counter facts of the file to the events. */
export function resolveSocrates(file: SocratesFile, events: Event[]): Socrates {
  const editions = socratesEvents(events);
  const partners = new Set(editions.flatMap((e) => e.sponsors ?? []));
  const items = file.editions.items
    .map((item) => {
      const rank = editions.findIndex((e) => e.id === item.event);
      const event = editions[rank];
      if (!event) {
        throw new Error(
          `content/socrates.json: "${item.event}" is not an event of type socrates in content/events.json`,
        );
      }
      if (event.participants === undefined) {
        throw new Error(
          `content/events.json: the SoCraTes event "${event.id}" has no participants`,
        );
      }
      return { item, event, rank, participants: event.participants };
    })
    .sort((a, b) => a.rank - b.rank)
    .map(({ item, event, rank, participants }) => ({
      year: event.date.slice(0, 4),
      edition: editionLabel(rank + 1),
      city: event.city,
      ...(event.venue ? { venue: event.venue } : {}),
      dates: fmtDayRange(event.date, event.endDate),
      participants,
      partners: event.sponsors?.length ?? 0,
      ...(item.photo ? { photo: item.photo } : {}),
      text: item.text,
    }));
  const facts = file.hero.facts.map((fact) => {
    if (fact.key === "editions") {
      return { value: String(editions.length), label: fact.label };
    }
    if (fact.key === "partners") {
      return { value: String(partners.size), label: fact.label };
    }
    return { value: fact.value ?? "", label: fact.label };
  });
  return {
    ...file,
    hero: { ...file.hero, facts },
    editions: { ...file.editions, items },
  };
}
