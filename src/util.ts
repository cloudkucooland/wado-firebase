// Audit these to make sure they are all used
export const locations = Array(
  "COMMENDATION",
  "COMPLINE-CHAPTER",
  "COMPLINE-CONCLUDING",
  "COMPLINE-HYMN",
  "COMPLINE-OPENING",
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
  "LAUDS-COLLECT-FINAL",
  "LAUDS-COLLECT1",
  "LAUDS-COLLECT2",
  "LAUDS-DISMISSAL",
  "LAUDS-GLORIA",
  "LAUDS-HYMN1",
  "LAUDS-HYMN2",
  "LAUDS-LECTIONARY",
  "LAUDS-LECTIONARY-HEARWHATSAYING",
  "LAUDS-LECTIONARY2",
  "LAUDS-OPENING",
  "LAUDS-PSALM",
  "LAUDS-PSALTER-ANTIPHON",
  "LAUDS-REMEMBRANCEBAPTISM",
  "LAUDS-SEASONAL",
  "LAUDS-SUPPLICATION",
  "MAGNIFICAT",
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
  "VESPER-CONFESSION",
  "VESPER-DISMISSAL",
  "VESPER-GLORIA",
  "VESPER-HEARWORD",
  "VESPER-HYMN",
  "VESPER-LECTIONARY",
  "VESPER-PARDON",
  "VESPER-PSALM",
  "VESPER-SUPPLICATION",
  "VESPERS-LIGHT",
  "VIGIL-ASSURANCE",
  "VIGIL-BENEDICTION",
  "VIGIL-BLESSING",
  "VIGIL-CANTICLE",
  "VIGIL-CANTICLE-RESURRECTION",
  "VIGIL-CANTICLE1",
  "VIGIL-CANTICLE2",
  "VIGIL-CANTICLE3",
  "VIGIL-COLLECT1",
  "VIGIL-DISMISSAL",
  "VIGIL-INTERCESSION",
  "VIGIL-LECTIONARY",
  "VIGIL-LIGHT",
  "VIGIL-PARDON"
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
  ["epiphany", "00"],
  ["afterepiphany", "01"],
  ["mardigras", "02"],
  ["ashwednesday", "03"],
  ["lent", "04"],
  ["palmsunday", "05"],
  ["holyweek", "06"],
  ["maundythursday", "07"],
  ["goodfriday", "08"],
  ["holysaturday", "09"],
  ["easter", "10"],
  ["greatfifty", "11"],
  ["ascensioneve", "12"],
  ["ascension", "13"],
  ["greatfifty", "14"],
  ["pentecosteve", "15"],
  ["pentecost", "16"],
  ["afterpentecost", "17"],
  ["trinity", "18"],
  ["afterpentecost", "19"],
  ["beforeadvent", "20"],
  ["christking", "21"],
  ["beforeadvent", "22"],
  ["advent", "23"],
  ["christmaseve", "24"],
  ["christmasday", "25"],
  ["christmas", "26"],
  ["Any", "99"],
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

export const classes = new Map([
  ["prayer", prayer],
  ["psalm", psalm],
  ["hymn", hymn],
  ["lection", lection],
  ["heartword", heartword],
]);

export function getClass(className: string) {
  if (!classes.has(className)) {
    console.log("invalid class", className);
    className = "prayer";
  }
  return classes.get(className);
}
