import type { DocumentReference } from "firebase/firestore";

export interface prayerFromFirestore {
  Name: string;
  Body: string;
  Author?: string;
  Reviewed?: boolean;
  License?: boolean;
  "Last Editor"?: string;
  "Last Edited"?: string;
  Class?: string;
  Media?: string;
  "Hymn Tune"?: string;
  "Hymn Meter"?: string;
  Rubric?: string;
  Antiphon?: DocumentReference;
  Collect?: string;
}

export interface associationFromFirestore {
  Location: string;
  Season: string;
  Proper: number;
  Weekday: number;
  Year: string;
  Weight: number;
  Year: string;
  CalendarDate?: string;
  Reference: DocumentReference;
}
