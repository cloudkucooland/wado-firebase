import season from "./season";

export default class proper {
  public caldate: string;
  public proper: number;
  public season: string;
  public weekday: number;
  public year: string;

  // type FeastMap = Record:<string, Date> // something for when I get bored

  private _feasts: Map<string, Date>;

  constructor(inObj: {
    caldate?: string;
    proper?: number;
    season?: string;
    weekday?: number;
    year?: string;
  }) {
    this.caldate = inObj.caldate ? inObj.caldate : "manual";
    this.proper = inObj.proper ? inObj.proper : -1;
    this.season = inObj.season ? inObj.season : "Any";
    this.weekday = typeof inObj.weekday != "undefined" ? inObj.weekday : -1;
    this.year = inObj.year ? inObj.year : "Any";

    if (this.season == "beforeadvent") this.season = "afterpentecost";

    if (!season.LUT.has(this.season)) {
      console.error("invalid season");
      throw new Error("invalid season");
    }
    const s = season.LUT.get(this.season);

    if (this.proper > s.maxProper) {
      console.error("invalid proper");
      this.proper = -1;
    }
    if ((this.weekday != -1 && !s.useWeekdays) || this.weekday > 6) {
      console.error("invalid weekday", this.weekday);
      this.weekday = -1;
    }
    const years = ["C", "A", "B", "Any"];
    if (years.indexOf(this.year) == -1) {
      console.error("invalid year");
      this.year = "Any";
    }
  }

  // incoming format yyyy-mm-dd
  public static fromDate(simple: string): proper {
    try {
      const s = simple.split("-");
      const d = new Date(+s[0], +s[1] - 1, +s[2]); // month is base 0, not base 1
      const newProper = new proper({ caldate: +s[1] + "-" + +s[2] }); // stored in Firestore as m-d / mm-dd, base 1
      newProper.weekday = d.getDay();

      newProper._setFeasts(+s[0]);
      newProper._getSeason(d);
      return newProper;
    } catch (err) {
      console.log(err);
    }
    return new proper({});
  }

  // public toString(): string { return this.propername; }

  private _weekdayDisplay(day?: number): string {
    if (!day) day = this.weekday;

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
    return days.get(day);
  }

  private _addDays(d: Date, days: number): Date {
    const n = new Date(d);
    n.setDate(n.getDate() + days);
    return n;
  }

  private _setFeasts(year: number): void {
    const easter = this.getEaster(year);

    // BOL is Sunday
    let sundayafterepi = new Date(year, 0, 6, 0, 0, 0);
    if (sundayafterepi.getDay() != 0) {
      sundayafterepi = this._addDays(
        sundayafterepi,
        7 - sundayafterepi.getDay()
      );
    }

    // Christ the King is always on Sunday
    let christking = new Date(year, 10, 20, 0, 0, 0);
    if (christking.getDay() != 0) {
      christking = this._addDays(christking, 7 - christking.getDay());
    }

    // afterpentecost propers start the first Sunday after May 1
    let proper1 = new Date(year, 4, 2, 0, 0, 0);
    if (proper1.getDay() != 0) {
      proper1 = this._addDays(proper1, 7 - proper1.getDay());
    }

    // if Trinity Sunday falls before May 22...
    let trinity = this._addDays(easter, 56);
    let proper0 = new Date(year, 4, 22, 0, 0, 0);
    if (proper0.getDay() != 0) {
      proper0 = this._addDays(proper0, 7 - proper0.getDay());
    }
    if (trinity < proper0) {
      console.log("use proper-zero season");
    }

    this._feasts = new Map<string, Date>([
      ["easter", easter],

      ["epiphany", new Date(year, 0, 6, 0, 0, 0)],

      /* almost everthing is relative to easter */
      ["ashwednesday", this._addDays(easter, -46)],
      ["palmsunday", this._addDays(easter, -7)],
      ["maundythursday", this._addDays(easter, -3)],
      ["goodfriday", this._addDays(easter, -2)],
      ["holysaturday", this._addDays(easter, -1)],
      ["ascensioneve", this._addDays(easter, 38)],
      ["ascension", this._addDays(easter, 39)],
      ["pentecost", this._addDays(easter, 49)],
      ["trinity", trinity],
      ["stluke", new Date(year, 9, 18, 0, 0, 0)],

      // when "proper 1" starts: first Sunday after May 1
      ["proper0", proper0],
      ["proper1", proper1],

      // First Sunday after Jan 6 */
      ["sundayafterepi", sundayafterepi],

      /* Christ the King is Sunday on or after Nov 20 */
      ["christking", christking],

      /* advent starts the following week */
      ["advent", this._addDays(christking, 7)],

      /* Chrismas has a fixed date */
      ["christmaseve", new Date(year, 11, 24, 0, 0, 0)],
      ["christmas", new Date(year, 11, 25, 0, 0, 0)],
    ]);
  }

  // https://gist.github.com/johndyer/0dffbdd98c2046f41180c051f378f343
  private getEaster(year: number): Date {
    const f = Math.floor;
    // Golden Number - 1
    const G: number = year % 19;
    const C: number = f(year / 100);
    // related to Epact
    const H: number = (C - f(C / 4) - f((8 * C + 13) / 25) + 19 * G + 15) % 30;
    // number of days from 21 March to the Paschal full moon
    const I: number = H - f(H / 28) * (1 - f(29 / (H + 1)) * f((21 - G) / 11));
    // weekday for the Paschal full moon
    const J: number = (year + f(year / 4) + I + 2 - C + f(C / 4)) % 7;
    // number of days from 21 March to the Sunday on or before the Paschal full moon
    const L: number = I - J;
    const month: number = 3 + f((L + 40) / 44);
    const day: number = L + 28 - 31 * f(month / 4);

    return new Date(year, month - 1, day, 0, 0, 0);
  }

  // https://stackoverflow.com/questions/8619879/javascript-calculate-the-day-of-the-year-1-366
  private getDayOfYear(d: Date): number {
    const start: Date = new Date(d.getFullYear(), 0, 0);
    const dif: number =
      d.getTime() -
      start.getTime() +
      (start.getTimezoneOffset() - d.getTimezoneOffset()) * 60 * 1000;

    return Math.floor(dif / 86400000);
  }

  // day of year for a feast
  private _fdoy(n: string): number {
    return this.getDayOfYear(this._feasts.get(n));
  }

  private _getSeason(forday: Date): void {
    let isnextlectyear: boolean = false; // needed for lectionary year at bottom of method
    const nextday = 86400000;
    const f = (n: string): number => {
      // shortcut for getting a feast's getTime()
      return this._feasts.get(n).getTime();
    };
    const t = forday.getTime();

    // determine the season, proper
    if (t < f("epiphany")) {
      this.season = "christmas";
      this.proper = this.getDayOfYear(forday) - this._fdoy("christmas") + 366;
    } else if (t >= f("epiphany") && t < f("epiphany") + nextday) {
      this.season = "epiphany";
      this.proper = 0;
    } else if (t >= f("epiphany") + nextday && t < f("sundayafterepi")) {
      this.season = "baptismoflord";
      // proper is number of days after epiphany
      this.proper = this.getDayOfYear(forday) - this._fdoy("epiphany");
    } else if (t > f("epiphany") && t < f("ashwednesday")) {
      this.season = "afterepiphany";
      const daysintoordtime =
        this.getDayOfYear(forday) - this._fdoy("epiphany") + 1;
      this.proper = Math.floor(daysintoordtime / 7) + 1;
    } else if (t >= f("ashwednesday") && t < f("ashwednesday") + nextday) {
      this.season = "ashwednesday";
      this.proper = 0;
    } else if (t > f("ashwednesday") && t < f("palmsunday")) {
      this.season = "lent";
      const daysintolent =
        this.getDayOfYear(forday) - this._fdoy("ashwednesday") - 1;
      this.proper = Math.floor(daysintolent / 7) + 1;
    } else if (t >= f("palmsunday") && t < f("palmsunday") + nextday) {
      this.season = "palmsunday";
      this.proper = 0;
    } else if (t > f("palmsunday") && t < f("maundythursday")) {
      this.season = "holyweek";
      this.proper = 1;
    } else if (t >= f("maundythursday") && t < f("goodfriday")) {
      this.season = "maundythursday";
      this.proper = 0;
    } else if (t >= f("goodfriday") && t < f("holysaturday")) {
      this.season = "goodfriday";
      this.proper = 0;
    } else if (t >= f("holysaturday") && t < f("easter")) {
      this.season = "holysaturday";
      this.proper = 0;
    } else if (t >= f("easter") && t < f("easter") + nextday) {
      this.season = "easter";
      this.proper = 0;
    } else if (t > f("easter") && t < f("ascension")) {
      this.season = "greatfifty";
      const daysaftereaster =
        this.getDayOfYear(forday) - (this._fdoy("easter") + 1);
      this.proper = Math.floor(daysaftereaster / 7) + 1;
    } else if (t >= f("ascensioneve") && t < f("ascension")) {
      this.season = "ascensioneve";
      this.proper = 0;
    } else if (t >= f("ascension") && t < f("ascension") + nextday) {
      this.season = "ascension";
      this.proper = 0;
    } else if (t > f("ascension") && t < f("pentecost")) {
      this.season = "greatfifty";
      const daysaftereaster =
        this.getDayOfYear(forday) - (this._fdoy("easter") + 1);
      this.proper = Math.floor(daysaftereaster / 7) + 1;
    } else if (t >= f("pentecost") && t < f("pentecost") + nextday) {
      this.season = "pentecost";
      this.proper = 0;
    } else if (t > f("pentecost") && t < f("trinity")) {
      this.season = "afterpentecost";
      const daysafterp =
        this.getDayOfYear(forday) - (this._fdoy("proper1") + 1);
      this.proper = Math.floor(daysafterp / 7) + 1;
    } else if (t >= f("trinity") && t < f("trinity") + nextday) {
      this.season = "trinity";
      this.proper = 0;
    } else if (t > f("trinity") && t < f("christking")) {
      this.season = "afterpentecost";
      const daysafterp =
        this.getDayOfYear(forday) - (this._fdoy("proper1") + 1);
      this.proper = Math.floor(daysafterp / 7) + 1;
    } else if (t >= f("christking") && t < f("christking") + nextday) {
      this.season = "christking";
      this.proper = 0;
    } else if (t > f("christking") && t < f("advent")) {
      this.season = "afterpentecost";
      const daysafterp =
        this.getDayOfYear(forday) - (this._fdoy("pentecost") + 1);
      this.proper = Math.floor(daysafterp / 7) + 1;
    } else if (t >= f("advent") && t < f("christmaseve")) {
      this.season = "advent";
      isnextlectyear = true;
      const daysaftera = this.getDayOfYear(forday) - this._fdoy("advent");
      this.proper = Math.floor(daysaftera / 7) + 1;
    } else if (t >= f("christmaseve") && t < f("christmas")) {
      this.season = "christmaseve";
      isnextlectyear = true;
      this.proper = 0;
    } else if (t >= f("christmas") && t < f("christmas") + nextday) {
      this.season = "christmasday";
      isnextlectyear = true;
      this.proper = 0;
    } else if (t > f("christmas")) {
      this.season = "christmas";
      isnextlectyear = true;
      this.proper = (t - f("christmas")) / nextday + 1;
    } else {
      this.proper = 0;
      this.season = "unknown";
      console.error("impossible day", this);
    }

    // set the lectionary year
    const years = ["C", "A", "B"];
    let y = forday.getFullYear();
    if (isnextlectyear) y = y + 1;
    this.year = years[y % 3];
  }

  get propername(): string {
    if (this.season == "beforeadvent") this.season = "afterpentecost";

    if (!this.season || !season.LUT.has(this.season)) {
      console.error("invalid season", this);
      return "unknown";
    }

    switch (this.season) {
      case "advent":
        return (
          this.cardToOrd(this.proper) +
          " " +
          this._weekdayDisplay() +
          " of Advent"
        );
      case "christmaseve":
        return "Christmas Eve";
      case "christmasday":
        return "Christmas";
      case "christmas":
        return this.cardToOrd(this.proper) + " day of Christmas";
      case "epiphany":
        return "Epiphany";
      case "baptismoflord":
        const day = 6 + this.proper;
        return "January " + day + " (after Epiphany)";
      case "afterepiphany":
        return (
          "Epiphany (ordinary) " + this.proper + ", " + this._weekdayDisplay()
        );
      case "ashwednesday":
        return "Ash Wednesday";
      case "lent":
        let p = this.proper;
        let prep = "of";
        if (this.weekday == 0) prep = "in";
        return (
          this.cardToOrd(p) +
          " " +
          this._weekdayDisplay() +
          " " +
          prep +
          " Lent"
        );
      case "palmsunday":
        return "Palm Sunday";
      case "holyweek":
        return this._weekdayDisplay() + " of Holy Week";
      case "maundythursday":
        return "Maundy Thursday";
      case "goodfriday":
        return "Good Friday";
      case "holysaturday":
        return "Holy Saturday";
      case "easter":
        return "Easter Sunday";
      case "greatfifty":
        return (
          this.cardToOrd(this.proper) +
          " " +
          this._weekdayDisplay() +
          " of Easter"
        );
      case "ascensioneve":
        return "Eve of the Ascension";
      case "ascension":
        return "The Feast of the Ascension";
      case "pentecosteve":
        return "Pentecost Eve";
      case "pentecost":
        return "Pentecost";
      case "afterpentecost":
        return (
          "Proper " +
          this.proper +
          "; after Pentecost, " +
          this._weekdayDisplay()
        );
      case "trinity":
        return "Trinity Sunday";
      case "christking":
        return "Christ the King Sunday";
    }

    console.error("invalid season", this);
    return "unknown";
  }

  // Convert cardinal number to friendly ordinal numbers for display (English)
  private cardToOrd(card: number) {
    const lut = new Map([
      [0, ""],
      [1, "First"],
      [2, "Second"],
      [3, "Third"],
      [4, "Fourth"],
      [5, "Fifth"],
      [6, "Sixth"],
      [7, "Seventh"],
      [8, "Eighth"],
      [9, "Ninth"],
      [10, "Tenth"],
      [11, "Eleventh"],
      [12, "Twelfth"],
      [21, "21st"],
      [22, "22nd"],
    ]);

    if (!lut.has(card)) {
      return card + "th";
    }
    return lut.get(card);
  }

  public static AllYear(lectionaryYear: string) {
    const ll = new Map();

    for (const [k, v] of season.LUT) {
      // broad exceptions go here
      if (v.name == "beforeadvent" || v.name == "Any") continue;

      const obj: any = { year: lectionaryYear, season: v.name };

      // one-day "season"
      if (v.maxProper == 0) {
        const p = new proper(obj);
        ll.set(p.propername, p);
        continue;
      }

      let i = 1;
      while (i <= v.maxProper) {
        // exceptions go here
        if (v.name == "christmas" && i == 1) {
          i = i + 1;
          continue;
        }

        obj.proper = i;

        if (v.useWeekdays) {
          // Most seasons start on Monday, except for lent, which counts from Wednesdays
          let d = v.startWeekday;
          if (v.name == "greatfifty" && i == 1) d = 1; // do not display Easter twice, otherwise greatfifty is normal
          if (v.name == "afterpentecost" && i == 1) d = 1; // do not display Pentecost twice, otherwise afterpentecost is normal

          while (d <= 6 + v.startWeekday) {
            // for seasons that END on a day other than Sunday (Ordinary after Epiphany)
            if (v.maxWeekday != 0 && i >= v.maxProper && d > v.maxWeekday)
              break;
            obj.weekday = d % 7;
            const p = new proper(obj);
            ll.set(p.propername, p);
            d = d + 1;
          }
        } else {
          const p = new proper(obj);
          ll.set(p.propername, p);
        }
        i = i + 1;
      }
    }
    return ll;
  }
}
