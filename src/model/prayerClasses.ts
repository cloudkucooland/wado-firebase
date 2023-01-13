import prayer from "./prayer";
import psalm from "./psalm";
import hymn from "./hymn";
import heartword from "./heartword";
import antiphon from "./antiphon";

export interface prayerClass {
  name: string;
  body: string;
  reviewed: boolean;
  license: boolean;
  lastEditor: string;
  lastEdited: string;
  author: string;
  media: string;
  class: string;
}

export const classes: Map<string, prayerClass> = new Map([
  ["prayer", prayer],
  ["psalm", psalm],
  ["hymn", hymn],
  ["heartword", heartword],
  ["antiphon", antiphon],
]);

export function getClass(className: string): prayerClass {
  if (!classes.has(className)) {
    console.log("invalid class", className);
    className = "prayer";
  }
  return classes.get(className);
}
