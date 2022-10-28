export default class association {
  id: string;
  name: string;
  weight: number;
  season: string;
  proper: number;
  week: number;
  prayer: string;
  reference: any;

  constructor(obj: any) {
    this.id = obj.id;
    const d = obj.data();

    this.name = d.Name;
    this.season = d.Season;
    this.week = d.Week;
    this.proper = d.Proper;
    this.weight = d.Weight;
    this.reference = d.Reference;
  }
}
