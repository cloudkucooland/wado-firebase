export default class hymn {
  name: string;
  body: string;
  reviewed: boolean;
  license: boolean;
  lastEditor: string;
  lastEdited: string;
  hymntune: string;
  hymnmeter: string;
  media: string;

  constructor(obj: any) {
    this.name = obj.Name;
    this.body = obj.Body;
    this.reviewed = obj.Reviewed ? obj.Reviewed : false;
    this.license = obj.License ? obj.License : false;
    this.hymntune = obj["Hymn Tune"] ? obj["Hymn Tune"] : false;
    this.hymnmeter = obj["Hymn Meter"] ? obj["Hymn Meter"] : false;
    this.lastEditor = obj["Last Editor"] ? obj["Last Editor"] : "";
    this.lastEdited = obj["Last Edited"] ? obj["Last Edited"] : "";
    this.lastEdited = obj["Media"] ? obj["Media"] : "";
  }
}
