import Lauds from "../components/offices/Lauds.svelte";
export declare const offices: string[];
export declare function getOffice(officeName: string): typeof Lauds;
export declare function currentOffice():
  | "Lauds"
  | "Terce"
  | "Sext"
  | "None"
  | "Vespers"
  | "Compline";
export declare function getCurrentOffice(): typeof Lauds;
