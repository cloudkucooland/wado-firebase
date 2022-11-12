import prayer from "./prayer";

export default class hymn extends prayer {
  public hymntune: string;
  public hymnmeter: string;

  public constructor(obj: any) {
    super(obj);
    this.hymntune = obj["Hymn Tune"] ? obj["Hymn Tune"] : false;
    this.hymnmeter = obj["Hymn Meter"] ? obj["Hymn Meter"] : false;
    this.class = obj["Class"] ? obj["Class"] : "hymn";
  }

  public toFirebase() {
    return {
      Name: this.name.trim(),
      Body: this.body.trim(),
      Reviewed: this.reviewed,
      License: this.license,
      Author: this.author.trim(),
      "Last Editor": this.lastEditor,
      "Last Edited": this.lastEdited,
      "Hymn Meter": this.hymnmeter.trim(),
      "Hymn Tune": this.hymntune.trim(),
      Media: this.media,
      Class: this.class,
    };
  }
}
