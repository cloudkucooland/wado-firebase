export default class prayer {
  name: string;
  body: string;
  reviewed: boolean;
  license: boolean;
  lastEditor: string;
  lastEdited: string;
  credit: string;

  constructor(obj: any) {
    this.name = obj.Name;
    this.body = obj.Body;
    this.credit = obj.Credit;
    this.reviewed = obj.Reviewed ? obj.Reviewed : false;
    this.license = obj.License ? obj.License : false;
    // this.lastEditor = obj."Last Editor";
    // this.lastEdited = obj."Last Edited";
  }
}
