import type { lectionFromFirestore } from './types';

export default class lection {
	public morning: string;
	public evening: string;
	public morningpsalm: string;
	public eveningpsalm: string;
	public morningtitle: string;
	public eveningtitle: string;
	public _morning: string;
	public _evening: string;
	public _morningpsalmref: string | null; // Document ID string
	public _eveningpsalmref: string | null; // Document ID string
	public path: string | null; // used in lection list, do not store

	public constructor(obj: lectionFromFirestore) {
		this.morning = obj.morning || '';
		this.evening = obj.evening || '';
		this.morningpsalm = obj.morningpsalm || '';
		this.eveningpsalm = obj.eveningpsalm || '';
		this.morningtitle = obj.morningtitle || '';
		this.eveningtitle = obj.eveningtitle || '';
		this._morning = obj._morning || '';
		this._evening = obj._evening || '';
		this._morningpsalmref = obj._morningpsalmref || null;
		this._eveningpsalmref = obj._eveningpsalmref || null;
		this.path = null;
	}
}
