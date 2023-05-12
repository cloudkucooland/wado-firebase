export default class lection {
  morning?: string;
  evening?: string;
  morningpsalm?: string;
  eveningpsalm?: string;
  morningtitle?: string;
  eveningtitle?: string;
  _morning?: string;
  _evening?: string;
  _morningpsalmref?: string; // should be a firestore DocumentReference
  _eveningpsalmref?: string; // should be a firestore DocumentReference

  public constructor(obj: any) {
    if (obj.morning) this.morning = obj.morning;
    if (obj.evening) this.evening = obj.evening;
    if (obj.morningpsalm) this.morningpsalm = obj.morningpsalm;
    if (obj.eveningpsalm) this.eveningpsalm = obj.eveningpsalm;
    if (obj.morningtitle) this.morningtitle = obj.morningtitle;
    if (obj.eveningtitle) this.eveningtitle = obj.eveningtitle;
    if (obj._morning) this._morning = obj._morning;
    if (obj._evening) this._evening = obj._evening;
    if (obj._morningpsalmref) this._morningpsalmref = obj._morningpsalmref;
    if (obj._eveningpsalmref) this._eveningpsalmref = obj._eveningpsalmref;
  }
}
