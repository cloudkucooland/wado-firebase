export default class hymn {
  public name: string;
  public body: string;
  public reviewed: boolean;
  public license: boolean;
  public lastEditor: string;
  public lastEdited: string;
  public hymntune: string;
  public hymnmeter: string;
  public media: string;
  public class: string;

  constructor(obj: any) {
    this.name = obj.Name;
    this.body = obj.Body;
    this.reviewed = obj.Reviewed ? obj.Reviewed : false;
    this.license = obj.License ? obj.License : false;
    this.hymntune = obj["Hymn Tune"] ? obj["Hymn Tune"] : false;
    this.hymnmeter = obj["Hymn Meter"] ? obj["Hymn Meter"] : false;
    this.lastEditor = obj["Last Editor"] ? obj["Last Editor"] : "";
    this.lastEdited = obj["Last Edited"] ? obj["Last Edited"] : "";
    this.media = obj["Media"] ? obj["Media"] : "";
    this.class = obj["Class"] ? obj["Class"] : "hymn";
  }
}
