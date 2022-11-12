import prayer from "./prayer";

export default class psalm extends prayer {
  public rubric: string;

  public constructor(obj: any) {
    super(obj);
    this.class = obj["Class"] ? obj["Class"] : "psalm";
    this.rubric = obj["Rubric"] ? obj["Rubric"] : "";
  }

  public toFirebase() {
    return {
      Name: this.name.trim(),
      Body: this.body.trim(),
      Author: this.author.trim(),
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
