import type { prayerFromFirestore } from "./types";
import prayer from "./prayer";
export default class psalm extends prayer {
  rubric: string;
  constructor(obj: prayerFromFirestore);
  toFirebase(): {
    Name: string;
    Body: string;
    Author: string;
    Reviewed: boolean;
    License: boolean;
    "Last Editor": string;
    "Last Edited": string;
    Media: string;
    Class: string;
    Rubric: string;
  };
}
