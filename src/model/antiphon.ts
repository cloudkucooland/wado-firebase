import prayer from "./prayer";

export default class antiphon extends prayer {
  public constructor(obj: any) {
    super(obj);
    this.class = obj["Class"] ? obj["Class"] : "Antiphon";
  }
}
