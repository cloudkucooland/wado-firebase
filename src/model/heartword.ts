import type { prayerFromFirestore } from "./types";
import prayer from "./prayer";

export default class heartword extends prayer {
  public constructor(obj: prayerFromFirestore) {
    super(obj);
    if (obj.Class) this.class = obj.Class;
  }
}
