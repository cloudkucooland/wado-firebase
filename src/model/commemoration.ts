import type { prayerFromFirestore } from "./types";
import prayer from "./prayer";
import type { DocumentReference } from "firebase/firestore";

export default class commemoration extends prayer {
  public morningcollect: string;
  public eveningcollect: string;

  public constructor(obj: prayerFromFirestore) {
    super(obj);
    if (obj.Class) this.class = obj.Class;
    if (obj.MorningCollect) this.morningcollect = obj.MorningCollect;
    if (obj.EveningCollect) this.eveningcollect = obj.EveningCollect;
    console.log(obj, this);
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
    };
    if (this.morningcollect) out.MorningCollect = this.morningcollect;
    if (this.eveningcollect) out.EveningCollect = this.eveningcollect;
    return out;
  }
}
