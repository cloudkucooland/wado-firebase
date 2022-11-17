import Lauds from "../components/offices/Lauds.svelte";
import Terce from "../components/offices/Terce.svelte";
import Sext from "../components/offices/Sext.svelte";
import None from "../components/offices/None.svelte";
import Vespers from "../components/offices/Vespers.svelte";
import Compline from "../components/offices/Compline.svelte";
import Vigil from "../components/offices/Vigil.svelte";
import Matins from "../components/offices/Matins.svelte";
import TestOffice from "../components/offices/TestOffice.svelte";

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
