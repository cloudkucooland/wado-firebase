export default class season {
  public name: string;
  public julianPos: number;
  public churchPos: number;
  public maxProper: number;
  public useWeekdays: boolean;
  public color: string;

  public constructor(obj: any) {
    this.name = obj.name;
    this.julianPos = obj.julianPos;
    this.churchPos = obj.churchPos;
    this.maxProper = obj.maxProper;
    this.useWeekdays = obj.useWeekdays;
    this.color = obj.color;
  }

  public static LUT = new Map([
    [
      "advent",
      new season({
        name: "advent",
        julianPos: 23,
        churchPos: 0,
        maxProper: 5,
        useWeekdays: true,
        color: "purple",
      }),
    ],
    [
      "christmaseve",
      new season({
        name: "christmaseve",
        julianPos: 24,
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
        julianPos: 25,
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
        julianPos: 26,
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
        julianPos: 0,
        churchPos: 5,
        maxProper: 0,
        useWeekdays: false,
        color: "white",
      }),
    ],
    [
      "afterepiphany",
      new season({
        name: "afterepiphany",
        julianPos: 1,
        churchPos: 6,
        maxProper: 10,
        useWeekdays: true,
        color: "green",
      }),
    ],
    [
      "mardigras",
      new season({
        name: "mardigras",
        julianPos: 2,
        churchPos: 7,
        maxProper: 0,
        useWeekdays: false,
        color: "yellow",
      }),
    ],
    [
      "ashwednesday",
      new season({
        name: "ashwednesday",
        julianPos: 3,
        churchPos: 8,
        maxProper: 0,
        useWeekdays: false,
        color: "black",
      }),
    ],
    [
      "lent",
      new season({
        name: "lent",
        julianPos: 4,
        churchPos: 9,
        maxProper: 6,
        useWeekdays: true,
        color: "purple",
      }),
    ],
    [
      "palmsunday",
      new season({
        name: "palmsunday",
        julianPos: 5,
        churchPos: 10,
        maxProper: 0,
        useWeekdays: false,
        color: "white",
      }),
    ],
    [
      "holyweek",
      new season({
        name: "holyweek",
        julianPos: 6,
        churchPos: 11,
        maxProper: 0,
        useWeekdays: true,
        color: "white",
      }),
    ],
    [
      "maundythursday",
      new season({
        name: "maundythursday",
        julianPos: 7,
        churchPos: 12,
        maxProper: 0,
        useWeekdays: false,
        color: "white",
      }),
    ],
    [
      "goodfriday",
      new season({
        name: "goodfriday",
        julianPos: 8,
        churchPos: 13,
        maxProper: 0,
        useWeekdays: false,
        color: "white",
      }),
    ],
    [
      "holysaturday",
      new season({
        name: "holysaturday",
        julianPos: 9,
        churchPos: 14,
        maxProper: 0,
        useWeekdays: false,
        color: "white",
      }),
    ],
    [
      "easter",
      new season({
        name: "easter",
        julianPos: 10,
        churchPos: 15,
        maxProper: 0,
        useWeekdays: false,
        color: "white",
      }),
    ],
    [
      "greatfifty",
      new season({
        name: "greatfifty",
        julianPos: 11,
        churhcPos: 16,
        maxProper: 7,
        useWeekdays: true,
        color: "white",
      }),
    ],
    [
      "ascensioneve",
      new season({
        name: "ascensioneve",
        julianPos: 12,
        churchPos: 17,
        maxProper: 0,
        useWeekdays: false,
        color: "white",
      }),
    ],
    [
      "ascension",
      new season({
        name: "ascension",
        julianPos: 13,
        churchPos: 18,
        maxProper: 0,
        useWeekdays: false,
        color: "white",
      }),
    ],
    [
      "pentecosteve",
      new season({
        name: "pentecosteve",
        julianPos: 15,
        churchPos: 19,
        maxProper: 0,
        useWeekdays: false,
        color: "white",
      }),
    ],
    [
      "pentecost",
      new season({
        name: "pentecost",
        julianPos: 16,
        churchPos: 20,
        maxProper: 0,
        useWeekdays: false,
        color: "red",
      }),
    ],
    [
      "afterpentecost",
      new season({
        name: "afterpentecost",
        julianPos: 17,
        churchPos: 21,
        maxProper: 25,
        useWeekdays: true,
        color: "red",
      }),
    ],
    [
      "trinity",
      new season({
        name: "trinity",
        julianPos: 18,
        churchPos: 21,
        maxProper: 0,
        useWeekdays: false,
        color: "white",
      }),
    ],
    [
      "beforeadvent",
      new season({
        name: "beforeadvent",
        julianPos: 20,
        churchPos: 22,
        maxProper: 36,
        useWeekdays: true,
        color: "green",
      }),
    ],
    [
      "christking",
      new season({
        name: "christking",
        julianPos: 21,
        churchPos: 23,
        maxProper: 0,
        useWeekdays: false,
        color: "white",
      }),
    ],
    [
      "Any",
      new season({
        name: "Any",
        julianPos: 99,
        churchPos: 4,
        maxProper: 0,
        useWeekdays: true,
        color: "green",
      }),
    ],
  ]);
}
