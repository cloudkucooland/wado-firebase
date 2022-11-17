export default class season {
  public name: string;
  public position: number;
  public maxProper: number;
  public properName: string;
  public useWeekdays: boolean;
  public color: string;

  public constructor(obj: any) {
    this.name = obj.name;
    this.position = obj.position;
    this.maxProper = obj.maxProper;
    this.properName = obj.properName;
    this.useWeekdays = obj.useWeekdays;
    this.color = obj.color;
  }

  public static LUT = new Map([
    [
      "epiphany",
      new season({
        name: "epiphany",
        position: "00",
        maxProper: 0,
        useWeekdays: false,
        color: "white",
      }),
    ],
    [
      "afterepiphany",
      new season({
        name: "afterepiphany",
        position: "01",
        maxProper: 10,
        useWeekdays: true,
        properName: "week of epiphany",
        color: "green",
      }),
    ],
    [
      "mardigras",
      new season({
        name: "mardigras",
        position: "02",
        maxProper: 0,
        useWeekdays: false,
        color: "yellow",
      }),
    ],
    [
      "ashwednesday",
      new season({
        name: "ashwednesday",
        position: "03",
        maxProper: 0,
        useWeekdays: false,
        color: "black",
      }),
    ],
    [
      "lent",
      new season({
        name: "lent",
        position: "04",
        maxProper: 6,
        useWeekdays: true,
        properName: "week of lent",
        color: "purple",
      }),
    ],
    [
      "palmsunday",
      new season({
        name: "palmsunday",
        position: "05",
        maxProper: 0,
        useWeekdays: false,
        color: "white",
      }),
    ],
    [
      "holyweek",
      new season({
        name: "holyweek",
        position: "06",
        maxProper: 0,
        useWeekdays: true,
        color: "white",
      }),
    ],
    [
      "maundythursday",
      new season({
        name: "maundythursday",
        position: "07",
        maxProper: 0,
        useWeekdays: false,
        color: "white",
      }),
    ],
    [
      "goodfriday",
      new season({
        name: "goodfriday",
        position: "08",
        maxProper: 0,
        useWeekdays: false,
        color: "white",
      }),
    ],
    [
      "holysaturday",
      new season({
        name: "holysaturday",
        position: "09",
        maxProper: 0,
        useWeekdays: false,
        color: "white",
      }),
    ],
    [
      "easter",
      new season({
        name: "easter",
        position: "10",
        maxProper: 0,
        useWeekdays: false,
        color: "white",
      }),
    ],
    [
      "greatfifty",
      new season({
        name: "greatfifty",
        position: "11",
        maxProper: 7,
        properName: "week after easter",
        useWeekdays: true,
        color: "white",
      }),
    ],
    [
      "ascensioneve",
      new season({
        name: "ascensioneve",
        position: "12",
        maxProper: 0,
        useWeekdays: false,
        color: "white",
      }),
    ],
    [
      "ascension",
      new season({
        name: "ascension",
        position: "13",
        maxProper: 0,
        useWeekdays: false,
        color: "white",
      }),
    ],
    [
      "pentecosteve",
      new season({
        name: "pentecosteve",
        position: "15",
        maxProper: 0,
        useWeekdays: false,
        color: "white",
      }),
    ],
    [
      "pentecost",
      new season({
        name: "pentecost",
        position: "16",
        maxProper: 0,
        useWeekdays: false,
        color: "red",
      }),
    ],
    [
      "afterpentecost",
      new season({
        name: "afterpentecost",
        position: "17",
        maxProper: 30,
        properName: "week after pentecost",
        useWeekdays: true,
        color: "red",
      }),
    ],
    [
      "trinity",
      new season({
        name: "trinity",
        position: "18",
        maxProper: 0,
        useWeekdays: false,
        color: "white",
      }),
    ],
    [
      "beforeadvent",
      new season({
        name: "beforeadvent",
        position: "20",
        maxProper: 36,
        properName: "week after pentecost",
        useWeekdays: true,
        color: "green",
      }),
    ],
    [
      "christking",
      new season({
        name: "christking",
        position: "21",
        maxProper: 0,
        useWeekdays: false,
        color: "white",
      }),
    ],
    [
      "advent",
      new season({
        name: "advent",
        position: "23",
        maxProper: 5,
        properName: "week of advent",
        useWeekdays: true,
        color: "purple",
      }),
    ],
    [
      "christmaseve",
      new season({
        name: "christmaseve",
        position: "24",
        maxProper: 0,
        useWeekdays: false,
        color: "purple",
      }),
    ],
    [
      "christmasday",
      new season({
        name: "christmasday",
        position: "25",
        maxProper: 0,
        useWeekdays: false,
        color: "white",
      }),
    ],
    [
      "christmas",
      new season({
        name: "christmas",
        position: "26",
        maxProper: 12,
        properName: "day of Christmas",
        useWeekdays: false,
        color: "white",
      }),
    ],
    [
      "Any",
      new season({
        name: "Any",
        position: "99",
        maxProper: 0,
        useWeekdays: true,
        color: "green",
      }),
    ],
  ]);
}
