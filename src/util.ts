import season from "./model/season";

// Audit these to make sure they are all used
export const locations = Array(
  "COMMENDATION",
  "COMPILNE-CONFESSION",
  "COMPLINE-CHAPTER",
  "COMPLINE-CONCLUDING",
  "COMPLINE-HYMN",
  "COMPLINE-OPENING",
  "COMPLINE-OPENING-HYMN",
  "COMPLINE-PRAYER",
  "COMPLINE-PSALTER",
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
  "LAUDS-LECTIONARY",
  "LAUDS-LECTIONARY2",
  "LAUDS-LECTIONARY-HEARWHATSAYING",
  "LAUDS-OPENING",
  "LAUDS-PSALM",
  "LAUDS-PSALTER-ANTIPHON",
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
  "VESPER-ANTIPHON",
  "VESPER-BENEDICTION",
  "VESPER-COLLECT1",
  "VESPER-COLLECT2",
  "VESPER-COLLECT3",
  "VESPER-COMMEMORATION",
  "VESPER-CONFESSION",
  "VESPER-DISMISSAL",
  "VESPER-GLORIA",
  "VESPER-HEARWORD",
  "VESPER-HYMN",
  "VESPER-LECTIONARY",
  "VESPER-PARDON",
  "VESPER-PSALM",
  "VESPERS-LIGHT",
  "VESPER-SUPPLICATION"
);

export const seasons = new Array(
  "epiphany",
  "afterepiphany",
  "mardigras",
  "ashwednesday",
  "lent",
  "palmsunday",
  "holyweek",
  "maundythursday",
  "goodfriday",
  "holysaturday",
  "easter",
  "greatfifty",
  "ascensioneve",
  "ascension",
  "greatfifty",
  "pentecost",
  "afterpentecost",
  "trinity",
  "afterpentecost",
  "beforeadvent",
  "christking",
  "beforeadvent",
  "advent",
  "christmaseve",
  "christmasday",
  "christmas"
);

export const seasonLUT = new Map([
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

import Lauds from "./components/Lauds.svelte";
import Terce from "./components/Terce.svelte";
import Sext from "./components/Sext.svelte";
import None from "./components/None.svelte";
import Vespers from "./components/Vespers.svelte";
import Compline from "./components/Compline.svelte";
import Vigil from "./components/Vigil.svelte";
import Matins from "./components/Matins.svelte";
import TestOffice from "./components/TestOffice.svelte";

// Lookup table of office-name to component...
const officeLUT = new Map([
  ["Lauds", Lauds],
  ["Terce", Terce],
  ["Sext", Sext],
  ["None", None],
  ["Vespers", Vespers],
  ["Compline", Compline],
  ["Vigil", Vigil],
  ["Matins", Matins],
  ["TestOffice", TestOffice],
]);

// leave the unfinished/test ones out - for building menus, etc
export const offices = new Array(
  "Lauds",
  "Terce",
  "Sext",
  "None",
  "Vespers",
  "Compline"
);

export function getOffice(officeName: string) {
  return officeLUT.get(officeName);
}

import prayer from "./model/prayer";
import psalm from "./model/psalm";
import hymn from "./model/hymn";
import lection from "./model/lection";
import heartword from "./model/heartword";
import antiphon from "./model/antiphon";

export const classes = new Map([
  ["prayer", prayer],
  ["psalm", psalm],
  ["hymn", hymn],
  ["lection", lection],
  ["heartword", heartword],
  ["antiphon", antiphon],
]);

export function getClass(className: string) {
  if (!classes.has(className)) {
    console.log("invalid class", className);
    className = "prayer";
  }
  return classes.get(className);
}
