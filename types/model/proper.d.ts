export default class proper {
  caldate: string;
  proper: number;
  season: string;
  weekday: number;
  year: string;
  private _feasts;
  constructor(inObj: {
    caldate?: string;
    proper?: number;
    season?: string;
    weekday?: number;
    year?: string;
  });
  static fromDate(simple: string): proper;
  private _weekdayDisplay;
  private _addDays;
  private _setFeasts;
  private getEaster;
  private getDayOfYear;
  private _fdoy;
  private _getSeason;
  get propername(): string;
  private cardToOrd;
  static AllYear(lectionaryYear: string): Map<string, proper>;
  private _months;
}
