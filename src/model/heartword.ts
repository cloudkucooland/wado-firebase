export default class heartword {
  public name: string;
  public body: string;
  public reviewed: boolean;
  public license: boolean;
  public lastEditor: string;
  public lastEdited: string;
  public author: string;
  public class: string;

  constructor(obj: any) {
    this.name = obj.Name;
    this.body = obj.Body;
    this.author = obj.Author;
    this.reviewed = obj.Reviewed ? obj.Reviewed : false;
    this.license = obj.License ? obj.License : false;
    this.lastEditor = obj["Last Editor"] ? obj["Last Editor"] : "";
    this.lastEdited = obj["Last Edited"] ? obj["Last Edited"] : "";
    this.class = obj["Class"] ? obj["Class"] : "Heartword";
  }
}
