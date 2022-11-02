export default class prayer {
  name: string;
  body: string;
  reviewed: boolean;
  license: boolean;
  lastEditor: string;
  lastEdited: string;
  author: string;
  media: string;
  class: string;

  constructor(obj: any) {
    this.name = obj.Name;
    this.body = obj.Body;
    this.author = obj.Author;
    this.reviewed = obj.Reviewed ? obj.Reviewed : false;
    this.license = obj.License ? obj.License : false;
    this.lastEditor = obj["Last Editor"] ? obj["Last Editor"] : "";
    this.lastEdited = obj["Last Edited"] ? obj["Last Edited"] : "";
    this.media = obj["Media"] ? obj["Media"] : "";
    this.class = obj["Class"] ? obj["Class"] : "prayer";
  }
}
