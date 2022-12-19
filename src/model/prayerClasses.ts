import prayer from "./prayer";
import psalm from "./psalm";
import hymn from "./hymn";
import heartword from "./heartword";
import antiphon from "./antiphon";

export const classes = new Map([
  ["prayer", prayer],
  ["psalm", psalm],
  ["hymn", hymn],
  ["heartword", heartword],
  ["antiphon", antiphon],
]);

export function getClass(className: string) {
  if (!classes.has(className)) {
    console.log("invalid class", className);
    className = "prayer";
  }
  return classes.get(className);
}
