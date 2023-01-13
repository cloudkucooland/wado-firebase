import type { prayerFromFirestore } from "./types";
import prayer from "./prayer";
import type { DocumentReference } from "firebase/firestore";

export default class commendation extends prayer {
  public collect: string;

  public constructor(obj: prayerFromFirestore) {
    super(obj);
    if (obj.Class) this.class = obj.Class;
    if (obj.Collect) this.rubric = obj.Collect;
  }

  public toFirebase(): any {
    const out: any = {
      Name: this.name,
      Body: this.body,
      Author: this.author,
      Reviewed: this.reviewed,
      License: this.license,
      "Last Editor": this.lastEditor,
      "Last Edited": this.lastEdited,
      Media: this.media,
      Class: this.class,
      Collect: this.collect,
    };
    return out;
  }
}