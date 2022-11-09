import { locations, seasons, seasonLUT } from "../util";

export default class association {
  public id: string;
  public CalendarDate: string;
  public Location: string;
  public PrayerName: string; // to be removed, redundant with reference.
  public Proper: number;
  public Season: string;
  public Weekday: number;
  public Weight: number;
  public Year: string;
  public Reference: any;

  constructor(obj: any) {
    this.id = obj.id;
    const d = obj.data();
    // console.debug(d);

    this.CalendarDate = d.CalendarDate ? d.CalendarDate : "Any";
    // check to make sure in the format mm-dd

    this.Location = d.Location ? d.Location : "UNSET";
    if (locations.indexOf(this.Location) == -1) {
      console.error("invalid location detected", d.Location);
      this.Location = "UNSET";
    }

    this.PrayerName = d.PrayerName ? d.PrayerName : "UNSET";

    this.Proper = d.Proper ? d.Proper : -1; // Any;
    // make sure that proper is sane, e.g.
    if (this.Proper < -1) this.Proper = -1;
    if (this.Season == "christmas" && this.Proper > 12) this.Proper = 12;

    this.Season = d.Season ? d.Season : "Any";
    if (this.Season != "Any" && seasons.indexOf(this.Season) == -1) {
      console.error("invalid season detected", d.Season);
      this.Season = "Any";
    }

    this.Weekday = d.Weekday ? +d.Weekday : -1; // Any
    this.Weight = d.Weight ? +d.Weight : 1;

    this.Year = d.Year ? d.Year : "Any";
    if (
      this.Year != "Any" &&
      this.Year != "A" &&
      this.Year != "B" &&
      this.Year != "C"
    )
      this.Year = "Any";

    this.Reference = d.Reference ? d.Reference : "FIXME";
    // console.log(d, this);
  }

  public toFirebase() {
    return {
      CalendarDate: this.CalendarDate,
      Location: this.Location,
      PrayerName: this.PrayerName,
      Proper: this.Proper,
      Season: this.Season,
      Weekday: this.Weekday,
      Weight: this.Weight,
      Year: this.Year,
      Reference: this.Reference,
    };
  }

  public get WeekdayDisplay() {
    const days = new Map([
      [-1, "Any"],
      [0, "Sunday"],
      [1, "Monday"],
      [2, "Tuesday"],
      [3, "Wednesday"],
      [4, "Thursday"],
      [5, "Friday"],
      [6, "Saturday"],
    ]);
    return days.get(this.Weekday);
  }

  public get ProperDisplay() {
    if (this.Proper == -1) return "Any";
    return this.Proper;
  }

  public get ReferenceDisplay() {
    return this.Reference.id;
  }

  // A negative number if a occurs before b; positive if the a occurs after b ; 0 if they are equivalent.
  static sort(a, b) {
    const A = a[1];
    const B = b[1];

    /* a calendar date always wins
    if (A.CalendarDate !== "Any" && B.CalendarDate === "Any") return 1;
    if (A.CalendarDate === "Any" && B.CalendarDate !== "Any") return -1;
    if (A.CalendarDate !== "Any" && B.CalendarDate !== "Any")
      return A.CalendarDate.localeCompare(B.CalendarDate);
     */

    // weekday is wrong
    const astr =
      seasonLUT.get(A.Season) +
      " " +
      association.anyLastNumber(A.Proper) +
      " " +
      association.anyLastNumber(A.Weekday) +
      " " +
      association.anyLastYear(A.Year) +
      " " +
      A.Weight;
    const bstr =
      seasonLUT.get(B.Season) +
      " " +
      association.anyLastNumber(B.Proper) +
      " " +
      association.anyLastNumber(B.Weekday) +
      " " +
      association.anyLastYear(B.Year) +
      " " +
      B.Weight;
    return astr.localeCompare(bstr);
  }

  static anyLastYear(s: string) {
    if (s === "Any") return "Z";
    return s;
  }

  static anyLastNumber(n: number) {
    if (n < 0) return 99;
    return n;
  }
}
