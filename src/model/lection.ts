export default class lection {
  morning?: string;
  evening?: string;
  morningpsalm?: string;
  eveningpsalm?: string;
  morningtitle?: string;
  eveningtitle?: string;
  _morning?: string;
  _evening?: string;
  _morningpsalmref?: string;
  _eveningpsalmref?: string;

  public constructor(obj: any) {
    if (obj.morning) this.morning = obj.morning;
    if (obj.evening) this.evening = obj.evening;
    if (obj.morningpsalm) this.morningpsalm = obj.morningpsalm;
    if (obj.eveningpsalm) this.eveningpsalm = obj.eveningpsalm;
    if (obj.morningtitle) this.morningtitle = obj.morningpsalm;
    if (obj.eveningtitle) this.eveningtitle = obj.eveningtitle;
    if (obj._morning) this._morning = obj._morning;
    if (obj._evening) this._evening = obj._evening;
    if (obj._morningpsalmref) this._morningpsalmref = obj._morningpsalmref;
    if (obj._eveningpsalmref) this._eveningpsalmref = obj._eveningpsalmref;
  }
}
