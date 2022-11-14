export default class season {
  public name: string;
  public position: number;
  public maxProper: number;
  public properName: string;
  public useWeekdays: boolean;
  public color: string;

  public constructor(obj: any) {
    this.name = obj.name;
    this.position = obj.position;
    this.maxProper = obj.maxProper;
    this.properName = obj.properName;
    this.useWeekdays = obj.useWeekdays;
    this.color = obj.color;
  }
}
