export default class psalm {
  public name: string;
  public body: string;
  public reviewed: boolean;
  public license: boolean;
  public lastEditor: string;
  public lastEdited: string;
  public media: string;
  public class: string;

  constructor(obj: any) {
    this.name = obj.Name;
    this.body = obj.Body;
    this.reviewed = obj.Reviewed ? obj.Reviewed : false;
    this.license = obj.License ? obj.License : false;
    this.lastEditor = obj["Last Editor"] ? obj["Last Editor"] : "";
    this.lastEdited = obj["Last Edited"] ? obj["Last Edited"] : "";
    this.media = obj["Media"] ? obj["Media"] : "";
    this.class = obj["Class"] ? obj["Class"] : "psalm";
  }

  public toFirebase() {
    return {
      Name: this.name,
      Body: this.body,
      Reviewed: this.reviewed,
      License: this.license,
      LastEditor: this.lastEditor,
      LastEdited: this.lastEdited,
      Media: this.media,
      Class: this.class,
    };
  }
}
