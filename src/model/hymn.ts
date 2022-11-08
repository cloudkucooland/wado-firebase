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
