import prayer from "./prayer";
export default class hymn extends prayer {
  hymntune: string;
  hymnmeter: string;
  constructor(obj: any);
  toFirebase(): {
    Name: string;
    Body: string;
    Reviewed: boolean;
    License: boolean;
    Author: string;
    "Last Editor": string;
    "Last Edited": string;
    "Hymn Meter": string;
    "Hymn Tune": string;
    Media: string;
    Class: string;
  };
}
