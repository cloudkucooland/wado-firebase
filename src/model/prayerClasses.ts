import prayer from "./prayer";
import psalm from "./psalm";
import hymn from "./hymn";
import antiphon from "./antiphon";
import commemoration from "./commemoration";

export interface prayerClass {
  new (any): prayerClass;
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

// keys used to generate menu in components/Edit.svelte -- must be exported
export const classes: Map<string, prayerClass> = new Map([
  ["prayer", prayer],
  ["psalm", psalm],
  ["hymn", hymn],
  ["antiphon", antiphon],
  ["commemoration", commemoration],
]);

// use getClass to actually do the lookup
export function getClass(className: string): prayerClass {
  if (!classes.has(className)) {
    console.log("invalid class", className);
    className = "prayer";
  }
  return classes.get(className);
}
