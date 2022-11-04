import { locations } from "../util";

export default class association {
  id: string;
  CalendarDate: string;
  Location: string;
  PrayerName: string; // to be removed, redundant with reference.
  Proper: number;
  Season: string;
  Weekday: number;
  Weight: number;
  Year: string;
  Reference: any;

  constructor(obj: any) {
    this.id = obj.id;
    const d = obj.data();

    this.CalendarDate = d.CalendarDate ? d.CalendarDate : "Any";
    this.Location = d.Location ? d.Location : "UNSET";

    if (locations.indexOf(this.Location) == -1) {
      console.error("invalid location detected", d.Location);
      this.Location = "UNSET";
    }

    this.PrayerName = d.PrayerName ? d.PrayerName : "UNSET";
    this.Proper = d.Proper ? d.Proper : -1; // Any;
    this.Season = d.Season ? d.Season : "Any";
    this.Weekday = d.Weekday ? d.Weekday : -1; // Any
    this.Weight = d.Weight ? d.Weight : 1;
    this.Year = d.Year ? d.Year : "Any";

    this.Reference = d.Reference ? d.Reference : "FIXME";
    // console.log(d, this);
  }

  WeekdayDisplay() {
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

  ProperDisplay() {
    if (this.Proper == -1) return "Any";
    return this.Proper;
  }

  ReferenceDisplay() {
    return this.Reference.id;
  }
}
