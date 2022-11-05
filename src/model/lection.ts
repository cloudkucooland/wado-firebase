// import { BibleGatewayAPI } from "bible-gateway-api";

export default class lection {
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
    this.class = obj["Class"] ? obj["Class"] : "lection";
  }

  public async fromBibleGateway() {
    // const bgw = new BibleGatewayAPI();
    let cc = "Not Found";

    try {
      // let { verse, content } = await bgw.search(this.body, "NRSV");
      // cc = content;
    } catch (e) {
      console.log(e.message);
    }
    return cc;
  }
}
