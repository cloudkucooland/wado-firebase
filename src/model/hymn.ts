import type { prayerFromFirestore } from "./types";
import prayer from "./prayer";

export default class hymn extends prayer {
  public hymntune: string;
  public hymnmeter: string;

  public constructor(obj: prayerFromFirestore) {
    super(obj);
    if (obj["Hymn Tune"]) this.hymntune = obj["Hymn Tune"];
    if (obj["Hymn Meter"]) this.hymnmeter = obj["Hymn Meter"];
    if (obj.Class) this.class = obj.Class;
  }

  public toFirebase() {
    return {
      Name: this.name,
      Body: this.body,
      Reviewed: this.reviewed,
      License: this.license,
      Author: this.author,
      "Last Editor": this.lastEditor,
      "Last Edited": this.lastEdited,
      "Hymn Meter": this.hymnmeter,
      "Hymn Tune": this.hymntune,
      Media: this.media,
      Class: this.class,
    };
  }
}
