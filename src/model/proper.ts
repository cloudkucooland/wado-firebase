export default class proper {
  caldate: string;
  proper: number;
  season: string;
  week: number;

  constructor(obj: any) {
    this.caldate = obj.caldate ? obj.caldate : "";
    this.proper = obj.proper ? obj.proper : 0;
    this.season = obj.season ? obj.season : "";
    this.week = obj.week ? obj.week : 0;
  }

  default() {
    this.proper = 1;
    this.season = "advent";
    this.week = 1;
  }

  toString() {
    return (
      this.caldate + "-" + this.proper + "-" + this.season + "-" + this.week
    );
  }
}
