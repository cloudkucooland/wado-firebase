export default class season {
  public name: string;
  public churchPos: number;
  public maxProper: number;
  public useWeekdays: boolean;
  public startWeekday: number;
  public maxWeekday: number;
  public desc: string;
  public color: string;

  public constructor(obj: any) {
    this.name = obj.name;
    this.churchPos = obj.churchPos;
    this.maxProper = obj.maxProper;
    this.useWeekdays = obj.useWeekdays;
    this.startWeekday = obj.startWeekday ? obj.startWeekday : 0;
    this.maxWeekday = obj.maxWeekday ? obj.maxWeekday : 0;
    this.desc = obj.desc ? obj.desc : "";
    this.color = obj.color;
  }

  public static LUT = new Map([
    [
      "advent",
      new season({
        name: "advent",
        churchPos: 0,
        maxProper: 4,
        useWeekdays: true,
        color: "purple",
      }),
    ],
    [
      "christmaseve",
      new season({
        name: "christmaseve",
        churchPos: 1,
        maxProper: 0,
        useWeekdays: false,
        color: "purple",
      }),
    ],
    [
      "christmasday",
      new season({
        name: "christmasday",
        churchPos: 2,
        maxProper: 0,
        useWeekdays: false,
        color: "white",
      }),
    ],
    [
      "christmas",
      new season({
        name: "christmas",
        churchPos: 3,
        maxProper: 12,
        useWeekdays: false,
        color: "white",
      }),
    ],
    [
      "epiphany",
      new season({
        name: "epiphany",
        churchPos: 5,
        maxProper: 0,
        useWeekdays: false,
        color: "white",
      }),
    ],
    [
      "baptismoflord",
      new season({
        name: "baptismoflord",
        churchPos: 6,
        maxProper: 6,
        useWeekdays: false,
        color: "white",
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
        color: "green",
      }),
    ],
    [
      "mardigras",
      new season({
        name: "mardigras",
        churchPos: 8,
        maxProper: 0,
        useWeekdays: false,
        color: "purple",
      }),
    ],
    [
      "ashwednesday",
      new season({
        name: "ashwednesday",
        churchPos: 9,
        maxProper: 0,
        useWeekdays: false,
        color: "black",
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
        color: "purple",
      }),
    ],
    [
      "palmsunday",
      new season({
        name: "palmsunday",
        churchPos: 11,
        maxProper: 0,
        useWeekdays: false,
        color: "white",
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
        color: "white",
      }),
    ],
    [
      "maundythursday",
      new season({
        name: "maundythursday",
        churchPos: 13,
        maxProper: 0,
        useWeekdays: false,
        color: "white",
      }),
    ],
    [
      "goodfriday",
      new season({
        name: "goodfriday",
        churchPos: 14,
        maxProper: 0,
        useWeekdays: false,
        color: "white",
      }),
    ],
    [
      "holysaturday",
      new season({
        name: "holysaturday",
        churchPos: 15,
        maxProper: 0,
        useWeekdays: false,
        color: "white",
      }),
    ],
    [
      "easter",
      new season({
        name: "easter",
        churchPos: 16,
        maxProper: 0,
        useWeekdays: false,
        color: "white",
      }),
    ],
    [
      "greatfifty",
      new season({
        name: "greatfifty",
        churchPos: 17,
        maxProper: 7,
        useWeekdays: true,
        color: "white",
      }),
    ],
    [
      "ascensioneve",
      new season({
        name: "ascensioneve",
        churchPos: 18,
        maxProper: 0,
        useWeekdays: false,
        color: "white",
      }),
    ],
    [
      "ascension",
      new season({
        name: "ascension",
        churchPos: 19,
        maxProper: 0,
        useWeekdays: false,
        color: "white",
      }),
    ],
    [
      "pentecosteve",
      new season({
        name: "pentecosteve",
        churchPos: 20,
        maxProper: 0,
        useWeekdays: false,
        color: "white",
      }),
    ],
    [
      "pentecost",
      new season({
        name: "pentecost",
        churchPos: 21,
        maxProper: 0,
        useWeekdays: false,
        color: "red",
      }),
    ],
    [
      "afterpentecost",
      new season({
        name: "afterpentecost",
        churchPos: 22,
        maxProper: 25,
        useWeekdays: true,
        color: "red",
      }),
    ],
    [
      "trinity",
      new season({
        name: "trinity",
        churchPos: 23,
        maxProper: 0,
        useWeekdays: false,
        color: "white",
      }),
    ],
    [
      "christking",
      new season({
        name: "christking",
        churchPos: 24,
        maxProper: 0,
        useWeekdays: false,
        color: "white",
      }),
    ],
    [
      "Any",
      new season({
        name: "Any",
        churchPos: 256,
        maxProper: 0,
        useWeekdays: true,
        color: "green",
      }),
    ],
  ]);
}
