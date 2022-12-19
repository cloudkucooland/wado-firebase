import type { prayerFromFirestore } from "./types";

export default class prayer {
  public name: string;
  public body: string;
  public reviewed: boolean;
  public license: boolean;
  public lastEditor: string;
  public lastEdited: string;
  public author: string;
  public media: string;
  public class: string;

  public constructor(obj: prayerFromFirestore) {
    if (obj.Name) this.name = obj.Name;
    if (obj.Body) this.body = obj.Body;
    if (obj.Author) this.author = obj.Author;
    if (obj.Reviewed) this.reviewed = obj.Reviewed;
    if (obj.License) this.license = obj.License;
    if (obj["Last Editor"]) this.lastEditor = obj["Last Editor"];
    if (obj["Last Edited"]) this.lastEdited = obj["Last Edited"];
    if (obj.Media) this.media = obj.Media;
    if (obj.Class) this.class = obj.Class;
  }

  public toFirebase() {
    return {
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
  }

  public get shortname() {
    if (this.name.length < 30) return this.name;

    const words: Array<string> = this.name.split(" ");
    let shortName: string = "";
    let i: number = 0;
    while (shortName.length < 25) {
      if (i > 0) shortName += " ";
      shortName += words[i];
      i = i + 1;
    }
    return shortName;
  }
}
