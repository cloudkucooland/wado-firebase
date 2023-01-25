import season from "./season";
import type proper from "./proper";
import { doc } from "firebase/firestore";
import { db } from "../firebase";
import type { associationFromFirestore } from "./types";

export default class association {
  public id: string;
  public CalendarDate: string;
  public Location: string;
  public Proper: number;
  public Season: string;
  public Weekday: number;
  public Weight: number;
  public Year: string;
  public Reference: any;
  private _dirty: boolean;
  private _season: season;

  constructor(id: string, d: associationFromFirestore) {
    this.id = id;

    this.Location = d.Location ? d.Location : "UNSET";
    if (association.locations.indexOf(this.Location) == -1) {
      console.error("invalid location detected", d.Location);
      this._dirty = true;
      this.Location = "UNSET";
    }

    // triggers a delete in the location editor -- probably not the best thing here
    this.Reference = d.Reference ? d.Reference : "FIXME";
    if (this.Reference === "FIXME") {
      console.error("missing reference");
      this._dirty = true;
    }

    this.CalendarDate = d.CalendarDate ? d.CalendarDate : "Any";
    if (
      (this.CalendarDate != "Any" && this.CalendarDate.length < 3) ||
      this.CalendarDate.length > 5
    ) {
      console.error("invalid calendar date detected", this.CalendarDate);
      this._dirty = true;
      this.CalendarDate = "Any";
      // check to make sure in the format mm-dd
      // split on -, convert to numbers, rebuild
    }

    this.Season = d.Season ? d.Season : "Any";
    if (!season.LUT.has(this.Season)) {
      console.error("invalid season detected", d.Season);
      this._dirty = true;
      this.Season = "Any";
    }
    this._season = season.LUT.get(this.Season);

    this.Proper = d.Proper ? d.Proper : -1; // Any;
    if (this.Proper < -1) {
      console.debug("invalid proper detected", this.Proper);
      this._dirty = true;
      this.Proper = -1;
    }
    if (this.Proper > this._season.maxProper) {
      console.debug(
        "invalid proper detected",
        this.Proper,
        this._season.maxProper
      );
      this._dirty = true;
      this.Proper = this._season.maxProper;
    }

    this.Weekday = d.Weekday ? +d.Weekday : -1; // Any
    if (this.Weekday < -1 || this.Weekday > 6 || isNaN(d.Weekday)) {
      console.debug("invalid weekday");
      this._dirty = true;
      this.Weekday = -1;
    }
    if (!this._season.useWeekdays && this.Weekday != -1) {
      console.debug("weekday set on season that doesn't use weekdays");
      this._dirty = true;
      this.Weekday = -1;
    }

    this.Year = d.Year ? d.Year : "Any";
    if (
      this.Year != "Any" &&
      this.Year != "A" &&
      this.Year != "B" &&
      this.Year != "C"
    ) {
      console.debug("invalid year");
      this._dirty = true;
      this.Year = "Any";
    }

    this.Weight = d.Weight ? +d.Weight : 1;

    // ignore everything else if calendar date is set
    if (this.CalendarDate != "Any") {
      if (this.Season != "Any") {
        this._dirty = true;
        this.Season = "Any";
      }
      if (this.Proper != -1) {
        this._dirty = true;
        this.Proper = -1;
      }
      if (this.Weekday != -1) {
        this._dirty = true;
        this.Weekday = -1;
      }
      if (this.Year != "Any") {
        this._dirty = true;
        this.Year = "Any";
      }
    }

    // if (this._dirty) console.error(d, this);
  }

  public toFirebase() {
    return {
      CalendarDate: this.CalendarDate,
      Location: this.Location,
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
  static sort(a: [string, association], b: [string, association]): number {
    const A = a[1];
    const B = b[1];

    const anyLastYear = (s: string) => {
      if (s === "Any") return "Z";
      return s;
    };

    const anyLastNumber = (n: number) => {
      if (n < 0) return 256;
      return String(n).padStart(3, "0");
    };

    /* a calendar date always wins
    if (A.CalendarDate !== "Any" && B.CalendarDate === "Any") return 1;
    if (A.CalendarDate === "Any" && B.CalendarDate !== "Any") return -1;
    if (A.CalendarDate !== "Any" && B.CalendarDate !== "Any")
      return A.CalendarDate.localeCompare(B.CalendarDate);
     */

    // instead of doing each value by hand, just turn it into an easily sortable string and do that
    // like, follow and subscribe for more kludgey life-hacks
    const astr =
      String(season.LUT.get(A.Season).churchPos).padStart(3, "0") +
      " " +
      anyLastNumber(A.Proper) +
      " " +
      anyLastNumber(A.Weekday) +
      " " +
      anyLastYear(A.Year) +
      " " +
      A.Weight;
    const bstr =
      String(season.LUT.get(B.Season).churchPos).padStart(3, "0") +
      " " +
      anyLastNumber(B.Proper) +
      " " +
      anyLastNumber(B.Weekday) +
      " " +
      anyLastYear(B.Year) +
      " " +
      B.Weight;
    return astr.localeCompare(bstr);
  }

  public get dirty() {
    return this._dirty;
  }

  public get dirtyStyle() {
    if (this._dirty) return "dirty";
    return "clean";
  }

  public static fromProper(p: proper): association {
    return new association("", {
      Location: "UNSET",
      Proper: +p.proper,
      Season: p.season,
      Weekday: +p.weekday,
      Weight: 1,
      Year: p.year,
      Reference: doc(db, "ex", "nihilo"),
    });
  }

  public static locations = Array(
    "COMMENDATION",
    "COMPILNE-CONFESSION",
    "COMPLINE-CHAPTER",
    "COMPLINE-CONCLUDING",
    "COMPLINE-HYMN",
    "COMPLINE-OPENING",
    "COMPLINE-OPENING-HYMN",
    "COMPLINE-PRAYER",
    "COMPLINE-PSALTER-PREFIX",
    "DIURNAL-OPENING",
    "FORGIVEN",
    "GENERAL-DISMISSAL",
    "GENERAL-GLORIA",
    "GENERAL-LORDS",
    "GENERAL-RESPONSE-SCRIPTURE",
    "GENERAL-WITHYOU",
    "GENERAL-ZECHARIAH",
    "KYRIE",
    "LAUDS-BENEDICTION",
    "LAUDS-COLLECT1",
    "LAUDS-COLLECT2",
    "LAUDS-COLLECT-FINAL",
    "LAUDS-DISMISSAL",
    "LAUDS-GLORIA",
    "LAUDS-HYMN1",
    "LAUDS-HYMN2",
    "LAUDS-OPENING",
    "LAUDS-REMEMBRANCEBAPTISM",
    "LAUDS-SEASONAL",
    "LAUDS-SUPPLICATION",
    "MAGNIFICAT",
    "MATINS-PRAYER",
    "MATINS-PSALTER",
    "NONE-CHAPTER",
    "NONE-CONCLUDING",
    "NONE-DISMISSAL",
    "NONE-PRAYER",
    "NONE-PSALTER",
    "OSL",
    "PHOS-HILARON",
    "SEXT-CHAPTER",
    "SEXT-CONCLUDING",
    "SEXT-DISMISSAL",
    "SEXT-PRAYER",
    "SEXT-PSALTER",
    "SIMEON",
    "TERCE-CHAPTER",
    "TERCE-CONCLUDING",
    "TERCE-PRAYER",
    "TERCE-PSALTER",
    "UNSET",
    "VESPER-BENEDICTION",
    "VESPER-CANTICLE",
    "VESPER-COLLECT1",
    "VESPER-COLLECT2",
    "VESPER-COLLECT3",
    "VESPER-COMMEMORATION",
    "VESPER-CONFESSION",
    "VESPER-DISMISSAL",
    "VESPER-GLORIA",
    "VESPER-HEARWORD",
    "VESPER-HYMN",
    "VESPER-PARDON",
    "VESPERS-LIGHT",
    "VESPER-SUPPLICATION"
  );
}
