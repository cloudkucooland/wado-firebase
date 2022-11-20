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

  public constructor(obj: any) {
    this.name = obj.Name;
    this.body = obj.Body;
    this.author = obj.Author ? obj.Author : "";
    this.reviewed = obj.Reviewed ? obj.Reviewed : false;
    this.license = obj.License ? obj.License : false;
    this.lastEditor = obj["Last Editor"] ? obj["Last Editor"] : "";
    this.lastEdited = obj["Last Edited"] ? obj["Last Edited"] : "";
    this.media = obj["Media"] ? obj["Media"] : "";
    this.class = obj["Class"] ? obj["Class"] : "prayer";
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
