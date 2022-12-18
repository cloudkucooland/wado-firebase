export default class season {
  name: string;
  churchPos: number;
  maxProper: number;
  useWeekdays: boolean;
  startWeekday: number;
  maxWeekday: number;
  desc: string;
  color: string;
  properName: string;
  constructor(obj: any);
  static LUT: Map<string, season>;
}
