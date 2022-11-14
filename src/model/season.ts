export default class season {
  public name: string;
  public position: number;
  public maxProper: number;
  public useWeekdays: boolean;
  public color: string;

  public constructor(obj: any) {
    this.name = obj.name;
    this.position = obj.position;
    this.maxProper = obj.maxProper;
    this.useWeekdays = obj.useWeekdays;
    this.color = obj.color;
  }
}
