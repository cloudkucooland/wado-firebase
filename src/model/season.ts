export default class season {
  public name: string;
  public churchPos: number;
  public maxProper: number;
  public useWeekdays: boolean;
  public startWeekday: number;
  public maxWeekday: number;
  public desc: string;
  public properName: string;

  public constructor(obj: any) {
    this.name = obj.name;
    this.churchPos = obj.churchPos;
    this.maxProper = obj.maxProper;
    this.useWeekdays = obj.useWeekdays;
    this.startWeekday = obj.startWeekday ? obj.startWeekday : 0;
    this.maxWeekday = obj.maxWeekday ? obj.maxWeekday : 0;
    this.desc = obj.desc ? obj.desc : "";
    this.properName = obj.properName ? obj.properName : "Proper";
  }

  public static LUT = new Map([
    [
      "advent",
      new season({
        name: "advent",
        churchPos: 0,
        maxProper: 4,
        useWeekdays: true,
      }),
    ],
    [
      "christmaseve",
      new season({
        name: "christmaseve",
        churchPos: 1,
        maxProper: 0,
        useWeekdays: false,
      }),
    ],
    [
      "christmasday",
      new season({
        name: "christmasday",
        churchPos: 2,
        maxProper: 0,
        useWeekdays: false,
      }),
    ],
    [
      "christmas",
      new season({
        name: "christmas",
        churchPos: 3,
        maxProper: 12,
        useWeekdays: false,
        properName: "Day of Christmas",
      }),
    ],
    [
      "epiphany",
      new season({
        name: "epiphany",
        churchPos: 5,
        maxProper: 0,
        useWeekdays: false,
      }),
    ],
    [
      "baptismoflord",
      new season({
        name: "baptismoflord",
        churchPos: 6,
        maxProper: 6,
        useWeekdays: false,
        comment: "Jan 7 to Epiphany-1-Sunday",
      }),
    ],
    [
      "afterepiphany",
      new season({
        name: "afterepiphany",
        churchPos: 7,
        maxProper: 10,
        maxWeekday: 2,
        useWeekdays: true,
      }),
    ],
    [
      "mardigras",
      new season({
        name: "mardigras",
        churchPos: 8,
        maxProper: 0,
        useWeekdays: false,
      }),
    ],
    [
      "ashwednesday",
      new season({
        name: "ashwednesday",
        churchPos: 9,
        maxProper: 0,
        useWeekdays: false,
      }),
    ],
    [
      "lent",
      new season({
        name: "lent",
        churchPos: 10,
        maxProper: 6,
        useWeekdays: true,
        startWeekday: 4,
        maxWeekday: 6,
      }),
    ],
    [
      "palmsunday",
      new season({
        name: "palmsunday",
        churchPos: 11,
        maxProper: 0,
        useWeekdays: false,
      }),
    ],
    [
      "holyweek",
      new season({
        name: "holyweek",
        churchPos: 12,
        maxProper: 1,
        useWeekdays: true,
        startWeekday: 1,
        maxWeekday: 3,
      }),
    ],
    [
      "maundythursday",
      new season({
        name: "maundythursday",
        churchPos: 13,
        maxProper: 0,
        useWeekdays: false,
      }),
    ],
    [
      "goodfriday",
      new season({
        name: "goodfriday",
        churchPos: 14,
        maxProper: 0,
        useWeekdays: false,
      }),
    ],
    [
      "holysaturday",
      new season({
        name: "holysaturday",
        churchPos: 15,
        maxProper: 0,
        useWeekdays: false,
      }),
    ],
    [
      "easter",
      new season({
        name: "easter",
        churchPos: 16,
        maxProper: 0,
        useWeekdays: false,
      }),
    ],
    [
      "greatfifty",
      new season({
        name: "greatfifty",
        churchPos: 17,
        maxProper: 7,
        useWeekdays: true,
      }),
    ],
    [
      "ascensioneve",
      new season({
        name: "ascensioneve",
        churchPos: 18,
        maxProper: 0,
        useWeekdays: false,
      }),
    ],
    [
      "ascension",
      new season({
        name: "ascension",
        churchPos: 19,
        maxProper: 0,
        useWeekdays: false,
      }),
    ],
    [
      "pentecosteve",
      new season({
        name: "pentecosteve",
        churchPos: 20,
        maxProper: 0,
        useWeekdays: false,
      }),
    ],
    [
      "pentecost",
      new season({
        name: "pentecost",
        churchPos: 21,
        maxProper: 0,
        useWeekdays: false,
      }),
    ],
    [
      "afterpentecost",
      new season({
        name: "afterpentecost",
        churchPos: 22,
        maxProper: 25,
        useWeekdays: true,
      }),
    ],
    [
      "trinity",
      new season({
        name: "trinity",
        churchPos: 23,
        maxProper: 0,
        useWeekdays: false,
      }),
    ],
    [
      "christking",
      new season({
        name: "christking",
        churchPos: 24,
        maxProper: 0,
        useWeekdays: false,
      }),
    ],
    [
      "Any",
      new season({
        name: "Any",
        churchPos: 256,
        maxProper: 0,
        useWeekdays: true,
      }),
    ],
  ]);
}
