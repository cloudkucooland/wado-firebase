import type { prayerFromFirestore } from "./types";
import prayer from "./prayer";
export default class commemoration extends prayer {
  collect: string;
  constructor(obj: prayerFromFirestore);
  toFirebase(): any;
}
