import prayer from "./prayer";

export default class psalm extends prayer {
  public rubric: string;

  public constructor(obj: string) {
    super(obj);
    this.class = obj["Class"] ? obj["Class"] : "psalm";
    this.rubric = obj["Rubric"] ? obj["Rubric"] : "";
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
      Rubric: this.rubric,
    };
  }
}
