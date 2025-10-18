export default class lection {
	public morning?: string | null;
	public evening?: string | null;
	public morningpsalm?: string | null;
	public eveningpsalm?: string | null;
	public morningtitle?: string | null;
	public eveningtitle?: string | null;
	public _morning?: string | null;
	public _evening?: string | null;
	public _morningpsalmref?: string | null; // should be a firestore DocumentReference
	public _eveningpsalmref?: string | null; // should be a firestore DocumentReference
	public path?: string | null; // used in lection list, do not store

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
