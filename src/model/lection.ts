export default class Lection {
  id: number;
  name: string;

  constructor(obj: any) {
    this.id = Number(obj.id);
    this.name = obj.name;
  }

  toJSON() {
    return {
      id: Number(this.id),
      name: `${this.name}`,
    };
  }
}
