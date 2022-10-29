export default class proper {
  caldate: string;
  proper: number;
  season: string;
  weekday: number;
  year: string;

  // incoming format yyyy-mm-dd
  constructor(simple: string) {
    console.debug("new proper()", simple);
    const s = simple.split("-");
    const d = new Date(s[0], s[1], s[2]);

    this.caldate = s[1] + "-" + s[2]; // stored in Firestore as m-d / mm-dd
    this.weekday = d.getDay();

    const years = ["A", "B", "C"];
    this.year = years[(+s[0] + 2) % 3];

    this.proper = 1; // tbd
    this.season = "advent"; // tbd
  }

  toString() {
    return (
      "(" +
      this.caldate +
      ") (" +
      this.season +
      "-" +
      this.proper +
      ") - " +
      this.weekday +
      " " +
      this.year
    );
  }
}
