export default class association {
  id: string;
  CalendarDate: string;
  Location: string;
  Proper: number;
  Season: string;
  Weekday: number;
  Weight: number;
  Year: string;
  Reference: any;
  private _dirty;
  private _season;
  constructor(obj: any);
  toFirebase(): {
    CalendarDate: string;
    Location: string;
    Proper: number;
    Season: string;
    Weekday: number;
    Weight: number;
    Year: string;
    Reference: any;
  };
  get WeekdayDisplay(): string;
  get ProperDisplay(): number | "Any";
  get ReferenceDisplay(): any;
  static sort(a: association, b: association): number;
  get dirty(): boolean;
  get dirtyStyle(): "dirty" | "clean";
  static locations: string[];
}
