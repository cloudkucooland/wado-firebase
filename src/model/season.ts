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
        churchPos: 5,
        maxProper: 0,
        useWeekdays: false,
      }),
    ],
    [
      "christmasday",
      new season({
        name: "christmasday",
        churchPos: 10,
        maxProper: 0,
        useWeekdays: false,
      }),
    ],
    [
      "christmas",
      new season({
        name: "christmas",
        churchPos: 15,
        maxProper: 12,
        useWeekdays: false,
        properName: "Day of Christmas",
      }),
    ],
    [
      "epiphany",
      new season({
        name: "epiphany",
        churchPos: 20,
        maxProper: 0,
        useWeekdays: false,
      }),
    ],
    [
      "epi2bol",
      new season({
        name: "epi2bol",
        churchPos: 21,
        maxProper: 0,
        useWeekdays: true,
        comment: "Epiphany to Baptism of Lord: Jan 7 - 13(?)",
      }),
    ],
    [
      "baptismoflord",
      new season({
        name: "baptismoflord",
        churchPos: 25,
        maxProper: 0,
        useWeekdays: false,
        comment: "Same as Epiphany-1-Sunday",
      }),
    ],
    [
      "afterepiphany",
      new season({
        name: "afterepiphany",
        churchPos: 30,
        maxProper: 10,
        maxWeekday: 2,
        useWeekdays: true,
      }),
    ],
    [
      "mardigras",
      new season({
        name: "mardigras",
        churchPos: 35,
        maxProper: 0,
        useWeekdays: false,
      }),
    ],
    [
      "ashwednesday",
      new season({
        name: "ashwednesday",
        churchPos: 40,
        maxProper: 0,
        useWeekdays: false,
      }),
    ],
    [
      "lent",
      new season({
        name: "lent",
        churchPos: 45,
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
        churchPos: 50,
        maxProper: 0,
        useWeekdays: false,
      }),
    ],
    [
      "holyweek",
      new season({
        name: "holyweek",
        churchPos: 55,
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
        churchPos: 60,
        maxProper: 0,
        useWeekdays: false,
      }),
    ],
    [
      "goodfriday",
      new season({
        name: "goodfriday",
        churchPos: 65,
        maxProper: 0,
        useWeekdays: false,
      }),
    ],
    [
      "holysaturday",
      new season({
        name: "holysaturday",
        churchPos: 70,
        maxProper: 0,
        useWeekdays: false,
      }),
    ],
    [
      "easter",
      new season({
        name: "easter",
        churchPos: 75,
        maxProper: 0,
        useWeekdays: false,
      }),
    ],
    [
      "greatfifty",
      new season({
        name: "greatfifty",
        churchPos: 80,
        maxProper: 6,
        useWeekdays: true,
        maxWeekday: 2,
        comment: "ends on Tuesday Wednesday, Ascension Eve",
      }),
    ],
    [
      "ascensioneve",
      new season({
        name: "ascensioneve",
        churchPos: 85,
        maxProper: 0,
        useWeekdays: false,
      }),
    ],
    [
      "ascension",
      new season({
        name: "ascension",
        churchPos: 90,
        maxProper: 0,
        useWeekdays: false,
      }),
    ],
    [
      "postascension",
      new season({
        name: "postascension",
        churchPos: 92,
        maxProper: 7,
        startWeekday: 5,
        maxWeekday: 5,
        useWeekdays: true,
        comment: "AKA 7th week of Easter, end of great 50",
      }),
    ],
    [
      "pentecosteve",
      new season({
        name: "pentecosteve",
        churchPos: 95,
        maxProper: 0,
        useWeekdays: false,
      }),
    ],
    [
      "pentecost",
      new season({
        name: "pentecost",
        churchPos: 100,
        maxProper: 0,
        useWeekdays: true,
      }),
    ],
    [
      "trinity",
      new season({
        name: "trinity",
        churchPos: 110,
        maxProper: 0,
        useWeekdays: true,
      }),
    ],
    [
      "afterpentecost",
      new season({
        name: "afterpentecost",
        churchPos: 200,
        maxProper: 15,
        useWeekdays: true,
      }),
    ],
    [
      "beforeadvent",
      new season({
        name: "beforeadvent",
        churchPos: 210,
        maxProper: 11,
        useWeekdays: true,
      }),
    ],
    [
      "christking",
      new season({
        name: "christking",
        churchPos: 250,
        maxProper: 0,
        useWeekdays: true,
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
