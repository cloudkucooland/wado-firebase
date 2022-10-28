export default class hymn {
  name: string;
  body: string;
  reviewed: boolean;
  license: boolean;
  lastEditor: string;
  lastEdited: string;

  constructor(obj: any) {
    this.name = obj.Name;
    this.body = obj.Body;
    this.reviewed = obj.Reviewed ? obj.Reviewed : false;
    this.license = obj.License ? obj.License : false;
  }
}
