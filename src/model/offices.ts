import Lauds from "../components/Lauds.svelte";
import Terce from "../components/Terce.svelte";
import Sext from "../components/Sext.svelte";
import None from "../components/None.svelte";
import Vespers from "../components/Vespers.svelte";
import Compline from "../components/Compline.svelte";
import Vigil from "../components/Vigil.svelte";
import Matins from "../components/Matins.svelte";
import TestOffice from "../components/TestOffice.svelte";

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
